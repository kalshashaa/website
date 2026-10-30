import {defineConfig,type DocumentActionComponent} from 'sanity';
import {structureTool} from 'sanity/structure';
import {presentationTool,defineLocations} from 'sanity/presentation';
import seed from '../../shared/seed-documents.json';
import {schemaTypes,documentTitle} from './schema';

function arabicPublish(original:DocumentActionComponent):DocumentActionComponent {
  const action:DocumentActionComponent=props=>{
    const result=original(props);
    return result?{...result,label:'نشر المحتوى',title:'ينشر المحتوى في قاعدة البيانات، ثم يُحدّث الموقع بعد نجاح البناء. راجع المعاينة أولًا.'}:null;
  };
  action.action='publish'; return action;
}
function previewPage(type:string,key?:string):string {
  if(type==='page')return key||'home';
  if(type==='contactSettings')return 'contact';
  if(type==='service')return 'services';
  if(type==='project')return 'about';
  return 'home';
}
export function createStudioConfig(projectId:string,dataset:string,previewOrigin:string) {
  const origin=new URL(previewOrigin).origin;
  return defineConfig({
    name:'aali-aljazerah',title:'إدارة محتوى أعالي الجزيرة',projectId,dataset,
    schema:{types:schemaTypes,templates:()=>[]},
    plugins:[
      structureTool({title:'المحتوى',structure:S=>S.list().title('محتوى الموقع').items([
        S.listItem().title('الشركة والصور الرئيسية').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
        S.listItem().title('الصفحات').child(S.list().title('الصفحات').items(seed.filter(d=>d._type==='page').map(doc=>S.listItem().title(documentTitle(doc)).child(S.document().schemaType('page').documentId(doc._id))))),
        S.listItem().title('الخدمات').child(S.list().title('الخدمات').items(seed.filter(d=>d._type==='service').map(doc=>S.listItem().title(documentTitle(doc)).child(S.document().schemaType('service').documentId(doc._id))))),
        S.listItem().title('المشاريع').child(S.list().title('المشاريع المعتمدة').items(seed.filter(d=>d._type==='project').map(doc=>S.listItem().title(documentTitle(doc)).child(S.document().schemaType('project').documentId(doc._id))))),
        S.listItem().title('التواصل والدوام').child(S.document().schemaType('contactSettings').documentId('contactSettings')),
        S.divider(),S.listItem().title('العبارات المشتركة والتنقل').child(S.document().schemaType('sharedCopy').documentId('sharedCopy')),
      ])}),
      presentationTool({title:'معاينة المسودات',previewUrl:{origin,initial:'/preview/ar/home/',previewMode:{enable:'/api/preview/enable/'}},resolve:{locations:Object.fromEntries(['siteSettings','sharedCopy','page','service','project','contactSettings'].map(type=>[type,defineLocations({select:{key:'key'},resolve:(doc)=>({locations:[{title:'العربية',href:`/preview/ar/${previewPage(type,doc?.key)}/`},{title:'English',href:`/preview/en/${previewPage(type,doc?.key)}/`}]})})]))}}),
    ],
    document:{actions:previous=>previous.filter(action=>['publish','discardChanges','restore'].includes(action.action||'')).map(action=>action.action==='publish'?arabicPublish(action):action),newDocumentOptions:()=>[]},
  });
}
