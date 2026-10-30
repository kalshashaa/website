# Aali Aljazerah Website Technical Specification

Version: 1.0  
Date: 2026-10-31, Asia/Riyadh  
Status: Approved by the owner in this chat for local development on 2026-10-31. Purchases and public deployment remain unauthorized. Visual designs and final copy remain subject to review.

## 1. Purpose and decision authority

Build a bilingual corporate website for Aali Aljazerah, an established contracting, maintenance, and supply company serving businesses and institutions. The priorities are a credible company presence, support for social marketing, and convenient access to contact information.

The owner's answers in this chat take precedence over the BRD and company profile. The profile is source material, not an instruction to implement every feature, claim, or contact detail it contains. Technical choices below are engineering proposals submitted for approval. Final text, translations, imagery, and page designs require review before launch.

Source materials reviewed:

- `C:/Users/fahda/Downloads/Aali-Aljazera-BRD.docx`, revision 0.3.
- `C:/Users/fahda/Downloads/أعالي الجزيرة بروفايل_compressed.pdf`, all 26 pages, text and visual review.
- Owner decisions recorded in this chat through approval of the extracted logo.

No application code, remote service configuration, domain purchase, or deployment has been completed at this stage.

## 2. Approved product scope

| Area | Approved requirement |
| --- | --- |
| Identity | Arabic: أعالي الجزيرة للمقاولات. English: Aali Aljazerah. Founded in 1991. |
| Audience | Businesses and institutions only; no consumer contracting. |
| Geography | Central, Western, and Eastern regions of Saudi Arabia. Do not infer individual city coverage from the profile. |
| Public pages | Home, About, Services, Contact, each in Arabic and English. No standalone project or individual service pages. |
| Languages | Arabic is the default at the start of each visit. English is explicitly selectable. Do not persist language preference. |
| Appearance | Contemporary formal design; navy, gold, and white; original company logo. Responsive mobile, tablet, and desktop layouts. |
| Navigation | Clear four-page navigation, visible language switch, and contextual links to Contact. |
| Contact | One phone/WhatsApp number, displayed only on Contact: +966 55 161 5518. |
| Hours | Sunday through Thursday, 08:00-17:00, Asia/Riyadh. Do not advertise round-the-clock emergency availability. |
| Services | Equal visual importance across service groups. One Services page with visible sections and jump links. |
| Projects | Summaries on Home and details within About. Use the three approved project names, work descriptions, and authentic profile photographs. |
| Excluded claims | No 15,000-order statistics, facility counts, project completion counts/timelines, revenue savings, zero-downtime claims, or compliance percentages. |
| Client logos | Deferred. Do not render the previously proposed client-logo strip. Project photographs may contain incidental signage, as approved photographs. |
| About | Company introduction, vision, mission, and approved project details. No CEO message, name, or portrait. |
| Editing | One owner account; structured editing fields; preview drafts before publishing; edit both languages separately with counterpart-review reminders. |
| Analytics | No visitor analytics, advertising pixels, or session replay at launch. |
| Commercial boundaries | Prefer free service tiers. No paid subscriptions, purchases, production changes, or public launch without explicit owner permission. |

Explicit exclusions also include service/quotation forms, floating WhatsApp controls, public user accounts, online payments, booking, a customer portal, a blog, a map, street address, email contact, and social account links. Do not add these through templates, metadata, or footer defaults.

### Service catalogue

The initial catalogue must cover all approved work without implying unapproved residential construction or fixed maintenance packages:

1. Annual maintenance contracts tailored after site inspection: cleaning, tank maintenance, electrical work, elevators, electrical appliances, automatic sensor-operated glass doors, plumbing, and air conditioning.
2. Interior decoration design and execution, including gypsum, woodwork, and lighting.
3. Construction: large warehouses, sandwich-panel rooms, and complete garden works. No house or apartment-building construction.
4. Air conditioning supply, installation, maintenance, and cleaning for commercial split, central, cassette, and chiller systems.
5. Project-specific supply of materials and products, without an invented fixed catalogue.
6. Metal fabrication; glass and aluminum; painting; signage; flooring; security systems and networking; waterproofing.

