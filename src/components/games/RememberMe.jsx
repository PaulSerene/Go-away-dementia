/**
 * RememberMe.jsx — "RememberMe / Nostalgia" memory game for Memora.
 *
 * Shows demo memory images from existing cultural assets.
 * Patient answers simple questions about the memory shown.
 * Uses safe, fictional demo memories — no real personal data.
 *
 * Levels:
 *   1 — simple identification (what is shown?)
 *   2 — multiple choice identification
 *   3 — context/relationship question
 *   4 — combine multiple pieces of information
 */

import { useState } from 'react';
import {
  loadDifficulty, saveDifficulty, calcNextDifficulty,
  nextLevelMessage, saveResult, pickRandom, shuffle, calcAccuracy, levelLabel, nowIso
} from '../../utils/gameUtils';
import { useLanguage } from '../../locales/index.js';
import './RememberMe.css';
import '../games/GameShared.css';


// Import existing cultural assets as demo memory images
import imgChildren   from '../../assets/culture/people/children-bihu-celebration.jpg';
import imgCouple     from '../../assets/culture/people/couple-traditional-attire.jpg';
import imgElderlyW   from '../../assets/culture/people/elderly-woman-smiling.jpg';
import imgWomanLoom  from '../../assets/culture/people/woman-at-loom.jpg';
import imgDancers    from '../../assets/culture/people/classical-dancers.jpg';
import imgMonastery  from '../../assets/culture/places/colourful-monastery.jpg';
import imgTeaLeaves  from '../../assets/culture/nature/tea-leaves.jpg';
import imgHills      from '../../assets/culture/nature/rolling-green-hills.jpg';
import imgRicePuddng from '../../assets/culture/food/black-rice-pudding.jpg';
import imgWovenBasket from '../../assets/culture/crafts/woven-basket.jpg';

/* ── DEMO MEMORY DATABASE ─────────────────────────────────────── */
const DEMO_MEMORIES = [
  {
    id: 'bihu-children',
    image: imgChildren,
    alt: 'Children celebrating a festival in traditional attire',
    title: 'Festival Celebration',
    category: 'Events',
    who: 'Children in traditional clothes',
    what: 'Celebrating a festival',
    where: 'At a community gathering',
    feeling: 'Joyful and festive',
    questions: [
      { level: 1, q: 'What are the people in this memory doing?', answer: 'Celebrating a festival', options: ['Working in a field', 'Celebrating a festival', 'Having a meal', 'Going to school'] },
      { level: 2, q: 'What are the people wearing in this memory?', answer: 'Traditional festival clothes', options: ['School uniforms', 'Traditional festival clothes', 'Work clothes', 'Raincoats'] },
      { level: 3, q: 'What is the feeling in this memory?', answer: 'Joyful and festive', options: ['Sad and quiet', 'Tired and sleepy', 'Joyful and festive', 'Angry and upset'] },
      { level: 4, q: 'This memory shows children in traditional clothes. What event does it represent?', answer: 'A community festival', options: ['A market day', 'A community festival', 'A school sports day', 'A family lunch'] },
    ],
  },
  {
    id: 'couple-attire',
    image: imgCouple,
    alt: 'Couple in traditional attire',
    title: 'A Special Day Together',
    category: 'Family',
    who: 'A couple',
    what: 'Wearing traditional clothes on a special occasion',
    where: 'At a celebration',
    feeling: 'Happy and proud',
    questions: [
      { level: 1, q: 'Who is in this memory?', answer: 'A couple', options: ['A group of children', 'A couple', 'A grandmother', 'Farmers at work'] },
      { level: 2, q: 'What are they wearing?', answer: 'Traditional attire', options: ['Everyday casual clothes', 'Traditional attire', 'School clothes', 'Work uniforms'] },
      { level: 3, q: 'What kind of occasion does this appear to be?', answer: 'A celebration or special event', options: ['An ordinary workday', 'A hospital visit', 'A celebration or special event', 'A market shopping trip'] },
      { level: 4, q: 'The couple in this photo are dressed up. What does this suggest?', answer: 'They are celebrating something important', options: ['They are going to work', 'They are celebrating something important', 'They are at a sports event', 'They are travelling long distance'] },
    ],
  },
  {
    id: 'elderly-woman',
    image: imgElderlyW,
    alt: 'Elderly woman smiling warmly',
    title: 'Grandmother\'s Smile',
    category: 'Family',
    who: 'An elderly woman',
    what: 'Smiling warmly',
    where: 'At home or in a familiar place',
    feeling: 'Warm and loving',
    questions: [
      { level: 1, q: 'Who is in this memory?', answer: 'An elderly woman', options: ['A young girl', 'A man', 'An elderly woman', 'A child'] },
      { level: 2, q: 'How does the person in this memory look?', answer: 'Happy and smiling', options: ['Sad and worried', 'Tired and sleepy', 'Happy and smiling', 'Angry'] },
      { level: 3, q: 'What feeling does this memory bring?', answer: 'Warmth and love', options: ['Fear and worry', 'Warmth and love', 'Excitement and energy', 'Boredom'] },
      { level: 4, q: 'This is a photo of an elderly woman smiling. Who might she remind you of?', answer: 'A grandmother or a beloved elder', options: ['A doctor', 'A grandmother or a beloved elder', 'A neighbour you barely know', 'A teacher at school'] },
    ],
  },
  {
    id: 'woman-loom',
    image: imgWomanLoom,
    alt: 'Woman working at a traditional loom',
    title: 'Weaving at Home',
    category: 'Places',
    who: 'A woman',
    what: 'Weaving on a traditional loom',
    where: 'At home',
    feeling: 'Peaceful and skilled',
    questions: [
      { level: 1, q: 'What is the person in this memory doing?', answer: 'Weaving on a loom', options: ['Cooking a meal', 'Weaving on a loom', 'Planting rice', 'Reading a book'] },
      { level: 2, q: 'What kind of tool is being used?', answer: 'A traditional loom', options: ['A cooking pot', 'A traditional loom', 'A plough', 'A sewing needle'] },
      { level: 3, q: 'Where does this activity likely take place?', answer: 'At home', options: ['In a market', 'In a school', 'At home', 'In a hospital'] },
      { level: 4, q: 'Weaving on a loom is a traditional skill. What does this memory suggest about the person?', answer: 'She is skilled in traditional craft', options: ['She prefers modern technology', 'She is skilled in traditional craft', 'She is cooking for guests', 'She is learning a new skill for the first time'] },
    ],
  },
  {
    id: 'tea-garden',
    image: imgTeaLeaves,
    alt: 'Close-up of fresh tea leaves',
    title: 'Tea Garden Visit',
    category: 'Places',
    who: 'Tea leaves close-up',
    what: 'Fresh tea leaves ready for picking',
    where: 'A tea garden',
    feeling: 'Fresh and peaceful',
    questions: [
      { level: 1, q: 'What is shown in this memory?', answer: 'Tea leaves in a garden', options: ['Vegetables in a field', 'Tea leaves in a garden', 'Flowers in a park', 'Herbs in a kitchen'] },
      { level: 2, q: 'Where was this memory likely made?', answer: 'A tea garden', options: ['A rice paddy', 'A tea garden', 'A forest', 'A vegetable market'] },
      { level: 3, q: 'What feeling does a visit to a tea garden bring to mind?', answer: 'Freshness and calm', options: ['Excitement and noise', 'Freshness and calm', 'Sadness and loss', 'Hunger and thirst'] },
      { level: 4, q: 'These are tea leaves ready for picking. Who might visit such a place for a special outing?', answer: 'A family on a day trip', options: ['A group of fishermen', 'A family on a day trip', 'Factory workers on the night shift', 'Doctors on their rounds'] },
    ],
  },
];

