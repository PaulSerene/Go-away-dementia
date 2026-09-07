/**
 * src/utils/translationChecker.js — Development-time translation coverage tool
 *
 * Usage (browser console or dev build only):
 *   import { checkTranslationCoverage } from './utils/translationChecker.js';
 *   checkTranslationCoverage().then(console.log);
 *
 * Compares all locale files against en.js to find:
 *   - Missing keys (key in en but not in locale)
 *   - Extra keys (key in locale but not in en)
 *
 * Does NOT run in production builds (returns empty result if NODE_ENV === 'production').
 * Does NOT throw — always returns safely.
 *
 * This file is for development auditing only.
 */

/**
 * Checks all locale files for missing/extra keys relative to English source.
 * @returns {Promise<Object>} Coverage report
 */
export async function checkTranslationCoverage() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return { skipped: 'Production build — checker disabled.' };
  }

  const LOCALES = ['as', 'bn', 'mni', 'lus', 'kha', 'grt', 'brx', 'ne', 'hi', 'te'];

  let enKeys;
  try {
    const enMod = await import('../locales/en.js');
    enKeys = new Set(Object.keys(enMod.default));
  } catch (e) {
    console.warn('[translationChecker] Could not load en.js:', e);
    return { error: 'Could not load en.js' };
  }

  const report = {
    totalEnKeys: enKeys.size,
    locales: {},
    summary: [],
  };

  for (const code of LOCALES) {
    try {
      const mod = await import(`../locales/${code}.js`);
      const localeKeys = new Set(Object.keys(mod.default));

      const missing = [...enKeys].filter(k => !localeKeys.has(k));
      const extra   = [...localeKeys].filter(k => !enKeys.has(k));
      const covered = enKeys.size - missing.length;
      const pct     = Math.round((covered / enKeys.size) * 100);

      report.locales[code] = {
        coverage: `${pct}%`,
        coveredKeys: covered,
        totalKeys: enKeys.size,
        missingCount: missing.length,
        extraCount: extra.length,
        missing,
        extra,
      };

      report.summary.push(`${code}: ${pct}% (${covered}/${enKeys.size} keys, ${missing.length} missing)`);
    } catch (e) {
      report.locales[code] = { error: `Could not load ${code}.js`, missing: [...enKeys] };
      report.summary.push(`${code}: MISSING FILE`);
    }
  }

  return report;
}

/**
 * Log translation coverage to console.
 * Call this from browser devtools during development.
 */
export async function logTranslationCoverage() {
  const report = await checkTranslationCoverage();
  console.group('[Memora] Translation Coverage Report');
  console.log(`English source keys: ${report.totalEnKeys}`);
  console.log('');
  if (report.summary) {
    report.summary.forEach(s => console.log(s));
  }
  console.log('');
  console.log('Full report:', report);
  console.groupEnd();
  return report;
}
