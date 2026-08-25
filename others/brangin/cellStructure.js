// Topic 6: Cell Structure - 2D Animated Process Video
window.bioTopics = window.bioTopics || {};

window.bioTopics.cellStructure = {
  id: 'cellStructure',
  title: 'Cell Structure',
  icon: '🔬',
  badgeName: 'Cytologist Master',
  summary: 'The cell is the basic structural and functional unit of life containing the cell membrane, cytoplasm, nucleus, mitochondria, ribosomes, and plant cell wall/chloroplast/vacuole.',

  processSteps: [
    {
      num: 1,
      name: 'Cell Membrane & Cytoplasm',
      tag: 'Cell Boundary',
      formula: 'Cell Membrane (Gate) | Cytoplasm (Fluid Matrix)',
      desc: 'The cell is the basic unit of life. The cell membrane controls what enters and exits the cell, while cytoplasm supports organelles.'
    },
    {
      num: 2,
      name: 'The Nucleus (Control Center)',
      tag: 'Genomic Command',
      formula: 'Nucleus ➔ Genetic Material (DNA)',
      desc: 'The nucleus contains most of the cell\'s genetic material (DNA) and directs all cellular activities, growth, and reproduction.'
    },
    {
      num: 3,
      name: 'Mitochondria (Energy Powerhouses)',
      tag: 'Power Plant',
      formula: 'Nutrients + O₂ ➔ Usable ATP Energy',
      desc: 'Mitochondria release usable chemical energy (ATP) from digested food to power all cellular functions and movement.'
    },
    {
      num: 4,
      name: 'Ribosomes (Protein Builders)',
      tag: 'Protein Synthesis',
      formula: 'Amino Acids ➔ Essential Proteins',
      desc: 'Ribosomes are microscopic cellular factories that assemble proteins needed for cell repair, enzymes, and tissue building.'
    },
    {
      num: 5,
      name: 'Plant Cell: Wall, Chloroplast & Vacuole',
      tag: 'Plant Specializations',
      formula: 'Cell Wall (Structure) | Chloroplast (Solar) | Vacuole (Storage)',
      desc: 'Plant cells have rigid protective cell walls, green chloroplasts for photosynthesis, and a large central vacuole storing water and nutrients!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    vesicles: [],
    animFrame: null
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
        <span class="cinema-live-tag">
          <span class="live-pulse-dot"></span>
          🔴 LIVE PROCESS VIDEO • 60 FPS
        </span>
      </div>

      <div class="cinema-canvas-wrap">
        <canvas id="cell-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="cell-timeline-track">
          <div class="cinema-timeline-fill" id="cell-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="cell-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="cell-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="cell-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>
    `;

    this.initVesicles();
    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  initVesicles() {
    this.state.vesicles = [];
    for (let i = 0; i < 25; i++) {
      this.state.vesicles.push({
        x: 320 + Math.random() * 360,
        y: 140 + Math.random() * 140,
        vx: 1 + Math.random() * 1.5,
        vy: (Math.random() - 0.5) * 1
      });
    }
  },

  seekStep(idx, speak = false) {
    if (this._stepAdvanceTimeout) {
      clearTimeout(this._stepAdvanceTimeout);
      this._stepAdvanceTimeout = null;
    }

    this.state.currentStep = Math.max(0, Math.min(idx, this.processSteps.length - 1));
    const step = this.processSteps[this.state.currentStep];

    document.querySelectorAll('.cinema-step-btn').forEach((b, i) => {
      b.classList.toggle('active', i === this.state.currentStep);
      b.classList.toggle('completed', i < this.state.currentStep);
    });

    const fill = document.getElementById('cell-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('cell-subtitle-chip');
    const title = document.getElementById('cell-subtitle-title');
    const desc = document.getElementById('cell-subtitle-desc');
    if (chip) chip.textContent = `🔬 Step ${step.num}/5`;
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
  },

  initCanvas() {
    const canvas = document.getElementById('cell-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const step = this.state.currentStep;

      if (this.state.isPlaying) {
        t += 0.025 * this.state.speed;
      }

      // Background ambient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 420);
      bgGrad.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Title Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      if (step === 0) ctx.fillText('🛡️ STEP 1: CELL MEMBRANE (SELECTIVE GATE) & CYTOPLASM MATRIX', centerX, 30);
      else if (step === 1) ctx.fillText('👑 STEP 2: THE NUCLEUS • MASTER GENETIC CONTROL CENTER (DNA)', centerX, 30);
      else if (step === 2) ctx.fillText('⚡ STEP 3: MITOCHONDRIA • CELLULAR RESPIRATION & ATP POWER PLANT', centerX, 30);
      else if (step === 3) ctx.fillText('🏭 STEP 4: RIBOSOMES • PROTEIN FACTORIES & ENZYME BUILDERS', centerX, 30);
      else if (step === 4) ctx.fillText('🌿 STEP 5: PLANT CELL • RIGID CELL WALL, CHLOROPLAST & VACUOLE', centerX, 30);

      // Plasma Membrane Outer Boundary
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * 0.44, height * 0.44, 0, 0, Math.PI * 2);
      ctx.fillStyle = (step === 4) ? 'rgba(6, 78, 59, 0.45)' : 'rgba(30, 41, 59, 0.7)';
      ctx.fill();
      ctx.strokeStyle = (step === 0) ? '#38bdf8' : (step === 4 ? '#22c55e' : '#64748b');
      ctx.lineWidth = (step === 0 || step === 4) ? 6 : 3.5;
      ctx.stroke();

      // 1. Nucleus (Left)
      ctx.beginPath();
      ctx.arc(centerX - 210, centerY, 70, 0, Math.PI * 2);
      ctx.fillStyle = (step === 1) ? 'rgba(244, 63, 94, 0.95)' : 'rgba(225, 29, 72, 0.65)';
      ctx.fill();
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = (step === 1) ? 4.5 : 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NUCLEUS', centerX - 210, centerY - 8);
      ctx.font = 'bold 10px monospace';
      ctx.fillText('DNA BLUEPRINT', centerX - 210, centerY + 12);

      // 2. Rough ER & Ribosomes
      ctx.strokeStyle = (step === 3) ? '#fbbf24' : '#a855f7';
      ctx.lineWidth = (step === 3) ? 7 : 4;
      ctx.beginPath();
      ctx.arc(centerX - 100, centerY, 55, -Math.PI / 2, Math.PI / 2);
      ctx.arc(centerX - 75, centerY, 60, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.fillStyle = (step === 3) ? '#facc15' : '#c084fc';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText('RIBOSOMES (PROTEIN BUILDERS)', centerX - 90, centerY + 75);

      // 3. Mitochondria
      const drawMito = (mx, my) => {
        ctx.beginPath();
        ctx.ellipse(mx, my, 52, 26, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = (step === 2) ? 'rgba(239, 68, 68, 1)' : 'rgba(185, 28, 28, 0.7)';
        ctx.fill();
        ctx.strokeStyle = (step === 2) ? '#fef08a' : '#fca5a5';
        ctx.lineWidth = (step === 2) ? 4 : 2;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.fillText('MITOCHONDRIA (ATP)', mx, my + 4);
      };
      drawMito(centerX + 220, centerY - 80);
      drawMito(centerX + 200, centerY + 80);

      // 4. Plant Cell Specializations (Cell Wall, Vacuole & Chloroplast)
      if (step === 4) {
        // Central Vacuole
        ctx.beginPath();
        ctx.ellipse(centerX + 30, centerY, 80, 55, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('CENTRAL VACUOLE (WATER)', centerX + 30, centerY);

        // Chloroplast Organelle
        ctx.beginPath();
        ctx.ellipse(centerX - 90, centerY - 90, 42, 22, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#6ee7b7';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px Outfit, sans-serif';
        ctx.fillText('CHLOROPLAST', centerX - 90, centerY - 90);
      }

      // 5. Secretory Vesicles
      this.state.vesicles.forEach(v => {
        if (this.state.isPlaying) {
          v.x += v.vx * this.state.speed;
          if (v.x > width - 150) v.x = centerX - 50;
        }

        ctx.beginPath();
        ctx.arc(v.x, v.y, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      });

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
