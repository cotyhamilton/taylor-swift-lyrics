import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-node";
import fs from "node:fs";
import path from "node:path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: (() => {
			const nodeAdapter = adapter();
			return {
				...nodeAdapter,
				adapt: async (builder) => {
					await nodeAdapter.adapt(builder);
					// copy deno.json, deno.lock after the build is complete
					fs.copyFileSync(
						path.join(process.cwd(), "deno.json"),
						path.join(process.cwd(), "build/deno.json")
					);
					fs.copyFileSync(
						path.join(process.cwd(), "deno.lock"),
						path.join(process.cwd(), "build/deno.lock")
					);
				}
			};
		})()
	}
};

export default config;
