# Physical Platform Verification

Date: 2026-07-29  
Branch: `release/pr3-internal-rc-pipeline`  
Starting commit: `5b5a0eb`

## macOS

The private SSH configuration resolved locally, but the connection timed out.
No repository or build command ran on the Mac. The detached-worktree verifier
was therefore not invoked, and the active Mac checkout was not touched.

Pending:

- hardware, macOS, compiler, and architecture identification;
- detached clean build and native tests;
- application launch;
- rendering, input, audio, and lifecycle observation.

## Physical Android

`adb devices -l` reported no attached devices. No APK was installed and no
phone data was changed.

Pending on the LG Stylo 4:

- authorized ADB detection;
- APK installation and launch;
- ten-minute graphics, input, audio, performance, and lifecycle smoke test;
- bounded runtime-log review.

## Source-level work completed while hardware was unavailable

The shared human skinning implementation gained caller-owned reusable scratch
buffers. The Android and desktop renderers now reuse the bone world-matrix and
skin-matrix storage across rendered humans instead of constructing two vectors
for every skinning call. The compatibility overload remains available and uses
local scratch storage, so independent callers retain the previous thread-safety
contract.

The native model test now verifies that:

- the reusable and compatibility paths produce equivalent animation output;
- scratch capacities remain stable across consecutive same-model calls;
- the release-safe 144-vertex, four-batch phone model matches the current
  generated manifest.

This is a source-level allocation reduction. No frame-time or battery-life
improvement is claimed until profiling can run on target hardware.

## Verification results

- Asset inventory release gate: pass.
- Windows Release build: pass.
- Native gameplay and protocol tests: 11/11 pass.
- Native model and reusable-scratch equivalence test: pass.
- Android debug build: pass for `arm64-v8a` and `armeabi-v7a`.
- Browser HTTP asset smoke: pass.
- Browser startup and gameplay start: pass.
- Browser warning: the existing FBX loader reports that one or more vertices
  contain more than four weights and discards additional weights.
- Browser environment emitted one non-fatal generic Chromium diagnostic after
  gameplay began; gameplay remained active.

