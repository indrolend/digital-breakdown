# Generated Release-Safe Placeholders

Generator: `tools/generate-release-safe-placeholders.mjs`
Generator version: repository revision containing this document
Creator/owner: Data project contributors
License: AGPL-3.0-only with the project source
Dependencies: Node.js standard library only

Run from the repository root:

```text
node tools/generate-release-safe-placeholders.mjs
```

The generator does not read or transform proprietary source media. It creates:

- mono 22,050 Hz, 16-bit PCM WAV interface, gameplay, ambience, and temporary
  music cues;
- fifteen 12×8 DBGF abstract signal animations;
- a minimal DBM1 fictional phone slab with an asymmetric original sensor motif;
- identical Android copies where the current packaging requires duplication.

All outputs are legally safe but creatively temporary. They should remain
`TEMPORARY` until replaced with final project identity assets. Looping audio
uses integer-cycle oscillators so its start and end remain phase-aligned.

The script also removes the former embedded proprietary-risk phone GLB and
known old MP3 filenames. It intentionally fails only through normal filesystem
errors; review version control before accepting generated changes.
