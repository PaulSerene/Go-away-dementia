/**
 * src/utils/wordPools.js — Localized Word Pool for Word Chain game
 *
 * Architecture:
 *   Each pool is an array of word arrays (chains).
 *   Languages without a validated pool fall back to the English pool.
 *
 * Translation quality notes:
 *   - 'en': full pool (English, validated)
 *   - 'hi': full pool (Hindi, best-effort — native review recommended)
 *   - 'as','bn','ne': partial pool — native review recommended
 *   - 'te': partial pool — native review recommended
 *   - 'mni','lus','kha','grt','brx': no native pool — English fallback used
 *
 * Game logic notes:
 *   - Word chain game shows a sequence and asks what was the last word.
 *   - Words in a chain should be thematically connected.
 *   - Words must be recognizable to elderly users in that language.
 *   - Do NOT machine-translate and assume this creates valid linguistic chains.
 */

/** English word pool — authoritative, full game support */
export const wordPools = {
  en: [
    ['river', 'water', 'fish', 'net', 'market', 'home'],
    ['tea', 'garden', 'leaf', 'rain', 'cloud', 'sky'],
    ['mother', 'kitchen', 'rice', 'fire', 'smoke', 'village'],
    ['school', 'book', 'learn', 'grow', 'tree', 'forest'],
    ['festival', 'music', 'dance', 'drum', 'bamboo', 'craft'],
    ['flower', 'honey', 'bee', 'hive', 'sweet', 'fruit'],
    ['mountain', 'mist', 'morning', 'dew', 'grass', 'path'],
    ['grandmother', 'story', 'lamp', 'night', 'stars', 'moon'],
  ],

  /**
   * Hindi (हिंदी) — Common familiar nouns for elderly users.
   * Best-effort. Native-speaker review recommended.
   */
  hi: [
    ['नदी', 'पानी', 'मछली', 'जाल', 'बाज़ार', 'घर'],
    ['चाय', 'बगीचा', 'पत्ती', 'बारिश', 'बादल', 'आकाश'],
    ['माँ', 'रसोई', 'चावल', 'आग', 'धुआँ', 'गाँव'],
    ['स्कूल', 'किताब', 'सीखना', 'बढ़ना', 'पेड़', 'जंगल'],
    ['त्योहार', 'संगीत', 'नृत्य', 'ढोल', 'बाँस', 'शिल्प'],
    ['फूल', 'शहद', 'मधुमक्खी', 'छत्ता', 'मीठा', 'फल'],
    ['पहाड़', 'कोहरा', 'सुबह', 'ओस', 'घास', 'रास्ता'],
    ['दादी', 'कहानी', 'दीपक', 'रात', 'तारे', 'चाँद'],
  ],

  /**
   * Assamese (অসমীয়া) — Best-effort. Review required.
   */
  as: [
    ['নদী', 'পানী', 'মাছ', 'জাল', 'বজাৰ', 'ঘৰ'],
    ['চাহ', 'বাগিচা', 'পাত', 'বৰষুণ', 'ডাৱৰ', 'আকাশ'],
    ['মা', 'পাকঘৰ', 'ভাত', 'জুই', 'ধোঁৱা', 'গাঁও'],
    ['বিদ্যালয়', 'কিতাপ', 'শিকা', 'গছ', 'অৰণ্য', 'পথ'],
    ['উৎসৱ', 'সংগীত', 'নৃত্য', 'ঢোল', 'বাঁহ', 'হস্তশিল্প'],
    ['ফুল', 'মৌজ', 'মৌমাখি', 'মৌচাক', 'মিঠা', 'ফল'],
    ['পৰ্বত', 'কুঁৱলী', 'ৰাতিপুৱা', 'নিয়ৰ', 'ঘাঁহ', 'পথ'],
    ['আইতা', 'গল্প', 'বন্তি', 'ৰাতি', 'তৰা', 'জোন'],
  ],

  /**
   * Bengali (বাংলা) — Best-effort. Review required.
   */
  bn: [
    ['নদী', 'জল', 'মাছ', 'জাল', 'বাজার', 'বাড়ি'],
    ['চা', 'বাগান', 'পাতা', 'বৃষ্টি', 'মেঘ', 'আকাশ'],
    ['মা', 'রান্নাঘর', 'ভাত', 'আগুন', 'ধোঁয়া', 'গ্রাম'],
    ['স্কুল', 'বই', 'শেখা', 'বড় হওয়া', 'গাছ', 'বন'],
    ['উৎসব', 'সংগীত', 'নৃত্য', 'ঢোল', 'বাঁশ', 'কারুশিল্প'],
    ['ফুল', 'মধু', 'মৌমাছি', 'চাক', 'মিষ্টি', 'ফল'],
    ['পাহাড়', 'কুয়াশা', 'সকাল', 'শিশির', 'ঘাস', 'পথ'],
    ['দিদিমা', 'গল্প', 'প্রদীপ', 'রাত', 'তারা', 'চাঁদ'],
  ],

  /**
   * Nepali (नेपाली) — Best-effort. Review required.
   */
  ne: [
    ['नदी', 'पानी', 'माछा', 'जाल', 'बजार', 'घर'],
    ['चिया', 'बगैंचा', 'पात', 'पानी', 'बादल', 'आकाश'],
    ['आमा', 'भान्सा', 'भात', 'आगो', 'धुवाँ', 'गाउँ'],
    ['स्कुल', 'किताब', 'सिक्नु', 'बढ्नु', 'रुख', 'जंगल'],
    ['चाड', 'संगीत', 'नाच', 'ढोल', 'बाँस', 'सिप'],
    ['फूल', 'मह', 'मौरी', 'गोला', 'मीठो', 'फल'],
    ['पहाड', 'कुहिरो', 'बिहान', 'शिशिर', 'घाँस', 'बाटो'],
    ['हजुरआमा', 'कथा', 'बत्ती', 'रात', 'तारा', 'चन्द्रमा'],
  ],

  /**
   * Telugu (తెలుగు) — Partial. Review required.
   */
  te: [
    ['నది', 'నీరు', 'చేప', 'వల', 'సంత', 'ఇల్లు'],
    ['తేయాకు', 'తోట', 'ఆకు', 'వర్షం', 'మేఘం', 'ఆకాశం'],
    ['అమ్మ', 'వంటగది', 'అన్నం', 'నిప్పు', 'పొగ', 'పల్లె'],
    ['పాఠశాల', 'పుస్తకం', 'నేర్చుకో', 'చెట్టు', 'అడవి', 'దారి'],
    ['పండుగ', 'సంగీతం', 'నృత్యం', 'డోలు', 'వెదురు', 'చేతిపని'],
    ['పువ్వు', 'తేనె', 'తేనెటీగ', 'పట్టు', 'తీపి', 'పండు'],
    ['కొండ', 'పొగ మంచు', 'ఉదయం', 'మంచు', 'గడ్డి', 'దారి'],
    ['నానమ్మ', 'కథ', 'దీపం', 'రాత్రి', 'నక్షత్రాలు', 'చంద్రుడు'],
  ],

  // Languages without validated word pools fall back to English:
  mni: null,
  lus: null,
  kha: null,
  grt: null,
  brx: null,
};

/**
 * Get the word pool for a language, falling back to English.
 * @param {string} lang  Internal locale code
 * @returns {string[][]}  Array of word chains
 */
export function getWordPool(lang) {
  const pool = wordPools[lang];
  if (!pool || pool.length === 0) {
    return wordPools.en;
  }
  return pool;
}

/**
 * Get all unique words from a pool (for building wrong-answer options).
 * @param {string[][]} pool
 * @returns {string[]}
 */
export function getAllWords(pool) {
  return [...new Set(pool.flat())];
}
