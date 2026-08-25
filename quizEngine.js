// BioProcess Gamified Quiz & Topic Mastery Engine with Live Video Synchronization
class BioQuizEngine {
  constructor() {
    this.currentTopicId = 'dnaGenetics';
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.totalXp = parseInt(localStorage.getItem('bioprocess_xp') || '0');
    this.unlockedBadges = JSON.parse(localStorage.getItem('bioprocess_badges') || '[]');
    this.isQuizActive = false;

    // Structured questions with explicit mapping to topic & exact animation step (0 to 4)
    this.quizzes = {
      dnaGenetics: [
        {
          stepIdx: 0,
          conceptTitle: "Double Helix & Hydrogen Base Pairing",
          q: "Which nitrogenous base pairs with Adenine (A) in a double-stranded DNA molecule?",
          options: ["Thymine (T)", "Cytosine (C)", "Guanine (G)", "Uracil (U)"],
          correct: 0,
          explanation: "In DNA, Adenine (A) always pairs with Thymine (T) via 2 hydrogen bonds (Chargaff's Rule). Cytosine pairs with Guanine via 3 hydrogen bonds.",
          videoHint: "Watch Step 1: Base pairing between antiparallel sugar-phosphate strands."
        },
        {
          stepIdx: 1,
          conceptTitle: "DNA Helicase Unwinding",
          q: "Which enzyme is responsible for unwinding the DNA double helix at the replication fork?",
          options: ["DNA Helicase", "DNA Polymerase III", "DNA Ligase", "RNA Primase"],
          correct: 0,
          explanation: "DNA Helicase uses ATP hydrolysis energy to break hydrogen bonds between complementary base pairs, unzipping the helix.",
          videoHint: "Watch Step 2: The yellow Helicase enzyme breaking hydrogen bonds at the replication fork."
        },
        {
          stepIdx: 3,
          conceptTitle: "DNA Polymerase III & Okazaki Synthesis",
          q: "Why is the lagging strand synthesized discontinuously as Okazaki fragments?",
          options: [
            "DNA Polymerase can only synthesize DNA in the 5' to 3' direction",
            "RNA primers cannot bind to the lagging strand",
            "Helicase only unzips one strand at a time",
            "Ligase slows down nucleotide binding"
          ],
          correct: 0,
          explanation: "Because DNA Polymerase can only add new dNTPs to a free 3'-OH end, the lagging strand (running 3' to 5' toward the fork) must be built backward in short fragments.",
          videoHint: "Watch Step 4: Leading vs Lagging strand elongation in the 5' to 3' direction."
        },
        {
          stepIdx: 4,
          conceptTitle: "DNA Ligase Sealing",
          q: "What is the primary role of DNA Ligase during replication?",
          options: [
            "Seal phosphodiester backbone gaps between adjacent Okazaki fragments",
            "Synthesize complementary RNA primers",
            "Proofread mispaired nucleotides",
            "Melt hydrogen bonds"
          ],
          correct: 0,
          explanation: "DNA Ligase catalyzes covalent phosphodiester bonds to join the sugar-phosphate backbones of adjacent fragments into continuous sister double helices.",
          videoHint: "Watch Step 5: DNA Ligase completing two identical sister double helices."
        }
      ],

      circulatory: [
        {
          stepIdx: 4,
          conceptTitle: "Left Ventricular High-Pressure Ejection",
          q: "Why is the myocardium (muscle wall) of the Left Ventricle significantly thicker than the Right Ventricle?",
          options: [
            "It must generate high pressure (120 mmHg) to pump blood through systemic circulation",
            "It stores more deoxygenated blood",
            "It contains the Sinoatrial pacemaker node",
            "It pumps blood only to the coronary sinus"
          ],
          correct: 0,
          explanation: "The left ventricle pumps oxygenated blood against high systemic vascular resistance to the entire body, requiring 3x thicker muscle walls.",
          videoHint: "Watch Step 5: The left ventricle contracting to propel blood through the Aorta."
        },
        {
          stepIdx: 2,
          conceptTitle: "Pulmonary Arterial Flow & Lung Oxygenation",
          q: "Which blood vessel is unique in carrying deoxygenated blood AWAY from the heart?",
          options: ["Pulmonary Artery", "Aorta", "Pulmonary Vein", "Superior Vena Cava"],
          correct: 0,
          explanation: "Unlike all other arteries which carry oxygen-rich blood, the Pulmonary Artery transports deoxygenated blood from the Right Ventricle to the lungs for gas exchange.",
          videoHint: "Watch Step 3: Deoxygenated blood flowing through the pulmonary artery to lung capillaries."
        },
        {
          stepIdx: 1,
          conceptTitle: "Sinoatrial (SA) Node & Ventricular Systole",
          q: "What is the natural intrinsic electrical pacemaker that initiates heartbeats?",
          options: ["Sinoatrial (SA) Node", "Atrioventricular (AV) Node", "Bundle of His", "Purkinje Fibers"],
          correct: 0,
          explanation: "The SA node in the upper right atrium spontaneously depolarizes at 60-100 BPM to trigger coordinated atrial systole.",
          videoHint: "Watch Step 2: The tricuspid valve opening and electrical ventricular systole."
        }
      ],

      respiratory: [
        {
          stepIdx: 1,
          conceptTitle: "Diaphragm Contraction & Boyle's Law",
          q: "According to Boyle's Law, what happens inside the thoracic cavity when the diaphragm contracts downward?",
          options: [
            "Thoracic volume increases, decreasing internal pressure so air rushes in",
            "Thoracic volume decreases, forcing air out",
            "Intrapleural pressure rises above 760 mmHg",
            "Alveoli collapse due to high surface tension"
          ],
          correct: 0,
          explanation: "Boyle's law states pressure and volume are inversely proportional. Diaphragm contraction increases lung volume, dropping intrapulmonary pressure below atmospheric pressure to draw air in.",
          videoHint: "Watch Step 2: Diaphragmatic downward motion creating negative intrapleural pressure."
        },
        {
          stepIdx: 3,
          conceptTitle: "Alveolar Gas Exchange & Surfactant",
          q: "What critical substance is secreted by Type II alveolar cells to prevent alveolar collapse during exhalation?",
          options: ["Pulmonary Surfactant", "Carbonic Anhydrase", "Pepsinogen", "Hemoglobin"],
          correct: 0,
          explanation: "Pulmonary surfactant reduces fluid surface tension inside alveoli, preventing collapse (atelectasis) and easing work of breathing.",
          videoHint: "Watch Step 4: Oxygen diffusion across the alveolar capillary membrane."
        },
        {
          stepIdx: 4,
          conceptTitle: "Carbon Dioxide Transport & Bicarbonate",
          q: "How is the majority (approx 70%) of carbon dioxide transported in human blood?",
          options: [
            "As Bicarbonate ions (HCO₃⁻) in blood plasma",
            "Dissolved directly as CO₂ gas bubbles",
            "Bound to hemoglobin as carbaminohemoglobin",
            "Stored inside white blood cells"
          ],
          correct: 0,
          explanation: "Carbonic anhydrase converts CO₂ and H₂O into carbonic acid, which dissociates into H⁺ and Bicarbonate (HCO₃⁻) for safe transport in plasma.",
          videoHint: "Watch Step 5: Carbon dioxide exhalation and elastic lung recoil."
        }
      ],

      nervous: [
        {
          stepIdx: 0,
          conceptTitle: "Resting Membrane Potential (-70 mV)",
          q: "How does the sodium-potassium pump (Na⁺/K⁺ ATPase) maintain the resting membrane potential of -70 mV?",
          options: [
            "Pumps 3 Na⁺ ions OUT for every 2 K⁺ ions pumped IN, consuming 1 ATP",
            "Pumps 3 K⁺ ions OUT for every 2 Na⁺ ions pumped IN",
            "Diffuses calcium ions passively across the membrane",
            "Transports neurotransmitters across synaptic vesicles"
          ],
          correct: 0,
          explanation: "The electrogenic Na⁺/K⁺ pump exports 3 positive sodium charges while importing only 2 potassium charges, maintaining intracellular negativity (-70 mV).",
          videoHint: "Watch Step 1: Active ion distribution across the dendritic resting membrane."
        },
        {
          stepIdx: 2,
          conceptTitle: "Voltage-Gated Na+ Influx (+30 mV)",
          q: "During an action potential, what causes the rapid spike in membrane potential up to +30 mV (depolarization)?",
          options: [
            "Massive influx of Na⁺ through voltage-gated sodium channels",
            "Efflux of K⁺ through potassium leak channels",
            "Exocytosis of GABA neurotransmitter",
            "Hyperpolarization of the axon hillock"
          ],
          correct: 0,
          explanation: "When threshold (-55 mV) is reached, voltage-gated Na⁺ channels rapidly open, allowing Na⁺ ions to rush down their electrochemical gradient into the neuron.",
          videoHint: "Watch Step 3: Rapid sodium influx driving the electrical action potential spike."
        },
        {
          stepIdx: 3,
          conceptTitle: "Repolarization & Saltatory Conduction",
          q: "What is the term for the rapid leaping of action potentials between Nodes of Ranvier along myelinated axons?",
          options: ["Saltatory Conduction", "Synaptic Summation", "Refractory Propagation", "Graded Depolarization"],
          correct: 0,
          explanation: "Myelin sheaths insulate axon segments, forcing electrical impulses to jump from node to node (Saltatory Conduction) at speeds over 100 m/s.",
          videoHint: "Watch Step 4: Impulse jumping across myelinated Nodes of Ranvier."
        }
      ],

      photosynthesis: [
        {
          stepIdx: 1,
          conceptTitle: "Photolysis of Water in Photosystem II",
          q: "Where does the oxygen (O₂) gas released during photosynthesis originally come from?",
          options: [
            "The photolysis (splitting) of Water (H₂O) in Photosystem II",
            "Carbon dioxide (CO₂) split in the Calvin cycle",
            "Glucose breakdown in mitochondria",
            "Chlorophyll pigment degradation"
          ],
          correct: 0,
          explanation: "Light energy absorbed by Photosystem II splits water molecules (2H₂O ➔ 4H⁺ + 4e⁻ + O₂), releasing oxygen gas as a byproduct.",
          videoHint: "Watch Step 2: Manganese complex splitting water and evolving oxygen gas."
        },
        {
          stepIdx: 4,
          conceptTitle: "RuBisCO & Stromal Carbon Fixation",
          q: "Which stromal enzyme is responsible for fixing atmospheric CO₂ onto Ribulose 1,5-bisphosphate (RuBP)?",
          options: ["RuBisCO", "ATP Synthase", "DNA Polymerase", "Amylase"],
          correct: 0,
          explanation: "RuBisCO is the primary catalyst of carbon fixation in the Calvin cycle, converting inorganic CO₂ into organic 3-PGA precursors.",
          videoHint: "Watch Step 5: RuBisCO fixing carbon dioxide to synthesize glucose."
        },
        {
          stepIdx: 3,
          conceptTitle: "Photosystem I & NADPH Synthesis",
          q: "What two high-energy molecules produced during the light-dependent reactions power the Calvin cycle?",
          options: ["ATP and NADPH", "Glucose and Oxygen", "ADP and NADP⁺", "Pyruvate and FADH₂"],
          correct: 0,
          explanation: "Thylakoid light reactions generate ATP (via photophosphorylation) and NADPH (via electron transport), which are consumed in the stroma to synthesize glucose.",
          videoHint: "Watch Step 4: Ferredoxin reducing NADP+ to NADPH."
        }
      ],

      cellStructure: [
        {
          stepIdx: 3,
          conceptTitle: "Mitochondrial Cristae & ATP Respiration",
          q: "Which organelle features extensive inner membrane folds called cristae to generate cellular ATP energy?",
          options: ["Mitochondria", "Lysosome", "Golgi Apparatus", "Endoplasmic Reticulum"],
          correct: 0,
          explanation: "Mitochondrial cristae provide massive surface area for electron transport chain complexes and ATP Synthase during oxidative phosphorylation.",
          videoHint: "Watch Step 4: The inner mitochondrial membrane cristae in motion."
        },
        {
          stepIdx: 4,
          conceptTitle: "Plant Cell Wall, Chloroplast & Vacuole",
          q: "Which combination of organelles is found in plant cells but absent in animal cells?",
          options: [
            "Cellulose Cell Wall, Chloroplasts, and Large Central Vacuole",
            "Centrioles, Lysosomes, and Ribosomes",
            "Plasma Membrane, Nucleus, and Mitochondria",
            "Rough ER, Smooth ER, and Golgi Bodies"
          ],
          correct: 0,
          explanation: "Plant cells possess rigid cellulose cell walls, photosynthetic chloroplasts, and large central vacuoles for turgor pressure.",
          videoHint: "Watch Step 5: Plant cell specialized organelles and central vacuole."
        },
        {
          stepIdx: 3,
          conceptTitle: "Endosymbiotic Origins",
          q: "What evidence supports the Endosymbiotic Origin of mitochondria and chloroplasts?",
          options: [
            "They possess their own circular DNA and 70S ribosomes and replicate by binary fission",
            "They are single-layered lipid droplets",
            "They lack double membranes",
            "They are synthesized directly by the nucleolus"
          ],
          correct: 0,
          explanation: "Mitochondria and chloroplasts retain circular prokaryotic genomes, 70S ribosomes, and double membranes reflecting ancestral engulfment.",
          videoHint: "Watch Step 4: Mitochondrial genome and dual membrane boundaries."
        }
      ],

      microorganisms: [
        {
          stepIdx: 1,
          conceptTitle: "Gram Stain & Peptidoglycan Cell Wall",
          q: "Why do Gram-positive bacteria retain crystal violet stain (appearing purple) while Gram-negative bacteria counterstain pink?",
          options: [
            "Gram-positive bacteria have a thick peptidoglycan cell wall",
            "Gram-negative bacteria lack cell membranes entirely",
            "Gram-positive bacteria produce endospores",
            "Gram-negative bacteria have no outer LPS layer"
          ],
          correct: 0,
          explanation: "Thick peptidoglycan layers trap the crystal violet-iodine complex in Gram-positive cells, whereas Gram-negative cells have thin peptidoglycan beneath an outer LPS membrane.",
          videoHint: "Watch Step 2: Peptidoglycan thickness comparison under the microscope."
        },
        {
          stepIdx: 3,
          conceptTitle: "Kirby-Bauer Zone of Inhibition",
          q: "What is the clear zone surrounding an antibiotic disc on a bacterial agar lawn called?",
          options: ["Zone of Inhibition", "Zone of Lysis", "Colony Forming Unit", "Capsule Halo"],
          correct: 0,
          explanation: "The Zone of Inhibition measures bacterial susceptibility; larger clear diameters indicate higher antimicrobial effectiveness.",
          videoHint: "Watch Step 4: Antibiotic diffusion creating clear zones of inhibition."
        },
        {
          stepIdx: 4,
          conceptTitle: "Plasmid Conjugation & R-Plasmids",
          q: "How can bacteria rapidly transfer antibiotic resistance genes across populations?",
          options: [
            "Horizontal gene transfer via plasmid conjugation (sex pili)",
            "Meiotic sexual reproduction",
            "Binary fission mutation only",
            "Photosynthetic carbon fixation"
          ],
          correct: 0,
          explanation: "Conjugative R-plasmids carry multi-drug resistance genes that are directly transferred between living bacterial cells through conjugation tubes.",
          videoHint: "Watch Step 5: Sex pilus plasmid exchange between bacterial cells."
        }
      ],

      digestive: [
        {
          stepIdx: 2,
          conceptTitle: "Gastric HCl & Pepsin Activation",
          q: "What is the function of Hydrochloric Acid (HCl) secreted by gastric parietal cells?",
          options: [
            "Denature dietary proteins, activate pepsinogen into pepsin, and kill ingested microbes",
            "Emulsify dietary lipid triglycerides",
            "Absorb water in the colon",
            "Digest complex starch into glucose"
          ],
          correct: 0,
          explanation: "Gastric acid (pH 1.5-2) creates the optimum acidic environment for pepsin activation and microbial defense.",
          videoHint: "Watch Step 3: Gastric churning and acid denaturation of food boluses."
        },
        {
          stepIdx: 3,
          conceptTitle: "Bile Salt Lipid Emulsification",
          q: "What is the physiological role of liver bile in digestion?",
          options: [
            "Emulsifies large fat globules into microscopic micelles for pancreatic lipase digestion",
            "Contains protease enzymes to hydrolyze proteins",
            "Synthesizes intrinsic factor for vitamin B12",
            "Reclaims water from intestinal chyme"
          ],
          correct: 0,
          explanation: "Bile salts are amphipathic molecules that physically emulsify fats to increase lipid surface area for water-soluble lipases.",
          videoHint: "Watch Step 4: Bile salts emulsifying lipid droplets in the duodenum."
        },
        {
          stepIdx: 4,
          conceptTitle: "Villi & Microvillar Nutrient Absorption",
          q: "Where does over 90% of all chemical nutrient absorption into blood and lymph take place?",
          options: ["Small Intestine (Villi & Microvilli)", "Stomach", "Esophagus", "Large Intestine"],
          correct: 0,
          explanation: "The small intestine's folded mucosa, villi, and microvillar brush border provide over 300 m² of absorptive surface area.",
          videoHint: "Watch Step 5: Active nutrient transport into intestinal capillaries and lacteals."
        }
      ],

      animalClass: [
        {
          stepIdx: 2,
          conceptTitle: "4 Chordate Developmental Hallmarks",
          q: "Which four anatomical characteristics define all chordates at some stage of embryological development?",
          options: [
            "Notochord, dorsal hollow nerve cord, pharyngeal slits, post-anal tail",
            "Exoskeleton, jointed legs, open circulation, compound eyes",
            "Mammary glands, amniotic egg, 4-chamber heart, hair",
            "Radial symmetry, cnidocytes, gastrovascular cavity, nerve net"
          ],
          correct: 0,
          explanation: "The 4 universal chordate hallmarks are a flexible notochord, dorsal tubular nerve cord, pharyngeal gill slits/clefts, and a post-anal muscular tail.",
          videoHint: "Watch Step 3: Embryonic notochord and dorsal nerve cord development."
        },
        {
          stepIdx: 1,
          conceptTitle: "Invertebrate Diversity (>95%)",
          q: "What percentage of all documented animal species on Earth are Invertebrates (lacking a vertebral column)?",
          options: ["Over 95%", "Around 50%", "Roughly 25%", "Less than 10%"],
          correct: 0,
          explanation: "Over 95% of animal diversity belongs to invertebrate phyla, with arthropods (insects, arachnids, crustaceans) dominating global biodiversity.",
          videoHint: "Watch Step 2: Arthropods, mollusks, and invertebrate body plans."
        },
        {
          stepIdx: 3,
          conceptTitle: "Amniotic Egg Terrestrial Evolution",
          q: "Which evolutionary adaptation allowed amniote tetrapods (reptiles, birds, mammals) to reproduce on dry land without returning to water?",
          options: ["Amniotic egg with protective extraembryonic membranes", "2-chambered hearts", "Moist cutaneous respiration", "Gills and swim bladders"],
          correct: 0,
          explanation: "The amniotic egg provides a self-contained aquatic microenvironment (amnion, yolk sac, chorion, allantois) enabling terrestrial reproduction.",
          videoHint: "Watch Step 4: Amniotic egg membrane layers supporting land embryos."
        }
      ],

      ecosystem: [
        {
          stepIdx: 1,
          conceptTitle: "Lindeman's 10% Ecological Energy Law",
          q: "According to Lindeman's 10% Ecological Law, if primary producers store 10,000 J of biomass energy, how much energy is transferred to secondary consumers (carnivores)?",
          options: ["100 Joules", "1,000 Joules", "10 Joules", "5,000 Joules"],
          correct: 0,
          explanation: "Producers (10,000 J) ➔ Primary Consumers (1,000 J, 10%) ➔ Secondary Consumers (100 J, 10%). 90% is lost as metabolic heat and waste at each tier.",
          videoHint: "Watch Step 2: Trophic energy loss and metabolic heat dissipation."
        },
        {
          stepIdx: 3,
          conceptTitle: "Apex Predators & Keystone Cascades",
          q: "What is a 'Keystone Species' in an ecological community?",
          options: [
            "A species that exerts top-down control disproportionate to its abundance, maintaining biodiversity",
            "The most abundant plant in a forest",
            "A decomposer that feeds exclusively on detritus",
            "An invasive species that damages habitats"
          ],
          correct: 0,
          explanation: "Keystone predators (e.g. Sea Otters in kelp forests, Wolves in Yellowstone) prevent competitive exclusion and preserve ecosystem stability.",
          videoHint: "Watch Step 4: Top-down apex predator cascades and ecosystem balance."
        },
        {
          stepIdx: 4,
          conceptTitle: "Energy Flow vs Nutrient Cycling",
          q: "What is the critical difference between Energy and Nutrients in an ecosystem?",
          options: [
            "Energy flows unidirectionally and is dissipated as heat; Nutrients cycle perpetually",
            "Energy is recycled indefinitely; Nutrients are lost to outer space",
            "Both energy and matter cycle in closed loops",
            "Neither energy nor nutrients are conserved"
          ],
          correct: 0,
          explanation: "Energy flows from the sun through food webs and dissipates as metabolic heat (thermodynamics); chemical nutrients (C, N, P) cycle continuously through biogeochemical loops.",
          videoHint: "Watch Step 5: Decomposers recycling mineral nutrients into the soil."
        }
      ]
    };
  }

