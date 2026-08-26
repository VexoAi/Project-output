// ==========================================================================
// PHYSICS SUBTEACHING & INTERACTIVE CLASSROOM ENGINE
// Voice AI • Multi-phase 30s Lessons • Interactive Quizzes • Video Exporter
// ==========================================================================

let currentTopicKey = "inertia";
const TOPIC_DURATION = 30;
let currentTimelineTime = 0;
let isPlaying = false;
let isIdleState = true;
let isWelcomeMode = true;
let dialogueTriggered = {};
let isSpeaking = false;

let isInternalAudioPlaying = false;
let lastInternalSpokenText = "";
let lastInternalSpeechEndTime = 0;
let speechWatchdogTimer = null;

// 1. SPEECH SYNTHESIS & SUBTITLES (With Acoustic Echo Isolation & Watchdog)
function speakDialogue(charKey, text, onEnd = null) {
    const char = (typeof CHARACTER_VOICES !== "undefined" && CHARACTER_VOICES[charKey]) ? CHARACTER_VOICES[charKey] : (CHARACTER_VOICES?.teacher || { name: "Physics Teacher", emoji: "👨‍🏫", pitch: 1.0, rate: 1.02, color: "#38bdf8" });
    const speakerEmoji = document.getElementById("speakerEmoji");
    const speakerName = document.getElementById("speakerName");
    const speakerDialogue = document.getElementById("speakerDialogue");
    const speakerAvatar = document.getElementById("speakerAvatar");
    const micLiveBadge = document.getElementById("micLiveBadge");

    if (speakerEmoji) speakerEmoji.textContent = char.emoji;
    if (speakerName) {
        speakerName.textContent = char.name;
        speakerName.style.color = char.color;
    }
    if (speakerDialogue) speakerDialogue.textContent = `"${text}"`;
    if (speakerAvatar) speakerAvatar.style.borderColor = char.color;

    if (!("speechSynthesis" in window)) {
        if (onEnd) setTimeout(onEnd, 2000);
        return;
    }

    try {
        window.speechSynthesis.cancel();
        if (speechWatchdogTimer) clearTimeout(speechWatchdogTimer);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = char.pitch;
        utterance.rate = char.rate;
        window.__activeUtterance = utterance; // Prevent garbage collection in Chrome

        isSpeaking = true;
        isInternalAudioPlaying = true;
        lastInternalSpokenText = (text || "").toLowerCase();

        // Inform user that internal audio is playing
        if (isListening && micLiveBadge) {
            micLiveBadge.textContent = "AI SPEAKING (ISOLATED) 🔇";
            micLiveBadge.className = "live-pill";
        }

        const handleSpeechEnd = () => {
            if (speechWatchdogTimer) clearTimeout(speechWatchdogTimer);
            isSpeaking = false;
            lastInternalSpeechEndTime = Date.now();
            setTimeout(() => {
                isInternalAudioPlaying = false;
                if (isListening && micLiveBadge) {
                    micLiveBadge.textContent = "LIVE LISTENING 🎙️";
                    micLiveBadge.className = "live-pill active";
                }
            }, 1200); // 1.2s acoustic decay buffer so speaker sound never leaks into mic
            if (onEnd) onEnd();
        };

        // Safety Watchdog: Release mic lock automatically if browser misses utterance.onend
        const safeDuration = Math.max(2000, ((text || "").length / 10) * 1000);
        speechWatchdogTimer = setTimeout(handleSpeechEnd, safeDuration + 1000);

        utterance.onend = handleSpeechEnd;
        utterance.onerror = handleSpeechEnd;
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        isSpeaking = false;
        isInternalAudioPlaying = false;
        if (onEnd) onEnd();
    }
}

// 2. STOP CONTROLLER
function stopAllActionsImmediately() {
    isPlaying = false;
    isIdleState = true;
    if (typeof clearQuizTimers === "function") clearQuizTimers();

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    if (typeof sounds !== "undefined" && sounds.stopAll) {
        sounds.stopAll();
    }

    currentTimelineTime = 0;
    dialogueTriggered = {};

    const playPauseIcon = document.getElementById("playPauseIcon");
    const aiStateBadge = document.getElementById("aiStateBadge");
    const aiStateText = document.getElementById("aiStateText");
    const currentSceneName = document.getElementById("currentSceneName");
    const victoryBanner = document.getElementById("victory-banner");
    const timelineProgress = document.getElementById("timelineProgress");
    const timelineScrubber = document.getElementById("timelineScrubber");
    const powerBarFill = document.getElementById("powerBarFill");
    const timeDisplay = document.getElementById("timeDisplay");
    const speakerDialogue = document.getElementById("speakerDialogue");
    const speakerName = document.getElementById("speakerName");

    if (playPauseIcon) playPauseIcon.textContent = "▶";
    if (aiStateBadge) {
        aiStateBadge.className = "status-pill status-ready";
        if (aiStateText) aiStateText.textContent = "🎙️ Ready — Live Mic Active (Speak Next Topic)...";
    }
    if (currentSceneName) currentSceneName.textContent = "State: Resting (Live Mic Active)";
    if (victoryBanner) victoryBanner.classList.add("hidden");
    if (timelineProgress) timelineProgress.style.width = "0%";
    if (powerBarFill) powerBarFill.style.width = "0%";
    if (timelineScrubber) timelineScrubber.value = 0;
    if (timeDisplay) timeDisplay.textContent = "00:00 / 00:30.0";
    if (speakerName) speakerName.textContent = "Physics Teacher";
    if (speakerDialogue) speakerDialogue.textContent = `"Live mic is active! Say any physics command to generate 30s video!"`;
}

// 3. TOPIC PLAYBACK GENERATOR
function generateAndPlayTopic(topicKey) {
    if (!TOPIC_CONFIG || !TOPIC_CONFIG[topicKey]) return;

    const welcomeHero = document.getElementById("welcome-hero-banner");
    if (welcomeHero) welcomeHero.classList.add("hidden");
    isWelcomeMode = false;
    isIdleState = false;

    currentTopicKey = topicKey;
    const cfg = TOPIC_CONFIG[currentTopicKey];

    document.querySelectorAll(".topic-chip").forEach(c => c.classList.toggle("active", c.dataset.topic === currentTopicKey));

    const holoTitle = document.getElementById("holoTopicTitle");
    const holoSub = document.getElementById("holoConceptSubtitle");
    const lvl = document.getElementById("levelLabel");
    const scName = document.getElementById("currentSceneName");
    const vTitle = document.getElementById("victoryTitleText");
    const vQuote = document.getElementById("victoryQuoteText");
    const aiStateBadge = document.getElementById("aiStateBadge");
    const aiStateText = document.getElementById("aiStateText");
    const stageTopicTitle = document.getElementById("stageTopicTitle");
    const stageTopicSub = document.getElementById("stageTopicSub");
    const stageTopicIcon = document.getElementById("stageTopicIcon");

    if (holoTitle) holoTitle.textContent = cfg.title;
    if (holoSub) holoSub.textContent = cfg.sub;
    if (lvl) lvl.textContent = cfg.level;
    if (scName) scName.textContent = `Topic: ${cfg.title}`;
    if (vTitle) vTitle.textContent = `${cfg.title} MASTERED!`;
    if (vQuote) vQuote.textContent = `"${cfg.quote}"`;

    if (stageTopicTitle) stageTopicTitle.textContent = cfg.title;
    if (stageTopicSub) stageTopicSub.textContent = cfg.sub ? cfg.sub.toUpperCase() : "PHYSICS TOPIC";
    if (stageTopicIcon) stageTopicIcon.textContent = cfg.icon || cfg.emoji || "📚";

    if (aiStateBadge) {
        aiStateBadge.className = "status-pill status-generating";
        if (aiStateText) aiStateText.textContent = `⚡ Generating 30s 2D Animation: ${cfg.title}`;
    }

    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    dialogueTriggered = {};
    updateTimeline(0);
    playStoryboard();
}

