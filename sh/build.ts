import "zx/globals";

async function main() {
	await $`rm -rf dist`;
	await $`tsc --project tsconfig.build.json`;

	const flags = ["--bundle", "--external:react"];

	await $`esbuild src/index.ts --outfile=dist/index.cjs ${flags}`;
	await $`esbuild src/index.ts --format=esm --outfile=dist/index.mjs ${flags}`;

	await $`cp src/use-combo-box.d.ts dist/use-combo-box.d.ts`;
}

main();
