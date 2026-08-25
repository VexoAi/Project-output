// Topic 5: Photosynthesis - 2D Animated Process Video
window.bioTopics = window.bioTopics || {};

window.bioTopics.photosynthesis = {
  id: 'photosynthesis',
  title: 'Photosynthesis',
  icon: '🌱',
  badgeName: 'Botanist Master',
  summary: 'Photosynthesis allows green plants to make glucose using light energy, carbon dioxide, and water: Carbon dioxide + Water + Light energy ➔ Glucose + Oxygen.',

  processSteps: [
    {
      num: 1,
      name: 'Sunlight Reaching the Green Leaf',
      tag: 'Solar Energy',
      formula: 'Sunlight ➔ Chlorophyll Pigments',
      desc: 'Sunlight shines down on green leaves, where chlorophyll pigments in chloroplasts capture light energy.'
    },
    {
      num: 2,
      name: 'Roots Absorbing Water from Soil',
      tag: 'Water Uptake',
      formula: 'Soil Water ➔ Roots ➔ Xylem ➔ Leaves',
      desc: 'Plant roots absorb water and minerals from the soil, transporting water up through the stem into leaf cells.'
    },
    {
      num: 3,
      name: 'Carbon Dioxide Entering Leaf Stomata',
      tag: 'CO₂ Absorption',
      formula: 'Atmospheric CO₂ ➔ Leaf Stomata Pores',
      desc: 'Carbon dioxide gas from the air enters through tiny microscopic openings on the leaf surface called stomata.'
    },
    {
      num: 4,
      name: 'Glucose Sugar Production in Chloroplasts',
      tag: 'Food Production',
      formula: 'CO₂ + H₂O + Light ➔ Glucose (C₆H₁₂O₆)',
      desc: 'Inside the chloroplasts, light energy, water, and carbon dioxide are transformed into glucose sugar used as plant food and energy.'
    },
    {
      num: 5,
      name: 'Oxygen Released into the Atmosphere',
      tag: 'Oxygen Evolution',
      formula: 'Oxygen (O₂) Released for All Life to Breathe',
      desc: 'Pure oxygen is released into the air as a vital byproduct, supporting respiration for humans and animals across Earth!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    o2Bubbles: [],
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
        <canvas id="photo-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="photo-timeline-track">
          <div class="cinema-timeline-fill" id="photo-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="photo-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="photo-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="photo-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>
    `;

    this.initO2Bubbles();
    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  initO2Bubbles() {
    this.state.o2Bubbles = [];
    for (let i = 0; i < 35; i++) {
      this.state.o2Bubbles.push({
        x: 280 + Math.random() * 400,
        y: 150 + Math.random() * 150,
        r: 3.5 + Math.random() * 4.5,
        vy: 1 + Math.random() * 1.8
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

    const fill = document.getElementById('photo-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('photo-subtitle-chip');
    const title = document.getElementById('photo-subtitle-title');
    const desc = document.getElementById('photo-subtitle-desc');
    if (chip) chip.textContent = `🌱 Step ${step.num}/5`;
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
    const canvas = document.getElementById('photo-canvas');
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
      }

      // Background ambient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 460);
      if (step === 0) bgGrad.addColorStop(0, 'rgba(250, 204, 21, 0.18)'); // Yellow Sun
      else if (step === 1) bgGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)'); // Blue Water
      else if (step === 2) bgGrad.addColorStop(0, 'rgba(168, 85, 247, 0.18)'); // Purple CO2
      else if (step === 3) bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)'); // Golden Sugar/Honey
      else bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.18)'); // Fresh Green O2

      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Title Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.textAlign = 'center';

      if (step === 0) {
        // ================= STEP 1: SUNLIGHT SOLAR ENERGY =================
        ctx.fillText('☀️ STEP 1: SUNSHINE POWER — THE LEAF TRAPS GOLDEN SUNBEAMS!', centerX, 28);

        // Big Smiling Sun on the Left
        const sunX = 140;
        const sunY = 160;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 55, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Sun Face
        ctx.font = '45px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('☀️', sunX, sunY + 16);

        // Animated Golden Beams shooting across
        for (let b = 0; b < 7; b++) {
          const rayY = 110 + b * 22;
          const beamLen = 220 + Math.sin(t * 5 + b) * 30;
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(sunX + 65, rayY);
          ctx.lineTo(sunX + 65 + beamLen, rayY + 30);
          ctx.stroke();
        }

        // Giant Green Leaf on the Right with Chlorophyll Solar Panels
        const leafX = centerX + 170;
        const leafY = centerY + 15;
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 180, 110, Math.PI * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🌱 GREEN CHLOROPHYLL TRAPS SUNBEAMS!', leafX, leafY);
        ctx.fillStyle = '#bbf7d0';
        ctx.font = '11px Outfit, sans-serif';
        ctx.fillText('(Like tiny solar panels on every leaf!)', leafX, leafY + 24);

      } else if (step === 1) {
        // ================= STEP 2: ROOTS DRINKING WATER (H2O) =================
        ctx.fillText('💧 STEP 2: THIRSTY ROOTS — DRINKING WATER FROM SOIL LIKE STRAWS!', centerX, 28);

        // Soil ground line
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, centerY + 50, width, height - (centerY + 50));
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, centerY + 50);
        ctx.lineTo(width, centerY + 50);
        ctx.stroke();

        // Glowing Green Stem (Straw Pipe)
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(centerX - 18, 50, 36, centerY);
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(centerX - 18, 50, 36, centerY);

        // Root branches spreading in soil
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX - 120, centerY + 130);
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX, centerY + 140);
        ctx.moveTo(centerX, centerY + 50);
        ctx.lineTo(centerX + 120, centerY + 130);
        ctx.stroke();

        // Water Drops climbing up the stem straw
        for (let d = 0; d < 8; d++) {
          const dy = (centerY + 40) - ((t * 70 + d * 30) % 200);
          ctx.beginPath();
          ctx.arc(centerX, dy, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('H₂O', centerX, dy + 3);
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('💧 Water climbs up the Plant Pipe (Xylem) to the thirsty leaves! ⬆️', centerX, 60);

      } else if (step === 2) {
        // ================= STEP 3: BREATHING IN CARBON DIOXIDE (CO2) =================
        ctx.fillText('💨 STEP 3: LEAF DOORS (STOMATA) — OPENING TO BREATHE IN FRESH AIR!', centerX, 28);

        // Giant Microscopic Leaf Door (Stomata)
        const stomataX = centerX;
        const stomataY = centerY + 15;

        // Left Guard Cell
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(stomataX - 45, stomataY, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Right Guard Cell
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(stomataX + 45, stomataY, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Central Stomata Pore (Mouth)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(stomataX, stomataY, 20 + Math.sin(t * 3) * 6, 60, 0, 0, Math.PI * 2);
        ctx.fill();

        // Animated CO2 purple bubbles flying into the open pore
        for (let c = 0; c < 8; c++) {
          const cx = stomataX - 250 + ((t * 60 + c * 40) % 250);
          const cy = stomataY - 50 + Math.sin(c + t * 2) * 35;
          ctx.beginPath();
          ctx.arc(cx, cy, 12, 0, Math.PI * 2);
          ctx.fillStyle = '#a855f7';
          ctx.fill();
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('CO₂', cx, cy + 3);
        }

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('👄 The Stomata Pore acts like tiny plant nostrils breathing in CO₂ from the sky!', centerX, height - 35);

      } else if (step === 3) {
        // ================= STEP 4: MAKING SWEET GLUCOSE SUGAR (PLANT CANDY) =================
        ctx.fillText('🍯 STEP 4: THE PLANT KITCHEN — BAKING SWEET GLUCOSE SUGAR (PLANT CANDY)!', centerX, 28);

        // Chloroplast Kitchen Pan in Center
        ctx.fillStyle = 'rgba(22, 101, 52, 0.9)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 10, 240, 110, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Mixing Ingredients Banner
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🍳 ☀️ SUNLIGHT + 💧 WATER + 💨 AIR  ➔  🍯 SWEET GLUCOSE SUGAR!', centerX, centerY - 45);

        // Glowing golden Glucose sugar cubes bouncing
        const sugarCubes = [
          { x: centerX - 120, y: centerY + 15, name: 'Glucose (C₆H₁₂O₆)' },
          { x: centerX, y: centerY + 25, name: 'Sweet Plant Energy' },
          { x: centerX + 120, y: centerY + 15, name: 'Makes Fruits Sweet! 🍎' }
        ];

        sugarCubes.forEach((s, idx) => {
          const sy = s.y + Math.sin(t * 4 + idx) * 8;
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(s.x - 45, sy - 20, 90, 40);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(s.x - 45, sy - 20, 90, 40);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px Outfit, sans-serif';
          ctx.fillText(s.name, s.x, sy + 4);
        });

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('🍓 This sweet sugar helps plants grow tall, make yummy apples, and blossom into flowers!', centerX, height - 35);

      } else {
        // ================= STEP 5: RELEASING CLEAN OXYGEN (O2) FOR EVERYONE =================
        ctx.fillText('🌍 STEP 5: FRESH OXYGEN (O₂) — CLEAN FRESH AIR FOR KIDS & ANIMALS TO BREATHE!', centerX, 28);

        // Animated giant floating Oxygen bubbles
        for (let o = 0; o < 10; o++) {
          const ox = centerX - 300 + o * 65;
          const oy = (centerY + 70) - ((t * 50 + o * 30) % 180);
          ctx.beginPath();
          ctx.arc(ox, oy, 16, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('O₂', ox, oy + 4);
        }

        // Happy Kid & Bunny breathing fresh air
        ctx.font = '48px sans-serif';
        ctx.fillText('👧', centerX - 180, centerY + 80);
        ctx.fillText('👦', centerX, centerY + 80);
        ctx.fillText('🐰', centerX + 180, centerY + 80);

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('🌳 Plants give us pure Oxygen to breathe every single day! Thank you, green plants! 💚', centerX, height - 25);
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
