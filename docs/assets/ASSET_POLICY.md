# Asset Intake and Release Policy

This policy applies equally to maintainers and outside contributors. It governs
official Data builds and provenance records; it does not restrict rights granted
by the project's open-source licenses.

## Required intake record

No runtime asset may merge without:

- its original source and creator;
- an exact license or explicit project-ownership statement;
- evidence that commercial source and binary redistribution are permitted;
- required attribution text;
- intended runtime use and whether official builds ship it;
- a matching `inventory.csv` entry;
- disclosed modifications, conversion tools, and source recordings;
- disclosure of third-party packs, commissioned work, derivation, and
  AI-assisted generation.

Commissioned work must include the written rights grant. AI-assisted work must
identify the tool, inputs, and whether third-party reference material was used.
Do not put private receipts or personal information in the public repository;
maintainers may retain those records privately and record their verification.

## Prohibited submissions

Do not submit assets ripped from commercial games, extracted from proprietary
operating systems, taken from films or television, downloaded without a usable
license, based on unclear archive provenance, deceptively similar to protected
product branding, or submitted without origin information.

Availability online, age, a download button, personal use, or missing metadata
is not permission to redistribute.

## Status and release gate

Every row uses exactly one status: `VERIFIED`, `REPLACE`, `TEMPORARY`, `REMOVE`,
or `UNKNOWN`. An official binary is blocked if a shipping asset is `UNKNOWN`,
`REPLACE`, or `REMOVE`.

A shipping `TEMPORARY` asset is allowed only when its source is verified,
commercial redistribution is allowed, and it is temporary for creative—not
legal—reasons. `docs/assets/release-gate.json` is the machine-readable rule and
`node tools/validate-asset-inventory.mjs` enforces it.

Reviewers must reject an unexplained binary blob even when it appears harmless.
Contributors retain credit and applicable rights in their contributions;
maintainers curate the official release and branding.
