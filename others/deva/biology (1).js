// 🧬 Biology & Life Sciences Interactive Module for G.ONE AI Study Studio & BioBuddy
// Comprehensive Cell Biology, Genetics, Photosynthesis, Physiology & Anatomy Visual Engine

(function(window) {
  'use strict';

  class BiologyModule {
    constructor() {
      this.activeTopic = 'cell'; // 'cell' | 'dna' | 'photosynthesis' | 'circulatory' | 'neuron'
      this.dnaAngle = 0;
      this.pulseTimer = 0;
      this.particles = [];
      this.initParticles();
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < 30; i++) {
        this.particles.push({
          x: Math.random() * 400 - 200,
          y: Math.random() * 200 - 100,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 3 + 2,
          color: ['#00f0ff', '#00ff88', '#ff007f', '#ffcf00'][Math.floor(Math.random() * 4)]
        });
      }
    }

    setTopic(topic) {
      this.activeTopic = topic;
      if (window.teachingEngine) {
        const lesson = this.getLessonForTopic(topic);
        if (lesson) {
          window.teachingEngine.currentLesson = lesson;
          window.teachingEngine.activeExample = lesson.examples[0];
          window.teachingEngine.speak(lesson.script);
          window.teachingEngine.renderNotesView();
        }
      }
    }

    getLessonForTopic(topic) {
      const topics = {
        'cell': {
          title: 'Cell Physiology: Animal vs Plant Cell Micro-Anatomy',
          objectType: 'biology_cell',
          subTopic: 'cell',
          script: "Look at the eukaryotic cell structure! The Nucleus stores genetic DNA, Mitochondria generate ATP energy currency, and Ribosomes synthesize proteins!",
          examples: [
            { text: "Mitochondria ATP Generation", speak: "Mitochondria convert nutrients through cellular respiration into ATP energy currency for the cell!", num1: "Nutrients + O₂ ➔ 36-38 ATP + CO₂" },
            { text: "Plant Cell Chloroplast", speak: "Chloroplasts contain chlorophyll pigments that capture sunlight photons to synthesize glucose sugar!", num1: "Light Energy ➔ Chemical Energy (ATP + NADPH)" }
          ],
          notes: [
            { title: "🧫 Core Organelles", content: "Nucleus (DNA center), Mitochondria (Energy powerhouse), Endoplasmic Reticulum (Protein packaging), Golgi Apparatus (Sorting)." },
            { title: "🌿 Plant vs Animal Cell", content: "Plant cells feature rigid Cellulose Cell Walls, Central Vacuoles, and Chloroplasts. Animal cells feature flexible lipid bilayers and Centrioles." }
          ]
        },
        'dna': {
          title: 'Genetics & Molecular Biology: DNA Double Helix Structure',
          objectType: 'biology_cell',
          subTopic: 'dna',
          script: "Behold the double helix DNA structure! Adenine pairs with Thymine via 2 hydrogen bonds, and Cytosine pairs with Guanine via 3 hydrogen bonds!",
          examples: [
            { text: "Base-Pairing Rule: A=T & G≡C", speak: "Chargaff's Rule: Adenine always binds to Thymine, and Cytosine always binds to Guanine across the antiparallel sugar-phosphate backbone!", num1: "A = T (2 H-Bonds) | G ≡ C (3 H-Bonds)" },
            { text: "Central Dogma of Biology", speak: "DNA transcribes into messenger RNA inside the nucleus, which translates into functional proteins on ribosomes!", num1: "DNA ➔ mRNA (Transcription) ➔ Protein (Translation)" }
          ],
          notes: [
            { title: "🧬 Nucleotide Composition", content: "Deoxyribose Pentose Sugar + Phosphate Group + Nitrogenous Base (Purines: A, G; Pyrimidines: T, C)." },
            { title: "⚡ Antiparallel Strands", content: "5' to 3' leading strand runs opposite to the 3' to 5' lagging strand with a major and minor helical groove." }
          ]
        },
        'photosynthesis': {
          title: 'Plant Physiology: Photosynthesis & Light Reactions',
          objectType: 'biology_cell',
          subTopic: 'photosynthesis',
          script: "Photosynthesis converts carbon dioxide and water into glucose sugar and oxygen using sunlight energy captured by chlorophyll thylakoids!",
          examples: [
            { text: "Overall Photosynthesis Reaction", speak: "Six molecules of carbon dioxide plus six molecules of water in the presence of sunlight yield one molecule of glucose plus six molecules of oxygen!", num1: "6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ + 6O₂" },
            { text: "Calvin Cycle (Light-Independent)", speak: "RuBisCO enzyme fixes carbon dioxide into 3-PGA, synthesizing high-energy glucose carbohydrates!", num1: "Carbon Fixation ➔ Reduction ➔ RuBP Regeneration" }
          ],
          notes: [
            { title: "☀️ Light Reactions", content: "Occur in Thylakoid membranes: Photolysis of water releases O₂ electrons and generates ATP & NADPH." },
            { title: "🍃 Calvin Cycle", content: "Occurs in Stroma: Uses ATP & NADPH to convert CO₂ into high-energy glucose (C₆H₁₂O₆)." }
          ]
        },
        'circulatory': {
          title: 'Human Physiology: 4-Chamber Heart & Cardiovascular Dynamics',
          objectType: 'biology_cell',
          subTopic: 'circulatory',
          script: "The human heart pumps oxygen-depleted blood from the Right Ventricle to lungs for oxygenation, and pumps oxygenated blood from the Left Ventricle to systemic tissues!",
          examples: [
            { text: "Cardiac Pumping Cycle", speak: "Diastole relaxes chambers to fill with blood; Systole contracts ventricles to propel blood into aorta and pulmonary arteries!", num1: "Cardiac Output = Stroke Volume × Heart Rate (BPM)" },
            { text: "Double Circulation System", speak: "Pulmonary circulation oxygenates blood in alveolar capillary beds; Systemic circulation delivers oxygen and nutrients to vital organs!", num1: "Right Heart (Deoxygenated) ➔ Lungs ➔ Left Heart (Oxygenated)" }
          ],
          notes: [
            { title: "❤️ 4 Heart Chambers", content: "Right Atrium, Right Ventricle, Left Atrium, Left Ventricle separated by Tricuspid, Bicuspid, and Semilunar valves." },
            { title: "⚡ SA Node Pacemaker", content: "Sinoatrial (SA) Node generates rhythmic electrical action potentials initiating atrial depolarization." }
          ]
        },
        'neuron': {
          title: 'Neurobiology: Neuron Synapse & Action Potential Transmission',
          objectType: 'biology_cell',
          subTopic: 'neuron',
          script: "Neurons transmit rapid electrical action potentials along myelinated axons, releasing neurotransmitters across synaptic clefts to communicate!",
          examples: [
            { text: "Action Potential Voltage Spike", speak: "Rapid influx of Sodium Na+ ions depolarizes membrane from -70 millivolts up to +30 millivolts, followed by Potassium K+ repolarization!", num1: "Resting: -70mV ➔ Depolarization: +30mV ➔ Repolarization" },
            { text: "Synaptic Vesicle Exocytosis", speak: "Calcium Ca2+ triggers vesicle fusion releasing acetylcholine neurotransmitters into the synaptic cleft!", num1: "Pre-Synaptic Terminal ➔ Neurotransmitter Cleft ➔ Post-Synaptic Receptors" }
          ],
          notes: [
            { title: "🧠 Neuron Anatomy", content: "Dendrites (receive signals), Soma (cell body), Axon (carries signal), Myelin Sheath (speeds conduction)." },
            { title: "⚡ Synaptic Transmission", content: "Chemical transmission converts electrical voltage into neurotransmitter ligands across 20nm clefts." }
          ]
        }
      };

      return topics[topic] || topics['cell'];
    }

    // Main Visual Blackboard Renderer for Biology
    drawBiologyVisuals(ctx, w, h, t) {
      const ex = (window.teachingEngine && window.teachingEngine.activeExample) || {};
      const lesson = (window.teachingEngine && window.teachingEngine.currentLesson) || {};
      const subTopic = lesson.subTopic || this.activeTopic || 'cell';

      const centerX = w * 0.67;
      const centerY = h * 0.44;

      this.pulseTimer += 0.03;

      ctx.save();

      if (subTopic === 'dna' || (lesson.title && lesson.title.toLowerCase().includes('dna'))) {
        this.drawDNAHelix(ctx, centerX, centerY, t);
      } else if (subTopic === 'photosynthesis' || (lesson.title && lesson.title.toLowerCase().includes('photo'))) {
        this.drawPhotosynthesisReactor(ctx, centerX, centerY, t);
      } else if (subTopic === 'circulatory' || (lesson.title && lesson.title.toLowerCase().includes('heart'))) {
        this.drawCirculatoryHeart(ctx, centerX, centerY, t);
      } else if (subTopic === 'neuron' || (lesson.title && lesson.title.toLowerCase().includes('neuron'))) {
        this.drawNeuronSynapse(ctx, centerX, centerY, t);
      } else {
        this.drawCellStructure(ctx, centerX, centerY, t);
      }

      ctx.restore();
    }

    // 1. Interactive Cell Structure Renderer
    drawCellStructure(ctx, cx, cy, t) {
      // Cell Outer Membrane (Fluid pulsation)
      const r = 85 + Math.sin(t * 2) * 2;
      
      ctx.save();
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
        const offset = Math.sin(angle * 4 + t * 3) * 3;
        const x = cx + Math.cos(angle) * (r + offset);
        const y = cy + Math.sin(angle) * (r * 0.7 + offset);
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Cytoplasm Micro-particles
      this.particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -60 || p.x > 60) p.vx *= -1;
        if (p.y < -40 || p.y > 40) p.vy *= -1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Nucleus Center
      const nucR = 28 + Math.sin(t * 3) * 1.5;
      const grad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, nucR);
      grad.addColorStop(0, '#a855f7');
      grad.addColorStop(0.7, '#6b21a8');
      grad.addColorStop(1, '#3b0764');

      ctx.beginPath();
      ctx.arc(cx, cy, nucR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Nucleolus
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 4, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f3e8ff';
      ctx.fill();

      // Mitochondria (Powerhouses)
      this.drawMitochondrion(ctx, cx - 50, cy - 30, t, -0.4);
      this.drawMitochondrion(ctx, cx + 45, cy + 25, t, 0.3);

      // Chloroplast (Plant Organelle)
      this.drawChloroplast(ctx, cx + 45, cy - 30, t);
      this.drawChloroplast(ctx, cx - 45, cy + 30, t);

      // Label Banner
      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#00ff88';
      ctx.textAlign = 'center';
      ctx.fillText('🔬 EUKARYOTIC CELL PHYSIOLOGY', cx, cy - 75);

      ctx.font = '600 11px "Outfit", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Nucleus (DNA) | Mitochondria (ATP) | Chloroplasts', cx, cy + 78);
      ctx.restore();
    }

    drawMitochondrion(ctx, x, y, t, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Cristae Folds
      ctx.strokeStyle = '#fee2e2';
      ctx.beginPath();
      ctx.moveTo(-10, 0); ctx.lineTo(-6, -4); ctx.lineTo(-2, 4); ctx.lineTo(2, -4); ctx.lineTo(6, 4); ctx.lineTo(10, 0);
      ctx.stroke();
      ctx.restore();
    }

    drawChloroplast(ctx, x, y, t) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 8, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Thylakoid Stacks (Grana)
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-8, -3, 4, 6);
      ctx.fillRect(-1, -4, 4, 8);
      ctx.fillRect(6, -3, 4, 6);
      ctx.restore();
    }

    // 2. DNA Double Helix 3D Rotation Renderer
    drawDNAHelix(ctx, cx, cy, t) {
      ctx.save();
      this.dnaAngle += 0.03;
      const numNodes = 14;
      const heightStep = 10;
      const startY = cy - 70;
      const radius = 55;

      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'center';
      ctx.fillText('🧬 DNA DOUBLE HELIX & BASE PAIRING', cx, cy - 85);

      for (let i = 0; i < numNodes; i++) {
        const y = startY + i * heightStep;
        const theta = this.dnaAngle + (i * 0.45);
        const x1 = cx + Math.sin(theta) * radius;
        const x2 = cx - Math.sin(theta) * radius;
        const z1 = Math.cos(theta);
        const z2 = -z1;

        // Base Pair Rung
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255, 0, 127, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Strand 1 (Adenine / Guanine)
        const scale1 = (z1 + 2) / 3;
        ctx.beginPath();
        ctx.arc(x1, y, 6 * scale1, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#00ff88';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Strand 2 (Thymine / Cytosine)
        const scale2 = (z2 + 2) / 3;
        ctx.beginPath();
        ctx.arc(x2, y, 6 * scale2, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#ff007f' : '#ffcf00';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.font = '700 11px "Outfit", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('🔵 Adenine (A) = 🔴 Thymine (T)  |  🟢 Guanine (G) ≡ 🟡 Cytosine (C)', cx, cy + 85);
      ctx.restore();
    }

    // 3. Photosynthesis Reactor Renderer
    drawPhotosynthesisReactor(ctx, cx, cy, t) {
      ctx.save();
      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#22c55e';
      ctx.textAlign = 'center';
      ctx.fillText('🌿 PHOTOSYNTHESIS CHLOROPLAST REACTION', cx, cy - 80);

      // Chloroplast Container
      ctx.fillStyle = 'rgba(21, 128, 61, 0.25)';
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(cx - 110, cy - 60, 220, 120, 16);
      ctx.fill();
      ctx.stroke();

      // Sunlight Photons Inflow
      const sunY = cy - 40 + Math.sin(t * 5) * 6;
      ctx.fillStyle = '#facc15';
      ctx.font = '800 12px "Outfit", sans-serif';
      ctx.fillText('☀️ Sunlight (Photons)', cx - 50, sunY);
      ctx.fillText('💧 6H₂O + 💨 6CO₂', cx - 50, cy + 20);

      // Chemical Reaction Arrow
      ctx.fillStyle = '#00f0ff';
      ctx.font = '900 18px "Space Grotesk", sans-serif';
      ctx.fillText('➔', cx + 15, cy - 5);

      // Products (Glucose + Oxygen)
      ctx.fillStyle = '#ffcf00';
      ctx.font = '800 13px "Space Grotesk", sans-serif';
      ctx.fillText('🍬 C₆H₁₂O₆ (Glucose)', cx + 65, cy - 15);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('🌬️ 6O₂ (Oxygen)', cx + 65, cy + 18);

      ctx.font = '600 11px "Outfit", sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText('Thylakoid Light Phase ➔ Stroma Calvin Cycle (CO₂ Fixation)', cx, cy + 78);
      ctx.restore();
    }

    // 4. Circulatory 4-Chamber Heart Renderer
    drawCirculatoryHeart(ctx, cx, cy, t) {
      ctx.save();
      const beat = (Math.sin(t * 8) > 0.6 ? 1.08 : 1.0);

      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('❤️ 4-CHAMBER CARDIAC CYCLE & DYNAMICS', cx, cy - 80);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(beat, beat);

      // Left Ventricle (Oxygenated Red)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.beginPath();
      ctx.ellipse(20, 10, 30, 40, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right Ventricle (Deoxygenated Blue)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
      ctx.beginPath();
      ctx.ellipse(-20, 10, 30, 40, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Atria Top Chambers
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.beginPath(); ctx.arc(18, -25, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.beginPath(); ctx.arc(-18, -25, 18, 0, Math.PI * 2); ctx.fill();

      // Labels on Chambers
      ctx.font = '800 10px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('RA', -18, -22);
      ctx.fillText('LA', 18, -22);
      ctx.fillText('RV', -20, 14);
      ctx.fillText('LV', 20, 14);
      ctx.restore();

      ctx.font = '700 11px "Outfit", sans-serif';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('BPM: 75 | Diastole Filling ➔ Systole Ejection (Cardiac Output: 5.0 L/min)', cx, cy + 78);
      ctx.restore();
    }

    // 5. Neuron Synapse Renderer
    drawNeuronSynapse(ctx, cx, cy, t) {
      ctx.save();
      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#a855f7';
      ctx.textAlign = 'center';
      ctx.fillText('🧠 SYNAPSE & ACTION POTENTIAL IMPULSE', cx, cy - 80);

      // Pre-Synaptic Terminal (Top)
      ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 35, 75, 25, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Post-Synaptic Membrane (Bottom)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.strokeStyle = '#60a5fa';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 35, 75, 25, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Neurotransmitter Vesicles Release into Cleft
      for (let i = -40; i <= 40; i += 16) {
        const vy = cy - 10 + ((t * 40 + i * 2) % 40);
        ctx.beginPath();
        ctx.arc(cx + i, vy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.font = '700 11px "Outfit", sans-serif';
      ctx.fillStyle = '#e9d5ff';
      ctx.fillText('Resting: -70mV ➔ Na+ Influx Peak: +30mV ➔ Neurotransmitter Exocytosis', cx, cy + 78);
      ctx.restore();
    }
  }

  // Instantiate and Attach to Window
  const biologyModule = new BiologyModule();
  window.BiologyModule = BiologyModule;
  window.biologyModule = biologyModule;

  // Enhance TeachingEngine if already initialized or on prototype
  if (window.TeachingEngine) {
    const originalDraw = window.TeachingEngine.prototype.updateAndDrawVisualObjects;
    window.TeachingEngine.prototype.updateAndDrawVisualObjects = function(ctx, width, height) {
      if (this.currentLesson && (this.currentLesson.objectType === 'biology_cell' || this.currentLessonKey === 'biology')) {
        this.animationTimer += 0.025;
        const t = this.animationTimer;
        ctx.save();
        this.drawTeacherBlackboard(ctx, width, height, t);
        window.biologyModule.drawBiologyVisuals(ctx, width, height, t);
        ctx.restore();
        return;
      }
      if (originalDraw) {
        originalDraw.call(this, ctx, width, height);
      }
    };
  }

  // Extend Curriculum with specialized biology lessons
  if (window.LESSON_CURRICULUM) {
    window.LESSON_CURRICULUM['biology_dna'] = biologyModule.getLessonForTopic('dna');
    window.LESSON_CURRICULUM['biology_photosynthesis'] = biologyModule.getLessonForTopic('photosynthesis');
    window.LESSON_CURRICULUM['biology_circulatory'] = biologyModule.getLessonForTopic('circulatory');
    window.LESSON_CURRICULUM['biology_neuron'] = biologyModule.getLessonForTopic('neuron');
  }

})(window);
