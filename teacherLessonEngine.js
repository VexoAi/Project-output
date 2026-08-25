// BioProcess AI Biology Teacher Lesson Engine (8-Step Pedagogical Architecture)
class TeacherLessonEngine {
  constructor() {
    this.isActive = false;
    this.currentTopicId = 'dnaGenetics';
    this.currentStage = 1; // Stages 1 to 8

    this.curriculumLessons = {
      dnaGenetics: {
        title: "DNA & Genetics",
        icon: "🧬",
        whatToTeach: "DNA is the molecule that stores genetic information. Genes are sections of DNA that influence characteristics. Genetic information is passed from parents to offspring through reproductive cells.",
        steps: [
          "1. Introduce DNA as the master genetic material.",
          "2. Show the double-helix structure and antiparallel strands.",
          "3. Explain chemical base pairing: Adenine (A), Thymine (T), Cytosine (C), and Guanine (G).",
          "4. Explain that specific sections of DNA are called genes.",
          "5. Show DNA packaged into chromosomes inside the nucleus.",
          "6. Explain that offspring receive genetic material from both parents.",
          "7. Show how different gene combinations produce human variation.",
          "8. Test understanding with an interactive question."
        ],
        example: "Parent ➔ DNA ➔ Genes ➔ Reproductive cells ➔ Offspring (e.g. Blood group is influenced by inherited genes)",
        animationScript: "Character holds a DNA model ➔ DNA zooms in ➔ gene is highlighted ➔ chromosomes appear ➔ parent and child appear.",
        interactiveQ: {
          q: "What chemical base always pairs with Adenine (A) in a DNA double helix?",
          options: ["Thymine (T)", "Guanine (G)", "Cytosine (C)"],
          correct: 0,
          explanation: "Adenine (A) always pairs with Thymine (T) via 2 hydrogen bonds, while Cytosine (C) pairs with Guanine (G) via 3 hydrogen bonds."
        },
        narration: {
          intro: "Hello students! I'm Dr. Helix, your AI Biology Teacher. Today we are exploring DNA & Genetics!",
          core: "DNA is the master molecule of life. It contains genes that code for all your traits, packaged into chromosomes inherited from both your parents!",
          example: "For example, your eye color, blood type, and height are influenced by inherited combinations of maternal and paternal genes."
        }
      },

      circulatory: {
        title: "Human Circulatory System",
        icon: "🫀",
        whatToTeach: "The circulatory system transports oxygen, nutrients, hormones, and wastes around the body.",
        steps: [
          "1. Introduce the heart as a central muscular pump.",
          "2. Show the four chambers: Right Atrium, Right Ventricle, Left Atrium, and Left Ventricle.",
          "3. Show blood entering the right side of the heart from the vena cava.",
          "4. Show blood traveling to the lungs via the pulmonary artery.",
          "5. Explain that blood receives oxygen in alveolar capillaries.",
          "6. Show oxygen-rich blood returning to the left side of the heart.",
          "7. Show the left ventricle pumping blood to the body via the aorta.",
          "8. Explain the roles of arteries (away), veins (toward), and capillaries (exchange)."
        ],
        example: "Heart ➔ Lungs ➔ Heart ➔ Body ➔ Heart",
        animationScript: "Make a red/blue blood cell travel through the heart chambers and blood vessels.",
        interactiveQ: {
          q: "Which blood vessels carry oxygen-rich blood AWAY from the heart to body tissues?",
          options: ["Arteries", "Veins", "Lymphatics"],
          correct: 0,
          explanation: "Arteries carry blood AWAY from the heart at high pressure (e.g. the Aorta), while veins return blood toward the heart."
        },
        narration: {
          intro: "Welcome to class! Today we are learning how the Human Circulatory System powers your body non-stop!",
          core: "The heart pumps blood in a continuous double-circuit: first to the lungs to pick up oxygen, and then to all body tissues through high-pressure arteries!",
          example: "Think of blood cells as delivery trucks: they load up oxygen at the lungs and deliver it to your muscles and brain!"
        }
      },

      respiratory: {
        title: "Respiratory System",
        icon: "🫁",
        whatToTeach: "The respiratory system brings oxygen into the body and removes carbon dioxide.",
        steps: [
          "1. Show a person inhaling atmospheric air.",
          "2. Air enters through the nose or mouth where it is filtered and warmed.",
          "3. Show air moving through the trachea windpipe.",
          "4. Show the bronchi branching into thousands of bronchioles in the lungs.",
          "5. Zoom into tiny air sacs called alveoli.",
          "6. Explain oxygen diffusing from the alveoli into the blood.",
          "7. Explain carbon dioxide diffusing from blood into the alveoli.",
          "8. Show passive exhalation as the diaphragm relaxes."
        ],
        example: "Inhalation: Oxygen ➔ Lungs ➔ Blood ➔ Cells | Exhalation: Cells ➔ Blood ➔ Lungs ➔ Carbon dioxide ➔ Outside",
        animationScript: "Make the lungs expand during inhalation and contract during exhalation with the diaphragm.",
        interactiveQ: {
          q: "What are the microscopic air sacs in the lungs where gas exchange occurs called?",
          options: ["Alveoli", "Bronchi", "Trachea"],
          correct: 0,
          explanation: "Alveoli are 300 million tiny air sacs providing a huge surface area for oxygen to diffuse into blood capillaries."
        },
        narration: {
          intro: "Welcome! Today we are studying the Respiratory System and how your lungs breathe in life!",
          core: "When your diaphragm contracts downward, air rushes through your trachea into 300 million tiny bubble sacs called alveoli, where gas exchange happens!",
          example: "Inhalation supplies fresh oxygen to every living cell, and exhalation vents out carbon dioxide exhaust!"
        }
      },

      nervous: {
        title: "Human Nervous System",
        icon: "🧠",
        whatToTeach: "The nervous system receives information, processes it, and coordinates responses.",
        steps: [
          "1. Introduce the brain as the central control organ.",
          "2. Show the spinal cord conducting signals down the spine.",
          "3. Show peripheral nerves extending throughout the body.",
          "4. Explain neurons as specialized cells that transmit electrical impulses.",
          "5. Show a sensory stimulus being detected by receptors.",
          "6. Show the electrical signal traveling toward the brain or spinal cord.",
          "7. Show a motor response signal traveling to a muscle or gland.",
          "8. Explain how this coordinates movement, sensation, thoughts, and reflexes."
        ],
        example: "Touching a hot object: Heat stimulus ➔ Sensory neuron ➔ Spinal cord/brain ➔ Motor neuron ➔ Hand moves away",
        animationScript: "Character touches a hot object ➔ signal travels along a nerve ➔ hand quickly moves away.",
        interactiveQ: {
          q: "What specialized cells transmit electrochemical nerve impulses throughout the body?",
          options: ["Neurons", "Nephrons", "Red Blood Cells"],
          correct: 0,
          explanation: "Neurons are the basic working units of the nervous system, transmitting electrical signals across axons at speeds up to 268 mph."
        },
        narration: {
          intro: "Greetings! Today we are exploring the Human Nervous System—the electrical command network of the body!",
          core: "Your brain and spinal cord connect to billions of neurons that send electrical action potentials to think, feel, and react in milliseconds!",
          example: "When you touch something hot, a reflex arc triggers sensory neurons to move your hand away before you even feel pain!"
        }
      },

      photosynthesis: {
        title: "Photosynthesis",
        icon: "🌱",
        whatToTeach: "Photosynthesis allows green plants to make glucose using light energy, carbon dioxide, and water.",
        steps: [
          "1. Show the Sun emitting solar photon energy.",
          "2. Show sunlight reaching green leaf chlorophyll pigments.",
          "3. Show roots absorbing water from the soil.",
          "4. Show water moving up through the stem toward the leaves.",
          "5. Show carbon dioxide entering through tiny leaf openings called stomata.",
          "6. Explain that chlorophyll captures light energy to split water.",
          "7. Show glucose sugar being produced in the chloroplast stroma.",
          "8. Show oxygen gas being released into the atmosphere."
        ],
        example: "Carbon dioxide + Water + Light energy ➔ Glucose + Oxygen",
        animationScript: "Sunlight + Water + CO₂ ➔ Leaf ➔ Glucose + O₂",
        interactiveQ: {
          q: "What three main ingredients does a plant need to perform photosynthesis?",
          options: ["Water + Carbon dioxide + Light energy", "Oxygen + Soil + Sugar", "Protein + Oxygen + Salt"],
          correct: 0,
          explanation: "Plants absorb sunlight via chlorophyll, take in CO₂ through stomata, and absorb water from roots to produce glucose and oxygen."
        },
        narration: {
          intro: "Welcome young botanists! Today we are studying Photosynthesis—how plants cook sunlight into food!",
          core: "Inside chloroplasts, green chlorophyll captures sunlight to split water and combine with carbon dioxide, synthesizing energy-rich glucose!",
          example: "The oxygen we breathe right now was produced by green plants and phytoplankton during photosynthesis!"
        }
      },

      cellStructure: {
        title: "Cell Structure",
        icon: "🔬",
        whatToTeach: "The cell is the basic structural and functional unit of life.",
        steps: [
          "1. Introduce a cell as the fundamental building block of all organisms.",
          "2. Show the selectively permeable cell membrane.",
          "3. Show the jelly-like cytoplasm supporting organelles.",
          "4. Highlight the nucleus containing genetic DNA chromatin.",
          "5. Show the mitochondria releasing usable ATP energy from food.",
          "6. Explain ribosomes synthesizing essential proteins.",
          "7. For a plant cell, show the cell wall, chloroplasts, and large central vacuole.",
          "8. Explain the specialized function of each cellular structure."
        ],
        example: "Nucleus (Control) | Mitochondria (Power) | Cell Membrane (Gate) | Ribosomes (Protein) | Chloroplast (Solar) | Vacuole (Storage)",
        animationScript: "Character enters a giant cell and introduces each organelle one by one.",
        interactiveQ: {
          q: "Which organelle is known as the powerhouse of the cell that releases usable ATP energy from food?",
          options: ["Mitochondria", "Ribosome", "Vacuole"],
          correct: 0,
          explanation: "Mitochondria carry out cellular respiration, converting nutrients into ATP energy currency for the cell."
        },
        narration: {
          intro: "Step into the microscope lab! Today we are touring Cell Structure—the living microscopic cities inside all life!",
          core: "Every cell is enclosed by a membrane, directed by a DNA-containing nucleus, and powered by mitochondrial energy generators!",
          example: "Plant cells get extra upgrades: rigid cellulose walls for strength and green chloroplasts to capture solar energy."
        }
      },

      microorganisms: {
        title: "Microorganisms",
        icon: "🦠",
        whatToTeach: "Microorganisms are tiny organisms or microscopic infectious agents. Some are useful, while others can cause disease.",
        steps: [
          "1. Introduce the microscopic world invisible to the naked eye.",
          "2. Show different types of microorganisms: bacteria, fungi, protozoa, algae, and viruses.",
          "3. Introduce bacteria and their binary fission reproduction.",
          "4. Introduce fungi like bread yeast.",
          "5. Introduce single-celled protozoa.",
          "6. Explain that microscopic algae perform massive global photosynthesis.",
          "7. Explain viruses as infectious agents that reproduce inside host cells.",
          "8. Show useful examples (curd, bread, decomposers) and harmful pathogens."
        ],
        example: "Useful (Lactobacillus curd, Yeast bread, Decomposers) | Harmful (Pathogenic bacteria, fungal infections, viral flu)",
        animationScript: "Character uses a microscope ➔ microorganisms appear ➔ each one gets a short introduction.",
        interactiveQ: {
          q: "Which beneficial microorganism is used in baking to make bread dough rise?",
          options: ["Yeast (Fungi)", "Microscopic Algae", "Viruses"],
          correct: 0,
          explanation: "Yeast (Saccharomyces) ferments sugars in dough, releasing carbon dioxide bubbles that cause bread to rise."
        },
        narration: {
          intro: "Welcome! Today we are exploring the invisible kingdom of Microorganisms!",
          core: "Microbes include bacteria, fungi, protozoa, algae, and viruses. Many are beneficial for making yogurt and recycling nutrients, while others cause illness!",
          example: "Lactobacillus bacteria turn milk into healthy curd, while microscopic decomposers keep our planet clean."
        }
      },

      digestive: {
        title: "Human Digestive System",
        icon: "🍎",
        whatToTeach: "Digestion breaks food into smaller substances so nutrients can be absorbed and used by the body.",
        steps: [
          "1. Show food entering the mouth and mechanical chewing.",
          "2. Explain saliva and salivary amylase beginning starch digestion.",
          "3. Show food bolus moving down the esophagus via peristalsis.",
          "4. Show the stomach mixing food with hydrochloric acid and pepsin.",
          "5. Move food chyme into the duodenum of the small intestine.",
          "6. Explain liver bile emulsifying fats and pancreatic enzymes.",
          "7. Show nutrient absorption across small intestine villi into blood.",
          "8. Move remaining material into the large intestine.",
          "9. Explain water reclamation and waste formation in the colon.",
          "10. Show elimination of indigestible waste."
        ],
        example: "Food ➔ Mouth ➔ Esophagus ➔ Stomach ➔ Small intestine ➔ Large intestine ➔ Waste",
        animationScript: "A food particle travels through the digestive tract while the character explains each organ.",
        interactiveQ: {
          q: "Where does most nutrient absorption into the bloodstream occur along the digestive tract?",
          options: ["Small Intestine (Villi)", "Stomach", "Esophagus"],
          correct: 0,
          explanation: "Over 90% of nutrient absorption occurs across the vast surface area of small intestine villi and microvilli."
        },
        narration: {
          intro: "Get ready for a journey! Today we are following the Human Digestive System along a 30-foot nutrient slide!",
          core: "Digestion mechanically and chemically breaks down food from your mouth to your stomach, absorbing vitamins and glucose across intestinal villi!",
          example: "Liver bile works like dish soap, turning large dietary fats into tiny droplets so enzymes can easily digest them."
        }
      },

      animalClass: {
        title: "Animal Classification",
        icon: "🐾",
        whatToTeach: "Animal classification groups animals according to shared characteristics and evolutionary relationships.",
        steps: [
          "1. Introduce the enormous diversity of the animal kingdom.",
          "2. Divide animals broadly into Vertebrates and Invertebrates.",
          "3. Explain that vertebrates possess a protective internal backbone.",
          "4. Introduce the 5 major vertebrate groups: Fish, Amphibians, Reptiles, Birds, and Mammals.",
          "5. Introduce invertebrate groups (insects, mollusks, worms) comprising >95% of species.",
          "6. Compare characteristics such as body covering, habitat, and reproduction.",
          "7. Present an animal and challenge the student to classify it."
        ],
        example: "Fish (Vertebrate) | Frog (Amphibian) | Snake (Reptile) | Eagle (Bird) | Elephant (Mammal) | Butterfly (Invertebrate)",
        animationScript: "An animal appears ➔ character asks 'Which group does this animal belong to?' ➔ answer appears.",
        interactiveQ: {
          q: "Which broad group of animals is defined by having a vertebral column (backbone)?",
          options: ["Vertebrates", "Invertebrates", "Arthropods"],
          correct: 0,
          explanation: "Vertebrates (fish, amphibians, reptiles, birds, mammals) possess an internal bony or cartilaginous backbone."
        },
        narration: {
          intro: "Welcome zoologists! Today we are learning Animal Classification and Taxonomy!",
          core: "Biologists classify animals into Vertebrates (with backbones) and Invertebrates (without backbones, making up over 95% of species)!",
          example: "Frogs are amphibians with dual lives, eagles are warm-blooded feathered birds, and butterflies are exoskeletal invertebrates."
        }
      },

      ecosystem: {
        title: "Ecosystem & Food Chain",
        icon: "🌍",
        whatToTeach: "An ecosystem consists of living organisms interacting with one another and with their physical environment.",
        steps: [
          "1. Introduce an ecosystem such as a vibrant forest, grassland, or pond.",
          "2. Show primary producers (plants) capturing solar energy.",
          "3. Show primary consumers (herbivores) eating plants.",
          "4. Show secondary consumers (carnivores) eating herbivores.",
          "5. Introduce higher-level apex predators.",
          "6. Show decomposers (fungi, bacteria) recycling dead organic matter.",
          "7. Explain unidirectional energy flow in a food chain (Lindeman's 10% law).",
          "8. Connect multiple food chains into a complex food web.",
          "9. Explain how changes to one species affect the entire ecological balance."
        ],
        example: "Grass (Producer) ➔ Grasshopper (Primary) ➔ Frog (Secondary) ➔ Snake (Tertiary) ➔ Eagle (Apex Predator)",
        animationScript: "Character places each organism on screen ➔ arrows connect them ➔ food chain becomes a food web.",
        interactiveQ: {
          q: "In the food chain Grass ➔ Grasshopper ➔ Frog ➔ Snake ➔ Eagle, which organism is the primary producer?",
          options: ["Grass (Producer)", "Grasshopper (Consumer)", "Frog (Carnivore)"],
          correct: 0,
          explanation: "Grass is an autotrophic producer that captures sunlight to generate organic biomass via photosynthesis."
        },
        narration: {
          intro: "Welcome ecologists! Today we are studying Ecosystems and the Living Food Web!",
          core: "In any ecosystem, energy flows from the sun to green producers, moves up trophic levels to consumers, and is recycled by decomposers!",
          example: "When grasshoppers eat grass and frogs eat grasshoppers, energy travels up the chain, keeping the whole forest healthy and balanced!"
        }
      }
    };
  }

