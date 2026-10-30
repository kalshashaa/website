# CMS Implementation Report

Date: 2026-10-31, Asia/Riyadh  
Status: Local implementation and automated checks completed; actual cloud connection remains pending.

## Implemented

- Sanity Studio with fixed navigation for company information/images, four pages, thirteen approved services, three approved projects, shared copy, and contact/hours.
- Arabic field titles/help text, Arabic/English text fields, revision fingerprints and explicit counterpart-review acknowledgment after either language changes.
- Provider-managed authentication when a real project is configured. Without configuration, the Studio displays setup instructions and performs no fake local saves.
- Approved initial content represented in 23 seed documents. Initialization is a separate guarded command that creates drafts only and preserves existing documents. It has not been run against a remote account.
- Explicit server-side content loading. Published builds validate required document IDs, shape, both languages, review state, contact number, working hours and image hosts. There is no silent fallback to local data in configured Sanity mode.
- A separate contact-only document/payload. Phone and WhatsApp links are derived from the single validated mobile number.
- Published static pages remain separate from dynamic draft routes. Preview sessions are HMAC-signed, audience-bound, HttpOnly, time-limited to one hour and checked on every preview request.
- Official Sanity preview-secret verification before session creation, a strict eight-route redirect allowlist, no-store responses, framing restrictions, noindex headers, and same-origin logout with cookie clearing.
- Preview navigation stays inside the authenticated preview routes. A refresh action loads the latest draft; no claim of continuously updating live overlays is made.
- Local Node adapter plus a selectable Cloudflare deployment adapter. Only the Node build has been validated in this phase; actual Cloudflare deployment remains pending.

## Verification

The frontend passes Astro/TypeScript checking and builds. Studio passes TypeScript and Vite production build. Its provider bundles produce large-chunk and React compiler directive warnings; they are separate from the public site's small JavaScript payload and need a post-login browser check with the real account.

All **16 automated tests pass**: seven public-site contract tests, six content/review/session unit tests, and three HTTP integration tests against a temporary local production server. The tests cover missing configuration, anonymous and forged-cookie access, safe redirect handling, expiry and tampering, bilingual review invalidation, image host validation, contact isolation, and logout CSRF checks.

The HTTP tests caught two integration issues that were fixed: the logout action required the canonical trailing-slash URL, and Node request-origin validation required an explicit allowed-domain list. Cross-origin protection remains enabled; it was not disabled to make tests pass.

## Not yet verified or activated

- A real Sanity project/account, owner authentication, draft autosave and uploads, preview-secret handshake, authenticated draft rendering, actual publishing and deployment-hook delivery.
- Cloudflare runtime/browser-cookie behavior, remote backups/restoration, production security checks and live performance testing.
- Hosted Studio browser compatibility and any embedding restrictions on the real provider origins.

These are prerequisites to completing the CMS stage, not optional omissions. No remote account, public website deployment or paid service has been created. The GitHub source repository is public only because the owner explicitly approved that visibility.
