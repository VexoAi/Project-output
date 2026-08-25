# 🧬 BioProcess – AI Biology Teacher, 2D Animated Process Lab & Live Notes Scribe

[![Live Demo on Vercel](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://biology-innovexa6.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/devadharshiniraguram-sys/biology)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🚀 **Live Web App on Vercel:** [https://biology-innovexa6.vercel.app/](https://biology-innovexa6.vercel.app/)  
> 🔗 **GitHub Repository:** [https://github.com/devadharshiniraguram-sys/biology](https://github.com/devadharshiniraguram-sys/biology)

---

## 🌟 Overview

**BioProcess** is an educational biology laboratory and AI teaching platform powered by **Dr. Helix**, an AI Biology Teacher. The application features:

- 🎬 **Full-Screen 60 FPS Process Video Player:** Visualizing step-by-step biological processes.
- 🔴 **Real-Time Live Notes Scribe:** Transcribes spoken speech into highlighted study notes with key terms in real-time.
- 👩‍🏫 **AI Teacher 8-Step Lessons:** Interactive curriculum covering 10 core biological domains.
- 🎒 **2-Minute Kid Story Adventures:** Kid-friendly explanations for younger students.
- 🎯 **Topic Mastery Quizzes:** Video-synced challenges to test retention and understanding.
- 🎙️ **Hands-Free Voice Control:** Speak commands or ask questions naturally to control the laboratory.

---

## 🔬 10 Interactive Biology Modules

1. **🧬 DNA & Genetics**: 5-step replication fork, helicase unzipping, leading/lagging strand synthesis, and chromosome packing.
2. **❤️ Circulatory System**: 4-chambered heart engine, figure-8 circuit, oxygenated arterial highways, venous valves, and capillary exchange.
3. **🫁 Respiratory System**: Dynamic diaphragm mechanics, alveolar capillary gas diffusion ($O_2 \rightleftharpoons CO_2$), and tidal lung capacity.
4. **🧠 Nervous System**: Neuronal action potential propagation, myelin saltatory conduction, synaptic vesicle exocytosis, and reflex arcs.
5. **🌱 Photosynthesis & Plant Energy**: Dual-stage light-dependent photon capture, water photolysis, $CO_2$ stomatal intake, and glucose synthesis.
6. **🔬 Cell Structure & Microscopy**: Plant vs. Animal cell organelles with zoom microscopy inspection and ATP synthesis tracking.
7. **🦠 Microorganisms & Immune Response**: Binary fission bacterial replication, penicillin zone of inhibition, and macrophage phagocytosis.
8. **🍎 Digestive System**: Human anatomical silhouette showing internal digestion (Mouth $\rightarrow$ Esophagus $\rightarrow$ Stomach $\rightarrow$ Liver/Bile $\rightarrow$ Small Intestine $\rightarrow$ Colon) with live GI telemetry.
9. **👑 Animal Classification & 6 Kingdoms**: The 6 biological kingdoms (Vertebrates, Invertebrates, Plantae, Fungi, Protista, Monera) with dedicated animated scenes.
10. **🌲 Ecosystem Dynamics & Energy Flow**: 4-tier trophic food web, solar primary production, 10% energy transfer rule, and ecological balance.

---

## 🎙️ Hands-Free Voice Control

Click **🎙️ Voice Control: OFF** (Shortcut: `V`) and allow microphone access:
- *"Teacher mode"* / *"Teach me"*
- *"Kid tour"* / *"Tell kid story"*
- *"Start quiz"* / *"Test me"*
- *"Why is left ventricle thick?"*
- *"How does Helicase work?"*
- *"How does diaphragm move?"*
- *"Where does oxygen come from?"*
- *"Open DNA"* / *"Open Circulatory"* / *"Open Digestive"* / *"Open Respiratory"*

---

## 📁 Repository Structure

```
biology/
├── index.html                # Root fallback entry point
├── vercel.json               # Vercel deployment configuration
├── package.json              # Project scripts and metadata
├── README.md                 # Project documentation & live links
├── frontend/                 # Client-side user interface & simulation engines
│   ├── index.html            # Main application interface
│   ├── css/
│   │   ├── main.css          # Full-screen cinema layout & compact live notes
│   │   ├── simulations.css   # 60 FPS animation canvas styles
│   │   └── character.css     # AI Teacher avatar & speech bubble styles
│   └── js/
│       ├── app.js            # Main coordinator & top navigation
│       ├── speech.js         # Web Speech API synthesis engine
│       ├── character.js      # Dr. Helix speech coordinator & live event dispatcher
│       ├── studyNotes.js     # Biology study notes & vocabulary glossary
│       ├── studyNotesUI.js   # Real-time Live Notes Scribe & companion panel
│       ├── teacherLessonEngine.js # 8-Step pedagogical lesson controller
│       ├── kidModeEngine.js  # 2-Minute interactive kid adventures
│       ├── smartQuestionEngine.js # Natural language question-to-video matcher
│       ├── quizEngine.js     # Topic mastery challenge engine
│       ├── voiceCommand.js   # Voice recognition & command processor
│       ├── audio.js          # Procedural sound effects synthesizer
│       └── topics/           # 10 Topic animation modules
│           ├── dnaGenetics.js
│           ├── circulatory.js
│           ├── respiratory.js
│           ├── nervous.js
│           ├── photosynthesis.js
│           ├── cellStructure.js
│           ├── microorganisms.js
│           ├── digestive.js
│           ├── animalClass.js
│           └── ecosystem.js
└── backend/                  # Local static server
    └── server.js
```

---

## ⚡ Deployment on Vercel

Configured for Vercel deployment via [`vercel.json`](vercel.json):
* **Live Deployment URL:** [https://biology-innovexa6.vercel.app/](https://biology-innovexa6.vercel.app/)
* **Root Output Directory:** `frontend`