  startLesson(topicId = null) {
    if (topicId) this.currentTopicId = topicId;
    else this.currentTopicId = window.bioApp?.activeTopicId || 'dnaGenetics';

    this.isActive = true;
    this.currentStage = 1;

    // Load active topic in cinema
    if (window.bioApp && window.bioApp.activeTopicId !== this.currentTopicId) {
      window.bioApp.loadTopic(this.currentTopicId);
    }

    if (window.bioAudio) window.bioAudio.playFanfare();
    this.renderTeacherModal();
    this.showStage(1);
  }

  renderTeacherModal() {
    let overlay = document.getElementById('teacher-lesson-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'teacher-lesson-modal-overlay';
      overlay.className = 'teacher-lesson-modal-overlay';
      document.body.appendChild(overlay);
    }
    overlay.classList.add('open');
  }

  showStage(stageNum) {
    this.currentStage = stageNum;
    const lesson = this.curriculumLessons[this.currentTopicId];
    if (!lesson) return;

    const overlay = document.getElementById('teacher-lesson-modal-overlay');
    if (!overlay) return;

    // Synchronize simulation step based on stage
    const currentTopic = window.bioApp?.currentTopicInstance;
    if (currentTopic && currentTopic.seekStep) {
      const stepIdx = Math.min(4, Math.max(0, Math.floor((stageNum - 1) / 1.5)));
      currentTopic.seekStep(stepIdx, false);
      if (currentTopic.state) currentTopic.state.isPlaying = true;
    }

    if (window.bioStudyNotesUI) {
      window.bioStudyNotesUI.openTab('summary');
    }

    overlay.innerHTML = `
      <div class="teacher-lesson-card">
        <!-- Top Teacher Bar -->
        <div class="teacher-header-bar">
          <div class="teacher-avatar-badge">
            <span class="teacher-icon">👩‍🏫</span>
            <div>
              <h3 class="teacher-title">AI Biology Teacher: Dr. Helix</h3>
              <span class="teacher-subtitle">${lesson.icon} ${lesson.title} • 8-Step Lesson Flow</span>
            </div>
          </div>
          <div class="teacher-stage-tracker">
            <span class="stage-pill">Stage ${stageNum} of 8</span>
            <button class="teacher-close-btn" id="btn-close-teacher-modal">✕</button>
          </div>
        </div>

        <!-- 8-Stage Progress Track -->
        <div class="teacher-flow-track">
          ${[
            { num: 1, label: "Intro" },
            { num: 2, label: "Overview" },
            { num: 3, label: "8 Steps" },
            { num: 4, label: "2D Animation" },
            { num: 5, label: "Example" },
            { num: 6, label: "Question" },
            { num: 7, label: "Explanation" },
            { num: 8, label: "Quiz" }
          ].map(s => `
            <div class="flow-step-chip ${s.num === stageNum ? 'active' : ''} ${s.num < stageNum ? 'done' : ''}" data-stage="${s.num}">
              <span class="step-num-circle">${s.num < stageNum ? '✓' : s.num}</span>
              <span class="step-label">${s.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Dynamic Stage Body -->
        <div class="teacher-body-content" id="teacher-stage-body">
          ${this.getStageHtml(stageNum, lesson)}
        </div>

        <!-- Footer Navigation -->
        <div class="teacher-footer-bar">
          <button class="teacher-nav-btn secondary" id="btn-teacher-prev" ${stageNum === 1 ? 'disabled' : ''}>
            ⬅ Previous Stage
          </button>
          <button class="teacher-voice-speak-btn" id="btn-teacher-speak">
            🔊 Repeat Teacher Voice
          </button>
          <button class="teacher-nav-btn primary" id="btn-teacher-next">
            ${stageNum === 8 ? '🎯 Take Full Mastery Quiz' : 'Next Stage ➡'}
          </button>
        </div>
      </div>
    `;

    // Event Bindings
    document.getElementById('btn-close-teacher-modal')?.addEventListener('click', () => this.stopLesson());
    document.getElementById('btn-teacher-prev')?.addEventListener('click', () => {
      if (this.currentStage > 1) this.showStage(this.currentStage - 1);
    });
    document.getElementById('btn-teacher-next')?.addEventListener('click', () => {
      if (this.currentStage < 8) {
        this.showStage(this.currentStage + 1);
      } else {
        this.stopLesson();
        if (window.bioQuizEngine) window.bioQuizEngine.openQuiz(this.currentTopicId);
      }
    });

    document.getElementById('btn-teacher-speak')?.addEventListener('click', () => {
      this.speakCurrentStage(stageNum, lesson);
    });

    overlay.querySelectorAll('.flow-step-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const s = parseInt(chip.dataset.stage);
        this.showStage(s);
      });
    });

    // Speak stage voice
    this.speakCurrentStage(stageNum, lesson);
  }

  getStageHtml(stageNum, lesson) {
    if (stageNum === 1) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 1: CHARACTER & LESSON INTRODUCTION</span>
          <h2 class="stage-main-heading">${lesson.icon} Welcome to ${lesson.title}!</h2>
          <div class="teacher-speech-bubble">
            <span class="bubble-quote">💬</span>
            <p>${lesson.narration.intro}</p>
          </div>
          <div class="lesson-highlight-card">
            <strong>🎯 Learning Objective:</strong> By the end of this lesson, you will master the fundamental mechanisms, key scientific steps, and real-life applications of ${lesson.title}.
          </div>
        </div>
      `;
    } else if (stageNum === 2) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 2: TOPIC OVERVIEW & CORE SCIENTIFIC CONCEPT</span>
          <h2 class="stage-main-heading">What We Are Learning</h2>
          <div class="teacher-speech-bubble">
            <span class="bubble-quote">💬</span>
            <p>${lesson.narration.core}</p>
          </div>
          <div class="lesson-core-concept-box">
            <h4>📖 Core Definition:</h4>
            <p>${lesson.whatToTeach}</p>
          </div>
        </div>
      `;
    } else if (stageNum === 3) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 3: STEP-BY-STEP PEDAGOGICAL BREAKDOWN</span>
          <h2 class="stage-main-heading">The Step-by-Step Mechanism</h2>
          <div class="lesson-steps-checklist">
            ${lesson.steps.map(st => `
              <div class="checklist-item">
                <span class="check-dot">📌</span>
                <span>${st}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (stageNum === 4) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 4: 2D ANIMATED SIMULATION SCENE</span>
          <h2 class="stage-main-heading">Live Visual Animation Scene</h2>
          <div class="animation-script-card">
            <span class="anim-camera-icon">🎬</span>
            <div>
              <span class="anim-tag">2D VISUAL CINEMA SCRIPT</span>
              <p class="anim-text">${lesson.animationScript}</p>
            </div>
          </div>
          <div class="lesson-live-sync-note">
            <span>🔴 <strong>Live Cinema Synced:</strong> Watch the 60 FPS animation running on your left canvas!</span>
          </div>
        </div>
      `;
    } else if (stageNum === 5) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 5: REAL-LIFE APPLICATION & SIMPLE EXAMPLE</span>
          <h2 class="stage-main-heading">Simple Real-World Example</h2>
          <div class="teacher-speech-bubble">
            <span class="bubble-quote">💬</span>
            <p>${lesson.narration.example}</p>
          </div>
          <div class="real-life-example-card">
            <span class="example-icon">🌟</span>
            <div>
              <span class="example-tag">EXAMPLE PATHWAY</span>
              <p class="example-formula">${lesson.example}</p>
            </div>
          </div>
        </div>
      `;
    } else if (stageNum === 6) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 6: INTERACTIVE TEACHER QUESTION</span>
          <h2 class="stage-main-heading">Let's Test Your Understanding!</h2>
          <div class="interactive-teacher-q-card">
            <h3 class="q-prompt">${lesson.interactiveQ.q}</h3>
            <div class="teacher-q-options">
              ${lesson.interactiveQ.options.map((opt, i) => `
                <button class="teacher-opt-btn" data-idx="${i}">
                  <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
            <div class="teacher-feedback-box" id="teacher-feedback-box" style="display: none;"></div>
          </div>
        </div>
      `;
    } else if (stageNum === 7) {
      return `
        <div class="lesson-stage-box">
          <span class="stage-tag">STAGE 7: DETAILED ANSWER & SCIENTIFIC RATIONALE</span>
          <h2 class="stage-main-heading">Scientific Explanation</h2>
          <div class="teacher-explanation-card">
            <span class="exp-icon">✨</span>
            <div>
              <h4>Correct Answer: Option A (${lesson.interactiveQ.options[lesson.interactiveQ.correct]})</h4>
              <p class="exp-text">${lesson.interactiveQ.explanation}</p>
            </div>
          </div>
        </div>
      `;
    } else if (stageNum === 8) {
      return `
        <div class="lesson-stage-box celebration">
          <span class="stage-tag">STAGE 8: TOPIC MASTERY MINI QUIZ</span>
          <h2 class="stage-main-heading">🎉 Lesson Completed with Dr. Helix!</h2>
          <p class="lesson-done-desc">You've covered all teaching stages for <strong>${lesson.title}</strong>. Ready to test your complete biological mastery and claim your official badge?</p>
          <div class="quiz-launch-banner">
            <button class="launch-mastery-btn" id="btn-teacher-launch-quiz">🎯 Launch Topic Mastery Challenge</button>
          </div>
        </div>
      `;
    }
  }

