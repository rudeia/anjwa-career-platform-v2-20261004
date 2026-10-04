const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
const allowed = new Set(['.csv', '.html', '.css', '.js', '.json', '.webmanifest', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.pdf', '.woff', '.woff2']);
function copy(dir, target) {
 for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  if (entry.name.startsWith('.') || entry.name.startsWith('검증-') || ['dist','tests','scripts','node_modules','검토'].includes(entry.name)) continue;
  const source = path.join(dir, entry.name), dest = path.join(target, entry.name);
  if (entry.isDirectory()) { fs.mkdirSync(dest, { recursive: true }); copy(source, dest); }
  else if (allowed.has(path.extname(entry.name)) && !['package.json','vercel.json'].includes(entry.name)) fs.copyFileSync(source, dest);
 }
}
copy(root, out);
console.log('Static app built in dist');
