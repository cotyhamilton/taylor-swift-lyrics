import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	...svelte.configs["flat/prettier"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ["build/", ".svelte-kit/", "dist/"]
	},
	{
		/* location of your components where you would like to apply these rules  */
		files: ["**/components/ui/**/*.svelte"],
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"off",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^$$(Props|Events|Slots|Generic)$"
				}
			]
		}
	}
];
