// Topic 10: Ecosystem & Food Chain - 2D Animated Process Video & Trophic Simulator
window.bioTopics = window.bioTopics || {};

window.bioTopics.ecosystem = {
  id: 'ecosystem',
  title: 'Ecosystem & Food Chain',
  icon: '🌍',
  badgeName: 'Ecologist Master',
  summary: 'An ecosystem consists of living organisms interacting with one another and with their physical environment through food chains and food webs.',

  processSteps: [
    {
      num: 1,
      name: 'Producers: Plants Making Food',
      tag: 'Primary Producers',
      formula: 'Sunlight ➔ Green Plants (Producers)',
      desc: 'An ecosystem includes living organisms and their environment. Green plants are producers because they make their own food through photosynthesis.'
    },
    {
      num: 2,
      name: 'Primary Consumers (Herbivores)',
      tag: 'Herbivore Feeders',
      formula: 'Plants (Grass) ➔ Primary Consumer (Grasshopper)',
      desc: 'Primary consumers are animals that eat green plants to obtain chemical energy for movement, growth, and living.'
    },
    {
      num: 3,
      name: 'Secondary & Higher Consumers',
      tag: 'Predator Flow',
      formula: 'Grasshopper ➔ Frog ➔ Snake ➔ Eagle',
      desc: 'Secondary and tertiary consumers eat other animals, passing energy up higher levels of the ecological food chain.'
    },
    {
      num: 4,
      name: 'Decomposers (Fungi & Bacteria)',
      tag: 'Nutrient Recyclers',
      formula: 'Dead Organic Matter ➔ Soil Nutrients',
      desc: 'Decomposers such as fungi and soil bacteria break down dead organic matter, recycling vital nutrients back into the soil.'
    },
    {
      num: 5,
      name: 'Food Chains & The Living Food Web',
      tag: 'Ecosystem Balance',
      formula: 'Grass ➔ Grasshopper ➔ Frog ➔ Snake ➔ Eagle',
      desc: 'Interconnected food chains form a food web. Changes to one species can affect all other organisms in the ecosystem!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    animFrame: null
  },

  render(container) {
    container.innerHTML = `
      <div id="cinema-player-root" class="cinema-player-root">
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
          <canvas id="eco-canvas" width="960" height="420"></canvas>
        </div>

        <div class="cinema-controls-bar">
          <div class="cinema-timeline-track" id="eco-timeline-track">
            <div class="cinema-timeline-fill" id="eco-timeline-fill" style="width: 20%;"></div>
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
          <div class="subtitles-step-chip" id="eco-subtitle-chip">
            <span>Step 1/5</span>
          </div>
          <div class="subtitles-text-content">
            <div class="subtitles-step-title" id="eco-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
            <div class="subtitles-step-desc" id="eco-subtitle-desc">${this.processSteps[0].desc}</div>
          </div>
        </div>

        <!-- Ecological Disaster & Event Trigger -->
        <div class="lab-panel" style="margin-top: 14px;">
          <div class="panel-header">
            <h3><span class="pulse-icon">⚡</span> Ecological Sandbox Event Triggers</h3>
            <div class="lab-actions">
              <button class="video-btn" id="btn-trigger-drought" style="background:rgba(245,158,11,0.2); border-color:#f59e0b;">☀️ Trigger Drought</button>
              <button class="video-btn" id="btn-trigger-wolves" style="background:rgba(16,185,129,0.2); border-color:#10b981;">🐺 Add Apex Wolves</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
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

    const fill = document.getElementById('eco-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('eco-subtitle-chip');
    const title = document.getElementById('eco-subtitle-title');
    const desc = document.getElementById('eco-subtitle-desc');
    if (chip) chip.textContent = `🌍 Step ${step.num}/5`;
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

    const droughtBtn = document.getElementById('btn-trigger-drought');
    if (droughtBtn) {
      droughtBtn.addEventListener('click', () => {
        if (window.drHelix) window.drHelix.say("Drought triggered! Plant biomass drops by 60%, reducing primary producer energy across the trophic pyramid.", 'worried', true);
      });
    }

    const wolvesBtn = document.getElementById('btn-trigger-wolves');
    if (wolvesBtn) {
      wolvesBtn.addEventListener('click', () => {
        if (window.drHelix) window.drHelix.say("Apex predator wolves introduced! Top-down trophic cascade reduces overgrazing, allowing forest vegetation to recover.", 'excited', true);
      });
    }
  },

  initCanvas() {
    const canvas = document.getElementById('eco-canvas');
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

      // Background
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 440);
      bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Title Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      if (step === 0) ctx.fillText('🌾 STEP 1: PRIMARY PRODUCERS • SOLAR ENERGY CONVERTED TO PLANT BIOMASS (10,000 J)', centerX, 24);
      else if (step === 1) ctx.fillText('🐇 STEP 2: PRIMARY CONSUMERS (HERBIVORES) • CONSUMING GREEN PLANTS (1,000 J)', centerX, 24);
      else if (step === 2) ctx.fillText('🦊 STEP 3: SECONDARY CONSUMERS (CARNIVORES) • ENERGY TRANSFER (100 J)', centerX, 24);
      else if (step === 3) ctx.fillText('🦅 STEP 4: APEX PREDATORS • TOP-DOWN TROPHIC CASCADE REGULATION (10 J)', centerX, 24);
      else if (step === 4) ctx.fillText('🍄 STEP 5: DECOMPOSERS & FUNGI • NUTRIENT RECYCLING & FOOD WEB BALANCE', centerX, 24);

      // Trophic Pyramid Tiers
      const tiers = [
        { label: 'APEX PREDATORS (10 J)', icon: '🦅', y: 55, w: 180, h: 46, col: step === 3 ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0.55)' },
        { label: 'SECONDARY CONSUMERS (100 J)', icon: '🦊', y: 110, w: 320, h: 46, col: step === 2 ? 'rgba(245, 158, 11, 1)' : 'rgba(245, 158, 11, 0.55)' },
        { label: 'PRIMARY CONSUMERS (1,000 J)', icon: '🐇', y: 165, w: 480, h: 46, col: step === 1 ? 'rgba(56, 189, 248, 1)' : 'rgba(56, 189, 248, 0.55)' },
        { label: 'PRIMARY PRODUCERS (10,000 J)', icon: '🌾', y: 220, w: 660, h: 46, col: step === 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 0.55)' }
      ];

      tiers.forEach(tr => {
        ctx.fillStyle = tr.col;
        ctx.fillRect(centerX - tr.w / 2, tr.y, tr.w, tr.h);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(centerX - tr.w / 2, tr.y, tr.w, tr.h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${tr.icon} ${tr.label}`, centerX, tr.y + 28);
      });

      // Decomposers Floor (Bottom)
      ctx.fillStyle = step === 4 ? 'rgba(168, 85, 247, 0.95)' : 'rgba(147, 51, 234, 0.5)';
      ctx.fillRect(centerX - 350, 280, 700, 42);
      ctx.strokeStyle = (step === 4) ? '#fef08a' : '#c084fc';
      ctx.lineWidth = (step === 4) ? 3 : 1.5;
      ctx.strokeRect(centerX - 350, 280, 700, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillText('🍄 DECOMPOSERS & FUNGI (RECYCLES NUTRIENTS TO SOIL)', centerX, 306);

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
