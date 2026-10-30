import { defineMiddleware } from 'astro:middleware';
import { getSecret } from 'astro:env/server';
export const onRequest=defineMiddleware(async (context,next)=>{
  const response=await next();
  const isPreview=context.url.pathname.startsWith('/preview/')||context.url.pathname.startsWith('/api/preview/');
  const headers=response.headers;
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy',isPreview?'no-referrer':'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  if(isPreview){headers.set('Cache-Control','private, no-store');headers.set('X-Robots-Tag','noindex, nofollow');}
  let studioOrigin='';
  try {
    const value=new URL(getSecret('STUDIO_ORIGIN')||'http://127.0.0.1:3333');
    if(value.protocol==='https:'||['127.0.0.1','localhost'].includes(value.hostname)) studioOrigin=value.origin;
  } catch { /* Fail closed: no external framing. */ }
  const frames=isPreview&&studioOrigin?`'self' ${studioOrigin}`:"'none'";
  if(!import.meta.env.DEV){
    headers.set('Content-Security-Policy',`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.sanity.io; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors ${frames}`);
  }
  return response;
});
