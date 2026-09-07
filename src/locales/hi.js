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
};

export default hi;
