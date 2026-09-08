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

  /* ── AUTO-SYNCED KEYS (Phase 4) ────────────────────────────────── */
  'progress.gameType.memory-match': 'Memory Match', /* needs-review */
  'progress.gameType.word-chain': 'Word Chain', /* needs-review */
  'progress.gameType.movement': 'Movement', /* needs-review */
  'progress.gameType.story-recall': 'Story Recall', /* needs-review */
  'progress.gameType.rearrange': 'Remember the Room', /* needs-review */
  'progress.gameType.music-memory': 'Music Memory', /* needs-review */
  'progress.gameType.remember-me': 'RememberMe', /* needs-review */
  'progress.gameType.path-tracer': 'PathTracer', /* needs-review */
  'progress.date': '{date}', /* needs-review */
  'memories.categories.family': 'Family', /* needs-review */
  'memories.categories.places': 'Places', /* needs-review */
  'memories.categories.events': 'Events', /* needs-review */
  'memories.categories.specialMoments': 'Special Moments', /* needs-review */
  'memories.date': '{date}', /* needs-review */
  'memories.count.one': '1 memory', /* needs-review */
  'memories.count.many': '{count} memories', /* needs-review */
  'memories.noCategoryMems': 'No {category} memories yet.', /* needs-review */
  'memories.unfavourite': 'Remove from Favourites', /* needs-review */
  'memories.nav.home': 'Home', /* needs-review */
  'memories.nav.games': 'Activities', /* needs-review */
  'memories.nav.memories': 'Memories', /* needs-review */
  'memories.nav.reminders': 'Reminders', /* needs-review */
  'reminders.everyDay': 'Every Day', /* needs-review */
  'reminders.doneUndo': '✓ Done — Tap to undo', /* needs-review */
  'reminders.resetNote': 'This reminder will appear again tomorrow.', /* needs-review */
  'reminders.today': 'Today', /* needs-review */
  'reminders.comingUp': 'Coming Up', /* needs-review */
  'reminders.noneToday': 'No reminders for today.', /* needs-review */
  'reminders.allCaughtUp': 'You\'re all caught up! 😊', /* needs-review */
  'reminders.nav.home': 'Home', /* needs-review */
  'reminders.nav.games': 'Activities', /* needs-review */
  'reminders.nav.memories': 'Memories', /* needs-review */
  'reminders.nav.reminders': 'Reminders', /* needs-review */
  'hub.game.duration': '{duration}', /* needs-review */
  'hub.game.level': '{level}', /* needs-review */
  'game.memoryMatch.name': 'Memory Match', /* needs-review */
  'game.memoryMatch.tagline': 'Find matching cultural image pairs.', /* needs-review */
  'game.wordChain.name': 'Word Chain', /* needs-review */
  'game.wordChain.tagline': 'Remember and extend a chain of connected words.', /* needs-review */
  'game.storyRecall.name': 'Story Time', /* needs-review */
  'game.storyRecall.tagline': 'Listen to a short story and answer simple questions.', /* needs-review */
  'game.rememberMe.name': 'RememberMe', /* needs-review */
  'game.rememberMe.tagline': 'Revisit familiar memories and match them with details.', /* needs-review */
  'game.rearrange.name': 'Remember the Room', /* needs-review */
  'game.rearrange.tagline': 'Memorise object positions, then put them back.', /* needs-review */
  'game.pathTracer.name': 'PathTracer', /* needs-review */
  'game.pathTracer.tagline': 'Memorise a route through village landmarks.', /* needs-review */
  'game.movement.name': 'Movement with Aroha', /* needs-review */
  'game.movement.tagline': 'Gentle movement activities — one step at a time.', /* needs-review */
  'game.musicMemory.name': 'Music Memory', /* needs-review */
  'game.musicMemory.tagline': 'Identify the music category from a description.', /* needs-review */
  'game.round': 'Round {n} of {total}', /* needs-review */
  'game.memory': 'Memory {n} of {total}', /* needs-review */
  'game.score.accuracy': 'Accuracy', /* needs-review */
  'game.score.correct': 'Correct', /* needs-review */
  'game.score.level': 'Level', /* needs-review */
  'game.score.hints': 'Hints Used', /* needs-review */
  'game.hint.btn': '💡 Show a Hint', /* needs-review */
  'game.btn.seeResults': 'See Results', /* needs-review */
  'game.btn.reset': '🔄 Reset', /* needs-review */
  'game.complete.wonderful': 'Wonderful!', /* needs-review */
  'game.phase.memorise': '👀 Memorise this carefully', /* needs-review */
  'game.phase.yourTurn': '🤔 Your Turn', /* needs-review */
  'game.timer': '⏱ {n}s remaining', /* needs-review */
  'game.timer.warning': '⏱ {n}s', /* needs-review */
  'game.progress.label': 'Progress', /* needs-review */
  'game.exit.confirm': 'Leave this game? Your progress will not be saved.', /* needs-review */
  'game.exit.stay': '✅ Keep Playing', /* needs-review */
  'game.exit.leave': 'Leave Game', /* needs-review */
  'wordChain.title': 'Word Chain', /* needs-review */
  'wordChain.sub': 'Memory · Language', /* needs-review */
  'wordChain.intro.title': 'Word Chain', /* needs-review */
  'wordChain.intro.desc1': 'A chain of connected words will appear one by one.', /* needs-review */
  'wordChain.intro.desc2': 'The last word will be hidden. Tap the correct missing word.', /* needs-review */
  'wordChain.intro.rounds': '{rounds} rounds', /* needs-review */
  'wordChain.phase.memorise': '📖 Remember the Chain', /* needs-review */
  'wordChain.phase.recall': '❓ What was the last word?', /* needs-review */
  'wordChain.complete.sub': 'Great effort, {name}.', /* needs-review */
  'movement.title': 'Movement with Aroha', /* needs-review */
  'movement.sub': 'Gentle Activity', /* needs-review */
  'movement.intro.title': 'Movement with Aroha', /* needs-review */
  'movement.intro.desc1': 'Aroha will guide you through gentle movements. Take your time — there\'s no rush.', /* needs-review */
  'movement.intro.desc2': 'Confirm each movement by pressing the button below.', /* needs-review */
  'movement.intro.notice': '💙 This is a gentle wellness activity, not medical treatment.', /* needs-review */
  'movement.intro.rounds': '{count} movement{plural} · {rounds} rounds', /* needs-review */
  'movement.phase.watch': '👀 Watch This Movement', /* needs-review */
  'movement.phase.do': '🙌 Your Turn', /* needs-review */
  'movement.phase.do.sub': 'When you are ready, do the movement and press the button below.', /* needs-review */
  'movement.btn.done': '✅ I Did It!', /* needs-review */
  'movement.feedback.great': '🌸 Wonderful! You did it beautifully.', /* needs-review */
  'movement.complete.sub': 'You completed your movement activity, {name}.', /* needs-review */
  'movement.complete.total': 'Movements Done', /* needs-review */
  'movement.intro.begin': '▶ Begin Activity', /* needs-review */
  'movement.wellness.notice': '🌿 Only move if it feels comfortable. You can always skip.', /* needs-review */
  'movement.step.of': 'Movement {n} of {total}', /* needs-review */
  'movement.btn.nextMovement': 'Next Movement', /* needs-review */
  'movement.btn.ready': 'I\'m Ready', /* needs-review */
  'movement.btn.skip': 'Skip this one', /* needs-review */
  'movement.feedback.completed': 'Movements completed:', /* needs-review */
  'movement.complete.participation': 'Participation', /* needs-review */
  'movement.complete.again': '🔄 Do Again', /* needs-review */
  'movement.instructions.raise-right': 'Slowly raise your right hand up above your shoulder.', /* needs-review */
  'movement.instructions.clap-twice': 'Gently clap your hands together two times.', /* needs-review */
  'movement.instructions.raise-both': 'Slowly raise both hands above your head.', /* needs-review */
  'movement.instructions.tap-knees': 'Gently tap both knees with your palms.', /* needs-review */
  'movement.instructions.wave-hello': 'Give a friendly wave with your right hand.', /* needs-review */
  'movement.instructions.nod-head': 'Gently nod your head up and down twice.', /* needs-review */
  'movement.instructions.touch-chin': 'Gently touch your chin with one finger.', /* needs-review */
  'movement.instructions.circle-arms': 'Make small, slow circles with your arms.', /* needs-review */
  'storyRecall.title': 'Story Time', /* needs-review */
  'storyRecall.sub': 'Memory · Comprehension', /* needs-review */
  'storyRecall.intro.title': 'Story Time', /* needs-review */
  'storyRecall.intro.desc1': 'A short story will appear. Read it carefully.', /* needs-review */
  'storyRecall.intro.desc2': 'Then answer a few simple questions about it.', /* needs-review */
  'storyRecall.intro.questions': '{count} questions', /* needs-review */
  'storyRecall.phase.read': '📖 Read the Story', /* needs-review */
  'storyRecall.phase.read.sub': 'Take your time. When you are ready, tap the button.', /* needs-review */
  'storyRecall.btn.ready': 'I\'ve Read It — Start Questions', /* needs-review */
  'storyRecall.phase.question': 'Question {n} of {total}', /* needs-review */
  'storyRecall.complete.sub': 'Excellent reading, {name}!', /* needs-review */
  'storyRecall.intro.todaysStory': 'Today\'s story:', /* needs-review */
  'storyRecall.intro.questions2': '{count} question{plural} after the story.', /* needs-review */
  'storyRecall.btn.readStory': '📖 Read the Story', /* needs-review */
  'storyRecall.btn.readAgain': '🔁 Read Again', /* needs-review */
  'storyRecall.tip': '💡 Take your time reading. You can scroll back up if needed.', /* needs-review */
  'storyRecall.question.label': '🤔 Question {n}', /* needs-review */
  'storyRecall.complete.title': 'Story Complete!', /* needs-review */
  'storyRecall.complete.remembered': 'You remembered "{title}" very well!', /* needs-review */
  'rearrange.title': 'Remember the Room', /* needs-review */
  'rearrange.sub': 'Memory · Spatial', /* needs-review */
  'rearrange.intro.title': 'Remember the Room', /* needs-review */
  'rearrange.intro.desc1': 'A set of objects will appear with numbered positions.', /* needs-review */
  'rearrange.intro.desc2': 'They will be shuffled — tap them back in the correct order (1, 2, 3...).', /* needs-review */
  'rearrange.intro.objects': '{count} objects · {rounds} rounds', /* needs-review */
  'rearrange.intro.begin': '▶ Start Game', /* needs-review */
  'rearrange.phase.memorise': '🪑 Memorise the Room', /* needs-review */
  'rearrange.phase.recall': '🤔 Tap Objects in Order (1, 2, 3...)', /* needs-review */
  'rearrange.phase.placed': '({n}/{total} placed)', /* needs-review */
  'rearrange.memorise.instruction': 'Remember the order from left to right: 1, 2, 3...', /* needs-review */
  'rearrange.recall.instruction': 'Tap the objects in the original order (1 first, then 2, 3...).', /* needs-review */
  'rearrange.round.of': 'Round {n} of {total}', /* needs-review */
  'rearrange.correct.route': 'The correct order was:', /* needs-review */
  'rearrange.btn.reset': '🔄 Reset Selection', /* needs-review */
  'rearrange.complete.sub': 'Wonderful effort, {name}!', /* needs-review */
  'rearrange.complete.objects': 'Objects', /* needs-review */
  'rearrange.complete.perfectRounds': 'Perfect Rounds', /* needs-review */
  'rearrange.feedback.perfect': '🌟 Perfect! You remembered the correct order!', /* needs-review */
  'rearrange.feedback.partial': '💪 You got {hits} out of {total} positions right. Well done!', /* needs-review */
  'musicMemory.title': 'Music Memory', /* needs-review */
  'musicMemory.sub': 'Cultural Music', /* needs-review */
  'musicMemory.intro.title': 'Music Memory', /* needs-review */
  'musicMemory.intro.desc1': 'Read the description of a music style.', /* needs-review */
  'musicMemory.intro.desc2': 'Then identify which music category it belongs to.', /* needs-review */
  'musicMemory.intro.questions': '{count} questions', /* needs-review */
  'musicMemory.intro.begin': '🎵 Start Listening', /* needs-review */
  'musicMemory.player.label': 'Music Description', /* needs-review */
  'musicMemory.categories.label': 'Music Categories', /* needs-review */
  'musicMemory.phase.listen': '🎵 Read the Music Description', /* needs-review */
  'musicMemory.phase.identify': '🎶 Which Category Is This?', /* needs-review */
  'musicMemory.complete.sub': 'You have a wonderful ear for music, {name}.', /* needs-review */
  'musicMemory.player.listen': '🔊 Listen Again', /* needs-review */
  'musicMemory.additional.detail': 'Additional detail:', /* needs-review */
  'musicMemory.phase.question': '🎵 What type of music is this?', /* needs-review */
  'musicMemory.round.of': 'Round {n} of {total}', /* needs-review */
  'musicMemory.complete.bravo': 'Bravo!', /* needs-review */
  'rememberMe.title': 'RememberMe', /* needs-review */
  'rememberMe.sub': 'Nostalgia · Memory', /* needs-review */
  'rememberMe.intro.title': 'RememberMe', /* needs-review */
  'rememberMe.intro.desc1': 'A memory photo will appear. Look at it carefully and answer a simple question about it.', /* needs-review */
  'rememberMe.intro.desc2': 'Take your time — these are warm, familiar memories.', /* needs-review */
  'rememberMe.intro.note': 'Note: These are demo memories — not your personal photos.', /* needs-review */
  'rememberMe.intro.memories': '{count} memories to explore.', /* needs-review */
  'rememberMe.intro.begin': '❤️ Begin', /* needs-review */
  'rememberMe.phase.view': '🖼️ Look at this memory', /* needs-review */
  'rememberMe.view.tip': 'Take a moment to look carefully. When you\'re ready, tap the button below.', /* needs-review */
  'rememberMe.btn.ready': 'I\'m Ready → Answer the Question', /* needs-review */
  'rememberMe.memory.of': 'Memory {n} of {total}', /* needs-review */
  'rememberMe.complete.wonderful': 'Wonderful!', /* needs-review */
  'rememberMe.complete.sub': 'Your memories are precious, {name}.', /* needs-review */
  'rememberMe.hint.btn': '💡 Show a Hint', /* needs-review */
  'pathTracer.title': 'PathTracer', /* needs-review */
  'pathTracer.sub': 'Attention · Spatial Memory', /* needs-review */
  'pathTracer.intro.title': 'PathTracer', /* needs-review */
  'pathTracer.intro.desc1': 'A fictional route through a village will be shown.', /* needs-review */
  'pathTracer.intro.desc2': 'Memorise the order of landmarks! Then tap them back in the correct route order.', /* needs-review */
  'pathTracer.intro.stops': '{stops} stops on the route · {rounds} rounds', /* needs-review */
  'pathTracer.phase.memorise': '🧭 Memorise the Route', /* needs-review */
  'pathTracer.phase.recall': '🤔 Tap in the Correct Route Order', /* needs-review */
  'pathTracer.recall.placed': '({placed}/{total} placed)', /* needs-review */
  'pathTracer.recall.reset': '🔄 Reset', /* needs-review */
  'pathTracer.correct.route': 'The correct route was:', /* needs-review */
  'pathTracer.complete.sub': 'You know your village well, {name}!', /* needs-review */
  'pathTracer.complete.routes': 'Perfect Routes', /* needs-review */
  'pathTracer.complete.stops': 'Stops', /* needs-review */
  'pathTracer.intro.begin': '🗺️ Start Tracing', /* needs-review */
  'pathTracer.memorise.instruction': 'Remember the order of these landmarks from top to bottom:', /* needs-review */
  'pathTracer.recall.instruction': 'Tap landmarks in order: 1st stop first, then 2nd, 3rd...', /* needs-review */
  'pathTracer.round.of': 'Round {n} of {total}', /* needs-review */
  'pathTracer.feedback.perfect': '🗺️ Perfect route! You remembered the way!', /* needs-review */
  'pathTracer.feedback.partial': '💪 You got {hits} of {total} stops right. The correct route is shown below.', /* needs-review */
  'landmark.home': 'Home', /* needs-review */
  'landmark.gate': 'Front Gate', /* needs-review */
  'landmark.tea-shop': 'Tea Shop', /* needs-review */
  'landmark.big-tree': 'Big Banyan Tree', /* needs-review */
  'landmark.pond': 'Village Pond', /* needs-review */
  'landmark.post-off': 'Post Office', /* needs-review */
  'landmark.market': 'Weekly Market', /* needs-review */
  'landmark.school': 'School', /* needs-review */
  'landmark.temple': 'Temple', /* needs-review */
  'landmark.bridge': 'Old Bridge', /* needs-review */
  'landmark.grocery': 'Grocery Store', /* needs-review */
  'landmark.clinic': 'Clinic', /* needs-review */
  'landmark.bus-stop': 'Bus Stop', /* needs-review */
  'movement.id.raise-right': 'Raise your right hand', /* needs-review */
  'movement.id.clap-twice': 'Clap twice', /* needs-review */
  'movement.id.raise-both': 'Raise both hands', /* needs-review */
  'movement.id.tap-knees': 'Tap your knees', /* needs-review */
  'movement.id.wave-hello': 'Wave hello', /* needs-review */
  'movement.id.nod-head': 'Nod your head', /* needs-review */
  'movement.id.touch-chin': 'Touch your chin', /* needs-review */
  'movement.id.circle-arms': 'Circle your arms', /* needs-review */
  'object.chair': 'Chair', /* needs-review */
  'object.book': 'Book', /* needs-review */
  'object.cup': 'Cup', /* needs-review */
  'object.flower': 'Flower Vase', /* needs-review */
  'object.clock': 'Clock', /* needs-review */
  'object.bag': 'Bag', /* needs-review */
  'object.lamp': 'Lamp', /* needs-review */
  'object.basket': 'Basket', /* needs-review */
  'object.umbrella': 'Umbrella', /* needs-review */
  'object.pot': 'Plant Pot', /* needs-review */
  'memoryGame.title': 'Memory Match', /* needs-review */
  'memoryGame.phase.intro.title': 'Memory Match', /* needs-review */
  'memoryGame.phase.intro.desc1': 'Cultural images will appear. Study them carefully.', /* needs-review */
  'memoryGame.phase.intro.desc2': 'Then select the images you remember from the list.', /* needs-review */
  'memoryGame.phase.memorise': '👀 Memorise These Images', /* needs-review */
  'memoryGame.phase.recall': '🤔 Which images did you see?', /* needs-review */
  'memoryGame.phase.feedback.correct': '✅ That\'s right!', /* needs-review */
  'memoryGame.phase.feedback.wrong': '❌ Not quite.', /* needs-review */
  'memoryGame.complete.title': 'Round Complete!', /* needs-review */
  'memoryGame.btn.start': '▶ Start', /* needs-review */
  'memoryGame.btn.check': '✓ Check My Answer', /* needs-review */
  'caregiver.patient.label': 'Patient', /* needs-review */
  'caregiver.patient.sub': 'Supporting {name}', /* needs-review */
  'caregiver.patient.age': 'Age {age}', /* needs-review */
  'caregiver.patientView.btn': 'Patient View', /* needs-review */
  'caregiver.demoBadge': 'Demo Patient', /* needs-review */
  'caregiver.refreshData': '🔄 Refresh Data', /* needs-review */
  'caregiver.overview.heading': 'Today\'s Overview', /* needs-review */
  'caregiver.stats.totalGames': 'Total Games', /* needs-review */
  'caregiver.stats.avgAccuracy': 'Avg. Accuracy', /* needs-review */
  'caregiver.stats.bestScore': 'Best Score', /* needs-review */
  'caregiver.stats.currentLevel': 'Current Level', /* needs-review */
  'caregiver.stats.lastActive': 'Last Active', /* needs-review */
  'caregiver.stats.noData': 'No activity data yet.', /* needs-review */
  'caregiver.recentActivity.heading': 'Recent Activities', /* needs-review */
  'caregiver.recentActivity.empty': 'No activities completed yet.', /* needs-review */
  'caregiver.trend.heading': 'Recent Accuracy Trend', /* needs-review */
  'caregiver.trend.game': 'Game {n}', /* needs-review */
  'caregiver.memories.heading': '❤️ Memories', /* needs-review */
  'caregiver.memories.viewBtn': 'View Memories', /* needs-review */
  'caregiver.reminders.heading': '⏰ Reminders', /* needs-review */
  'caregiver.reminders.manageBtn': 'Manage Reminders', /* needs-review */
  'caregiver.notes.heading': 'Activity Notes', /* needs-review */
  'caregiver.accuracy.label': 'Accuracy', /* needs-review */
  'caregiver.objects.label': 'Objects', /* needs-review */
  'caregiver.responseTime.label': 'Response Time', /* needs-review */
  'caregiver.prototype.notice': '🧪 Prototype Demo — {name} is a fictional patient.', /* needs-review */
  'caregiver.prototype.banner': '🧪 Prototype Mode — {name} is a demo patient. Data is stored locally on this device.', /* needs-review */
  'caregiverMem.title': 'Manage Memories', /* needs-review */
  'caregiverMem.heading': 'Memory Album', /* needs-review */
  'caregiverMem.sub': 'Add and manage special memories for {name}.', /* needs-review */
  'caregiverMem.add': '+ Add Memory', /* needs-review */
  'caregiverMem.empty': 'No memories added yet.', /* needs-review */
  'caregiverMem.empty.sub': 'Add a special memory to begin building {name}\'s memory collection.', /* needs-review */
  'caregiverMem.form.title': 'Memory Title', /* needs-review */
  'caregiverMem.form.desc': 'Description', /* needs-review */
  'caregiverMem.form.date': 'Date', /* needs-review */
  'caregiverMem.form.category': 'Category', /* needs-review */
  'caregiverMem.form.save': 'Save Memory', /* needs-review */
  'caregiverMem.form.cancel': 'Cancel', /* needs-review */
  'caregiverMem.delete': 'Delete', /* needs-review */
  'caregiverMem.favourite': 'Favourite', /* needs-review */
  'caregiverRem.title': 'Manage Reminders', /* needs-review */
  'caregiverRem.heading': 'Reminders', /* needs-review */
  'caregiverRem.sub': 'Keep track of important things for {name}.', /* needs-review */
  'caregiverRem.add': '+ Add Reminder', /* needs-review */
  'caregiverRem.empty': 'No reminders added yet.', /* needs-review */
  'caregiverRem.form.text': 'Reminder Text', /* needs-review */
  'caregiverRem.form.time': 'Time', /* needs-review */
  'caregiverRem.form.days': 'Repeat on Days', /* needs-review */
  'caregiverRem.form.category': 'Category', /* needs-review */
  'caregiverRem.form.save': 'Save Reminder', /* needs-review */
  'caregiverRem.form.cancel': 'Cancel', /* needs-review */
  'caregiverRem.delete': 'Delete', /* needs-review */
  'caregiverRem.days.mon': 'Mon', /* needs-review */
  'caregiverRem.days.tue': 'Tue', /* needs-review */
  'caregiverRem.days.wed': 'Wed', /* needs-review */
  'caregiverRem.days.thu': 'Thu', /* needs-review */
  'caregiverRem.days.fri': 'Fri', /* needs-review */
  'caregiverRem.days.sat': 'Sat', /* needs-review */
  'caregiverRem.days.sun': 'Sun', /* needs-review */
  'lang.picker.label': 'Language — {lang}', /* needs-review */
  'lang.picker.select': 'Select', /* needs-review */
  'lang.picker.note': 'All 11 languages are available. More improvements coming soon.', /* needs-review */
  'readAloud.unavailable': 'Read aloud not available in this language.', /* needs-review */
  'error.noData': 'No data available.', /* needs-review */
  'footer.text': 'Memora · AI Cognitive & Memory Companion · Built for SIH 2026 Problem Statement SIH26003', /* needs-review */

  /* ── AUTO-SYNCED KEYS (Phase 4) ────────────────────────────────── */
  'caregiverMem.form.update': 'Save Changes', /* needs-review */
  'caregiverMem.form.err.title': 'Please enter a memory title.', /* needs-review */
  'caregiverMem.form.err.category': 'Please select a category.', /* needs-review */
  'caregiverMem.form.err.desc': 'Please add a short description.', /* needs-review */
  'caregiverRem.form.err.text': 'Please enter reminder text.', /* needs-review */
  'caregiverRem.form.err.category': 'Please select a category.', /* needs-review */
  'caregiverRem.form.err.type': 'Please select a reminder type.', /* needs-review */
  'caregiverRem.deleteConfirm.aria': 'Delete reminder confirmation', /* needs-review */
  'caregiverMem.deleteConfirm.aria': 'Delete memory confirmation', /* needs-review */
  'caregiverRem.form.update': 'Save Changes', /* needs-review */

  /* ── AUTO-SYNCED KEYS (Phase 4) ────────────────────────────────── */
  'caregiverMem.deleteConfirm.title': 'Delete this memory?', /* needs-review */
  'caregiverRem.deleteConfirm.title': 'Delete this reminder?', /* needs-review */
  'confirm.irreversible': 'This cannot be undone.', /* needs-review */
};

export default as;
