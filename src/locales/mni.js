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

  /* ── AUTO-SYNCED KEYS (Phase 4) ────────────────────────────────── */
  'app.tagline': 'AI Cognitive & Memory Companion', /* needs-review */
  'app.badge': 'SIH 2026 · NE India', /* needs-review */
  'offline.banner': '📵 Offline — changes are saved locally and will sync when you reconnect.', /* needs-review */
  'landing.heading': 'Welcome to Memora', /* needs-review */
  'landing.subheading': 'A gentle memory and cognitive wellness companion.', /* needs-review */
  'landing.disclaimer': 'Memora provides cognitive wellness and memory practice activities. It is not a medical diagnostic or treatment tool.', /* needs-review */
  'landing.patient.title': 'Patient Mode', /* needs-review */
  'landing.patient.desc': 'Cognitive activities, memory games, and daily reminders designed for elderly users.', /* needs-review */
  'landing.caregiver.title': 'Caregiver Mode', /* needs-review */
  'landing.caregiver.desc': 'Monitor progress, manage care plans, and stay connected with your loved one.', /* needs-review */
  'landing.select': 'Select Mode', /* needs-review */
  'nav.home': '← Memora Home', /* needs-review */
  'nav.patientHome': '← Patient Home', /* needs-review */
  'nav.games': '← Games', /* needs-review */
  'home.greeting': 'Good {timeOfDay}, {name} ❤️', /* needs-review */
  'home.sub': 'Let\'s make today a good day.', /* needs-review */
  'home.todayActivity.tag': 'TODAY\'S ACTIVITY', /* needs-review */
  'home.todayActivity.title': 'Memory Match', /* needs-review */
  'home.todayActivity.desc': 'A short cultural image memory activity for today.', /* needs-review */
  'home.todayActivity.btn': '▶ Start Activity', /* needs-review */
  'home.allActivities.tag': 'ALL ACTIVITIES', /* needs-review */
  'home.allActivities.title': 'All Games', /* needs-review */
  'home.allActivities.desc': 'Word Chain, Story Time, Movement, PathTracer and more!', /* needs-review */
  'home.allActivities.btn': '🎮 Browse All Activities', /* needs-review */
  'home.memories.tag': 'MY MEMORIES', /* needs-review */
  'home.memories.title': 'Memory Album', /* needs-review */
  'home.memories.desc': 'Revisit your special moments and photos.', /* needs-review */
  'home.memories.btn': '📖 View Memories', /* needs-review */
  'home.memories.none': 'No memories yet. Your caregiver can add them for you.', /* needs-review */
  'home.reminders.tag': 'TODAY\'S REMINDERS', /* needs-review */
  'home.reminders.title': 'Today\'s Reminders', /* needs-review */
  'home.reminders.none': 'No reminders today. Enjoy your day! 😊', /* needs-review */
  'home.reminders.count': '{count} of {total} done today', /* needs-review */
  'home.reminders.btn': '📋 See All Reminders', /* needs-review */
  'home.reminders.done': 'Done', /* needs-review */
  'progress.title': 'My Progress', /* needs-review */
  'progress.back': '← Patient Home', /* needs-review */
  'progress.heading': 'Your Progress', /* needs-review */
  'progress.subheading': 'Keep it up!', /* needs-review */
  'progress.totalGames': 'Games Played', /* needs-review */
  'progress.avgAccuracy': 'Avg. Accuracy', /* needs-review */
  'progress.bestAccuracy': 'Best Score', /* needs-review */
  'progress.currentLevel': 'Current Level', /* needs-review */
  'progress.recentActivity': 'Recent Activity', /* needs-review */
  'progress.noActivity': 'No activities yet.', /* needs-review */
  'progress.noActivity.sub': 'Let\'s start your first game!', /* needs-review */
  'progress.noActivity.btn': '▶ Start an Activity', /* needs-review */
  'progress.gameType.memory-match': 'Memory Match', /* needs-review */
  'progress.gameType.word-chain': 'Word Chain', /* needs-review */
  'progress.gameType.movement': 'Movement', /* needs-review */
  'progress.gameType.story-recall': 'Story Recall', /* needs-review */
  'progress.gameType.rearrange': 'Remember the Room', /* needs-review */
  'progress.gameType.music-memory': 'Music Memory', /* needs-review */
  'progress.gameType.remember-me': 'RememberMe', /* needs-review */
  'progress.gameType.path-tracer': 'PathTracer', /* needs-review */
  'progress.accuracy': '{value}% accuracy', /* needs-review */
  'progress.correct': '{correct}/{total} correct', /* needs-review */
  'progress.date': '{date}', /* needs-review */
  'memories.title': 'My Memories', /* needs-review */
  'memories.back': '← Patient Home', /* needs-review */
  'memories.heading': 'My Memories', /* needs-review */
  'memories.empty': 'No memories yet.', /* needs-review */
  'memories.empty.sub': 'Your caregiver can add special memories and photos for you.', /* needs-review */
  'memories.categories.all': 'All', /* needs-review */
  'memories.categories.family': 'Family', /* needs-review */
  'memories.categories.places': 'Places', /* needs-review */
  'memories.categories.events': 'Events', /* needs-review */
  'memories.categories.specialMoments': 'Special Moments', /* needs-review */
  'memories.favourite': 'Favourite', /* needs-review */
  'memories.date': '{date}', /* needs-review */
  'memories.count.one': '1 memory', /* needs-review */
  'memories.count.many': '{count} memories', /* needs-review */
  'memories.noCategoryMems': 'No {category} memories yet.', /* needs-review */
  'memories.unfavourite': 'Remove from Favourites', /* needs-review */
  'memories.nav.home': 'Home', /* needs-review */
  'memories.nav.games': 'Activities', /* needs-review */
  'memories.nav.memories': 'Memories', /* needs-review */
  'memories.nav.reminders': 'Reminders', /* needs-review */
  'reminders.title': 'Today\'s Reminders', /* needs-review */
  'reminders.back': '← Patient Home', /* needs-review */
  'reminders.heading': 'Today\'s Reminders', /* needs-review */
  'reminders.empty': 'No reminders for today.', /* needs-review */
  'reminders.empty.sub': 'Your caregiver can add reminders for you.', /* needs-review */
  'reminders.markDone': '✓ Mark as Done', /* needs-review */
  'reminders.done': '✓ Done', /* needs-review */
  'reminders.doneMsg': 'Well done! ❤️', /* needs-review */
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
  'hub.title': 'Cognitive Activities', /* needs-review */
  'hub.heading': 'All Activities', /* needs-review */
  'hub.sub': 'Choose an activity. Take your time.', /* needs-review */
  'hub.back': '← Patient Home', /* needs-review */
  'hub.cat.memory': 'Memory Games', /* needs-review */
  'hub.cat.attention': 'Attention & Spatial', /* needs-review */
  'hub.cat.movement': 'Movement', /* needs-review */
  'hub.cat.music': 'Music', /* needs-review */
  'hub.game.duration': '{duration}', /* needs-review */
  'hub.game.level': '{level}', /* needs-review */
  'hub.start': 'Start', /* needs-review */
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
  'game.level.easy': 'Easy', /* needs-review */
  'game.level.moderate': 'Moderate', /* needs-review */
  'game.level.challenging': 'Challenging', /* needs-review */
  'game.level.advanced': 'Advanced', /* needs-review */
  'game.level.label': 'Level {n}', /* needs-review */
  'game.round': 'Round {n} of {total}', /* needs-review */
  'game.memory': 'Memory {n} of {total}', /* needs-review */
  'game.score.accuracy': 'Accuracy', /* needs-review */
  'game.score.correct': 'Correct', /* needs-review */
  'game.score.level': 'Level', /* needs-review */
  'game.score.hints': 'Hints Used', /* needs-review */
  'game.hint.btn': '💡 Show a Hint', /* needs-review */
  'game.btn.seeResults': 'See Results', /* needs-review */
  'game.btn.backToGames': '← Back to Games', /* needs-review */
  'game.btn.reset': '🔄 Reset', /* needs-review */
  'game.complete.title': 'Activity Complete!', /* needs-review */
  'game.complete.wonderful': 'Wonderful!', /* needs-review */
  'game.phase.memorise': '👀 Memorise this carefully', /* needs-review */
  'game.phase.yourTurn': '🤔 Your Turn', /* needs-review */
  'game.timer': '⏱ {n}s remaining', /* needs-review */
  'game.timer.warning': '⏱ {n}s', /* needs-review */
  'game.progress.label': 'Progress', /* needs-review */
  'game.nextLevel.up': 'Wonderful! 🌟 Your next activity will be a little more challenging.', /* needs-review */
  'game.nextLevel.down': 'Great effort! 💪 We\'ll make the next activity a little gentler.', /* needs-review */
  'game.nextLevel.same': 'Well done! 🌸 We\'ll practise at this level again.', /* needs-review */
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
  'caregiver.title': 'Caregiver Dashboard', /* needs-review */
  'caregiver.back': '← Memora Home', /* needs-review */
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
  'caregiver.nav.dashboard': 'Dashboard', /* needs-review */
  'caregiver.nav.memories': 'Memories', /* needs-review */
  'caregiver.nav.reminders': 'Reminders', /* needs-review */
  'caregiver.disclaimer': '⚕️ Statistics are cognitive wellness observations — not medical diagnoses.', /* needs-review */
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
  'lang.picker.heading': 'Choose Language', /* needs-review */
  'lang.picker.label': 'Language — {lang}', /* needs-review */
  'lang.picker.close': 'Close', /* needs-review */
  'lang.picker.select': 'Select', /* needs-review */
  'lang.picker.note': 'All 11 languages are available. More improvements coming soon.', /* needs-review */
  'a11y.settings.heading': 'Display Settings', /* needs-review */
  'a11y.settings.close': 'Close', /* needs-review */
  'a11y.text.label': 'Text Size', /* needs-review */
  'a11y.contrast.label': 'High Contrast', /* needs-review */
  'a11y.motion.label': 'Reduce Motion', /* needs-review */
  'a11y.settings.btn': '⚙ Display', /* needs-review */
  'readAloud.btn.speak': '🔊 Read Aloud', /* needs-review */
  'readAloud.btn.stop': '⏹ Stop', /* needs-review */
  'readAloud.unavailable': 'Read aloud not available in this language.', /* needs-review */
  'loading': 'Loading…', /* needs-review */
  'error.generic': 'Something went wrong. Please try again.', /* needs-review */
  'error.noData': 'No data available.', /* needs-review */
  'empty.generic': 'Nothing here yet.', /* needs-review */
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

export default mni;