function updateTimeline(time) {
    currentTimelineTime = Math.max(0, Math.min(time, TOPIC_DURATION));
    const p = (currentTimelineTime / TOPIC_DURATION) * 100;
    const timelineProgress = document.getElementById("timelineProgress");
    const timelineScrubber = document.getElementById("timelineScrubber");
    const powerBarFill = document.getElementById("powerBarFill");
    const timeDisplay = document.getElementById("timeDisplay");

    if (timelineProgress) timelineProgress.style.width = `${p}%`;
    if (powerBarFill) powerBarFill.style.width = `${p}%`;
    if (timelineScrubber) timelineScrubber.value = p;
    if (timeDisplay) timeDisplay.textContent = `${formatTime(currentTimelineTime)} / 00:30.0`;

    let step = 1;
    if (currentTimelineTime >= 10.0 && currentTimelineTime < 20.0) step = 2;
    else if (currentTimelineTime >= 20.0) step = 3;

    document.querySelectorAll(".scene-step-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.step) === step);
    });

    // Handle voice triggers for the 3 phases
    if (!isIdleState && TOPIC_CONFIG && TOPIC_CONFIG[currentTopicKey]) {
        const cfg = TOPIC_CONFIG[currentTopicKey];
        if (currentTimelineTime < 10.0 && !dialogueTriggered["t_p1"]) {
            dialogueTriggered["t_p1"] = true;
            if (cfg.dialogues?.p1) speakDialogue(cfg.dialogues.p1.speaker, cfg.dialogues.p1.text);
        } else if (currentTimelineTime >= 10.0 && currentTimelineTime < 20.0 && !dialogueTriggered["t_p2"]) {
            dialogueTriggered["t_p2"] = true;
            if (cfg.dialogues?.p2) speakDialogue(cfg.dialogues.p2.speaker, cfg.dialogues.p2.text);
        } else if (currentTimelineTime >= 20.0 && !dialogueTriggered["t_p3"]) {
            dialogueTriggered["t_p3"] = true;
            if (cfg.dialogues?.p3) speakDialogue(cfg.dialogues.p3.speaker, cfg.dialogues.p3.text);
        }
    }

    if (currentTimelineTime >= TOPIC_DURATION) {
        stopAllActionsImmediately();
        showTopicQuiz(currentTopicKey);
    }
}

function formatTime(sec) {
    const s = Math.floor(sec);
    const ms = Math.floor((sec % 1) * 10);
    return `00:${s.toString().padStart(2, '0')}.${ms}`;
}

function playStoryboard() {
    isPlaying = true;
    const playPauseIcon = document.getElementById("playPauseIcon");
    if (playPauseIcon) playPauseIcon.textContent = "⏸";
}

function pauseStoryboard() {
    isPlaying = false;
    const playPauseIcon = document.getElementById("playPauseIcon");
    if (playPauseIcon) playPauseIcon.textContent = "▶";
}

// 4. INTELLIGENT VOICE AI RECOGNITION & CONCEPT COMPREHENSION ENGINE
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;
let visualizerAnimId = null;

// Comprehensive 18-Topic Semantic Map for Natural Language Understanding
const PHYSICS_CONCEPT_MAP = [
    {
        key: "inertia",
        title: "1. Law of Inertia",
        sub: "Newton's 1st Law",
        keywords: ["inertia", "first law", "1st law", "at rest", "stays at rest", "resist change", "uniform motion", "galileo", "seatbelt", "glacier", "ice block", "motion resistance", "unbalanced force", "laziness of mass"]
    },
    {
        key: "fma",
        title: "2. Newton's 2nd Law (F = ma)",
        sub: "Force & Acceleration",
        keywords: ["fma", "f=ma", "f = ma", "second law", "2nd law", "mass", "acceleration", "accelerate", "accelerating", "force equals mass", "newton second", "rocket launch", "pad launch", "heavy mass", "force formula"]
    },
    {
        key: "action",
        title: "3. Action & Reaction",
        sub: "Newton's 3rd Law",
        keywords: ["action", "reaction", "third law", "3rd law", "equal and opposite", "recoil", "thrust", "plasma clash", "kickback", "opposite reaction", "laser clash", "rocket thrust"]
    },
    {
        key: "gravity",
        title: "4. Gravity & Free Fall",
        sub: "Gravitational Acceleration (g = 9.8 m/s²)",
        keywords: ["gravity", "free fall", "falling", "gravitational", "9.8", "sky tower", "drop from height", "weightless", "terminal velocity", "anvil", "apple fall", "falling tower", "gravitation"]
    },
    {
        key: "momentum",
        title: "5. Conservation of Momentum",
        sub: "p = mv & Collisions",
        keywords: ["momentum", "p=mv", "p = mv", "collision", "elastic collision", "inelastic", "impact", "skate park", "conserve momentum", "billiards", "skateboard crash", "mass times velocity"]
    },
    {
        key: "energy",
        title: "6. Work & Energy",
        sub: "Potential (mgh) & Kinetic (½mv²)",
        keywords: ["energy", "work", "kinetic energy", "potential energy", "mechanical energy", "rollercoaster", "roller coaster", "conservation of energy", "ke", "pe", "loop de loop", "kinetic power", "5000 j", "mgh", "half m v squared", "loop coaster", "energy conversion"]
    },
    {
        key: "friction",
        title: "7. Friction & Drag",
        sub: "Coefficients of Friction (μ)",
        keywords: ["friction", "drag", "coefficient of friction", "rough surface", "sliding", "skidding", "sand drag", "ice friction", "air resistance", "parachute drag", "mu", "wood track", "opposing motion"]
    },
    {
        key: "electricity",
        title: "8. Electricity & Circuits",
        sub: "Ohm's Law (V = IR)",
        keywords: ["electricity", "electric", "circuit", "current", "voltage", "ohms law", "ohm's law", "resistance", "battery", "electrons", "v=ir", "circuit board", "bulb glow", "12v", "amps", "volts"]
    },
    {
        key: "magnetism",
        title: "9. Magnetism & Magnetic Fields",
        sub: "Poles & Flux Lines",
        keywords: ["magnetism", "magnet", "magnetic", "magnetic field", "horseshoe magnet", "north pole", "south pole", "attraction", "repulsion", "poles repel", "flux lines", "compass", "ferromagnetic"]
    },
    {
        key: "doppler",
        title: "10. Doppler Effect",
        sub: "Sound Wave Frequency Shifts",
        keywords: ["doppler", "sound wave", "frequency", "pitch", "siren", "ambulance", "sound waves", "compressed wavelength", "horn", "high pitch", "acoustic", "audio shift", "doppler effect"]
    },
    {
        key: "light",
        title: "11. Light Refraction & Prisms",
        sub: "Dispersion & Snell's Law",
        keywords: ["light", "refraction", "reflection", "prism", "rainbow", "dispersion", "snell", "spectrum", "refract", "optics", "white light", "wavelengths", "colors of light", "glass prism", "7 colors", "bending light"]
    },
    {
        key: "centripetal",
        title: "12. Centripetal Force",
        sub: "Circular Motion & Loops",
        keywords: ["centripetal", "circular motion", "center seeking", "looping", "banked curve", "radius", "angular", "radial force", "centrifugal", "vertical loop", "orbit", "spinning circle", "circular path"]
    },
    {
        key: "buoyancy",
        title: "13. Buoyancy & Archimedes' Principle",
        sub: "Fluid Displacement & Floatation",
        keywords: ["buoyancy", "archimedes", "float", "floating", "sink", "sinking", "displacement", "water tank", "density", "buoyant force", "submarine", "ship", "water displacement", "archimedes principle"]
    },
    {
        key: "pendulum",
        title: "14. Simple Harmonic Motion",
        sub: "Pendulums & Oscillations",
        keywords: ["pendulum", "harmonic", "oscillation", "oscillating", "period", "swing", "clock tower", "shm", "amplitude", "frequency", "restoring force", "swinging bob", "timekeeper"]
    },
    {
        key: "pascal",
        title: "15. Pascal's Principle & Hydraulics",
        sub: "Fluid Pressure & Force Multiplication",
        keywords: ["pascal", "hydraulic", "hydraulics", "fluid pressure", "hydraulic lift", "car lift", "brake", "force multiplication", "piston", "pascal's law", "garage", "p1 equals p2"]
    },
    {
        key: "thermal",
        title: "16. Thermal Physics & Heat Transfer",
        sub: "Conduction, Convection & Equilibrium",
        keywords: ["thermal", "heat", "conduction", "convection", "radiation", "temperature", "hot and cold", "equilibrium", "specific heat", "boiling", "thermal lab", "ice bucket", "heat transfer", "thermodynamics"]
    },
    {
        key: "interference",
        title: "17. Wave Interference",
        sub: "Young's Double Slit Experiment",
        keywords: ["interference", "double slit", "young", "wave pattern", "diffraction", "constructive", "destructive", "fringe", "coherent waves", "slit experiment", "wave peaks", "interference fringes"]
    },
    {
        key: "nuclear",
        title: "18. Mass-Energy Equivalence",
        sub: "E = mc² & Nuclear Reactions",
        keywords: ["nuclear", "einstein", "e=mc^2", "e = mc2", "e = mc^2", "fission", "fusion", "mass energy", "tokamak", "uranium", "atomic", "c squared", "colossal energy", "reactor", "nuclear physics"]
    }
];

