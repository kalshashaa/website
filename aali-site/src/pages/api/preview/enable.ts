import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { cmsClient, cmsConfig } from '../../../cms/content';
import { createPreviewSession, safePreviewPath, previewCookie, isLoopback } from '../../../../shared/preview-security';
export const prerender=false;
export const GET:APIRoute=async ({request})=>{
  const url=new URL(request.url);
  if (url.protocol!=='https:'&&!isLoopback(url)) return new Response('HTTPS required',{status:400});
  const config=cmsConfig(); const secret=getSecret('PREVIEW_SESSION_SECRET')||'';
  if (!config.configured||!getSecret('SANITY_API_READ_TOKEN')||secret.length<32) return new Response('المعاينة الخاصة تحتاج إلى ربط حساب الإدارة أولًا.',{status:503});
  try {
    const {isValid,redirectTo}=await validatePreviewUrl(cmsClient(true),request.url);
    if (!isValid) return new Response('غير مصرح بالمعاينة.',{status:401});
    const destination=safePreviewPath(redirectTo,url.origin);
    const token=await createPreviewSession(secret,`${config.projectId}:${config.dataset}`);
    return new Response(null,{status:303,headers:{Location:destination,'Set-Cookie':previewCookie(token,url.protocol==='https:'),'Cache-Control':'private, no-store'}});
  } catch { return new Response('تعذر تفعيل المعاينة. ارجع إلى لوحة الإدارة وحاول مجددًا.',{status:401}); }
};
