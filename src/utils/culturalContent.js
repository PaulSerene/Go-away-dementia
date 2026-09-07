/**
 * culturalContent.js — Memora Cultural Content Data Layer
 *
 * All images are Vite-bundled local imports — no network requests needed.
 * This file is the SINGLE source of truth for cultural assets.
 *
 * Schema per item:
 *   id          — stable kebab-case identifier (never change once shipped)
 *   category    — "nature" | "wildlife" | "food" | "crafts" | "textiles" | "people" | "places"
 *   image       — imported asset (bundled by Vite, works offline)
 *   name        — { en: string } — localization-ready; add other locales alongside `en`
 *   description — { en: string } — short context for Aroha / tooltips / alt text
 *   tags        — string[] — for filtering (e.g. ["memory-game", "nature"])
 *   gameReady   — boolean — true if image is clear enough for elderly memory-game use
 *
 * HOW TO ADD A LANGUAGE:
 *   Add a key under name / description, e.g. name: { en: "Tea Leaves", as: "চাহ পাত" }
 *   Do NOT remove the "en" key. The app falls back to "en" if a locale is missing.
 *
 * HOW TO FILTER:
 *   import { getByCategory, getGameReadyItems, sampleItems } from './culturalContent';
 */

// -- NATURE -------------------------------------------------------------------
import imgTeaLeaves         from '../assets/culture/nature/tea-leaves.jpg';
import imgMistyMeadow       from '../assets/culture/nature/misty-meadow-hills.jpg';
import imgRollingHills      from '../assets/culture/nature/rolling-green-hills.jpg';
import imgMountainValley    from '../assets/culture/nature/mountain-valley.jpg';
import imgMistyForest       from '../assets/culture/nature/misty-forest.jpg';
import imgHillsideRain      from '../assets/culture/nature/hillside-rain.jpg';
import imgOrchidPink        from '../assets/culture/nature/orchid-pink.jpg';
import imgOrchidRed         from '../assets/culture/nature/orchid-red.jpg';

// -- WILDLIFE -----------------------------------------------------------------
import imgRhinoceros        from '../assets/culture/wildlife/one-horned-rhinoceros.jpg';
import imgWildBuffalo       from '../assets/culture/wildlife/wild-buffalo.jpg';
import imgWaterBuffaloEgret from '../assets/culture/wildlife/water-buffalo-egret.jpg';
import imgHornbillPerched   from '../assets/culture/wildlife/great-hornbill-perched.jpg';
import imgHornbillForest    from '../assets/culture/wildlife/great-hornbill-forest.jpg';
import imgDeerFawn          from '../assets/culture/wildlife/deer-with-fawn.jpg';
import imgDeerAntlers       from '../assets/culture/wildlife/deer-antlers.jpg';
import imgRedPanda          from '../assets/culture/wildlife/red-panda.jpg';
import imgDecoratedYak      from '../assets/culture/wildlife/decorated-yak.jpg';
import imgHoneybee          from '../assets/culture/wildlife/honeybee-on-comb.jpg';

// -- FOOD ---------------------------------------------------------------------
import imgFreshFish         from '../assets/culture/food/fresh-fish-market.jpg';
import imgPineapples        from '../assets/culture/food/pineapples.jpg';
import imgRedChilliPlant    from '../assets/culture/food/red-chilli-plant.jpg';
import imgRedChilliClose    from '../assets/culture/food/red-chilli-closeup.jpg';
import imgBlackRicePudding  from '../assets/culture/food/black-rice-pudding.jpg';

