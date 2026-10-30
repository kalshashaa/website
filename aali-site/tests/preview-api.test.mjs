import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
let server;
const origin='http://127.0.0.1:4356';
before(async()=>{
  server=spawn(process.execPath,[resolve('dist/server/entry.mjs')],{cwd:process.cwd(),env:{...process.env,HOST:'127.0.0.1',PORT:'4356',CONTENT_SOURCE:'local',SANITY_PROJECT_ID:'',SANITY_DATASET:'',SANITY_API_READ_TOKEN:'',PREVIEW_SESSION_SECRET:'',ASTRO_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
  let output='';server.stdout.on('data',chunk=>output+=chunk);server.stderr.on('data',chunk=>output+=chunk);
  const deadline=Date.now()+20000;
  while(Date.now()<deadline){
    if(server.exitCode!==null)throw new Error(`Local test server exited: ${output.slice(-2000)}`);
    try{const response=await fetch(origin);if(response.status===200)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,150));
  }
  throw new Error(`Local test server did not become ready: ${output.slice(-2000)}`);
});
after(()=>{server?.kill();});
test('unconfigured enable route reports unavailable instead of opening an unsafe preview',async()=>{
  const response=await fetch(`${origin}/api/preview/enable/`);
  assert.equal(response.status,503);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/);
  assert.equal(response.headers.get('set-cookie'),null);
});
test('anonymous and forged-cookie preview requests cannot retrieve draft content',async()=>{
  for(const cookie of ['', 'sanity-preview-perspective=drafts', 'aali_preview_session=forged']){
    const response=await fetch(`${origin}/preview/ar/home/`,{headers:{cookie}});
    assert.equal(response.status,401);
    assert.equal(response.headers.get('cache-control'),'private, no-store');
    assert.match(response.headers.get('content-security-policy')||'',/frame-ancestors 'self' http:\/\/127\.0\.0\.1:3333/);
    assert.doesNotMatch(await response.text(),/SANITY_API_READ_TOKEN|Bearer /);
  }
});
test('unknown preview routes fail and logout rejects cross-origin submissions',async()=>{
  assert.equal((await fetch(`${origin}/preview/ar/unknown/`)).status,404);
  assert.equal((await fetch(`${origin}/api/preview/disable/`,{method:'POST',headers:{Origin:'https://evil.example'},redirect:'manual'})).status,403);
  const response=await fetch(`${origin}/api/preview/disable/`,{method:'POST',headers:{Origin:origin},redirect:'manual'});
  assert.equal(response.status,303,await response.text());
  assert.match(response.headers.get('set-cookie')||'',/Max-Age=0/);
  assert.equal(response.headers.get('location'),'/');
});
