#!/usr/bin/env bash
set -euo pipefail

main() {
  rm -rf dist

  tsc --build tsconfig.build.json
  cp src/combhook.d.ts dist/combhook.d.ts
  rm dist/helpers.js dist/helpers.d.ts dist/index.js dist/*.tsbuildinfo

  esbuild src/index.ts \
    --bundle \
    --external:react \
    --format=esm \
    --minify \
    --outfile=dist/index.esm.js

  esbuild src/index.ts \
    --bundle \
    --external:react \
    --format=cjs \
    --minify \
    --outfile=dist/index.cjs.js
}

main
