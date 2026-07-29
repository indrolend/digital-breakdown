# Data Asset and Release Eligibility Audit

Audit date: 2026-07-29
Audited tree: commit `9b8ef03` plus documentation-only working-tree changes
Scope: repository contents, native desktop and Android release inputs, legacy
Capacitor/web inputs, embedded browser-reference assets, and build dependencies

## Remediation update — 2026-07-29

The critical remediation pass removed the former embedded phone GLB, embedded
browser MP3 payloads, 26 desktop MP3s, 25 Android MP3 duplicates, and all
archive-derived DBGF contents. The obsolete archive downloader was deleted.

All current desktop, native Android, and browser-reference audio now comes from
the deterministic repository generator. The 15 TV channels are original
abstract signals generated without source media. The native phone mesh is now a
144-vertex original generic slab, while the browser uses matching procedural
geometry. These assets are legally verified but remain `TEMPORARY` for creative
reasons.

The machine-readable gate is `release-gate.json`; run
`node tools/validate-asset-inventory.mjs`. It currently covers 94 files across
the current release-bearing native directories and browser audio directory.
Historical removed rows remain in the inventory as `REMOVE` with
`Ships in Release` set to `No`.

## Purpose

This audit establishes the first repository-wide provenance baseline for Data,
currently named Digital Breakdown in source. It does not approve a public
release. It records what exists, what ships, what is known, and what must be
resolved before an official release candidate.

The authoritative row-level record is [inventory.csv](inventory.csv).
`ASSET_CREDITS.md` contains attribution-ready facts,
`THIRD_PARTY_LICENSES.md` covers code and build dependencies, and
`REPLACEMENT_PLAN.md` turns unresolved items into bounded future work.

## Method

The audit used:

- tracked-file enumeration and extension classification;
- CMake, Gradle, npm, Android-resource, and release-copy configuration review;
- runtime filename references in native and browser source;
- byte hashes to identify platform duplicates;
- embedded GLB and MP3 metadata;
- existing source comments and `tools/pass7-oracle` findings;
- Sketchfab source pages/API facts already captured in the repository;
- package manifests and lockfiles for dependency versions.

`Verified` means the repository contains enough evidence to identify the source
and governing license. It does not guarantee that a third-party uploader owned
every right represented by an asset.

## Release surfaces

### Native desktop

`native-desktop/CMakeLists.txt` copies all files from:

- `native-desktop/audio/`
- `native-desktop/fonts/`
- `native-models/`
- `native-tv-gifs/`

Consequently, even an unused file in one of those directories ships in every
desktop release unless packaging is narrowed.

### Native Android

Android packages resources from
`native-android/app/src/main/res/raw/` and adds `native-tv-gifs/` as an asset
directory. The raw resources duplicate most desktop audio and all three baked
models. `door_knock.mp3` is desktop-only.

### Legacy Capacitor Android and browser reference

`android/` is a generated/legacy Capacitor project with launcher and splash
images. `reference/browser-pass7/assets/embedded-assets.js` embeds the source
payloads for the phone, flower, and human models. These embedded payloads are
source-distribution assets even when they are not copied into a native binary.

## Findings

### Confirmed and retainable

- Source Sans 3 is covered by the SIL Open Font License 1.1.
- The human model is “Walk Cycle” by Niraj Ekaant, CC BY 4.0.
- The flower model is “pentagonal flower” by moroplogo, CC BY 4.0. Its GLB
  carries creator, source, and license metadata.
- The candidate wires model is CC BY 4.0, but is not a current native runtime
  asset.
- Project source is declared AGPL-3.0-only. Third-party media is not relicensed
  by that declaration.

### Critical blockers

- The phone GLB and its baked derivatives have no confirmed creator, original
  source page, or redistribution license. The design intentionally resembles an
  iPhone. Status: `REPLACE`.
- `end_call_tone.mp3` identifies itself as “iOS System Sounds.” The surrounding
  phone cue set has compatible naming and no independent licenses. Status:
  `REPLACE`.
