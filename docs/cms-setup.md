# Sanity Connection and Verification Procedure

Status: Prepared for execution after owner account setup/authorization. Never paste passwords or API tokens into chat or commit them to this repository.

## Owner-controlled accounts

Use an owner-controlled Sanity account and a Free project. Do not rely on trial-only private datasets or paid features. Free published content and media must be treated as public. Do not upload the complete source profile, contracts, confidential information, or credentials. The owner must personally complete account creation/terms acceptance when required.

Record the non-secret project ID and dataset name. Configure Studio's `.env` using the names in `aali-site/studio/.env.example`. These identifiers and the preview origin are public configuration only. No token belongs in Studio variables.

Configure the frontend's local `.env` from `aali-site/.env.example`. Keep `CONTENT_SOURCE=local` during connection so the approved local website remains usable before initial CMS publication. Server-only draft-read credentials and a cryptographically random preview signing secret of at least 32 characters must be set through a secure local/provider secret surface. Use a read-only token that can read the required drafts and validate Sanity preview secrets; verify its permissions against the real account.

## Origins and preview

For local testing, configure Studio at `http://127.0.0.1:3333` and the frontend at `http://127.0.0.1:4321`, consistently using the same hostname. Add only these required development CORS origins to the intended Sanity project, with credentials enabled only where required by the official integration. Configure `STUDIO_ORIGIN` exactly. No wildcard credentialed origins.

Production preview requires HTTPS and the final approved Studio/site origins. Production Node hosting also needs the real site hostname in Astro's allowed-domain configuration. Do not turn off origin checks. Cloudflare compatibility must be tested before deployment.

## Initial content

`node scripts/initialize-cms.mjs` creates a local NDJSON draft import file and performs no cloud action. The output is ignored by Git. The optional `--write-drafts` path additionally requires `ALLOW_SANITY_INITIALIZATION=owner-authorized` and securely configured account/write credentials. Run it only after explicit permission to write into the named account/dataset.

It uses create-if-not-exists transactions for `drafts.*` IDs, does not overwrite existing documents, and never publishes. Array items receive stable local keys. Remove any temporary initialization credential after the import.

The owner can then sign into the actual Studio, inspect each initial document, edit text/images/contact details, and open draft preview. A successful preview-secret handshake creates a one-hour signed server session. A perspective cookie alone does not grant access. Review Arabic and English together and acknowledge any changed pair before publication.

## Publication and builds

Publishing in a public dataset makes that content API-readable even if the website has not launched. Obtain permission for initial remote publication separately from local development. Once all required documents are published and reviewed, switch the public content source to Sanity and verify that a local build succeeds against published data.

After hosting authorization, configure a secret Cloudflare Workers Builds deploy hook for the approved source branch. Configure a Sanity webhook for only the fixed published document IDs from `shared/seed-documents.json`, including publish/unpublish events and excluding draft autosaves and preview-secret system documents. Keep the hook secret in provider configuration; never store its URL in public source. Check current provider event/filter semantics during configuration.

Until public deployment approval, keep production deployment hooks disabled. Distinguish a CMS document publication from a successful website deployment. A failed build must retain the previous working website. Explain the expected update delay to the owner and verify the deployed page after each acceptance test.

## Required end-to-end acceptance

1. Sign in as the sole owner and verify anonymous writes fail.
2. Change Arabic, observe the English-review warning, update or acknowledge the counterpart, and verify validation.
3. Save a draft and preview it in both languages while published public content stays unchanged.
4. Verify ordinary visitors, forged cookies and expired preview sessions cannot read the draft.
5. Replace an image and edit the phone/hours; verify the resulting pages, alt text and contact-only actions.
6. Publish authorized test content, observe the correct build event and verify successful output. Draft autosaves must not cause builds.
7. Simulate an invalid build and confirm the previous deployment remains available.
8. Export documents/assets and restore into a separate test dataset without deleting production data.

Record actual results and browser/provider limits. Do not claim these cloud checks passed based on local unit tests alone.
