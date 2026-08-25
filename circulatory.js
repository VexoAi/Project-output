// Topic 2: Circulatory System - 2D Animated Process Video
window.bioTopics = window.bioTopics || {};

window.bioTopics.circulatory = {
  id: 'circulatory',
  title: 'Human Circulatory System',
  icon: '🫀',
  badgeName: 'Cardiologist Master',
  summary: 'The circulatory system transports oxygen, nutrients, hormones, and wastes around the body via the heart, blood vessels, and red blood cells.',

  processSteps: [
    {
      num: 1,
      name: 'The 4-Chambered Heart Pump',
      tag: 'Heart Anatomy',
      formula: 'Right & Left Atria | Right & Left Ventricles',
      desc: 'The heart acts as a central pump containing four chambers: Right Atrium, Right Ventricle, Left Atrium, and Left Ventricle.'
    },
    {
      num: 2,
      name: 'Blood Entering Right Side of Heart',
      tag: 'Venous Return',
      formula: 'Veins (Vena Cava) ➔ Right Atrium ➔ Right Ventricle',
      desc: 'Deoxygenated blood returns from body tissues through veins into the right atrium, which moves it into the right ventricle.'
    },
    {
      num: 3,
      name: 'Blood Traveling to Lungs for Oxygen',
      tag: 'Pulmonary Oxygenation',
      formula: 'Right Ventricle ➔ Pulmonary Artery ➔ Lungs',
      desc: 'The heart pumps blood through the pulmonary artery to the lungs, where red blood cells receive fresh oxygen and release carbon dioxide.'
    },
    {
      num: 4,
      name: 'Oxygen-Rich Blood Returning to Left Heart',
      tag: 'Left Heart Filling',
      formula: 'Pulmonary Veins ➔ Left Atrium ➔ Left Ventricle',
      desc: 'Bright red, oxygen-rich blood returns from the lungs through pulmonary veins into the left atrium and fills the left ventricle.'
    },
    {
      num: 5,
      name: 'Pumping Blood to the Body (Arteries & Capillaries)',
      tag: 'Systemic Distribution',
      formula: 'Heart ➔ Lungs ➔ Heart ➔ Body ➔ Heart',
      desc: 'The heart pumps oxygenated blood through the Aorta and arteries to microscopic capillaries, delivering oxygen, nutrients, and warmth to cells!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    bpm: 72,
    bloodCells: [],
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
        <canvas id="heart-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="heart-timeline-track">
          <div class="cinema-timeline-fill" id="heart-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="heart-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="heart-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="heart-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>
    `;

    this.initBloodParticles();
    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  initBloodParticles() {
    this.state.bloodCells = [];
    for (let i = 0; i < 50; i++) {
      this.state.bloodCells.push({
        progress: i / 50,
        circuit: i % 2 === 0 ? 'pulmonary' : 'systemic',
        speed: 0.003 + Math.random() * 0.002
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

    const fill = document.getElementById('heart-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('heart-subtitle-chip');
    const title = document.getElementById('heart-subtitle-title');
    const desc = document.getElementById('heart-subtitle-desc');
    if (chip) chip.textContent = `🫀 Step ${step.num}/5`;
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
    const canvas = document.getElementById('heart-canvas');
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

      // Background ambient gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 460);
      if (step === 0) bgGrad.addColorStop(0, 'rgba(239, 68, 68, 0.16)'); // Red Heart
      else if (step === 1) bgGrad.addColorStop(0, 'rgba(244, 63, 94, 0.18)'); // Red Arteries
      else if (step === 2) bgGrad.addColorStop(0, 'rgba(59, 130, 246, 0.18)'); // Blue Veins
      else if (step === 3) bgGrad.addColorStop(0, 'rgba(168, 85, 247, 0.18)'); // Purple Capillaries
      else bgGrad.addColorStop(0, 'rgba(16, 185, 129, 0.18)'); // Green Full Circuit Loop

      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Title Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.textAlign = 'center';

      if (step === 0) {
        // ================= STEP 1: THE HEART ENGINE (4 ROOMS) =================
        ctx.fillText('🫀 STEP 1: THE SUPER PUMP — YOUR HEART HAS 4 SPECIAL ROOMS!', centerX, 28);

        const pulse = Math.sin(t * Math.PI * 2);
        const heartScale = 1 + (pulse > 0.6 ? (pulse - 0.6) * 0.25 : 0);

        ctx.save();
        ctx.translate(centerX, centerY + 15);
        ctx.scale(heartScale, heartScale);

        // Giant Pumping Heart
        ctx.beginPath();
        ctx.moveTo(0, 85);
        ctx.bezierCurveTo(-140, 40, -160, -70, -75, -110);
        ctx.bezierCurveTo(-25, -135, 0, -70, 0, -50);
        ctx.bezierCurveTo(0, -70, 25, -135, 75, -110);
        ctx.bezierCurveTo(160, -70, 140, 40, 0, 85);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 5;
        ctx.stroke();

        // 4 Inner Rooms
        const rooms = [
          { name: 'Right Atrium (Blue Room 1)', x: -55, y: -50, col: '#3b82f6' },
          { name: 'Right Ventricle (Blue Room 2)', x: -45, y: 22, col: '#1d4ed8' },
          { name: 'Left Atrium (Red Room 3)', x: 55, y: -50, col: '#f43f5e' },
          { name: 'Left Ventricle (Red Room 4)', x: 45, y: 22, col: '#b91c1c' }
        ];

        rooms.forEach(r => {
          ctx.beginPath();
          ctx.arc(r.x, r.y, 34, 0, Math.PI * 2);
          ctx.fillStyle = r.col;
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        ctx.restore();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('💓 LUB-DUB! LUB-DUB! Your heart beats 100,000 times every day without ever getting tired!', centerX, height - 25);

      } else if (step === 1) {
        // ================= STEP 2: RED SUPERHIGHWAYS (ARTERIES) =================
        ctx.fillText('🚀 STEP 2: ARTERIES — RED SUPER-HIGHWAYS ZOOMING AWAY FROM THE HEART!', centerX, 28);

        // Giant Red Arterial Tube
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(80, centerY - 50, width - 160, 100);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(80, centerY - 50, width - 160, 100);

        // Animated Fast Red Blood Cell Superheroes with Oxygen Backpacks
        for (let r = 0; r < 6; r++) {
          const rx = 100 + ((t * 180 + r * 130) % (width - 200));
          const ry = centerY + Math.sin(t * 4 + r) * 16;

          ctx.beginPath();
          ctx.arc(rx, ry, 22, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Oxygen Backpack
          ctx.beginPath();
          ctx.arc(rx + 12, ry - 12, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('O₂', rx + 12, ry - 9);

          ctx.font = '16px sans-serif';
          ctx.fillText('🦸', rx, ry + 5);
        }

        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('💨 Thick elastic muscle walls handle high pressure as blood zooms to your brain & toes! ⚡', centerX, height - 25);

      } else if (step === 2) {
        // ================= STEP 3: BLUE RETURN ROADS (VEINS WITH GATES) =================
        ctx.fillText('🚪 STEP 3: VEINS — BLUE RETURN HIGHWAYS WITH ONE-WAY SAFETY GATES (VALVES)!', centerX, 28);

        // Giant Blue Vein Tube
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fillRect(80, centerY - 50, width - 160, 100);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.strokeRect(80, centerY - 50, width - 160, 100);

        // 3 One-Way Valve Doors
        for (let v = 0; v < 3; v++) {
          const vx = centerX - 180 + v * 180;
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(vx, centerY - 48);
          ctx.lineTo(vx + 25, centerY - 10);
          ctx.moveTo(vx, centerY + 48);
          ctx.lineTo(vx + 25, centerY + 10);
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('ONE-WAY VALVE', vx, centerY - 60);
        }

        // Blood Cells moving forward smoothly
        for (let b = 0; b < 5; b++) {
          const bx = 110 + ((t * 90 + b * 140) % (width - 220));
          const by = centerY;

          ctx.beginPath();
          ctx.arc(bx, by, 18, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.font = '14px sans-serif';
          ctx.fillText('🩸', bx, by + 4);
        }

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🛡️ Valves close shut so blood can never flow backwards — only forward back to the heart!', centerX, height - 25);

      } else if (step === 3) {
        // ================= STEP 4: MICROSCOPIC CAPILLARY EXCHANGE =================
        ctx.fillText('🔬 STEP 4: CAPILLARIES — TINY BRIDGES UNLOADING OXYGEN & FOOD TO BODY CELLS!', centerX, 28);

        // Body Cells on Top and Bottom
        for (let c = 0; c < 5; c++) {
          const cx = centerX - 260 + c * 130;
          // Top body cell
          ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.fillRect(cx - 50, centerY - 110, 100, 45);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - 50, centerY - 110, 100, 45);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px Outfit, sans-serif';
          ctx.fillText('😋 Hungry Body Cell', cx, centerY - 82);

          // Bottom body cell
          ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.fillRect(cx - 50, centerY + 65, 100, 45);
          ctx.strokeRect(cx - 50, centerY + 65, 100, 45);
          ctx.fillStyle = '#fff';
          ctx.fillText('💪 Energetic Muscle Cell', cx, centerY + 93);
        }

        // Single-File Thin Capillary Pipe in middle
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
        ctx.fillRect(60, centerY - 25, width - 120, 50);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, centerY - 25, width - 120, 50);

        // Oxygen transferring upward/downward
        for (let i = 0; i < 4; i++) {
          const ix = centerX - 200 + i * 130;
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText('⬆️ O₂ Delivery', ix, centerY - 35);
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('⬇️ Glucose Food', ix, centerY + 45);
        }

        ctx.fillStyle = '#e879f9';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('✨ Capillaries are so narrow that Red Blood Cells line up single-file like ants! ✨', centerX, height - 25);

      } else {
        // ================= STEP 5: FULL BODY CIRCUIT (HEART ➔ LUNGS ➔ BODY ➔ HEART) =================
        ctx.fillText('🔄 STEP 5: THE GRAND ROLLER-COASTER CIRCUIT (HEART ➔ LUNGS ➔ BODY ➔ HEART)!', centerX, 28);

        // Left Loop: Lungs (Pulmonary)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.ellipse(centerX - 180, centerY + 10, 130, 85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = '36px sans-serif';
        ctx.fillText('🫁', centerX - 180, centerY - 10);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('LUNG LOOP (PULMONARY)', centerX - 180, centerY + 35);
        ctx.fillStyle = '#bae6fd';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText('Picks up fresh Oxygen!', centerX - 180, centerY + 52);

        // Right Loop: Body (Systemic)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.beginPath();
        ctx.ellipse(centerX + 180, centerY + 10, 130, 85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = '36px sans-serif';
        ctx.fillText('🧠', centerX + 180, centerY - 10);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('BODY LOOP (SYSTEMIC)', centerX + 180, centerY + 35);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText('Powers your whole body!', centerX + 180, centerY + 52);

        // Central Heart
        ctx.font = '40px sans-serif';
        ctx.fillText('🫀', centerX, centerY + 18);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('🌟 Complete 60,000-mile circulatory journey keeps you alive every second! 🌟', centerX, height - 25);
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