const LEVEL_CONFIG = {
  1: { rounds: 3, questionLevel: 1 },
  2: { rounds: 3, questionLevel: 2 },
  3: { rounds: 4, questionLevel: 3 },
  4: { rounds: 4, questionLevel: 4 },
};

const PHASE = { INTRO: 'intro', VIEW: 'view', QUESTION: 'question', FEEDBACK: 'feedback', COMPLETE: 'complete' };

export default function RememberMe({ navigate }) {
  const { t } = useLanguage();
  const level  = loadDifficulty();
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];

  const [memories] = useState(() => {
    const pool = shuffle(DEMO_MEMORIES);
    const result = [];
    for (let i = 0; i < config.rounds; i++) result.push(pool[i % pool.length]);
    return result;
  });

  const [phase, setPhase]     = useState(PHASE.INTRO);
  const [mIndex, setMIndex]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect]   = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [totalHints, setTotalHints] = useState(0);
  const [hintShown, setHintShown]   = useState(false);

  const mem  = memories[mIndex];
  const q    = mem?.questions.find(q => q.level === config.questionLevel) || mem?.questions[0];

  function handleAnswer(opt) {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt === q.answer;
    if (isCorrect) setCorrect(c => c + 1);
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? '❤️ Wonderful! You remembered it beautifully!'
        : `💪 The answer was "${q.answer}". Every memory is precious!`,
    });
    setPhase(PHASE.FEEDBACK);
  }

  function handleHint() {
    if (hintShown) return;
    setHintShown(true);
    setTotalHints(h => h + 1);
    setFeedback({ correct: null, message: `💡 Hint: ${mem.feeling}` });
  }

  function handleNext() {
    const nextIdx = mIndex + 1;
    if (nextIdx >= config.rounds) {
      finishGame();
    } else {
      setMIndex(nextIdx);
      setSelected(null);
      setFeedback(null);
      setHintShown(false);
      setPhase(PHASE.VIEW);
    }
  }

  function finishGame() {
    const accuracy = calcAccuracy(correct, config.rounds);
    const nextLevel = calcNextDifficulty(level, accuracy);
    saveDifficulty(nextLevel);
    saveResult({
      gameType: 'remember-me',
      accuracy,
      correct,
      total: config.rounds,
      difficulty: level,
      timestamp: nowIso(),
      responseTime: null,
      hintsUsed: totalHints,
    });
    setPhase(PHASE.COMPLETE);
  }

  const finalAccuracy = calcAccuracy(correct, config.rounds);
  const nextLevel = calcNextDifficulty(level, finalAccuracy);

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === PHASE.INTRO) {
    return (
      <div className="gs-screen">
        <header className="gs-header">
          <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
          <div className="gs-header__info">
            <p className="gs-header__title">❤️ RememberMe</p>
            <p className="gs-header__sub">Nostalgia · Memory</p>
          </div>
          <span className="gs-difficulty-badge">{levelLabel(level)}</span>
        </header>
        <div className="gs-content">
          <div className="gs-intro">
            <span className="gs-intro__emoji">❤️</span>
            <h1 className="gs-intro__title">RememberMe</h1>
            <p className="gs-intro__desc">
              A memory photo will appear. Look at it carefully and answer a simple question about it.
              Take your time — these are warm, familiar memories.
            </p>
            <p className="gs-intro__desc">
              <strong>Note:</strong> These are demo memories — not your personal photos.
            </p>
            <p className="gs-intro__desc">
              <strong>{config.rounds} memories</strong> to explore.
            </p>
            <button className="gs-btn gs-btn--primary" onClick={() => setPhase(PHASE.VIEW)}>
              ❤️ Begin
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
          <div className="gs-header__info"><p className="gs-header__title">❤️ RememberMe</p></div>
        </header>
        <div className="gs-content">
          <div className="gs-complete">
            <span className="gs-complete__emoji">❤️</span>
            <h1 className="gs-complete__title">Wonderful!</h1>
            <p className="gs-complete__sub">Your memories are precious, Mrs. Das.</p>
            <div className="gs-score-grid">
              <div className="gs-score-card">
                <span className="gs-score-card__value">{finalAccuracy}%</span>
                <span className="gs-score-card__label">Accuracy</span>
              </div>
              <div className="gs-score-card">
                <span className="gs-score-card__value">{correct}/{config.rounds}</span>
                <span className="gs-score-card__label">Correct</span>
              </div>
            </div>
            <div className="gs-level-msg">{nextLevelMessage(level, nextLevel)}</div>
            <div className="gs-actions">
              <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => { setMIndex(0); setCorrect(0); setSelected(null); setFeedback(null); setHintShown(false); setTotalHints(0); setPhase(PHASE.INTRO); }}>
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

  if (!mem || !q) return null;

  return (
    <div className="gs-screen">
      <header className="gs-header">
        <button className="gs-back-btn" onClick={() => navigate('games-hub')}>← Games</button>
        <div className="gs-header__info">
          <p className="gs-header__title">❤️ RememberMe</p>
          <p className="gs-header__sub">Memory {mIndex + 1} of {config.rounds}</p>
        </div>
        <span className="gs-difficulty-badge">{levelLabel(level)}</span>
      </header>

      <div className="gs-content">
        <div className="gs-progress-wrap">
          <div className="gs-progress-fill" style={{ width: `${(mIndex / config.rounds) * 100}%` }} />
        </div>

        {/* VIEW phase */}
        {phase === PHASE.VIEW && (
          <div className="rm-view">
            <p className="gs-phase-label">🖼️ Look at this memory</p>
            <div className="rm-image-card">
              <img src={mem.image} alt={mem.alt} className="rm-image" />
              <div className="rm-image__caption">
                <span className="rm-image__title">{mem.title}</span>
                <span className="rm-image__cat">{mem.category}</span>
              </div>
            </div>
            <p className="rm-view__tip">Take a moment to look carefully. When you're ready, tap the button below.</p>
            <button className="gs-btn gs-btn--primary gs-btn--full" onClick={() => setPhase(PHASE.QUESTION)}>
              I'm Ready → Answer the Question
            </button>
          </div>
        )}

        {/* QUESTION/FEEDBACK phase */}
        {(phase === PHASE.QUESTION || phase === PHASE.FEEDBACK) && (
          <div className="rm-question">
            {/* Thumbnail reminder */}
            <div className="rm-thumbnail">
              <img src={mem.image} alt={mem.alt} className="rm-thumbnail__img" />
              <span className="rm-thumbnail__title">{mem.title}</span>
            </div>

            <h2 className="rm-question__text">{q.q}</h2>

            {!hintShown && phase === PHASE.QUESTION && (
              <button className="gs-hint-btn" onClick={handleHint}>💡 Show a Hint</button>
            )}
            {feedback && feedback.correct === null && (
              <div className="gs-feedback gs-feedback--neutral">{feedback.message}</div>
            )}

            <div className="gs-choices">
              {q.options.map(opt => {
                let cls = 'gs-choice-btn';
                if (phase === PHASE.FEEDBACK) {
                  if (opt === q.answer) cls += ' gs-choice-btn--correct';
                  else if (opt === selected) cls += ' gs-choice-btn--wrong';
                } else if (opt === selected) cls += ' gs-choice-btn--selected';
                return (
                  <button key={opt} className={cls} onClick={() => handleAnswer(opt)} disabled={phase === PHASE.FEEDBACK}>
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
                  {mIndex + 1 >= config.rounds ? 'See Results' : 'Next Memory →'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
