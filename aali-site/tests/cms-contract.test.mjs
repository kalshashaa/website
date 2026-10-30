import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fingerprint,markReviewed,reviewErrors,phoneLinks,validateTime,safeAssetUrl} from '../shared/content-contract.ts';
import {createPreviewSession,verifyPreviewSession,safePreviewPath,previewCookie} from '../shared/preview-security.ts';
const seed=JSON.parse(await readFile(new URL('../shared/seed-documents.json',import.meta.url),'utf8'));
const secret='local-test-signing-key-at-least-32-characters';
test('all 23 seed documents are bilingual-reviewed and contain only approved stable identifiers',async()=>{
  assert.equal(seed.length,23);assert.equal(new Set(seed.map(d=>d._id)).size,23);
  assert.deepEqual(await reviewErrors(seed),[]);
  assert.equal(seed.filter(d=>d._type==='service').length,13);
  assert.equal(seed.filter(d=>d._type==='project').length,3);
  assert.equal(seed.filter(d=>d._type==='page').length,4);
});
test('editing either language invalidates review until both languages are explicitly acknowledged',async()=>{
  const pair=await markReviewed({ar:'النص العربي',en:'English text'});
  assert.deepEqual(await reviewErrors(pair),[]);
  assert.equal((await reviewErrors({...pair,ar:'نص جديد'})).length,1);
  assert.equal((await reviewErrors({...pair,en:'New English'})).length,1);
  assert.equal((await reviewErrors({...pair,en:''})).length,1);
  assert.deepEqual(await reviewErrors(await markReviewed({...pair,ar:'نص جديد'})),[]);
  assert.notEqual(await fingerprint(pair),await fingerprint({...pair,ar:'نص جديد'}));
});
test('contact actions are derived from a validated number, not independent editable links',()=>{
  assert.deepEqual(phoneLinks('+966551615518'),{tel:'tel:+966551615518',whatsapp:'https://wa.me/966551615518'});
  for(const value of ['javascript:alert(1)','+966551615518?message=x','0551615518','+123456'])assert.throws(()=>phoneLinks(value));
  assert.ok(validateTime('08:00'));assert.ok(validateTime('17:00'));assert.equal(validateTime('25:60'),false);
});
test('images accept local approved paths or HTTPS Sanity CDN images only',()=>{
  assert.equal(safeAssetUrl('/images/logo.png'),'/images/logo.png');
  assert.ok(safeAssetUrl('https://cdn.sanity.io/images/abc/production/photo-100x100.jpg'));
  for(const value of ['javascript:alert(1)','https://evil.example/photo.png','//evil.example/photo.png','/images/../../private.png','http://cdn.sanity.io/images/a/p/x.png'])assert.throws(()=>safeAssetUrl(value));
});
test('signed draft sessions reject forgery, wrong tenant, expiry, malformed tokens and short signing keys',async()=>{
  const token=await createPreviewSession(secret,'project:production',1000);
  assert.ok(await verifyPreviewSession(token,secret,'project:production',1001));
  assert.equal(await verifyPreviewSession(token,secret,'other:production',1001),false);
  assert.equal(await verifyPreviewSession(token,secret,'project:production',4600),false);
  assert.equal(await verifyPreviewSession(token,secret,'project:production',900),false);
  assert.equal(await verifyPreviewSession(token.slice(0,-3)+'abc',secret,'project:production',1001),false);
  for(const bad of [undefined,'drafts','published','{}','a.b.c','a.!'])assert.equal(await verifyPreviewSession(bad,secret,'project:production',1001),false);
  await assert.rejects(()=>createPreviewSession('short','project:production',1000));
});
test('preview redirects are restricted to eight safe destinations and cookies protect the bearer session',()=>{
  assert.equal(safePreviewPath('/preview/en/services','https://site.example'),'/preview/en/services/');
  for(const value of ['https://evil.example/preview/ar/home/','//evil.example/preview/ar/home/','/contact/','/preview/ar/home/?token=secret','/preview/ar/home/#fragment','/preview/ar/unknown/'])assert.throws(()=>safePreviewPath(value,'https://site.example'));
  const cookie=previewCookie('example',true);assert.match(cookie,/HttpOnly/);assert.match(cookie,/Secure/);assert.match(cookie,/SameSite=None/);assert.match(cookie,/Partitioned/);assert.match(cookie,/Path=\/preview/);
  assert.match(previewCookie('',true,0),/Max-Age=0/);
});
