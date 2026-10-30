import {createClient} from '@sanity/client';
import {readFile,writeFile} from 'node:fs/promises';
import {reviewErrors} from '../shared/content-contract.ts';
const seed=JSON.parse(await readFile(new URL('../shared/seed-documents.json',import.meta.url),'utf8'));
function keyed(value){
  if(Array.isArray(value))return value.map((item,index)=>item&&typeof item==='object'?{...keyed(item),_key:`item-${index+1}`}:item);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,keyed(item)]));
  return value;
}
const drafts=seed.map(doc=>({...keyed(doc),_id:`drafts.${doc._id}`}));
for(const doc of drafts){const errors=await reviewErrors(doc.value);if(errors.length)throw new Error('Initial content failed bilingual review validation');}
if(!process.argv.includes('--write-drafts')){
  await writeFile(new URL('../cms-initial-drafts.ndjson',import.meta.url),drafts.map(doc=>JSON.stringify(doc)).join('\n')+'\n');
  console.log(`Prepared ${drafts.length} local draft documents. Nothing was uploaded or published.`);
}else{
  if(process.env.ALLOW_SANITY_INITIALIZATION!=='owner-authorized')throw new Error('Remote initialization requires explicit owner authorization. Follow the setup guide.');
  const {SANITY_PROJECT_ID:projectId,SANITY_DATASET:dataset,SANITY_INITIALIZE_TOKEN:token}=process.env;
  if(!projectId||!dataset||!token)throw new Error('Missing secure account configuration');
  const client=createClient({projectId,dataset,token,apiVersion:'2026-10-31',useCdn:false});
  const transaction=client.transaction();for(const doc of drafts)transaction.createIfNotExists(doc);
  await transaction.commit();console.log('Initial drafts created where absent. Existing content was preserved; nothing was published.');
}
