// AI Topic Understanding, Semantic Vector Search, NLP & Expanded Intent Matcher

import { CONCEPTS, SUBJECTS } from '../data/curriculumData';

// Comprehensive synonym & intent dictionary for natural language phrasing
const SYNONYM_INTENT_MAP = [
  // ================= ENGLISH: PRESENT CONTINUOUS =================
  {
    topicId: 'present-continuous',
    phrases: [
      'present continuous', 'present continuous tense', 'continuous tense', 'happening now',
      'action happening right now', 'action at this moment', 'what is happening now',
      'tense used for something happening now', 'tense used for actions happening right now',
      'what is the action happening at this moment', 'currently doing', 'actions in progress',
      'ing words', 'verb ing', 'am is are ing', 'he is running', 'she is reading',
      'what tense is used when something is going on', 'ongoing action', 'doing right now',
      'what is happening this instant', 'how to say something happening currently'
    ]
  },

  // ================= ENGLISH: PAST TENSE =================
  {
    topicId: 'past-tense',
    phrases: [
      'past tense', 'simple past', 'simple past tense', 'happened yesterday', 'already happened',
      'actions that happened in the past', 'actions finished', 'completed action',
      'what tense for yesterday', 'how to talk about yesterday', 'actions completed earlier',
      'how to say something that already finished', 'verb ed', 'regular past tense',
      'irregular past verbs', 'walked played ate wrote', 'past actions', 'done in the past',
      'talk about things finished', 'last night last week last year'
    ]
  },

  // ================= ENGLISH: VERBS =================
  {
    topicId: 'verbs',
    phrases: [
      'verbs', 'verb', 'action words', 'doing words', 'what is a verb', 'action word examples',
      'words that show action', 'words for running jumping eating', 'what someone does',
      'words for physical activities', 'tell me about verbs', 'teach action words'
    ]
  },

  // ================= ENGLISH: PREPOSITIONS =================
  {
    topicId: 'prepositions',
    phrases: [
      'prepositions', 'preposition', 'prepositions of place', 'spatial words', 'position words',
      'where is the object', 'under the table', 'above the table', 'on the table', 'inside the box',
      'beside next to behind', 'where things are located', 'words showing position', 'ball under table'
    ]
  },

  // ================= ENGLISH: NOUNS =================
  {
    topicId: 'nouns',
    phrases: [
      'nouns', 'noun', 'naming words', 'person place animal thing', 'names of people and places',
      'what is a noun', 'give examples of nouns', 'naming word categories', 'names of objects'
    ]
  },

  // ================= ENGLISH: ADJECTIVES =================
  {
    topicId: 'adjectives',
    phrases: [
      'adjectives', 'adjective', 'describing words', 'describing nouns', 'big vs small',
      'tall and short', 'fast and slow', 'words that describe colors and size',
      'how to describe an object', 'describing word examples'
    ]
  },

  // ================= ENGLISH: SENTENCE FORMATION =================
  {
    topicId: 'sentence-formation',
    phrases: [
      'sentence formation', 'sentence structure', 'how to make a sentence', 'subject verb object',
      'svo pattern', 'building a sentence', 'how sentences are constructed', 'sentence grammar parts',
      'who did what'
    ]
  },

  // ================= MATHEMATICS: FRACTIONS =================
  {
    topicId: 'fractions',
    phrases: [
      'fractions', 'fraction', 'numerator denominator', 'parts of a whole', 'divide a pizza',
      'slice of pizza', 'cutting pizza into slices', 'half and quarter', 'equal parts',
      'sharing pizza equally', 'how fractions work', 'top and bottom number', 'one half one fourth'
    ]
  },

  // ================= MATHEMATICS: GEOMETRY SHAPES =================
  {
    topicId: 'geometry-shapes',
    phrases: [
      'geometry', 'shapes', '2d shapes', '3d shapes', 'cube sphere cylinder pyramid',
      'faces edges vertices', 'solid shapes', 'flat shapes', 'sides and corners',
      'what is a cube', 'what is a sphere', 'geometry objects'
    ]
  },

  // ================= MATHEMATICS: ANGLES =================
  {
    topicId: 'angles',
    phrases: [
      'angles', 'angle', 'acute angle', 'right angle', 'obtuse angle', 'straight angle',
      'protractor', '90 degrees', 'measuring angles', 'sharp angles', 'how to measure angles',
      'two rays meeting at a point'
    ]
  },

  // ================= MATHEMATICS: MULTIPLICATION =================
  {
    topicId: 'multiplication',
    phrases: [
      'multiplication', 'multiply', 'repeated addition', 'times tables', 'groups of',
      'rows and columns', 'array grid', 'how multiplication works', '3 times 4',
      'adding equal groups'
    ]
  },

  // ================= SCIENCE: PHOTOSYNTHESIS =================
  {
    topicId: 'photosynthesis',
    phrases: [
      'photosynthesis', 'how plants make food', 'how plants eat', 'sunlight and leaves',
      'chlorophyll', 'plant food', 'glucose and oxygen', 'co2 and water plant',
      'how leaves turn sunlight into sugar', 'plants making food from sunlight',
      'why plants are green'
    ]
  },

  // ================= SCIENCE: WATER CYCLE =================
  {
    topicId: 'water-cycle',
    phrases: [
      'water cycle', 'hydrologic cycle', 'evaporation condensation precipitation',
      'how rain is formed', 'where does rain come from', 'cloud cycle', 'why it rains',
      'water recycling in nature', 'water turning into clouds and rain'
    ]
  },

  // ================= SCIENCE: SOLAR SYSTEM =================
  {
    topicId: 'solar-system',
    phrases: [
      'solar system', 'planets', 'sun and planets', 'earth mars jupiter saturn',
      'astronomy', 'how planets orbit the sun', 'space planets', '8 planets in space',
      'planet revolution'
    ]
  },

  // ================= SCIENCE: STATES OF MATTER =================
  {
    topicId: 'states-of-matter',
    phrases: [
      'states of matter', 'solid liquid gas', 'ice melting into water', 'water boiling to steam',
      'molecules', 'phase changes', 'matter changing forms', 'particles in solid liquid gas'
    ]
  },

  // ================= SOCIAL SCIENCE: EARTH ROTATION =================
  {
    topicId: 'earth-rotation',
    phrases: [
      'earth rotation', 'day and night', 'why we have day and night', 'earth spinning on axis',
      'seasons and years', 'earth revolution', 'why seasons change', 'day night cycle'
    ]
  },

  // ================= SOCIAL SCIENCE: CONTINENTS & OCEANS =================
  {
    topicId: 'continents-oceans',
    phrases: [
      'continents', 'oceans', '7 continents', '5 oceans', 'world map', 'asia africa america',
      'pacific atlantic ocean', 'land and water on earth'
    ]
  },

  // ================= SOCIAL SCIENCE: VOLCANOES =================
  {
    topicId: 'volcanoes',
    phrases: [
      'volcanoes', 'volcano', 'lava and magma', 'volcano eruption', 'magma chamber',
      'why volcanoes erupt', 'molten rock mountain'
    ]
  },

  // ================= COMPUTER SCIENCE: BINARY CODE =================
  {
    topicId: 'binary-code',
    phrases: [
      'binary code', 'binary numbers', '0s and 1s', 'zeros and ones', 'bits and bytes',
      'how computers count', 'base 2', 'digital switches on and off'
    ]
  },

  // ================= COMPUTER SCIENCE: ALGORITHMS =================
  {
    topicId: 'algorithms-flowcharts',
    phrases: [
      'algorithms', 'algorithm', 'flowcharts', 'step by step problem solving',
      'how computers sort', 'bubble sort', 'sorting algorithm', 'step by step instructions'
    ]
  },

  // ================= COMPUTER SCIENCE: HOW INTERNET WORKS =================
  {
    topicId: 'how-internet-works',
    phrases: [
      'how internet works', 'internet', 'data packets', 'web server', 'wifi router',
      'how messages travel across web', 'how websites load', 'networking'
    ]
  }
];

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'against',
  'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
  'how', 'why', 'when', 'where', 'please', 'tell', 'me', 'explain', 'show',
  'teach', 'understand', 'mean', 'meaning', 'concept', 'topic', 'pls', 'give',
  'crta', 'thing', 'want', 'like', 'know'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

