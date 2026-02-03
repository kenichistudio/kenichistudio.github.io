// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import mdx from '@astrojs/mdx';

// Detect environment
const isGhPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://kenichistudio.github.io', 
  // Vercel uses root '/', GitHub Pages uses '/kenichi/'
  base: isGhPages ? '/home/' : '/',
  integrations: [react(), tailwind(), mdx()]
});
