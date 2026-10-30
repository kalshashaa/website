import { defineConfig } from 'astro/config';
const adapter = process.env.DEPLOY_TARGET === 'cloudflare'
  ? (await import('@astrojs/cloudflare')).default({prerenderEnvironment:'node'})
  : (await import('@astrojs/node')).default({mode:'standalone'});

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  trailingSlash: 'always',
  output: 'server',
  adapter,
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
  security: {
    allowedDomains: process.env.PUBLIC_SITE_URL
      ? [{hostname:new URL(process.env.PUBLIC_SITE_URL).hostname}]
      : [{hostname:'127.0.0.1',protocol:'http'},{hostname:'localhost',protocol:'http'}],
  },
});
