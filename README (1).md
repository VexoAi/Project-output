# 🧬 BioBuddy & Dr. Helix – 2D Interactive Biology Teacher

An interactive educational biology platform featuring **Dr. Helix**, an animated 2D vector teacher character with voice narration, microphone voice recognition commands, interactive laboratory simulations, and gamified challenges across 10 core biological domains.

---

## 📁 Directory Architecture

```
biology-tutor/
├── frontend/                     # Client-side user interface & simulation engines
│   ├── index.html                # Main application interface
│   ├── css/
│   │   ├── main.css              # Design tokens, glassmorphism theme, modals & layout
│   │   ├── character.css         # 2D character SVG rigging, emotions & speech animations
│   │   └── simulations.css       # Laboratory canvas styling, interactive controls & HUDs
│   └── js/
│       ├── audio.js              # Web Audio procedural sound effects synthesizer
│       ├── speech.js             # Web Speech API voice synthesis narrator
│       ├── character.js          # Dr. Helix 2D avatar state machine & eye tracking
│       ├── voiceCommand.js       # Speech recognition hands-free voice control engine
│       ├── quizEngine.js         # Topic quizzes, XP, badges & certificate generator
│       ├── app.js                # Main application coordinator & glossary
│       └── topics/               # 10 Interactive biological simulation modules
│           ├── dnaGenetics.js    # DNA unzipping & Punnett square calculator
│           ├── circulatory.js    # 4-chamber beating heart & BPM stethoscope
│           ├── respiratory.js    # Diaphragm mechanics & alveolar gas diffusion
│           ├── nervous.js        # Brain anatomy & synaptic action potentials
│           ├── photosynthesis.js # Chloroplast reactor (Light, H2O, CO2 tuning)
│           ├── cellStructure.js  # Plant vs Animal cell microscope viewer
│           ├── microorganisms.js # Petri dish incubator & immune macrophages
│           ├── digestive.js      # 5-stage food journey & digestive enzymes
│           ├── animalClass.js    # Taxonomy explorer & mystery specimen sorting
│           └── ecosystem.js      # Trophic energy pyramid & predator-prey dynamics
│
├── backend/                      # Server-side static delivery & HTTP endpoints
│   ├── server.js                 # Node.js server serving frontend static assets
│   └── package.json              # Backend package configuration & scripts
│
└── others/                       # Supporting guides, curriculum & documentation
    ├── README.md                 # Project architecture & overview
    ├── VOICE_COMMANDS.md         # Full spoken voice commands reference
    └── CURRICULUM_GUIDE.md       # Biology curriculum syllabus & learning objectives
```

---

## 🚀 How to Run the Application

1. Open your terminal in the `backend/` folder:
   ```bash
   cd c:\Users\Devadharshini\.antigravity-ide\biology-tutor\backend
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

---

## 🎙️ Hands-Free Voice Operation
Click the **🎙️ Voice Control: OFF** button in the header bar and allow microphone permissions. Speak any command:
- *"Open DNA"* or *"Genetics"*
- *"Open Circulatory"* or *"Heart"*
- *"Open Respiratory"* or *"Lungs"*
- *"Open Brain"* or *"Nervous System"*
- *"Open Photosynthesis"*
- *"Open Cell Structure"*
- *"Open Microorganisms"*
- *"Open Digestive System"*
- *"Open Animal Classification"*
- *"Open Ecosystem"*
- *"Start Quiz"* / *"Challenge me"*
- *"Tell me a fact"* / *"Bio fact"*
- *"Wear Cyber Visor"* / *"Wear Stethoscope"* / *"Wear Explorer Hat"*
- *"Unzip DNA"* / *"Deploy Macrophage"* / *"Trigger Drought"*