// -- CRAFTS -------------------------------------------------------------------
import imgSilkCocoons       from '../assets/culture/crafts/silk-cocoons.jpg';
import imgDrumFaceClose     from '../assets/culture/crafts/decorated-drum-face-closeup.jpg';
import imgDrumFaceHeld      from '../assets/culture/crafts/decorated-drum-face-held.jpg';
import imgBambooCraftMarket from '../assets/culture/crafts/bamboo-craft-market.jpg';
import imgWovenBasket       from '../assets/culture/crafts/woven-basket.jpg';
import imgBambooSplitting   from '../assets/culture/crafts/bamboo-splitting.jpg';
import imgLargeDrum         from '../assets/culture/crafts/large-painted-drum.jpg';
import imgBambooFlute       from '../assets/culture/crafts/bamboo-flute.jpg';
import imgStiltHouse        from '../assets/culture/crafts/bamboo-stilt-house.jpg';
import imgWovenCap          from '../assets/culture/crafts/woven-cap.jpg';
import imgWovenCapDetail    from '../assets/culture/crafts/woven-cap-detail.jpg';

// -- TEXTILES -----------------------------------------------------------------
import imgSilverJewellery   from '../assets/culture/textiles/traditional-silver-jewellery.jpg';
import imgHandwovenFabric   from '../assets/culture/textiles/handwoven-fabric.jpg';

// -- PEOPLE -------------------------------------------------------------------
import imgWomanWithDrum     from '../assets/culture/people/woman-with-drum.jpg';
import imgChildrenCelebrate from '../assets/culture/people/children-bihu-celebration.jpg';
import imgTraditionalAttire from '../assets/culture/people/traditional-attire-beaded-jewellery.jpg';
import imgClassicalDancers  from '../assets/culture/people/classical-dancers.jpg';
import imgElderlyWoman      from '../assets/culture/people/elderly-woman-smiling.jpg';
import imgWomanAtLoom       from '../assets/culture/people/woman-at-loom.jpg';
import imgCoupleTraditional from '../assets/culture/people/couple-traditional-attire.jpg';

// -- PLACES -------------------------------------------------------------------
import imgMonastery         from '../assets/culture/places/colourful-monastery.jpg';
import imgMonasteryFlags    from '../assets/culture/places/monastery-with-flags.jpg';

/* ===========================================================================
   CULTURAL CONTENT CATALOGUE
   =========================================================================== */