class AIEngine {
  constructor() {
    this.conceptCorpus = {};
    this.buildIndex();
  }

  buildIndex() {
    Object.values(CONCEPTS).forEach(concept => {
      const tokens = [
        ...tokenize(concept.title),
        ...tokenize(concept.subtitle),
        ...tokenize(concept.rule),
        ...tokenize(concept.explanation),
        ...concept.keywords.flatMap(k => tokenize(k)),
        ...concept.examples.flatMap(ex => tokenize(ex.sentence + ' ' + (ex.visualDescription || ''))),
        ...concept.visualObjects.flatMap(vo => tokenize(vo.name + ' ' + vo.tag))
      ];

      const tf = {};
      tokens.forEach(t => {
        tf[t] = (tf[t] || 0) + 1;
      });

      const total = tokens.length || 1;
      const normalizedVector = {};
      for (const [k, v] of Object.entries(tf)) {
        normalizedVector[k] = v / total;
      }

      this.conceptCorpus[concept.id] = {
        concept,
        vector: normalizedVector,
        keywords: concept.keywords
      };
    });
  }

  // Calculate score between Query and Concept
  calculateSimilarity(queryTokens, conceptVector, queryPhrase, keywords, conceptId) {
    let score = 0;
    const lowerQuery = queryPhrase.toLowerCase().trim();

    // 1. Direct match against expanded intent phrase library
    for (const intent of SYNONYM_INTENT_MAP) {
      if (intent.topicId === conceptId) {
        for (const phrase of intent.phrases) {
          if (lowerQuery.includes(phrase.toLowerCase()) || phrase.toLowerCase().includes(lowerQuery)) {
            score += 0.85;
            break;
          }
          // Sub-phrase word match
          const pTokens = tokenize(phrase);
          const common = queryTokens.filter(t => pTokens.includes(t));
          if (common.length >= 2) {
            score += 0.45;
          }
        }
      }
    }

    // 2. Direct keyword check
    for (const kw of keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        score += 0.55;
      }
    }

