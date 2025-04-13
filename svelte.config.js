import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { 
		adapter: vercel({
			runtime: 'nodejs20.x',
			// Allow larger payload sizes
			maxDuration: 60
		}),
		// Allow using fs to write logs
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
