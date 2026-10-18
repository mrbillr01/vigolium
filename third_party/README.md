# Updated dependencies with compatibility patches

These Git submodules hold current upstream sources and the small compatibility
changes needed by Vigolium's upgraded Go dependency graph. The root `go.mod`
uses local replacements so builds consume the reviewed source rather than
unpatched module-cache copies. Clone with `git submodule update --init --recursive`.

| Module | Upstream | Compatibility change |
| --- | --- | --- |
| utils | projectdiscovery/utils | Adapt to removal of the obsolete zcrypto heartbeat log accessor. |
| tlsx | projectdiscovery/tlsx | Preserve JA3/JA3S extensions and certificate-only behavior with current zcrypto APIs. |
| rod | go-rod/rod | Use the current fetchup download destination API. |
| goimpacket | projectdiscovery/goimpacket | Preserve the import path used by Nuclei, migrate MSRPC wrapping APIs, and retain ticket-output controls. |
| zgrab2 | zmap/zgrab2 | Restore the non-authenticating SSH configuration constructor used by Nuclei. |

The fork remotes publish these changes. Their `upstream` remotes identify the
original projects. Publish submodule commits before updating this repository's
gitlinks. Validate integrations with `make build` and `make test-unit`; the
permission-sensitive unit suite runs on Linux. Native audit and JavaScript
helpers must be staged for the platform being tested.
