import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dist = resolve('dist/client');
const routes = ['/', '/about/', '/services/', '/contact/', '/en/', '/en/about/', '/en/services/', '/en/contact/'];
const readPage = route => readFile(join(dist, route, 'index.html'), 'utf8');
const pages = new Map(await Promise.all(routes.map(async route => [route, await readPage(route)])));
const contactPattern = /551615518|55\s*161\s*5518|wa\.me|tel:/i;

test('eight bilingual pages have one main heading, correct direction and equivalent language links', () => {
  for (const [route, html] of pages) {
    const english = route.startsWith('/en');
    assert.match(html, new RegExp(`<html[^>]+lang="${english ? 'en' : 'ar'}"[^>]+dir="${english ? 'ltr' : 'rtl'}"`));
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
    const counterpart = english ? route.slice(3) || '/' : `/en${route}`;
    assert.ok(html.includes(`href="${counterpart}"`), `Missing equivalent language route on ${route}`);
    assert.match(html, /class="skip-link"[^>]+href="#main"/);
    assert.match(html, /<main[^>]+id="main"/);
  }
});

test('contact information and actions are exclusive to the two contact pages', () => {
  for (const [route, html] of pages) {
    if (route.endsWith('/contact/')) {
      assert.match(html, /href="tel:\+966551615518"/);
      assert.match(html, /href="https:\/\/wa\.me\/966551615518"/);
      assert.match(html, /الأحد إلى الخميس|Sunday to Thursday/);
    } else assert.doesNotMatch(html, contactPattern, route);
  }
});

test('no deferred claims, client-logo strip, forms, tracking scripts or public editor enter the pages', () => {
  for (const [route, html] of pages) {
    assert.doesNotMatch(html, /15[,.]?000|24\/7|10 business days|zero downtime|100% brand|الرئيس التنفيذي|client-logo|<form\b|googletagmanager|google-analytics|clarity\.ms|facebook\.net|<iframe\b/i, route);
    assert.doesNotMatch(html, /<script[^>]+src="https?:/i, route);
  }
});

test('all service anchors and project detail anchors exist in both languages', () => {
  const services = ['maintenance', 'interiors', 'construction', 'air-conditioning', 'supply', 'metal', 'glass', 'painting', 'signage', 'flooring', 'security', 'networks', 'waterproofing'];
  for (const prefix of ['', '/en']) {
    for (const key of services) assert.ok(pages.get(`${prefix}/services/`).includes(`id="${key}"`), `${prefix} ${key}`);
    for (const key of ['herra','canes','starbucks']) assert.ok(pages.get(`${prefix}/about/`).includes(`id="${key}"`));
  }
});

test('every internal page link, asset reference and fragment resolves in the production build', async () => {
  for (const [route, html] of pages) {
    for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      const value = match[1];
      if (!value.startsWith('/') && !value.startsWith('#')) continue;
      const url = new URL(value, `http://localhost${route}`);
      const isPage = url.pathname.endsWith('/');
      const file = join(dist, url.pathname, isPage ? 'index.html' : '');
      assert.ok((await stat(file)).isFile(), `${route} => ${value}`);
      if (url.hash) {
        const target = await readFile(file, 'utf8');
        assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route} => ${value}`);
      }
    }
  }
});

test('local review remains unindexed and sitemap contains exactly eight public content routes', async () => {
  for (const html of pages.values()) assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(await readFile(join(dist,'robots.txt'),'utf8'), /Disallow: \//);
  assert.equal(((await readFile(join(dist,'sitemap.xml'),'utf8')).match(/<url>/g)||[]).length, 8);
});

test('public JavaScript has no contact payload, stored language preference or secrets and stays small', async () => {
  const files = (await readdir(join(dist,'_astro'))).filter(file => file.endsWith('.js'));
  let bytes = 0;
  for (const file of files) {
    const source = await readFile(join(dist,'_astro',file),'utf8');
    bytes += Buffer.byteLength(source);
    assert.doesNotMatch(source, contactPattern);
    assert.doesNotMatch(source, /localStorage|sessionStorage|SANITY_API_READ_TOKEN|Bearer\s+[a-z0-9]{20}/i);
  }
  assert.ok(bytes < 60000, `Public JavaScript is ${bytes} bytes`);
});
