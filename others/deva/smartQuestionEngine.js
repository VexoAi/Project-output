// BioProcess Smart Question-to-Video Engine (Semantic & Natural Language Matcher)
class SmartQuestionEngine {
  constructor() {
    // Knowledge intent database mapping diverse question phrasings to exact topic & step
    this.questionMappings = [
      // DNA Genetics
      {
        keywords: ['dna', 'deoxyribonucleic', 'double helix', 'genetic material', 'blueprint of life', 'helical structure'],
        topicId: 'dnaGenetics',
        stepIdx: 0,
        title: 'DNA & Double-Helix Structure',
        answer: "DNA (Deoxyribonucleic Acid) is the master molecule of life that stores genetic instructions in an antiparallel double-helix structure made of chemical bases: A, T, C, and G."
      },
      {
        keywords: ['base pair', 'adenine', 'thymine', 'cytosine', 'guanine', 'chargaff', 'hydrogen bond', 'a-t', 'c-g', 'pairing rule'],
        topicId: 'dnaGenetics',
        stepIdx: 1,
        title: 'Chemical Base Pairing (A-T & C-G)',
        answer: "In a DNA double helix, Adenine (A) always pairs with Thymine (T) via 2 hydrogen bonds, while Cytosine (C) pairs with Guanine (G) via 3 hydrogen bonds."
      },
      {
        keywords: ['gene', 'chromosome', 'packaging', 'histone', 'chromatin', 'nucleus', 'dna packaging', 'what are genes'],
        topicId: 'dnaGenetics',
        stepIdx: 2,
        title: 'Genes & Chromosome Packaging',
        answer: "Specific sections of DNA are called genes. DNA is tightly wound and packaged into 46 chromosomes inside the human cell nucleus."
      },
      {
        keywords: ['inheritance', 'parent', 'mother', 'father', 'egg', 'sperm', 'reproductive cell', 'gamete', 'pass traits', 'inherit'],
        topicId: 'dnaGenetics',
        stepIdx: 3,
        title: 'Parental Inheritance & Reproductive Cells',
        answer: "Offspring receive genetic material from both biological parents: 23 chromosomes from the mother's egg and 23 chromosomes from the father's sperm."
      },
      {
        keywords: ['variation', 'eye color', 'blood group', 'punnett', 'allele', 'trait', 'genetic combination', 'why are we different'],
        topicId: 'dnaGenetics',
        stepIdx: 4,
        title: 'Gene Combinations & Genetic Variation',
        answer: "Unique combinations of inherited maternal and paternal alleles produce human genetic variation, determining eye color, blood groups, height, and distinct traits!"
      },

      // Circulatory System
      {
        keywords: ['vena cava', 'right atrium', 'deoxygenated blood', 'venous return', 'systemic veins', 'enter heart'],
        topicId: 'circulatory',
        stepIdx: 0,
        title: 'Right Atrial Venous Inflow',
        answer: "Deoxygenated blood returns from systemic body tissues via the Superior and Inferior Vena Cava into the Right Atrium."
      },
      {
        keywords: ['tricuspid', 'right ventricle', 'pulmonary artery', 'pump to lungs', 'sa node', 'pacemaker', 'lub'],
        topicId: 'circulatory',
        stepIdx: 1,
        title: 'Right Ventricle & Pulmonary Pumping',
        answer: "The Right Ventricle contracts, closing the tricuspid valve and pumping deoxygenated blood through the Pulmonary Artery toward the lungs."
      },
      {
        keywords: ['pulmonary capillary', 'oxygenate blood', 'lung capillary', 'alveolar oxygenation', 'red blood cell', 'hemoglobin binding'],
        topicId: 'circulatory',
        stepIdx: 2,
        title: 'Pulmonary Capillary Gas Exchange',
        answer: "In lung capillaries, erythrocytes release carbon dioxide and bind oxygen molecules to hemoglobin, turning bright oxygenated red."
      },
      {
        keywords: ['pulmonary vein', 'left atrium', 'bicuspid', 'mitral valve', 'oxygenated return', 'fill ventricle'],
        topicId: 'circulatory',
        stepIdx: 3,
        title: 'Pulmonary Vein Return & Left Atrial Filling',
        answer: "Four pulmonary veins deliver oxygen-rich blood into the Left Atrium, which fills the Left Ventricle through the bicuspid (mitral) valve."
      },
      {
        keywords: ['left ventricle', 'aorta', 'aortic', 'thick wall', 'systemic pressure', '120 mmhg', 'cardiac output', 'pump to body', 'why is left ventricle thicker'],
        topicId: 'circulatory',
        stepIdx: 4,
        title: 'Left Ventricular High-Pressure Aortic Ejection',
        answer: "The thick-walled Left Ventricle contracts forcefully, generating 120 mmHg systolic pressure to propel oxygenated blood through the Aorta to the entire body."
      },

      // Respiratory System
      {
        keywords: ['nasal', 'nose', 'warm air', 'filter air', 'cilia', 'mucus', 'inhale air', 'enter respiratory'],
        topicId: 'respiratory',
        stepIdx: 0,
        title: 'Atmospheric Inhalation & Nasal Conditioning',
        answer: "Inhaled air enters nasal passages where ciliated epithelium and mucus warm, humidify, and filter out airborne particulates."
      },
      {
        keywords: ['diaphragm', 'boyle', 'boyles law', 'negative pressure', 'chest expand', 'ribs', 'drop pressure', 'how do we breathe', 'inhalation mechanics'],
        topicId: 'respiratory',
        stepIdx: 1,
        title: 'Diaphragm Contraction & Boyle\'s Law',
        answer: "Diaphragm contraction moves downward, expanding thoracic volume and dropping intrapleural pressure below atmospheric pressure to draw air into the lungs."
      },
      {
        keywords: ['trachea', 'bronchi', 'bronchiole', 'windpipe', 'cartilage ring', 'airway tree', 'conduct air'],
        topicId: 'respiratory',
        stepIdx: 2,
        title: 'Tracheobronchial Conduction Tree',
        answer: "Air travels down the cartilage-reinforced trachea and branches through primary bronchi into narrow terminal bronchioles."
      },
      {
        keywords: ['alveoli', 'alveolus', 'gas exchange', 'surfactant', 'diffuse oxygen', 'fick', 'respiratory membrane', 'capillary exchange', 'where does gas exchange occur'],
        topicId: 'respiratory',
        stepIdx: 3,
        title: 'Alveolar-Capillary Gas Exchange',
        answer: "Oxygen diffuses across the ultra-thin 0.5-micron alveolar membrane into red blood cells, while pulmonary surfactant prevents alveolar collapse."
      },
      {
        keywords: ['exhalation', 'bicarbonate', 'co2 transport', 'elastic recoil', 'passive exhale', 'breathe out', 'expel carbon dioxide'],
        topicId: 'respiratory',
        stepIdx: 4,
        title: 'Carbon Dioxide Exhalation & Elastic Recoil',
        answer: "The diaphragm relaxes and elastic lung fibers recoil, raising internal pressure to vent CO2 (transported largely as bicarbonate) out to the atmosphere."
      },

      // Nervous System
      {
        keywords: ['resting potential', 'minus 70', '-70', 'sodium potassium pump', 'na k atpase', '3 na 2 k', 'leak channel', 'dendrite', 'graded potential'],
        topicId: 'nervous',
        stepIdx: 0,
        title: 'Resting Membrane Potential (-70 mV)',
        answer: "The resting potential of -70 mV is maintained by the Na+/K+ pump, which actively pumps 3 Na+ out for every 2 K+ in, consuming 1 ATP."
      },
      {
        keywords: ['threshold', 'minus 55', '-55', 'axon hillock', 'all or none', 'trigger action potential', 'reach threshold'],
        topicId: 'nervous',
        stepIdx: 1,
        title: 'Axon Hillock Threshold Depolarization (-55 mV)',
        answer: "When graded potentials reach the threshold of -55 mV at the axon hillock, voltage-gated sodium channels are triggered to open in an all-or-none response."
      },
      {
        keywords: ['depolarization', 'plus 30', '+30', 'sodium influx', 'na channel open', 'voltage gated sodium', 'spike potential', 'action potential spike'],
        topicId: 'nervous',
        stepIdx: 2,
        title: 'Rapid Na+ Influx & Peak (+30 mV)',
        answer: "Voltage-gated sodium channels open rapidly, allowing Na+ to rush into the neuron down its electrochemical gradient, driving the membrane potential to +30 mV."
      },
      {
        keywords: ['repolarization', 'potassium efflux', 'k channel', 'hyperpolarization', 'undershoot', 'minus 80', 'saltatory', 'nodes of ranvier', 'myelin'],
        topicId: 'nervous',
        stepIdx: 3,
        title: 'K+ Efflux, Repolarization & Saltatory Conduction',
        answer: "Voltage-gated K+ channels open to allow potassium efflux, restoring negative potential while action potentials leap rapidly between Nodes of Ranvier."
      },
      {
        keywords: ['synapse', 'synaptic cleft', 'neurotransmitter', 'acetylcholine', 'calcium influx', 'vesicle fusion', 'exocytosis', 'postsynaptic', 'how do neurons communicate'],
        topicId: 'nervous',
        stepIdx: 4,
        title: 'Presynaptic Ca2+ Influx & Synaptic Exocytosis',
        answer: "Arrival of the electrical action potential opens voltage-gated Ca2+ channels, causing synaptic vesicles to fuse and release neurotransmitters into the synaptic cleft."
      },

      // Photosynthesis
      {
        keywords: ['photosystem 2', 'p680', 'chlorophyll', 'photon', 'absorb light', 'pigment', 'sunlight energy', 'light reaction start'],
        topicId: 'photosynthesis',
        stepIdx: 0,
        title: 'Photon Absorption & Pigment Excitation',
        answer: "Solar photons strike chlorophyll pigments in Photosystem II (P680), exciting electrons to higher energy levels in thylakoid membranes."
      },
      {
        keywords: ['photolysis', 'split water', 'water splitting', 'oxygen release', 'where does oxygen come from', 'oxygen evolution', 'h2o split'],
        topicId: 'photosynthesis',
        stepIdx: 1,
        title: 'Photolysis of Water & Oxygen Evolution',
        answer: "Light energy splits water molecules (2H2O -> 4H+ + 4e- + O2) in Photosystem II, releasing oxygen gas into the air as a vital byproduct."
      },
      {
        keywords: ['electron transport', 'plastoquinone', 'cytochrome', 'proton gradient', 'thylakoid lumen', 'pump proton', 'etc'],
        topicId: 'photosynthesis',
        stepIdx: 2,
        title: 'Electron Transport Chain & Proton Pumping',
        answer: "High-energy electrons travel through the electron transport chain, pumping protons into the thylakoid lumen to create an electrochemical proton gradient."
      },
      {
        keywords: ['photosystem 1', 'p700', 'nadph', 'ferredoxin', 'reduce nadp', 'light reactions end'],
        topicId: 'photosynthesis',
        stepIdx: 3,
        title: 'Photosystem I & NADPH Reduction',
        answer: "Re-energized electrons in Photosystem I (P700) are transferred by Ferredoxin to reduce NADP+ into energy-rich NADPH."
      },
      {
        keywords: ['calvin cycle', 'rubisco', 'carbon fixation', 'atp synthase', 'stroma', 'make glucose', 'sugar synthesis', 'dark reaction', 'light independent'],
        topicId: 'photosynthesis',
        stepIdx: 4,
        title: 'ATP Synthase & Stromal Calvin Cycle Fixation',
        answer: "ATP Synthase generates ATP from the proton gradient, while RuBisCO fixes CO2 in the stroma to synthesize glucose carbohydrates."
      },

      // Cell Structure
      {
        keywords: ['plasma membrane', 'phospholipid', 'fluid mosaic', 'bilayer', 'cholesterol', 'cell boundary'],
        topicId: 'cellStructure',
        stepIdx: 0,
        title: 'Phospholipid Bilayer & Fluid Mosaic Membrane',
        answer: "The selectively permeable plasma membrane is composed of an amphipathic phospholipid bilayer embedded with proteins and cholesterol."
      },
      {
        keywords: ['nucleus', 'nucleolus', 'dna storage', 'chromatin', 'nuclear pore', 'rrna', 'ribosome assembly'],
        topicId: 'cellStructure',
        stepIdx: 1,
        title: 'Nucleus, Chromatin & Nuclear Pores',
        answer: "The nucleus encloses genomic DNA chromatin and regulates molecular traffic through nuclear pores, while the nucleolus synthesizes ribosome subunits."
      },
      {
        keywords: ['rough er', 'smooth er', 'golgi', 'ribosome', 'protein synthesis', 'vesicle', 'endomembrane', 'package protein'],
        topicId: 'cellStructure',
        stepIdx: 2,
        title: 'Ribosomes, Endoplasmic Reticulum & Golgi Flow',
        answer: "Rough ER ribosomes translate proteins, which are folded and transported to the Golgi apparatus for post-translational modification and sorting."
      },
      {
        keywords: ['mitochondria', 'cristae', 'atp generation', 'cellular respiration', 'powerhouse', 'endosymbiosis', 'circular dna'],
        topicId: 'cellStructure',
        stepIdx: 3,
        title: 'Mitochondrial Cristae & Cellular Respiration',
        answer: "Mitochondria possess folded inner cristae membranes that carry out aerobic cellular respiration to generate ATP energy currency."
      },
      {
        keywords: ['plant cell', 'cell wall', 'cellulose', 'central vacuole', 'chloroplast organelle', 'turgor pressure', 'plant vs animal'],
        topicId: 'cellStructure',
        stepIdx: 4,
        title: 'Plant Specialization: Wall, Chloroplast & Vacuole',
        answer: "Plant cells feature rigid cellulose cell walls, large turgor central vacuoles, and photosynthetic chloroplasts absent in animal cells."
      },

      // Microorganisms
      {
        keywords: ['quadrant streak', 'agar plate', 'streak plate', 'petri dish', 'isolate colony', 'cfu', 'inoculation'],
        topicId: 'microorganisms',
        stepIdx: 0,
        title: 'Bacterial Inoculation & Streak Plating',
        answer: "Streak plating on nutrient agar dilutes bacterial samples to isolate individual pure colony forming units (CFUs)."
      },
      {
        keywords: ['gram stain', 'gram positive', 'gram negative', 'peptidoglycan', 'crystal violet', 'purple bacteria', 'pink bacteria', 'lps', 'why is gram positive purple'],
        topicId: 'microorganisms',
        stepIdx: 1,
        title: 'Gram-Positive vs Gram-Negative Cell Walls',
        answer: "Gram-positive bacteria have thick peptidoglycan walls retaining purple crystal violet stain, while Gram-negative bacteria have an outer LPS membrane counterstaining pink."
      },
      {
        keywords: ['binary fission', 'bacterial division', 'replicate bacteria', 'ftsz', 'asexual reproduction', 'double population', 'growth curve'],
        topicId: 'microorganisms',
        stepIdx: 2,
        title: 'Exponential Binary Fission Replication',
        answer: "Bacterial cells replicate circular chromosomes and divide into two identical daughter cells via binary fission guided by the FtsZ protein septum."
      },
      {
        keywords: ['kirby bauer', 'zone of inhibition', 'antibiotic disc', 'susceptibility', 'disc diffusion', 'antibiotic test', 'kill bacteria'],
        topicId: 'microorganisms',
        stepIdx: 3,
        title: 'Kirby-Bauer Antibiotic Susceptibility Testing',
        answer: "Antibiotic discs diffuse through agar, creating a clear Zone of Inhibition where bacterial growth is arrested according to antibiotic efficacy."
      },
      {
        keywords: ['plasmid', 'conjugation', 'antibiotic resistance', 'sex pilus', 'horizontal gene transfer', 'superbug', 'r plasmid'],
        topicId: 'microorganisms',
        stepIdx: 4,
        title: 'Plasmid Conjugation & Multi-Drug Resistance',
        answer: "Bacteria extend sex pili to transfer conjugative R-plasmids directly to recipient cells, rapidly spreading antibiotic resistance across bacterial colonies."
      },

      // Digestive System
      {
        keywords: ['mastication', 'chew', 'salivary amylase', 'saliva', 'bolus', 'starch breakdown in mouth', 'oral cavity'],
        topicId: 'digestive',
        stepIdx: 0,
        title: 'Oral Mastication & Salivary Amylase',
        answer: "Mechanical chewing breaks food into a lubricated bolus while salivary alpha-amylase initiates chemical starch digestion."
      },
      {
        keywords: ['esophagus', 'peristalsis', 'swallowing', 'food pipe', 'sphincter', 'propel food'],
        topicId: 'digestive',
        stepIdx: 1,
        title: 'Esophageal Peristalsis & Motility',
        answer: "Involuntary rhythmic smooth muscle contractions (peristalsis) propel food boluses down the esophagus and through the lower esophageal sphincter."
      },
      {
        keywords: ['stomach', 'hydrochloric acid', 'hcl', 'pepsin', 'pepsinogen', 'acid digestion', 'chyme', 'chief cell', 'parietal cell', 'gastric juice'],
        topicId: 'digestive',
        stepIdx: 2,
        title: 'Gastric Churning, HCl & Pepsin Hydrolysis',
        answer: "Parietal cells secrete HCl (pH 1.5-2) to activate pepsinogen into pepsin, which hydrolyzes dietary protein bonds into acidic chyme."
      },
      {
        keywords: ['duodenum', 'bile', 'gallbladder', 'pancreatic lipase', 'emulsify fat', 'trypsin', 'pancreas enzyme', 'what does bile do'],
        topicId: 'digestive',
        stepIdx: 3,
        title: 'Duodenal Pancreatic Enzymes & Bile Emulsification',
        answer: "Liver bile emulsifies large dietary fat globules into microscopic micelles, enabling pancreatic lipase and proteases to break down macromolecules."
      },
      {
        keywords: ['small intestine', 'villi', 'microvilli', 'nutrient absorption', 'lacteal', 'colon', 'water absorption', 'where are nutrients absorbed'],
        topicId: 'digestive',
        stepIdx: 4,
        title: 'Jejunal Brush Border Absorption & Water Reclamation',
        answer: "Over 90% of digested nutrients are absorbed across intestinal villi and microvilli into blood and lymph, while the colon reclaims water."
      },

      // Animal Classification
      {
        keywords: ['porifera', 'sponge', 'cnidaria', 'jellyfish', 'radial symmetry', 'cnidocyte', 'tissue layer'],
        topicId: 'animalClass',
        stepIdx: 0,
        title: 'Porifera & Cnidaria: Cellular & Tissue Foundations',
        answer: "Sponges represent parazoan cellular organization, while diploblastic cnidarians feature radial symmetry and specialized stinging nematocysts."
      },
      {
        keywords: ['invertebrate', 'arthropod', 'insect', 'crustacean', 'chitin', 'exoskeleton', 'mollusk', 'annelid', '95 percent'],
        topicId: 'animalClass',
        stepIdx: 1,
        title: 'Protostome Invertebrates & Chitinous Exoskeletons',
        answer: "Over 95% of animal species are invertebrates, with arthropods having jointed appendages and protective chitinous exoskeletons."
      },
      {
        keywords: ['chordate', 'notochord', 'dorsal nerve cord', 'pharyngeal slit', 'post anal tail', 'deuterostome', '4 chordate hallmarks', 'what is a chordate'],
        topicId: 'animalClass',
        stepIdx: 2,
        title: 'Deuterostome Emergence & 4 Chordate Hallmarks',
        answer: "All chordates share four developmental traits: a flexible notochord, dorsal hollow nerve cord, pharyngeal gill slits, and a post-anal muscular tail."
      },
      {
        keywords: ['amniote', 'amniotic egg', 'tetrapod', 'reptile', 'land reproduction', 'dry land egg', 'amphibian to land'],
        topicId: 'animalClass',
        stepIdx: 3,
        title: 'Vertebrate Transition to Land & Amniote Evolution',
        answer: "The evolution of the amniotic egg with protective membranes allowed amniotes (reptiles, birds, mammals) to reproduce on dry land independent of water."
      },
      {
        keywords: ['mammal', 'bird', 'aves', 'endotherm', 'warm blooded', '4 chamber heart', 'hair', 'mammary gland'],
        topicId: 'animalClass',
        stepIdx: 4,
        title: 'Mammalian & Avian High-Metabolic Homeothermy',
        answer: "Mammals and birds evolved endothermy and 4-chambered hearts to sustain high metabolic rates and maintain constant body temperatures."
      },

      // Ecosystems
      {
        keywords: ['producer', 'autotroph', 'primary productivity', 'gpp', 'npp', 'sunlight energy inflow', 'trophic level 1'],
        topicId: 'ecosystem',
        stepIdx: 0,
        title: 'Primary Productivity & Solar Inflow',
        answer: "Autotrophic primary producers capture solar energy through photosynthesis, forming the foundational energy base of the ecosystem."
      },
      {
        keywords: ['10 percent', 'lindeman', 'energy loss', 'herbivore', 'primary consumer', 'heat loss', 'trophic energy rule', 'how much energy is transferred'],
        topicId: 'ecosystem',
        stepIdx: 1,
        title: 'Herbivore Ingestion & Lindeman\'s 10% Law',
        answer: "In accordance with Lindeman's 10% law, only 10% of stored biomass energy transfers to herbivores; 90% is dissipated as metabolic heat and waste."
      },
      {
        keywords: ['carnivore', 'predator prey', 'secondary consumer', 'food web', 'lotka volterra', 'population balance'],
        topicId: 'ecosystem',
        stepIdx: 2,
        title: 'Predator-Prey Dynamics & Food Webs',
        answer: "Secondary consumers regulate herbivore population densities through predator-prey dynamics, stabilizing complex ecological food webs."
      },
      {
        keywords: ['keystone species', 'apex predator', 'trophic cascade', 'sea otter', 'wolf yellowstone', 'top down control', 'what is a keystone species'],
        topicId: 'ecosystem',
        stepIdx: 3,
        title: 'Apex Predator Trophic Cascades & Keystone Species',
        answer: "Keystone apex predators exert top-down control over ecosystem structure, preventing herbivore overgrazing and maintaining biodiversity."
      },
      {
        keywords: ['decomposer', 'detritivore', 'fungi', 'nutrient cycle', 'mineralization', 'recycle nutrient', 'carbon nitrogen cycle', 'biogeochemical'],
        topicId: 'ecosystem',
        stepIdx: 4,
        title: 'Decomposer Nutrient Mineralization & Biogeochemical Cycles',
        answer: "Decomposers break down dead organic matter, recycling essential nitrogen and phosphorus back into the soil for primary producer re-uptake."
      }
    ];
  }

