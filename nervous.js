// Topic 4: Human Nervous System - 2D Animated Process Video
window.bioTopics = window.bioTopics || {};

window.bioTopics.nervous = {
  id: 'nervous',
  title: 'Human Nervous System',
  icon: '🧠',
  badgeName: 'Neuroscientist Master',
  summary: 'The nervous system receives information, processes it, and coordinates responses via the brain, spinal cord, nerves, and neurons.',

  processSteps: [
    {
      num: 1,
      name: 'Brain, Spinal Cord & Nerves',
      tag: 'Nervous Architecture',
      formula: 'Brain ➔ Spinal Cord ➔ Nerves',
      desc: 'The central nervous system consists of the brain and spinal cord, with peripheral nerves extending throughout the entire body.'
    },
    {
      num: 2,
      name: 'Neurons: Specialized Signaling Cells',
      tag: 'Neuron Structure',
      formula: 'Dendrites ➔ Cell Body ➔ Axon',
      desc: 'Neurons are highly specialized cells that transmit electrical and chemical nerve signals at speeds up to 268 mph.'
    },
    {
      num: 3,
      name: 'Stimulus Detection & Sensory Signal',
      tag: 'Sensory Input',
      formula: 'Heat Stimulus ➔ Sensory Neuron',
      desc: 'Sensory receptors detect a stimulus (like touching a hot object) and transmit an electrical signal toward the spinal cord and brain.'
    },
    {
      num: 4,
      name: 'Response Signal to Muscle (Reflex Arc)',
      tag: 'Motor Output',
      formula: 'Spinal Cord ➔ Motor Neuron ➔ Muscle',
      desc: 'The spinal cord and brain process the signal and dispatch a motor response signal to contract muscles, pulling the hand away safely.'
    },
    {
      num: 5,
      name: 'Movement, Sensation & Coordination',
      tag: 'Full Body Control',
      formula: 'Stimulus ➔ Process ➔ Fast Response',
      desc: 'The nervous system helps us think, move, feel, learn, and respond instantaneously to keep us protected and alive!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    videoType: 'synapse', // 'reflex' | 'synapse'
    impulseProgress: 0,
    neurotransmitters: [],
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
          <div class="video-type-switcher" style="display:flex; background:rgba(15,23,42,0.8); border:1px solid rgba(168,85,247,0.4); border-radius:20px; padding:3px; gap:4px;">
            <button class="video-btn ${this.state.videoType === 'reflex' ? 'active' : ''}" id="btn-type-nerv-reflex" style="padding:4px 12px; font-size:11px; border-radius:16px;">🧠 Brain & Reflex Arc</button>
            <button class="video-btn ${this.state.videoType === 'synapse' ? 'active' : ''}" id="btn-type-nerv-synapse" style="padding:4px 12px; font-size:11px; border-radius:16px;">⚡ Synaptic Micro-Cleft</button>
          </div>
          <span class="cinema-live-tag">
            <span class="live-pulse-dot"></span>
            🔴 LIVE PROCESS VIDEO • 60 FPS
          </span>
        </div>
      </div>

      <div class="cinema-canvas-wrap">
        <canvas id="brain-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="nervous-timeline-track">
          <div class="cinema-timeline-fill" id="nervous-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="nervous-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="nervous-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="nervous-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>
    `;

    this.initNeurotransmitters();
    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  initNeurotransmitters() {
    this.state.neurotransmitters = [];
    for (let i = 0; i < 40; i++) {
      this.state.neurotransmitters.push({
        x: 740 + Math.random() * 50,
        y: 180 + Math.random() * 90,
        vx: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#10b981' : '#38bdf8'
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

    // Automatically adjust video type based on step
    if (this.state.currentStep === 0 || this.state.currentStep === 4) {
      this.state.videoType = 'reflex';
    } else {
      this.state.videoType = 'synapse';
    }
    this.updateVideoTypeButtons();

    document.querySelectorAll('.cinema-step-btn').forEach((b, i) => {
      b.classList.toggle('active', i === this.state.currentStep);
      b.classList.toggle('completed', i < this.state.currentStep);
    });

    const fill = document.getElementById('nervous-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('nervous-subtitle-chip');
    const title = document.getElementById('nervous-subtitle-title');
    const desc = document.getElementById('nervous-subtitle-desc');
    if (chip) chip.textContent = `🧠 Step ${step.num}/5`;
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
    const reflexBtn = document.getElementById('btn-type-nerv-reflex');
    const synapseBtn = document.getElementById('btn-type-nerv-synapse');
    if (reflexBtn) reflexBtn.classList.toggle('active', this.state.videoType === 'reflex');
    if (synapseBtn) synapseBtn.classList.toggle('active', this.state.videoType === 'synapse');
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
    const reflexBtn = document.getElementById('btn-type-nerv-reflex');
    if (reflexBtn) {
      reflexBtn.addEventListener('click', () => {
        this.state.videoType = 'reflex';
        this.updateVideoTypeButtons();
      });
    }

    const synapseBtn = document.getElementById('btn-type-nerv-synapse');
    if (synapseBtn) {
      synapseBtn.addEventListener('click', () => {
        this.state.videoType = 'synapse';
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
    const canvas = document.getElementById('brain-canvas');
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
        this.state.impulseProgress = (this.state.impulseProgress + 0.012 * this.state.speed) % 1;
      }

      // Background ambient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 440);
      bgGrad.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Step Header Tag
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      if (step === 0) ctx.fillText('🧠 CENTRAL NERVOUS SYSTEM (BRAIN & SPINAL CORD) + PERIPHERAL NERVES', centerX, 26);
      else if (step === 1) ctx.fillText('⚡ NEURON ANATOMY • DENDRITES, SOMA, AXON & MYELIN INSULATION', centerX, 26);
      else if (step === 2) ctx.fillText('🔥 STIMULUS DETECTION & HIGH-SPEED ACTION POTENTIAL TRANSMISSION', centerX, 26);
      else if (step === 3) ctx.fillText('🔬 SYNAPTIC CLEFT • CHEMICAL NEUROTRANSMITTER DIFFUSION', centerX, 26);
      else if (step === 4) ctx.fillText('💪 MOTOR RESPONSE & REFLEX ARC COORDINATION', centerX, 26);

      if (this.state.videoType === 'reflex') {
        // ================= WHOLE-BODY REFLEX ARC & BRAIN HOLOGRAPHIC VIEW =================
        // Brain Cortex Hemisphere (Left Side)
        const bx = centerX - 240, by = centerY - 30;

        ctx.beginPath();
        ctx.arc(bx, by, 75, Math.PI * 0.7, Math.PI * 2.3);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('🧠 BRAIN CORTEX', bx, by - 15);
        ctx.font = '10px monospace';
        ctx.fillText('Central Processing Unit', bx, by + 8);

        // Spinal Cord Vertical Column
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(bx, by + 75);
        ctx.lineTo(bx, height - 60);
        ctx.stroke();

        ctx.fillStyle = '#e9d5ff';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.fillText('SPINAL CORD (RELAY)', bx + 80, centerY + 60);

        // Sensory Nerve Pathway (Red)
        const handX = centerX + 240, handY = centerY + 40;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.quadraticCurveTo(centerX + 40, handY - 60, bx, centerY + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('🔴 Sensory Neuron (Signal to Spine)', centerX + 40, centerY - 25);

        // Motor Nerve Pathway (Green)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(bx, centerY + 40);
        ctx.quadraticCurveTo(centerX + 40, handY + 60, handX - 30, handY + 10);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.fillText('🟢 Motor Neuron (Fast Muscle Contraction)', centerX + 40, centerY + 85);

        // Hand & Heat Stimulus
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(handX - 50, handY - 40, 140, 90);
        ctx.fillRect(handX - 50, handY - 40, 140, 90);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('🔥 HEAT STIMULUS', handX + 20, handY - 15);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('✋ Hand Pulls Back', handX + 20, handY + 10);
        ctx.fillStyle = '#10b981';
        ctx.font = '10px monospace';
        ctx.fillText('Reflex Time: 20 ms', handX + 20, handY + 30);

      } else {
        // ================= SYNAPSE & ACTION POTENTIAL MICRO-VIEW =================
        // 1. Soma (Neuron Body)
        ctx.beginPath();
        ctx.arc(120, centerY, 52, 0, Math.PI * 2);
        ctx.fillStyle = (step === 1 || step === 2) ? 'rgba(234, 179, 8, 0.95)' : 'rgba(147, 51, 234, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Nucleus
        ctx.beginPath();
        ctx.arc(120, centerY, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NUCLEUS', 120, centerY + 3);

        // Dendrites
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          if (Math.cos(ang) < 0.2) {
            ctx.beginPath();
            ctx.moveTo(120 + Math.cos(ang) * 50, centerY + Math.sin(ang) * 50);
            ctx.lineTo(120 + Math.cos(ang) * 95, centerY + Math.sin(ang) * 95);
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }

        ctx.fillStyle = '#e9d5ff';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.fillText('DENDRITES', 50, centerY - 60);
        ctx.fillText('SOMA (BODY)', 120, centerY + 70);

        // 2. Axon line
        ctx.beginPath();
        ctx.moveTo(170, centerY);
        ctx.lineTo(690, centerY);
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 10;
        ctx.stroke();

        // 3. Myelin Sheaths
        const numSheaths = 4;
        for (let s = 0; s < numSheaths; s++) {
          const sx = 200 + s * 120;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
          ctx.fillRect(sx, centerY - 18, 95, 36);
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, centerY - 18, 95, 36);

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('MYELIN', sx + 47, centerY + 4);
        }

        // 4. Electric Action Potential Spark
        const sparkX = 170 + this.state.impulseProgress * 520;
        ctx.beginPath();
        ctx.arc(sparkX, centerY, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('⚡', sparkX, centerY + 3);

        // 5. Axon Terminal & Synapse
        ctx.beginPath();
        ctx.arc(730, centerY, 45, -Math.PI / 2, Math.PI / 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#d8b4fe';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Post-synaptic Membrane
        ctx.beginPath();
        ctx.arc(840, centerY, 55, Math.PI / 2, -Math.PI / 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#6ee7b7';
        ctx.stroke();

        // Neurotransmitters
        this.state.neurotransmitters.forEach(nt => {
          if (this.state.isPlaying && (step === 3 || step === 4)) {
            nt.x += nt.vx * this.state.speed;
            if (nt.x > 830) nt.x = 740;
          }
          ctx.beginPath();
          ctx.arc(nt.x, nt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = nt.color;
          ctx.fill();
        });

        // Oscilloscope Inset
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(24, height - 85, 240, 65);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(24, height - 85, 240, 65);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(step >= 2 ? 'MEMBRANE: +30 mV (ACTION POTENTIAL)' : 'MEMBRANE: -70 mV (RESTING STATE)', 36, height - 60);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px Outfit, sans-serif';
        ctx.fillText('OSCILLOSCOPE VOLTAGE TRACE (268 MPH)', 36, height - 38);
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
