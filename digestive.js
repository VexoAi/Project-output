// Topic 8: Digestive System - 2D Animated Process Video & Gastrointestinal Simulator
window.bioTopics = window.bioTopics || {};

window.bioTopics.digestive = {
  id: 'digestive',
  title: 'Human Digestive System',
  icon: '🍎',
  badgeName: 'Gastroenterologist Master',
  summary: 'Digestion breaks food into smaller substances so nutrients can be absorbed and used by the body via the mouth, esophagus, stomach, small intestine, and large intestine.',

  processSteps: [
    {
      num: 1,
      name: 'Mouth: Chewing & Saliva',
      tag: 'Oral Digestion',
      formula: 'Food ➔ Mouth (Chewing & Saliva)',
      desc: 'Food enters the mouth where teeth chew it into smaller pieces and saliva begins breaking down starches.'
    },
    {
      num: 2,
      name: 'Esophagus: Peristalsis Slide',
      tag: 'Food Transport',
      formula: 'Mouth ➔ Esophagus ➔ Stomach',
      desc: 'Involuntary smooth muscle waves called peristalsis squeeze the food bolus smoothly down the esophagus into the stomach.'
    },
    {
      num: 3,
      name: 'Stomach: Acid & Digestive Juices',
      tag: 'Gastric Churning',
      formula: 'Stomach Acid + Enzymes ➔ Chyme',
      desc: 'The stomach churns food with strong gastric acid and digestive enzymes to break down proteins into a liquid soup called chyme.'
    },
    {
      num: 4,
      name: 'Small Intestine: Nutrient Absorption',
      tag: 'Absorption to Blood',
      formula: 'Small Intestine Villi ➔ Bloodstream',
      desc: 'Most chemical digestion and nutrient absorption occurs in the small intestine, where microscopic villi absorb vitamins and glucose into the blood.'
    },
    {
      num: 5,
      name: 'Large Intestine: Water & Waste Elimination',
      tag: 'Waste Formation',
      formula: 'Food ➔ Mouth ➔ Esophagus ➔ Stomach ➔ Small Intestine ➔ Large Intestine ➔ Waste',
      desc: 'The large intestine absorbs remaining water and mineral salts, compacting indigestible fiber into waste for healthy elimination.'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    videoType: 'macro', // 'macro' | 'micro'
    foodType: 'apple',
    foodProgress: 0,
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
          <div class="video-type-switcher" style="display:flex; background:rgba(15,23,42,0.8); border:1px solid rgba(244,63,94,0.4); border-radius:20px; padding:3px; gap:4px;">
            <button class="video-btn ${this.state.videoType === 'macro' ? 'active' : ''}" id="btn-type-dig-macro" style="padding:4px 12px; font-size:11px; border-radius:16px;">🍎 Full GI Tract Journey</button>
            <button class="video-btn ${this.state.videoType === 'micro' ? 'active' : ''}" id="btn-type-dig-micro" style="padding:4px 12px; font-size:11px; border-radius:16px;">🔬 Micro Villi Absorption</button>
          </div>
          <span class="cinema-live-tag">
            <span class="live-pulse-dot"></span>
            🔴 LIVE PROCESS VIDEO • 60 FPS
          </span>
        </div>
      </div>

      <div class="cinema-canvas-wrap">
        <canvas id="digestive-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="dig-timeline-track">
          <div class="cinema-timeline-fill" id="dig-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="dig-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="dig-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="dig-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>

      <!-- Food Selector & Enzyme Report -->
      <div class="lab-panel" style="margin-top: 14px;">
        <div class="panel-header">
          <h3><span class="pulse-icon">🧪</span> Dietary Food Selector (Custom Digestion Pathway)</h3>
        </div>

        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="video-btn ${this.state.foodType === 'apple' ? 'active' : ''} btn-food" data-food="apple">🍎 Apple (Carbohydrate/Fiber ➔ Amylase)</button>
          <button class="video-btn ${this.state.foodType === 'steak' ? 'active' : ''} btn-food" data-food="steak">🥩 Steak (Protein ➔ Pepsin/Trypsin)</button>
          <button class="video-btn ${this.state.foodType === 'cheese' ? 'active' : ''} btn-food" data-food="cheese">🧀 Cheese (Lipids/Fats ➔ Bile/Lipase)</button>
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

    // Automatically switch to micro for small intestine absorption step
    if (this.state.currentStep === 3) {
      this.state.videoType = 'micro';
    } else {
      this.state.videoType = 'macro';
    }
    this.updateVideoTypeButtons();

    document.querySelectorAll('.cinema-step-btn').forEach((b, i) => {
      b.classList.toggle('active', i === this.state.currentStep);
      b.classList.toggle('completed', i < this.state.currentStep);
    });

    const fill = document.getElementById('dig-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('dig-subtitle-chip');
    const title = document.getElementById('dig-subtitle-title');
    const desc = document.getElementById('dig-subtitle-desc');
    if (chip) chip.textContent = `🍎 Step ${step.num}/5`;
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
    const macroBtn = document.getElementById('btn-type-dig-macro');
    const microBtn = document.getElementById('btn-type-dig-micro');
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
    const macroBtn = document.getElementById('btn-type-dig-macro');
    if (macroBtn) {
      macroBtn.addEventListener('click', () => {
        this.state.videoType = 'macro';
        this.updateVideoTypeButtons();
      });
    }

    const microBtn = document.getElementById('btn-type-dig-micro');
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

    document.querySelectorAll('.btn-food').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.btn-food').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        this.state.foodType = b.dataset.food;
      });
    });
  },

  initCanvas() {
    const canvas = document.getElementById('digestive-canvas');
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
        this.state.foodProgress = (this.state.foodProgress + 0.007 * this.state.speed) % 1;
      }

      // Background gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 460);
      bgGrad.addColorStop(0, 'rgba(239, 68, 68, 0.12)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Title Tag
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      if (step === 0) ctx.fillText('👄 STEP 1: MOUTH & TEETH • CHEWING FOOD & SALIVARY AMYLASE ENZYME', centerX, 26);
      else if (step === 1) ctx.fillText('〰️ STEP 2: ESOPHAGUS • RHYTHMIC PERISTALSIS SQUEEZE WAVE SLIDE', centerX, 26);
      else if (step === 2) ctx.fillText('🧪 STEP 3: STOMACH ACID • GASTRIC HCl (pH 1.5) & PEPSIN CHURNING CHYME', centerX, 26);
      else if (step === 3) ctx.fillText('🔬 STEP 4: SMALL INTESTINE • VILLI BRUSH BORDER ABSORBING NUTRIENTS', centerX, 26);
      else if (step === 4) ctx.fillText('🚰 STEP 5: LARGE INTESTINE (COLON) • WATER REABSORPTION & WASTE ELIMINATION', centerX, 26);

      if (this.state.videoType === 'macro') {
        // ================= FULL ANATOMICAL HUMAN BODY DIGESTION MODEL =================
        const bodyX = centerX - 60; // Center human model slightly to left
        
        // 1. Draw Transparent High-Tech 2D Human Body Silhouette
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        ctx.lineWidth = 2.5;

        // Head Silhouette
        ctx.beginPath();
        ctx.arc(bodyX, 55, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Neck
        ctx.beginPath();
        ctx.rect(bodyX - 14, 88, 28, 22);
        ctx.fill();
        ctx.stroke();

        // Shoulders & Torso Outline
        ctx.beginPath();
        ctx.moveTo(bodyX - 14, 98);
        ctx.lineTo(bodyX - 110, 125); // Left shoulder
        ctx.lineTo(bodyX - 95, 230);  // Left chest / ribcage
        ctx.lineTo(bodyX - 85, 340);  // Left hip
        ctx.lineTo(bodyX - 45, 395);  // Left thigh top
        ctx.lineTo(bodyX + 45, 395);  // Right thigh top
        ctx.lineTo(bodyX + 85, 340);  // Right hip
        ctx.lineTo(bodyX + 95, 230);  // Right chest
        ctx.lineTo(bodyX + 110, 125); // Right shoulder
        ctx.lineTo(bodyX + 14, 98);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. Anatomical Digestive Organs inside the Human Body
        // A. Mouth & Salivary Glands (Head)
        ctx.fillStyle = step === 0 ? '#f43f5e' : 'rgba(225, 29, 72, 0.65)';
        ctx.beginPath();
        ctx.arc(bodyX, 55, step === 0 ? 24 : 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = step === 0 ? '#fef08a' : '#fda4af';
        ctx.lineWidth = step === 0 ? 3.5 : 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MOUTH', bodyX, 55);

        // B. Esophagus (Neck ➔ Chest)
        ctx.strokeStyle = step === 1 ? '#38bdf8' : 'rgba(148, 163, 184, 0.55)';
        ctx.lineWidth = step === 1 ? 16 : 10;
        ctx.beginPath();
        ctx.moveTo(bodyX, 75);
        ctx.lineTo(bodyX, 155);
        ctx.stroke();

        // C. J-Shaped Stomach (Left Upper Abdomen)
        ctx.beginPath();
        ctx.moveTo(bodyX, 155);
        ctx.bezierCurveTo(bodyX + 55, 165, bodyX + 55, 225, bodyX - 10, 235);
        ctx.bezierCurveTo(bodyX - 65, 235, bodyX - 65, 175, bodyX, 155);
        ctx.fillStyle = step === 2 ? 'rgba(239, 68, 68, 0.95)' : 'rgba(185, 28, 28, 0.55)';
        ctx.fill();
        ctx.strokeStyle = step === 2 ? '#fef08a' : '#fca5a5';
        ctx.lineWidth = step === 2 ? 4 : 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.fillText('STOMACH', bodyX - 5, 200);

        // D. Liver (Right Upper Abdomen) & Gallbladder
        ctx.fillStyle = 'rgba(180, 83, 9, 0.75)';
        ctx.beginPath();
        ctx.moveTo(bodyX + 15, 160);
        ctx.lineTo(bodyX + 75, 175);
        ctx.lineTo(bodyX + 60, 215);
        ctx.lineTo(bodyX + 15, 200);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fcd34d';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px Outfit, sans-serif';
        ctx.fillText('LIVER (BILE)', bodyX + 45, 190);

        // E. Large Intestine / Colon (Framing the abdomen)
        ctx.beginPath();
        ctx.strokeStyle = step === 4 ? '#f59e0b' : 'rgba(217, 119, 6, 0.45)';
        ctx.lineWidth = step === 4 ? 14 : 9;
        ctx.strokeRect(bodyX - 55, 240, 110, 110);

        // F. Small Intestine (Coiled in central abdomen)
        ctx.beginPath();
        ctx.strokeStyle = step === 3 ? '#10b981' : 'rgba(5, 150, 105, 0.65)';
        ctx.lineWidth = step === 3 ? 12 : 7;
        ctx.arc(bodyX, 295, 32, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = step === 3 ? '#6ee7b7' : '#94a3b8';
        ctx.font = 'bold 9px Outfit, sans-serif';
        ctx.fillText('SMALL INTESTINE', bodyX, 295);

        // 3. Moving Food Bolus / Chyme Particle through Human Body
        let foodPx = bodyX;
        let foodPy = 55;
        const p = this.state.foodProgress;

        if (p < 0.2) {
          // In Mouth
          foodPx = bodyX + Math.sin(t * 8) * 6;
          foodPy = 55;
        } else if (p < 0.4) {
          // Sliding down Esophagus
          const subP = (p - 0.2) / 0.2;
          foodPx = bodyX;
          foodPy = 75 + subP * 80;
        } else if (p < 0.65) {
          // Churning in Stomach
          const subP = (p - 0.4) / 0.25;
          foodPx = bodyX - 10 + Math.sin(subP * Math.PI * 2 + t * 4) * 20;
          foodPy = 195 + Math.cos(subP * Math.PI * 2) * 15;
        } else if (p < 0.85) {
          // Coiling in Small Intestine
          const subP = (p - 0.65) / 0.2;
          const ang = subP * Math.PI * 4;
          foodPx = bodyX + Math.cos(ang) * 22;
          foodPy = 295 + Math.sin(ang) * 22;
        } else {
          // Colon to Exit
          const subP = (p - 0.85) / 0.15;
          foodPx = bodyX + 45;
          foodPy = 260 + subP * 90;
        }

        // Draw Food Particle with Glow
        ctx.beginPath();
        ctx.arc(foodPx, foodPy, 10, 0, Math.PI * 2);
        ctx.fillStyle = this.state.foodType === 'apple' ? '#22c55e' : (this.state.foodType === 'steak' ? '#ef4444' : '#f59e0b');
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 4. Live Organ Telemetry Side Panel (Right side)
        const hudX = centerX + 180;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(hudX - 110, 65, 230, 310);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(hudX - 110, 65, 230, 310);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🩺 LIVE GI TRACT TELEMETRY', hudX - 95, 90);

        const telemetry = [
          { label: 'Current Organ:', val: step === 0 ? '👄 Oral Cavity' : (step === 1 ? '〰️ Esophagus' : (step === 2 ? '🧪 Stomach' : (step === 3 ? '🔬 Small Intestine' : '🚰 Colon'))) },
          { label: 'Gastric pH Level:', val: step === 2 ? '🔥 pH 1.5 (Strong Acid)' : (step === 0 ? 'pH 6.8 (Neutral)' : 'pH 7.8 (Alkaline)') },
          { label: 'Active Enzyme:', val: step === 0 ? 'Salivary Amylase' : (step === 2 ? 'Pepsin + Gastric Lipase' : (step === 3 ? 'Bile + Trypsin + Lipase' : 'Bacterial Flora')) },
          { label: 'Selected Food:', val: this.state.foodType === 'apple' ? '🍎 Apple (Carbohydrates)' : (this.state.foodType === 'steak' ? '🥩 Steak (Protein)' : '🧀 Cheese (Fats)') },
          { label: 'Absorption Status:', val: step === 3 ? '✨ 90% Nutrients to Blood' : (step === 4 ? '💧 Water Recovery' : '⏳ Mechanical Digestion') }
        ];

        telemetry.forEach((tel, idx) => {
          const ty = 125 + idx * 48;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px Outfit, sans-serif';
          ctx.fillText(tel.label, hudX - 95, ty);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(tel.val, hudX - 95, ty + 16);
        });

      } else {
        // ================= MICROSCOPIC INTESTINAL VILLI ABSORPTION =================
        const numVilli = 5;
        const villiW = 90;
        const startX = centerX - 240;

        for (let v = 0; v < numVilli; v++) {
          const vx = startX + v * (villiW + 15);
          const vy = centerY + 80;

          // Villus Finger-like projection
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(vx, vy - 140);
          ctx.arc(vx + villiW / 2, vy - 140, villiW / 2, Math.PI, 0);
          ctx.lineTo(vx + villiW, vy);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
          ctx.fill();
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Central Capillary Blood Vessel inside Villus
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(vx + villiW / 2, vy);
          ctx.lineTo(vx + villiW / 2, vy - 120);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('CAPILLARY', vx + villiW / 2, vy - 60);
        }

        // Absorbed nutrient particles flowing into villi
        for (let n = 0; n < 14; n++) {
          const nx = startX + ((n * 45 + t * 40) % 520);
          const ny = centerY - 100 + Math.sin(n + t * 2) * 20;

          ctx.beginPath();
          ctx.arc(nx, ny, 7, 0, Math.PI * 2);
          ctx.fillStyle = this.state.foodType === 'apple' ? '#22c55e' : (this.state.foodType === 'steak' ? '#ef4444' : '#f59e0b');
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(this.state.foodType === 'apple' ? 'GLU' : (this.state.foodType === 'steak' ? 'AA' : 'FA'), nx, ny + 3);
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🔬 MICROSCOPIC INTESTINAL VILLI & MICROVILLI BRUSH BORDER', centerX, 60);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Outfit, sans-serif';
        ctx.fillText('Massive surface area (~250 m²) absorbs Glucose, Amino Acids & Fatty Acids directly into bloodstream capillaries.', centerX, 85);
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