function createCustomGenerativeTopic(rawPrompt) {
    const cleanPrompt = rawPrompt.replace(/^(can you explain|please explain|tell me about|show me|teach me|how does|what is|why do|explain)\s+/i, '').trim();
    const title = cleanPrompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const safeKey = "gen_" + cleanPrompt.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 24);

    if (typeof TOPIC_CONFIG !== "undefined" && !TOPIC_CONFIG[safeKey]) {
        TOPIC_CONFIG[safeKey] = {
            title: title.toUpperCase(),
            sub: "AI GENERATIVE 2D SIMULATION • DYNAMIC VECTOR MODEL",
            level: "AI GEN • 30s",
            quote: `Universal Law: ${title}! Physical interactions convert energy, conserve momentum, and obey natural force equations!`,
            dialogues: {
                p1: { 
                    speaker: "teacher", 
                    text: `AI Physics Teacher: Let's explore ${title}! Notice the dynamic physical vectors and principles at work.` 
                },
                p2: { 
                    speaker: "gone", 
                    text: `G.One: Applying live physical equations for ${title}! Calculating vector forces and kinetic momentum!` 
                },
                p3: { 
                    speaker: "raone", 
                    text: `Ra.One: Incredible! The mathematical principles of ${title} have been verified experimentally!` 
                }
            }
        };

        if (typeof QUIZ_DATA !== "undefined") {
            QUIZ_DATA[safeKey] = [
                {
                    q: `What fundamental scientific law governs the dynamics of ${title}?`,
                    options: [
                        `Conservation of energy and universal force equations (ΣF = ma)`,
                        `Spontaneous generation of mass without applied forces`,
                        `Friction completely vanishing at room temperature`,
                        `Infinite velocity of light in all materials`
                    ],
                    correct: 0,
                    exp: `Physical systems governing ${title} strictly adhere to energy conservation, momentum transfer, and fundamental force laws!`
                },
                {
                    q: `In the simulation of ${title}, how does acceleration relate to the net applied force?`,
                    options: [
                        `Acceleration is directly proportional to net force and inversely to mass`,
                        `Acceleration is completely independent of force`,
                        `Force has zero influence on the motion of objects`,
                        `Mass always multiplies velocity to zero`
                    ],
                    correct: 0,
                    exp: `According to Newton's Second Law, net force produces a proportional acceleration: a = F_net / m!`
                }
            ];
        }
    }

    return safeKey;
}

function isEchoOfInternalSpeech(text) {
    if (!text) return false;
    const lower = text.toLowerCase().trim();

    // 1. If internal character speech is actively playing or within 1.2s acoustic decay buffer
    if (isInternalAudioPlaying || (Date.now() - lastInternalSpeechEndTime < 1200)) {
        return true;
    }

    // 2. Check against last spoken text from any character
    if (lastInternalSpokenText) {
        const words = lower.split(/\s+/).filter(w => w.length > 3);
        let matchCount = 0;
        words.forEach(w => {
            if (lastInternalSpokenText.includes(w)) matchCount++;
        });
        if (words.length > 0 && (matchCount / words.length >= 0.35)) {
            return true;
        }
    }

    // 3. Check against current active topic character dialogues & core scripts
    if (currentTopicKey && TOPIC_CONFIG && TOPIC_CONFIG[currentTopicKey]) {
        const cfg = TOPIC_CONFIG[currentTopicKey];
        const dialogues = [
            cfg.dialogues?.p1?.text,
            cfg.dialogues?.p2?.text,
            cfg.dialogues?.p3?.text,
            cfg.dialogues?.p1?.gOne,
            cfg.dialogues?.p1?.raOne,
            cfg.dialogues?.p2?.gOne,
            cfg.dialogues?.p2?.raOne,
            cfg.dialogues?.p3?.gOne,
            cfg.dialogues?.p3?.raOne
        ].filter(Boolean);

        for (let d of dialogues) {
            const dLower = d.toLowerCase();
            const words = lower.split(/\s+/).filter(w => w.length > 3);
            let matchCount = 0;
            words.forEach(w => {
                if (dLower.includes(w)) matchCount++;
            });
            if (words.length > 1 && (matchCount / words.length >= 0.35)) {
                return true;
            }
        }
    }

    return false;
}

