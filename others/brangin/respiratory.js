// Topic 3: Respiratory System - 2D Animated Process Video
window.bioTopics = window.bioTopics || {};

window.bioTopics.respiratory = {
  id: 'respiratory',
  title: 'Respiratory System',
  icon: '🫁',
  badgeName: 'Pulmonologist Master',
  summary: 'The respiratory system brings oxygen into the body and removes carbon dioxide via the nose, trachea, bronchi, alveoli, and diaphragm.',

  processSteps: [
    {
      num: 1,
      name: 'Inhalation (Nose & Mouth Entry)',
      tag: 'Air Intake',
      formula: 'Oxygen ➔ Nose/Mouth ➔ Pharynx',
      desc: 'Air is inhaled through the nose or mouth, where it is warmed, humidified, and filtered by ciliated mucus membranes.'
    },
    {
      num: 2,
      name: 'Trachea & Bronchi Branching',
      tag: 'Airway Conduction',
      formula: 'Trachea ➔ Bronchi ➔ Lungs',
      desc: 'Air travels down the windpipe (trachea) and branches through the left and right bronchi deep into the lungs.'
    },
    {
      num: 3,
      name: 'Zoom into Tiny Alveoli Air Sacs',
      tag: 'Alveoli Sacs',
      formula: '300 Million Alveoli Sacs',
      desc: 'Inside the lungs are 300 million microscopic air sacs called alveoli, creating a massive surface area for gas exchange.'
    },
    {
      num: 4,
      name: 'Oxygen & Carbon Dioxide Gas Exchange',
      tag: 'Gas Exchange',
      formula: 'Oxygen ➔ Blood | Carbon Dioxide ➔ Alveoli',
      desc: 'Oxygen moves from alveoli into the blood capillaries, while carbon dioxide moves from blood into the alveoli.'
    },
    {
      num: 5,
      name: 'Exhalation & Diaphragm Action',
      tag: 'Exhalation Expulsion',
      formula: 'Carbon Dioxide ➔ Outside Atmosphere',
      desc: 'The diaphragm muscle relaxes, contracting lung volume and expelling carbon dioxide out of the body into the atmosphere.'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    breathPhase: 0.5,
    videoType: 'macro', // 'macro' | 'micro'
    airParticles: [],
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
        <div style="display:flex; align-items:center; gap:10px;">
          <!-- Video Type Mode Switcher -->
          <div class="video-type-switcher" style="display:flex; background:rgba(15,23,42,0.8); border:1px solid rgba(56,189,248,0.3); border-radius:20px; padding:3px; gap:4px;">
            <button class="video-btn ${this.state.videoType === 'macro' ? 'active' : ''}" id="btn-type-resp-macro" style="padding:4px 12px; font-size:11px; border-radius:16px;">🫁 Macro Thorax View</button>
            <button class="video-btn ${this.state.videoType === 'micro' ? 'active' : ''}" id="btn-type-resp-micro" style="padding:4px 12px; font-size:11px; border-radius:16px;">🔬 Micro Alveoli Chamber</button>
          </div>
          <span class="cinema-live-tag">
            <span class="live-pulse-dot"></span>
            🔴 LIVE PROCESS VIDEO • 60 FPS
          </span>
        </div>
      </div>

      <div class="cinema-canvas-wrap">
        <canvas id="lungs-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="resp-timeline-track">
          <div class="cinema-timeline-fill" id="resp-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="resp-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="resp-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="resp-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>
    `;

    this.initAirParticles();
    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  initAirParticles() {
    this.state.airParticles = [];
    for (let i = 0; i < 70; i++) {
      this.state.airParticles.push({
        x: 480 + (Math.random() - 0.5) * 120,
        y: 20 + Math.random() * 260,
        vy: 1.8 + Math.random() * 2.5,
        isO2: Math.random() > 0.45
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

    // Automatically switch video type to micro for alveoli steps
    if (this.state.currentStep === 2 || this.state.currentStep === 3) {
      this.state.videoType = 'micro';
    } else {
      this.state.videoType = 'macro';
    }
    this.updateVideoTypeButtons();

    document.querySelectorAll('.cinema-step-btn').forEach((b, i) => {
      b.classList.toggle('active', i === this.state.currentStep);
      b.classList.toggle('completed', i < this.state.currentStep);
    });

    const fill = document.getElementById('resp-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('resp-subtitle-chip');
    const title = document.getElementById('resp-subtitle-title');
    const desc = document.getElementById('resp-subtitle-desc');
    if (chip) chip.textContent = `🫁 Step ${step.num}/5`;
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

  updateVideoTypeButtons() {
    const macroBtn = document.getElementById('btn-type-resp-macro');
    const microBtn = document.getElementById('btn-type-resp-micro');
    if (macroBtn) macroBtn.classList.toggle('active', this.state.videoType === 'macro');
    if (microBtn) microBtn.classList.toggle('active', this.state.videoType === 'micro');
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
    const macroBtn = document.getElementById('btn-type-resp-macro');
    if (macroBtn) {
      macroBtn.addEventListener('click', () => {
        this.state.videoType = 'macro';
        this.updateVideoTypeButtons();
      });
    }

    const microBtn = document.getElementById('btn-type-resp-micro');
    if (microBtn) {
      microBtn.addEventListener('click', () => {
        this.state.videoType = 'micro';
        this.updateVideoTypeButtons();
      });
    }

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
    const canvas = document.getElementById('lungs-canvas');
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
        t += 0.03 * this.state.speed;
        this.state.breathPhase = (Math.sin(t) + 1) / 2;
      }

      const p = this.state.breathPhase;
      const lungExpansion = 1 + p * 0.28;
      const diaphragmY = 320 + (p * 45);

      // Background ambient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 440);
      bgGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Title Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      if (step === 0) ctx.fillText('👃 STEP 1: NASAL INHALATION • AIR WARMED & FILTERED BY CILIA', centerX, 26);
      else if (step === 1) ctx.fillText('🫁 STEP 2: TRACHEA & BRONCHI BRANCHING DEEP INTO LOBES', centerX, 26);
      else if (step === 2) ctx.fillText('🔬 STEP 3: 300 MILLION MICROSCOPIC ALVEOLI AIR SACS', centerX, 26);
      else if (step === 3) ctx.fillText('🔄 STEP 4: GAS DIFFUSION • OXYGEN INTO BLOOD / CO₂ INTO ALVEOLI', centerX, 26);
      else if (step === 4) ctx.fillText('💨 STEP 5: DIAPHRAGM RELAXATION & EXHALATION OF CO₂', centerX, 26);

      if (this.state.videoType === 'macro') {
        // ================= MACRO THORACIC AIRFLOW VIEW =================
        // Transparent Ribcage Silhouette
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 4;
        for (let r = 0; r < 5; r++) {
          const ry = 140 + r * 35;
          ctx.beginPath();
          ctx.ellipse(centerX, ry, 260 + r * 15, 30, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Trachea with Cartilage Rings
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(centerX - 16, 45, 32, 100);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        for (let y = 55; y < 145; y += 12) {
          ctx.beginPath();
          ctx.moveTo(centerX - 16, y);
          ctx.lineTo(centerX + 16, y);
          ctx.stroke();
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('TRACHEA', centerX, 40);

        // Left Lung Lobe
        ctx.save();
        ctx.translate(centerX - 130, 215);
        ctx.scale(lungExpansion, lungExpansion);
        ctx.beginPath();
        ctx.ellipse(0, 0, 85, 105, -0.22, 0, Math.PI * 2);
        ctx.fillStyle = p > 0.5 ? 'rgba(248, 113, 113, 0.95)' : 'rgba(239, 68, 68, 0.65)';
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('LEFT LUNG', 0, 10);
        ctx.restore();

        // Right Lung Lobe (3 Lobes)
        ctx.save();
        ctx.translate(centerX + 130, 215);
        ctx.scale(lungExpansion, lungExpansion);
        ctx.beginPath();
        ctx.ellipse(0, 0, 85, 105, 0.22, 0, Math.PI * 2);
        ctx.fillStyle = p > 0.5 ? 'rgba(248, 113, 113, 0.95)' : 'rgba(239, 68, 68, 0.65)';
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('RIGHT LUNG', 0, 10);
        ctx.restore();

        // Branching Bronchial Trees
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX, 145);
        ctx.lineTo(centerX - 110, 210);
        ctx.lineTo(centerX - 150, 250);
        ctx.moveTo(centerX - 110, 210);
        ctx.lineTo(centerX - 80, 260);

        ctx.moveTo(centerX, 145);
        ctx.lineTo(centerX + 110, 210);
        ctx.lineTo(centerX + 150, 250);
        ctx.moveTo(centerX + 110, 210);
        ctx.lineTo(centerX + 80, 260);
        ctx.stroke();

        // Diaphragm Muscle
        ctx.beginPath();
        ctx.moveTo(centerX - 280, 365);
        ctx.quadraticCurveTo(centerX, diaphragmY, centerX + 280, 365);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 12;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText(`DIAPHRAGM MUSCLE (${p > 0.5 ? '⬇ CONTRACTS (INHALE)' : '⬆ RELAXES (EXHALE)'})`, centerX, diaphragmY + 28);

        // Airflow particles
        this.state.airParticles.forEach(pt => {
          if (this.state.isPlaying) {
            if (p > 0.5) {
              pt.y += pt.vy * this.state.speed * 2.2;
              if (pt.y > 310) pt.y = 40;
            } else {
              pt.y -= pt.vy * this.state.speed * 2.2;
              if (pt.y < 40) pt.y = 310;
            }
          }

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = pt.isO2 ? '#38bdf8' : '#f59e0b';
          ctx.fill();
        });

        // Live Spirometry HUD Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(30, 60, 200, 75);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(30, 60, 200, 75);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📊 SPIROMETRY LIVE HUD', 42, 80);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px monospace';
        ctx.fillText(`Tidal Vol: ${(400 + p * 150).toFixed(0)} mL`, 42, 100);
        ctx.fillText('SpO₂ Sat: 99% Oxygen', 42, 118);

      } else {
        // ================= MICRO ALVEOLI DIFFUSION CHAMBER =================
        // Alveolar Sac Cluster
        const alvX = centerX - 130;
        const alvY = centerY + 10;

        ctx.beginPath();
        ctx.arc(alvX, alvY, 125, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ALVEOLAR AIR SAC', alvX, alvY - 40);
        ctx.font = '11px monospace';
        ctx.fillText('pO₂ = 104 mmHg | pCO₂ = 40 mmHg', alvX, alvY - 18);

        // Surrounding Capillary Blood Vessel (Blue ➔ Red)
        const capX = centerX + 180;
        ctx.beginPath();
        ctx.arc(capX, centerY + 10, 110, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('PULMONARY CAPILLARY', capX, centerY - 40);

        // Animated O2 diffusing into Capillary
        for (let o = 0; o < 8; o++) {
          const progress = ((t * 0.8 + o * 0.125) % 1);
          const ox = alvX + 40 + progress * 160;
          const oy = alvY - 15 + Math.sin(o + t * 2) * 20;

          ctx.beginPath();
          ctx.arc(ox, oy, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('O₂', ox, oy + 3);
        }

        // Animated CO2 diffusing out of Capillary into Alveolus
        for (let c = 0; c < 8; c++) {
          const progress = ((t * 0.8 + c * 0.125) % 1);
          const cx = capX - 40 - progress * 160;
          const cy = alvY + 40 + Math.sin(c + t * 2) * 20;

          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('CO₂', cx, cy + 3);
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('🟦 Oxygen (O₂) diffuses down pressure gradient into Red Blood Cells ➔', centerX, height - 55);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('🟧 Carbon Dioxide (CO₂) diffuses out into Alveolus for exhalation ➔', centerX, height - 35);
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
