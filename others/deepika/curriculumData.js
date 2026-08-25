// SMART EDUCATION Curriculum & Visual Knowledge Base

export const SUBJECTS = [
  {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: '#4F46E5',
    gradient: 'from-indigo-600 to-blue-500',
    bgLight: '#EEF2FF',
    description: 'Master grammar, action words, tenses, active/passive voice, parajumbles, and sentence building with live animations.',
    conceptCount: 11,
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '🔢',
    color: '#0D9488',
    gradient: 'from-teal-600 to-emerald-500',
    bgLight: '#CCFBF1',
    description: 'See numbers come alive with interactive fraction pizzas, geometry visualizers, and angle dials.',
    conceptCount: 4,
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: '#0284C7',
    gradient: 'from-sky-600 to-cyan-500',
    bgLight: '#E0F2FE',
    description: 'Explore the wonders of photosynthesis, water cycles, solar system orbits, and states of matter.',
    conceptCount: 4,
  },
  {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    color: '#D97706',
    gradient: 'from-amber-600 to-orange-500',
    bgLight: '#FEF3C7',
    description: 'Discover Earth’s day-night rotation, seasonal orbits, volcano cross-sections, and world continents.',
    conceptCount: 3,
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: '💻',
    color: '#7C3AED',
    gradient: 'from-purple-600 to-pink-500',
    bgLight: '#F3E8FF',
    description: 'Understand binary 0s and 1s, algorithm sorting animations, and how internet packets travel.',
    conceptCount: 3,
  }
];

