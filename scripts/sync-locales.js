/**
 * sync-locales.js
 * Implementation of Phase 4 and Phase 6 (dry-run).
 * Reads en.js, finds missing keys in all other locales, and appends them
 * with their English values and a needs-review comment.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.join(__dirname, '../src/locales');

async function syncLocales() {
  console.log('--- Locale Sync (Phase 4 / Phase 6) ---');
  
  // Load en.js as source of truth
  const enModule = await import(pathToFileURL(path.join(LOCALES_DIR, 'en.js')).href);
  const enDict = enModule.default;
  const enKeys = Object.keys(enDict);
  
  const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.js') && f !== 'en.js' && f !== 'index.js');
  
  for (const file of files) {
    try {
      const module = await import(pathToFileURL(path.join(LOCALES_DIR, file)).href);
      const localeObj = module.default;
      
      const localeKeys = Object.keys(localeObj);
      const localeKeySet = new Set(localeKeys);
      
      const missing = enKeys.filter(k => !localeKeySet.has(k));
      
      if (missing.length === 0) {
        console.log(`[${file}] ✅ Up to date.`);
        continue;
      }
      
      console.log(`[${file}] ⚠️ ${missing.length} missing keys. Syncing...`);
      
      // We will append to the file textually
      const filePath = path.join(LOCALES_DIR, file);
      let fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Find the closing brace of the locale object
      const closeBraceRegex = /};\s*export default [a-zA-Z0-9_]+;/m;
      const match = fileContent.match(closeBraceRegex);
      
      if (!match) {
        console.log(`[${file}] ❌ Could not find closing brace to append keys.`);
        continue;
      }
      
      // Generate new lines
      let newLines = '\n  /* ── AUTO-SYNCED KEYS (Phase 4) ────────────────────────────────── */\n';
      for (const key of missing) {
        const val = enDict[key];
        // escape quotes
        const safeVal = val.replace(/'/g, "\\'").replace(/\n/g, "\\n");
        newLines += `  '${key}': '${safeVal}', /* needs-review */\n`;
      }
      
      // Replace closing brace
      const updatedContent = fileContent.replace(closeBraceRegex, newLines + match[0]);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(`[${file}] ✅ Synced ${missing.length} keys.`);
      
    } catch (err) {
      console.log(`[${file}] ❌ Error:`, err.message);
    }
  }
}

syncLocales();
