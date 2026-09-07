/**
 * src/locales/as.js — Assamese (অসমীয়া) translations for Memora
 *
 * Translation quality: Best-effort elderly-friendly Assamese.
 * All strings require native-speaker review before production use.
 * Falls back to English for any missing key.
 */

const as = {
  /* ── APP / GLOBAL ─────────────────────────────────────────── */
  'app.name':                  'Memora',
  'app.tagline':               'AI জ্ঞানমূলক আৰু স্মৃতি সঙ্গী',
  'app.badge':                 'SIH 2026 · উত্তৰ-পূব ভাৰত',

  /* ── OFFLINE BANNER ──────────────────────────────────────── */
  'offline.banner':            '📵 অফলাইন — পৰিৱৰ্তনসমূহ স্থানীয়ভাৱে সংৰক্ষিত হৈছে আৰু পুনৰায় সংযুক্ত হ\'লে সমকালীন হ\'ব।',

  /* ── LANDING ─────────────────────────────────────────────── */
  'landing.heading':           'Memoraলৈ আপোনাক স্বাগতম',
  'landing.subheading':        'এটা কোমল স্মৃতি আৰু জ্ঞানমূলক কল্যাণ সঙ্গী।',
  'landing.disclaimer':        'Memora জ্ঞানমূলক কল্যাণ আৰু স্মৃতি অভ্যাসৰ কাৰ্যকলাপ প্ৰদান কৰে। ই কোনো চিকিৎসা নিদান বা চিকিৎসা সঁজুলি নহয়।',
  'landing.patient.title':     'ৰোগী মোড',
  'landing.patient.desc':      'বৃদ্ধ ব্যৱহাৰকাৰীসকলৰ বাবে জ্ঞানমূলক কাৰ্যকলাপ, স্মৃতি খেল আৰু দৈনিক স্মৰণিকা।',
  'landing.caregiver.title':   'পৰিচৰ্যাকাৰী মোড',
  'landing.caregiver.desc':    'অগ্ৰগতি পৰ্যবেক্ষণ কৰক, পৰিচৰ্যা পৰিকল্পনা পৰিচালনা কৰক আৰু আপোনাৰ প্ৰিয়জনৰ সৈতে সংযুক্ত থাকক।',
  'landing.select':            'মোড বাছক',

  /* ── NAVIGATION ──────────────────────────────────────────── */
  'nav.back':                  '← উভতি যাওক',
  'nav.home':                  '← Memora হোম',
  'nav.patientHome':           '← ৰোগীৰ হোম',
  'nav.games':                 '← খেলসমূহ',
  'nav.close':                 'বন্ধ কৰক',

  /* ── PATIENT HOME ─────────────────────────────────────────── */
  'home.greeting':             'শুভ {timeOfDay}, {name} ❤️',
  'home.greeting.morning':     'পুৱা',
  'home.greeting.afternoon':   'দুপৰীয়া',
  'home.greeting.evening':     'সন্ধিয়া',
  'home.sub':                  'আজিৰ দিনটো ভালে কৰি পাৰ কৰো আহক।',
  'home.todayActivity.tag':    "আজিৰ কাৰ্যকলাপ",
  'home.todayActivity.title':  'স্মৃতি মিলান',
  'home.todayActivity.desc':   'আজিৰ বাবে এটা চমু সাংস্কৃতিক ছবি স্মৃতি কাৰ্যকলাপ।',
  'home.todayActivity.btn':    '▶ কাৰ্যকলাপ আৰম্ভ কৰক',
  'home.allActivities.tag':    'সকলো কাৰ্যকলাপ',
  'home.allActivities.title':  'সকলো খেল',
  'home.allActivities.desc':   'শব্দ শৃংখল, কাহিনী, গতিবিধি, পথ অনুসৰণকাৰী আৰু আৰু বহুত!',
  'home.allActivities.btn':    '🎮 সকলো কাৰ্যকলাপ চাওক',
  'home.memories.tag':         'মোৰ স্মৃতিসমূহ',
  'home.memories.title':       'স্মৃতি এলবাম',
  'home.memories.desc':        'আপোনাৰ বিশেষ মুহূৰ্ত আৰু ফটোসমূহ পুনৰ চাওক।',
  'home.memories.btn':         '📖 স্মৃতিসমূহ চাওক',
  'home.memories.none':        'এতিয়াও কোনো স্মৃতি নাই। আপোনাৰ পৰিচৰ্যাকাৰীয়ে সেইবোৰ যোগ কৰিব পাৰে।',
  'home.reminders.tag':        "আজিৰ স্মৰণিকা",
  'home.reminders.title':      "আজিৰ স্মৰণিকা",
  'home.reminders.none':       'আজি কোনো স্মৰণিকা নাই। আপোনাৰ দিনটো উপভোগ কৰক! 😊',
  'home.reminders.count':      'আজি {total}ৰ ভিতৰত {count}টা সম্পূৰ্ণ হৈছে',
  'home.reminders.btn':        '📋 সকলো স্মৰণিকা চাওক',
  'home.reminders.done':       'সম্পূৰ্ণ',

  /* ── PATIENT PROGRESS ──────────────────────────────────────── */
  'progress.title':            'মোৰ অগ্ৰগতি',
  'progress.back':             '← ৰোগীৰ হোম',
  'progress.heading':          "আপোনাৰ অগ্ৰগতি",
  'progress.subheading':       'এনেকৈয়ে চালিত থাকক!',
  'progress.totalGames':       'খেলা খেলসমূহ',
  'progress.avgAccuracy':      'গড় নিখুঁততা',
  'progress.bestAccuracy':     'সৰ্বোত্তম স্কোৰ',
  'progress.currentLevel':     'বৰ্তমান স্তৰ',
  'progress.recentActivity':   'সাম্প্ৰতিক কাৰ্যকলাপ',
  'progress.noActivity':       "এতিয়াও কোনো কাৰ্যকলাপ নাই।",
  'progress.noActivity.sub':   "আহক প্ৰথম খেলটো আৰম্ভ কৰোঁ!",
  'progress.noActivity.btn':   "▶ এটা কাৰ্যকলাপ আৰম্ভ কৰক",
  'progress.accuracy':         '{value}% নিখুঁততা',
  'progress.correct':          '{correct}/{total} শুদ্ধ',

  /* ── PATIENT MEMORIES ──────────────────────────────────────── */
  'memories.title':            'মোৰ স্মৃতিসমূহ',
  'memories.back':             '← ৰোগীৰ হোম',
  'memories.heading':          'মোৰ স্মৃতিসমূহ',
  'memories.empty':            'এতিয়াও কোনো স্মৃতি নাই।',
  'memories.empty.sub':        'আপোনাৰ পৰিচৰ্যাকাৰীয়ে আপোনাৰ বাবে বিশেষ স্মৃতি আৰু ফটো যোগ কৰিব পাৰে।',
  'memories.categories.all':   'সকলো',
  'memories.favourite':        'প্ৰিয়',

  /* ── PATIENT REMINDERS ─────────────────────────────────────── */
  'reminders.title':           "আজিৰ স্মৰণিকা",
  'reminders.back':            '← ৰোগীৰ হোম',
  'reminders.heading':         "আজিৰ স্মৰণিকা",
  'reminders.empty':           'আজিৰ বাবে কোনো স্মৰণিকা নাই।',
  'reminders.empty.sub':       'আপোনাৰ পৰিচৰ্যাকাৰীয়ে আপোনাৰ বাবে স্মৰণিকা যোগ কৰিব পাৰে।',
  'reminders.markDone':        '✓ সম্পূৰ্ণ চিহ্নিত কৰক',
  'reminders.done':            '✓ সম্পূৰ্ণ',
  'reminders.doneMsg':         'বহুত ভালে! ❤️',

  /* ── GAMES HUB ────────────────────────────────────────────── */
  'hub.title':                 'জ্ঞানমূলক কাৰ্যকলাপ',
  'hub.heading':               'সকলো কাৰ্যকলাপ',
  'hub.sub':                   'এটা কাৰ্যকলাপ বাছক। সময় লওক।',
  'hub.back':                  '← ৰোগীৰ হোম',
  'hub.cat.memory':            'স্মৃতি খেলসমূহ',
  'hub.cat.attention':         'মনোযোগ আৰু স্থানিক',
  'hub.cat.movement':          'গতিবিধি',
  'hub.cat.music':             'সংগীত',
  'hub.start':                 'আৰম্ভ কৰক',

  /* ── SHARED GAME UI ────────────────────────────────────────── */
  'game.level.easy':           'সহজ',
  'game.level.moderate':       'মধ্যম',
  'game.level.challenging':    'কঠিন',
  'game.level.advanced':       'উন্নত',
  'game.level.label':          'স্তৰ {n}',
  'game.btn.begin':            'আৰম্ভ কৰক',
  'game.btn.ready':            "মই প্ৰস্তুত",
  'game.btn.next':             'পৰৱৰ্তী →',
  'game.btn.playAgain':        '🔄 পুনৰ খেলক',
  'game.btn.backToGames':      '← খেলসমূহলৈ উভতি',
  'game.complete.title':       'কাৰ্যকলাপ সম্পূৰ্ণ!',
  'game.feedback.correct':     '✅ শুদ্ধ! বহুত ভালে!',
  'game.feedback.tryAgain':    '💪 ভালে প্ৰচেষ্টা! চালি থাকক।',
  'game.nextLevel.up':         'অসাধাৰণ! 🌟 পৰৱৰ্তী কাৰ্যকলাপ অলপ অধিক কঠিন হ\'ব।',
  'game.nextLevel.down':       'চানেকি প্ৰচেষ্টা! 💪 পৰৱৰ্তী কাৰ্যকলাপ অলপ সহজ হ\'ব।',
  'game.nextLevel.same':       'বহুত ভালে! 🌸 আমি এই স্তৰত পুনৰ অভ্যাস কৰিম।',

  /* ── ACCESSIBILITY ──────────────────────────────────────────── */
  'a11y.settings.heading':     'প্ৰদৰ্শন সংস্থাপন',
  'a11y.settings.close':       'বন্ধ কৰক',
  'a11y.text.label':           'লিখনীৰ আকাৰ',
  'a11y.text.normal':          'সাধাৰণ',
  'a11y.text.large':           'ডাঙৰ',
  'a11y.contrast.label':       'উচ্চ কনট্ৰাষ্ট',
  'a11y.contrast.on':          'চালু',
  'a11y.contrast.off':         'বন্ধ',
  'a11y.motion.label':         'গতি হ্ৰাস কৰক',
  'a11y.motion.on':            'চালু',
  'a11y.motion.off':           'বন্ধ',
  'a11y.settings.btn':         '⚙ প্ৰদৰ্শন',

  /* ── LANGUAGE PICKER ─────────────────────────────────────────── */
  'lang.picker.heading':       'ভাষা বাছক',
  'lang.picker.close':         'বন্ধ কৰক',
  'lang.picker.selected':      '✓ বাছনি কৰা হৈছে',

  /* ── READ ALOUD ──────────────────────────────────────────────── */
  'readAloud.btn.speak':       '🔊 জোৰে পঢ়ক',
  'readAloud.btn.stop':        '⏹ ৰোক',

  /* ── LOADING / EMPTY / ERROR ──────────────────────────────────── */
  'loading':                   'লোড হৈছে…',
  'error.generic':             'কিবা সমস্যা হ\'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
  'empty.generic':             'এতিয়াৰ বাবে ইয়াত একো নাই।',

  /* ── CAREGIVER ────────────────────────────────────────────────── */
  'caregiver.title':           'পৰিচৰ্যাকাৰী ড্যাশব\'ৰ্ড',
  'caregiver.back':            '← Memora হোম',
  'caregiver.nav.dashboard':   'ড্যাশব\'ৰ্ড',
  'caregiver.nav.memories':    'স্মৃতিসমূহ',
  'caregiver.nav.reminders':   'স্মৰণিকা',
  'caregiver.disclaimer':      '⚕️ পৰিসংখ্যাসমূহ জ্ঞানমূলক কল্যাণ পৰ্যবেক্ষণ — চিকিৎসা নিদান নহয়।',
};

export default as;