function parsePhysicsVoice(text) {
    if (!text || typeof text !== "string") return;
    const cleanText = text.trim();
    if (!cleanText) return;

    const lower = cleanText.toLowerCase();

    // Check for explicit stop / control commands
    if (lower.includes("stop") || lower.includes("halt") || lower.includes("cancel") || lower.includes("pause action") || lower.includes("freeze")) {
        stopAllActionsImmediately();
        const liveTranscriptText = document.getElementById("liveTranscriptText");
        if (liveTranscriptText) liveTranscriptText.innerHTML = `🛑 <span style="color:#ef4444;font-weight:700;">Action Stopped via Voice Command</span> (<em>"${cleanText}"</em>)`;
        return;
    }

    if (lower.includes("quiz") || lower.includes("start quiz") || lower.includes("test me") || lower.includes("take quiz")) {
        showTopicQuiz(currentTopicKey);
        return;
    }

    // Clean conversational preamble from lengthy sentences
    // (e.g. "can you please explain how", "i want to learn about", "show me what happens when")
    const conversationalPreambles = [
        /^can you (please )?(explain|tell me|show me|teach me)( about)?/i,
        /^could you (please )?(explain|show|teach)( about)?/i,
        /^i (want|would like) to (learn|know|understand|see)( about)?/i,
        /^tell me (about|how|why)/i,
        /^explain (to me )?(how|why|about)?/i,
        /^show (me )?(how|what happens when|the simulation of)?/i,
        /^what (is|are|happens when|happens if)/i,
        /^how does/i,
        /^why does/i,
        /^please explain/i,
        /^demonstrate/i
    ];

    let coreQuery = cleanText;
    for (let regex of conversationalPreambles) {
        coreQuery = coreQuery.replace(regex, "").trim();
    }
    if (!coreQuery) coreQuery = cleanText;
    const coreLower = coreQuery.toLowerCase();

    // Deep scoring across all 18 core topics against full lengthy sentence
    let bestTopic = null;
    let maxScore = 0;

    PHYSICS_CONCEPT_MAP.forEach(item => {
        let score = 0;
        item.keywords.forEach(kw => {
            const kwLower = kw.toLowerCase();
            if (lower.includes(kwLower) || coreLower.includes(kwLower)) {
                // Multi-word exact phrases get highest weight in long sentences
                score += kwLower.includes(" ") ? 4.0 : 1.5;
            }
        });
        if (score > maxScore) {
            maxScore = score;
            bestTopic = item;
        }
    });

    const liveTranscriptText = document.getElementById("liveTranscriptText");
    const aiStateBadge = document.getElementById("aiStateBadge");
    const aiStateText = document.getElementById("aiStateText");
    const stageVoiceText = document.getElementById("stageVoiceText");

    if (bestTopic && maxScore >= 1.5) {
        if (liveTranscriptText) {
            liveTranscriptText.innerHTML = `🗣️ <em>"${cleanText}"</em><br><strong style="color:#00f0ff;display:block;margin-top:4px;">🎯 Concept Recognized: ${bestTopic.title} (${bestTopic.sub}) ➔ Launching 30s Video Lesson!</strong>`;
        }
        if (stageVoiceText) {
            stageVoiceText.textContent = `🎯 Recognized: ${bestTopic.title} ➔ Generating 2D Animation!`;
        }
        if (aiStateBadge) {
            aiStateBadge.className = "status-pill status-ready";
            if (aiStateText) aiStateText.textContent = `⚡ Playing Concept: ${bestTopic.title}`;
        }

        // Dismiss welcome hero card if active
        const welcomeHero = document.getElementById("welcome-hero-banner");
        if (welcomeHero) welcomeHero.classList.add("hidden");
        isWelcomeMode = false;

        // Immediately generate and play the recognized topic video
        generateAndPlayTopic(bestTopic.key);
    } else if (cleanText.length >= 3) {
        // Generative AI Synthesis: Dynamically create and launch a custom 30s 2D simulation for this custom physics query!
        const genKey = createCustomGenerativeTopic(cleanText);
        const genConfig = TOPIC_CONFIG[genKey];

        if (liveTranscriptText) {
            liveTranscriptText.innerHTML = `🗣️ <em>"${cleanText}"</em><br><strong style="color:#facc15;display:block;margin-top:4px;">✨ Synthesizing Generative 2D Video Animation for: "${genConfig.title}"!</strong>`;
        }
        if (stageVoiceText) {
            stageVoiceText.textContent = `✨ Synthesizing: ${genConfig.title} ➔ Launching Custom 2D Video!`;
        }
        if (aiStateBadge) {
            aiStateBadge.className = "status-pill status-generating";
            if (aiStateText) aiStateText.textContent = `⚡ Generating Custom Simulation: ${genConfig.title}`;
        }

        // Dismiss welcome hero card if active
        const welcomeHero = document.getElementById("welcome-hero-banner");
        if (welcomeHero) welcomeHero.classList.add("hidden");
        isWelcomeMode = false;

        generateAndPlayTopic(genKey);
    }
}

let micStream = null;
let audioAnalyser = null;
let audioContextInstance = null;
let micAudioDataArray = null;
let isStartingRecognition = false;
let lastRecognizedTime = 0;

function startAudioVisualizer() {
    const canvas = document.getElementById("voiceVisualizerCanvas");
    if (!canvas) return;
    const vCtx = canvas.getContext("2d");

    if (visualizerAnimId) cancelAnimationFrame(visualizerAnimId);

    function drawVisualizer() {
        visualizerAnimId = requestAnimationFrame(drawVisualizer);
        vCtx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;
        const bars = 20;
        const barWidth = (w / bars) - 3;
        const now = performance.now() * 0.009;

        // Try reading real mic audio data if available
        let realAudioLevel = 0;
        if (audioAnalyser && micAudioDataArray && isListening) {
            try {
                audioAnalyser.getByteFrequencyData(micAudioDataArray);
                let sum = 0;
                for (let i = 0; i < micAudioDataArray.length; i++) {
                    sum += micAudioDataArray[i];
                }
                realAudioLevel = sum / micAudioDataArray.length / 255; // 0.0 to 1.0
            } catch (err) {
                realAudioLevel = 0;
            }
        }

        // Update real microphone signal meter on UI
        const lvlFill = document.getElementById("micAudioLevelFill");
        const lvlVal = document.getElementById("micAudioLevelValue");
        if (isListening) {
            const pct = Math.min(100, Math.round(realAudioLevel * 200) + (realAudioLevel > 0.01 ? 15 : 8));
            if (lvlFill) lvlFill.style.width = `${pct}%`;
            if (lvlVal) lvlVal.textContent = realAudioLevel > 0.02 ? `SIGNAL ${pct}%` : "LISTENING 🎙️";
        } else {
            if (lvlFill) lvlFill.style.width = "0%";
            if (lvlVal) lvlVal.textContent = "OFFLINE";
        }

        for (let i = 0; i < bars; i++) {
            let dynamicWave = 4;
            if (isListening) {
                if (realAudioLevel > 0.02) {
                    const sampleIdx = Math.floor((i / bars) * (micAudioDataArray ? micAudioDataArray.length : 1));
                    const sampleVal = micAudioDataArray ? (micAudioDataArray[sampleIdx] / 255) : realAudioLevel;
                    dynamicWave = Math.max(6, sampleVal * (h - 8));
                } else {
                    dynamicWave = 6 + Math.abs(Math.sin(now + i * 0.42) * Math.cos(now * 0.7 + i * 0.3)) * (h - 14);
                }
            }

            const x = i * (barWidth + 3);
            const y = (h - dynamicWave) / 2;

            const grad = vCtx.createLinearGradient(0, y, 0, y + dynamicWave);
            if (isListening) {
                grad.addColorStop(0, "#00f0ff");
                grad.addColorStop(0.5, "#facc15");
                grad.addColorStop(1, "#10b981");
            } else {
                grad.addColorStop(0, "#334155");
                grad.addColorStop(1, "#1e293b");
            }

            vCtx.fillStyle = grad;
            vCtx.beginPath();
            vCtx.roundRect(x, y, barWidth, dynamicWave, 2);
            vCtx.fill();
        }
    }
    drawVisualizer();
}

async function requestMicPermissionAndStart() {
    const liveTranscriptText = document.getElementById("liveTranscriptText");
    const micLiveBadge = document.getElementById("micLiveBadge");
    const micPulseWrapper = document.querySelector(".pulse-ring-wrapper");

    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !micStream) {
            micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                },
                video: false
            });

            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioContextInstance = new AudioContextClass();
                    const source = audioContextInstance.createMediaStreamSource(micStream);
                    audioAnalyser = audioContextInstance.createAnalyser();
                    audioAnalyser.fftSize = 64;
                    source.connect(audioAnalyser);
                    micAudioDataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
                }
            } catch (e) {
                console.warn("AudioContext setup notice:", e);
            }
        }

        startSpeechRecognitionEngine();
    } catch (err) {
        console.error("Microphone permission error:", err);
        isListening = false;
        if (micPulseWrapper) micPulseWrapper.classList.remove("listening");
        if (micLiveBadge) {
            micLiveBadge.textContent = "MIC BLOCKED";
            micLiveBadge.className = "live-pill";
        }
        if (liveTranscriptText) {
            liveTranscriptText.innerHTML = `⚠️ <strong style="color:#ef4444;">Microphone Permission Notice:</strong> Please allow microphone access in your browser pop-up to speak freely!`;
        }
    }
}