  findBestMatch(queryText) {
    if (!queryText) return null;
    const cleanQ = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const words = cleanQ.split(/\s+/).filter(w => w.length > 2);

    let bestMatch = null;
    let highestScore = 0;

    for (const mapping of this.questionMappings) {
      let score = 0;

      // Exact keyword phrase match
      for (const kw of mapping.keywords) {
        if (cleanQ.includes(kw)) {
          score += 5;
        }
      }

      // Individual word overlap
      for (const word of words) {
        for (const kw of mapping.keywords) {
          if (kw.includes(word)) {
            score += 2;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = mapping;
      }
    }

    // Require minimum confidence threshold
    if (highestScore >= 3) {
      return bestMatch;
    }
    return null;
  }

  showVideoForQuestion(queryText, speakAnswer = true) {
    const match = this.findBestMatch(queryText);
    if (!match) return false;

    console.log("Smart Question Match:", match.title, "Topic:", match.topicId, "Step:", match.stepIdx);

    // 1. Switch to topic if not active
    if (window.bioApp) {
      if (window.bioApp.activeTopicId !== match.topicId) {
        window.bioApp.loadTopic(match.topicId);
      }

      // 2. Seek to exact step and ensure animation plays
      const currentTopic = window.bioApp.currentTopicInstance;
      if (currentTopic && currentTopic.seekStep) {
        currentTopic.seekStep(match.stepIdx, false);
        if (currentTopic.state) {
          currentTopic.state.isPlaying = true;
        }
      }
    }

    // 3. Highlight in study notes
    if (window.bioStudyNotesUI) {
      window.bioStudyNotesUI.setStep(match.stepIdx);
      window.bioStudyNotesUI.openTab('deepdive');
    }

    // 4. Update HUD visual feedback
    const feedbackPill = document.getElementById('voice-feedback-pill');
    if (feedbackPill) {
      feedbackPill.textContent = `👁️ Showing: ${match.title} (Step ${match.stepIdx + 1})`;
      feedbackPill.className = 'voice-feedback-pill success';
    }

    // 5. Speak answer
    if (speakAnswer && window.drHelix) {
      window.drHelix.say(`Showing video for ${match.title}: ${match.answer}`, 'explaining', true);
    }

    return true;
  }
}

window.smartQuestionEngine = new SmartQuestionEngine();