  openQuiz(topicId = null) {
    if (topicId) this.currentTopicId = topicId;
    else this.currentTopicId = window.bioApp?.activeTopicId || 'dnaGenetics';

    this.currentQuestionIdx = 0;
    this.score = 0;
    this.isQuizActive = true;

    // Ensure main app loads this topic in the background so video is synchronized
    if (window.bioApp && window.bioApp.activeTopicId !== this.currentTopicId) {
      window.bioApp.loadTopic(this.currentTopicId);
    }

    const modal = document.getElementById('quiz-mastery-modal');
    if (!modal) return;

    modal.classList.add('open');
    if (window.bioAudio) window.bioAudio.playClick();

    const topicData = window.bioTopics ? window.bioTopics[this.currentTopicId] : null;
    const topicTitle = topicData?.title || 'Biology Knowledge Challenge';

    if (window.drHelix) {
      window.drHelix.say(`Starting ${topicTitle} quiz challenge. The live animated video will sync with each question!`, 'excited');
    }

    this.renderQuestion();
  }

  closeQuiz() {
    const modal = document.getElementById('quiz-mastery-modal');
    if (modal) modal.classList.remove('open');
    this.isQuizActive = false;
  }

  renderQuestion() {
    const container = document.getElementById('quiz-modal-body-root');
    if (!container) return;

    const questions = this.quizzes[this.currentTopicId] || [];
    if (this.currentQuestionIdx >= questions.length) {
      this.renderResults();
      return;
    }

    const qData = questions[this.currentQuestionIdx];
    const topicData = window.bioTopics ? window.bioTopics[this.currentTopicId] : null;

    // CRITICAL: Automatically synchronize the background video animation to the exact step for this question!
    this.syncVideoToStep(qData.stepIdx);

    container.innerHTML = `
      <div class="quiz-question-container">
        <!-- Progress Bar -->
        <div class="quiz-progress-bar-wrap">
          <div class="quiz-progress-fill" style="width: ${((this.currentQuestionIdx + 1) / questions.length) * 100}%;"></div>
        </div>

        <!-- Meta Header -->
        <div class="quiz-meta-row">
          <span class="quiz-question-chip">
            ${topicData?.icon || '🔬'} Question ${this.currentQuestionIdx + 1} of ${questions.length}
          </span>
          <span class="quiz-score-badge">Score: ${this.score}/${this.currentQuestionIdx} | ⭐ +50 XP</span>
        </div>

        <!-- LIVE VIDEO COMPANION BADGE -->
        <div class="quiz-video-companion-card" id="quiz-video-companion">
          <div class="companion-left">
            <span class="companion-live-dot"></span>
            <div>
              <span class="companion-title">🔴 LIVE VIDEO SYNCED: Step ${qData.stepIdx + 1} – ${qData.conceptTitle}</span>
              <span class="companion-hint">${qData.videoHint}</span>
            </div>
          </div>
          <button class="companion-focus-btn" id="btn-focus-step-anim" title="Replay & Focus Animation">
            🔁 Replay Step
          </button>
        </div>

        <!-- Question Prompt -->
        <h3 class="quiz-question-prompt">${qData.q}</h3>

        <!-- Options Grid -->
        <div class="quiz-options-grid">
          ${qData.options.map((opt, idx) => `
            <button class="quiz-option-card" data-idx="${idx}">
              <span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="quiz-opt-label">${opt}</span>
            </button>
          `).join('')}
        </div>

        <!-- Feedback Box -->
        <div class="quiz-feedback-banner" id="quiz-feedback-banner" style="display: none;"></div>

        <!-- Controls Row -->
        <div class="quiz-controls-row">
          <span class="quiz-voice-hint">🎙️ Speak <strong>"Option A"</strong>, <strong>"Option B"</strong>, etc.</span>
          <button class="quiz-btn-skip" id="btn-quiz-skip">Next Question ⏭</button>
        </div>
      </div>
    `;

    // Bind Option clicks
    container.querySelectorAll('.quiz-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.idx);
        this.submitAnswer(idx);
      });
    });

    // Bind Replay Step Animation button
    document.getElementById('btn-focus-step-anim')?.addEventListener('click', () => {
      this.syncVideoToStep(qData.stepIdx, true);
    });

    // Skip Button
    const skipBtn = document.getElementById('btn-quiz-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.currentQuestionIdx++;
        this.renderQuestion();
      });
    }

    // Spoken question
    if (window.bioSpeech && window.bioSpeech.enabled) {
      window.bioSpeech.speak(`Question ${this.currentQuestionIdx + 1}: ${qData.q}`);
    }
  }

  syncVideoToStep(stepIdx, restart = false) {
    if (!window.bioApp) return;

    // Load topic if mismatched
    if (window.bioApp.activeTopicId !== this.currentTopicId) {
      window.bioApp.loadTopic(this.currentTopicId);
    }

    const currentTopic = window.bioApp.currentTopicInstance;
    if (currentTopic && currentTopic.seekStep) {
      currentTopic.seekStep(stepIdx, false);
      if (currentTopic.state) {
        currentTopic.state.isPlaying = true;
      }
    }

    if (window.bioStudyNotesUI) {
      window.bioStudyNotesUI.setStep(stepIdx);
    }
  }

  submitAnswer(selectedIdx) {
    const questions = this.quizzes[this.currentTopicId];
    const qData = questions[this.currentQuestionIdx];
    const isCorrect = selectedIdx === qData.correct;

    const feedback = document.getElementById('quiz-feedback-banner');
    const container = document.getElementById('quiz-modal-body-root');
    if (!container) return;

    const allCards = container.querySelectorAll('.quiz-option-card');
    allCards.forEach((c, i) => {
      c.disabled = true;
      if (i === qData.correct) c.classList.add('correct');
      if (i === selectedIdx && !isCorrect) c.classList.add('wrong');
    });

    if (isCorrect) {
      this.score++;
      this.addXp(50);
      if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = 'quiz-feedback-banner correct';
        feedback.innerHTML = `<span>✨ <strong>Correct!</strong> ${qData.explanation}</span>`;
      }
      if (window.bioAudio) window.bioAudio.playSuccess();
      if (window.drHelix) window.drHelix.say(`That's correct! ${qData.explanation}`, 'celebrating', true);
    } else {
      if (feedback) {
        feedback.style.display = 'flex';
        feedback.className = 'quiz-feedback-banner wrong';
        feedback.innerHTML = `<span>💡 <strong>Nice try!</strong> ${qData.explanation}</span>`;
      }
      if (window.drHelix) window.drHelix.say(`Good attempt. The correct answer is option ${String.fromCharCode(65 + qData.correct)}. ${qData.explanation}`, 'explaining', true);
    }

    setTimeout(() => {
      this.currentQuestionIdx++;
      this.renderQuestion();
    }, 3200);
  }

  answerByLetter(letter) {
    if (!this.isQuizActive) return;
    const charCode = letter.toUpperCase().charCodeAt(0);
    const idx = charCode - 65; // A=0, B=1, C=2, D=3
    if (idx >= 0 && idx < 4) {
      this.submitAnswer(idx);
    }
  }

  renderResults() {
    const container = document.getElementById('quiz-modal-body-root');
    if (!container) return;

    const questions = this.quizzes[this.currentTopicId] || [];
    const passed = this.score === questions.length;
    const topicData = window.bioTopics ? window.bioTopics[this.currentTopicId] : null;
    const badgeName = topicData?.badgeName || 'Biology Master';
    const topicIcon = topicData?.icon || '🏆';

    if (passed && !this.unlockedBadges.includes(this.currentTopicId)) {
      this.unlockedBadges.push(this.currentTopicId);
      localStorage.setItem('bioprocess_badges', JSON.stringify(this.unlockedBadges));
      this.addXp(150);
      if (window.bioAudio) window.bioAudio.playFanfare();
      if (window.drHelix) {
        window.drHelix.say(`Outstanding scientific achievement! You scored 100% and unlocked the ${badgeName} badge!`, 'celebrating', true);
      }
    }

    container.innerHTML = `
      <div class="quiz-results-container">
        <div class="results-trophy-icon">${passed ? '🏆' : '🔬'}</div>
        <h3 class="results-main-title">${passed ? 'Topic Mastered with 100% Score!' : 'Quiz Challenge Completed!'}</h3>
        
        <p class="results-score-summary">
          You scored <strong>${this.score} out of ${questions.length}</strong> questions correct (${Math.round((this.score / questions.length) * 100)}%).
        </p>

        ${passed ? `
          <div class="mastery-badge-award-card">
            <span class="badge-big-icon">${topicIcon}</span>
            <div class="badge-award-meta">
              <span class="badge-award-tag">🏆 OFFICIAL MASTERY BADGE</span>
              <h4 class="badge-award-name">${badgeName}</h4>
              <p class="badge-award-desc">Awarded for demonstrating total mastery of biological mechanisms and concepts.</p>
            </div>
          </div>
        ` : `
          <div class="quiz-review-tip-card">
            <span>💡 <strong>Student Tip:</strong> Review the 60 FPS animated process video and study notes on the left, then retry for full 100% badge mastery!</span>
          </div>
        `}

        <div class="results-button-group">
          <button class="quiz-action-btn primary" id="btn-quiz-restart">🔄 Retry Quiz</button>
          <button class="quiz-action-btn secondary" id="btn-quiz-done">🔬 Return to Lab</button>
        </div>
      </div>
    `;

    document.getElementById('btn-quiz-restart')?.addEventListener('click', () => {
      this.openQuiz(this.currentTopicId);
    });

    document.getElementById('btn-quiz-done')?.addEventListener('click', () => {
      this.closeQuiz();
    });
  }

  addXp(amount) {
    this.totalXp += amount;
    localStorage.setItem('bioprocess_xp', this.totalXp.toString());
  }
}

window.bioQuizEngine = new BioQuizEngine();
