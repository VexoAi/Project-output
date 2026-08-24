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

// 1. SPEECH SYNTHESIS & SUBTITLES
function speakDialogue(charKey, text, onEnd = null) {
    const char = (typeof CHARACTER_VOICES !== "undefined" && CHARACTER_VOICES[charKey]) ? CHARACTER_VOICES[charKey] : (CHARACTER_VOICES?.teacher || { name: "Physics Teacher", emoji: "👨‍🏫", pitch: 1.0, rate: 1.02, color: "#38bdf8" });
    const speakerEmoji = document.getElementById("speakerEmoji");
    const speakerName = document.getElementById("speakerName");
    const speakerDialogue = document.getElementById("speakerDialogue");
    const speakerAvatar = document.getElementById("speakerAvatar");

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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = char.pitch;
        utterance.rate = char.rate;

        isSpeaking = true;
        utterance.onend = () => { isSpeaking = false; if (onEnd) onEnd(); };
        utterance.onerror = () => { isSpeaking = false; if (onEnd) onEnd(); };
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        isSpeaking = false;
        if (onEnd) onEnd();
    }
}

// 2. STOP CONTROLLER
function stopAllActionsImmediately() {
    isPlaying = false;
    isIdleState = true;

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

    if (holoTitle) holoTitle.textContent = cfg.title;
    if (holoSub) holoSub.textContent = cfg.sub;
    if (lvl) lvl.textContent = cfg.level;
    if (scName) scName.textContent = `Topic: ${cfg.title}`;
    if (vTitle) vTitle.textContent = `${cfg.title} MASTERED!`;
    if (vQuote) vQuote.textContent = `"${cfg.quote}"`;

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

// 4. VOICE AI RECOGNITION PIPELINE
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

function parsePhysicsVoice(text) {
    const l = text.toLowerCase();

    if (l.includes("stop") || l.includes("halt") || l.includes("cancel") || l.includes("pause")) {
        stopAllActionsImmediately();
        return;
    }

    if (l.includes("gravity") || l.includes("fall")) generateAndPlayTopic("gravity");
    else if (l.includes("second") || l.includes("fma") || l.includes("acceleration") || l.includes("mass")) generateAndPlayTopic("fma");
    else if (l.includes("third") || l.includes("action") || l.includes("reaction")) generateAndPlayTopic("action");
    else if (l.includes("momentum") || l.includes("collision")) generateAndPlayTopic("momentum");
    else if (l.includes("energy") || l.includes("work") || l.includes("kinetic")) generateAndPlayTopic("energy");
    else if (l.includes("friction") || l.includes("drag")) generateAndPlayTopic("friction");
    else if (l.includes("electric") || l.includes("circuit") || l.includes("ohm")) generateAndPlayTopic("electricity");
    else if (l.includes("magnet") || l.includes("pole")) generateAndPlayTopic("magnetism");
    else if (l.includes("doppler") || l.includes("sound") || l.includes("wave")) generateAndPlayTopic("doppler");
    else if (l.includes("light") || l.includes("prism") || l.includes("refract")) generateAndPlayTopic("light");
    else if (l.includes("centripetal") || l.includes("loop") || l.includes("circle")) generateAndPlayTopic("centripetal");
    else if (l.includes("buoyancy") || l.includes("archimedes") || l.includes("float")) generateAndPlayTopic("buoyancy");
    else if (l.includes("pendulum") || l.includes("shm") || l.includes("harmonic")) generateAndPlayTopic("pendulum");
    else if (l.includes("pascal") || l.includes("hydraulic") || l.includes("pressure")) generateAndPlayTopic("pascal");
    else if (l.includes("thermal") || l.includes("heat") || l.includes("thermodynamics")) generateAndPlayTopic("thermal");
    else if (l.includes("interference") || l.includes("double slit")) generateAndPlayTopic("interference");
    else if (l.includes("nuclear") || l.includes("einstein") || l.includes("fission")) generateAndPlayTopic("nuclear");
    else if (l.includes("inertia") || l.includes("first")) generateAndPlayTopic("inertia");
}

function initSpeechRecognition() {
    const micToggleBtn = document.getElementById("micToggleBtn");
    const micPulseWrapper = document.querySelector(".pulse-ring-wrapper");
    const micLiveBadge = document.getElementById("micLiveBadge");
    const liveTranscriptText = document.getElementById("liveTranscriptText");

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            isListening = true;
            if (micPulseWrapper) micPulseWrapper.classList.add("listening");
            if (micLiveBadge) { micLiveBadge.textContent = "STREAMING 🎙️"; micLiveBadge.className = "live-pill active"; }
        };
        recognition.onresult = (e) => {
            let transcript = "";
            let isFinalResult = false;
            for (let i = e.resultIndex; i < e.results.length; ++i) {
                transcript += e.results[i][0].transcript;
                if (e.results[i].isFinal) isFinalResult = true;
            }
            if (liveTranscriptText) liveTranscriptText.textContent = `"${transcript}"`;
            if (isFinalResult) parsePhysicsVoice(transcript);
        };
        recognition.onend = () => {
            if (isListening) {
                try { recognition.start(); } catch (e) { }
            } else {
                if (micPulseWrapper) micPulseWrapper.classList.remove("listening");
                if (micLiveBadge) { micLiveBadge.textContent = "OFFLINE"; micLiveBadge.className = "live-pill"; }
            }
        };

        try { recognition.start(); } catch (e) { }
    }
}

