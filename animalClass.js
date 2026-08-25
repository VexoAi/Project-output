// Topic 9: Animal Classification - 2D Animated Process Video & Taxonomy Simulator
window.bioTopics = window.bioTopics || {};

window.bioTopics.animalClass = {
  id: 'animalClass',
  title: 'Animal Classification',
  icon: '🐾',
  badgeName: 'Zoologist Master',
  summary: 'Animal classification groups animals according to shared characteristics and evolutionary relationships into vertebrates (with a backbone) and invertebrates (without a backbone).',

  processSteps: [
    {
      num: 1,
      name: 'Animal Diversity & Invertebrates',
      tag: 'No Backbone (>95%)',
      formula: 'Invertebrates (Insects, Mollusks, Worms)',
      desc: 'Animals are divided into vertebrates and invertebrates. Invertebrates lack a backbone and make up over 95% of all animal species on Earth.'
    },
    {
      num: 2,
      name: 'Vertebrates: Animals with a Backbone',
      tag: 'Backbone Structure',
      formula: 'Vertebral Column (Internal Skeleton)',
      desc: 'Vertebrates are characterized by an internal spinal column (backbone) that protects the main nerve cord and supports body movement.'
    },
    {
      num: 3,
      name: 'The 5 Major Vertebrate Groups',
      tag: '5 Vertebrate Classes',
      formula: 'Fish | Amphibians | Reptiles | Birds | Mammals',
      desc: 'Major vertebrate groups include Fish (gills/fins), Amphibians (dual life), Reptiles (scales), Birds (feathers/wings), and Mammals (hair/milk).'
    },
    {
      num: 4,
      name: 'Comparing Characteristics & Reproduction',
      tag: 'Trait Comparison',
      formula: 'Body Covering + Habitat + Reproduction',
      desc: 'Scientists classify animals by comparing their body coverings (scales, feathers, fur), breathing methods (gills, lungs), and how they reproduce.'
    },
    {
      num: 5,
      name: 'Classifying Living Animals',
      tag: 'Classification Examples',
      formula: '🐟 Fish | 🐸 Frog | 🐍 Snake | 🐦 Eagle | 🐘 Mammal | 🦋 Invertebrate',
      desc: 'Classification helps scientists identify, study, and protect the incredible diversity of animal life across our planet!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    selectedKingdom: 'animalia', // 'animalia' | 'invertebrata' | 'plantae' | 'fungi' | 'protista' | 'monera'
    animFrame: null
  },

  kingdomData: {
    animalia: {
      name: 'Kingdom Animalia (Vertebrates)',
      icon: '🦁',
      color: '#f59e0b',
      tag: 'Internal Backbone • Multicellular Heterotrophs',
      desc: 'Vertebrates possess an internal spinal column and skull protecting their central nervous system. Divided into 5 major classes: Mammals, Birds, Reptiles, Amphibians, and Fish.',
      examples: [
        { name: 'African Lion', icon: '🦁', group: 'Mammal (Mammalia)', detail: 'Warm-blooded, fur, live birth, feeds cubs milk' },
        { name: 'Blue Whale', icon: '🐋', group: 'Mammal (Cetacean)', detail: 'Largest animal on Earth, breathes air via blowhole' },
        { name: 'Peregrine Falcon', icon: '🦅', group: 'Bird (Aves)', detail: 'Fastest flyer (>240 mph), hollow bones, feathers & beaks' },
        { name: 'Emperor Penguin', icon: '🐧', group: 'Bird (Spheniscidae)', detail: 'Flightless aquatic diver in Antarctic ice waters' },
        { name: 'Nile Crocodile', icon: '🐊', group: 'Reptile (Reptilia)', detail: 'Cold-blooded, tough armored scales, lays land eggs' },
        { name: 'Chameleon', icon: '🦎', group: 'Reptile (Squamata)', detail: 'Zygodactylous gripping feet, 360° independently moving eyes' },
        { name: 'Red-Eyed Tree Frog', icon: '🐸', group: 'Amphibian (Amphibia)', detail: 'Dual life (Metamorphosis): water tadpole ➔ land jumper' },
        { name: 'Great White Shark', icon: '🦈', group: 'Fish (Chondrichthyes)', detail: 'Cartilaginous skeleton, gill slits, electroreceptors' }
      ]
    },
    invertebrata: {
      name: 'Invertebrates (>95% of Earth Species)',
      icon: '🦋',
      color: '#ec4899',
      tag: 'No Backbone • Exoskeletons & Hydrostatic Support',
      desc: 'Invertebrates lack a backbone and comprise over 95% of all animal species on Earth across Arthropods, Mollusks, Annelids, Cnidarians, and Echinoderms.',
      examples: [
        { name: 'Monarch Butterfly', icon: '🦋', group: 'Arthropod (Insecta)', detail: '6 jointed legs, 3 body parts, chitin exoskeleton & wings' },
        { name: 'Honeybee', icon: '🐝', group: 'Arthropod (Hymenoptera)', detail: 'Eusocial pollinator communicating with waggle dances' },
        { name: 'Giant Pacific Octopus', icon: '🐙', group: 'Mollusk (Cephalopoda)', detail: '3 hearts, blue hemocyanin blood, 8 intelligent arms' },
        { name: 'Garden Snail', icon: '🐌', group: 'Mollusk (Gastropoda)', detail: 'Spiral calcium shell, rasping radula tongue' },
        { name: 'Earthworm', icon: '🪱', group: 'Annelid (Oligochaeta)', detail: 'Segmented hydrostatic body aerating rich soil' },
        { name: 'Moon Jellyfish', icon: '🪼', group: 'Cnidarian (Scyphozoa)', detail: '95% water bell, radial symmetry, stinging nematocysts' },
        { name: 'Starfish (Sea Star)', icon: '⭐', group: 'Echinoderm (Asteroidea)', detail: '5-arm pentaradial symmetry with water tube feet' }
      ]
    },
    plantae: {
      name: 'Kingdom Plantae (Plants & Trees)',
      icon: '🌿',
      color: '#10b981',
      tag: 'Autotrophs • Cellulose Cell Walls • Chloroplast Photosynthesis',
      desc: 'Plants produce their own glucose sugar food via solar photosynthesis. Ranging from microscopic mosses and ferns to giant flowering trees.',
      examples: [
        { name: 'Giant Redwood Tree', icon: '🌲', group: 'Gymnosperm (Conifer)', detail: 'Tallest living tree (>350 ft), carries needle cones' },
        { name: 'Sunflower & Apple Tree', icon: '🌻', group: 'Angiosperm (Flowering)', detail: 'Produces nectar flowers and sweet seed-bearing fruit' },
        { name: 'Boston Fern', icon: '🌿', group: 'Pteridophyte (Seedless)', detail: 'Vascular fronds reproducing via spore packets' },
        { name: 'Emerald Velvet Moss', icon: '🌱', group: 'Bryophyte (Non-vascular)', detail: 'Absorbs moisture directly from air and rocks' }
      ]
    },
    fungi: {
      name: 'Kingdom Fungi (Mushrooms & Yeasts)',
      icon: '🍄',
      color: '#a855f7',
      tag: 'Heterotrophic Decomposers • Chitin Walls • Spore Reproduction',
      desc: 'Fungi are nature\'s ultimate recyclers. They absorb organic nutrients through underground mycelium networks and reproduce via microscopic spores.',
      examples: [
        { name: 'Fly Agaric Mushroom', icon: '🍄', group: 'Basidiomycete (Club Fungi)', detail: 'Red dotted cap releasing billions of airborne spores' },
        { name: 'Baker\'s Yeast', icon: '🍞', group: 'Ascomycete (Single-Celled)', detail: 'Ferments sugar into CO₂ gas to make fluffy bread rise' },
        { name: 'Penicillium Mold', icon: '🧫', group: 'Medicinal Fungus', detail: 'Produces life-saving penicillin antibiotic' },
        { name: 'Underground Truffle', icon: '🥔', group: 'Mycorrhizal Fungus', detail: 'Forms underground nutrient partnership with tree roots' }
      ]
    },
    protista: {
      name: 'Kingdom Protista (Single-Celled Marvels)',
      icon: '🦠',
      color: '#06b6d4',
      tag: 'Eukaryotic Microorganisms • Aquatic • Diverse Locomotion',
      desc: 'Protists are complex single-celled or colony-forming organisms that live in aquatic drops. Some photosynthesize like plants, while others hunt like animals.',
      examples: [
        { name: 'Amoeba proteus', icon: '🦶', group: 'Sarcodina (Protozoan)', detail: 'Extends flowing false feet (Pseudopodia) to engulf food' },
        { name: 'Paramecium caudatum', icon: '〰️', group: 'Ciliate (Protozoan)', detail: 'Covered in thousands of rhythmic beating hair-like cilia' },
        { name: 'Euglena gracilis', icon: '🌾', group: 'Flagellate (Mixotroph)', detail: 'Whips a long tail (Flagellum) and has chloroplasts' },
        { name: 'Volvox Algae', icon: '🟢', group: 'Colonial Green Algae', detail: 'Spherical spinning colonies of 50,000 cooperating cells' }
      ]
    },
    monera: {
      name: 'Kingdom Monera (Bacteria & Archaea)',
      icon: '🧫',
      color: '#f59e0b',
      tag: 'Prokaryotes (No Nucleus) • Peptidoglycan Walls • Binary Fission',
      desc: 'The most ancient and abundant life forms on Earth. Simple prokaryotic cells that thrive in soil, inside human guts, and in extreme volcanic vents.',
      examples: [
        { name: 'Lactobacillus', icon: '🥛', group: 'Probiotic Bacteria', detail: 'Healthy gut helper that turns milk into creamy yogurt' },
        { name: 'Cyanobacteria', icon: '🌊', group: 'Blue-Green Algae', detail: 'Ancient bacteria that created Earth\'s first breathable oxygen' },
        { name: 'Deep-Sea Archaea', icon: '🌋', group: 'Extremophile', detail: 'Survives in boiling 120°C hydrothermal lava vents' },
        { name: 'Bacillus subtilis', icon: '💊', group: 'Spore-forming Rod', detail: 'Forms indestructible armor spores during droughts' }
      ]
    }
  },

  render(container) {
    container.innerHTML = `
      <div class="cinema-header">
        <div class="cinema-title-wrap">
          <span class="cinema-topic-icon">${this.icon}</span>
          <div>
            <h2 class="cinema-title">${this.title}</h2>
            <p class="cinema-summary">${this.summary}</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="cinema-live-tag">
            <span class="live-pulse-dot"></span>
            🔴 LIVE PROCESS VIDEO • 60 FPS
          </span>
        </div>
      </div>

      <div class="cinema-canvas-wrap">
        <canvas id="animal-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="anim-timeline-track">
          <div class="cinema-timeline-fill" id="anim-timeline-fill" style="width: 20%;"></div>
        </div>

        <div class="cinema-steps-nav">
          ${this.processSteps.map((s, idx) => `
            <button class="cinema-step-btn ${idx === 0 ? 'active' : ''}" data-step="${idx}">
              <span class="step-num">${s.num}</span>
              <span>${s.name}</span>
            </button>
          `).join('')}
        </div>

        <div class="cinema-playback-row">
          <div class="playback-left-group">
            <button class="video-btn play-btn" id="btn-play-pause">
              ${this.state.isPlaying ? '⏸ Pause Video' : '▶ Play Video'}
            </button>
            <button class="video-btn" id="btn-prev-step">⏮ Prev</button>
            <button class="video-btn" id="btn-next-step">Next ⏭</button>
            <button class="video-btn" id="btn-replay">🔁 Replay</button>
          </div>

          <div class="playback-right-group">
            <button class="video-btn" id="btn-speed">⚡ ${this.state.speed}x</button>
            <button class="video-btn" id="btn-voice">🔊 Voice</button>
            <button class="video-btn" id="btn-fs">⛶ Fullscreen</button>
          </div>
        </div>
      </div>

      <div class="cinema-subtitles-banner">
        <div class="subtitles-step-chip" id="anim-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="anim-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="anim-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>

      <!-- Biological Kingdom Explorer & Real-World Specimens -->
      <div class="lab-panel" style="margin-top: 14px;">
        <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
          <h3><span class="pulse-icon">👑</span> The 6 Biological Kingdoms of Life</h3>
          <span style="font-size:11px; color:#94a3b8;">Click any kingdom to explore custom animations, specimens & adaptations</span>
        </div>

        <!-- Kingdom Switcher Buttons -->
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px;">
          <button class="video-btn ${this.state.selectedKingdom === 'animalia' ? 'active' : ''} btn-kdom" data-k="animalia">🦁 1. Animalia (Vertebrates)</button>
          <button class="video-btn ${this.state.selectedKingdom === 'invertebrata' ? 'active' : ''} btn-kdom" data-k="invertebrata">🦋 2. Invertebrates (>95%)</button>
          <button class="video-btn ${this.state.selectedKingdom === 'plantae' ? 'active' : ''} btn-kdom" data-k="plantae">🌿 3. Plantae (Plants)</button>
          <button class="video-btn ${this.state.selectedKingdom === 'fungi' ? 'active' : ''} btn-kdom" data-k="fungi">🍄 4. Fungi (Mushrooms)</button>
          <button class="video-btn ${this.state.selectedKingdom === 'protista' ? 'active' : ''} btn-kdom" data-k="protista">🦠 5. Protista (Single Cells)</button>
          <button class="video-btn ${this.state.selectedKingdom === 'monera' ? 'active' : ''} btn-kdom" data-k="monera">🧫 6. Monera (Bacteria)</button>
        </div>

        <!-- Dynamic Specimen Cards Container -->
        <div id="specimen-cards-container" style="background:rgba(15,23,42,0.85); border:1px solid rgba(56,189,248,0.25); border-radius:12px; padding:16px;">
          ${this.renderKingdomCards()}
        </div>
      </div>
    `;

    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  renderKingdomCards() {
    const k = this.kingdomData[this.state.selectedKingdom] || this.kingdomData.animalia;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:12px;">
        <div>
          <h4 style="margin:0; font-size:16px; color:${k.color}; display:flex; align-items:center; gap:8px;">
            <span>${k.icon}</span> ${k.name}
          </h4>
          <span style="font-size:11px; color:#fef08a; font-weight:600;">${k.tag}</span>
        </div>
        <span style="font-size:11px; color:#cbd5e1; max-width:55%; text-align:right;">${k.desc}</span>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
        ${k.examples.map(ex => `
          <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:10px; display:flex; align-items:center; gap:12px;">
            <span style="font-size:30px;">${ex.icon}</span>
            <div>
              <div style="font-weight:bold; font-size:12px; color:#fff;">${ex.name}</div>
              <div style="font-size:10px; color:#38bdf8; font-weight:600;">${ex.group}</div>
              <div style="font-size:9px; color:#94a3b8; margin-top:2px;">${ex.detail}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  seekStep(idx, speak = false) {
    if (this._stepAdvanceTimeout) {
      clearTimeout(this._stepAdvanceTimeout);
      this._stepAdvanceTimeout = null;
    }

    this.state.currentStep = Math.max(0, Math.min(idx, this.processSteps.length - 1));
    const step = this.processSteps[this.state.currentStep];

    // Align active kingdom with current step
    if (this.state.currentStep === 0) this.state.selectedKingdom = 'invertebrata';
    else if (this.state.currentStep === 1) this.state.selectedKingdom = 'animalia';
    else if (this.state.currentStep === 2) this.state.selectedKingdom = 'animalia';
    else if (this.state.currentStep === 3) this.state.selectedKingdom = 'invertebrata';
    else this.state.selectedKingdom = 'animalia';
    this.updateKingdomButtons();

    document.querySelectorAll('.cinema-step-btn').forEach((b, i) => {
      b.classList.toggle('active', i === this.state.currentStep);
      b.classList.toggle('completed', i < this.state.currentStep);
    });

    const fill = document.getElementById('anim-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('anim-subtitle-chip');
    const title = document.getElementById('anim-subtitle-title');
    const desc = document.getElementById('anim-subtitle-desc');
    if (chip) chip.textContent = `🐾 Step ${step.num}/5`;
    if (title) title.textContent = `${step.name} (${step.formula})`;
    if (desc) desc.textContent = step.desc;

    if (speak && window.drHelix) {
      const speechText = `Step ${step.num}: ${step.name}. ${step.desc}`;
      window.drHelix.say(speechText, 'explaining', true, () => {
        if (this.state.isPlaying) {
          this._stepAdvanceTimeout = setTimeout(() => {
            if (this.state.isPlaying) {
              if (this.state.currentStep < this.processSteps.length - 1) {
                this.nextStep();
              } else {
                if (window.bioApp && window.bioApp.showCinemaCompletionPrompt) {
                  window.bioApp.showCinemaCompletionPrompt();
                }
              }
            }
          }, 1800);
        }
      });
    }
  },

  updateKingdomButtons() {
    document.querySelectorAll('.btn-kdom').forEach(b => {
      b.classList.toggle('active', b.dataset.k === this.state.selectedKingdom);
    });
    const container = document.getElementById('specimen-cards-container');
    if (container) {
      container.innerHTML = this.renderKingdomCards();
    }
  },

  nextStep() {
    let next = this.state.currentStep + 1;
    if (next >= this.processSteps.length) next = 0;
    this.seekStep(next, true);
  },

  prevStep() {
    let prev = this.state.currentStep - 1;
    if (prev < 0) prev = this.processSteps.length - 1;
    this.seekStep(prev, true);
  },

  initEvents() {
    const playPauseBtn = document.getElementById('btn-play-pause');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.state.isPlaying = !this.state.isPlaying;
        playPauseBtn.textContent = this.state.isPlaying ? '⏸ Pause Video' : '▶ Play Video';
        if (this.state.isPlaying) {
          this.seekStep(this.state.currentStep, true);
        } else {
          if (this._stepAdvanceTimeout) clearTimeout(this._stepAdvanceTimeout);
          if (window.drHelix) window.drHelix.stop();
        }
      });
    }

    const nextBtn = document.getElementById('btn-next-step');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());

    const prevBtn = document.getElementById('btn-prev-step');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());

    const replayBtn = document.getElementById('btn-replay');
    if (replayBtn) replayBtn.addEventListener('click', () => {
      this.seekStep(0, true);
      this.state.isPlaying = true;
      if (playPauseBtn) playPauseBtn.textContent = '⏸ Pause Video';
    });

    const speedBtn = document.getElementById('btn-speed');
    if (speedBtn) {
      const speeds = [0.5, 1.0, 1.5, 2.0];
      speedBtn.addEventListener('click', () => {
        const currIdx = speeds.indexOf(this.state.speed);
        const nextSpeed = speeds[(currIdx + 1) % speeds.length];
        this.state.speed = nextSpeed;
        speedBtn.textContent = `⚡ ${nextSpeed}x`;
      });
    }

    const voiceBtn = document.getElementById('btn-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (window.bioSpeech) {
          const isEnabled = window.bioSpeech.toggleSpeech();
          voiceBtn.textContent = isEnabled ? '🔊 Voice' : '🔇 Muted';
        }
      });
    }

    const fsBtn = document.getElementById('btn-fs');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        const cinema = document.getElementById('cinema-player-root');
        if (cinema) {
          if (!document.fullscreenElement) cinema.requestFullscreen?.();
          else document.exitFullscreen?.();
        }
      });
    }

    document.querySelectorAll('.cinema-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.seekStep(parseInt(btn.dataset.step), true);
      });
    });

    document.querySelectorAll('.btn-kdom').forEach(b => {
      b.addEventListener('click', () => {
        this.state.selectedKingdom = b.dataset.k;
        this.updateKingdomButtons();
      });
    });
  },

  initCanvas() {
    const canvas = document.getElementById('animal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const k = this.state.selectedKingdom;

      if (this.state.isPlaying) {
        t += 0.025 * this.state.speed;
      }

      // Background ambient gradient tailored to selected Kingdom
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 460);
      if (k === 'animalia') bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
      else if (k === 'invertebrata') bgGrad.addColorStop(0, 'rgba(236, 72, 153, 0.16)');
      else if (k === 'plantae') bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      else if (k === 'fungi') bgGrad.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
      else if (k === 'protista') bgGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
      else bgGrad.addColorStop(0, 'rgba(234, 179, 8, 0.16)');

      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Title Banner
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.textAlign = 'center';

      if (k === 'animalia') {
        // ================= KINGDOM ANIMALIA (VERTEBRATES) =================
        ctx.fillText('🦁 KINGDOM ANIMALIA (VERTEBRATES) — ANIMALS WITH BONY BACKBONES & SPINES!', centerX, 28);

        const vCards = [
          { name: 'Mammals (Lion 🦁)', sub: 'Warm blood • Fur • Milk', col: '#f59e0b', x: centerX - 320, anim: Math.sin(t * 3) * 6 },
          { name: 'Birds (Eagle 🦅)', sub: 'Feathers • Wings • Eggs', col: '#38bdf8', x: centerX - 160, anim: Math.cos(t * 4) * 10 },
          { name: 'Reptiles (Lizard 🦎)', sub: 'Tough scales • Sunbaths', col: '#10b981', x: centerX, anim: Math.sin(t * 2.5) * 5 },
          { name: 'Amphibians (Frog 🐸)', sub: 'Water baby ➔ Land jumper', col: '#a855f7', x: centerX + 160, anim: Math.sin(t * 5) * 8 },
          { name: 'Fish (Shark 🦈)', sub: 'Gills & Fins in water', col: '#06b6d4', x: centerX + 320, anim: Math.cos(t * 3) * 7 }
        ];

        vCards.forEach(vc => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(vc.x - 68, centerY - 65 + vc.anim, 136, 150);
          ctx.strokeStyle = vc.col;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(vc.x - 68, centerY - 65 + vc.anim, 136, 150);

          ctx.font = '36px sans-serif';
          ctx.fillText(vc.name.split('(')[1].replace(')', ''), vc.x, centerY - 15 + vc.anim);

          ctx.fillStyle = vc.col;
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(vc.name.split('(')[0], vc.x, centerY + 28 + vc.anim);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(vc.sub, vc.x, centerY + 50 + vc.anim);
        });

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🦴 All Vertebrates share a strong internal backbone protecting their spinal cord! 🦴', centerX, height - 25);

      } else if (k === 'invertebrata') {
        // ================= INVERTEBRATES (>95% OF ANIMALS) =================
        ctx.fillText('🦋 INVERTEBRATES — AMAZING ANIMALS WITHOUT BACKBONES (>95% OF ALL SPECIES!)', centerX, 28);

        const inverts = [
          { icon: '🦋', name: 'Arthropod (Butterfly)', sub: '6 legs & chitin wings', col: '#ec4899', x: centerX - 240, wy: Math.sin(t * 4) * 8 },
          { icon: '🐙', name: 'Mollusk (Octopus)', sub: '8 arms, 3 hearts & shell', col: '#38bdf8', x: centerX - 80, wy: Math.cos(t * 3) * 10 },
          { icon: '🪼', name: 'Cnidarian (Jellyfish)', sub: '95% water & stinging bells', col: '#a855f7', x: centerX + 80, wy: Math.sin(t * 3.5) * 8 },
          { icon: '⭐', name: 'Echinoderm (Starfish)', sub: '5 tube feet & water arms', col: '#f59e0b', x: centerX + 240, wy: Math.cos(t * 2) * 5 }
        ];

        inverts.forEach(iv => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(iv.x - 70, centerY - 65 + iv.wy, 140, 150);
          ctx.strokeStyle = iv.col;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(iv.x - 70, centerY - 65 + iv.wy, 140, 150);

          ctx.font = '40px sans-serif';
          ctx.fillText(iv.icon, iv.x, centerY - 15 + iv.wy);

          ctx.fillStyle = iv.col;
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(iv.name, iv.x, centerY + 28 + iv.wy);

          ctx.fillStyle = '#fbcfe8';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(iv.sub, iv.x, centerY + 50 + iv.wy);
        });

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('✨ Soft bodies, protective shells, and jointed exoskeletons make invertebrates thrive everywhere! ✨', centerX, height - 25);

      } else if (k === 'plantae') {
        // ================= KINGDOM PLANTAE (PLANTS) =================
        ctx.fillText('🌿 KINGDOM PLANTAE — GREEN AUTOTROPHS POWERED BY SOLAR PHOTOSYNTHESIS!', centerX, 28);

        // Giant Sun & Flower Meadow
        const sunX = 140;
        ctx.font = '48px sans-serif';
        ctx.fillText('☀️', sunX, centerY - 40);

        const plants = [
          { icon: '🌲', name: 'Conifer (Redwood)', sub: 'Needles & seed cones', x: centerX - 120 },
          { icon: '🌻', name: 'Flowering Sunflower', sub: 'Blossoms & sweet nectar', x: centerX + 40 },
          { icon: '🌿', name: 'Vascular Fern', sub: 'Feathery forest spores', x: centerX + 200 }
        ];

        plants.forEach(p => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(p.x - 70, centerY - 55, 140, 145);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x - 70, centerY - 55, 140, 145);

          ctx.font = '42px sans-serif';
          ctx.fillText(p.icon, p.x, centerY - 10);

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(p.name, p.x, centerY + 32);

          ctx.fillStyle = '#bbf7d0';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(p.sub, p.x, centerY + 52);
        });

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🌱 Plants make sweet glucose food & clean oxygen for the entire planet! 💚', centerX, height - 25);

      } else if (k === 'fungi') {
        // ================= KINGDOM FUNGI (MUSHROOMS & YEASTS) =================
        ctx.fillText('🍄 KINGDOM FUNGI — NATURE\'S DECOMPOSERS & UNDERGROUND MYCELIUM NETWORKS!', centerX, 28);

        const fungi = [
          { icon: '🍄', name: 'Fly Agaric Mushroom', sub: 'Spore-releasing cap', x: centerX - 200 },
          { icon: '🍞', name: 'Baker\'s Yeast', sub: 'Single cell bread helper', x: centerX },
          { icon: '🧫', name: 'Penicillium Mold', sub: 'Antibiotic life-saver', x: centerX + 200 }
        ];

        fungi.forEach((f, i) => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(f.x - 75, centerY - 55, 150, 145);
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(f.x - 75, centerY - 55, 150, 145);

          ctx.font = '42px sans-serif';
          ctx.fillText(f.icon, f.x, centerY - 10);

          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(f.name, f.x, centerY + 32);

          ctx.fillStyle = '#e9d5ff';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(f.sub, f.x, centerY + 52);
        });

        // Underground Mycelium web lines
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 300, centerY + 70);
        ctx.lineTo(centerX, centerY + 80);
        ctx.lineTo(centerX + 300, centerY + 70);
        ctx.stroke();

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🍄 Underground mycelium threads connect trees and recycle nutrients back to the soil! 🍄', centerX, height - 25);

      } else if (k === 'protista') {
        // ================= KINGDOM PROTISTA (SINGLE CELLS) =================
        ctx.fillText('🦠 KINGDOM PROTISTA — SINGLE-CELLED MARVELS SWIMMING IN POND WATER DROPS!', centerX, 28);

        const protists = [
          { icon: '🦶', name: 'Amoeba proteus', sub: 'Flowing false feet (Pseudopodia)', x: centerX - 200, sy: Math.sin(t * 3) * 6 },
          { icon: '〰️', name: 'Paramecium', sub: 'Beating hair cilia motors', x: centerX, sy: Math.cos(t * 4) * 8 },
          { icon: '🌾', name: 'Euglena gracilis', sub: 'Whip-tail flagellum swimmer', x: centerX + 200, sy: Math.sin(t * 2.5) * 6 }
        ];

        protists.forEach(pr => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(pr.x - 75, centerY - 55 + pr.sy, 150, 145);
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(pr.x - 75, centerY - 55 + pr.sy, 150, 145);

          ctx.font = '40px sans-serif';
          ctx.fillText(pr.icon, pr.x, centerY - 10 + pr.sy);

          ctx.fillStyle = '#22d3ee';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(pr.name, pr.x, centerY + 32 + pr.sy);

          ctx.fillStyle = '#cffafe';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(pr.sub, pr.x, centerY + 52 + pr.sy);
        });

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🔬 A single drop of pond water holds millions of energetic hunting & swimming protists! 💧', centerX, height - 25);

      } else {
        // ================= KINGDOM MONERA (BACTERIA & ARCHAEA) =================
        ctx.fillText('🧫 KINGDOM MONERA — ANCIENT BACTERIA & EXTREMOPHILE ARCHAEA!', centerX, 28);

        const monera = [
          { icon: '🥛', name: 'Lactobacillus', sub: 'Probiotic yogurt bacteria', x: centerX - 200 },
          { icon: '🌊', name: 'Cyanobacteria', sub: 'Created Earth\'s first O₂', x: centerX },
          { icon: '🌋', name: 'Deep-Sea Archaea', sub: '120°C boiling vent survivor', x: centerX + 200 }
        ];

        monera.forEach((m, idx) => {
          const rot = t * 2 + idx;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.fillRect(m.x - 75, centerY - 55, 150, 145);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(m.x - 75, centerY - 55, 150, 145);

          ctx.font = '40px sans-serif';
          ctx.fillText(m.icon, m.x, centerY - 10);

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(m.name, m.x, centerY + 32);

          ctx.fillStyle = '#fef3c7';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(m.sub, m.x, centerY + 52);
        });

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('⚡ Bacteria are the most ancient and abundant living cells on Earth! 🌍', centerX, height - 25);
      }

      this.state.animFrame = requestAnimationFrame(draw);
    };

    draw();
  },

  destroy() {
    if (this._stepAdvanceTimeout) clearTimeout(this._stepAdvanceTimeout);
    if (this.state.animFrame) cancelAnimationFrame(this.state.animFrame);
    if (window.drHelix) window.drHelix.stop();
  }
};

