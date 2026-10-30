# Aali Aljazerah Website

Bilingual Arabic/English corporate website for Aali Aljazerah contracting, maintenance and supply.

## Current status

The owner approved the public frontend design and copy. Eight content routes are implemented and tested. Sanity Studio schemas, bilingual review reminders and authenticated draft-preview code are implemented locally; real Sanity account connection and end-to-end cloud verification are still pending. No website deployment or paid service has been activated.

This repository is public at the owner's explicit request. It contains source code, approved project imagery, technical documents and local review evidence. It intentionally excludes credentials, dependencies, generated builds and temporary files. Do not commit `.env` files or API tokens.

## Project layout

- `aali-site/`: Astro frontend, Sanity Studio source, content model, local content and tests.
- `docs/technical-specification.md`: owner-approved scope, architecture and staged plan.
- `docs/design-direction.md`: initial visual system and design rationale.
- `docs/asset-register.md`: imagery provenance and the generated illustration prompt.
- `docs/local-review-report.md`: public frontend review evidence and limits.
- `output/review/`: browser screenshots and responsive checks.

See `aali-site/README.md` for local development commands. Public website deployment requires separate owner approval. This repository is a development snapshot, not a claim of production readiness.
