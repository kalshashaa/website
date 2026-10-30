import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { getSecret } from 'astro:env/server';
import seed from '../../shared/seed-documents.json';
import { copyKey, phoneLinks, reviewErrors, safeAssetUrl, validateTime } from '../../shared/content-contract';
import { company, common, nav, services, projects, pageMeta, route, type Locale, type PageKey, type Localized } from '../content/site';
import { contact as defaultContact } from '../content/contact';

export type SiteContent = {
  company: typeof company; common: typeof common; nav: typeof nav;
  services: ((typeof services)[number] & {image?: string})[];
  projects: typeof projects; pageMeta: typeof pageMeta;
  media: {logo:string;hero:string}; heroTitle: Localized;
  copy: Record<string,Localized>; preview: boolean;
  contact?: typeof defaultContact;
};
export function localizeCopy(content: SiteContent, locale: Locale) {
  return (_ar: string, en: string): string => {
    const pair = content.copy[copyKey(en)];
    if (!pair) throw new Error(`Missing editable text: ${en}`);
    return pair[locale];
  };
}
export function routeFor(content: Pick<SiteContent,'preview'>) {
  return (locale: Locale, page: PageKey = 'home') => content.preview ? `/preview/${locale}/${page}/` : route(locale,page);
}
export function cmsConfig() {
  const source = getSecret('CONTENT_SOURCE') || 'local';
  if (!['local','sanity'].includes(source)) throw new Error('Invalid CONTENT_SOURCE');
  const projectId = getSecret('SANITY_PROJECT_ID') || '';
  const dataset = getSecret('SANITY_DATASET') || '';
  const apiVersion = getSecret('SANITY_API_VERSION') || '2026-10-31';
  const configured=/^[a-z0-9]+$/.test(projectId)&&/^[a-z0-9_-]+$/.test(dataset);
  if (source === 'sanity' && !configured) throw new Error('Sanity configuration is incomplete');
  return {source,configured,projectId,dataset,apiVersion};
}
export function cmsClient(drafts = false) {
  const config = cmsConfig();
  if (!config.configured || !drafts && config.source!=='sanity') throw new Error('CMS is not connected');
  const token = drafts ? getSecret('SANITY_API_READ_TOKEN') : undefined;
  if (drafts && !token) throw new Error('Preview read token is not configured');
  return createClient({projectId:config.projectId,dataset:config.dataset,apiVersion:config.apiVersion,useCdn:false,token,perspective:drafts ? 'drafts' : 'published',timeout:10000,maxRetries:1});
}

type Document = { _id:string; _type:string; key?:string; value:any };
// The CMS is trusted for editorial text, not executable HTML or arbitrary asset URLs.
function assetUrl(value: any, required = true) {
  if (value?.image?.asset?._ref) {
    const config = cmsConfig();
    return safeAssetUrl(createImageUrlBuilder({projectId:config.projectId,dataset:config.dataset}).image(value.image).auto('format').width(1600).url());
  }
  if (!required && !value?.localPath) return undefined;
  return safeAssetUrl(value?.localPath);
}
export function validateShape(template:any,value:any,path='content'): void {
  if (template && typeof template==='object' && !Array.isArray(template) && 'localPath' in template) {
    if (!value || typeof value!=='object') throw new Error(`Missing image at ${path}`);
    if (value.localPath && !/^\/images\/[\w-]+\.(png|webp|jpe?g)$/.test(value.localPath)) throw new Error(`Invalid local image at ${path}`);
    if (value.image && (!/^image-[\w]+-\d+x\d+-[a-z0-9]+$/.test(value.image.asset?._ref||''))) throw new Error(`Invalid image reference at ${path}`);
    return;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value)||value.length!==template.length) throw new Error(`Unexpected item count at ${path}`);
    template.forEach((item,i)=>validateShape(item,value[i],`${path}[${i}]`)); return;
  }
  if (template && typeof template==='object') {
    if (!value || typeof value!=='object' || Array.isArray(value)) throw new Error(`Missing object at ${path}`);
    for (const [key,item] of Object.entries(template)) if (!key.startsWith('_')) validateShape(item,value[key],`${path}.${key}`);
    return;
  }
  if (typeof value !== typeof template) throw new Error(`Invalid field type at ${path}`);
}
export async function assembleContent(documents: Document[],page:PageKey,preview=false):Promise<SiteContent> {
  const byId = new Map(documents.map(document=>[document._id.replace(/^drafts\./,''),document]));
  const expected = seed.filter(document=>document._id!=='contactSettings'||page==='contact');
  for (const template of expected) {
    const doc = byId.get(template._id);
    if (!doc || doc._type!==template._type || doc.key!==template.key) throw new Error(`Content document missing or changed: ${template._id}`);
    validateShape(template.value,doc.value,template._id);
    if (!preview) {
      const issues=await reviewErrors(doc.value,doc._id);
      if (issues.length) throw new Error(issues.join('; '));
    }
  }
  const value = (id:string)=>byId.get(id)!.value;
  const settings=value('siteSettings'); const shared=value('sharedCopy');
  const result:SiteContent = {
    company: settings.company, common:shared.common, nav:shared.nav,
    media:{logo:assetUrl(settings.media.logo)!,hero:assetUrl(settings.media.hero)!},heroTitle:settings.heroTitle,
    services:seed.filter(d=>d._type==='service').map(d=>({...value(d._id),image:assetUrl(value(d._id).image,false)})),
    projects:seed.filter(d=>d._type==='project').map(d=>({...value(d._id),image:assetUrl(value(d._id).image)!})),
    pageMeta:Object.fromEntries(['home','about','services','contact'].map(key=>[key,value(`page.${key}`).meta])) as typeof pageMeta,
    copy:Object.assign({},shared.copy,...seed.filter(d=>d._type==='page').map(d=>value(d._id).copy)),preview,
  };
  if (page==='contact') {
    const data=value('contactSettings');
    if (!validateTime(data.opens)||!validateTime(data.closes)||data.opens>=data.closes||data.timezone!=='Asia/Riyadh') throw new Error('Invalid working hours');
    const links=phoneLinks(data.phone);
    const format=(time:string,locale:Locale)=>new Intl.DateTimeFormat(locale==='ar'?'ar-SA-u-nu-latn':'en-US',{hour:'numeric',minute:'2-digit',timeZone:'UTC'}).format(new Date(`2000-01-01T${time}:00Z`));
    result.contact={number:data.phone.replace(/^(\+966)(\d{2})(\d{3})(\d{4})$/,'$1 $2 $3 $4'),...links,timezone:data.timezone,days:data.days,hours:{ar:`${format(data.opens,'ar')} – ${format(data.closes,'ar')}`,en:`${format(data.opens,'en')} – ${format(data.closes,'en')}`}};
  }
  return result;
}
export async function getContent(page: PageKey, drafts=false):Promise<SiteContent> {
  const config=cmsConfig();
  if (drafts && !config.configured) throw new Error('Draft preview requires a connected CMS');
  const ids=seed.filter(d=>d._id!=='contactSettings'||page==='contact').map(d=>d._id);
  const documents=config.source==='local'&&!drafts?seed.filter(d=>ids.includes(d._id)):await cmsClient(drafts).fetch<Document[]>('*[_id in $ids]{_id,_type,key,value}',{ids});
  return assembleContent(documents as Document[],page,drafts);
}