function createSpeechRecognitionInstance() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = false; // Fast single-phrase burst mode (bypasses Chrome continuous audio buffering hang)
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.maxAlternatives = 5;

    const micLiveBadge = document.getElementById("micLiveBadge");
    const micPulseWrapper = document.querySelector(".pulse-ring-wrapper");
    const liveTranscriptText = document.getElementById("liveTranscriptText");
    const topicInput = document.getElementById("topicInput");
    const stageVoiceText = document.getElementById("stageVoiceText");

    let speechDebounceTimer = null;
    let currentSpeechBuffer = "";

    rec.onstart = () => {
        isListening = true;
        isStartingRecognition = false;
        if (micPulseWrapper) micPulseWrapper.classList.add("listening");
        if (micLiveBadge) {
            micLiveBadge.textContent = "LIVE LISTENING 🎙️";
            micLiveBadge.className = "live-pill active";
        }
        if (liveTranscriptText && (!liveTranscriptText.textContent || liveTranscriptText.textContent.includes("Click") || liveTranscriptText.textContent.includes("Say any") || liveTranscriptText.textContent.includes("paused") || liveTranscriptText.textContent.includes("OFFLINE"))) {
            liveTranscriptText.innerHTML = `🎙️ <span style="color:#00f0ff;font-weight:600;">Listening live to your microphone... Speak any physics topic or question!</span>`;
        }
        if (topicInput) {
            topicInput.placeholder = "🎙️ Listening live... speak or type any Physics topic";
        }
    };

    rec.onaudiostart = () => {
        if (micLiveBadge) {
            micLiveBadge.textContent = "AUDIO ACTIVE 🔊";
            micLiveBadge.className = "live-pill active";
        }
    };

    rec.onspeechstart = () => {
        if (micLiveBadge) {
            micLiveBadge.textContent = "HEARING VOICE 🗣️";
            micLiveBadge.className = "live-pill active";
        }
    };

    rec.onresult = (event) => {
        // 1. Acoustic Gating: Drop incoming audio while any character is speaking aloud
        if (isInternalAudioPlaying || (Date.now() - lastInternalSpeechEndTime < 600)) {
            return;
        }

        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const text = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += text + " ";
            } else {
                interimTranscript += text;
            }
        }

        const currentSpoken = (finalTranscript + interimTranscript).trim();
        if (!currentSpoken) return;

        // 2. Reject internal character speech echoes
        if (isEchoOfInternalSpeech(currentSpoken)) {
            return;
        }

        currentSpeechBuffer = currentSpoken;

        // Sync speech text live into the input field, stage HUD, and transcript box
        if (topicInput) {
            topicInput.value = currentSpoken;
        }
        if (liveTranscriptText) {
            liveTranscriptText.innerHTML = `🗣️ <em>"${currentSpoken}"</em><br><span style="color:#38bdf8;font-size:0.8rem;">⚡ Converting Voice to Text & Understanding Physics Concept...</span>`;
        }
        if (stageVoiceText) {
            stageVoiceText.textContent = `🗣️ "${currentSpoken}"`;
        }

        if (finalTranscript.trim()) {
            if (speechDebounceTimer) clearTimeout(speechDebounceTimer);
            const sentenceToProcess = finalTranscript.trim();
            currentSpeechBuffer = "";
            handleSpokenSentence(sentenceToProcess);
        } else {
            // Continuous debouncer to capture long sentences without premature cut-off
            if (speechDebounceTimer) clearTimeout(speechDebounceTimer);
            speechDebounceTimer = setTimeout(() => {
                if (currentSpeechBuffer && currentSpeechBuffer.length >= 3) {
                    const fullSentence = currentSpeechBuffer;
                    currentSpeechBuffer = "";
                    handleSpokenSentence(fullSentence);
                }
            }, 800);
        }
    };

    rec.onerror = (event) => {
        isStartingRecognition = false;
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "network") {
            if (liveTranscriptText) {
                liveTranscriptText.innerHTML = `⚠️ <strong style="color:#facc15;">Browser Cloud Speech Server Offline:</strong> Speak into mic, or tap any <span style="color:#00f0ff;font-weight:700;">⚡ Quick Voice Command</span> below to generate 2D physics videos instantly!`;
            }
        } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            isListening = false;
            if (micPulseWrapper) micPulseWrapper.classList.remove("listening");
            if (micLiveBadge) {
                micLiveBadge.textContent = "MIC PERMISSION NEEDED";
                micLiveBadge.className = "live-pill";
            }
        }
    };

    rec.onend = () => {
        isStartingRecognition = false;
        if (isListening) {
            // Rapid-cycle restart loop to maintain permanent listening
            setTimeout(() => {
                if (isListening && !isStartingRecognition) {
                    try {
                        isStartingRecognition = true;
                        recognition = createSpeechRecognitionInstance();
                        if (recognition) recognition.start();
                    } catch (err) {
                        isStartingRecognition = false;
                    }
                }
            }, 50);
        } else {
            if (micPulseWrapper) micPulseWrapper.classList.remove("listening");
            if (micLiveBadge) {
                micLiveBadge.textContent = "OFFLINE";
                micLiveBadge.className = "live-pill";
            }
        }
    };

    return rec;
}

function startSpeechRecognitionEngine() {
    const micLiveBadge = document.getElementById("micLiveBadge");
    const liveTranscriptText = document.getElementById("liveTranscriptText");
    const topicInput = document.getElementById("topicInput");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (micLiveBadge) micLiveBadge.textContent = "UNSUPPORTED";
        if (liveTranscriptText) {
            liveTranscriptText.innerHTML = "Speech recognition requires Chrome or Edge. You can also type into the input box below!";
        }
        return;
    }

    if (recognition) {
        try { recognition.abort(); } catch (e) { }
        recognition = null;
    }

    recognition = createSpeechRecognitionInstance();

    if (recognition) {
        try {
            isListening = true;
            isStartingRecognition = true;
            recognition.start();
            if (topicInput) {
                topicInput.focus();
            }
        } catch (e) {
            isStartingRecognition = false;
            console.error("SpeechRecognition start error:", e);
        }
    }
}

function handleSpokenSentence(sentence) {
    if (!sentence || sentence.length < 2) return;
    if (isSpeaking && (Date.now() - lastRecognizedTime < 2000)) return; // Prevent speaker self-echo

    // Immediate conversion of voice to text across all UI elements
    const topicInput = document.getElementById("topicInput");
    const liveTranscriptText = document.getElementById("liveTranscriptText");
    const stageVoiceText = document.getElementById("stageVoiceText");

    if (topicInput) topicInput.value = sentence;
    if (liveTranscriptText) {
        liveTranscriptText.innerHTML = `🗣️ <em>"${sentence}"</em><br><strong style="color:#00f0ff;display:block;margin-top:4px;">⚡ Voice Converted to Text ➔ Understanding Concept & Generating Video...</strong>`;
    }
    if (stageVoiceText) {
        stageVoiceText.textContent = `🗣️ "${sentence}"`;
    }

    lastRecognizedTime = Date.now();
    parsePhysicsVoice(sentence);
}

function initSpeechRecognition() {
    startAudioVisualizer();
    // Prompt mic permission on initialization
    requestMicPermissionAndStart();
}

