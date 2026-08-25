// BioProcess 2-Minute Kid-Friendly Interactive Adventure Engine
class KidModeEngine {
  constructor() {
    this.isActive = false;
    this.currentTopicId = 'dnaGenetics';
    this.currentStep = 0;
    this.timerInterval = null;
    this.secondsRemaining = 120; // 2 minutes per topic tour
    this.stepDuration = 24; // 24 seconds per step (5 steps = 120s)

    this.kidAdventures = {
      dnaGenetics: {
        title: "🧬 The Magic Recipe Book of Life!",
        badge: "Super Geneticist",
        steps: [
          {
            headline: "📖 The Giant Recipe Book",
            funFact: "Every cell in your body has a 2-meter long recipe book called DNA! It holds the secret instructions for your eye color, hair, and smile!",
            mission: "👀 Look at your hands! You have 37 trillion tiny recipe books inside you right now!",
            speech: "Welcome to DNA adventure! Look at the twisted ladder. It holds the magic recipe of YOU! A always pairs with T, and C always pairs with G like best friends holding hands!"
          },
          {
            headline: "🤐 The Golden Zipper Monster (Helicase)",
            funFact: "To copy the recipe, a superhero enzyme named Helicase unzips your DNA just like the zipper on your favorite jacket!",
            mission: "🖐️ Make a zipper motion with your fingers as the yellow enzyme unzips the DNA!",
            speech: "Watch the yellow Helicase enzyme! It zooms down the ladder, breaking the tiny magnetic bonds and unzipping the DNA so we can make a copy!"
          },
          {
            headline: "🟢 The Green Starter Flag (Primase)",
            funFact: "DNA builders can't start without a green flag! RNA Primase lays down a tiny starter track to say 'Start building here!'",
            mission: "🚩 Wave your hand like a green flag to start the DNA builders!",
            speech: "Here comes Primase! It places a tiny green starter flag so the super builder knows exactly where to begin!"
          },
          {
            headline: "🏗️ The Super Lego Builder (Polymerase)",
            funFact: "DNA Polymerase snaps new building blocks into place at super speed—matching 1,000 letters every single second!",
            mission: "🧱 Pretend you're snapping Lego bricks together super fast in rhythm with the screen!",
            speech: "Now watch Polymerase! It snaps matching letters into place super fast! One strand builds smoothly, and the other builds in mini puzzle pieces called Okazaki fragments!"
          },
          {
            headline: "✨ The Magic Glue (Ligase)",
            funFact: "DNA Ligase acts like super-glue, sealing all the pieces together so you have two brand new, perfect recipe books!",
            mission: "🎉 High five the air! You just helped build a brand new DNA molecule!",
            speech: "And finally, Ligase glues all the pieces together! Now we have two identical twin DNA strands! High five, you're an official DNA master!"
          }
        ]
      },

      circulatory: {
        title: "❤️ The Superhero Heart & Oxygen Highway!",
        badge: "Heart Hero",
        steps: [
          {
            headline: "🚗 Blue Blood Trucks Return Home",
            funFact: "Tired blue blood trucks return through big body highways (veins) to the right side of your heart to get refueled!",
            mission: "🖐️ Put your hand over your chest and feel your heart pumping: Thump-thump, thump-thump!",
            speech: "Welcome to your amazing heart engine! Tired blue blood cells that delivered all their oxygen are returning home to the Right Atrium to get re-energized!"
          },
          {
            headline: "🚀 Blastoff to the Oxygen Station!",
            funFact: "Your heart's right ventricle squeezes tight to launch the blood trucks on a rocket ride to your lungs!",
            mission: "✊ Squeeze your fists tight together every time the heart beats!",
            speech: "Squeeze! The heart muscle pumps blue blood up through the pulmonary artery straight to your lungs!"
          },
          {
            headline: "🎈 The Fresh Oxygen Gas Station",
            funFact: "In your lungs, red blood cells drop off carbon dioxide exhaust and load up with shiny red oxygen bubbles!",
            mission: "🌬️ Take a huge deep breath in! Feel that fresh oxygen filling your red blood cells!",
            speech: "Ahhh! In the lungs, millions of tiny blood cells breathe in fresh oxygen and turn shiny bright ruby red!"
          },
          {
            headline: "🚪 Welcome to the Super Pump Room",
            funFact: "Oxygen-packed red blood arrives in the left atrium and slips through the heart's bicuspid trapdoor!",
            mission: "🚪 Make a flap motion with your hands like the heart's one-way safety valves!",
            speech: "The bright red oxygen trucks enter the Left Atrium and whoosh through the valve door into the giant power chamber!"
          },
          {
            headline: "💥 Super Aorta Blast to the Whole Body!",
            funFact: "The super-thick left ventricle pumps blood at 120 mmHg—enough pressure to shoot water across a room!",
            mission: "🏃 Jump up and down 3 times! Feel your heart speed up to feed your running muscles!",
            speech: "BOOM! The left ventricle muscles fire with mega power, rocketing oxygen to your brain, toes, and fingers! You're a true Heart Hero!"
          }
        ]
      },

      respiratory: {
        title: "🫁 The Super Oxygen Tree & Bubble Balloons!",
        badge: "Breath Master",
        steps: [
          {
            headline: "👃 The Super Air Conditioner Nose",
            funFact: "Your nose has tiny warming heaters and microscopic hairs that clean, warm, and filter dust from the air you breathe!",
            mission: "👃 Sniff gently through your nose! Feel how clean and warm the air feels!",
            speech: "Let's explore breathing! When you inhale, your amazing nose acts like a high-tech air filter, warming and cleaning the air for your lungs!"
          },
          {
            headline: "🎈 The Diaphragm Elevator Muscle",
            funFact: "Your diaphragm is a giant parachute muscle underneath your lungs that pulls down like an elevator so air rushes in!",
            mission: "🫁 Put your hands on your tummy, breathe in, and push your belly out!",
            speech: "Watch the purple diaphragm muscle pull downward! This makes your chest bigger, creating a vacuum that pulls fresh air in like a super vacuum cleaner!"
          },
          {
            headline: "🌳 The Upside-Down Breathing Tree",
            funFact: "Your windpipe branches into smaller and smaller tubes, looking just like an upside-down tree with 30,000 tiny branches!",
            mission: "🌿 Trace the branches of the airway tree with your finger on the screen!",
            speech: "Air zooms down your windpipe and spreads through thousands of tiny tree branches called bronchioles!"
          },
          {
            headline: "🫧 300 Million Tiny Gas Exchange Bubbles",
            funFact: "At the end of the tree branches are 300 million tiny bubbles called alveoli—laid flat, they'd cover a whole tennis court!",
            mission: "🫧 Blow gentle imaginary bubbles with your mouth!",
            speech: "Look at the tiny alveoli bubbles! Oxygen leaps across the ultra-thin bubble wall into your blood, while carbon dioxide jumps out!"
          },
          {
            headline: "💨 The Giant Exhale Whoosh!",
            funFact: "When your lungs relax, they bounce back like a rubber band and whoosh out all the carbon dioxide exhaust!",
            mission: "💨 Let out a giant whooooosh breath to relax your lungs!",
            speech: "Whoooosh! Your lungs relax like soft bouncy balloons and send the carbon dioxide out into the world for trees to enjoy! Awesome job!"
          }
        ]
      },

      nervous: {
        title: "🧠 The Electric Lightning Highway in Your Brain!",
        badge: "Brain Wizard",
        steps: [
          {
            headline: "🔋 The Charged-Up Battery Neuron (-70 mV)",
            funFact: "Every neuron is a tiny biological battery powered by sodium (salt) on the outside and potassium (bananas) on the inside!",
            mission: "⚡ Rub your hands together fast to feel the warm electrical energy!",
            speech: "Welcome to your brain! You have 86 billion electric neurons charged up like tiny super-batteries at minus 70 millivolts, ready to fire!"
          },
          {
            headline: "🎯 Ready, Set... Trigger the Spark! (-55 mV)",
            funFact: "When an idea or touch reaches the trigger point (-55 mV), the neuron decides to fire an unstoppable electric lightning bolt!",
            mission: "☝️ Tap your desk once! That sent a real electrical signal to your brain!",
            speech: "When a thought is strong enough, the neuron reaches threshold and triggers an instant electrical spark!"
          },
          {
            headline: "⚡ The Big Electric Lightning Spike (+30 mV)",
            funFact: "Sodium gates burst open and electrical lightning shoots down the wire at 268 miles per hour—faster than a Formula 1 racecar!",
            mission: "🏎️ Make a zooming racecar sound: Vrooooom!",
            speech: "ZAP! Sodium rushes in and the electric potential spikes to plus 30 millivolts! Lightning shoots down the nerve highway!"
          },
          {
            headline: "🦘 The Super Kangaroo Jump (Saltatory Conduction)",
            funFact: "Instead of crawling, the electric spark hops between insulated myelin pads like a kangaroo on a trampoline!",
            mission: "🦘 Hop in place once like an electric spark leaping between nodes!",
            speech: "Look at the spark leap! It jumps over the myelin pads from node to node, zooming at superhero speeds!"
          },
          {
            headline: "💬 The Chemical Messenger Party (Synapse)",
            funFact: "When the spark reaches the end, it launches tiny bubble rockets full of neurotransmitters across the gap to the next brain cell!",
            mission: "👏 Clap your hands together—that is your brain communicating in 1 millisecond!",
            speech: "Pop, pop, pop! Tiny chemical messengers splash across the synaptic river to tell the next cell what to think and feel! You're a Brain Wizard!"
          }
        ]
      },

      photosynthesis: {
        title: "🌿 The Solar Kitchen: Cooking Sunshine into Candy!",
        badge: "Solar Chef",
        steps: [
          {
            headline: "☀️ Catching Golden Sunlight Rays",
            funFact: "Green leaves have tiny solar panels called chlorophyll that catch energy from the sun!",
            mission: "☀️ Reach your hands up high to the sun like a happy green leaf!",
            speech: "Welcome to the plant kitchen! Green leaves catch golden sunlight photons with special chlorophyll solar panels!"
          },
          {
            headline: "💧 Splitting Water to Make Fresh Oxygen",
            funFact: "The plant uses sun power to crack water molecules apart—and breathes out fresh clean oxygen for YOU to breathe!",
            mission: "👃 Take a breath of fresh air and say 'Thank you, green plants!'",
            speech: "CRACK! Solar energy splits water molecules in half, and out pops fresh, clean oxygen gas into the air for all humans and animals!"
          },
          {
            headline: "⚡ The Proton Water Slide",
            funFact: "Electrons zoom down a tiny microscopic roller coaster, pumping energy into tiny plant powerhouses!",
            mission: "🎢 Wave your hands like you're riding a microscopic roller coaster!",
            speech: "Weeee! High-energy electrons zoom down the transport chain, building up energy like water behind a giant dam!"
          },
          {
            headline: "🔋 Charging the Plant Batteries (ATP & NADPH)",
            funFact: "The plant makes super-charged molecular batteries called ATP to power its secret sugar factory!",
            mission: "🔋 Flex your muscles to show your super battery power!",
            speech: "The plant charges up its magical battery packs, ATP and NADPH, ready to cook delicious sugar in the dark!"
          },
          {
            headline: "🍬 The Calvin Sugar Candy Factory",
            funFact: "An enzyme named RuBisCO grabs carbon dioxide from the air and bakes it into sweet, delicious glucose!",
            mission: "😋 Rub your tummy and pretend you're tasting delicious sweet fruits!",
            speech: "RuBisCO stirs the pot in the stroma and turns air into sweet glucose food! Now the plant can grow big and tall! You're a master Solar Chef!"
          }
        ]
      },

      cellStructure: {
        title: "🧫 The Ultimate Microscopic City Inside You!",
        badge: "City Architect",
        steps: [
          {
            headline: "🏰 The Flexible City Wall (Cell Membrane)",
            funFact: "Your cells have a soft, squishy bubble gate that lets friendly food in and keeps bad germs out!",
            mission: "🛡️ Hold up an imaginary superhero shield to protect the cell city!",
            speech: "Welcome to the cell city! The outer membrane is like a smart security bubble that lets good nutrients in and keeps bad stuff out!"
          },
          {
            headline: "🏛️ The Mayor's Vault (Nucleus)",
            funFact: "The Nucleus is the city hall where the master blueprint books of your entire body are safely locked away!",
            mission: "🔐 Pretend you are unlocking a secret treasure vault!",
            speech: "Step inside City Hall! The Nucleus protects your precious DNA blueprints and sends out daily work orders to the city builders!"
          },
          {
            headline: "📦 The Toy Factory & Delivery Trucks (ER & Golgi)",
            funFact: "The ER factory builds proteins, and the Golgi apparatus boxes them up with stamps and sends them on delivery!",
            mission: "📦 Pretend to wrap and stamp a tiny molecular package!",
            speech: "Beep beep! The endoplasmic reticulum builds proteins, and the Golgi postal office stamps and ships them to wherever your body needs them!"
          },
          {
            headline: "⚡ The Power Plant Generators (Mitochondria)",
            funFact: "Mitochondria are the city power plants that turn the food you eat into energetic battery sparks!",
            mission: "💥 Jump and do a star jump with all your cellular energy!",
            speech: "Look at the powerhouse Mitochondria! Their folded cristae generate all the ATP electricity you need to run, jump, and play!"
          },
          {
            headline: "🌳 The Super Plant City Upgrades",
            funFact: "Plant cells get bonus upgrades: giant water swimming pools (vacuoles) and wooden armor walls (cellulose)!",
            mission: "🌲 Stand tall and stiff like a strong oak tree with cellulose cell walls!",
            speech: "Plant cells have super armor cell walls, solar factories, and giant water pools! Look at that amazing microscopic metropolis! You're a Cell City Architect!"
          }
        ]
      },

      microorganisms: {
        title: "🦠 The Microscopic Jungle: Good & Bad Microbes!",
        badge: "Microbe Hunter",
        steps: [
          {
            headline: "🧫 Painting the Jelly Agar Canvas",
            funFact: "Scientists feed bacteria yummy nutrient seaweed jelly in petri dishes to watch single germs grow into big colorful colonies!",
            mission: "🎨 Pretend you have a paintbrush and paint invisible zigzag lines on your desk!",
            speech: "Welcome to the microbiology lab! We spread microscopic bacteria across seaweed agar jelly so we can study them under the microscope!"
          },
          {
            headline: "🟣 The Purple & Pink Paint Test (Gram Stain)",
            funFact: "Thick armored bacteria turn bright purple (Gram-positive), while thin stealthy bacteria turn bright pink (Gram-negative)!",
            mission: "🟣 Guess whether your favorite microbe is team Purple or team Pink!",
            speech: "Look at the colors! Thick-walled bacteria soak up crystal violet and turn royal purple, while double-membrane bacteria turn bright pink!"
          },
          {
            headline: "👯 The Magic Double-Up Clone Trick",
            funFact: "One bacterium can split into two in just 20 minutes! In a few hours, one single germ can become a million friends!",
            mission: "✌️ Hold up 2 fingers, then 4, then 8 to show exponential doubling!",
            speech: "Pop! The bacterium splits right down the middle with FtsZ scissors to make two identical twin clones in 20 minutes flat!"
          },
          {
            headline: "🛡️ The Shield of Protection (Antibiotic Disc)",
            funFact: "When good medicine touches bacteria, it makes a giant clear 'no-entry' circle called the Zone of Inhibition!",
            mission: "⭕ Draw a giant circle in the air to make a shield zone!",
            speech: "Look at the medicine disc! It creates a glowing clear protective halo where bacteria cannot grow! That's how medicine protects us!"
          },
          {
            headline: "🤝 The Secret Plasmid Handshake",
            funFact: "Bacteria can reach out tiny arms called sex pili and share secret mini-recipe rings (plasmids) with their friends!",
            mission: "🤝 Give a secret handshake to an imaginary microscopic friend!",
            speech: "Bacteria reach out and share mini circular plasmid rings! Now you know the secret life of microbes! You're an official Microbe Hunter!"
          }
        ]
      },

      digestive: {
        title: "🥪 The 30-Foot Rollercoaster of Food!",
        badge: "Digestion Explorer",
        steps: [
          {
            headline: "🦷 The Chomping & Chewing Machine",
            funFact: "Your teeth crush food into a soft ball, while your spit (saliva) has chemical scissors that start snipping starch into sugar!",
            mission: "😋 Chew an imaginary crunchy apple: Chomp, chomp, chomp!",
            speech: "Welcome to the 30-foot digestion rollercoaster! Your teeth crush your food while saliva begins snipping starch molecules right in your mouth!"
          },
          {
            headline: "🎢 The Squeezing Throat Slide (Peristalsis)",
            funFact: "Your esophagus squeezes food down like squeezing toothpaste out of a tube—even if you're hanging upside down on monkey bars!",
            mission: "🤸 Pretend you're squeezing a tube of toothpaste with your hands!",
            speech: "Weeee! The esophagus muscles do a wave-like squeeze called peristalsis, pushing the food smoothly down into your stomach!"
          },
          {
            headline: "🧪 The Bubbling Acid Volcano Stomach",
            funFact: "Your stomach makes bubbling acid as strong as lemon juice to melt food into a warm soup called chyme!",
            mission: "🌋 Make bubbling volcano sounds: Glug, glug, bubble!",
            speech: "Splash! The stomach churns like a bubbling potion kettle, using hydrochloric acid and pepsin to break down tough protein bonds!"
          },
          {
            headline: "🧼 The Green Soap Magic (Liver Bile)",
            funFact: "Your liver makes green bile liquid that works just like dish soap, turning big greasy fat blobs into tiny bubbles!",
            mission: "🫧 Pretend to wash greasy dishes with dish soap bubbles!",
            speech: "Here comes liver bile! It acts like dishwashing soap, breaking big oily pizza fats into tiny microscopic droplets so enzymes can eat them!"
          },
          {
            headline: "🧽 The Super Sponge Villi Absorbers",
            funFact: "Your small intestine is lined with millions of tiny microscopic fingers (villi) that soak up vitamins and send them straight to your muscles!",
            mission: "🖐️ Wiggle all 10 fingers like tiny absorption sponges!",
            speech: "Look at the tiny villi fingers! They soak up all the delicious vitamins, minerals, and proteins, fueling your body with boundless energy! What a ride!"
          }
        ]
      },

      animalClass: {
        title: "🦁 The Animal Superhero League & Taxonomy!",
        badge: "Master Zoologist",
        steps: [
          {
            headline: "🧽 The Ocean Sponges & Glowing Jellyfish",
            funFact: "Sponges have no brains or hearts, and jellyfish are 95% water with stinging tentacle superpowers!",
            mission: "🌊 Float your hands gracefully like a peaceful glowing jellyfish!",
            speech: "Welcome to the Animal Superhero League! Sea sponges and jellyfish were the first ocean pioneers, floating in ancient seas millions of years ago!"
          },
          {
            headline: "🐜 The Iron-Man Exoskeleton Club",
            funFact: "More than 95% of all animals on Earth are invertebrates! Insects and crabs wear their skeletons on the OUTSIDE like armor!",
            mission: "🛡️ Knock on your elbow and pretend you have rock-hard insect armor!",
            speech: "Over 95 percent of all animals on Earth don't have backbones! Bugs, crabs, and spiders wear super-strong chitin armor on the outside!"
          },
          {
            headline: "🦴 The Elite Backbone Club (Chordata)",
            funFact: "All chordates (including fish, birds, dogs, and YOU!) have a strong flexible backbone rod called a notochord!",
            mission: "🦴 Run your finger down your back to feel your own amazing spine bones!",
            speech: "Look at the backbone club! Fish, frogs, birds, and YOU share four amazing superhero traits, including a strong flexible spine!"
          },
          {
            headline: "🥚 The Astronaut Egg Space Capsule",
            funFact: "The amniotic egg was like a self-contained spaceship that let baby reptiles and dinosaurs grow on dry land without drying out!",
            mission: "🦖 Make a fierce dinosaur roar: RAAAWR!",
            speech: "The amniotic egg was nature's ultimate invention! It carried its own private ocean inside, allowing animals to leave the water and explore the land!"
          },
          {
            headline: "🐻 The Warm-Blooded Mammals & Feathered Birds",
            funFact: "Birds and mammals have 4-chambered hearts and warm fur/feathers to stay cozy anywhere from frozen Antarctica to hot deserts!",
            mission: "🦅 Spread your arms wide and flap like an eagle soaring over mountains!",
            speech: "And finally, birds and mammals evolved warm-blooded powers to run, fly, and stay warm anywhere on Earth! You're an official Master Zoologist!"
          }
        ]
      },

      ecosystem: {
        title: "🌲 The Great Circle of Life & Trophic Team!",
        badge: "Eco Guardian",
        steps: [
          {
            headline: "🌱 The Super Sun Harvesters (Producers)",
            funFact: "Green plants and trees capture sunlight to make food for every living creature in the entire forest!",
            mission: "🌱 Stand tall and stretch your branches up to the sky like a mighty tree!",
            speech: "Welcome to the circle of life! Green plants are the great producers, turning sunbeams into sweet energy for the whole forest!"
          },
          {
            headline: "🐰 The 10% Energy Snack Rule",
            funFact: "When a bunny eats grass, 90% of the energy is used for jumping and playing, and only 10% stays as bunny power!",
            mission: "🐰 Hop 2 times like a hungry little bunny searching for clover!",
            speech: "Hop, hop! When herbivores eat plants, only 10 percent of the energy moves up the chain because bunnies use the rest for warm hopping energy!"
          },
          {
            headline: "🦊 The Forest Food Web Highway",
            funFact: "A food web is like a giant spiderweb of friends where everyone helps keep the animal population in perfect balance!",
            mission: "🕸️ Weave an imaginary spiderweb with your fingers in the air!",
            speech: "Look at the interconnected food web! Foxes, birds, insects, and plants all work together like a synchronized orchestra!"
          },
          {
            headline: "🐺 The Keystone Superhero Bosses",
            funFact: "Just like a bridge needs a keystone, an ecosystem needs apex predators (like sea otters and wolves) to protect forests and kelp!",
            mission: "🦦 Pretend you're a cute sea otter floating on your back cracking open a snack!",
            speech: "Keystone superheroes like sea otters protect the entire kelp forest from being eaten by sea urchins! They keep the whole ecosystem safe!"
          },
          {
            headline: "🍄 The Magic Mushroom Recyclers",
            funFact: "Mushroom decomposers are Earth's cleanup crew—they turn fallen autumn leaves back into rich soil for baby seeds to grow!",
            mission: "🌍 Give yourself a big hug and celebrate protecting our planet Earth!",
            speech: "And finally, mushrooms and soil microbes recycle every scrap of fallen leaves back into rich earth so new flowers can bloom! You're a true Eco Guardian!"
          }
        ]
      }
    };
  }

