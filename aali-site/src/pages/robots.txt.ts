import type { APIRoute } from 'astro';
export const prerender = true;
export const GET: APIRoute = () => new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
// Local review build stays unindexed. Replace only at authorized public launch.