Descriptions may be drafted from the profile, but detailed promises, equipment lists, standards, certifications, and guarantees require content review. Category ordering is for navigation, not a ranking of commercial priority.

### Approved project material

| Project | Allowed initial description |
| --- | --- |
| Herra Mall / مركز حراء التجاري | Work addressing flood damage and restoring affected building elements. |
| Raising Cane's | Branch renovation involving the documented finishes and related works. |
| Starbucks | Digital menu display installation/update work. |

The owner confirmed execution of all three projects and permission to publish their profile photographs. Do not imply exclusive relationships, ongoing contracts, brand endorsement, or direct-contract status. Project names and English spellings will be checked during copy approval. Do not synthesize replacement project photographs.

## 3. Page structure and language behavior

The proposed section order below is submitted for approval as part of this specification; it has not yet been designed.

| Page | Proposed sections |
| --- | --- |
| Home | Company introduction and main visual; equal-weight service overview; company strengths using factual copy; regional coverage; short summaries of the three projects; link to Contact. |
| About | Company overview and founding year; vision and mission; concise work approach based on inspection and client needs; three project case summaries with authentic photographs; link to Contact. |
| Services | Introductory explanation of business-only work; jump navigation; visible service sections with relevant imagery; tailored-contract explanation; link to Contact. |
| Contact | Business-only service statement; unified number; Call and WhatsApp actions; working days, hours, and Saudi timezone. |

Proposed routes: `/` and `/about/`, `/services/`, `/contact/` for Arabic; `/en/`, `/en/about/`, `/en/services/`, `/en/contact/` for English. Switching languages keeps the equivalent page. In-page service anchors must remain stable.

Interpretation proposed for approval: opening the main site address always starts in Arabic, regardless of previous language selection. Explicit English URLs remain English so shared links and search results work predictably. No language cookie, local-storage preference, or browser-language redirect will be used. If the owner intends even direct English links to reset to Arabic on each visit, resolve that distinction before implementation.

Arabic uses `lang="ar"` and `dir="rtl"`; English uses `lang="en"` and `dir="ltr"`. Use logical CSS spacing and bidi isolation for phone numbers and English brand names. Critical text and navigation work without JavaScript. The mobile menu remains keyboard accessible.

Do not place the number, `tel:` links, WhatsApp links, or phone-bearing structured data in global headers, footers, non-contact HTML, or non-contact social metadata. Links saying Contact are permitted throughout the site.

## 4. Recommended architecture

| Layer | Proposal | Reason |
| --- | --- | --- |
| Public frontend | Astro with TypeScript and scoped/plain CSS | Fits a small content-focused site, with little client JavaScript and good control of bilingual layouts. |
| Content editor | Sanity Studio with project-specific schemas and Arabic field labels/help text | Structured fields, owner authentication, asset management, drafts, and preview without building a custom admin system. |
| Database | Sanity Content Lake | Managed document database for text, translations, and asset references; no additional SQL database is needed. |
| Public delivery | Cloudflare Workers Static Assets | Serve the eight published pages as prebuilt static files. |
| Draft preview | Small dynamic Astro routes using the official Cloudflare adapter | Preview unpublished content without exposing it in public builds. |
| Publishing automation | Sanity publication webhook to a secret Cloudflare Workers Builds deploy hook | Regenerate pages after the owner publishes content. |
| Source control | Owner-controlled private Git repository, proposed GitHub | Versioned source, reviewable changes, and recoverable releases. Provider connection waits until needed. |
| Images | Approved local assets and Sanity image CDN | Responsive sizing and compression; keep the logo intact. |

