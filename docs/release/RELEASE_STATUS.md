# Release Status

Current classification:

**ELIGIBLE FOR INTERNAL RELEASE-CANDIDATE BUILD ONLY**

No preview package or public release is authorized by this status.

| Target | Build | Automated tests | Runtime smoke | Status |
|---|---|---|---|---|
| Windows | Pass | 11/11 native tests; model test pass | Existing verification | Internal candidate |
| Browser | Pass | HTTP assets pass | READY, start, and rendering pass | Internal candidate |
| Native Android | Pass | Asset gate pass; arm64-v8a and armeabi-v7a build | Physical device unavailable | Hardware verification pending |
| macOS | Not run in current checkpoint | Asset gate passes in source tree | Mac unreachable | Hardware verification pending |
| Legacy Capacitor | Excluded from the current release pipeline | — | — | Legacy, non-shipping |

## Passed

- release-safe asset gate;
- Windows Release compilation;
- native gameplay and protocol checks;
- current generated phone-model validation;
- native Android debug compilation;
- browser HTTP and runtime smoke checks;
- reusable human-animation scratch storage builds on Windows and Android.

## Pending before internal release-candidate packaging

- detached macOS build, architecture identification, and runtime smoke test;
- authorized LG Stylo 4 installation and runtime smoke test;
- review of physical-device runtime logs.

## Additional blockers before controlled public preview

- reproducible preview packaging and package-content inspection;
- build identity, manifests, and checksums;
- clear official download authority;
- supported-platform installation guidance;
- resolution or explicit scope decision for signing and notarization.

## Additional blockers before stable public release

- signed and notarized supported-platform artifacts where applicable;
- complete supported-platform acceptance testing;
- stable release workflow and provenance;
- final privacy, security, support, and update policies;
- final review of temporary creative assets and official branding.

