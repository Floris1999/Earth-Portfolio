import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import transformer from './node_modules/my-library/plugins/svelteTransformer';
import server from './node_modules/my-library/plugins/server';

export default defineConfig({
	plugins: [
		transformer(),
		server(),
		sveltekit()
	]
});