function toggleListening() {
    const micLiveBadge = document.getElementById("micLiveBadge");
    const micPulseWrapper = document.querySelector(".pulse-ring-wrapper");
    const liveTranscriptText = document.getElementById("liveTranscriptText");
    const topicInput = document.getElementById("topicInput");

    if (isListening) {
        isListening = false;
        isStartingRecognition = false;
        if (recognition) {
            try { recognition.stop(); } catch (e) { }
            try { recognition.abort(); } catch (e) { }
            recognition = null;
        }
        if (micPulseWrapper) micPulseWrapper.classList.remove("listening");
        if (micLiveBadge) {
            micLiveBadge.textContent = "MUTED";
            micLiveBadge.className = "live-pill";
        }
        if (liveTranscriptText) {
            liveTranscriptText.textContent = `"Microphone paused. Click microphone or press Space to activate!"`;
        }
    } else {
        if (topicInput) topicInput.focus();
        requestMicPermissionAndStart();
    }
}

// 5. 1-CLICK HD VIDEO EXPORT
let mediaRecorder = null;
let recordedChunks = [];

function startVideoExport() {
    const welcomeHero = document.getElementById("welcome-hero-banner");
    const exportModal = document.getElementById("exportModal");
    const downloadVideoLink = document.getElementById("downloadVideoLink");
    const exportProgressBar = document.getElementById("exportProgressBar");
    const exportStatusText = document.getElementById("exportStatusText");

    if (welcomeHero) welcomeHero.classList.add("hidden");
    isWelcomeMode = false;
    isIdleState = false;
    isPlaying = true;

    if (exportModal) exportModal.classList.remove("hidden");
    if (downloadVideoLink) downloadVideoLink.classList.add("hidden");
    if (exportProgressBar) exportProgressBar.style.width = "0%";
    if (exportStatusText) exportStatusText.textContent = "Recording 1080p 30-Second 2D Stream...";

    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    dialogueTriggered = {};

    recordedChunks = [];
    const canvasEl = document.getElementById("physicsCanvas2D");
    if (!canvasEl) return;
    const canvasStream = canvasEl.captureStream(60);
    const audioStream = sounds?.getStream ? sounds.getStream() : null;
    const tracks = [...canvasStream.getVideoTracks()];
    if (audioStream && audioStream.getAudioTracks().length > 0) tracks.push(...audioStream.getAudioTracks());

    const combinedStream = new MediaStream(tracks);
    const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? 'video/webm; codecs=vp9' : 'video/webm';
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 6000000 });

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        if (downloadVideoLink) {
            downloadVideoLink.href = URL.createObjectURL(blob);
            downloadVideoLink.classList.remove("hidden");
        }
        if (exportStatusText) exportStatusText.textContent = "✅ 30s 2D Physics Video Ready!";
        if (exportProgressBar) exportProgressBar.style.width = "100%";
    };

    updateTimeline(0);
    playStoryboard();
    mediaRecorder.start();

    let exportTime = 0;
    const interval = setInterval(() => {
        exportTime += 0.5;
        if (exportProgressBar) exportProgressBar.style.width = `${Math.min((exportTime / TOPIC_DURATION) * 100, 100)}%`;
        if (exportTime >= TOPIC_DURATION) {
            clearInterval(interval);
            if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
        }
    }, 500);
}

// 6. INTERACTIVE 18-TOPIC PHYSICS QUIZ SYSTEM (10s Display • Auto-Reveal • Auto-Advance)
const QUIZ_QUESTION_TIME_LIMIT = 10; // Exactly 10 seconds per question
let currentQuizTopic = "inertia";
let currentQuizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let quizTimerInterval = null;
let quizAutoAdvanceTimeout = null;
let quizAutoNoticeInterval = null;
let quizTimeRemaining = QUIZ_QUESTION_TIME_LIMIT;

function clearQuizTimers() {
    if (quizTimerInterval) {
        clearInterval(quizTimerInterval);
        quizTimerInterval = null;
    }
    if (quizAutoAdvanceTimeout) {
        clearTimeout(quizAutoAdvanceTimeout);
        quizAutoAdvanceTimeout = null;
    }
    if (quizAutoNoticeInterval) {
        clearInterval(quizAutoNoticeInterval);
        quizAutoNoticeInterval = null;
    }
}

function ensureQuizElementsExist() {
    const card = document.querySelector(".quiz-card");
    if (!card) return;

    // 1. Check timer badge in header
    const badgeRow = document.querySelector(".quiz-badge-row");
    if (badgeRow && !document.getElementById("quizTimerBadge")) {
        const badge = document.createElement("span");
        badge.id = "quizTimerBadge";
        badge.className = "quiz-timer-badge";
        badge.style.cssText = "background:rgba(250,204,21,0.25); border:1.5px solid #facc15; color:#fef08a; font-family:'Outfit',sans-serif; font-size:0.85rem; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.06em; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 12px rgba(250,204,21,0.4);";
        badge.textContent = "⏱ 10s";
        badgeRow.appendChild(badge);
    }

    // 2. Check timer bar
    const header = document.querySelector(".quiz-header");
    if (header && !document.getElementById("quizTimerBar")) {
        const track = document.createElement("div");
        track.className = "quiz-timer-track";
        track.style.cssText = "width:100%; height:6px; background:rgba(255,255,255,0.1); overflow:hidden; position:relative;";
        track.innerHTML = `<div id="quizTimerBar" class="quiz-timer-bar" style="height:100%; width:100%; background:linear-gradient(90deg,#00f0ff,#facc15,#10b981); box-shadow:0 0 10px #00f0ff; transition:width 0.95s linear;"></div>`;
        header.after(track);
    }

    // 3. Check large seconds banner inside quiz-body
    const quizBody = document.querySelector(".quiz-body");
    const qText = document.getElementById("quizQuestionText");
    if (quizBody && qText && !document.getElementById("quizLargeSeconds")) {
        const banner = document.createElement("div");
        banner.className = "quiz-timer-banner";
        banner.style.cssText = "display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:rgba(0,240,255,0.08); border:1.5px solid rgba(0,240,255,0.35); border-radius:8px; box-shadow:0 0 15px rgba(0,240,255,0.15); margin-bottom:12px;";
        banner.innerHTML = `
            <div class="timer-banner-left" style="display:flex; align-items:center; gap:8px;">
                <span class="timer-pulse-circle" style="width:10px; height:10px; border-radius:50%; background:#00f0ff; box-shadow:0 0 8px #00f0ff;"></span>
                <span class="timer-banner-label" style="font-family:'Outfit',sans-serif; font-size:0.76rem; font-weight:800; color:#94a3b8; letter-spacing:0.08em;">AUTO-REVEAL TIMER</span>
            </div>
            <div id="quizLargeSeconds" class="timer-banner-count" style="font-family:'Outfit',sans-serif; font-size:1.05rem; font-weight:900; color:#facc15; text-shadow:0 0 10px rgba(250,204,21,0.5);">⏱ 10 SECONDS</div>
        `;
        qText.before(banner);
    }

    // 4. Check auto next notice inside feedback box
    const fbText = document.querySelector(".quiz-feedback-text");
    if (fbText && !document.getElementById("quizAutoNextNotice")) {
        const notice = document.createElement("div");
        notice.id = "quizAutoNextNotice";
        notice.className = "quiz-auto-indicator";
        notice.style.cssText = "font-size:0.8rem; color:#38bdf8; font-weight:700; display:flex; align-items:center; gap:6px; margin-top:6px; padding-top:6px; border-top:1px dashed rgba(255,255,255,0.15);";
        notice.textContent = "⏱ Next question starting soon...";
        fbText.appendChild(notice);
    }
}

function showTopicQuiz(topicKey) {
    clearQuizTimers();
    if (!QUIZ_DATA[topicKey]) topicKey = "inertia";
    currentQuizTopic = topicKey;
    currentQuizIndex = 0;
    quizScore = 0;
    quizAnswered = false;

    const overlay = document.getElementById("quiz-modal-overlay");
    if (overlay) overlay.classList.remove("hidden");

    renderQuizQuestion();
}

