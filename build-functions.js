// build-functions.js
import { build } from 'esbuild';
import fs from 'fs';

fs.mkdirSync('netlify-built/functions', { recursive: true });

build({
  entryPoints: ['netlify/functions/ask.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: 'netlify-built/functions/ask.js',
  external: ['franc'], // если нужно исключить node_modules — по желанию
}).then(() => {
  console.log('✅ Backend function built');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
