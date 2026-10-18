# Dependency updater validation for the native host and POSIX test environment.
# The Makefile owns version injection and helper staging.
#requires -Version 7.0
$ErrorActionPreference = 'Stop'
$repository = Split-Path $PSScriptRoot -Parent
Push-Location $repository
try {
    if (-not $IsWindows) {
        & make build
        if ($LASTEXITCODE -ne 0) { throw 'Native build failed' }
        & make test-unit
        if ($LASTEXITCODE -ne 0) { throw 'Unit tests failed' }
    } else {
        $make = (Get-Command mingw32-make.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
        $shell = Join-Path $env:ProgramFiles 'Git/bin/bash.exe'
        $shellArgument = 'SHELL=' + $shell.Replace('\','/')
        $previousModuleCache = $env:GOMODCACHE
        $previousWslEnvironment = $env:WSLENV
        $goPath = ((& go env GOPATH).Trim() -split [IO.Path]::PathSeparator)[0]
        $env:GOMODCACHE = Join-Path $goPath 'pkg/mod'
        $env:WSLENV = ((@($env:WSLENV -split ':' | Where-Object { $_ -and $_ -notmatch '^GOMODCACHE(?:/|$)' }) + 'GOMODCACHE/p') -join ':')
        try {
            & $make $shellArgument restage-host-audit AUDIT_HOST_GOOS=linux AUDIT_HOST_GOARCH=amd64
            if ($LASTEXITCODE -ne 0) { throw 'Linux audit helper staging failed' }
            & wsl.exe --exec bash -lc 'for toolchain in "$HOME"/.local/share/updateme/toolchains/go*/go/bin; do if test -d "$toolchain"; then export PATH="$toolchain:$PATH"; fi; done; export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"; make test-unit'
            if ($LASTEXITCODE -ne 0) { throw 'Linux unit tests failed' }
        } finally {
            & $make $shellArgument restage-host-audit
            $env:GOMODCACHE = $previousModuleCache
            $env:WSLENV = $previousWslEnvironment
            if ($LASTEXITCODE -ne 0) { throw 'Windows audit helper restoration failed' }
        }
        & $make $shellArgument ensure-jstangle build
        if ($LASTEXITCODE -ne 0) { throw 'Windows build failed' }
    }
} finally {
    Pop-Location
}
