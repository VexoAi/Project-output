// Topic 1: DNA & Genetics - 2D Animated Process Video
window.bioTopics = window.bioTopics || {};

window.bioTopics.dnaGenetics = {
  id: 'dnaGenetics',
  title: 'DNA & Genetics',
  icon: '🧬',
  badgeName: 'Geneticist Master',
  summary: 'DNA stores genetic information in a double helix of A, T, C, and G bases. Genes on chromosomes pass traits from parents to offspring.',

  processSteps: [
    {
      num: 1,
      name: 'DNA & Double-Helix Structure',
      tag: 'Genetic Blueprint',
      formula: 'DNA: Deoxyribonucleic Acid',
      desc: 'DNA is the molecule that stores genetic information in a double-helix structure containing chemical bases: A, T, C, and G.'
    },
    {
      num: 2,
      name: 'Chemical Base Pairing (A-T & C-G)',
      tag: 'Complementary Bases',
      formula: 'A pairs with T | C pairs with G',
      desc: 'Adenine (A) pairs with Thymine (T), and Cytosine (C) pairs with Guanine (G), holding the two strands together.'
    },
    {
      num: 3,
      name: 'Genes & Chromosome Packaging',
      tag: 'Genes & Chromosomes',
      formula: 'DNA ➔ Genes ➔ Chromosomes',
      desc: 'Specific sections of DNA are called genes. DNA is tightly packaged into chromosomes inside the cell nucleus.'
    },
    {
      num: 4,
      name: 'Parental Inheritance & Reproductive Cells',
      tag: 'Genetic Transmission',
      formula: 'Parent ➔ Reproductive Cells ➔ Offspring',
      desc: 'Offspring receive genetic material from both parents through reproductive cells, inheriting traits like eye color and blood groups.'
    },
    {
      num: 5,
      name: 'Gene Combinations & Genetic Variation',
      tag: 'Trait Variation',
      formula: 'Inherited Genes ➔ Unique Physical Traits',
      desc: 'Different gene combinations from both parents produce genetic variation, making each individual unique!'
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
        <canvas id="dna-canvas" width="960" height="420"></canvas>
      </div>

      <div class="cinema-controls-bar">
        <div class="cinema-timeline-track" id="dna-timeline-track">
          <div class="cinema-timeline-fill" id="dna-timeline-fill" style="width: 20%;"></div>
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
        <div class="subtitles-step-chip" id="dna-subtitle-chip">
          <span>Step 1/5</span>
        </div>
        <div class="subtitles-text-content">
          <div class="subtitles-step-title" id="dna-subtitle-title">${this.processSteps[0].name} (${this.processSteps[0].formula})</div>
          <div class="subtitles-step-desc" id="dna-subtitle-desc">${this.processSteps[0].desc}</div>
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

    const fill = document.getElementById('dna-timeline-fill');
    if (fill) {
      fill.style.width = `${((this.state.currentStep + 1) / this.processSteps.length) * 100}%`;
    }

    const chip = document.getElementById('dna-subtitle-chip');
    const title = document.getElementById('dna-subtitle-title');
    const desc = document.getElementById('dna-subtitle-desc');
    if (chip) chip.textContent = `🧬 Step ${step.num}/5`;
    if (title) title.textContent = `${step.name} (${step.formula})`;
    if (desc) desc.textContent = step.desc;

    if (speak && window.drHelix) {
      const speechText = `Step ${step.num}: ${step.name}. ${step.desc}`;
      window.drHelix.say(speechText, 'explaining', true, () => {
        // Complete speech narration finished!
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
    const canvas = document.getElementById('dna-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angleOffset = 0;

    const baseColors = {
      'A': '#ef4444', // Red - Adenine
      'T': '#3b82f6', // Blue - Thymine
      'C': '#10b981', // Green - Cytosine
      'G': '#f59e0b'  // Amber - Guanine
    };

    const basesList = ['A', 'T', 'C', 'G', 'T', 'A', 'G', 'C', 'A', 'T', 'C', 'G', 'T', 'A', 'G', 'C', 'A', 'T'];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const step = this.state.currentStep;

      if (this.state.isPlaying) {
        angleOffset += 0.025 * this.state.speed;
      }

      // Background ambient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 420);
      bgGrad.addColorStop(0, 'rgba(2, 132, 199, 0.12)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (step === 0) {
        // STEP 1: Full Double-Helix Structure (A, T, C, G)
        const numNodes = 30;
        for (let i = 0; i < numNodes; i++) {
          const x = 60 + (i * (width - 120)) / (numNodes - 1);
          const theta = angleOffset + i * 0.35;
          const sinVal = Math.sin(theta);
          const cosVal = Math.cos(theta);

          const y1 = centerY + sinVal * 70;
          const y2 = centerY - sinVal * 70;

          const leftBase = basesList[i % basesList.length];
          const pairMap = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
          const rightBase = pairMap[leftBase];

          // Hydrogen bonds
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + (cosVal + 1) * 0.3})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Top strand base
          ctx.beginPath();
          ctx.arc(x, y1, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = baseColors[leftBase];
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(leftBase, x, y1);

          // Bottom strand base
          ctx.beginPath();
          ctx.arc(x, y2, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = baseColors[rightBase];
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.fillText(rightBase, x, y2);
        }

        // Title Callout
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧬 DNA DOUBLE-HELIX • ANTIPARALLEL SUGAR-PHOSPHATE BACKBONES', centerX, 35);

      } else if (step === 1) {
        // STEP 2: Chemical Base Pairing Callout (A-T & C-G)
        // Zoomed in base pair illustration
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 320, centerY - 140, 640, 280);
        ctx.fillRect(centerX - 320, centerY - 140, 640, 280);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔬 COMPLEMENTARY CHEMICAL BASE PAIRING RULE', centerX, centerY - 110);

        // A = T Pair (2 Hydrogen bonds)
        const aX = centerX - 180, aY = centerY - 20;
        const tX = centerX - 60, tY = centerY - 20;
        
        ctx.beginPath();
        ctx.arc(aX, aY, 32, 0, Math.PI * 2);
        ctx.fillStyle = baseColors['A'];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.fillText('A (Adenine)', aX, aY);

        // 2 H-bonds
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(aX + 34, aY - 8); ctx.lineTo(tX - 34, tY - 8);
        ctx.moveTo(aX + 34, aY + 8); ctx.lineTo(tX - 34, tY + 8);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(tX, tY, 32, 0, Math.PI * 2);
        ctx.fillStyle = baseColors['T'];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillText('T (Thymine)', tX, tY);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText('2 Hydrogen Bonds', (aX + tX) / 2, aY + 28);

        // C ≡ G Pair (3 Hydrogen bonds)
        const cX = centerX + 60, cY = centerY - 20;
        const gX = centerX + 180, gY = centerY - 20;

        ctx.beginPath();
        ctx.arc(cX, cY, 32, 0, Math.PI * 2);
        ctx.fillStyle = baseColors['C'];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.fillText('C (Cytosine)', cX, cY);

        // 3 H-bonds
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cX + 34, cY - 10); ctx.lineTo(gX - 34, gY - 10);
        ctx.moveTo(cX + 34, cY); ctx.lineTo(gX - 34, gY);
        ctx.moveTo(cX + 34, cY + 10); ctx.lineTo(gX - 34, gY + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(gX, gY, 32, 0, Math.PI * 2);
        ctx.fillStyle = baseColors['G'];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillText('G (Guanine)', gX, gY);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText('3 Hydrogen Bonds', (cX + gX) / 2, cY + 28);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('Chargaff\'s Rule: Amount of A = T and Amount of G = C', centerX, centerY + 95);

      } else if (step === 2) {
        // STEP 3: Genes & Chromosome Packaging
        // Draw condensed X-shaped Chromosome with highlighted Gene bands
        const chromoX = centerX - 120;
        const pulse = Math.sin(angleOffset * 2) * 4;

        // Chromatid arms
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 24;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(chromoX - 45, centerY - 100);
        ctx.quadraticCurveTo(chromoX, centerY, chromoX + 45, centerY + 100);
        ctx.moveTo(chromoX + 45, centerY - 100);
        ctx.quadraticCurveTo(chromoX, centerY, chromoX - 45, centerY + 100);
        ctx.stroke();
        ctx.lineCap = 'butt';

        // Centromere
        ctx.beginPath();
        ctx.arc(chromoX, centerY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#c084fc';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Highlighted Gene Band (Locus)
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(chromoX - 35, centerY - 65, 70, 14);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GENE (EYE COLOR)', chromoX, centerY - 55);

        // DNA unwinding pointer
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(chromoX + 35, centerY - 58);
        ctx.lineTo(centerX + 80, centerY - 58);
        ctx.stroke();
        ctx.setLineDash([]);

        // Gene definition card on right
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(centerX + 80, centerY - 90, 220, 170);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX + 80, centerY - 90, 220, 170);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📦 CHROMOSOME & GENES', centerX + 95, centerY - 65);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Outfit, sans-serif';
        ctx.fillText('• Chromosomes: 46 in human cells', centerX + 95, centerY - 40);
        ctx.fillText('• Genes: ~20,000 functional sections', centerX + 95, centerY - 18);
        ctx.fillText('• Code for specific proteins & traits', centerX + 95, centerY + 4);
        ctx.fillText('• Packaged inside the nucleus', centerX + 95, centerY + 26);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('DNA ➔ GENES ➔ CHROMOSOME', centerX + 95, centerY + 58);

      } else if (step === 3) {
        // STEP 4: Parental Inheritance (Mother 23 + Father 23 = Offspring 46)
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👨‍👩‍👧 PARENTAL GENETIC INHERITANCE (MEIOSIS & FERTILIZATION)', centerX, 40);

        // Mother side (Egg 23)
        ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 300, 75, 170, 180);
        ctx.fillRect(centerX - 300, 75, 170, 180);

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('👩 MOTHER (EGG)', centerX - 215, 105);
        ctx.font = '28px sans-serif';
        ctx.fillText('🥚', centerX - 215, 150);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('23 Chromosomes', centerX - 215, 195);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText('Maternal Genes (50%)', centerX - 215, 220);

        // Plus symbol
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('+', centerX - 95, 165);

        // Father side (Sperm 23)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.strokeStyle = '#3b82f6';
        ctx.strokeRect(centerX - 60, 75, 170, 180);
        ctx.fillRect(centerX - 60, 75, 170, 180);

        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('👨 FATHER (SPERM)', centerX + 25, 105);
        ctx.font = '28px sans-serif';
        ctx.fillText('🧬', centerX + 25, 150);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('23 Chromosomes', centerX + 25, 195);
        ctx.fillStyle = '#93c5fd';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText('Paternal Genes (50%)', centerX + 25, 220);

        // Arrow to Offspring
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('➔', centerX + 145, 165);

        // Offspring (46 Chromosomes)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(centerX + 175, 75, 180, 180);
        ctx.fillRect(centerX + 175, 75, 180, 180);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText('👶 OFFSPRING (ZYGOTE)', centerX + 265, 105);
        ctx.font = '28px sans-serif';
        ctx.fillText('✨', centerX + 265, 150);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('46 Chromosomes', centerX + 265, 195);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText('23 Pairs (Diploid Set)', centerX + 265, 220);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('Children inherit equal genetic contribution from each biological parent!', centerX, 290);

      } else if (step === 4) {
        // STEP 5: Gene Combinations & Genetic Variation (Punnett Square)
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎨 GENE COMBINATIONS PRODUCE UNIQUE HUMAN VARIATION', centerX, 35);

        // Punnett Square Grid
        const gridX = centerX - 180, gridY = 70;
        const cellW = 100, cellH = 75;

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillText('Maternal Alleles ➔', gridX - 50, gridY + 60);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText('B (Brown)', gridX + 50, gridY - 10);
        ctx.fillText('b (Blue)', gridX + 150, gridY - 10);

        ctx.fillStyle = '#f43f5e';
        ctx.fillText('B', gridX - 15, gridY + 38);
        ctx.fillText('b', gridX - 15, gridY + 112);

        // 4 boxes
        const boxes = [
          { x: gridX, y: gridY, allele: 'BB', desc: 'Brown Eyes (Homozygous Dominant)', col: 'rgba(245, 158, 11, 0.25)' },
          { x: gridX + cellW, y: gridY, allele: 'Bb', desc: 'Brown Eyes (Heterozygous)', col: 'rgba(245, 158, 11, 0.2)' },
          { x: gridX, y: gridY + cellH, allele: 'Bb', desc: 'Brown Eyes (Heterozygous)', col: 'rgba(245, 158, 11, 0.2)' },
          { x: gridX + cellW, y: gridY + cellH, allele: 'bb', desc: 'Blue Eyes (Homozygous Recessive)', col: 'rgba(56, 189, 248, 0.35)' }
        ];

        boxes.forEach(b => {
          ctx.fillStyle = b.col;
          ctx.fillRect(b.x, b.y, cellW, cellH);
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(b.x, b.y, cellW, cellH);

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 18px monospace';
          ctx.fillText(b.allele, b.x + cellW / 2, b.y + 32);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '9px Outfit, sans-serif';
          ctx.fillText(b.allele === 'bb' ? 'Blue Eyes' : 'Brown Eyes', b.x + cellW / 2, b.y + 55);
        });

        // Trait variation cards on right
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(centerX + 70, gridY, 240, 155);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(centerX + 70, gridY, 240, 155);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🌟 INHERITED HUMAN TRAITS', centerX + 85, gridY + 25);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px Outfit, sans-serif';
        ctx.fillText('👁 Eye Color (Brown, Blue, Green)', centerX + 85, gridY + 50);
        ctx.fillText('🩸 Blood Groups (A, B, AB, O)', centerX + 85, gridY + 75);
        ctx.fillText('📏 Height & Polygenic Traits', centerX + 85, gridY + 100);
        ctx.fillText('🧬 Inherited Conditions', centerX + 85, gridY + 125);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Every human child is genetically unique due to independent assortment & recombination!', centerX, 275);
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
