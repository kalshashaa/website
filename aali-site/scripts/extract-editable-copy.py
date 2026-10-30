"""One-time migration of approved literal bilingual copy into editable field defaults."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
copy = {}
pattern = re.compile(r"locale === 'ar' \? '([^']*)' : '([^']*)'")
for relative in ['src/layouts/Base.astro', *[str(p.relative_to(root)) for p in (root/'src/components').glob('*.astro') if p.name not in ['Icon.astro', 'PageIntro.astro']]]:
    path = root / relative
    source = path.read_text(encoding='utf-8')
    if 'const t = ' in source:
        raise SystemExit('Migration was already applied')
    def replace(match):
        ar, en = match.groups()
        if (ar, en) in [('en', 'ar'), ('rtl', 'ltr'), ('ar_SA', 'en_US')]:
            return match.group(0)
        copy[en] = {'ar': ar, 'en': en}
        return f"t('{ar}', '{en}')"
    source = pattern.sub(replace, source)
    # All mutable content travels explicitly with each server-rendered page.
    source = source.replace('interface Props { locale: Locale;', 'interface Props { content: SiteContent; locale: Locale;')
    source = source.replace('const { locale, page } = Astro.props;', 'const { locale, page, content } = Astro.props;')
    source = source.replace('const { locale, detailed = false } = Astro.props;', 'const { locale, content, detailed = false } = Astro.props;')
    source = source.replace('const { locale } = Astro.props;', 'const { locale, content } = Astro.props;')
    source = source.replace('const { locale, page, content } = Astro.props;', 'const { locale, page, content } = Astro.props;')
    source = source.replace("import { company, nav, pageKeys, pageMeta, route, common, type Locale, type PageKey }", "import { pageKeys, route as publicRoute, type Locale, type PageKey }")
    source = source.replace("import { company, services, common, route, type Locale }", "import { type Locale }")
    source = source.replace("import { company, type Locale }", "import { type Locale }")
    source = source.replace("import { services, common, type Locale }", "import { type Locale }")
    source = source.replace("import { common, route, type Locale }", "import { type Locale }")
    source = source.replace("import { projects, common, route, type Locale }", "import { type Locale }")
    source = source.replace("import { contact } from '../content/contact';\n", '')
    source = source.replace('---\n', "---\nimport { localizeCopy, routeFor, type SiteContent } from '../cms/content';\n", 1)
    end = source.find('\n---', 4)
    setup = "\nconst t = localizeCopy(content, locale);\n"
    name = path.name
    fields = {'Base.astro':'company, nav, pageMeta, common, media', 'Home.astro':'company, services, common, media', 'About.astro':'company', 'Services.astro':'services, common', 'ProjectGrid.astro':'projects, common', 'Contact.astro':'company', 'ContactLink.astro':'common'}[name]
    setup += f'const {{ {fields} }} = content;\n'
    if name == 'Contact.astro':
        setup += "const contact = content.contact;\nif (!contact) throw new Error('Contact content is unavailable');\n"
    if name in ['Base.astro','Home.astro','ProjectGrid.astro','ContactLink.astro']:
        setup += 'const route = routeFor(content);\n'
    source = source[:end]+setup+source[end:]
    if name == 'Base.astro':
        source = source.replace('const canonical = new URL(route(locale, page), Astro.site);', 'const canonical = new URL(publicRoute(locale, page), Astro.site);')
        # These reads must follow setup rather than precede it.
        lines = source.splitlines()
        move = [line for line in lines if line.startswith('const meta =') or line.startswith('const canonical =')]
        lines = [line for line in lines if line not in move]
        marker = lines.index('const route = routeFor(content);')
        lines[marker+1:marker+1] = move
        source = '\n'.join(lines)+'\n'
        source = source.replace('src="/images/logo.png"','src={media.logo}').replace('href="/images/logo.png"','href={media.logo}')
        source = source.replace("new URL('/images/commercial-facility.webp', Astro.site)", 'new URL(media.hero, Astro.site)')
        source = source.replace('const noindex = !', 'const noindex = content.preview || !')
    if name == 'Home.astro':
        source = source.replace('src="/images/commercial-facility.webp"','src={media.hero}')
        source = source.replace("{locale === 'ar' ? <>نهتم بمنشأتك،<br/>من التفاصيل<br/>إلى التنفيذ.</> : <>Your facility.<br/>Every detail.<br/>Built with care.</>}", "{content.heroTitle[locale].split('\\n').map((line, index) => <>{index > 0 && <br/>}{line}</>)}")
    for child in ['ProjectGrid','ContactLink']:
        source = source.replace(f'<{child} locale={{locale}}', f'<{child} content={{content}} locale={{locale}}')
    path.write_text(source,encoding='utf-8')

out = root/'src/cms/literal-copy.json'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(copy,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Migrated {len(copy)} editable bilingual text pairs')