    if (queryTokens.length === 0) return Math.min(1, score);

    // 3. Dot product vector cosine similarity
    let dotProduct = 0;
    let queryMagnitude = 0;
    let conceptMagnitude = 0;

    const queryTf = {};
    queryTokens.forEach(t => {
      queryTf[t] = (queryTf[t] || 0) + 1;
    });

    for (const t of Object.keys(queryTf)) {
      queryMagnitude += Math.pow(queryTf[t], 2);
    }
    queryMagnitude = Math.sqrt(queryMagnitude);

    for (const val of Object.values(conceptVector)) {
      conceptMagnitude += Math.pow(val, 2);
    }
    conceptMagnitude = Math.sqrt(conceptMagnitude);

    for (const t of Object.keys(queryTf)) {
      if (conceptVector[t]) {
        dotProduct += (queryTf[t] / (queryTokens.length || 1)) * conceptVector[t];
      }
    }

    const cosineSim = (queryMagnitude > 0 && conceptMagnitude > 0)
      ? (dotProduct / (queryMagnitude * conceptMagnitude))
      : 0;

    const finalScore = Math.min(1, score + (cosineSim * 1.5));
    return finalScore;
  }

  // Understand and Match Topic from Any Phrasing
  understandTopic(queryText) {
    const raw = (queryText || '').trim();
    if (!raw) {
      return { status: 'empty' };
    }

    const queryTokens = tokenize(raw);
    const scoredConcepts = [];

    Object.values(this.conceptCorpus).forEach(({ concept, vector, keywords }) => {
      const score = this.calculateSimilarity(queryTokens, vector, raw, keywords, concept.id);
      scoredConcepts.push({
        concept,
        score
      });
    });

    scoredConcepts.sort((a, b) => b.score - a.score);

    const topMatch = scoredConcepts[0];

    // If top match has solid score (>= 0.35), return matched concept directly!
    if (topMatch && topMatch.score >= 0.35) {
      return {
        status: 'matched',
        confidence: topMatch.score,
        concept: topMatch.concept,
        topMatches: scoredConcepts.slice(0, 3).map(m => m.concept),
        query: raw
      };
    }

    // Disambiguation
    if (topMatch && topMatch.score >= 0.15) {
      return {
        status: 'disambiguation_needed',
        confidence: topMatch.score,
        suggestions: scoredConcepts.slice(0, 3).map(m => m.concept),
        query: raw
      };
    }

    return {
      status: 'low_confidence',
      confidence: topMatch ? topMatch.score : 0,
      suggestions: [
        CONCEPTS['present-continuous'],
        CONCEPTS['past-tense'],
        CONCEPTS['fractions'],
        CONCEPTS['photosynthesis']
      ],
      query: raw
    };
  }

  // Extract dynamic visual elements and positions from sentence
  extractVisualElements(sentence) {
    const text = (sentence || '').toLowerCase();
    
    let action = 'running';

    // Prepositions of place
    if (text.includes('on the table') || text.includes('on top') || text.includes('on ')) action = 'on';
    else if (text.includes('under the table') || text.includes('beneath') || text.includes('under')) action = 'under';
    else if (text.includes('above the table') || text.includes('floating above') || text.includes('above')) action = 'above';
    else if (text.includes('in the box') || text.includes('inside') || text.includes('in box')) action = 'in';
    else if (text.includes('beside') || text.includes('next to')) action = 'beside';
    else if (text.includes('behind')) action = 'behind';

    // Present continuous actions
    else if (text.includes('run') || text.includes('sprint')) action = 'running';
    else if (text.includes('read') || text.includes('book')) action = 'reading';
    else if (text.includes('eat') || text.includes('apple') || text.includes('food')) action = 'eating';
    else if (text.includes('write') || text.includes('letter') || text.includes('pen')) action = 'writing';
    else if (text.includes('play') || text.includes('football') || text.includes('soccer')) action = 'playing';

    // Past tense actions
    else if (text.includes('played')) action = 'played';
    else if (text.includes('walked')) action = 'walked';
    else if (text.includes('ate')) action = 'ate';
    else if (text.includes('wrote')) action = 'wrote';
    else if (text.includes('danced')) action = 'danced';

    return {
      action,
      hasAction: !!action
    };
  }
}

export const aiEngine = new AIEngine();
