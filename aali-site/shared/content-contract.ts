export type Pair = { ar: string; en: string; reviewHash?: string };
export function copyKey(value: string): string {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  return `text_${(hash >>> 0).toString(16)}`;
}
export async function fingerprint(pair: Pick<Pair, 'ar' | 'en'>): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([pair.ar, pair.en])));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}
export function isPair(value: unknown): value is Pair {
  return !!value && typeof value === 'object' && 'ar' in value && 'en' in value;
}
export async function reviewErrors(value: unknown, path = 'content'): Promise<string[]> {
  if (isPair(value)) {
    if (typeof value.ar !== 'string' || !value.ar.trim() || typeof value.en !== 'string' || !value.en.trim()) return [`${path}: both languages are required`];
    if (value.ar.length > 6000 || value.en.length > 6000) return [`${path}: text is too long`];
    return value.reviewHash === await fingerprint(value) ? [] : [`${path}: counterpart review is required`];
  }
  if (Array.isArray(value)) return (await Promise.all(value.map((child, i) => reviewErrors(child, `${path}[${i}]`)))).flat();
  if (value && typeof value === 'object') return (await Promise.all(Object.entries(value).filter(([key]) => !key.startsWith('_')).map(([key, child]) => reviewErrors(child, `${path}.${key}`)))).flat();
  return [];
}
export async function markReviewed<T>(value: T): Promise<T> {
  if (isPair(value)) return { ...value, reviewHash: await fingerprint(value) };
  if (Array.isArray(value)) return await Promise.all(value.map(markReviewed)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, child]) => [key, await markReviewed(child)]))) as T;
  return value;
}

export function validatePhone(value: unknown): value is string {
  return typeof value === 'string' && /^\+9665\d{8}$/.test(value);
}
export function validateTime(value: unknown): value is string {
  return typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}
export function phoneLinks(value: string) {
  if (!validatePhone(value)) throw new Error('Invalid Saudi mobile number');
  return { tel: `tel:${value}`, whatsapp: `https://wa.me/${value.slice(1)}` };
}

export function safeAssetUrl(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Invalid image URL');
  if (/^\/images\/[a-zA-Z0-9_-]+\.(png|webp|jpe?g)$/.test(value)) return value;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || !url.pathname.startsWith('/images/')) throw new Error('Untrusted image host');
  return url.href;
}
