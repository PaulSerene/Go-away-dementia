/**
 * StoryRecall.jsx — "Story Time" cognitive recall game for Memora.
 *
 * Gameplay:
 *   Phase 1 (READ): A short culturally-relevant story is displayed.
 *   Phase 2 (QUESTION): Multiple-choice questions about the story.
 *
 * Stories are local, culturally appropriate, and fictional.
 * No external API calls needed.
 *
 * Levels:
 *   1 — 1 simple factual question
 *   2 — 2 questions
 *   3 — 3 questions (relationships between details)
 *   4 — 4 questions (multi-piece recall)
 */

import { useState } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, shuffle, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import './StoryRecall.css';
import '../games/GameShared.css';

/* ── STORY DATABASE ───────────────────────────────────────────── */
const STORIES = [
  {
    id: 'market-day',
    title: 'A Day at the Market',
    text: `On a bright Tuesday morning, Renu and her daughter walked to the local market. 
They bought three bunches of fresh vegetables — spinach, pumpkin, and green beans. 
At the fish counter, the seller, a friendly man named Mohan, gave them a small discount 
because Renu was a regular customer. They also picked up some turmeric and chillies before 
heading home. On the way back, they stopped to watch children playing near the pond.`,
    questions: [
      { q: 'What day did Renu visit the market?', options: ['Monday', 'Tuesday', 'Friday', 'Sunday'], answer: 'Tuesday' },
      { q: 'Who gave Renu a discount at the fish counter?', options: ['A woman named Mala', 'A man named Mohan', 'Her daughter', 'The vegetable seller'], answer: 'A man named Mohan' },
      { q: 'How many bunches of vegetables did they buy?', options: ['Two', 'Three', 'Four', 'Five'], answer: 'Three' },
      { q: 'What did they see on the way home?', options: ['A parade', 'A wedding', 'Children playing near the pond', 'A cow grazing'], answer: 'Children playing near the pond' },
    ],
  },
  {
    id: 'tea-garden',
    title: 'Grandfather and the Tea Garden',
    text: `Every summer, young Priya visited her grandfather who lived near a large tea garden 
in the hills. Grandfather would wake up early each morning and walk between the rows of 
tea bushes, checking the leaves. He told Priya that the best tea leaves are picked 
early in the morning when the dew is still fresh. One afternoon, they sat on the porch 
and shared a pot of homemade ginger tea while listening to the birds sing in the trees.`,
    questions: [
      { q: 'When did Priya visit her grandfather?', options: ['Every winter', 'Every spring', 'Every summer', 'Every autumn'], answer: 'Every summer' },
      { q: 'When did grandfather walk through the tea garden?', options: ['At noon', 'In the evening', 'Early in the morning', 'Late at night'], answer: 'Early in the morning' },
      { q: 'What did they drink on the porch?', options: ['Milk tea', 'Ginger tea', 'Lemon tea', 'Black coffee'], answer: 'Ginger tea' },
      { q: 'According to grandfather, when are the best leaves picked?', options: ['At midday', 'In the evening', 'When it rains', 'When the dew is fresh in the morning'], answer: 'When the dew is fresh in the morning' },
    ],
  },
  {
    id: 'bihu-preparation',
    title: 'Preparing for the Festival',
    text: `Two weeks before the Bihu festival, the whole family came together to prepare. 
Mother and aunty made traditional rice cakes called pithas in the kitchen, while 
grandfather repaired the old bamboo fence in the yard. The children decorated the house 
with paper flowers and banana leaves. Father bought a new traditional garment — a mekhadar chador — 
for mother as a gift. Everyone was excited for the dancing and the drum music that would begin on festival day.`,
    questions: [
      { q: 'How long before the festival did preparations begin?', options: ['One week', 'Two weeks', 'One month', 'Three days'], answer: 'Two weeks' },
      { q: 'What did mother and aunty make in the kitchen?', options: ['Bamboo baskets', 'Flower garlands', 'Rice cakes called pithas', 'New clothes'], answer: 'Rice cakes called pithas' },
      { q: 'What did grandfather repair?', options: ['The roof', 'The old bamboo fence', 'The gate', 'The cooking pot'], answer: 'The old bamboo fence' },
      { q: "What did father buy as a gift for mother?", options: ['A silver necklace', 'A new mekhadar chador', 'A bamboo basket', 'Some fresh flowers'], answer: 'A new mekhadar chador' },
    ],
  },
  {
    id: 'village-journey',
    title: 'A Walk Through the Village',
    text: `Early one morning, Dhan decided to walk from his home to the village school to 
deliver some books. He passed the tea stall where his friend Gopal was having breakfast. 
Then he crossed the old wooden bridge over the small river. Near the river, 
he spotted a beautiful hornbill bird perched on a tall tree — he stopped to watch it for a 
full minute before continuing. At the school, the teacher, Mrs. Bora, thanked him warmly 
and offered him a glass of water.`,
    questions: [
      { q: 'What was Dhan delivering to the school?', options: ['Food', 'Books', 'Medicines', 'Flowers'], answer: 'Books' },
      { q: 'Who was having breakfast at the tea stall?', options: ['Dhan', 'Mrs. Bora', 'Gopal', 'A stranger'], answer: 'Gopal' },
      { q: 'What bird did Dhan see near the river?', options: ['A kingfisher', 'A hornbill', 'A parrot', 'A dove'], answer: 'A hornbill' },
      { q: 'How long did Dhan stop to watch the bird?', options: ['A few seconds', 'Five minutes', 'A full minute', 'Half an hour'], answer: 'A full minute' },
    ],
  },
  {
    id: 'grandmother-recipe',
    title: "Grandmother's Special Recipe",
    text: `Every Sunday, grandmother would make a special black rice pudding for the family. 
She soaked the rice overnight in cold water, then cooked it slowly with coconut milk, 
cardamom, and a little brown sugar. The pudding always had a beautiful dark colour 
and a sweet, earthy smell. Grandmother said she learned the recipe from her own 
grandmother when she was just seven years old. The children always looked forward 
to Sunday because of grandmother's pudding.`,
    questions: [
      { q: 'On which day did grandmother make the pudding?', options: ['Friday', 'Saturday', 'Sunday', 'Monday'], answer: 'Sunday' },
      { q: 'What did grandmother soak the rice in?', options: ['Warm milk', 'Cold water', 'Coconut water', 'Sweet syrup'], answer: 'Cold water' },
      { q: 'Where did grandmother learn the recipe?', options: ['From a cookery book', 'From her mother', 'From her own grandmother', 'From a neighbour'], answer: 'From her own grandmother' },
      { q: 'How old was grandmother when she learned the recipe?', options: ['Five', 'Seven', 'Ten', 'Twelve'], answer: 'Seven' },
    ],
  },
];

