# 🎓 Vexo-AI — Smart Teacher Interactive Voice AI Character

An interactive, voice-guided AI classroom instructor featuring animated SVG character modeling, speech synthesis with lip-sync animation, Web Speech recognition, whiteboard presentations, and STEM curriculum simulations.

---

## 🌟 Key Features

- **🎙️ Real-Time Voice Hearing & Continuous Listening**: Powered by the Web Speech API with real-time interim hearing transcripts and microphone toggle (`Spacebar` shortcut).
- **🗣️ Natural Voice Synthesis & Lip Sync**: Dynamically syncs mouth shapes with spoken explanations using responsive pitch and cadence.
- **🏛️ Frontal Conversational Presentations**:
  - **Sri Shakthi Institute of Engineering & Technology (SIET)**: Autonomous campus overview, AI incubation, robotics research, and hackathon culture.
  - **Thalapathy Vijay's Journey**: Cinema legacy to public leadership with Tamizhaga Vettri Kazhagam (TVK).
  - **VoxSim AI (SIH 2025)**: Voice-to-simulation pipeline architecture and impact modules by Team Innovexa.
- **📚 Dynamic Whiteboard Curriculum**:
  - **Newton's 3rd Law of Motion**: Teacher turns backward to whiteboard, equips textbook and laser pointer stick.
  - **World War 1 (1914–1918)**: Interactive timeline and history module with pointer stick highlighting.
  - **Active & Passive Voice, Periodic Table, Pythagorean Theorem, Photosynthesis, AI & Robotics**.
- **🎒 Interactive 3D Accessories & Props**: Toggle Book 📘, Pointer Stick 🪄, Pen 🖊️, Laptop 💻, Desk 🪑, Plant 🪴, and Backpack 🎒.
- **⏹️ Immediate Stop Control**: Halts all active speech and slide routines with 0ms latency via button, `Esc` key, or voice trigger (*"stop"*).
- **📐 Clean 2-Column Stage Geometry**: The teacher is positioned on the left side of the stage (`left: 10px; width: 270px`), keeping the entire whiteboard (`left: 290px; right: 25px`) completely unobstructed.

---

## 🚀 How to Run Locally

### Method 1: Using the Startup Script (Windows)
Double-click `start.bat` in the project root to start the local server and open the application in your browser.

### Method 2: Using Node / NPX
```bash
# Start a local static file server on port 8080
npx http-server -p 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in Chrome, Edge, or any modern browser.

### Method 3: Direct Browser Open
Simply double-click `index.html` to open it in your browser.

---

## 📁 Project Structure

```
├── index.html     # Semantic HTML5 layout, stage viewport, and sidebar
├── style.css      # Design system, glassmorphism tokens, and keyframe animations
├── script.js     # Character state engine, SVG renderer, voice recognition & speech
├── start.bat      # Windows one-click launcher
└── README.md      # Documentation
```

---

## 👥 Team
- **Team Innovexa** — Smart India Hackathon 2025
