/**
 * src/locales/hi.js — Hindi (हिंदी) translations for Memora
 *
 * Translation quality: Best-effort for elderly-friendly,
 * natural Hindi. All strings intended for native-speaker review.
 *
 * Keys must mirror en.js exactly.
 * Missing keys fall back to English automatically.
 */

const hi = {
  /* ── APP / GLOBAL ─────────────────────────────────────────── */
  'app.name':                  'Memora',
  'app.tagline':               'AI संज्ञानात्मक और स्मृति साथी',
  'app.badge':                 'SIH 2026 · पूर्वोत्तर भारत',

  /* ── OFFLINE BANNER ──────────────────────────────────────── */
  'offline.banner':            '📵 ऑफ़लाइन — परिवर्तन स्थानीय रूप से सहेजे जा रहे हैं और पुनः कनेक्ट होने पर समन्वयित होंगे।',

  /* ── LANDING / MODE SELECTION ─────────────────────────────── */
  'landing.heading':           'Memora में आपका स्वागत है',
  'landing.subheading':        'एक सौम्य स्मृति और संज्ञानात्मक कल्याण साथी।',
  'landing.disclaimer':        'Memora संज्ञानात्मक कल्याण और स्मृति अभ्यास गतिविधियाँ प्रदान करता है। यह कोई चिकित्सीय निदान या उपचार उपकरण नहीं है।',
  'landing.patient.title':     'रोगी मोड',
  'landing.patient.desc':      'बुजुर्ग उपयोगकर्ताओं के लिए संज्ञानात्मक गतिविधियाँ, स्मृति खेल और दैनिक अनुस्मारक।',
  'landing.caregiver.title':   'देखभालकर्ता मोड',
  'landing.caregiver.desc':    'प्रगति की निगरानी करें, देखभाल योजनाएँ प्रबंधित करें और अपने प्रियजन से जुड़े रहें।',
  'landing.select':            'मोड चुनें',

  /* ── NAVIGATION ──────────────────────────────────────────── */
  'nav.back':                  '← वापस',
  'nav.home':                  '← Memora होम',
  'nav.patientHome':           '← रोगी होम',
  'nav.games':                 '← खेल',
  'nav.close':                 'बंद करें',

  /* ── PATIENT HOME ─────────────────────────────────────────── */
  'home.greeting':             'शुभ {timeOfDay}, {name} ❤️',
  'home.greeting.morning':     'सुबह',
  'home.greeting.afternoon':   'दोपहर',
  'home.greeting.evening':     'शाम',
  'home.sub':                  'आज का दिन अच्छा बनाते हैं।',
  'home.todayActivity.tag':    "आज की गतिविधि",
  'home.todayActivity.title':  'स्मृति मिलान',
  'home.todayActivity.desc':   'आज के लिए एक छोटी सांस्कृतिक छवि स्मृति गतिविधि।',
  'home.todayActivity.btn':    '▶ गतिविधि शुरू करें',
  'home.allActivities.tag':    'सभी गतिविधियाँ',
  'home.allActivities.title':  'सभी खेल',
  'home.allActivities.desc':   'शब्द श्रृंखला, कहानी, गतिविधि, पथ अनुरेखक और अधिक!',
  'home.allActivities.btn':    '🎮 सभी गतिविधियाँ देखें',
  'home.memories.tag':         'मेरी यादें',
  'home.memories.title':       'स्मृति एल्बम',
  'home.memories.desc':        'अपने खास पलों और तस्वीरों को फिर से देखें।',
  'home.memories.btn':         '📖 यादें देखें',
  'home.memories.none':        'अभी तक कोई याद नहीं। आपके देखभालकर्ता उन्हें जोड़ सकते हैं।',
  'home.reminders.tag':        "आज के अनुस्मारक",
  'home.reminders.title':      "आज के अनुस्मारक",
  'home.reminders.none':       'आज कोई अनुस्मारक नहीं। अपने दिन का आनंद लें! 😊',
  'home.reminders.count':      'आज {total} में से {count} पूरे हुए',
  'home.reminders.btn':        '📋 सभी अनुस्मारक देखें',
  'home.reminders.done':       'पूरा हुआ',

  /* ── PATIENT PROGRESS ──────────────────────────────────────── */
  'progress.title':            'मेरी प्रगति',
  'progress.back':             '← रोगी होम',
  'progress.heading':          "आपकी प्रगति",
  'progress.subheading':       'बहुत अच्छा!',
  'progress.totalGames':       'खेले गए खेल',
  'progress.avgAccuracy':      'औसत सटीकता',
  'progress.bestAccuracy':     'सर्वश्रेष्ठ स्कोर',
  'progress.currentLevel':     'वर्तमान स्तर',
  'progress.recentActivity':   'हाल की गतिविधि',
  'progress.noActivity':       "अभी तक कोई गतिविधि नहीं।",
  'progress.noActivity.sub':   "आइए पहला खेल शुरू करें!",
  'progress.noActivity.btn':   "▶ गतिविधि शुरू करें",
  'progress.accuracy':         '{value}% सटीकता',
  'progress.correct':          '{correct}/{total} सही',

  /* ── PATIENT MEMORIES ──────────────────────────────────────── */
  'memories.title':            'मेरी यादें',
  'memories.back':             '← रोगी होम',
  'memories.heading':          'मेरी यादें',
  'memories.empty':            'अभी तक कोई याद नहीं।',
  'memories.empty.sub':        'आपके देखभालकर्ता आपके लिए खास यादें और तस्वीरें जोड़ सकते हैं।',
  'memories.categories.all':   'सभी',
  'memories.favourite':        'पसंदीदा',

  /* ── PATIENT REMINDERS ─────────────────────────────────────── */
  'reminders.title':           "आज के अनुस्मारक",
  'reminders.back':            '← रोगी होम',
  'reminders.heading':         "आज के अनुस्मारक",
  'reminders.empty':           'आज के लिए कोई अनुस्मारक नहीं।',
  'reminders.empty.sub':       'आपके देखभालकर्ता आपके लिए अनुस्मारक जोड़ सकते हैं।',
  'reminders.markDone':        '✓ पूरा मार्क करें',
  'reminders.done':            '✓ पूरा हुआ',
  'reminders.doneMsg':         'बहुत अच्छे! ❤️',

  /* ── GAMES HUB ────────────────────────────────────────────── */
  'hub.title':                 'संज्ञानात्मक गतिविधियाँ',
  'hub.heading':               'सभी गतिविधियाँ',
  'hub.sub':                   'कोई गतिविधि चुनें। जल्दी नहीं है।',
  'hub.back':                  '← रोगी होम',
  'hub.cat.memory':            'स्मृति खेल',
  'hub.cat.attention':         'ध्यान और स्थानिक',
  'hub.cat.movement':          'गतिविधि',
  'hub.cat.music':             'संगीत',
  'hub.start':                 'शुरू करें',

  /* ── GAME METADATA ─────────────────────────────────────────── */
  'game.memoryMatch.name':     'स्मृति मिलान',
  'game.memoryMatch.tagline':  'सांस्कृतिक छवि जोड़े खोजें।',
  'game.wordChain.name':       'शब्द श्रृंखला',
  'game.wordChain.tagline':    'जुड़े शब्दों की एक श्रृंखला को याद रखें और बढ़ाएं।',
  'game.storyRecall.name':     'कहानी का समय',
  'game.storyRecall.tagline':  'एक छोटी कहानी सुनें और सरल प्रश्नों के उत्तर दें।',
  'game.rememberMe.name':      'मुझे याद करो',
  'game.rememberMe.tagline':   'परिचित यादों को फिर से देखें।',
  'game.rearrange.name':       'कमरा याद करो',
  'game.rearrange.tagline':    'वस्तुओं की स्थिति याद करें, फिर उन्हें वापस रखें।',
  'game.pathTracer.name':      'पथ अनुरेखक',
  'game.pathTracer.tagline':   'गाँव के स्थलों से होते हुए एक रास्ता याद करें।',
  'game.movement.name':        'Aroha के साथ गतिविधि',
  'game.movement.tagline':     'सौम्य गतिविधि — एक कदम एक समय।',
  'game.musicMemory.name':     'संगीत स्मृति',
  'game.musicMemory.tagline':  'विवरण से संगीत श्रेणी पहचानें।',

  /* ── SHARED GAME UI ────────────────────────────────────────── */
  'game.level.easy':           'आसान',
  'game.level.moderate':       'मध्यम',
  'game.level.challenging':    'चुनौतीपूर्ण',
  'game.level.advanced':       'उन्नत',
  'game.level.label':          'स्तर {n}',
  'game.round':                'दौर {n}/{total}',
  'game.score.accuracy':       'सटीकता',
  'game.score.correct':        'सही',
  'game.score.level':          'स्तर',
  'game.score.hints':          'संकेत उपयोग',
  'game.hint.btn':             '💡 संकेत दिखाएं',
  'game.btn.begin':            'शुरू करें',
  'game.btn.ready':            "मैं तैयार हूँ",
  'game.btn.next':             'आगे →',
  'game.btn.seeResults':       'परिणाम देखें',
  'game.btn.playAgain':        '🔄 फिर खेलें',
  'game.btn.backToGames':      '← खेलों पर वापस',
  'game.btn.reset':            '🔄 फिर से शुरू',
  'game.complete.title':       'गतिविधि पूरी हुई!',
  'game.complete.wonderful':   'अद्भुत!',
  'game.feedback.correct':     '✅ सही! बहुत अच्छा!',
  'game.feedback.tryAgain':    '💪 अच्छा प्रयास! जारी रखें।',
  'game.phase.memorise':       '👀 इसे ध्यान से याद करें',
  'game.phase.yourTurn':       '🤔 आपकी बारी',
  'game.timer':                '⏱ {n} सेकंड शेष',
  'game.nextLevel.up':         'अद्भुत! 🌟 अगली गतिविधि थोड़ी अधिक चुनौतीपूर्ण होगी।',
  'game.nextLevel.down':       'शानदार प्रयास! 💪 अगली गतिविधि थोड़ी सरल होगी।',
  'game.nextLevel.same':       'बहुत अच्छा! 🌸 हम इस स्तर पर फिर से अभ्यास करेंगे।',

  /* ── ACCESSIBILITY ──────────────────────────────────────────── */
  'a11y.settings.heading':     'प्रदर्शन सेटिंग',
  'a11y.settings.close':       'बंद करें',
  'a11y.text.label':           'पाठ आकार',
  'a11y.text.normal':          'सामान्य',
  'a11y.text.large':           'बड़ा',
  'a11y.contrast.label':       'उच्च कंट्रास्ट',
  'a11y.contrast.on':          'चालू',
  'a11y.contrast.off':         'बंद',
  'a11y.motion.label':         'गति कम करें',
  'a11y.motion.on':            'चालू',
  'a11y.motion.off':           'बंद',
  'a11y.settings.btn':         '⚙ प्रदर्शन',

  /* ── LANGUAGE PICKER ─────────────────────────────────────────── */
  'lang.picker.heading':       'भाषा चुनें',
  'lang.picker.label':         'भाषा — {lang}',
  'lang.picker.close':         'बंद करें',
  'lang.picker.selected':      '✓ चुनी गई',
  'lang.picker.select':        'चुनें',

  /* ── READ ALOUD ──────────────────────────────────────────────── */
  'readAloud.btn.speak':       '🔊 ज़ोर से पढ़ें',
  'readAloud.btn.stop':        '⏹ रोकें',
  'readAloud.unavailable':     'इस भाषा में ज़ोर से पढ़ना उपलब्ध नहीं है।',

  /* ── LOADING / EMPTY / ERROR ──────────────────────────────────── */
  'loading':                   'लोड हो रहा है…',
  'error.generic':             'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
  'error.noData':              'कोई डेटा उपलब्ध नहीं।',
  'empty.generic':             'अभी यहाँ कुछ नहीं।',

  /* ── CAREGIVER ────────────────────────────────────────────────── */
  'caregiver.title':           'देखभालकर्ता डैशबोर्ड',
  'caregiver.back':            '← Memora होम',
  'caregiver.nav.dashboard':   'डैशबोर्ड',
  'caregiver.nav.memories':    'यादें',
  'caregiver.nav.reminders':   'अनुस्मारक',
  'caregiver.disclaimer':      '⚕️ आँकड़े संज्ञानात्मक कल्याण अवलोकन हैं — चिकित्सीय निदान नहीं।',

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
  'game.memory': 'Memory {n} of {total}', /* needs-review */
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
  'lang.picker.note': 'All 11 languages are available. More improvements coming soon.', /* needs-review */
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

export default hi;
