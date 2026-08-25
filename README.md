# 🧬 BioBuddy & Dr. Helix – 2D Interactive Biology Teacher & Virtual Lab

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://hack-devadharshiniraguram-sys.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-hack-181717?style=for-the-badge&logo=github)](https://github.com/devadharshiniraguram-sys/hack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🚀 **Live Demo on Vercel:** [https://hack-devadharshiniraguram-sys.vercel.app](https://hack-devadharshiniraguram-sys.vercel.app)  
> 🔗 **GitHub Repository:** [https://github.com/devadharshiniraguram-sys/hack](https://github.com/devadharshiniraguram-sys/hack)

---

## 🌟 Overview

**BioBuddy** is an educational biology web platform featuring **Dr. Helix**, an animated 2D vector teacher character with voice narration, microphone voice recognition commands, interactive laboratory simulations, and gamified challenges across 10 core biological domains.

---

## 🔬 10 Biological Interactive Modules

1. **🧬 DNA & Genetics**: Interactive double helix unzipping, base-pairing, and Punnett square probability calculator.
2. **❤️ Circulatory System**: 4-chamber beating heart with interactive BPM stethoscope and oxygenation toggle.
3. **🫁 Respiratory System**: Dynamic diaphragm mechanics and alveolar gas diffusion chamber.
4. **🧠 Nervous System**: Interactive brain anatomical lobes and synaptic action potential pulse trigger.
5. **🌱 Photosynthesis**: Chloroplast reactor with Light Intensity, CO₂, and H₂O sliders yielding glucose and O₂.
6. **🔬 Cell Structure & Microscopy**: Side-by-side Plant vs. Animal cell microscope with zoom and organelle inspector.
7. **🦠 Microorganisms & Immune Response**: Petri dish incubator with bacteria colony growth and macrophage deployment.
8. **🍔 Digestive System & Enzymes**: 5-stage food journey with mechanical vs chemical digestion controls.
9. **🦁 Animal Classification & Taxonomy**: 6 vertebrate & invertebrate classes with mystery specimen sorting mini-game.
10. **🌲 Ecosystem Dynamics & Food Webs**: 4-level trophic energy pyramid with sunlight and predator-prey balance controls.

---

## 🎙️ Hands-Free Voice Operation

Click the **🎙️ Voice Control: OFF** button in the header bar and allow microphone access. Speak any command:
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

---

## 📁 Directory Architecture

```
hack/
├── index.html                # Root entry point
├── vercel.json               # Vercel deployment configuration & route rewrites
├── package.json              # Project scripts and dependencies
├── .gitignore                # Git ignore configuration
├── frontend/                 # Client-side user interface & simulation engines
│   ├── index.html            # Main interactive application interface
│   ├── css/
│   │   ├── main.css          # Theme tokens, glassmorphism UI & responsive grid
│   │   ├── character.css     # Dr. Helix SVG rigging & emotion states
│   │   └── simulations.css   # Interactive laboratory canvas styles
│   └── js/
│       ├── audio.js          # Web Audio procedural sound effects synthesizer
│       ├── speech.js         # Web Speech API voice synthesis narrator
│       ├── character.js      # Dr. Helix 2D avatar state machine & eye tracking
│       ├── voiceCommand.js   # Speech recognition voice control engine
│       ├── quizEngine.js     # Topic quizzes, XP, badges & certificate generator
│       ├── app.js            # Main coordinator & interactive glossary
│       └── topics/           # 10 Interactive biological simulation modules
│           ├── animalClass.js
│           ├── cellStructure.js
│           ├── circulatory.js
│           ├── digestive.js
│           ├── dnaGenetics.js
│           ├── ecosystem.js
│           ├── microorganisms.js
│           ├── nervous.js
│           ├── photosynthesis.js
│           └── respiratory.js
├── backend/                  # Server-side static delivery & HTTP endpoints
│   ├── server.js             # Node.js development static server
│   └── package.json          # Backend package configuration
└── others/                   # Supporting curriculum & guides
    ├── README.md
    ├── VOICE_COMMANDS.md
    └── CURRICULUM_GUIDE.md
```

---

## ⚡ Deployment on Vercel

This repository is pre-configured with [`vercel.json`](vercel.json) for 1-click zero-config deployment:

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import `devadharshiniraguram-sys/hack`
3. Click **Deploy**

---

## 📄 License
This project is licensed under the MIT License.