const LEVEL_CONFIG = {
  1: { questions: 1 },
  2: { questions: 2 },
  3: { questions: 3 },
  4: { questions: 4 },
};

const PHASE = { INTRO: 'intro', READ: 'read', QUESTION: 'question', FEEDBACK: 'feedback', COMPLETE: 'complete' };

export default function StoryRecall({ navigate }) {
  const level  = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  const [story]     = useState(() => pickRandom(STORIES, 1)[0]);
  const [questions] = useState(() => shuffle(story.questions).slice(0, config.questions));

  const [phase, setPhase] = useState(PHASE.INTRO);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect]   = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [totalHints, setTotalHints] = useState(0);
  const [hintShown, setHintShown] = useState(false);

  const currentQ = questions[qIndex];

  function handleAnswer(opt) {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt === currentQ.answer;
    if (isCorrect) setCorrect(c => c + 1);
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? '✅ That\'s right! Well remembered!'
        : `💪 The answer was "${currentQ.answer}". Keep going!`,
    });
    setPhase(PHASE.FEEDBACK);
  }

  function handleNext() {
    const nextIdx = qIndex + 1;
    if (nextIdx >= questions.length) {
      finishGame();
    } else {
      setQIndex(nextIdx);
      setSelected(null);
      setFeedback(null);
      setHintShown(false);
      setPhase(PHASE.QUESTION);
    }
  }

  function handleHint() {
    if (hintShown) return;
    setHintShown(true);
    setTotalHints(h => h + 1);
    const wrongOpts = currentQ.options.filter(o => o !== currentQ.answer);
    const eliminate = pickRandom(wrongOpts, 1)[0];
    setFeedback({ correct: null, message: `💡 Hint: "${eliminate}" is not the answer.` });
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, questions.length);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'story-recall',
      accuracy,
      correct,
      total: questions.length,
      difficulty: level,
      timestamp: nowIso(),
      responseTime: null,
      hintsUsed: totalHints,
    });
    setPhase(PHASE.COMPLETE);
  }

  const finalAccuracy = calcAccuracy(correct, questions.length);
  const nextLevel = calcNextDifficulty(level, finalAccuracy);

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info">
            <p className="gs-header__title">📖 Story Time</p>
            <p className="gs-header__sub">Memory · Comprehension</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">📖</span>
            <h1 className="gs-intro__title">Story Time</h1>
            <p className="gs-intro__desc">
              Read a short story at your own pace. Then answer some simple questions about what you read.
            </p>
            <p className="gs-intro__desc">
              <strong>Today's story:</strong> "{story.title}"
            </p>
            <p className="gs-intro__desc">
              <strong>{config.questions} question{config.questions > 1 ? 's' : ''}</strong> after the story.
            </p>
            <button className="gs-btn gs-btn--primary" onClick={() => setPhase(PHASE.READ)}>
              📖 Read the Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── READ ─────────────────────────────────────────────────────────
  if (phase === PHASE.READ) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => setPhase(PHASE.INTRO)}>← Intro</button>
          <div className="gs-header__info">
            <p className="gs-header__title">📖 Story Time</p>
            <p className="gs-header__sub">{story.title}</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level)}</span>
        </header>
        <div className="gs-content">
          <div className="sr-story">
            <p className="gs-phase-label">📖 Read the Story</p>
            <h2 className="sr-story__title">{story.title}</h2>
            <div className="sr-story__text">{story.text}</div>
            <p className="sr-story__tip">
              💡 Take your time reading. You can scroll back up if needed.
            </p>
            <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setPhase(PHASE.QUESTION); setQIndex(0); }}>
              I've read it → Answer Questions
            </button>
            <button className="gs-btn gs-btn--outline gs-btn--full gs-btn--sm" onClick={() => setPhase(PHASE.READ)}>
              🔁 Read Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──────────────────────────────────────────────────────
  if (phase === PHASE.COMPLETE) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info"><p className="gs-header__title">📖 Story Time</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">{finalAccuracy >= 80 ? '🌟' : '💪'}</span>
            <h1 className="gs-complete__title">Story Complete!</h1>
            <p className="gs-complete__sub">You remembered "{story.title}" very well!</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">Accuracy</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{correct}/{questions.length}</span>
                <span className="gs-score-card__label">Correct</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setQIndex(0); setCorrect(0); setSelected(null); setFeedback(null); setHintShown(false); setTotalHints(0); setPhase(PHASE.INTRO); }}>
                🔄 Play Again
              </button>
              <button className="gs-btn gs-btn--outline gs-btn--full" onClick={() => navigate('games-hub')}>
                ← Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTION / FEEDBACK ────────────────────────────────────────────
  return (
    <div className="gs-screen">
      <header className="gs-header">
        <button className="gs-back-btn" onClick={() => setPhase(PHASE.READ)}>← Story</button>
        <div className="gs-header__info">
          <p className="gs-header__title">📖 Story Time</p>
          <p className="gs-header__sub">Question {qIndex + 1} of {questions.length}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
        </div>

        <div className="sr-question">
          <p className="gs-phase-label">🤔 Question {qIndex + 1}</p>
          <h2 className="sr-question__text">{currentQ.q}</h2>

          {!hintShown && phase === PHASE.QUESTION && (
            <button className="gs-hint-btn" onClick={handleHint}>💡 Show a Hint</button>
          )}
          {feedback && feedback.correct === null && (
            <div className="gs-feedback gs-feedback--neutral">{feedback.message}</div>
          )}

          <div className="gs-choices">
            {currentQ.options.map((opt) => {
              let cls = 'gs-choice-btn';
              if (phase === PHASE.FEEDBACK) {
                if (opt === currentQ.answer) cls += ' gs-choice-btn--correct';
                else if (opt === selected)   cls += ' gs-choice-btn--wrong';
              } else if (opt === selected) {
                cls += ' gs-choice-btn--selected';
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={phase === PHASE.FEEDBACK}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {phase === PHASE.FEEDBACK && feedback?.correct !== null && (
            <>
              <div className={`gs-feedback ${feedback.correct ? 'gs-feedback--correct' : 'gs-feedback--incorrect'}`}>
                {feedback.message}
              </div>
              <button className="gs-btn gs-btn--primary" onClick={handleNext}>
                {qIndex + 1 >= questions.length ? 'See Results' : 'Next Question →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