export const CULTURAL_CONTENT = [

  // -- NATURE -----------------------------------------------------------------
  {
    id: 'tea-leaves',
    category: 'nature',
    image: imgTeaLeaves,
    name: { en: 'Tea Leaves' },
    description: { en: 'Fresh young tea leaves in a sunlit plantation.' },
    tags: ['nature', 'memory-game', 'landscape'],
    gameReady: true,
  },
  {
    id: 'misty-meadow-hills',
    category: 'nature',
    image: imgMistyMeadow,
    name: { en: 'Misty Hill Meadow' },
    description: { en: 'Rolling green hills covered in wildflowers under low clouds.' },
    tags: ['nature', 'landscape', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'rolling-green-hills',
    category: 'nature',
    image: imgRollingHills,
    name: { en: 'Rolling Green Hills' },
    description: { en: 'Deeply contoured green hills stretching into the distance.' },
    tags: ['nature', 'landscape', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'mountain-valley',
    category: 'nature',
    image: imgMountainValley,
    name: { en: 'Mountain Valley' },
    description: { en: 'A lush valley with steep forested slopes and bamboo vegetation.' },
    tags: ['nature', 'landscape', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'misty-forest',
    category: 'nature',
    image: imgMistyForest,
    name: { en: 'Misty Forest' },
    description: { en: 'Tall trees viewed from below, shrouded in morning mist.' },
    tags: ['nature', 'forest'],
    gameReady: false,
  },
  {
    id: 'hillside-rain',
    category: 'nature',
    image: imgHillsideRain,
    name: { en: 'Hillside in the Rain' },
    description: { en: 'A figure in orange standing on a grassy hillside under rain clouds.' },
    tags: ['nature', 'landscape', 'people'],
    gameReady: false,
  },
  {
    id: 'orchid-pink',
    category: 'nature',
    image: imgOrchidPink,
    name: { en: 'Pink Orchid' },
    description: { en: 'Two delicate pink and white orchid flowers on a tree.' },
    tags: ['nature', 'flower', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'orchid-red',
    category: 'nature',
    image: imgOrchidRed,
    name: { en: 'Red Orchid' },
    description: { en: 'Vibrant red orchid flowers growing against a bamboo trunk.' },
    tags: ['nature', 'flower', 'memory-game'],
    gameReady: true,
  },

  // -- WILDLIFE ---------------------------------------------------------------
  {
    id: 'one-horned-rhinoceros',
    category: 'wildlife',
    image: imgRhinoceros,
    name: { en: 'One-Horned Rhinoceros' },
    description: { en: 'A large one-horned rhinoceros walking through grassland.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'wild-buffalo',
    category: 'wildlife',
    image: imgWildBuffalo,
    name: { en: 'Wild Buffalo' },
    description: { en: 'A powerful wild buffalo facing the camera in open grassland.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'water-buffalo-egret',
    category: 'wildlife',
    image: imgWaterBuffaloEgret,
    name: { en: 'Water Buffalo and Egret' },
    description: { en: 'A water buffalo in tall grass with a white egret resting on its back.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'great-hornbill-perched',
    category: 'wildlife',
    image: imgHornbillPerched,
    name: { en: 'Great Hornbill' },
    description: { en: 'A great hornbill bird perched on a branch, showing its distinctive yellow casque.' },
    tags: ['wildlife', 'bird', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'great-hornbill-forest',
    category: 'wildlife',
    image: imgHornbillForest,
    name: { en: 'Hornbill in Forest' },
    description: { en: 'A great hornbill bird on a branch surrounded by green foliage.' },
    tags: ['wildlife', 'bird', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'deer-with-fawn',
    category: 'wildlife',
    image: imgDeerFawn,
    name: { en: 'Deer and Fawn' },
    description: { en: 'A deer with antlers and its young fawn in an enclosure.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'deer-antlers',
    category: 'wildlife',
    image: imgDeerAntlers,
    name: { en: 'Deer with Antlers' },
    description: { en: 'A young male deer with velvet antlers looking directly at the camera.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'red-panda',
    category: 'wildlife',
    image: imgRedPanda,
    name: { en: 'Red Panda' },
    description: { en: 'A red panda with rust-coloured fur sitting on a mossy branch.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'decorated-yak',
    category: 'wildlife',
    image: imgDecoratedYak,
    name: { en: 'Decorated Yak' },
    description: { en: 'A yak adorned with colourful embroidered blanket and tassels near a mountain lake.' },
    tags: ['wildlife', 'animal', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'honeybee-on-comb',
    category: 'wildlife',
    image: imgHoneybee,
    name: { en: 'Honeybee' },
    description: { en: 'A close-up of a honeybee on a golden honeycomb.' },
    tags: ['wildlife', 'insect', 'memory-game'],
    gameReady: true,
  },

  // -- FOOD -------------------------------------------------------------------
  {
    id: 'fresh-fish-market',
    category: 'food',
    image: imgFreshFish,
    name: { en: 'Fresh Fish' },
    description: { en: 'Two wicker baskets of fresh silver fish at a market.' },
    tags: ['food', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'pineapples',
    category: 'food',
    image: imgPineapples,
    name: { en: 'Pineapples' },
    description: { en: 'A large pile of ripe pineapples with spiky green leaves.' },
    tags: ['food', 'fruit', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'red-chilli-plant',
    category: 'food',
    image: imgRedChilliPlant,
    name: { en: 'Red Chilli Plant' },
    description: { en: 'Two red chillies hanging on a plant against green leaves.' },
    tags: ['food', 'spice', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'red-chilli-closeup',
    category: 'food',
    image: imgRedChilliClose,
    name: { en: 'Red Chillies' },
    description: { en: 'Three bright red chillies on a plant with hills in the background.' },
    tags: ['food', 'spice', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'black-rice-pudding',
    category: 'food',
    image: imgBlackRicePudding,
    name: { en: 'Black Rice Pudding' },
    description: { en: 'A bowl of dark purple-black rice pudding topped with sliced almonds.' },
    tags: ['food', 'dessert', 'memory-game'],
    gameReady: true,
  },

  // -- CRAFTS -----------------------------------------------------------------
  {
    id: 'silk-cocoons',
    category: 'crafts',
    image: imgSilkCocoons,
    name: { en: 'Silk Cocoons' },
    description: { en: 'A pile of golden-yellow silk cocoons used in traditional weaving.' },
    tags: ['crafts', 'textile', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'decorated-drum-face-closeup',
    category: 'crafts',
    image: imgDrumFaceClose,
    name: { en: 'Decorated Drum Cover' },
    description: { en: 'A circular bamboo drum face decorated with colourful star patterns and sequins.' },
    tags: ['crafts', 'music', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'decorated-drum-face-held',
    category: 'crafts',
    image: imgDrumFaceHeld,
    name: { en: 'Drum Cover (Held)' },
    description: { en: 'A hand-held circular bamboo drum cover with red and blue star patterns.' },
    tags: ['crafts', 'music', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'bamboo-craft-market',
    category: 'crafts',
    image: imgBambooCraftMarket,
    name: { en: 'Bamboo Craft Stall' },
    description: { en: 'A market stall packed with woven bamboo baskets, wooden spoons, and other crafts.' },
    tags: ['crafts', 'market'],
    gameReady: false,
  },
  {
    id: 'woven-basket',
    category: 'crafts',
    image: imgWovenBasket,
    name: { en: 'Woven Cane Basket' },
    description: { en: 'A hand-woven cane carry basket with a coiled handle, on a wooden table.' },
    tags: ['crafts', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'bamboo-splitting',
    category: 'crafts',
    image: imgBambooSplitting,
    name: { en: 'Bamboo Craft Work' },
    description: { en: 'A craftsperson splitting bamboo with a blade to prepare it for weaving.' },
    tags: ['crafts', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'large-painted-drum',
    category: 'crafts',
    image: imgLargeDrum,
    name: { en: 'Large Painted Drum' },
    description: { en: 'A large ceremonial wooden drum painted black with red and white swirl patterns.' },
    tags: ['crafts', 'music', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'bamboo-flute',
    category: 'crafts',
    image: imgBambooFlute,
    name: { en: 'Bamboo Flute' },
    description: { en: 'A carved bamboo flute with engraved geometric patterns on a pale surface.' },
    tags: ['crafts', 'music', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'bamboo-stilt-house',
    category: 'crafts',
    image: imgStiltHouse,
    name: { en: 'Stilt House' },
    description: { en: 'A traditional bamboo and woven-panel house raised on wooden stilts above water.' },
    tags: ['crafts', 'places', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'woven-cap',
    category: 'crafts',
    image: imgWovenCap,
    name: { en: 'Woven Bamboo Cap' },
    description: { en: 'Two woven bamboo caps with a fine mesh pattern, displayed on a tray.' },
    tags: ['crafts', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'woven-cap-detail',
    category: 'crafts',
    image: imgWovenCapDetail,
    name: { en: 'Bamboo Cap (Detail)' },
    description: { en: 'Close-up of a single woven bamboo cap resting on a cane weaving tray.' },
    tags: ['crafts', 'memory-game'],
    gameReady: true,
  },

  // -- TEXTILES ---------------------------------------------------------------
  {
    id: 'traditional-silver-jewellery',
    category: 'textiles',
    image: imgSilverJewellery,
    name: { en: 'Traditional Silver Jewellery' },
    description: { en: 'An assortment of traditional silver jewellery — bangles, necklaces, and earrings — laid on a woven cloth.' },
    tags: ['textiles', 'jewellery', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'handwoven-fabric',
    category: 'textiles',
    image: imgHandwovenFabric,
    name: { en: 'Handwoven Fabric' },
    description: { en: 'A colourful handwoven cloth with geometric stripe and dot patterns, with fringed ends.' },
    tags: ['textiles', 'memory-game'],
    gameReady: true,
  },

  // -- PEOPLE -----------------------------------------------------------------
  {
    id: 'woman-with-drum',
    category: 'people',
    image: imgWomanWithDrum,
    name: { en: 'Woman with Drum' },
    description: { en: 'A young woman in traditional silk attire seated beside a dhol drum and a decorated drum cover.' },
    tags: ['people', 'music', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'children-bihu-celebration',
    category: 'people',
    image: imgChildrenCelebrate,
    name: { en: 'Children at a Celebration' },
    description: { en: 'Children in traditional red-and-gold festive attire performing at a cultural event; a boy carries a decorated drum.' },
    tags: ['people', 'festival', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'traditional-attire-beaded-jewellery',
    category: 'people',
    image: imgTraditionalAttire,
    name: { en: 'Traditional Festive Attire' },
    description: { en: 'A young woman in a cream and red traditional outfit wearing multi-strand beaded necklaces and a floral headpiece.' },
    tags: ['people', 'festival', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'classical-dancers',
    category: 'people',
    image: imgClassicalDancers,
    name: { en: 'Classical Dancers' },
    description: { en: 'Two performers in elaborate classical Indian dance costumes, one mid-gesture.' },
    tags: ['people', 'dance', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'elderly-woman-smiling',
    category: 'people',
    image: imgElderlyWoman,
    name: { en: 'Elderly Woman Smiling' },
    description: { en: 'Portrait of an elderly woman smiling warmly, wearing colourful bead necklaces and a nose ornament.' },
    tags: ['people'],
    gameReady: false,
  },
  {
    id: 'woman-at-loom',
    category: 'people',
    image: imgWomanAtLoom,
    name: { en: 'Weaving at a Loom' },
    description: { en: 'A woman in traditional attire weaving fabric on a traditional back-strap loom.' },
    tags: ['people', 'crafts', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'couple-traditional-attire',
    category: 'people',
    image: imgCoupleTraditional,
    name: { en: 'Couple in Traditional Attire' },
    description: { en: 'A young man and woman in traditional woven garments and coin jewellery posing together.' },
    tags: ['people', 'festival', 'memory-game'],
    gameReady: true,
  },

  // -- PLACES -----------------------------------------------------------------
  {
    id: 'colourful-monastery',
    category: 'places',
    image: imgMonastery,
    name: { en: 'Colourful Monastery' },
    description: { en: 'A richly painted multi-tiered monastery building on a forested hillside.' },
    tags: ['places', 'memory-game'],
    gameReady: true,
  },
  {
    id: 'monastery-with-flags',
    category: 'places',
    image: imgMonasteryFlags,
    name: { en: 'Monastery with Prayer Flags' },
    description: { en: 'A monastery decorated with colourful prayer flags and a painted Dharma wheel.' },
    tags: ['places', 'memory-game'],
    gameReady: true,
  },
];

/* ===========================================================================
   UTILITY HELPERS
   =========================================================================== */

/** Get all items from a specific category. */
export function getByCategory(category) {
  return CULTURAL_CONTENT.filter((item) => item.category === category);
}

/** Get all items tagged as suitable for the memory game. */
export function getGameReadyItems() {
  return CULTURAL_CONTENT.filter((item) => item.gameReady);
}

/** Get all items matching one or more tags. */
export function getByTags(tags) {
  return CULTURAL_CONTENT.filter((item) =>
    tags.some((tag) => item.tags.includes(tag))
  );
}

/**
 * Randomly sample `count` items from an array without repeating.
 * Safe to call with any subset of CULTURAL_CONTENT.
 */
export function sampleItems(items, count) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Get the localized name for an item, falling back to English. */
export function getLocaleName(item, locale = 'en') {
  return item.name[locale] ?? item.name['en'];
}

/** Get the localized description for an item, falling back to English. */
export function getLocaleDescription(item, locale = 'en') {
  return item.description[locale] ?? item.description['en'];
}

export default CULTURAL_CONTENT;
