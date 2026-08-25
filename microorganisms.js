// Topic 7: Microorganisms - 2D Animated Process Video & Microbiology Simulator
window.bioTopics = window.bioTopics || {};

window.bioTopics.microorganisms = {
  id: 'microorganisms',
  title: 'Microorganisms',
  icon: '🦠',
  badgeName: 'Microbiologist Master',
  summary: 'Microorganisms are tiny organisms or microscopic infectious agents including bacteria, fungi, protozoa, algae, and viruses. Some are useful, while others cause disease.',

  processSteps: [
    {
      num: 1,
      name: 'The Microscopic World',
      tag: 'Microscopic Life',
      formula: 'Microorganisms (Invisible to Naked Eye)',
      desc: 'Microorganisms are organisms too small to see without magnification, existing in immense numbers all over the world.'
    },
    {
      num: 2,
      name: 'Bacteria, Fungi, Protozoa & Algae',
      tag: 'Microbe Types',
      formula: 'Bacteria | Fungi (Yeast) | Protozoa | Algae',
      desc: 'Major microbial groups include single-celled bacteria, microscopic fungi, single-celled protozoa, and photosynthetic microscopic algae.'
    },
    {
      num: 3,
      name: 'Viruses: Microscopic Infectious Agents',
      tag: 'Acellular Viruses',
      formula: 'Host Cell Dependent Replication',
      desc: 'Viruses are microscopic infectious agents that cannot reproduce on their own; they must invade and replicate inside living host cells.'
    },
    {
      num: 4,
      name: 'Useful Microorganisms in Food & Ecology',
      tag: 'Beneficial Microbes',
      formula: 'Lactobacillus (Curd) | Yeast (Bread) | Decomposers',
      desc: 'Many microbes are beneficial: bacteria ferment milk into curd/yogurt, yeast makes bread dough rise, and decomposers recycle soil nutrients.'
    },
    {
      num: 5,
      name: 'Harmful Pathogens & Disease Prevention',
      tag: 'Pathogen Control',
      formula: 'Infectious Pathogens ➔ Immune Defense',
      desc: 'Some microorganisms are pathogens that cause infectious diseases, which our immune system, medicines, and hygiene help protect against!'
    }
  ],

  state: {
    currentStep: 0,
    isPlaying: true,
    speed: 1.0,
    microbes: [],
    macrophages: [],
    antibioticDisc: false,
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
        <canvas id="petri-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="micro-timeline-track">
          <div class="cinema-timeline-fill" id="micro-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="micro-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="micro-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="micro-subtitle-desc">${this.processSteps[0].desc}</div>
        </div>
      </div>

      <!-- Microbiological Sandbox Tools -->
      <div class="lab-panel" style="margin-top: 14px;">
        <div class="panel-header">
          <h3><span class="pulse-icon">🧫</span> Agar Culture & Phagocytosis Sandbox</h3>
          <div class="lab-actions">
            <button class="video-btn" id="btn-add-antibiotic" style="background:rgba(56,189,248,0.2); border-color:#38bdf8;">💊 Place Antibiotic Disc</button>
            <button class="video-btn" id="btn-spawn-macrophage" style="background:rgba(16,185,129,0.2); border-color:#10b981;">🛡️ Deploy Macrophage</button>
          </div>
        </div>
      </div>
    `;

    this.initMicrobes();
    this.initCanvas();
    this.initEvents();
    this.seekStep(0, true);
  },

  initMicrobes() {
    this.state.microbes = [];
    for (let i = 0; i < 40; i++) {
      this.state.microbes.push({
        x: 200 + Math.random() * 360,
        y: 80 + Math.random() * 180,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alive: true
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

    const fill = document.getElementById('micro-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('micro-subtitle-chip');
    const title = document.getElementById('micro-subtitle-title');
    const desc = document.getElementById('micro-subtitle-desc');
    if (chip) chip.textContent = `🦠 Step ${step.num}/5`;
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

    const antiBtn = document.getElementById('btn-add-antibiotic');
    if (antiBtn) {
      antiBtn.addEventListener('click', () => {
        this.state.antibioticDisc = true;
        if (window.drHelix) window.drHelix.say("Penicillin disc placed! Observe the clear zone of inhibition where bacterial growth is arrested.", 'excited', true);
      });
    }

    const macBtn = document.getElementById('btn-spawn-macrophage');
    if (macBtn) {
      macBtn.addEventListener('click', () => {
        this.seekStep(4, true);
      });
    }
  },

  initCanvas() {
    const canvas = document.getElementById('petri-canvas');
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

      // Top Step Title Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      if (step === 0) ctx.fillText('🔬 STEP 1: THE MICROSCOPIC WORLD (1,000x MAGNIFICATION)', centerX, 30);
      else if (step === 1) ctx.fillText('🦠 STEP 2: BACTERIA, FUNGI (YEAST), PROTOZOA & MICROSCOPIC ALGAE', centerX, 30);
      else if (step === 2) ctx.fillText('🧬 STEP 3: VIRUSES • ACELLULAR INFECTIOUS AGENTS INVADING HOST CELLS', centerX, 30);
      else if (step === 3) ctx.fillText('🍞 STEP 4: BENEFICIAL MICROBES (FERMENTATION, YOGURT & ANTIBIOTICS)', centerX, 30);
      else if (step === 4) ctx.fillText('🛡️ STEP 5: HARMFUL PATHOGENS & IMMUNE MACROPHAGE PHAGOCYTOSIS', centerX, 30);

      // Petri Dish Outer Rim & Amber Agar Gel
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Step 2: 4 Microbe Groups Display Cards
      if (step === 1) {
        const cards = [
          { name: 'BACTERIA', icon: '🧫', desc: 'Single-celled (E. coli, Lactobacillus)', x: 45, y: centerY - 90 },
          { name: 'FUNGI', icon: '🍄', desc: 'Microscopic Yeast (Bread & Brewing)', x: 45, y: centerY + 10 },
          { name: 'PROTOZOA', icon: '🦠', desc: 'Amoeba & Paramecium (Mobile)', x: width - 245, y: centerY - 90 },
          { name: 'ALGAE', icon: '🌿', desc: 'Photosynthetic Chlorella & Spirulina', x: width - 245, y: centerY + 10 }
        ];

        cards.forEach(c => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(c.x, c.y, 200, 75);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(c.x, c.y, 200, 75);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${c.icon} ${c.name}`, c.x + 12, c.y + 24);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(c.desc, c.x + 12, c.y + 48);
        });
      }

      // Step 3: Virus Capsid Inset
      if (step === 2) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(centerX - 100, centerY - 100, 200, 200);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 100, centerY - 100, 200, 200);

        // Viral Hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2;
          const vx = centerX + Math.cos(ang) * 45;
          const vy = centerY + Math.sin(ang) * 45;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('VIRUS CAPSID', centerX, centerY - 5);
        ctx.font = 'bold 8px monospace';
        ctx.fillText('RNA/DNA CORE', centerX, centerY + 10);
      }

      // Antibiotic Zone of Inhibition
      if (this.state.antibioticDisc || step === 3) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // White filter paper disc
        ctx.beginPath();
        ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 8px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PEN-10', centerX, centerY + 3);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px Outfit, sans-serif';
        ctx.fillText('BENEFICIAL ANTIBIOTIC ZONE', centerX, centerY + 65);
      }

      // Draw Bacteria particles
      this.state.microbes.forEach(m => {
        if (this.state.isPlaying) {
          m.x += m.vx * this.state.speed;
          m.y += m.vy * this.state.speed;

          // Stay within petri dish
          const dist = Math.hypot(m.x - centerX, m.y - centerY);
          if (dist > 135) {
            m.vx *= -1;
            m.vy *= -1;
          }
        }

        // Rod-shaped bacterium (bacillus)
        ctx.beginPath();
        ctx.roundRect(m.x - 7, m.y - 3.5, 14, 7, 3);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Step 5: Macrophage (Immune Phagocyte)
      if (step === 4) {
        const mx = centerX - 40 + Math.sin(t) * 35;
        const my = centerY + Math.cos(t) * 35;

        ctx.beginPath();
        ctx.arc(mx, my, 42, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MACROPHAGE', mx, my - 6);
        ctx.font = 'bold 9px monospace';
        ctx.fillText('PHAGOCYTOSIS', mx, my + 10);
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
