import {defineType,defineField,type Rule} from 'sanity';
import seed from '../../shared/seed-documents.json';
import {reviewErrors,validatePhone,validateTime,isPair} from '../../shared/content-contract';
import {LocalizedInput} from './LocalizedInput';

const titles:Record<string,string>={company:'بيانات الشركة',media:'الصور الرئيسية',logo:'شعار الشركة',hero:'الصورة التوضيحية الرئيسية',heroTitle:'عنوان الصفحة الرئيسية',common:'العبارات المشتركة',nav:'قائمة التنقل',copy:'نصوص الصفحة',meta:'عنوان ووصف نتائج البحث',title:'العنوان',description:'الوصف',name:'الاسم',shortName:'الاسم المختصر',introduction:'النبذة',regions:'مناطق الخدمة',summary:'الوصف المختصر',detail:'تفاصيل العمل',items:'تفاصيل نطاق الخدمة',image:'الصورة',alt:'وصف الصورة',phone:'رقم الاتصال وواتساب',opens:'بداية الدوام',closes:'نهاية الدوام',timezone:'المنطقة الزمنية',days:'أيام العمل',ar:'العربية',en:'English'};
function merge(a:any,b:any):any {
  if(isPair(a)||Array.isArray(a)||typeof a!=='object'||!a)return a;
  const out={...a}; for(const [key,value] of Object.entries(b||{})) out[key]=key in out?merge(out[key],value):value;
  return out;
}
function currentTemplate(document:any,path:string[]) {
  const id=(document?._id||'').replace(/^drafts\./,'');
  let value:any=seed.find(doc=>doc._id===id)?.value;
  for(const key of path)value=value?.[key];
  return value;
}
function fields(value:any,path:string[]=[]):any[] {
  return Object.entries(value).filter(([key])=>!key.startsWith('_')&&key!=='reviewHash').map(([key,child])=>{
    const currentPath=[...path,key];
    const base:any={name:key,title:isPair(child)?(titles[key]||child.ar.slice(0,64)):titles[key]||key,
      hidden:({document}:any)=>currentTemplate(document,currentPath)===undefined};
    if(isPair(child))return defineField({...base,type:'localizedText'});
    if(child&&typeof child==='object'&&!Array.isArray(child)&&'localPath' in child)return defineField({...base,type:'siteImage'});
    if(Array.isArray(child))return defineField({...base,type:'array',of:[isPair(child[0])?{type:'localizedText'}:{type:'string'}],options:{disableActions:['add','remove','duplicate','copy']}});
    if(child&&typeof child==='object')return defineField({...base,type:'object',fields:fields(child,currentPath),options:{collapsible:true,collapsed:path.length>0}});
    if(['key','icon','timezone'].includes(key))return defineField({...base,type:'string',readOnly:true,hidden:key!=='timezone'});
    if(key==='phone')return defineField({...base,type:'string',description:'اكتب الرقم بصيغة +9665xxxxxxxx؛ سيُستخدم للاتصال وواتساب في صفحة التواصل فقط.',validation:(rule:Rule)=>rule.required().custom(value=>validatePhone(value)||'أدخل رقم جوال سعودي صحيح بصيغة +9665xxxxxxxx.')});
    if(['opens','closes'].includes(key))return defineField({...base,type:'string',description:'مثال: 08:00 أو 17:00، بتوقيت السعودية.',validation:(rule:Rule)=>rule.required().custom(value=>validateTime(value)||'استخدم صيغة الساعة مثل 08:00.')});
    return defineField({...base,type:'string'});
  });
}
const docTitles:Record<string,string>={siteSettings:'الشركة والصور الرئيسية',sharedCopy:'العبارات المشتركة والتنقل',page:'الصفحات',service:'الخدمات',project:'المشاريع',contactSettings:'بيانات التواصل والدوام'};
export function documentTitle(doc:any):string {
  if(doc._type==='page')return ({home:'الرئيسية',about:'عن الشركة',services:'الخدمات',contact:'تواصل معنا'} as Record<string,string>)[doc.key]||'صفحة';
  return doc.value?.title?.ar||doc.value?.name?.ar||docTitles[doc._type]||doc._id;
}
export const schemaTypes=[
  defineType({name:'localizedText',title:'نص بالعربية والإنجليزية',type:'object',components:{input:LocalizedInput},fields:[
    defineField({name:'ar',title:'العربية',type:'text',rows:3}),defineField({name:'en',title:'English',type:'text',rows:3}),
    defineField({name:'reviewHash',title:'Review fingerprint',type:'string',hidden:true,readOnly:true})
  ],validation:rule=>rule.custom(async value=>!value||!(await reviewErrors(value)).length||'النصان مطلوبان، ويجب تأكيد مراجعتهما بعد التعديل.') }),
  defineType({name:'siteImage',title:'صورة',type:'object',fields:[
    defineField({name:'localPath',title:'الصورة الأصلية',type:'string',readOnly:true,hidden:true}),
    defineField({name:'image',title:'استبدال الصورة',description:'استخدم صورة تملك حق نشرها. حذف البديل يعيد الصورة الأصلية إن وجدت. لا ترفع مستندات أو صورًا سرية.',type:'image',options:{hotspot:true}}),
  ]}),
  ...[...new Set(seed.map(doc=>doc._type))].map(type=>{
    const examples=seed.filter(doc=>doc._type===type);
    const combined=examples.map(doc=>doc.value).reduce(merge);
    return defineType({name:type,title:docTitles[type],type:'document',fields:[
      ...(type==='page'||type==='service'||type==='project'?[defineField({name:'key',title:'المعرّف',type:'string',readOnly:true,hidden:true})]:[]),
      defineField({name:'value',title:docTitles[type],type:'object',fields:fields(combined)})
    ],preview:{select:{value:'value',key:'key'},prepare(selection:any){return{title:documentTitle({_type:type,...selection})};}},
    validation:(rule:Rule)=>rule.custom(async (document:any)=>{
      if(!document)return true;
      const template=seed.find(doc=>doc._id===document._id.replace(/^drafts\./,''));
      if(!template||template._type!==document._type)return 'هذه الصفحة أو الخدمة ليست ضمن النطاق المعتمد.';
      if(template.key!==document.key)return 'لا يمكن تغيير معرّف المحتوى.';
      const missing:string[]=[];
      function shape(a:any,b:any,path:string){
        if(a&&typeof a==='object'&&!Array.isArray(a)&&'localPath'in a){if(!b||!b.localPath&&!b.image?.asset?._ref){if(a.localPath)missing.push(path);}return;}
        if(Array.isArray(a)){if(!Array.isArray(b)||a.length!==b.length){missing.push(path);return;}a.forEach((v,i)=>shape(v,b[i],`${path}.${i}`));return;}
        if(a&&typeof a==='object'){if(!b||typeof b!=='object'){missing.push(path);return;}for(const[k,v]of Object.entries(a))if(k!=='reviewHash')shape(v,b[k],`${path}.${k}`);return;}
        if(typeof a!==typeof b)missing.push(path);
      }
      shape(template.value,document.value,'content');
      if(missing.length)return 'بعض الحقول المطلوبة ناقصة أو تغير عدد العناصر. راجع الحقول قبل النشر.';
      if(document._type==='contactSettings'&&(document.value.opens>=document.value.closes||document.value.timezone!=='Asia/Riyadh'))return 'يجب أن تكون نهاية الدوام بعد بدايته، بتوقيت السعودية.';
      return !(await reviewErrors(document.value)).length||'راجع النصوص العربية والإنجليزية وأكّد مراجعتها قبل النشر.';
    })} as any);
  }),
];