  speakCurrentStage(stageNum, lesson) {
    if (!window.drHelix) return;

    if (stageNum === 1) {
      window.drHelix.say(`${lesson.narration.intro} Today's topic is ${lesson.title}.`, 'excited', true);
    } else if (stageNum === 2) {
      window.drHelix.say(lesson.whatToTeach, 'explaining', true);
    } else if (stageNum === 3) {
      window.drHelix.say(`Here is the step-by-step breakdown for ${lesson.title}. ${lesson.steps.slice(0, 3).join('. ')}`, 'explaining', true);
    } else if (stageNum === 4) {
      window.drHelix.say(`Watch the 2D visual animation scene on your left as the mechanism unfolds!`, 'explaining', true);
    } else if (stageNum === 5) {
      window.drHelix.say(`Here is a simple real-life example: ${lesson.example}`, 'explaining', true);
    } else if (stageNum === 6) {
      window.drHelix.say(`Let's check your understanding. ${lesson.interactiveQ.q}`, 'explaining', true);
    } else if (stageNum === 7) {
      window.drHelix.say(lesson.interactiveQ.explanation, 'celebrating', true);
    } else if (stageNum === 8) {
      window.drHelix.say(`Great job completing this lesson! You are ready for the Topic Mastery Challenge!`, 'celebrating', true);
    }
  }

  stopLesson() {
    this.isActive = false;
    const overlay = document.getElementById('teacher-lesson-modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }
}

window.teacherLessonEngine = new TeacherLessonEngine();