function renderQuizQuestion() {
    clearQuizTimers();
    ensureQuizElementsExist();

    const qData = QUIZ_DATA[currentQuizTopic];
    if (!qData || !qData[currentQuizIndex]) return;

    quizAnswered = false;
    quizTimeRemaining = QUIZ_QUESTION_TIME_LIMIT;
    const item = qData[currentQuizIndex];
    const cfg = TOPIC_CONFIG[currentQuizTopic] || { title: "PHYSICS TOPIC" };

    const topicBadge = document.getElementById("quizTopicBadge");
    const counter = document.getElementById("quizCounter");
    const timerBadge = document.getElementById("quizTimerBadge");
    const timerBar = document.getElementById("quizTimerBar");
    const largeSeconds = document.getElementById("quizLargeSeconds");
    const qText = document.getElementById("quizQuestionText");
    const optContainer = document.getElementById("quizOptionsContainer");
    const feedbackBox = document.getElementById("quizFeedbackBox");
    const nextBtn = document.getElementById("quizNextBtn");
    const finishBtn = document.getElementById("quizFinishBtn");
    const retryBtn = document.getElementById("quizRetryBtn");
    const scoreText = document.getElementById("quizScoreText");
    const autoNotice = document.getElementById("quizAutoNextNotice");

    if (topicBadge) topicBadge.textContent = cfg.title;
    if (counter) counter.textContent = `Question ${currentQuizIndex + 1} of ${qData.length}`;
    if (timerBadge) {
        timerBadge.className = "quiz-timer-badge";
        timerBadge.textContent = `⏱ ${quizTimeRemaining}s`;
        timerBadge.style.display = "inline-flex";
    }
    if (largeSeconds) {
        largeSeconds.className = "timer-banner-count";
        largeSeconds.style.color = "#facc15";
        largeSeconds.textContent = `⏱ ${quizTimeRemaining} SECONDS`;
    }
    if (timerBar) {
        timerBar.className = "quiz-timer-bar";
        timerBar.style.width = "100%";
        timerBar.style.background = "linear-gradient(90deg,#00f0ff,#facc15,#10b981)";
    }
    if (qText) qText.textContent = item.q;
    if (scoreText) scoreText.textContent = `Score: ${quizScore} / ${qData.length}`;
    if (feedbackBox) feedbackBox.classList.add("hidden");
    if (nextBtn) nextBtn.classList.add("hidden");
    if (finishBtn) finishBtn.classList.add("hidden");
    if (retryBtn) retryBtn.classList.add("hidden");
    if (autoNotice) autoNotice.textContent = "⏱ Next question starting soon...";

    if (optContainer) {
        optContainer.innerHTML = "";
        const letters = ["A", "B", "C", "D"];
        item.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-opt-btn";
            btn.innerHTML = `<span class="quiz-opt-letter">${letters[idx]}</span> <span class="quiz-opt-label">${opt}</span>`;
            btn.addEventListener("click", () => selectQuizOption(idx, false));
            optContainer.appendChild(btn);
        });
    }

    speakDialogue("teacher", `Question ${currentQuizIndex + 1}: ${item.q}`);

    // 10-Second Live Running Countdown Timer
    quizTimerInterval = setInterval(() => {
        quizTimeRemaining--;
        if (timerBadge) {
            timerBadge.textContent = `⏱ ${quizTimeRemaining}s`;
            if (quizTimeRemaining <= 3) {
                timerBadge.classList.add("urgent");
            }
        }
        if (largeSeconds) {
            largeSeconds.textContent = `⏱ ${quizTimeRemaining} SECONDS`;
            if (quizTimeRemaining <= 3) {
                largeSeconds.classList.add("urgent");
                largeSeconds.style.color = "#ef4444";
            }
        }
        if (timerBar) {
            timerBar.style.width = `${Math.max((quizTimeRemaining / QUIZ_QUESTION_TIME_LIMIT) * 100, 0)}%`;
            if (quizTimeRemaining <= 3) {
                timerBar.classList.add("urgent");
                timerBar.style.background = "linear-gradient(90deg,#f97316,#ef4444)";
            }
        }

        if (quizTimeRemaining <= 0) {
            clearQuizTimers();
            // Automatically reveal the correct answer after 10 seconds!
            selectQuizOption(item.correct, true);
        }
    }, 1000);
}

function selectQuizOption(selectedIdx, isAutoRevealed = false) {
    if (quizAnswered) return;
    quizAnswered = true;
    clearQuizTimers();

    const qData = QUIZ_DATA[currentQuizTopic];
    const item = qData[currentQuizIndex];
    const isCorrect = (selectedIdx === item.correct);

    const timerBadge = document.getElementById("quizTimerBadge");
    const timerBar = document.getElementById("quizTimerBar");
    const largeSeconds = document.getElementById("quizLargeSeconds");

    if (timerBadge) timerBadge.textContent = isAutoRevealed ? "⏱ Auto-Revealed" : "⏱ Answered";
    if (timerBar) timerBar.style.width = "0%";
    if (largeSeconds) {
        largeSeconds.className = "timer-banner-count revealed";
        largeSeconds.style.color = "#10b981";
        largeSeconds.textContent = "⚡ ANSWER REVEALED!";
    }

    const optButtons = document.querySelectorAll(".quiz-opt-btn");
    optButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === item.correct) {
            btn.classList.add("correct");
            btn.style.cssText = "background: rgba(16, 185, 129, 0.3) !important; border: 2px solid #10b981 !important; color: #a7f3d0 !important; box-shadow: 0 0 20px rgba(16, 185, 129, 0.6) !important;";
            btn.innerHTML = `<span class="quiz-opt-letter" style="background:#10b981;color:#fff;">✓</span> <span class="quiz-opt-label"><strong>${item.options[idx]} (CORRECT)</strong></span>`;
        } else if (idx === selectedIdx && !isCorrect && !isAutoRevealed) {
            btn.classList.add("incorrect");
            btn.style.cssText = "background: rgba(239, 68, 68, 0.3) !important; border: 2px solid #ef4444 !important; color: #fca5a5 !important;";
        }
    });

    if (!isAutoRevealed && isCorrect) {
        quizScore++;
        if (typeof sounds !== "undefined" && sounds.playBounce) sounds.playBounce();
    } else if (!isAutoRevealed && !isCorrect) {
        if (typeof sounds !== "undefined" && sounds.playShatter) sounds.playShatter();
    } else {
        if (typeof sounds !== "undefined" && sounds.playBounce) sounds.playBounce();
    }

    const scoreText = document.getElementById("quizScoreText");
    if (scoreText) scoreText.textContent = `Score: ${quizScore} / ${qData.length}`;

    const feedbackBox = document.getElementById("quizFeedbackBox");
    const fbIcon = document.getElementById("quizFeedbackIcon");
    const fbTitle = document.getElementById("quizFeedbackTitle");
    const fbDesc = document.getElementById("quizFeedbackDesc");
    const autoNotice = document.getElementById("quizAutoNextNotice");
    const nextBtn = document.getElementById("quizNextBtn");
    const finishBtn = document.getElementById("quizFinishBtn");
    const retryBtn = document.getElementById("quizRetryBtn");

    const isLastQuestion = (currentQuizIndex + 1 >= qData.length);

    if (feedbackBox) {
        if (isAutoRevealed) {
            feedbackBox.className = "quiz-feedback-box revealed";
        } else {
            feedbackBox.className = `quiz-feedback-box ${isCorrect ? "" : "error"}`;
        }
        feedbackBox.classList.remove("hidden");
    }

    if (fbIcon) {
        if (isAutoRevealed) fbIcon.textContent = "💡";
        else fbIcon.textContent = isCorrect ? "🎉" : "❌";
    }

    if (fbTitle) {
        if (isAutoRevealed) fbTitle.textContent = `10s Time Expired! Correct Answer: Option ${["A","B","C","D"][item.correct]} - ${item.options[item.correct]}`;
        else if (isCorrect) fbTitle.textContent = "Excellent! That's Correct! (+100 XP)";
        else fbTitle.textContent = "Not quite! Here is why:";
    }

    if (fbDesc) fbDesc.textContent = item.exp;

    if (!isLastQuestion) {
        if (nextBtn) nextBtn.classList.remove("hidden");
    } else {
        if (finishBtn) finishBtn.classList.remove("hidden");
        if (retryBtn) retryBtn.classList.remove("hidden");
    }

    let voiceMsg = "";
    if (isAutoRevealed) {
        voiceMsg = `Time is up! The correct answer is: ${item.options[item.correct]}. ${item.exp}`;
    } else if (isCorrect) {
        voiceMsg = `Correct! ${item.exp}`;
    } else {
        voiceMsg = `Incorrect. ${item.exp}`;
    }
    speakDialogue("teacher", voiceMsg);

    // Auto-advance to the next question or auto-exit when quiz is over
    let autoNextSecs = 3;
    if (autoNotice) {
        if (!isLastQuestion) {
            autoNotice.textContent = `⏱ Next question arriving in ${autoNextSecs}s...`;
        } else {
            autoNotice.textContent = `🏆 Quiz Completed! Score: ${quizScore}/${qData.length} ➔ Auto-Exiting in ${autoNextSecs}s...`;
        }
    }

    quizAutoNoticeInterval = setInterval(() => {
        autoNextSecs--;
        if (autoNotice) {
            if (!isLastQuestion && autoNextSecs > 0) {
                autoNotice.textContent = `⏱ Next question arriving in ${autoNextSecs}s...`;
            } else if (isLastQuestion && autoNextSecs > 0) {
                autoNotice.textContent = `🏆 Quiz Completed! Score: ${quizScore}/${qData.length} ➔ Auto-Exiting in ${autoNextSecs}s...`;
            }
        }
    }, 1000);

    quizAutoAdvanceTimeout = setTimeout(() => {
        clearQuizTimers();
        if (!isLastQuestion) {
            nextQuizQuestion();
        } else {
            // When all 2 quiz questions are finished, automatically exit quiz screen!
            closeQuizModal();
            const victoryBanner = document.getElementById("victory-banner");
            if (victoryBanner) victoryBanner.classList.remove("hidden");
        }
    }, 3500);
}

