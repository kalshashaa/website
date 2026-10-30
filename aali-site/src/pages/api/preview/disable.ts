import type { APIRoute } from 'astro';
import { previewCookie, isLoopback } from '../../../../shared/preview-security';
export const prerender=false;
export const POST:APIRoute=({request})=>{
  const url=new URL(request.url);
  if (request.headers.get('origin')!==url.origin||url.protocol!=='https:'&&!isLoopback(url)) return new Response('Invalid origin',{status:403});
  const headers=new Headers({Location:'/','Cache-Control':'private, no-store'});
  headers.append('Set-Cookie',previewCookie('',url.protocol==='https:',0));
  // Clear both partitioned and non-partitioned cookies when using HTTPS.
  if (url.protocol==='https:') headers.append('Set-Cookie',previewCookie('',true,0).replace('; Partitioned',''));
  return new Response(null,{status:303,headers});
};
