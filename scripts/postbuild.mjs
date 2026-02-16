import { copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'out');

const copies = [
  ['public/CNAME', 'CNAME'],
  ['public/.nojekyll', '.nojekyll'],
  ['public/llms.txt', 'llms.txt'],
  ['public/llms-full.txt', 'llms-full.txt'],
];

for (const [src, dest] of copies) {
  const srcPath = join(ROOT, src);
  const destPath = join(OUT, dest);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log(`  Copied ${src} → out/${dest}`);
  }
}
