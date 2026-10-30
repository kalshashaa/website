import { readFile, writeFile } from 'node:fs/promises';
import { company, common, nav, services, projects, pageMeta, pageKeys } from '../src/content/site.ts';
import { markReviewed, copyKey } from '../shared/content-contract.ts';
const literals = JSON.parse(await readFile(new URL('../src/cms/literal-copy.json', import.meta.url),'utf8'));
const image = localPath => ({ localPath });
const copyByPage = {};
for (const page of pageKeys) {
  const source = await readFile(new URL(`../src/components/${page[0].toUpperCase()+page.slice(1)}.astro`, import.meta.url),'utf8');
  copyByPage[page] = {};
  for (const [english, pair] of Object.entries(literals)) if (source.includes(`t('${pair.ar}', '${pair.en}')`)) copyByPage[page][copyKey(english)] = pair;
}
const pageCopyKeys = new Set(Object.values(copyByPage).flatMap(value=>Object.keys(value)));
const sharedCopy = Object.fromEntries(Object.entries(literals).filter(([english])=>!pageCopyKeys.has(copyKey(english))).map(([english,pair])=>[copyKey(english),pair]));
const docs = [
  {_id:'siteSettings',_type:'siteSettings',value:{company,media:{logo:image('/images/logo.png'),hero:image('/images/commercial-facility.webp')},heroTitle:{ar:'نهتم بمنشأتك،\nمن التفاصيل\nإلى التنفيذ.',en:'Your facility.\nEvery detail.\nBuilt with care.'}}},
  {_id:'sharedCopy',_type:'sharedCopy',value:{common,nav,copy:sharedCopy}},
  ...pageKeys.map(key=>({_id:`page.${key}`,_type:'page',key,value:{meta:pageMeta[key],copy:copyByPage[key]}})),
  ...services.map(service=>({_id:`service.${service.key}`,_type:'service',key:service.key,value:{...service,image:image('')}})),
  ...projects.map(project=>({_id:`project.${project.key}`,_type:'project',key:project.key,value:{...project,image:image(project.image)}})),
  {_id:'contactSettings',_type:'contactSettings',value:{phone:'+966551615518',opens:'08:00',closes:'17:00',timezone:'Asia/Riyadh',days:{ar:'الأحد إلى الخميس',en:'Sunday to Thursday'}}},
];
const reviewed = await markReviewed(docs);
await writeFile(new URL('../shared/seed-documents.json', import.meta.url),JSON.stringify(reviewed,null,2)+'\n');
console.log(`Prepared ${docs.length} local seed documents. No cloud writes were performed.`);
