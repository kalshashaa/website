export const previewCookieName = 'aali_preview_session';
const encoder = new TextEncoder();
function encode(bytes:Uint8Array):string { return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function decode(text:string):Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]+$/.test(text)) throw new Error('Invalid encoding');
  const decoded=atob(text.replace(/-/g,'+').replace(/_/g,'/'));
  const bytes=new Uint8Array(decoded.length);
  for(let i=0;i<decoded.length;i++)bytes[i]=decoded.charCodeAt(i);
  return bytes;
}
async function key(secret:string) {
  if (secret.length<32) throw new Error('Preview signing secret is not configured');
  return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
export async function createPreviewSession(secret:string,audience:string,now=Math.floor(Date.now()/1000)):Promise<string> {
  const payload=encode(encoder.encode(JSON.stringify({version:1,audience,issuedAt:now,expiresAt:now+3600,nonce:crypto.randomUUID()})));
  return `${payload}.${encode(new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret),encoder.encode(payload))))}`;
}
export async function verifyPreviewSession(token:string|undefined,secret:string,audience:string,now=Math.floor(Date.now()/1000)):Promise<boolean> {
  try {
    if (!token||token.length>2048) return false;
    const parts=token.split('.'); if (parts.length!==2) return false;
    if (!await crypto.subtle.verify('HMAC',await key(secret),decode(parts[1]),encoder.encode(parts[0]))) return false;
    const payload=JSON.parse(new TextDecoder().decode(decode(parts[0])));
    return payload.version===1&&payload.audience===audience&&Number.isInteger(payload.issuedAt)&&Number.isInteger(payload.expiresAt)&&payload.issuedAt<=now+30&&payload.expiresAt>now&&payload.expiresAt-payload.issuedAt===3600;
  } catch { return false; }
}
export function safePreviewPath(value:string|undefined,origin:string):string {
  if (!value) return '/preview/ar/home/';
  const url=new URL(value,origin);
  const path=url.pathname.endsWith('/')?url.pathname:`${url.pathname}/`;
  if (url.origin!==origin||url.search||url.hash||!/^\/preview\/(ar|en)\/(home|about|services|contact)\/$/.test(path)) throw new Error('Invalid preview destination');
  return path;
}
export function previewCookie(token:string,https:boolean,maxAge=3600):string {
  return `${previewCookieName}=${token}; Path=/preview; HttpOnly; Max-Age=${maxAge}; ${https?'Secure; SameSite=None; Partitioned':'SameSite=Lax'}`;
}
export function isLoopback(url:URL):boolean { return ['127.0.0.1','localhost','[::1]'].includes(url.hostname); }