- Music and several effects have no provenance. They must not enter an official
  release merely because they are already committed.

### High-risk blockers

- All 14 checked-in TV clips derive from archived GeoCities/GIFCities files.
  Archive availability is not a content license.
- The phone source GLB is embedded in a JavaScript source file, so omitting only
  `phone.dbmesh` from a package would not solve public-source redistribution.
- Desktop packaging copies whole asset directories, making accidental shipment
  likely.

### Medium-risk items

- The door-knock MP3 includes a creator and YouTube URL but no redistribution
  license.
- Reward voice clips match local Downloads files but have no creator or license
  metadata.
- Capacitor splash and launcher images have no documented design source.
- The CRT TV candidate uses the Sketchfab Free Standard License. That license
  may permit use in a sufficiently transformative end product, but it restricts
  standalone/extractable redistribution and is unsuitable for publication as
  AGPL project source.

## Duplicate, obsolete, and repository-quality observations

- Twenty-five audio files are duplicated between desktop and native Android.
  `door_knock.mp3` exists only on desktop.
- Three baked models are duplicated between `native-models/` and Android raw
  resources.
- Android launcher and splash artwork is stored as 26 density/orientation
  variants. These are legitimate Android build inputs but share one unresolved
  provenance decision.
- `native-tv-gifs/` contains 01–07 and 09–15. `tv08.dbgif` is absent although
  the baker has 15 ordered source URLs.
- The browser-reference model payloads and baked models intentionally duplicate
  content at different pipeline stages. They need one traceable provenance
  record, not independent ownership claims.
- `artifacts/ui-phone-layout/` contains tracked before/after screenshots,
  including duplicate 126,893-byte PNGs. These are development evidence rather
  than release inputs. Review them for intentional historical value and move
  durable evidence to documentation or remove it in a separate cleanup PR.
- `build/` is present locally and must remain excluded from version control and
  pull requests.
- `android/gradle/wrapper/gradle-wrapper.jar` is the only tracked JAR. This is a
  conventional Gradle wrapper component, but its checksum and upstream Gradle
  version should be verified rather than treating every binary commit as
  automatically acceptable.
- The largest tracked file is
  `reference/browser-pass7/assets/embedded-assets.js` at approximately 13.6 MB.
  It embeds the three source models, including the uncleared phone GLB. The
  next-largest files are the two 3.0 MB baked phone-model copies and two 1.97 MB
  game-music copies. These are provenance and duplication concerns rather than
  Git-host file-limit violations.
- `scripts/build-macos-release.sh` is currently untracked and outside this
  documentation-only audit.
- Existing documentation lives at `docs/ASSET_CREDITS.md`. The new
  `docs/assets/` set should become canonical after review; the old file should
  later become a short redirect in a separate documentation cleanup.

## Repository direction

The intended structure is one canonical upstream:

```text
indrolend/
  data/                 canonical game and official release source
  data-dev-tools/       optional developer tooling
```

After history review and migration, `digital-breakdown-apk`,
`digitalbreakdownreference`, and `Data-game-` should be archived with prominent
links to the canonical upstream. No archival or renaming is part of this PR.

## Release decision

Current result: **ELIGIBLE FOR INTERNAL RELEASE-CANDIDATE BUILD ONLY**, subject
to recorded platform verification. This is not approval for a general public
binary release. Legacy Capacitor identity artwork remains unverified if that
legacy target is distributed, and cross-platform runtime/build evidence must be
completed before broader release.

## Maintenance rules

For every new asset, update `inventory.csv` in the same pull request and retain:

1. original download/source URL;
2. creator name;
3. exact license and license snapshot or receipt;
4. original filename and SHA-256;
5. transformation/conversion steps;
6. attribution text;
7. confirmation of commercial and binary redistribution rights.

An asset without those fields is a prototype and must be marked `TEMPORARY` or
`UNKNOWN`; it must not silently become part of an official release.