  startKidTour(topicId = null) {
    if (topicId) this.currentTopicId = topicId;
    else this.currentTopicId = window.bioApp?.activeTopicId || 'dnaGenetics';

    this.isActive = true;
    this.currentStep = 0;
    this.secondsRemaining = 120;

    // Load topic into main video cinema
    if (window.bioApp && window.bioApp.activeTopicId !== this.currentTopicId) {
      window.bioApp.loadTopic(this.currentTopicId);
    }

    if (window.bioAudio) window.bioAudio.playFanfare();

    this.renderKidTourModal();
    this.playStep(0);
    this.startTimer();
  }

  renderKidTourModal() {
    let overlay = document.getElementById('kid-tour-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'kid-tour-modal-overlay';
      overlay.className = 'kid-tour-modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.classList.add('open');
  }

  playStep(stepIdx) {
    this.currentStep = stepIdx;
    const tourData = this.kidAdventures[this.currentTopicId];
    if (!tourData) return;

    const stepData = tourData.steps[stepIdx];
    if (!stepData) return;

    // Seek simulation video to this step and ensure it's playing
    const currentTopic = window.bioApp?.currentTopicInstance;
    if (currentTopic && currentTopic.seekStep) {
      currentTopic.seekStep(stepIdx, false);
      if (currentTopic.state) currentTopic.state.isPlaying = true;
    }

    // Sync study notes sidebar
    if (window.bioStudyNotesUI) {
      window.bioStudyNotesUI.setStep(stepIdx);
    }

    if (window.bioAudio) window.bioAudio.playSuccess();

    const overlay = document.getElementById('kid-tour-modal-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="kid-tour-card">
        <!-- Top Bar -->
        <div class="kid-tour-header">
          <div class="kid-tour-brand">
            <span class="kid-badge-icon">🎒</span>
            <div>
              <span class="kid-tour-title">${tourData.title}</span>
              <span class="kid-tour-sub">2-Minute Interactive Kid Adventure (Step ${stepIdx + 1} of 5)</span>
            </div>
          </div>
          <div class="kid-tour-right-meta">
            <span class="kid-timer-pill" id="kid-timer-display">⏱️ ${Math.floor(this.secondsRemaining / 60)}:${(this.secondsRemaining % 60).toString().padStart(2, '0')}</span>
            <button class="kid-tour-close" id="btn-close-kid-tour">✕</button>
          </div>
        </div>

        <!-- 5-Step Star Progress Bar -->
        <div class="kid-step-stars-row">
          ${[0, 1, 2, 3, 4].map(i => `
            <div class="kid-star-chip ${i === stepIdx ? 'active' : ''} ${i < stepIdx ? 'done' : ''}" data-step="${i}">
              <span>${i < stepIdx ? '⭐' : (i === stepIdx ? '🌟' : '⚪')}</span>
              <span>Step ${i + 1}</span>
            </div>
          `).join('')}
        </div>

        <!-- Main Kid Story Body -->
        <div class="kid-story-body">
          <div class="kid-headline-banner">
            <h2>${stepData.headline}</h2>
          </div>

          <div class="kid-fact-box">
            <span class="fact-bulb">💡</span>
            <p class="fact-text"><strong>Kid Wonder Fact:</strong> ${stepData.funFact}</p>
          </div>

          <div class="kid-interactive-mission-card">
            <span class="mission-icon">🎯</span>
            <div class="mission-content">
              <span class="mission-tag">YOUR INTERACTIVE MISSION</span>
              <p class="mission-text">${stepData.mission}</p>
            </div>
          </div>

          <div class="kid-live-video-alert">
            <span class="pulse-spark">🔴</span>
            <span>Watch the 60 FPS animation on your left as this step comes to life!</span>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="kid-tour-footer">
          <button class="kid-nav-btn secondary" id="btn-kid-prev" ${stepIdx === 0 ? 'disabled' : ''}>
            ⬅ Previous Step
          </button>
          <button class="kid-voice-read-btn" id="btn-kid-speak">
            🔊 Repeat Story Voice
          </button>
          <button class="kid-nav-btn primary" id="btn-kid-next">
            ${stepIdx === 4 ? '🏆 Finish & Claim Badge!' : 'Next Step ➡'}
          </button>
        </div>
      </div>
    `;

    // Event bindings
    document.getElementById('btn-close-kid-tour')?.addEventListener('click', () => this.stopKidTour());
    document.getElementById('btn-kid-prev')?.addEventListener('click', () => {
      if (this.currentStep > 0) this.playStep(this.currentStep - 1);
    });
    document.getElementById('btn-kid-next')?.addEventListener('click', () => {
      if (this.currentStep < 4) {
        this.playStep(this.currentStep + 1);
      } else {
        this.finishKidTour();
      }
    });

    document.getElementById('btn-kid-speak')?.addEventListener('click', () => {
      if (window.drHelix) window.drHelix.say(stepData.speech, 'excited', true);
    });

    overlay.querySelectorAll('.kid-star-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const s = parseInt(chip.dataset.step);
        this.playStep(s);
      });
    });

    // Speak joyful narration
    if (window.drHelix) {
      window.drHelix.say(stepData.speech, 'excited', true);
    }
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      const timerDisplay = document.getElementById('kid-timer-display');
      if (timerDisplay) {
        const m = Math.floor(this.secondsRemaining / 60);
        const s = (this.secondsRemaining % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `⏱️ ${m}:${s}`;
      }

      // Auto-advance step every stepDuration seconds
      const targetStep = Math.min(4, Math.floor((120 - this.secondsRemaining) / this.stepDuration));
      if (targetStep !== this.currentStep && targetStep < 5) {
        this.playStep(targetStep);
      }

      if (this.secondsRemaining <= 0) {
        this.finishKidTour();
      }
    }, 1000);
  }

  finishKidTour() {
    clearInterval(this.timerInterval);
    const tourData = this.kidAdventures[this.currentTopicId];
    if (window.bioAudio) window.bioAudio.playFanfare();

    const overlay = document.getElementById('kid-tour-modal-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="kid-tour-card celebration">
        <div class="celebration-hero-icon">🌟🏆🌟</div>
        <h2 class="celebration-title">HOORAY! You Completed the 2-Minute Adventure!</h2>
        <p class="celebration-subtitle">You are now an official <strong>${tourData.badge}</strong>!</p>

        <div class="kid-badge-showcase">
          <span class="big-kid-badge">🎖️</span>
          <div>
            <h3>${tourData.title}</h3>
            <p>Mastered all 5 animated steps with flying colors!</p>
          </div>
        </div>

        <div class="celebration-buttons">
          <button class="kid-action-big-btn quiz" id="btn-kid-start-quiz">🎯 Try Kid Quiz Challenge</button>
          <button class="kid-action-big-btn done" id="btn-kid-finish-all">🔬 Return to Lab</button>
        </div>
      </div>
    `;

    if (window.drHelix) {
      window.drHelix.say(`Hooray! You completed the 2-minute ${tourData.title} adventure! You are now an official ${tourData.badge}!`, 'celebrating', true);
    }

    document.getElementById('btn-kid-start-quiz')?.addEventListener('click', () => {
      this.stopKidTour();
      if (window.bioQuizEngine) window.bioQuizEngine.openQuiz(this.currentTopicId);
    });

    document.getElementById('btn-kid-finish-all')?.addEventListener('click', () => {
      this.stopKidTour();
    });
  }

  stopKidTour() {
    clearInterval(this.timerInterval);
    this.isActive = false;
    const overlay = document.getElementById('kid-tour-modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }
}

window.kidModeEngine = new KidModeEngine();
