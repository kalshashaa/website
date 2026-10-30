import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],envPrefix:['VITE_','SANITY_STUDIO_'],server:{host:'127.0.0.1',port:3333,strictPort:true},build:{outDir:'dist'}});