function nextQuizQuestion() {
    clearQuizTimers();
    currentQuizIndex++;
    renderQuizQuestion();
}

function closeQuizModal() {
    clearQuizTimers();
    const overlay = document.getElementById("quiz-modal-overlay");
    if (overlay) overlay.classList.add("hidden");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// 7. SETUP EVENT LISTENERS & CONTROLS
function initPhysicsControls() {
    document.getElementById("openQuizBtn")?.addEventListener("click", () => showTopicQuiz(currentTopicKey));
    document.getElementById("closeQuizBtn")?.addEventListener("click", closeQuizModal);
    document.getElementById("quizNextBtn")?.addEventListener("click", () => {
        clearQuizTimers();
        nextQuizQuestion();
    });
    document.getElementById("quizFinishBtn")?.addEventListener("click", () => {
        clearQuizTimers();
        closeQuizModal();
        const totalQ = QUIZ_DATA[currentQuizTopic]?.length || 2;
        speakDialogue("teacher", `Congratulations! You mastered the ${TOPIC_CONFIG[currentQuizTopic]?.title || "Physics"} lesson with ${quizScore} out of ${totalQ} points!`);
    });
    document.getElementById("quizRetryBtn")?.addEventListener("click", () => {
        clearQuizTimers();
        showTopicQuiz(currentTopicKey);
    });

    document.getElementById("startExploringBtn")?.addEventListener("click", () => {
        const welcomeHero = document.getElementById("welcome-hero-banner");
        if (welcomeHero) welcomeHero.classList.add("hidden");
        isWelcomeMode = false;
        speakDialogue("teacher", "Welcome to the World of Physics! Speak or select any topic to begin!");
    });

    document.getElementById("headerStopBtn")?.addEventListener("click", stopAllActionsImmediately);
    document.getElementById("timelineStopBtn")?.addEventListener("click", stopAllActionsImmediately);
    document.getElementById("sidebarBigStopBtn")?.addEventListener("click", stopAllActionsImmediately);

    document.getElementById("playPauseBtn")?.addEventListener("click", () => {
        if (isPlaying) pauseStoryboard();
        else playStoryboard();
    });

    document.getElementById("replayBtn")?.addEventListener("click", () => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        dialogueTriggered = {};
        updateTimeline(0);
        playStoryboard();
    });

    document.getElementById("timelineScrubber")?.addEventListener("input", (e) => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        dialogueTriggered = {};
        updateTimeline((parseFloat(e.target.value) / 100) * TOPIC_DURATION);
    });

    document.querySelectorAll(".scene-step-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const step = parseInt(btn.dataset.step);
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            dialogueTriggered = {};
            if (step === 1) updateTimeline(0);
            else if (step === 2) updateTimeline(10.0);
            else if (step === 3) updateTimeline(20.0);
            playStoryboard();
        });
    });

    document.querySelectorAll(".topic-chip").forEach(chip => {
        chip.addEventListener("click", () => generateAndPlayTopic(chip.dataset.topic));
    });

    document.querySelectorAll(".hint-tag").forEach(hint => {
        hint.style.cursor = "pointer";
        hint.addEventListener("click", () => {
            const raw = hint.textContent.replace(/🎙️|["']/g, "").trim();
            if (raw) handleSpokenSentence(raw);
        });
    });

    document.getElementById("micToggleBtn")?.addEventListener("click", () => {
        toggleListening();
    });

    window.addEventListener("keydown", (e) => {
        if (e.code === "Escape") {
            e.preventDefault();
            stopAllActionsImmediately();
        } else if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
            toggleListening();
        }
    });

    document.getElementById("customTopicForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = document.getElementById("topicInput")?.value.trim();
        if (val) {
            parsePhysicsVoice(val);
            document.getElementById("topicInput").value = "";
        }
    });

    document.getElementById("recordVideoBtn")?.addEventListener("click", startVideoExport);
    document.getElementById("closeExportModal")?.addEventListener("click", () => {
        document.getElementById("exportModal")?.classList.add("hidden");
    });
    document.getElementById("cancelExportBtn")?.addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
        document.getElementById("exportModal")?.classList.add("hidden");
    });

    document.getElementById("fullscreenBtn")?.addEventListener("click", () => {
        const frame = document.getElementById("smartboard-frame");
        if (!document.fullscreenElement) frame?.requestFullscreen?.();
        else document.exitFullscreen?.();
    });

    initSpeechRecognition();

    setTimeout(() => {
        speakDialogue("teacher", "Welcome to the World of Physics! Speak or click any topic to start!");
    }, 500);
}

// Expose state and controller
if (typeof window !== "undefined") {
    window.speakDialogue = speakDialogue;
    window.generateAndPlayTopic = generateAndPlayTopic;
    window.stopAllActionsImmediately = stopAllActionsImmediately;
    window.updateTimeline = updateTimeline;
    window.playStoryboard = playStoryboard;
    window.pauseStoryboard = pauseStoryboard;
    window.parsePhysicsVoice = parsePhysicsVoice;
    window.showTopicQuiz = showTopicQuiz;
    window.startVideoExport = startVideoExport;
    window.initPhysicsControls = initPhysicsControls;
    window.getPhysicsState = () => ({
        currentTopicKey,
        currentTimelineTime,
        isPlaying,
        isIdleState,
        isWelcomeMode,
        dialogueTriggered
    });
}
