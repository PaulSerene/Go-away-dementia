/**
 * check-locales.js
 * Checks all locale files in src/locales/ against en.js
 * Identifies missing and extra keys.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.join(__dirname, '../src/locales');

async function checkLocales() {
  console.log('--- Locale Completeness Checker ---');
  
  // Load en.js as source of truth
  const enModule = await import(pathToFileURL(path.join(LOCALES_DIR, 'en.js')).href);
  const enKeys = Object.keys(enModule.default);
  const enKeySet = new Set(enKeys);
  
  console.log(`Source (en.js): ${enKeys.length} keys`);
  
  const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.js') && f !== 'en.js' && f !== 'index.js');
  
  for (const file of files) {
    try {
      const module = await import(pathToFileURL(path.join(LOCALES_DIR, file)).href);
      const localeObj = module.default;
      if (!localeObj || typeof localeObj !== 'object') {
        console.log(`[${file}] ❌ Failed to load default export.`);
        continue;
      }
      
      const localeKeys = Object.keys(localeObj);
      const localeKeySet = new Set(localeKeys);
      
      const missing = enKeys.filter(k => !localeKeySet.has(k));
      const extra = localeKeys.filter(k => !enKeySet.has(k));
      
      let status = '✅ OK';
      if (missing.length > 0 || extra.length > 0) {
        status = '⚠️ MISMATCH';
      }
      
      console.log(`\n[${file}] ${status}`);
      console.log(`  Total keys: ${localeKeys.length}`);
      
      if (missing.length > 0) {
        console.log(`  Missing (${missing.length}): ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' ...' : ''}`);
      }
      if (extra.length > 0) {
        console.log(`  Extra (${extra.length}): ${extra.slice(0, 5).join(', ')}${extra.length > 5 ? ' ...' : ''}`);
      }
      
    } catch (err) {
      console.log(`[${file}] ❌ Error parsing file:`, err.message);
    }
  }
}

checkLocales();
