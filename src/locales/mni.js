/**
 * src/locales/mni.js — Manipuri / Meitei (মৈতৈলোন্) translations for Memora
 *
 * IMPORTANT: Manipuri (Meitei) uses both the Meitei Mayek script and
 * Bengali script. The Bengali script form is used here for wider
 * font compatibility. Meitei Mayek forms require dedicated font support.
 *
 * Translation quality: LOW CONFIDENCE — requires expert Meitei speaker review.
 * DO NOT use in production without native-speaker validation.
 * English fallback is the safe choice for all uncertain strings.
 *
 * Only high-confidence, simple terms are translated here.
 * All other strings intentionally omitted — they will fall back to English.
 */

const mni = {
  'app.name':                  'Memora',

  /* Navigation — simple directional words */
  'nav.back':                  '← নুংঙাই',
  'nav.close':                 'থিংবা',

  /* Common actions */
  'game.btn.begin':            'শুরু করুন',  // Bengali script fallback
  'game.btn.ready':            "মই তৈয়ার",
  'game.btn.next':             'অসিগুম →',
  'game.btn.playAgain':        '🔄 নত্তনা লেই',

  /* Greeting time periods */
  'home.greeting.morning':     'নুংতি',
  'home.greeting.afternoon':   'নুমিৎ',
  'home.greeting.evening':     'সন্দ্রেন',

  /* Accessibility — basic labels */
  'a11y.text.normal':          'নৰ্মেল',
  'a11y.text.large':           'চহন',
  'a11y.contrast.on':          'চালু',
  'a11y.contrast.off':         'বন্ধ',
  'a11y.motion.on':            'চালু',
  'a11y.motion.off':           'বন্ধ',

  /* Language picker */
  'lang.picker.selected':      '✓ সেলেক্ট',

  /* Feedback */
  'game.feedback.correct':     '✅ থুনা! চাউখিবা!',
  'game.feedback.tryAgain':    '💪 চাউখিবা ত্রাই! থবক চালু করো।',

  // NOTE: All other strings use English fallback.
  // This is intentional and documented.
  // A native Meitei speaker must review and complete this file.
};

export default mni;