export const CONCEPTS = {
  // ===================== ENGLISH =====================
  'present-continuous': {
    id: 'present-continuous',
    subjectId: 'english',
    title: 'Present Continuous Tense',
    subtitle: 'Actions happening right now in this very moment',
    badge: 'Grammar & Tenses',
    rule: 'Subject + am/is/are + Verb-ing',
    explanation: 'We use the Present Continuous Tense to describe an action that is happening right now, at this exact moment. Whenever you see someone doing something currently, use is/am/are with an -ing word!',
    visualType: 'action-animation',
    visualObjects: [
      { name: 'Boy Running', type: 'character', tag: 'Subject (He) + Verb (running)' },
      { name: 'Girl Reading', type: 'character', tag: 'Subject (She) + Verb (reading)' },
      { name: 'Person Eating', type: 'character', tag: 'Subject (He) + Verb (eating)' },
      { name: 'Student Writing', type: 'character', tag: 'Subject (She) + Verb (writing)' },
      { name: 'Kids Playing', type: 'character', tag: 'Subject (They) + Verb (playing)' }
    ],
    examples: [
      {
        id: 'running',
        sentence: 'He is running.',
        action: 'running',
        subject: 'He',
        verb: 'is running',
        object: 'on the track',
        character: 'boy',
        bg: 'track',
        visualDescription: 'Animated boy enthusiastically sprinting along the track with moving motion lines.'
      },
      {
        id: 'reading',
        sentence: 'She is reading a book.',
        action: 'reading',
        subject: 'She',
        verb: 'is reading',
        object: 'a colorful book',
        character: 'girl',
        bg: 'library',
        visualDescription: 'Animated girl sitting comfortably turning the pages of an illustrated storybook.'
      },
      {
        id: 'eating',
        sentence: 'He is eating a juicy apple.',
        action: 'eating',
        subject: 'He',
        verb: 'is eating',
        object: 'a red apple',
        character: 'boy',
        bg: 'kitchen',
        visualDescription: 'Boy happily taking bites from a crisp red apple.'
      },
      {
        id: 'writing',
        sentence: 'She is writing a letter.',
        action: 'writing',
        subject: 'She',
        verb: 'is writing',
        object: 'a letter with a pen',
        character: 'girl',
        bg: 'desk',
        visualDescription: 'Girl carefully writing notes on paper with a shining pencil.'
      },
      {
        id: 'playing',
        sentence: 'They are playing football.',
        action: 'playing',
        subject: 'They',
        verb: 'are playing',
        object: 'football in the field',
        character: 'kids',
        bg: 'field',
        visualDescription: 'Children kicking and passing a soccer ball across a green grassy field.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Look at the visual animation. Which sentence accurately describes the boy sprinting?',
        visualPreview: 'running',
        options: [
          { text: 'He is running.', correct: true },
          { text: 'He will run yesterday.', correct: false },
          { text: 'He sleeping right now.', correct: false },
          { text: 'He ran tomorrow.', correct: false }
        ],
        explanation: 'Because the boy is performing the action right now, we use Subject (He) + is + Verb-ing (running)!'
      },
      {
        id: 'q2',
        question: 'Complete the sentence for what the girl in the visual is doing: "She _____ a book."',
        visualPreview: 'reading',
        options: [
          { text: 'is reading', correct: true },
          { text: 'are read', correct: false },
          { text: 'is readed', correct: false },
          { text: 'am reading', correct: false }
        ],
        explanation: 'For a singular subject like "She", we pair "is" with the -ing verb "reading".'
      },
      {
        id: 'q3',
        question: 'Which of the following is in the Present Continuous Tense?',
        options: [
          { text: 'They are playing football.', correct: true },
          { text: 'They played football yesterday.', correct: false },
          { text: 'They play football every week.', correct: false },
          { text: 'They will play football soon.', correct: false }
        ],
        explanation: '"are playing" indicates the action is currently underway!'
      },
      {
        id: 'q4',
        question: 'What is the correct grammar formula for Present Continuous?',
        options: [
          { text: 'Subject + am/is/are + Verb-ing', correct: true },
          { text: 'Subject + Verb-ed + Object', correct: false },
          { text: 'Subject + will + Verb', correct: false },
          { text: 'Verb + Subject + ing', correct: false }
        ],
        explanation: 'The present continuous formula always pairs am/is/are with the base verb + ing suffix.'
      }
    ],
    keywords: ['present continuous', 'present continuous tense', 'happening now', 'action happening right now', 'action at this moment', 'is running', 'is reading', 'verb ing', 'continuous tense']
  },

  'verbs': {
    id: 'verbs',
    subjectId: 'english',
    title: 'Verbs (Action Words)',
    subtitle: 'Words that show what someone or something is doing',
    badge: 'Parts of Speech',
    rule: 'Verb = An Action Word (Run, Jump, Eat, Read, Sleep, Dance)',
    explanation: 'A verb is a powerful word that tells us what action is taking place. Without verbs, sentences cannot move or do anything! See each action happening visually below.',
    visualType: 'action-animation',
    visualObjects: [
      { name: 'Run', type: 'action', tag: 'Fast movement on foot' },
      { name: 'Eat', type: 'action', tag: 'Consuming food' },
      { name: 'Read', type: 'action', tag: 'Looking at and comprehending words' },
      { name: 'Write', type: 'action', tag: 'Forming letters on paper' },
      { name: 'Jump', type: 'action', tag: 'Leaping into the air' }
    ],
    examples: [
      {
        id: 'running',
        sentence: 'The cheetah runs swiftly.',
        action: 'running',
        subject: 'Cheetah',
        verb: 'runs',
        object: 'across the savannah',
        character: 'boy',
        bg: 'track',
        visualDescription: 'Action showing running movement.'
      },
      {
        id: 'eating',
        sentence: 'Sam eats fresh fruits.',
        action: 'eating',
        subject: 'Sam',
        verb: 'eats',
        object: 'fresh fruits',
        character: 'boy',
        bg: 'kitchen',
        visualDescription: 'Action showing eating motion.'
      },
      {
        id: 'writing',
        sentence: 'Maya writes a poem.',
        action: 'writing',
        subject: 'Maya',
        verb: 'writes',
        object: 'a poem',
        character: 'girl',
        bg: 'desk',
        visualDescription: 'Action showing writing motion.'
      }
    ],
    quiz: [
      {
        id: 'qv1',
        question: 'Which of the following words is an action verb?',
        options: [
          { text: 'Run', correct: true },
          { text: 'Table', correct: false },
          { text: 'Blue', correct: false },
          { text: 'Quickly', correct: false }
        ],
        explanation: '"Run" is an action that someone performs, so it is a verb!'
      },
      {
        id: 'qv2',
        question: 'Identify the verb in this sentence: "The rabbit hops across the green garden."',
        options: [
          { text: 'hops', correct: true },
          { text: 'rabbit', correct: false },
          { text: 'green', correct: false },
          { text: 'garden', correct: false }
        ],
        explanation: '"hops" is the physical action the rabbit does.'
      },
      {
        id: 'qv3',
        question: 'Which visual action shows a student writing with a pen?',
        options: [
          { text: 'Writing', correct: true },
          { text: 'Sleeping', correct: false },
          { text: 'Eating', correct: false },
          { text: 'Jumping', correct: false }
        ],
        explanation: 'Writing is the verb representing recording words on paper.'
      }
    ],
    keywords: ['verbs', 'verb', 'action words', 'doing words', 'what is a verb', 'action word examples', 'run jump eat read']
  },

  'prepositions': {
    id: 'prepositions',
    subjectId: 'english',
    title: 'Prepositions of Place',
    subtitle: 'Words that show where an object is located',
    badge: 'Grammar & Spatial',
    rule: 'Preposition + Noun (On, Under, Above, In, Beside, Behind)',
    explanation: 'Prepositions are position words. They tell you the relationship between a noun and another object in space. Watch the ball move to each position around the table!',
    visualType: 'preposition-interactive',
    visualObjects: [
      { name: 'Red Ball', type: 'object', tag: 'Moving Target' },
      { name: 'Wooden Table', type: 'object', tag: 'Reference Surface' },
      { name: 'Positions', type: 'spatial', tag: 'On, Under, Above, In, Beside, Behind' }
    ],
    examples: [
      {
        id: 'under',
        sentence: 'The ball is under the table.',
        action: 'under',
        subject: 'Ball',
        verb: 'is',
        object: 'under the table',
        visualDescription: 'The ball rolls directly beneath the table top.'
      },
      {
        id: 'on',
        sentence: 'The ball is on the table.',
        action: 'on',
        subject: 'Ball',
        verb: 'is',
        object: 'on the table',
        visualDescription: 'The ball rests directly on top of the wooden table surface.'
      },
      {
        id: 'above',
        sentence: 'The ball is hovering above the table.',
        action: 'above',
        subject: 'Ball',
        verb: 'is',
        object: 'above the table',
        visualDescription: 'The ball floats freely in the air over the table.'
      },
      {
        id: 'in',
        sentence: 'The ball is inside the box on the table.',
        action: 'in',
        subject: 'Ball',
        verb: 'is',
        object: 'in the box',
        visualDescription: 'The ball is tucked securely inside a open box.'
      },
      {
        id: 'beside',
        sentence: 'The ball is beside the table.',
        action: 'beside',
        subject: 'Ball',
        verb: 'is',
        object: 'beside the table',
        visualDescription: 'The ball sits on the floor right next to the table leg.'
      },
      {
        id: 'behind',
        sentence: 'The ball is behind the table.',
        action: 'behind',
        subject: 'Ball',
        verb: 'is',
        object: 'behind the table',
        visualDescription: 'The ball peeks out from behind the wooden table.'
      }
    ],
    quiz: [
      {
        id: 'qp1',
        question: 'If the ball is directly beneath the table surface, which preposition is correct?',
        options: [
          { text: 'Under', correct: true },
          { text: 'Above', correct: false },
          { text: 'Between', correct: false },
          { text: 'On', correct: false }
        ],
        explanation: '"Under" means below or beneath another object.'
      },
      {
        id: 'qp2',
        question: 'Choose the correct preposition: "The lamp rests _____ the table top."',
        options: [
          { text: 'on', correct: true },
          { text: 'under', correct: false },
          { text: 'through', correct: false },
          { text: 'inside', correct: false }
        ],
        explanation: 'When an object is touching and supported by a surface, we use "on".'
      },
      {
        id: 'qp3',
        question: 'Which word in "The bird flies above the tall trees" is a preposition?',
        options: [
          { text: 'above', correct: true },
          { text: 'flies', correct: false },
          { text: 'tall', correct: false },
          { text: 'bird', correct: false }
        ],
        explanation: '"above" specifies the spatial location of the flying bird.'
      }
    ],
    keywords: ['prepositions', 'preposition', 'under', 'above', 'on', 'in', 'beside', 'behind', 'spatial words', 'position of ball', 'where is the ball']
  },

  'nouns': {
    id: 'nouns',
    subjectId: 'english',
    title: 'Nouns (Naming Words)',
    subtitle: 'Names of people, places, animals, and things',
    badge: 'Parts of Speech',
    rule: 'Noun = Person, Place, Animal, or Thing',
    explanation: 'A noun is the name of anything you can see, touch, or think about! It can be a person (Teacher, Doctor), a place (School, Park), an animal (Lion, Elephant), or a thing (Book, Pencil).',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Person', type: 'category', tag: 'Teacher, Doctor, Student' },
      { name: 'Place', type: 'category', tag: 'School, Hospital, Park' },
      { name: 'Animal', type: 'category', tag: 'Lion, Puppy, Eagle' },
      { name: 'Thing', type: 'category', tag: 'Book, Computer, Ball' }
    ],
    examples: [
      {
        id: 'person',
        sentence: 'The teacher teaches the class.',
        subject: 'Teacher (Person)',
        verb: 'teaches',
        object: 'class',
        visualDescription: 'Visual chart showing person, place, animal, and thing classification.'
      },
      {
        id: 'place',
        sentence: 'We visit the sunny park.',
        subject: 'We',
        verb: 'visit',
        object: 'Park (Place)',
        visualDescription: 'A lively park with green trees and a playground.'
      },
      {
        id: 'thing',
        sentence: 'The red ball bounces high.',
        subject: 'Ball (Thing)',
        verb: 'bounces',
        object: 'high',
        visualDescription: 'A shiny red bouncy ball.'
      }
    ],
    quiz: [
      {
        id: 'qn1',
        question: 'Which of the following is a noun representing a PLACE?',
        options: [
          { text: 'School', correct: true },
          { text: 'Sing', correct: false },
          { text: 'Happy', correct: false },
          { text: 'Quickly', correct: false }
        ],
        explanation: '"School" is a physical location/place, so it is a noun!'
      },
      {
        id: 'qn2',
        question: 'Identify the noun in the sentence: "The elephant drinks fresh water."',
        options: [
          { text: 'elephant', correct: true },
          { text: 'drinks', correct: false },
          { text: 'fresh', correct: false },
          { text: 'loudly', correct: false }
        ],
        explanation: '"elephant" is an animal name (noun).'
      }
    ],
    keywords: ['nouns', 'noun', 'naming words', 'person place animal thing', 'what is a noun', 'noun examples']
  },

  'adjectives': {
    id: 'adjectives',
    subjectId: 'english',
    title: 'Adjectives (Describing Words)',
    subtitle: 'Words that describe color, size, shape, and feelings',
    badge: 'Parts of Speech',
    rule: 'Adjective + Noun (Big elephant, Sweet mango, Fast car)',
    explanation: 'Adjectives give more details about nouns! They tell us how big, what color, how many, or what kind something is.',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Size', type: 'attribute', tag: 'Gigantic vs Tiny' },
      { name: 'Color', type: 'attribute', tag: 'Vibrant Red, Blue, Golden' },
      { name: 'Speed', type: 'attribute', tag: 'Lightning Fast vs Slow' }
    ],
    examples: [
      {
        id: 'size',
        sentence: 'A huge elephant stands next to a tiny mouse.',
        visualDescription: 'Visual comparison of sizes: Huge vs Tiny.'
      },
      {
        id: 'speed',
        sentence: 'The fast cheetah outruns the slow turtle.',
        visualDescription: 'Speed comparison showing blazing speed vs steady pacing.'
      }
    ],
    quiz: [
      {
        id: 'qa1',
        question: 'Which word is the adjective in: "The shiny yellow sun warms the earth"?',
        options: [
          { text: 'shiny', correct: true },
          { text: 'sun', correct: false },
          { text: 'warms', correct: false },
          { text: 'earth', correct: false }
        ],
        explanation: '"shiny" describes the appearance of the sun.'
      }
    ],
    keywords: ['adjectives', 'adjective', 'describing words', 'big small tall short', 'what is an adjective']
  },

  'past-tense': {
    id: 'past-tense',
    subjectId: 'english',
    title: 'Past Tense (Simple Past)',
    subtitle: 'Actions that already happened and are completed',
    badge: 'Grammar & Tenses',
    rule: 'Subject + Verb-ed / Irregular Past (played, walked, ate, wrote, danced)',
    explanation: 'We use the Simple Past Tense for actions that started and finished in the past (yesterday, earlier this morning, or last year). Notice how the action is completely done and finished!',
    visualType: 'past-tense-animated',
    visualObjects: [
      { name: 'Completed Football Match', type: 'scene', tag: 'Goal scored + trophy won yesterday' },
      { name: 'Walk to School', type: 'scene', tag: 'Footprint trail + arrived at school' },
      { name: 'Eaten Pizza', type: 'scene', tag: 'Clean empty plate + crumbs + full tummy' },
      { name: 'Sealed Letter', type: 'scene', tag: 'Stamped envelope dropped in mailbox' },
      { name: 'Party Dance', type: 'scene', tag: 'Confetti + completed dance performance' }
    ],
    examples: [
      {
        id: 'played',
        sentence: 'He played football yesterday.',
        action: 'played',
        baseVerb: 'play',
        pastVerb: 'played',
        subject: 'He',
        verb: 'played',
        object: 'football yesterday',
        character: 'boy',
        bg: 'field',
        visualDescription: 'Animated scene showing the soccer match is over, ball is inside the goal net, and he is holding a champion trophy!'
      },
      {
        id: 'walked',
        sentence: 'She walked to school this morning.',
        action: 'walked',
        baseVerb: 'walk',
        pastVerb: 'walked',
        subject: 'She',
        verb: 'walked',
        object: 'to school this morning',
        character: 'girl',
        bg: 'school',
        visualDescription: 'Animated scene showing her finished walk along the footprint trail arriving safely at school.'
      },
      {
        id: 'ate',
        sentence: 'The boy ate a delicious pizza.',
        action: 'ate',
        baseVerb: 'eat',
        pastVerb: 'ate',
        subject: 'The boy',
        verb: 'ate',
        object: 'a delicious pizza',
        character: 'boy',
        bg: 'kitchen',
        visualDescription: 'Animated scene showing the pizza is all finished with only crumbs left on the clean plate!'
      },
      {
        id: 'wrote',
        sentence: 'She wrote a letter last night.',
        action: 'wrote',
        baseVerb: 'write',
        pastVerb: 'wrote',
        subject: 'She',
        verb: 'wrote',
        object: 'a letter last night',
        character: 'girl',
        bg: 'desk',
        visualDescription: 'Animated scene showing the letter sealed, stamped, and dropped inside the red mailbox.'
      },
      {
        id: 'danced',
        sentence: 'They danced at the party.',
        action: 'danced',
        baseVerb: 'dance',
        pastVerb: 'danced',
        subject: 'They',
        verb: 'danced',
        object: 'at the party',
        character: 'kids',
        bg: 'party',
        visualDescription: 'Animated party celebration with confetti celebrating a finished dance routine.'
      }
    ],
    quiz: [
      {
        id: 'qpt1',
        question: 'Look at the visual animation. Why is "He played football yesterday" in the Past Tense?',
        options: [
          { text: 'Because the match is already finished in the past (yesterday)', correct: true },
          { text: 'Because he is kicking the ball right now', correct: false },
          { text: 'Because he will play tomorrow', correct: false }
        ],
        explanation: 'Past tense tells us that the event has already concluded!'
      },
      {
        id: 'qpt2',
        question: 'What is the past tense form of the verb "walk"?',
        options: [
          { text: 'walked', correct: true },
          { text: 'walking', correct: false },
          { text: 'walks', correct: false }
        ],
        explanation: 'For regular verbs like "walk", we add the "-ed" suffix to make "walked".'
      },
      {
        id: 'qpt3',
        question: 'What is the irregular past tense form of "eat"?',
        options: [
          { text: 'ate', correct: true },
          { text: 'eated', correct: false },
          { text: 'eating', correct: false }
        ],
        explanation: '"eat" is an irregular verb that morphs into "ate".'
      }
    ],
    keywords: ['past tense', 'simple past', 'happened yesterday', 'verb ed', 'completed actions', 'past tense vs present', 'played walked ate wrote']
  },

  'sentence-formation': {
    id: 'sentence-formation',
    subjectId: 'english',
    title: 'Sentence Formation',
    subtitle: 'Building complete sentences with Subject, Verb, and Object',
    badge: 'Sentence Structure',
    rule: 'Subject (Who) + Verb (Action) + Object (What)',
    explanation: 'Every complete thought in English has three basic building blocks: Who is doing it (Subject), What action are they doing (Verb), and What receives the action (Object).',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Subject Block', type: 'block', tag: 'Who / What performs action' },
      { name: 'Verb Block', type: 'block', tag: 'Action happening' },
      { name: 'Object Block', type: 'block', tag: 'Receiver of the action' }
    ],
    examples: [
      {
        id: 's1',
        sentence: 'The cat (Subject) + caught (Verb) + the mouse (Object).',
        visualDescription: 'Color-coded interlocking jigsaw blocks connecting Subject, Verb, and Object.'
      }
    ],
    quiz: [
      {
        id: 'qsf1',
        question: 'In the sentence "Emma baked a delicious cake", what is the OBJECT?',
        options: [
          { text: 'a delicious cake', correct: true },
          { text: 'Emma', correct: false },
          { text: 'baked', correct: false }
        ],
        explanation: '"a delicious cake" is the object that was baked by Emma.'
      }
    ],
    keywords: ['sentence formation', 'sentence structure', 'subject verb object', 'how to make a sentence', 'svo pattern']
  },

  'active-passive': {
    id: 'active-passive',
    subjectId: 'english',
    title: 'Active & Passive Voice',
    subtitle: 'Shifting the focus from who does the action to what receives the action',
    badge: 'Voice Transformation',
    rule: 'Active: Subject + Verb + Object | Passive: Object + be + V3 + by Subject',
    explanation: 'Step 1 (Concept): In ACTIVE voice, the subject performs the action ("The chef bakes a cake"). In PASSIVE voice, the focus shifts to the object receiving the action ("The cake is baked by the chef").',
    visualType: 'active-passive-interactive',
    visualObjects: [
      { name: 'Subject (Doer)', type: 'actor', tag: 'The Chef, The Boy' },
      { name: 'Action Verb', type: 'verb', tag: 'bakes, kicked, wrote' },
      { name: 'Object (Receiver)', type: 'receiver', tag: 'Cake, Football, Letter' }
    ],
    examples: [
      {
        id: 'chef-cake',
        sentence: 'The chef bakes a delicious cake (Active) ➔ A delicious cake is baked by the chef (Passive).',
        visualDescription: 'Step 2 (Example Animation): Live 2-way visual token shift swapping the doer and receiver with verb transformation.'
      },
      {
        id: 'boy-ball',
        sentence: 'The boy kicked the football (Active) ➔ The football was kicked by the boy (Passive).',
        visualDescription: 'Step 2 (Example Animation): The football moves to front focus and gets kicked.'
      }
    ],
    quiz: [
      {
        id: 'qap1',
        question: 'Which of the following is in the PASSIVE voice?',
        options: [
          { text: 'A delicious cake is baked by the chef.', correct: true },
          { text: 'The chef bakes a delicious cake.', correct: false },
          { text: 'The chef is eating the cake.', correct: false }
        ],
        explanation: 'In passive voice, the object (cake) comes first, followed by "is baked by".'
      },
      {
        id: 'qap2',
        question: 'Transform to passive: "The boy kicked the ball."',
        options: [
          { text: 'The ball was kicked by the boy.', correct: true },
          { text: 'The boy was kicking the ball.', correct: false },
          { text: 'The ball kicks the boy.', correct: false }
        ],
        explanation: 'The past verb "kicked" transforms to "was kicked by".'
      }
    ],
    keywords: ['active passive', 'active voice', 'passive voice', 'voice transformation', 'by agent', 'object verb subject']
  },

  'parajumbles': {
    id: 'parajumbles',
    subjectId: 'english',
    title: 'Parajumbles (Sentence Ordering)',
    subtitle: 'Reordering scrambled words and sentences into meaningful grammar structure',
    badge: 'Sentence Logic',
    rule: 'Subject + Main Verb / Auxiliary + Object / Prepositional Context',
    explanation: 'Step 1 (Concept): Parajumbles are scrambled puzzle pieces of a sentence. To solve them, first find the WHO (Subject), then find the ACTION (Verb), and finally connect WHERE/WHAT (Object/Preposition).',
    visualType: 'parajumble-interactive',
    visualObjects: [
      { name: 'Subject Token', type: 'puzzle', tag: 'Birds, The golden sun' },
      { name: 'Verb Phrase', type: 'puzzle', tag: 'fly gracefully, rises early' },
      { name: 'Context Ending', type: 'puzzle', tag: 'in the blue sky, in the east' }
    ],
    examples: [
      {
        id: 'jumble-birds',
        sentence: 'Birds + fly gracefully + in the blue sky.',
        visualDescription: 'Step 2 (Example Animation): Magnetic puzzle pieces snap into correct order with celebratory confetti.'
      }
    ],
    quiz: [
      {
        id: 'qpj1',
        question: 'Arrange in correct order: [in the east] [rises early] [The golden sun]',
        options: [
          { text: 'The golden sun rises early in the east.', correct: true },
          { text: 'In the east rises early the golden sun.', correct: false },
          { text: 'Rises early in the east the golden sun.', correct: false }
        ],
        explanation: 'Standard English sequence: Subject ("The golden sun") + Verb ("rises early") + Location ("in the east").'
      }
    ],
    keywords: ['parajumbles', 'sentence ordering', 'scrambled words', 'jumbled sentences', 'reorder sentence']
  },

  'direct-indirect': {
    id: 'direct-indirect',
    subjectId: 'english',
    title: 'Direct & Indirect Speech',
    subtitle: 'Quoting exact spoken words vs reporting conversations indirectly',
    badge: 'Reported Speech',
    rule: 'Direct: Speaker said, "Quote" | Indirect: Speaker said that (tense shifted)',
    explanation: 'Step 1 (Concept): Direct speech quotes the exact words inside quotation marks ("I am happy"). Indirect reported speech removes the quotes, adds "that", and shifts the tense into the past ("He said that he was happy").',
    visualType: 'direct-indirect-interactive',
    visualObjects: [
      { name: 'Speech Bubble Quotes', type: 'dialogue', tag: 'Exact spoken quotes' },
      { name: 'Reported Scroll', type: 'scroll', tag: 'Tense-shifted indirect reporting' }
    ],
    examples: [
      {
        id: 'direct1',
        sentence: 'Rahul said, "I am very hungry." ➔ Rahul said that he was very hungry.',
        visualDescription: 'Step 2 (Example Animation): Speech bubble transforms into reported scroll highlighting the pronoun and tense shift.'
      }
    ],
    quiz: [
      {
        id: 'qdi1',
        question: 'Change into Indirect Speech: She said, "I like ice cream."',
        options: [
          { text: 'She said that she liked ice cream.', correct: true },
          { text: 'She said that I like ice cream.', correct: false },
          { text: 'She said "she likes ice cream."', correct: false }
        ],
        explanation: 'Pronoun "I" changes to "she", and present "like" shifts to past "liked".'
      }
    ],
    keywords: ['direct indirect speech', 'reported speech', 'quoted speech', 'said that', 'speech conversion']
  },

  'articles': {
    id: 'articles',
    subjectId: 'english',
    title: 'Articles (A, An, The)',
    subtitle: 'Using indefinite and definite determiners with nouns',
    badge: 'Determiners',
    rule: 'A + Consonant Sound | AN + Vowel Sound | THE + Specific/Unique Noun',
    explanation: 'Step 1 (Concept): Articles are determiners placed before nouns. Use "A" for consonant sounds ("a book"), "AN" for vowel sounds ("an apple"), and "THE" for specific unique things ("the sun", "the moon").',
    visualType: 'articles-interactive',
    visualObjects: [
      { name: 'A Magnet', type: 'magnet', tag: 'Consonant sound items' },
      { name: 'AN Magnet', type: 'magnet', tag: 'Vowel sound items' },
      { name: 'THE Magnet', type: 'magnet', tag: 'Specific & unique items' }
    ],
    examples: [
      {
        id: 'art-apple',
        sentence: 'An apple 🍎, A book 📚, The sun ☀️',
        visualDescription: 'Step 2 (Example Animation): Magnetic sound sorting attracting nouns to matching article badges.'
      }
    ],
    quiz: [
      {
        id: 'qar1',
        question: 'Which article should be placed before "elephant"?',
        options: [
          { text: 'an', correct: true },
          { text: 'a', correct: false },
          { text: 'the', correct: false }
        ],
        explanation: '"elephant" starts with a vowel sound (/e/), so we use "an".'
      },
      {
        id: 'qar2',
        question: 'Fill in the blank: "Look at _____ full moon in the night sky."',
        options: [
          { text: 'the', correct: true },
          { text: 'a', correct: false },
          { text: 'an', correct: false }
        ],
        explanation: '"The moon" is a unique celestial body, so the definite article "the" is used.'
      }
    ],
    keywords: ['articles', 'a an the', 'indefinite article', 'definite article', 'vowel consonant articles']
  },

  // ===================== MATHEMATICS =====================
  'fractions': {
    id: 'fractions',
    subjectId: 'mathematics',
    title: 'Fractions (Parts of a Whole)',
    subtitle: 'Understanding Numerator and Denominator through Pizza Slicing',
    badge: 'Numbers & Fractions',
    rule: 'Fraction = Numerator (Parts Taken) / Denominator (Total Equal Parts)',
    explanation: 'A fraction represents equal parts of a whole object. When you cut a delicious round pizza into 4 equal slices and eat 1 slice, you have eaten 1/4 (one quarter) of the whole pizza!',
    visualType: 'fraction-pizza',
    visualObjects: [
      { name: 'Pizza Cutter', type: 'tool', tag: 'Divides whole into equal slices' },
      { name: 'Numerator (Top Number)', type: 'math', tag: 'How many slices are selected' },
      { name: 'Denominator (Bottom Number)', type: 'math', tag: 'Total number of equal slices' }
    ],
    examples: [
      {
        id: 'half',
        sentence: '1/2 (One Half): Pizza divided into 2 equal parts, 1 part selected.',
        numerator: 1,
        denominator: 2,
        visualDescription: 'Round cheese pizza sliced straight down the middle into 2 halves.'
      },
      {
        id: 'quarter',
        sentence: '1/4 (One Quarter): Pizza divided into 4 equal parts, 1 part selected.',
        numerator: 1,
        denominator: 4,
        visualDescription: 'Pizza cut in a cross into 4 equal quarters.'
      },
      {
        id: 'three-quarters',
        sentence: '3/4 (Three Quarters): 3 slices highlighted out of 4 total slices.',
        numerator: 3,
        denominator: 4,
        visualDescription: '3 warm slices highlighted with toppings, 1 slice remaining.'
      },
      {
        id: 'three-eighths',
        sentence: '3/8 (Three Eighths): Sliced into 8 party pieces, 3 selected.',
        numerator: 3,
        denominator: 8,
        visualDescription: '8 party slices with 3 pieces selected.'
      }
    ],
    quiz: [
      {
        id: 'qf1',
        question: 'If you divide a whole pizza into 4 equal slices and take 1 slice, what fraction do you have?',
        options: [
          { text: '1/4', correct: true },
          { text: '4/1', correct: false },
          { text: '1/2', correct: false },
          { text: '3/4', correct: false }
        ],
        explanation: '1 slice taken (numerator) over 4 total equal slices (denominator) is 1/4.'
      },
      {
        id: 'qf2',
        question: 'In the fraction 3/8, what does the number 8 represent?',
        options: [
          { text: 'The total number of equal slices in the whole', correct: true },
          { text: 'The slices that were eaten', correct: false },
          { text: 'The price of the pizza', correct: false }
        ],
        explanation: 'The bottom number (denominator) always tells the total number of equal parts.'
      },
      {
        id: 'qf3',
        question: 'Which of the following is equivalent to 1/2?',
        options: [
          { text: '2/4', correct: true },
          { text: '1/3', correct: false },
          { text: '3/5', correct: false },
          { text: '4/6', correct: false }
        ],
        explanation: '2 out of 4 slices (2/4) covers exactly half the pizza (1/2)!'
      }
    ],
    keywords: ['fractions', 'fraction', 'numerator', 'denominator', 'pizza fraction', 'parts of a whole', 'half quarter', 'divide pizza', 'equal parts']
  },

  'geometry-shapes': {
    id: 'geometry-shapes',
    subjectId: 'mathematics',
    title: '2D & 3D Geometric Shapes',
    subtitle: 'Exploring sides, corners, faces, and dimensions',
    badge: 'Geometry',
    rule: '2D Shapes have Length & Width; 3D Shapes have Depth!',
    explanation: 'Geometric shapes are everywhere around us! Flat shapes like circles, squares, and triangles have sides and corners. Solid 3D shapes like cubes, spheres, and cylinders have faces, edges, and vertices.',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Circle', type: '2D Shape', tag: '0 Straight Sides, 0 Corners' },
      { name: 'Square', type: '2D Shape', tag: '4 Equal Sides, 4 Right Angles' },
      { name: 'Triangle', type: '2D Shape', tag: '3 Sides, 3 Angles' },
      { name: 'Cube', type: '3D Solid', tag: '6 Square Faces, 12 Edges, 8 Vertices' }
    ],
    examples: [
      {
        id: 'cube',
        sentence: 'A cube has 6 identical square faces and 8 corners.',
        visualDescription: 'Interactive 3D wireframe rotating cube highlighting faces and vertices.'
      }
    ],
    quiz: [
      {
        id: 'qg1',
        question: 'How many straight sides does a triangle have?',
        options: [
          { text: '3 sides', correct: true },
          { text: '4 sides', correct: false },
          { text: '5 sides', correct: false }
        ],
        explanation: 'Tri means three! A triangle always has exactly 3 sides and 3 angles.'
      }
    ],
    keywords: ['geometry', 'shapes', '2d shapes', '3d shapes', 'triangle square circle cube', 'sides and corners']
  },

  'angles': {
    id: 'angles',
    subjectId: 'mathematics',
    title: 'Angles & Protractor',
    subtitle: 'Acute, Right, Obtuse, and Straight Angles',
    badge: 'Geometry & Angles',
    rule: 'Right = 90°, Acute < 90°, Obtuse > 90°, Straight = 180°',
    explanation: 'An angle is formed when two rays meet at a common point called the vertex. We measure angles in degrees (°) using a protractor!',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Acute Angle', type: 'angle', tag: 'Sharp & small (< 90°)' },
      { name: 'Right Angle', type: 'angle', tag: 'Perfect corner (90°)' },
      { name: 'Obtuse Angle', type: 'angle', tag: 'Wide open (> 90° and < 180°)' }
    ],
    examples: [
      {
        id: 'right-angle',
        sentence: 'A 90° Right Angle forms a crisp square corner like an open book.',
        visualDescription: 'Two perpendicular rays meeting at 90° with a square marker.'
      }
    ],
    quiz: [
      {
        id: 'qa1',
        question: 'What is an angle smaller than 90° called?',
        options: [
          { text: 'Acute angle', correct: true },
          { text: 'Obtuse angle', correct: false },
          { text: 'Right angle', correct: false }
        ],
        explanation: 'An angle less than 90 degrees is acute (think "a cute little angle")!'
      }
    ],
    keywords: ['angles', 'acute angle', 'right angle', 'obtuse angle', 'protractor', '90 degrees', 'measuring angles']
  },

  'multiplication': {
    id: 'multiplication',
    subjectId: 'mathematics',
    title: 'Multiplication (Repeated Addition)',
    subtitle: 'Organizing objects into equal rows and groups',
    badge: 'Arithmetic',
    rule: 'Rows × Columns = Total (e.g., 3 rows of 4 = 12)',
    explanation: 'Multiplication is a super-fast way to add equal groups together. If you have 3 baskets with 4 apples in each basket, you do 3 × 4 = 12 apples!',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Array Grid', type: 'math-grid', tag: 'Rows & Columns Visualizer' }
    ],
    examples: [
      {
        id: 'm1',
        sentence: '3 groups of 4 shiny apples equals 12 apples in total (3 × 4 = 12).',
        visualDescription: 'Visual grid array with 3 rows and 4 columns of apples.'
      }
    ],
    quiz: [
      {
        id: 'qm1',
        question: 'What is 4 groups of 5 stars equal to (4 × 5)?',
        options: [
          { text: '20', correct: true },
          { text: '15', correct: false },
          { text: '25', correct: false }
        ],
        explanation: '5 + 5 + 5 + 5 = 20 stars!'
      }
    ],
    keywords: ['multiplication', 'multiply', 'repeated addition', 'times tables', 'groups of', 'arrays grid']
  },

  // ===================== SCIENCE =====================
  'photosynthesis': {
    id: 'photosynthesis',
    subjectId: 'science',
    title: 'Photosynthesis (How Plants Make Food)',
    subtitle: 'Sunlight + Carbon Dioxide + Water ➔ Glucose + Oxygen',
    badge: 'Plant Biology',
    rule: '6CO₂ + 6H₂O + Sunlight (Chlorophyll) ➔ C₆H₁₂O₆ (Glucose) + 6O₂',
    explanation: 'Photosynthesis is the magical biological process where green leaves capture glowing sunlight, absorb water from their roots, and take in carbon dioxide from the air to make delicious sugar food (glucose) while releasing fresh oxygen for us to breathe!',
    visualType: 'photosynthesis-lab',
    visualObjects: [
      { name: 'Glowing Sun', type: 'energy-source', tag: 'Solar Energy Photons' },
      { name: 'Green Plant Leaf', type: 'chloroplast', tag: 'Chlorophyll Kitchen' },
      { name: 'Root System', type: 'absorption', tag: 'Water (H₂O) & Minerals' },
      { name: 'Atmosphere (CO₂)', type: 'gas-input', tag: 'Carbon Dioxide through Stomata' },
      { name: 'Fresh Oxygen (O₂)', type: 'gas-output', tag: 'Clean air emitted for humans' },
      { name: 'Sweet Glucose', type: 'sugar-food', tag: 'Plant energy storage' }
    ],
    examples: [
      {
        id: 'sunlight-stage',
        sentence: 'Step 1: The green chlorophyll inside the leaf captures glowing sunlight energy.',
        visualDescription: 'Golden sun rays streaming down onto the vibrant green leaf surface.'
      },
      {
        id: 'water-roots',
        sentence: 'Step 2: Roots draw water (H₂O) from deep in the soil and pump it upward.',
        visualDescription: 'Blue water droplets flowing up through root xylem tubes into leaves.'
      },
      {
        id: 'gas-exchange',
        sentence: 'Step 3: Leaf stomata absorb CO₂ and release fresh life-giving Oxygen (O₂).',
        visualDescription: 'Microscopic stomata pores opening to exchange CO₂ particles for O₂.'
      }
    ],
    quiz: [
      {
        id: 'qp1',
        question: 'What green pigment inside plant leaves absorbs energy from sunlight?',
        options: [
          { text: 'Chlorophyll', correct: true },
          { text: 'Hemoglobin', correct: false },
          { text: 'Melanin', correct: false },
          { text: 'Glucose', correct: false }
        ],
        explanation: 'Chlorophyll gives plants their bright green color and absorbs solar energy.'
      },
      {
        id: 'qp2',
        question: 'What vital gas do plants release into the air during photosynthesis for us to breathe?',
        options: [
          { text: 'Oxygen (O₂)', correct: true },
          { text: 'Carbon Dioxide (CO₂)', correct: false },
          { text: 'Nitrogen', correct: false },
          { text: 'Helium', correct: false }
        ],
        explanation: 'Plants convert CO₂ and water into glucose and release fresh Oxygen (O₂).'
      },
      {
        id: 'qp3',
        question: 'Where do plants primarily absorb water from for photosynthesis?',
        options: [
          { text: 'Roots from the soil', correct: true },
          { text: 'Flowers from the air', correct: false },
          { text: 'Stem from sunlight', correct: false }
        ],
        explanation: 'Plant roots spread throughout the soil to absorb moisture and minerals.'
      }
    ],
    keywords: ['photosynthesis', 'how plants make food', 'sunlight water co2', 'chlorophyll', 'plant food', 'glucose oxygen', 'leaf process', 'stomata']
  },

  'water-cycle': {
    id: 'water-cycle',
    subjectId: 'science',
    title: 'The Water Cycle (Hydrologic Cycle)',
    subtitle: 'Evaporation ➔ Condensation ➔ Precipitation ➔ Collection',
    badge: 'Earth Science',
    rule: 'Continuous circulation of Earth’s water across air, land, and oceans',
    explanation: 'The Water Cycle is Earth’s endless recycling system! The warm sun heats ocean water causing Evaporation. Rising vapor cools into clouds during Condensation, falls back to earth as Rain (Precipitation), and flows into rivers (Collection).',
    visualType: 'water-cycle-lab',
    visualObjects: [
      { name: 'Warm Sun', type: 'thermal', tag: 'Heats ocean water' },
      { name: 'Evaporation', type: 'phase-change', tag: 'Liquid water turns to rising vapor' },
      { name: 'Condensation', type: 'cloud-formation', tag: 'Cool vapor forms fluffy clouds' },
      { name: 'Precipitation', type: 'rain-snow', tag: 'Heavy rain droplets fall down' },
      { name: 'Collection', type: 'rivers-lakes', tag: 'Water returns to oceans & reservoirs' }
    ],
    examples: [
      {
        id: 'evap',
        sentence: 'Phase 1: Solar heat transforms lake water into invisible rising steam vapor (Evaporation).',
        visualDescription: 'Rising shimmering vapor particles floating up from the water surface.'
      },
      {
        id: 'cond',
        sentence: 'Phase 2: High in the cool sky, vapor condenses into puffy white rain clouds (Condensation).',
        visualDescription: 'Cloud density increasing with swirling water droplets.'
      },
      {
        id: 'precip',
        sentence: 'Phase 3: When clouds get heavy, water falls as rain, snow, or hail (Precipitation).',
        visualDescription: 'Animated raindrops cascading down to mountains and soil.'
      }
    ],
    quiz: [
      {
        id: 'qwc1',
        question: 'What is the process where liquid water heats up and turns into rising water vapor?',
        options: [
          { text: 'Evaporation', correct: true },
          { text: 'Precipitation', correct: false },
          { text: 'Freezing', correct: false },
          { text: 'Collection', correct: false }
        ],
        explanation: 'Heat from the sun causes liquid water to evaporate into water vapor gas.'
      },
      {
        id: 'qwc2',
        question: 'What stage of the water cycle brings water back to Earth as rain or snow?',
        options: [
          { text: 'Precipitation', correct: true },
          { text: 'Condensation', correct: false },
          { text: 'Transpiration', correct: false }
        ],
        explanation: 'Precipitation is when heavy clouds release moisture as rain, snow, or hail.'
      }
    ],
    keywords: ['water cycle', 'hydrologic cycle', 'evaporation', 'condensation', 'precipitation', 'rain cycle', 'how rain is formed', 'clouds and rain']
  },

  'solar-system': {
    id: 'solar-system',
    subjectId: 'science',
    title: 'The Solar System & Planetary Orbits',
    subtitle: '8 Planets orbiting our luminous Sun in celestial harmony',
    badge: 'Astronomy',
    rule: 'Sun + 8 Planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)',
    explanation: 'Our solar system consists of our central star, the Sun, and eight planets trapped in its gravitational pull, revolving in elliptical orbits from speedy Mercury to icy Neptune.',
    visualType: 'solar-system-lab',
    visualObjects: [
      { name: 'Sun', type: 'star', tag: 'Massive central gravitational star' },
      { name: 'Rocky Planets', type: 'planets', tag: 'Mercury, Venus, Earth, Mars' },
      { name: 'Gas Giants', type: 'planets', tag: 'Jupiter & Saturn' },
      { name: 'Ice Giants', type: 'planets', tag: 'Uranus & Neptune' }
    ],
    examples: [
      {
        id: 'earth-orbit',
        sentence: 'Earth is the 3rd planet from the Sun, orbiting inside the Goldilocks habitable zone.',
        visualDescription: 'Blue and green planet Earth revolving around the blazing sun.'
      },
      {
        id: 'jupiter-giant',
        sentence: 'Jupiter is the largest planet in our solar system, with its famous Great Red Spot.',
        visualDescription: 'Massive striped gas giant Jupiter with swirling storm bands.'
      }
    ],
    quiz: [
      {
        id: 'qss1',
        question: 'Which is the largest planet in our Solar System?',
        options: [
          { text: 'Jupiter', correct: true },
          { text: 'Earth', correct: false },
          { text: 'Saturn', correct: false },
          { text: 'Mars', correct: false }
        ],
        explanation: 'Jupiter is more than 11 times wider than Earth and is the king of planets!'
      },
      {
        id: 'qss2',
        question: 'Which planet is closest to the Sun?',
        options: [
          { text: 'Mercury', correct: true },
          { text: 'Venus', correct: false },
          { text: 'Mars', correct: false }
        ],
        explanation: 'Mercury is the innermost and fastest revolving planet.'
      }
    ],
    keywords: ['solar system', 'planets', 'sun orbit', 'earth mars jupiter saturn', 'astronomy', 'space planets', 'how planets orbit']
  },

  'states-of-matter': {
    id: 'states-of-matter',
    subjectId: 'science',
    title: 'States of Matter (Solid, Liquid, Gas)',
    subtitle: 'Molecular movement and temperature phase transitions',
    badge: 'Chemistry & Physics',
    rule: 'Solid (tightly packed) ➔ Liquid (flowing) ➔ Gas (flying free)',
    explanation: 'Everything around us is made of tiny particles called molecules. In solids (ice), particles are packed tightly. In liquids (water), they slide around. In gases (steam), they zoom around freely!',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Solid (Ice)', type: 'phase', tag: 'Fixed shape & fixed volume' },
      { name: 'Liquid (Water)', type: 'phase', tag: 'Takes shape of container' },
      { name: 'Gas (Steam)', type: 'phase', tag: 'Fills entire available space' }
    ],
    examples: [
      {
        id: 'matter1',
        sentence: 'Heating ice transforms it from solid ➔ liquid water ➔ water vapor gas.',
        visualDescription: 'Phase transition diagram with vibrating kinetic molecules.'
      }
    ],
    quiz: [
      {
        id: 'qsm1',
        question: 'In which state of matter do molecules move most rapidly and spread far apart?',
        options: [
          { text: 'Gas', correct: true },
          { text: 'Solid', correct: false },
          { text: 'Liquid', correct: false }
        ],
        explanation: 'Gas molecules have high thermal energy and fly around in all directions!'
      }
    ],
    keywords: ['states of matter', 'solid liquid gas', 'molecules', 'ice water steam', 'phase changes', 'matter']
  },

  // ===================== SOCIAL SCIENCE =====================
  'earth-rotation': {
    id: 'earth-rotation',
    subjectId: 'social-science',
    title: 'Earth’s Rotation & Day-Night Cycle',
    subtitle: 'Spinning on its axis causes Day and Night every 24 Hours',
    badge: 'Earth Geography',
    rule: 'Rotation (24h) = Day & Night; Revolution (365 days) = 4 Seasons',
    explanation: 'Earth is constantly spinning on its tilted axis like a giant cosmic top! The side facing the Sun experiences bright warm Day, while the side facing away is in peaceful dark Night.',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Tilted Earth Axis', type: 'geography', tag: '23.5 Degree Tilt' },
      { name: 'Daylight Hemisphere', type: 'lighting', tag: 'Sunlight illuminated side' },
      { name: 'Night Hemisphere', type: 'lighting', tag: 'Shadow side with stars' }
    ],
    examples: [
      {
        id: 'day-night',
        sentence: 'As Earth rotates eastward, cities smoothly transition from sunrise to sunset.',
        visualDescription: 'Globe half-illuminated with daytime continents and nighttime city lights.'
      }
    ],
    quiz: [
      {
        id: 'qer1',
        question: 'How long does it take for Earth to complete one full rotation on its axis?',
        options: [
          { text: '24 Hours (1 Day)', correct: true },
          { text: '365 Days (1 Year)', correct: false },
          { text: '12 Hours', correct: false }
        ],
        explanation: 'One complete rotation takes 24 hours, giving us day and night.'
      }
    ],
    keywords: ['earth rotation', 'day and night', 'earth revolution', 'seasons', 'day night cycle', 'why we have night', 'earth axis']
  },

  'continents-oceans': {
    id: 'continents-oceans',
    subjectId: 'social-science',
    title: '7 Continents & 5 Oceans',
    subtitle: 'Exploring the landmasses and blue waters of planet Earth',
    badge: 'World Geography',
    rule: '7 Continents: Asia, Africa, N. America, S. America, Antarctica, Europe, Australia',
    explanation: 'Over 70% of Earth is covered by sparkling ocean water. The remaining dry land is divided into 7 grand continents, with Asia being the largest and Australia being the island continent.',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Continents', type: 'landmass', tag: '7 Major Land Regions' },
      { name: 'Oceans', type: 'waterbody', tag: 'Pacific, Atlantic, Indian, Arctic, Southern' }
    ],
    examples: [
      {
        id: 'asia',
        sentence: 'Asia is the world’s largest continent by both land area and population.',
        visualDescription: 'World map highlighting Asia and the surrounding Indian and Pacific oceans.'
      }
    ],
    quiz: [
      {
        id: 'qco1',
        question: 'Which is the largest continent on Earth?',
        options: [
          { text: 'Asia', correct: true },
          { text: 'Africa', correct: false },
          { text: 'Europe', correct: false }
        ],
        explanation: 'Asia is the largest continent, home to more than half of the world’s population!'
      }
    ],
    keywords: ['continents', 'oceans', '7 continents', 'world map', 'asia africa america', 'pacific ocean']
  },

  'volcanoes': {
    id: 'volcanoes',
    subjectId: 'social-science',
    title: 'Volcano Structure & Eruptions',
    subtitle: 'Magma chambers, conduits, vents, and glowing lava flows',
    badge: 'Geology',
    rule: 'Magma (underground molten rock) ➔ Lava (molten rock on Earth’s surface)',
    explanation: 'A volcano is a mountain that opens downward to a pool of molten rock below the Earth’s crust. When tectonic pressure builds up, explosive eruptions push fiery lava, ash, and steam into the sky!',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Magma Chamber', type: 'geology', tag: 'Subsurface molten rock pool' },
      { name: 'Main Conduit', type: 'geology', tag: 'Vertical volcanic pipe' },
      { name: 'Crater Vent', type: 'geology', tag: 'Summit opening' },
      { name: 'Flowing Lava', type: 'molten', tag: 'Glowing red liquid rock' }
    ],
    examples: [
      {
        id: 'eruption',
        sentence: 'Magma rises through the main pipe and erupts as fiery lava.',
        visualDescription: 'Cutaway cross-section of a conical volcano erupting smoke and lava.'
      }
    ],
    quiz: [
      {
        id: 'qv1',
        question: 'What is molten rock called once it erupts onto the Earth’s surface?',
        options: [
          { text: 'Lava', correct: true },
          { text: 'Magma', correct: false },
          { text: 'Granite', correct: false }
        ],
        explanation: 'Underground it is called magma; once it breaches the surface, it is called lava.'
      }
    ],
    keywords: ['volcanoes', 'volcano', 'lava magma', 'volcano eruption', 'magma chamber', 'geology']
  },

  // ===================== COMPUTER SCIENCE =====================
  'binary-code': {
    id: 'binary-code',
    subjectId: 'computer-science',
    title: 'Binary Code (0s and 1s)',
    subtitle: 'How computers represent numbers, letters, and images using bits',
    badge: 'Digital Logic',
    rule: 'Base-2 Number System: Each Bit is either 0 (OFF) or 1 (ON)',
    explanation: 'Computers use billions of tiny electronic switches (transistors). A switch can either be OFF (0) or ON (1). By combining 8 bits into a Byte (like 128, 64, 32, 16, 8, 4, 2, 1), computers can calculate any number or letter!',
    visualType: 'binary-lab',
    visualObjects: [
      { name: '8-Bit Switchboard', type: 'interactive-switches', tag: 'Toggle bits 128, 64, 32, 16, 8, 4, 2, 1' },
      { name: 'Decimal Output', type: 'calculator', tag: 'Live sum calculation' },
      { name: 'ASCII Character', type: 'text-converter', tag: 'Letter representation' }
    ],
    examples: [
      {
        id: 'bin-1',
        sentence: 'Binary 00000101 = (4 + 1) = Number 5 in decimal.',
        visualDescription: 'Switchboard with bits 4 and 1 switched ON.'
      },
      {
        id: 'bin-65',
        sentence: 'Binary 01000001 = (64 + 1) = Number 65 = Letter "A" in ASCII!',
        visualDescription: 'Bits 64 and 1 active, producing letter "A".'
      }
    ],
    quiz: [
      {
        id: 'qb1',
        question: 'What two digits are used in binary code?',
        options: [
          { text: '0 and 1', correct: true },
          { text: '1 and 2', correct: false },
          { text: '0 to 9', correct: false }
        ],
        explanation: 'Binary means base 2, using only the symbols 0 (off) and 1 (on).'
      },
      {
        id: 'qb2',
        question: 'How many bits make up 1 Byte?',
        options: [
          { text: '8 bits', correct: true },
          { text: '4 bits', correct: false },
          { text: '16 bits', correct: false }
        ],
        explanation: 'A group of 8 binary bits forms 1 standard Byte.'
      }
    ],
    keywords: ['binary code', 'binary numbers', '0 and 1', 'bits and bytes', 'how computers count', 'base 2', 'digital switches']
  },

  'algorithms-flowcharts': {
    id: 'algorithms-flowcharts',
    subjectId: 'computer-science',
    title: 'Algorithms & Step-by-Step Problem Solving',
    subtitle: 'Ordered instructions for computers to solve complex problems',
    badge: 'Computer Logic',
    rule: 'Algorithm = Clear, Step-by-Step Recipe to Complete a Task',
    explanation: 'An algorithm is like a cooking recipe or a Lego instruction manual. It tells the computer exactly what step to do first, second, and third to sort numbers or solve a puzzle efficiently!',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Step 1: Input', type: 'flowchart', tag: 'Receive data' },
      { name: 'Step 2: Compare', type: 'flowchart', tag: 'Check conditions (If / Else)' },
      { name: 'Step 3: Output', type: 'flowchart', tag: 'Deliver solution' }
    ],
    examples: [
      {
        id: 'algo-sort',
        sentence: 'Bubble Sort compares adjacent bars and swaps them if the left is taller than the right.',
        visualDescription: 'Animated bars swapping positions step-by-step from unsorted to sorted order.'
      }
    ],
    quiz: [
      {
        id: 'qal1',
        question: 'What is an algorithm in computer science?',
        options: [
          { text: 'A step-by-step set of instructions to solve a problem', correct: true },
          { text: 'A type of computer screen', correct: false },
          { text: 'A computer virus', correct: false }
        ],
        explanation: 'An algorithm is a logical recipe or sequence of rules to accomplish a task.'
      }
    ],
    keywords: ['algorithms', 'algorithm', 'flowcharts', 'step by step', 'how computers think', 'sorting algorithm', 'problem solving']
  },

  'how-internet-works': {
    id: 'how-internet-works',
    subjectId: 'computer-science',
    title: 'How the Internet Works (Packets & Servers)',
    subtitle: 'Data traveling across undersea fiber cables in millisecond packets',
    badge: 'Networking',
    rule: 'Client Request ➔ DNS ➔ Web Server ➔ Data Packets ➔ Browser Screen',
    explanation: 'When you click a website link, your computer breaks your request into tiny digital packets. They travel at the speed of light through Wi-Fi routers and undersea fiber cables to a server that sends back the visual web page!',
    visualType: 'generic-diagram',
    visualObjects: [
      { name: 'Client Browser', type: 'network', tag: 'Your Laptop or Phone' },
      { name: 'Routers & Cables', type: 'network', tag: 'Packet Highway' },
      { name: 'Cloud Server', type: 'network', tag: 'Stores website data' }
    ],
    examples: [
      {
        id: 'net1',
        sentence: 'Data packets zooming across network nodes to assemble your favorite learning page.',
        visualDescription: 'Animated glowing packets traveling along network lines between laptop and server.'
      }
    ],
    quiz: [
      {
        id: 'qint1',
        question: 'What are small chunks of data called that travel across the internet?',
        options: [
          { text: 'Packets', correct: true },
          { text: 'Envelopes', correct: false },
          { text: 'Boxes', correct: false }
        ],
        explanation: 'Information on the internet is broken down into small data packets and reassembled at the destination.'
      }
    ],
    keywords: ['how internet works', 'internet', 'data packets', 'servers', 'wifi and routers', 'web browser', 'networking']
  }
};