function toggleListening() {
    if (!recognition) return;
    if (isListening) {
        isListening = false;
        recognition.stop();
    } else {
        isListening = true;
        try { recognition.start(); } catch (e) { }
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

// 6. INTERACTIVE 18-TOPIC PHYSICS QUIZ SYSTEM
let currentQuizTopic = "inertia";
let currentQuizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function showTopicQuiz(topicKey) {
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
    const qData = QUIZ_DATA[currentQuizTopic];
    if (!qData || !qData[currentQuizIndex]) return;

    quizAnswered = false;
    const item = qData[currentQuizIndex];
    const cfg = TOPIC_CONFIG[currentQuizTopic] || { title: "PHYSICS TOPIC" };

    const topicBadge = document.getElementById("quizTopicBadge");
    const counter = document.getElementById("quizCounter");
    const qText = document.getElementById("quizQuestionText");
    const optContainer = document.getElementById("quizOptionsContainer");
    const feedbackBox = document.getElementById("quizFeedbackBox");
    const nextBtn = document.getElementById("quizNextBtn");
    const finishBtn = document.getElementById("quizFinishBtn");
    const retryBtn = document.getElementById("quizRetryBtn");
    const scoreText = document.getElementById("quizScoreText");

    if (topicBadge) topicBadge.textContent = cfg.title;
    if (counter) counter.textContent = `Question ${currentQuizIndex + 1} of ${qData.length}`;
    if (qText) qText.textContent = item.q;
    if (scoreText) scoreText.textContent = `Score: ${quizScore} / ${qData.length}`;
    if (feedbackBox) feedbackBox.classList.add("hidden");
    if (nextBtn) nextBtn.classList.add("hidden");
    if (finishBtn) finishBtn.classList.add("hidden");
    if (retryBtn) retryBtn.classList.add("hidden");

    if (optContainer) {
        optContainer.innerHTML = "";
        const letters = ["A", "B", "C", "D"];
        item.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-opt-btn";
            btn.innerHTML = `<span class="quiz-opt-letter">${letters[idx]}</span> <span class="quiz-opt-label">${opt}</span>`;
            btn.addEventListener("click", () => selectQuizOption(idx));
            optContainer.appendChild(btn);
        });
    }

    speakDialogue("teacher", `Question ${currentQuizIndex + 1}: ${item.q}`);
}

function selectQuizOption(selectedIdx) {
    if (quizAnswered) return;
    quizAnswered = true;

    const qData = QUIZ_DATA[currentQuizTopic];
    const item = qData[currentQuizIndex];
    const isCorrect = (selectedIdx === item.correct);

    const optButtons = document.querySelectorAll(".quiz-opt-btn");
    optButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === item.correct) {
            btn.classList.add("correct");
        } else if (idx === selectedIdx && !isCorrect) {
            btn.classList.add("incorrect");
        }
    });

    if (isCorrect) {
        quizScore++;
        sounds?.playBounce();
    } else {
        sounds?.playShatter();
    }

    const scoreText = document.getElementById("quizScoreText");
    if (scoreText) scoreText.textContent = `Score: ${quizScore} / ${qData.length}`;

    const feedbackBox = document.getElementById("quizFeedbackBox");
    const fbIcon = document.getElementById("quizFeedbackIcon");
    const fbTitle = document.getElementById("quizFeedbackTitle");
    const fbDesc = document.getElementById("quizFeedbackDesc");
    const nextBtn = document.getElementById("quizNextBtn");
    const finishBtn = document.getElementById("quizFinishBtn");
    const retryBtn = document.getElementById("quizRetryBtn");

    if (feedbackBox) {
        feedbackBox.className = `quiz-feedback-box ${isCorrect ? "" : "error"}`;
        feedbackBox.classList.remove("hidden");
    }
    if (fbIcon) fbIcon.textContent = isCorrect ? "🎉" : "❌";
    if (fbTitle) fbTitle.textContent = isCorrect ? "Excellent! That's Correct! (+100 XP)" : "Not quite! Here is why:";
    if (fbDesc) fbDesc.textContent = item.exp;

    if (currentQuizIndex + 1 < qData.length) {
        if (nextBtn) nextBtn.classList.remove("hidden");
    } else {
        if (finishBtn) finishBtn.classList.remove("hidden");
        if (retryBtn) retryBtn.classList.remove("hidden");
    }

    const voiceMsg = isCorrect ? `Correct! ${item.exp}` : `Incorrect. ${item.exp}`;
    speakDialogue("teacher", voiceMsg);
}

function nextQuizQuestion() {
    currentQuizIndex++;
    renderQuizQuestion();
}

function closeQuizModal() {
    const overlay = document.getElementById("quiz-modal-overlay");
    if (overlay) overlay.classList.add("hidden");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// 7. SETUP EVENT LISTENERS & CONTROLS
function initPhysicsControls() {
    document.getElementById("openQuizBtn")?.addEventListener("click", () => showTopicQuiz(currentTopicKey));
    document.getElementById("closeQuizBtn")?.addEventListener("click", closeQuizModal);
    document.getElementById("quizNextBtn")?.addEventListener("click", nextQuizQuestion);
    document.getElementById("quizFinishBtn")?.addEventListener("click", () => {
        closeQuizModal();
        speakDialogue("teacher", `Congratulations! You mastered the ${TOPIC_CONFIG[currentQuizTopic]?.title || "Physics"} lesson with ${quizScore} out of 2 points!`);
    });
    document.getElementById("quizRetryBtn")?.addEventListener("click", () => showTopicQuiz(currentTopicKey));

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

    document.getElementById("micToggleBtn")?.addEventListener("click", toggleListening);

    window.addEventListener("keydown", (e) => {
        if (e.code === "Escape") {
            e.preventDefault();
            stopAllActionsImmediately();
        } else if (e.code === "Space" && e.target.tagName !== "INPUT") {
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
