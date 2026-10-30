import type { APIRoute } from 'astro';
export const prerender = true;
import { pageKeys, route } from '../content/site';
export const GET: APIRoute = ({ site }) => {
  const urls = (['ar', 'en'] as const).flatMap(locale => pageKeys.map(page => `<url><loc>${new URL(route(locale, page), site).href}</loc></url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
