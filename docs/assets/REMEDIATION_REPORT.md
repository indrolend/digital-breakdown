# Critical Asset Remediation Report

Date: 2026-07-29

## Changes made

Removed from desktop and Android shipping paths (the door knock existed only on
desktop):

`capture_1.mp3`, `capture_2.mp3`, `capture_3.mp3`, `capture_4.mp3`,
`capture_5.mp3`, `connect_power.mp3`, `door_knock.mp3`,
`end_call_tone.mp3`, `game_music.mp3`, `game_over.mp3`, `headshot.mp3`,
`headshot_critical.mp3`, `low_power.mp3`, `menu_music.mp3`,
`negative_ack.mp3`, `payment_failure.mp3`, `payment_success.mp3`,
`phone_attack.mp3`, `received_message.mp3`, `reward_nice.mp3`,
`reward_woah.mp3`, `sent_message.mp3`, `slurp_ringtone.mp3`,
`tv_room_pad.mp3`, `vc_ended.mp3`, and `vc_invitation.mp3`.

The equivalent embedded browser MP3 payload was removed. The embedded uncleared
phone GLB was removed. The prior contents of `tv01.dbgif`–`tv07.dbgif` and
`tv09.dbgif`–`tv15.dbgif` were overwritten, and the obsolete archive downloader
was deleted.

Generated into desktop, Android, and browser audio directories:

`capture_loop.wav`, `capture_success_1.wav`–`capture_success_5.wav`,
`device_connect.wav`, `door_knock.wav`, `gameplay_loop.wav`, `game_over.wav`,
`impact.wav`, `impact_critical.wav`, `menu_loop.wav`,
`message_received.wav`, `message_sent.wav`, `player_attack.wav`,
`reward_high.wav`, `reward_soft.wav`, `tv_ambience_loop.wav`, `ui_cancel.wav`,
`ui_confirm.wav`, `ui_invite.wav`, and `ui_warning.wav`.

Generated `tv01.dbgif`–`tv15.dbgif` as original abstract signals. Generated
project-owned `phone.dbmesh` copies for desktop and Android; the browser uses
its project-owned procedural phone. All are deterministic outputs of
`tools/generate-release-safe-placeholders.mjs`.

## Runtime references changed

- `native-desktop/DesktopAudio.cpp`
- `native-android/app/src/main/java/com/indrolend/digitalbreakdown/NativeBridge.java`
- `reference/browser-pass7/index.html`
- `reference/browser-pass7/index_module.mjs`
- `reference/browser-pass7/assets/embedded-assets.js`
- `native-models/manifest.json`
- model audit/conversion tools under `tools/pass7-oracle/`
- `.github/workflows/gameplay-checks.yml`
- `package.json`

## Audit delta

| Status | Before (62 rows) | After (86 rows) |
|---|---:|---:|
| VERIFIED | 15 | 15 |
| REPLACE | 34 | 0 |
| UNKNOWN | 8 | 0 |
| TEMPORARY | 5 | 44 |
| REMOVE | 0 | 27 |

Historical removed items remain visible as nonshipping `REMOVE` rows. New
project-owned placeholders are `TEMPORARY`, not falsely presented as final art.

## Verification

- `npm.cmd run assets:check`: passed; 86 rows cover 94 current shipping files.
- Clean Windows CMake/Ninja Release build: passed.
- Native CTest suite: 11/11 passed, including phone body/display, geometry,
  gameplay state, target lifecycle, menu, and multiplayer contracts.
- Windows staged output: contains the 23 WAVs and no removed MP3 or prohibited
  product-name pattern.
- Native Android `assembleDebug`: passed. APK entry scan found no removed MP3
  or prohibited product-name pattern.
- JavaScript syntax checks: passed for the browser module, embedded asset file,
  generator, and audit extractor.
- Browser runtime: not executed. Local `file:` navigation is blocked by the
  available browser security policy; module syntax and asset-path checks passed.
- Device runtime: not executed; no Android device session was used.
- macOS build/runtime: not executed on this Windows host. Run the existing
  macOS release workflow on the connected Mac without altering the untracked
  `scripts/build-macos-release.sh`.

The first Windows build attempt exposed the existing long-path limitation in a
long build-directory name. Verification succeeded from the shorter `build/z`
directory. Existing compiler deprecation/conversion warnings remain unrelated
to asset remediation.

## Remaining blockers

- Legacy Capacitor launcher and splash families still have unresolved
  provenance and must not ship unless replaced or confirmed.
- Browser interactive playback, Android device playback, and macOS build/runtime
  still need platform smoke tests.
- Generated sounds, signals, and phone are legally safe but intentionally
  provisional; final artistic replacement is optional for legal clearance and
  desirable before a polished general release.
- The broader non-asset release checklist (signing, attestation, packaging, and
  release-channel controls) has not been completed.

## Release decision

ELIGIBLE FOR INTERNAL RELEASE-CANDIDATE BUILD ONLY
