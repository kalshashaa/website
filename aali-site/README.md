# Aali Aljazerah Local Review Build

The eight-page bilingual public website is implemented for local design and content review. It is not a complete production release. Real Sanity editing, authenticated draft preview, publish automation, cloud integration, and deployment are the next phase after owner review.

## Open the current preview

With the retained development server running, visit `http://127.0.0.1:4321/`. The server binds to loopback only. This is not a publicly hosted website. No services or subscriptions were purchased.

## Run with an installed Node environment

Requires a compatible current Node.js release (the verified bundled runtime is Node 24.22.1) and pnpm 11.25.0.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open the Local URL printed by Astro. To stop a terminal-owned server, press Ctrl+C. The repository also includes `start-local.ps1`, which uses the existing bundled runtime on this machine when available and does not install software or packages.

```powershell
pnpm build
pnpm test
pnpm peers check
pnpm audit --prod
```

The build command includes Astro/TypeScript checking. The automated tests inspect the generated `dist` output, so build before testing. Frozen installation uses the lockfile; exact package versions are pinned.

## Structure

- `src/content/site.ts`: bilingual draft copy, approved service catalogue and three project descriptions.
- `src/content/contact.ts`: separate contact-only payload.
- `src/layouts/Base.astro`: bilingual metadata, navigation and shared page frame.
- `src/components/`: public page and reusable components.
- `src/styles/global.css`: design tokens, responsive rules, focus and reduced-motion styles.
- `src/pages/[...path].astro`: explicitly generated Arabic/English routes.
- `public/images/`: approved logo, generated illustrative hero and authentic extracted project photos.
- `tests/public-site.test.mjs`: contract tests for routing, contact isolation, claims, links and payloads.

There are four content pages in each language. A technical 404 document, robots.txt and sitemap do not add product features. Local review is deliberately noindex/disallowed by robots. These controls must be updated only during an approved public launch.

## Credentials and CMS

No API credentials exist in this build. `.env.example` documents future configuration names, not real secrets. A populated CMS configuration and genuine cloud integration must be implemented and tested before claiming that owner editing works. Do not deploy this build and represent it as the finished specification.

## Review and handover records

See the workspace `docs/technical-specification.md`, `docs/design-direction.md`, `docs/asset-register.md`, and `docs/local-review-report.md`. Browser screenshots and responsive-check evidence are in `output/review` at the workspace root. Final bilingual text is still awaiting owner review in the local pages.
