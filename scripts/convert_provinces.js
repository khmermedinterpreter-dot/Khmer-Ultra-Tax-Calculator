// scripts/convert_provinces.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const provincesDir = path.resolve(__dirname, '../data/provinces');
fs.readdirSync(provincesDir).forEach(file => {
  if (file.endsWith('.ts')) {
    const tsPath = path.join(provincesDir, file);
    const content = fs.readFileSync(tsPath, 'utf-8');
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) return;
    const objectLiteral = content.slice(startIdx, endIdx + 1);
    const jsonPath = path.join(provincesDir, file.replace(/\.ts$/, '.json'));
    fs.writeFileSync(jsonPath, objectLiteral, 'utf-8');
    console.log(`Converted ${file} → ${path.basename(jsonPath)}`);
  }
});