Astro/Cloudflare deployment and Sanity preview integration have official documentation. Use supported stable versions with compatible peer dependencies, pinned in a lockfile at implementation; do not select beta versions merely to match a tutorial. [Cloudflare Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), [Sanity Astro integration](https://www.sanity.io/docs/astro).

Public pages will be explicitly prerendered even if the adapter defaults to server rendering. Verify asset-first routing so ordinary page visits do not invoke draft-preview code. The dynamic Worker is restricted to preview and necessary technical endpoints. No custom public content-write API is required.

Initial development and review are local. Any remote draft site must be access-protected and separately authorized; an unlisted URL or `noindex` alone does not make a preview private. Public launch remains a separate gate.

### Data flow

1. Owner signs into Studio and modifies draft fields.
2. Authenticated preview uses the same page components with draft content.
3. Owner reviews Arabic, English, imagery, and translation reminders, then chooses Publish.
4. A filtered publication webhook triggers a rebuild; draft autosaves must not trigger builds.
5. The build validates required content and reads published content directly, bypassing stale CMS CDN results.
6. A successful build atomically replaces the deployed public files. A failed build leaves the previous site available.

Expected normal update delay is approximately 1-5 minutes, an engineering target to verify rather than a provider guarantee. Publishing a CMS document and deploying its website representation are separate events. Provide Arabic guidance distinguishing saved draft, published content, and failed website update. Never report an update as live until the deployed page is verified.

Before launch, outbound production deployment hooks remain disabled. Publishing content into a public CMS dataset also makes that published content discoverable via its API, so load only approved material and do not treat an unlaunched website as permission to publish unapproved content.

## 5. Content data model

Use one production dataset and a second development dataset only when required. Development datasets must contain approved public material or harmless test fixtures. Sanity is the application content database; account credentials remain with the authentication provider.

| Document/object | Fields and constraints |
| --- | --- |
| `siteSettings` singleton | Approved Arabic/English company names, founding year, logo asset, regional labels. No contact fields in the shared public payload. |
| `contactSettings` singleton | E.164 number, WhatsApp-enabled flag, working days, start/end times, `Asia/Riyadh`, bilingual labels. Render only on Contact. |
| `page` fixed singleton per page key | Fixed key in `home/about/services/contact`; localized headings, copy, SEO title/description, approved image references. Owners cannot create extra routes by typing slugs. |
| `service` | Stable key, localized title/summary/detail, image, anchor, display order. Seed the approved catalogue; grouping cannot omit confirmed services. |
| `project` | Stable key, localized name/work summary/detail, authentic photo references and captions, display order. Seed only the three approved projects. No statistics or client-logo fields. |
| `localizedText` | Arabic and English values stored together, with revision fingerprint and counterpart-review acknowledgment. |
| `contentImage` | Asset reference, localized alt text, crop/hotspot where appropriate, caption, classification as authentic project or illustrative service imagery. |

Draft/published identity, revisions, and timestamps use CMS mechanisms. Store sensitive source notes and approval evidence in private project documentation, not published dataset fields.

Validation requirements:

- Both languages are required for initial release. Do not silently substitute Arabic text into English pages.
- Required image alt text, meaningful titles, valid contact number, valid times, known page keys, and bounded text lengths.
- No arbitrary executable HTML, scripts, external embeds, or user-configurable `javascript:` URLs.
- A change in either language flags the counterpart for review. The owner can edit or explicitly acknowledge that it remains correct; reminders are not automatic translation.
- Validate in Studio and again during the production build. A CMS Administrator can bypass UI constraints through provider tools; document that boundary and reject invalid public builds.

The bilingual document is published together. Require counterpart acknowledgment before publish through the normal Studio workflow. Do not add a separate translator account or paid translation API.

## 6. APIs and integration boundaries

| Interface | Contract | Access |
| --- | --- | --- |
| Sanity query API | Fixed, parameterized GROQ queries for approved page data; pinned API date | Published reads during build; no browser write token. |
| Sanity Studio mutation/upload APIs | CMS-managed draft changes, asset uploads, and publication | Authenticated owner; no anonymous writes. |
| `GET /api/preview/enable` | Validate the official Sanity preview-secret handshake; restrict redirect to known preview routes; establish short-lived preview authorization | Invalid/expired secret returns 401; no open redirects. |
| `GET /preview/{locale}/{page}` | Render only allowlisted page/locale combinations with draft data | Valid, server-verified preview session required. |
| `POST /api/preview/disable` | Clear preview authorization and return to the appropriate public page | Same-origin/CSRF checked; no draft response caching. |
| Cloudflare deploy hook | POST triggers the approved branch build on publish/unpublish events | Secret capability URL stored in provider configuration; never browser code. |
| Phone | `tel:+966551615518` | Contact page only; user initiates. |
| WhatsApp | `https://wa.me/966551615518` | Contact page only; user initiates; no messaging API, bot, tracking, or automated sending. |

Draft-preview setup follows the supported integration, but a client-editable perspective cookie alone is never authorization. Use a separate short-lived, server-signed authorization cookie/session after validating the handshake; validate it on every draft request. Prevent token leakage in HTML, query logs, redirects, source maps, and browser bundles. [Sanity preview integration](https://www.sanity.io/docs/astro/astro-visual-editing).

Cloudflare supports deploy hooks for builds. Treat the hook URL like a secret; filter content events, avoid duplicate draft-triggered builds, and test build-failure recovery. [Deploy hook documentation](https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/).

No visitor data database, CRM integration, transactional email service, payment provider, map API, or WhatsApp Business API is needed.

## 7. Security, privacy, and permissions

Visitors can read published pages and initiate contact. Only the owner can modify content in the delivered setup. Use provider-managed sign-in instead of storing custom passwords. Enable two-factor protection on owner accounts where supported; do not create unnecessary permanent developer seats or share credentials in chat.

Sanity Free has public datasets. Published documents can be queried independently of the website; uploaded media must also be treated as publicly accessible assets. Do not upload the complete company profile, contracts, customer records, credentials, unapproved photos, or confidential approval notes. Draft document confidentiality and preview isolation must be verified with unauthenticated API and browser tests. Private datasets require a paid plan. [Dataset access documentation](https://www.sanity.io/docs/content-lake/datasets).

Production controls:

- HTTPS, secure secret storage, least-privilege read tokens for preview, and no secret values in Git or client code.
- Explicit CORS origins for Studio and preview; CORS is not authorization.
- Preview responses use `Cache-Control: private, no-store` and `X-Robots-Tag: noindex, nofollow`. Do not cache preview cookies, HTML, or assets containing secrets.
- Separate preview cookies from public browsing; enforce expiry and logout. Test iframe/cookie behavior in supported browsers and provide an authenticated top-level preview if browser privacy settings block embedding.
- CSP restricted to required origins; public pages refuse framing, while preview permits only the approved Studio origin. Use content-type protection and an appropriate referrer policy.
- Sanitize rich-text rendering and allowlist links; remove sensitive EXIF metadata from selected photos before upload.
- No analytics or marketing scripts. Operational hosting/CMS logs still exist; minimize application logs and redact tokens, cookies, preview secrets, and full query strings.
- Do not add phone details to non-contact structured data, static JSON payloads, or globally injected configuration.
- Review dependencies before release; resolve exploitable high/critical findings or explain and obtain acceptance for any unavoidable limitation.

Hosting and CMS are external providers; do not claim Saudi-only storage, absolute security, legal certification, or guaranteed uptime. No personal visitor submissions are collected. Provider accounts and their recovery methods remain owner-controlled.

The Free CMS role for the owner is Administrator, not a restricted Editor role. Studio hides unnecessary advanced controls for usability, but this does not reduce the owner's underlying provider permissions. No second editor is required. [Sanity plan comparison](https://www.sanity.io/pricing).

## 8. Design and media implementation

Approved logo: `output/brand/logo-from-profile.png`, 800 x 300 pixels, extracted from the profile cover and visually inspected. It has a navy background, white lettering/symbol, and a gold detail. Preserve aspect ratio, wording, and colors; do not claim it is an original transparent/vector asset. Avoid display sizes that exceed its useful resolution. Any later transparent/vector variant needs separate review.

Use the installed UI UX Pro Max skill for design guidance, Frontend Design for implementation, and the existing Imagegen skill for illustrative service visuals. Skills are tools, not authority to override requirements. Installation/source checks are recorded in `skill-readiness.json`; both installed skills are now present in the session catalogue. No generated service imagery has been produced yet.

Exact color values, font choices, section composition, responsive treatments, and illustrative assets will be presented as a design proposal after specification approval. Keep service imagery clearly illustrative and separate from authentic project photographs. Never add fabricated brand/client logos or invented completed projects. Self-host licensed Arabic/Latin fonts where practical; record asset sources and licenses.

## 9. Quality targets

These are proposed engineering acceptance targets, not measured results or provider promises:

| Area | Target |
| --- | --- |
| Responsive layout | No horizontal overflow at 360, 390, 768, 1024, and 1440 CSS-pixel widths; readable at 200% zoom. |
| Accessibility | Keyboard navigation, visible focus, meaningful landmarks/headings, adequate contrast, labeled controls, descriptive alt text, reduced-motion support. Aim for applicable WCAG 2.2 AA criteria; do not claim certification. |
| Performance | Representative mobile Lighthouse performance >=90 on public pages in repeatable lab conditions; record conditions and investigate failures. |
| Loading | Target LCP <=2.5 seconds and CLS <=0.1 in controlled mobile tests; INP <=200 ms is a field target if sufficient real traffic data later becomes available. |
| Payload | Responsive compressed photos; explicit image dimensions; lazy-load below-fold images; public JavaScript target <=60 KB gzip excluding images/fonts. |
| SEO/sharing | Unique bilingual titles/descriptions, canonical and alternate-language links, sitemap of eight content routes, useful share images, no fabricated ratings or phone-bearing global schema. |
| Browsers | Current stable Chrome, Edge, Firefox, Safari; real-device checks when available, with any simulation-only coverage disclosed. |

## 10. Development plan and review gates

| Phase | Executable work | Evidence and owner review |
| --- | --- | --- |
| A. Approval | Review this document, costs, public-CMS limitation, publishing delay, language-route interpretation, and proposed page section order | Explicit approval before application code. |
| B. Content and visual proposal | Prepare bilingual copy, service grouping, project descriptions, selected photos, responsive layout proposal, colors and fonts; generate approved-scope illustrations | Review copy and recognizable designs; no invented claims. |
| C. Public site | Create Astro/TypeScript project, routes, shared layouts, navigation, language mapping, service anchors, project sections, Contact, metadata, responsive styles | Local working demonstration of all eight page versions; approve behavior. |
| D. CMS and preview | Implement schemas, owner sign-in, bilingual fields/reminders, asset fields, validation, authorized draft preview, publish hooks and failure feedback | Owner edits text, image and number; previews draft; confirms English review; publishes a test update. |
| E. Integration and QA | Run content, functional, browser, accessibility, performance, secret-leak, anonymous-access and publishing/rollback checks; fix failures | Recorded results and known limitations; owner acceptance of the integrated site. |
| F. Launch preparation | Owner creates required accounts, approves domain purchase, supplies service access securely; prepare DNS, backup and deployment instructions | Separate explicit authorization for paid actions and public deployment. |
| G. Launch and handover | Deploy approved build, verify HTTPS/DNS and functions, test content publishing and restore procedure, provide training and code/docs | Live-site verification and complete handover, or an explicit report of blocked/unverified items. |

Phases B-E start only after explicit approval of Phase A. Cloud accounts and remote staging are not created as a side effect of specification approval unless included in the owner's authorization. Project completion requires the agreed functions to pass tests; a visual mockup or disconnected CMS demo is not completion.

## 11. Verification matrix

| ID | Test and passing condition |
| --- | --- |
| T01 | Eight content routes load; four navigation items per language; no standalone service/project page. |
| T02 | Main address opens Arabic after an earlier English visit; language switch maps to equivalent pages; no stored preference. Test direct English links against the approved interpretation. |
| T03 | RTL/LTR, mixed-language names, telephone formatting, mobile menu and service-anchor focus work. |
| T04 | Every approved service is represented; all regions appear; no consumer construction, fixed packages, emergency advertising, CEO block, client-logo strip, or deferred statistics. |
| T05 | Only Contact has the number, tel/WhatsApp actions, and hours. Inspect HTML, structured data, metadata, public JSON, and shared bundles on the other pages. |
| T06 | On a phone, Call passes the correct number to the dialer and WhatsApp targets the correct account; desktop fallback remains usable. Actual calling/messaging is not initiated during automated checks. |
| T07 | Approved logo remains legible and undistorted; authentic photos are attached to the correct projects; illustrative service photos are not labeled as completed projects. |
| T08 | Owner can save a draft, preview it, cancel/leave without changing the public site, then publish a test change and observe the deployed result. |
| T09 | Arabic/English changes create counterpart reminders; initial missing translations and invalid phone/time/URL values prevent accepted publication/build. |
| T10 | Anonymous CMS writes fail; anonymous draft queries and preview requests do not reveal drafts; forged perspective cookies, expired sessions and unsafe redirects fail. No secret appears in bundles or request logs. |
| T11 | No draft response reaches public cache. Browser sessions remain isolated; preview logout and expiry work, including cross-site iframe restrictions. |
| T12 | Published/unpublished content triggers the correct rebuild; draft autosave does not; failed builds preserve the last good site; stale publication events do not deploy older content over newer content. |
| T13 | Keyboard, focus, contrast, zoom, alt text, reduced motion and representative mobile/desktop layouts pass recorded checks. |
| T14 | Performance, metadata, sitemap, broken links, image sizes, CSP and HTTPS are checked on the actual deployment as well as locally. |
| T15 | Exported content and assets can be restored to a separate test dataset; code rollback is demonstrated without deleting production content. |

Use targeted automated integration tests for language routing, contact isolation, preview security, translation validation, and publishing behavior. Combine them with visual/manual review. Mocked tests do not replace real provider integration tests; missing account access must be reported as a limitation.

## 12. Cost model and alternatives

Pricing checked against official provider pages on 2026-10-31. Prices may change before activation. SAR figures use a budgeting conversion of USD 1 = SAR 3.75, before applicable taxes, bank charges, and promotions. Quotas apply across relevant account/project usage, not necessarily only this website.

| Item | Proposed initial cost | Limits and alternative |
| --- | --- | --- |
| Astro and local development tools | No framework license fee | Development work and any existing AI subscription/usage are separate. |
| Cloudflare static assets | USD 0 within the applicable free offering | Serve prerendered public pages as assets. Dynamic preview is metered separately. |
| Cloudflare preview Worker | USD 0 on Free | 100,000 dynamic requests/day and 10 ms CPU/invocation. Validate runtime fit. Paid starts at USD 5/month (about SAR 18.75), with usage pricing; approval required. |
| Sanity content database and hosted Studio | USD 0 on Free | Public datasets; limited roles; drafts/preview supported. Do not depend on a temporary Growth trial. |
| Source repository | Target USD 0 with owner private repository | Confirm current provider account quotas during setup; keep a local source copy regardless. |
| Standard `.com` domain | Example listed registration/renewal USD 11.08/year, about SAR 41.55/year | Porkbun example, not a quote or availability confirmation for `aalialjazerah.com`. Reserve SAR 50-100/year as a planning allowance; approve actual checkout and renewal terms. |
| Translation, contact links, analytics | No paid API planned | Manual translation review; simple tel/WhatsApp links; analytics deferred. |
| Service illustrations | Existing Imagegen access where available | No separate paid image API or stock subscription is authorized. If extra charges/access are required, pause that purchase and present alternatives. |

Cloudflare static delivery has free, unlimited static requests; Worker requests are a distinct category. Builds have their own account quotas. Free quotas can interrupt dynamic preview/builds, so monitor usage rather than promise unlimited operation. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

Sanity Free currently lists up to 20 seats, two public datasets, 10,000 documents, 1 million CDN API requests/month, 250,000 API requests/month, and 100 GB each of asset storage and monthly bandwidth. Free roles are Administrator and Viewer. Growth is USD 15 per seat/month (about SAR 56.25) and supports private datasets and more roles. The proposed single-owner public-content site does not require Growth. Recheck quotas before setup and never enable overage billing automatically. [Sanity pricing](https://www.sanity.io/pricing).

The standard `.com` price is a registrar example, not a domain search result. Availability, premium status, taxes and renewal terms remain unverified. An available provider subdomain can avoid a domain purchase for testing, but public use still requires launch approval. [Domain price example](https://porkbun.com/products/domains).

Expected baseline recurring service charges: **SAR 0/month**, while free limits remain sufficient, plus the separately paid annual domain. The planning domain allowance averages approximately SAR 4.17-8.33/month but is paid annually. This excludes optional labor/maintenance and existing Codex/Imagegen usage charges. A hypothetical later combination of Cloudflare Paid plus one Sanity Growth seat starts around SAR 75/month before tax and excess usage; it is not recommended or authorized now.

### Development effort and optional external labor

Planning estimate: **60-100 engineering hours**, including content integration, bilingual UI, CMS/preview, integration testing, fixes and handover; roughly 2-4 working weeks for one person, excluding owner review delays and account activation. This is an estimate, not a delivery commitment or a charge from this assistant.

If the owner separately hires a contractor, an illustrative assumed rate of SAR 100-200/hour gives **SAR 6,000-20,000** for that effort. This is arithmetic for budgeting, not a sourced market quotation. No contractor, invoice, retainer or paid maintenance service is being commissioned. Work performed here uses the owner's existing product access; any actual subscription/usage charge must be checked in the owner's plan before a paid action.

### Lower-cost and operational alternatives

| Alternative | Benefit | Tradeoff |
| --- | --- | --- |
| Recommended Astro + Sanity + Cloudflare Free | Structured editing and preview with no baseline hosting/CMS charge | Public published CMS data; multiple provider accounts; rebuild delay; free quota limits. |
| Static files with no CMS | Fewer dependencies, free hosting possible | Does not satisfy independent nontechnical editing and preview; requires a scope change, so not selected. |
| Git-based CMS on static hosting | Can avoid a hosted content database | More owner-facing repository/authentication complexity and preview setup; less suitable for the approved experience. |
| Managed WordPress | Familiar editing and bundled hosting options | Recurring hosting and plugin/security maintenance; obtain current quotes if the recommended prototype fails or the owner prefers it. |

If the recommended free setup fails the preview security, usability, or runtime tests, diagnose and try a compatible stable implementation first. Present the demonstrated limitation and concrete alternatives before changing architecture, user behavior, or paid plans.

## 13. Accounts, credentials, and launch prerequisites

The owner will eventually need accounts controlling the domain registrar, Cloudflare, Sanity, and proposed private source repository. Initial coding can start locally after approval; actual cloud integration cannot be claimed complete without configured accounts and testing.

Use scoped authorization or secure secret entry when available. Do not request passwords or API tokens in normal chat. Required configuration includes the Sanity project ID/dataset/API version, server-only preview read token, preview-session signing secret, allowed Studio/preview origins, and the deployment hook URL. Deployment credentials are build-system secrets, not public environment values.

Before launch: approve final bilingual copy and design; verify logo/photo use; confirm the contact number still works; check domain availability; review exact registrar checkout; complete access protection and backups; record test results; obtain explicit public-launch approval. Do not connect the profile's email or publish its street address.

## 14. Operation, recovery, and handover

Deliver the complete frontend and CMS source, schemas, lockfile, `.env.example` containing names only, local-run/build instructions, deployment guide, Arabic owner editing guide, asset/source register, approval record, and test report. Explain the difference between content publishing and code deployment.

Keep code in version control. Export CMS documents with assets before launch and major content/schema changes; recommend a monthly owner-operated export thereafter. Keep at least three dated backup copies in owner-controlled private storage. Verify restoration in a separate dataset; do not promise a scheduled backup service that has not been configured. Exports can contain drafts and must not be publicly hosted.

Document how to recover the last good deployment, republish corrected content, rotate tokens, regain owner-account access, check free-tier usage, and renew the domain. Rolling back a website build does not roll back the CMS; explain both recovery paths. No production deletion, destructive schema migration, or account-setting change occurs without explicit permission.

After public deployment, verify DNS and HTTPS, all pages/languages, mobile navigation, Contact actions, CMS publishing and preview, and monitoring of provider failures. If real-device, provider, or production checks cannot be performed, identify them explicitly instead of declaring the project complete.

## 15. Approval requested

Approve or revise the proposed architecture, page section order, direct-English-link interpretation, public-content CMS limitation, 1-5 minute publishing target, free-tier cost approach, and staged development plan. Approval authorizes the agreed development scope; purchases and public launch remain separate decisions.

Content statistics, project outcome claims and client-logo publication remain deferred. Exact copy, detailed service claims, design values and illustrative images remain subject to review during Phase B. No additional feature is approved merely because a platform supports it.
