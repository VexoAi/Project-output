// ==========================================================================
// 1. SOUND FX ENGINE (Web Audio API)
// ==========================================================================

class PhysicsAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.audioDest = null;
        this.activeOscillators = [];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.7;
            this.masterGain.connect(this.ctx.destination);
            this.audioDest = this.ctx.createMediaStreamDestination();
            this.masterGain.connect(this.audioDest);
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    stopAll() {
        if (this.ctx) {
            this.activeOscillators.forEach(osc => {
                try { osc.stop(); osc.disconnect(); } catch (e) { }
            });
            this.activeOscillators = [];
        }
    }

    getStream() {
        this.init();
        return this.audioDest.stream;
    }

    playHum() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(280, now + 0.3);
        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.connect(g); g.connect(this.masterGain);
        osc.start(now); osc.stop(now + 0.5);
        this.activeOscillators.push(osc);
    }

    playShatter() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
        g.gain.setValueAtTime(0.5, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(g); g.connect(this.masterGain);
        osc.start(now); osc.stop(now + 0.35);
        this.activeOscillators.push(osc);
    }

    playZap() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
        g.gain.setValueAtTime(0.4, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.connect(g); g.connect(this.masterGain);
        osc.start(now); osc.stop(now + 0.28);
        this.activeOscillators.push(osc);
    }

    playBounce() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        g.gain.setValueAtTime(0.4, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(g); g.connect(this.masterGain);
        osc.start(now); osc.stop(now + 0.2);
        this.activeOscillators.push(osc);
    }
}

const sounds = new PhysicsAudioEngine();

// ==========================================================================
// 2. BACKGROUND VOICEOVER & SUBTITLES
// ==========================================================================

const CHARACTER_VOICES = {
    gone: { name: "G.One (Narrator)", emoji: "💙", pitch: 1.15, rate: 1.05, color: "#00f0ff" },
    raone: { name: "Ra.One (Narrator)", emoji: "💀", pitch: 0.82, rate: 1.12, color: "#ef4444" },
    teacher: { name: "Physics Teacher", emoji: "👨‍🏫", pitch: 1.0, rate: 1.02, color: "#38bdf8" }
};

let isSpeaking = false;

function speakDialogue(charKey, text, onEnd = null) {
    const char = CHARACTER_VOICES[charKey] || CHARACTER_VOICES.teacher;
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

// ==========================================================================
// 3. 2D CANVAS INITIALIZATION & AMBIENT PARTICLE ENGINE
// ==========================================================================

const canvas = document.getElementById("physicsCanvas2D");
const ctx = canvas.getContext("2d");
let viewWidth = 1000;
let viewHeight = 560;

function resizeCanvas() {
    const container = document.getElementById("canvas3d-container");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewWidth = container.clientWidth;
    viewHeight = container.clientHeight;
    canvas.width = viewWidth * dpr;
    canvas.height = viewHeight * dpr;
    canvas.style.width = `${viewWidth}px`;
    canvas.style.height = `${viewHeight}px`;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function applyInk(ctx, fill, stroke = "#05050a", lw = 4.5) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

// Ambient Floating Particles for Atmosphere
const ambientParticles = Array.from({ length: 28 }, (_, i) => ({
    x: Math.random() * 1200,
    y: Math.random() * 700,
    r: 1.5 + Math.random() * 3,
    speedX: -0.4 + Math.random() * 0.8,
    speedY: -0.6 + Math.random() * 1.2,
    alpha: 0.2 + Math.random() * 0.6
}));

function drawAmbientParticles(ctx, color = "rgba(0, 240, 255, 0.4)") {
    ctx.save();
    ctx.fillStyle = color;
    ambientParticles.forEach(p => {
        p.x = (p.x + p.speedX + viewWidth) % viewWidth;
        p.y = (p.y + p.speedY + viewHeight) % viewHeight;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}

// ==========================================================================
// 4. 18 HIGH-PRODUCTION DEDICATED 2D BACKGROUND ENVIRONMENTS
// ==========================================================================

function drawIceGlacierBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight * 0.65);
    skyGrad.addColorStop(0, "#082f49");
    skyGrad.addColorStop(0.5, "#0284c7");
    skyGrad.addColorStop(1, "#38bdf8");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Distant Glacier Peaks with Snow Caps
    ctx.fillStyle = "#0369a1";
    ctx.beginPath();
    ctx.moveTo(0, viewHeight * 0.65);
    ctx.lineTo(viewWidth * 0.18, viewHeight * 0.32);
    ctx.lineTo(viewWidth * 0.42, viewHeight * 0.65);
    ctx.lineTo(viewWidth * 0.68, viewHeight * 0.26);
    ctx.lineTo(viewWidth, viewHeight * 0.65);
    ctx.fill();

    // Snow Caps
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(viewWidth * 0.18, viewHeight * 0.32);
    ctx.lineTo(viewWidth * 0.14, viewHeight * 0.4);
    ctx.lineTo(viewWidth * 0.22, viewHeight * 0.4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(viewWidth * 0.68, viewHeight * 0.26);
    ctx.lineTo(viewWidth * 0.62, viewHeight * 0.36);
    ctx.lineTo(viewWidth * 0.74, viewHeight * 0.36);
    ctx.fill();

    // Ice Ground with Crystalline Reflection
    const iceY = viewHeight * 0.68;
    const iceGrad = ctx.createLinearGradient(0, iceY, 0, viewHeight);
    iceGrad.addColorStop(0, "#e0f2fe");
    iceGrad.addColorStop(0.3, "#bae6fd");
    iceGrad.addColorStop(1, "#0284c7");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, iceY, viewWidth, viewHeight - iceY);

    // Crystalline Cracks
    ctx.strokeStyle = "rgba(2, 132, 199, 0.5)"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(viewWidth * 0.15, iceY + 15); ctx.lineTo(viewWidth * 0.32, iceY + 55); ctx.lineTo(viewWidth * 0.48, iceY + 40);
    ctx.moveTo(viewWidth * 0.58, iceY + 25); ctx.lineTo(viewWidth * 0.75, iceY + 65); ctx.lineTo(viewWidth * 0.9, iceY + 45);
    ctx.stroke();

    drawAmbientParticles(ctx, "rgba(255, 255, 255, 0.6)");
}

function drawRocketLaunchPadBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    skyGrad.addColorStop(0, "#030712");
    skyGrad.addColorStop(0.6, "#1e1b4b");
    skyGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Distant Launch Gantry Towers
    applyInk(ctx, "#334155", "#0f172a", 3);
    ctx.fillRect(viewWidth * 0.82, 50, 65, viewHeight * 0.65);
    ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2;
    for (let y = 70; y < viewHeight * 0.7; y += 35) {
        ctx.beginPath(); ctx.moveTo(viewWidth * 0.82, y); ctx.lineTo(viewWidth * 0.82 + 65, y + 20); ctx.stroke();
    }

    // Glowing Neon Countdown HUD
    ctx.fillStyle = "#ef4444"; ctx.font = "bold 20px 'Bungee', monospace";
    ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 10;
    ctx.fillText("LAUNCH: F = ma [a = 25 m/s²]", viewWidth * 0.08, 65);
    ctx.shadowBlur = 0;

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#1e293b", "#f97316", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(249, 115, 22, 0.4)");
}

function drawSciFiArenaBackground(ctx, t) {
    ctx.fillStyle = "#05050f";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Glowing Cyan Grid Lines
    ctx.strokeStyle = "rgba(0, 240, 255, 0.18)"; ctx.lineWidth = 1.5;
    for (let x = 0; x <= viewWidth; x += 45) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, viewHeight); ctx.stroke();
    }
    for (let y = 0; y <= viewHeight; y += 45) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(viewWidth, y); ctx.stroke();
    }

    // High-Energy Plasma Conduits
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 4;
    ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(0, 110); ctx.lineTo(viewWidth * 0.35, 110); ctx.lineTo(viewWidth * 0.5, 170); ctx.stroke();
    ctx.strokeStyle = "#00f0ff";
    ctx.shadowColor = "#00f0ff";
    ctx.beginPath(); ctx.moveTo(viewWidth, 110); ctx.lineTo(viewWidth * 0.65, 110); ctx.lineTo(viewWidth * 0.5, 170); ctx.stroke();
    ctx.shadowBlur = 0;

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#090d22", "#00f0ff", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(0, 240, 255, 0.5)");
}

function drawSkyTowerBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(0.65, "#7dd3fc");
    skyGrad.addColorStop(1, "#15803d");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Drifting Volumetric Clouds
    for (let i = 0; i < 3; i++) {
        const cx = ((t * 22 + i * 360) % (viewWidth + 240)) - 120;
        const cy = 55 + i * 38;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.arc(cx + 28, cy - 12, 38, 0, Math.PI * 2); ctx.arc(cx + 60, cy, 32, 0, Math.PI * 2); ctx.fill();
    }

    // Galileo Tower on Left with Stone Textures
    const towerX = viewWidth * 0.15;
    const groundY = viewHeight * 0.72;
    applyInk(ctx, "#64748b", "#0f172a", 4);
    ctx.beginPath(); ctx.rect(towerX - 48, groundY - 260, 96, 320); ctx.fill(); ctx.stroke();

    // Stone Bricks
    ctx.strokeStyle = "rgba(15, 23, 42, 0.4)"; ctx.lineWidth = 1.5;
    for (let by = groundY - 240; by < groundY + 40; by += 25) {
        ctx.beginPath(); ctx.moveTo(towerX - 48, by); ctx.lineTo(towerX + 48, by); ctx.stroke();
    }

    // Arched Windows
    applyInk(ctx, "#0f172a", "#334155", 2);
    ctx.beginPath();
    ctx.arc(towerX, groundY - 200, 16, Math.PI, 0);
    ctx.rect(towerX - 16, groundY - 200, 32, 35);
    ctx.fill(); ctx.stroke();

    // Height Elevation Ruler
    ctx.fillStyle = "#facc15"; ctx.font = "bold 13px 'Outfit', sans-serif";
    for (let h = 0; h <= 20; h += 5) {
        const ry = groundY - 20 - (h * 11);
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(towerX + 48, ry); ctx.lineTo(towerX + 62, ry); ctx.stroke();
        ctx.fillText(`${h}m`, towerX + 68, ry + 4);
    }

    // Yellow Bouncy Trampoline on Ground
    applyInk(ctx, "#eab308", "#05050a", 3);
    ctx.beginPath();
    ctx.ellipse(viewWidth * 0.45, groundY + 105, 58, 14, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(viewWidth * 0.45 - 48, groundY + 105); ctx.lineTo(viewWidth * 0.45 - 48, groundY + 120);
    ctx.moveTo(viewWidth * 0.45 + 48, groundY + 105); ctx.lineTo(viewWidth * 0.45 + 48, groundY + 120);
    ctx.stroke();
}

function drawSkateParkBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight * 0.65);
    skyGrad.addColorStop(0, "#f97316");
    skyGrad.addColorStop(1, "#facc15");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#475569", "#0f172a", 4);
    ctx.beginPath();
    ctx.moveTo(0, floorY - 80);
    ctx.quadraticCurveTo(viewWidth * 0.2, floorY, viewWidth * 0.5, floorY);
    ctx.quadraticCurveTo(viewWidth * 0.8, floorY, viewWidth, floorY - 80);
    ctx.lineTo(viewWidth, viewHeight); ctx.lineTo(0, viewHeight);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    drawAmbientParticles(ctx, "rgba(250, 204, 21, 0.4)");
}

function drawRollercoasterSkylineBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    skyGrad.addColorStop(0, "#09090b");
    skyGrad.addColorStop(1, "#312e81");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // City Silhouettes with Glowing Windows
    ctx.fillStyle = "#1e1b4b";
    for (let x = 0; x < viewWidth; x += 65) {
        const bh = 80 + (x % 115);
        ctx.fillRect(x, viewHeight * 0.72 - bh, 50, bh);
        ctx.fillStyle = "#facc15";
        ctx.fillRect(x + 10, viewHeight * 0.72 - bh + 20, 8, 8);
        ctx.fillRect(x + 28, viewHeight * 0.72 - bh + 40, 8, 8);
        ctx.fillStyle = "#1e1b4b";
    }

    // Glowing Neon Coaster Track
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 7;
    ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(viewWidth * 0.05, viewHeight * 0.4);
    ctx.quadraticCurveTo(viewWidth * 0.3, viewHeight * 0.75, viewWidth * 0.5, viewHeight * 0.45);
    ctx.arc(viewWidth * 0.6, viewHeight * 0.45, 55, Math.PI, Math.PI * 3);
    ctx.lineTo(viewWidth * 0.95, viewHeight * 0.72);
    ctx.stroke();
    ctx.shadowBlur = 0;

    drawAmbientParticles(ctx, "rgba(168, 85, 247, 0.4)");
}

function drawThreeTerrainBackground(ctx, t) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    const floorY = viewHeight * 0.72;

    // Track 1: Ice
    const iceGrad = ctx.createLinearGradient(0, floorY, viewWidth * 0.33, viewHeight);
    iceGrad.addColorStop(0, "rgba(0, 240, 255, 0.35)");
    iceGrad.addColorStop(1, "rgba(2, 132, 199, 0.5)");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, floorY, viewWidth * 0.33, viewHeight - floorY);
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.fillText("1. Ice Track (μ = 0.05)", 15, floorY + 25);

    // Track 2: Polished Wood
    const woodGrad = ctx.createLinearGradient(viewWidth * 0.33, floorY, viewWidth * 0.66, viewHeight);
    woodGrad.addColorStop(0, "rgba(180, 83, 9, 0.35)");
    woodGrad.addColorStop(1, "rgba(120, 53, 15, 0.5)");
    ctx.fillStyle = woodGrad;
    ctx.fillRect(viewWidth * 0.33, floorY, viewWidth * 0.33, viewHeight - floorY);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("2. Polished Wood (μ = 0.3)", viewWidth * 0.33 + 15, floorY + 25);

    // Track 3: Sand Dunes
    const sandGrad = ctx.createLinearGradient(viewWidth * 0.66, floorY, viewWidth, viewHeight);
    sandGrad.addColorStop(0, "rgba(239, 68, 68, 0.35)");
    sandGrad.addColorStop(1, "rgba(153, 27, 27, 0.5)");
    ctx.fillStyle = sandGrad;
    ctx.fillRect(viewWidth * 0.66, floorY, viewWidth * 0.34, viewHeight - floorY);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("3. Sand Dunes (μ = 0.8)", viewWidth * 0.66 + 15, floorY + 25);
}

function drawCircuitBoardBackground(ctx, t) {
    ctx.fillStyle = "#022c22";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Glowing Neon PCB Bus Traces
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3;
    ctx.shadowColor = "#10b981"; ctx.shadowBlur = 10;
    for (let x = 30; x < viewWidth; x += 90) {
        ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x + 35, 130); ctx.lineTo(x + 35, viewHeight * 0.65); ctx.stroke();
        ctx.fillStyle = "#34d399";
        ctx.beginPath(); ctx.arc(x + 35, 130, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#064e3b", "#10b981", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(52, 211, 153, 0.4)");
}

function drawMagneticObservatoryBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    skyGrad.addColorStop(0, "#0f172a");
    skyGrad.addColorStop(1, "#3b0764");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Aurora Borealis Ribbon Waves
    const wave = Math.sin(t * 2.5) * 22;
    ctx.strokeStyle = "rgba(52, 211, 153, 0.45)"; ctx.lineWidth = 30;
    ctx.shadowColor = "#34d399"; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.moveTo(0, 90 + wave); ctx.quadraticCurveTo(viewWidth * 0.5, 50 - wave, viewWidth, 100 + wave); ctx.stroke();
    ctx.shadowBlur = 0;

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#1e1b4b", "#a855f7", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(168, 85, 247, 0.5)");
}

function drawCityStreetBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight * 0.65);
    skyGrad.addColorStop(0, "#172554");
    skyGrad.addColorStop(1, "#3b82f6");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // City Skyline with Streetlights
    ctx.fillStyle = "#1e293b";
    for (let x = 0; x < viewWidth; x += 85) {
        ctx.fillRect(x, viewHeight * 0.65 - 120, 70, 120);
    }

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#334155", "#0f172a", 4);
    ctx.fillRect(0, floorY, viewWidth, viewHeight - floorY);

    // Road Markings
    ctx.strokeStyle = "#facc15"; ctx.lineWidth = 4;
    ctx.setLineDash([20, 15]);
    ctx.beginPath(); ctx.moveTo(0, floorY + 30); ctx.lineTo(viewWidth, floorY + 30); ctx.stroke();
    ctx.setLineDash([]);
}

function drawOpticsDarkroomBackground(ctx, t) {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Optical Breadboard Grid Table
    ctx.strokeStyle = "rgba(0, 240, 255, 0.12)"; ctx.lineWidth = 1;
    for (let x = 0; x <= viewWidth; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, viewHeight * 0.5); ctx.lineTo(x, viewHeight * 0.72); ctx.stroke();
    }

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#0f172a", "#38bdf8", 3);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(255, 255, 255, 0.4)");
}

function drawVerticalLoopArenaBackground(ctx, t) {
    ctx.fillStyle = "#05050f";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Stadium Floodlights
    ctx.fillStyle = "rgba(250, 204, 21, 0.15)";
    ctx.beginPath(); ctx.moveTo(viewWidth * 0.1, 0); ctx.lineTo(viewWidth * 0.4, viewHeight); ctx.lineTo(0, viewHeight); ctx.fill();
    ctx.beginPath(); ctx.moveTo(viewWidth * 0.9, 0); ctx.lineTo(viewWidth * 0.6, viewHeight); ctx.lineTo(viewWidth, viewHeight); ctx.fill();

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#1e293b", "#38bdf8", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(56, 189, 248, 0.4)");
}

function drawOceanTankBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight * 0.38);
    skyGrad.addColorStop(0, "#0c4a6e");
    skyGrad.addColorStop(1, "#0284c7");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight * 0.38);

    const waterY = viewHeight * 0.38;
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, viewHeight);
    waterGrad.addColorStop(0, "rgba(14, 165, 233, 0.8)");
    waterGrad.addColorStop(1, "rgba(3, 105, 161, 0.96)");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, viewWidth, viewHeight - waterY);

    // Animated Surface Waves
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)"; ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = 0; x <= viewWidth; x += 15) {
        const wy = waterY + Math.sin(t * 4 + x * 0.03) * 5;
        if (x === 0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // Rising Air Bubbles
    for (let i = 0; i < 8; i++) {
        const bx = (viewWidth * (0.1 + i * 0.12)) + Math.sin(t * 3 + i) * 12;
        const by = viewHeight - ((t * 45 + i * 70) % (viewHeight - waterY));
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.beginPath(); ctx.arc(bx, by, 5 + (i % 3), 0, Math.PI * 2); ctx.fill();
    }
}

function drawClockTowerBackground(ctx, t) {
    const wallGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    wallGrad.addColorStop(0, "#451a03");
    wallGrad.addColorStop(1, "#1c1917");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Massive Interlocking Brass Clock Gears
    ctx.save();
    ctx.translate(viewWidth * 0.5, viewHeight * 0.4);
    ctx.rotate(t * 0.4);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 12; i++) {
        const ga = (i * Math.PI * 2) / 12;
        ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
        ctx.fillRect(Math.cos(ga) * 120 - 6, Math.sin(ga) * 120 - 6, 12, 12);
    }
    ctx.restore();

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#292524", "#78350f", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
}

function drawHydraulicGarageBackground(ctx, t) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Industrial Overhead Yellow Crane
    applyInk(ctx, "#facc15", "#0f172a", 3);
    ctx.fillRect(viewWidth * 0.1, 40, viewWidth * 0.8, 18);

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#334155", "#475569", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
}

function drawThermalLabBackground(ctx, t) {
    const wallGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    wallGrad.addColorStop(0, "#450a0a");
    wallGrad.addColorStop(1, "#18181b");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Steam Pipes
    ctx.strokeStyle = "#71717a"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(viewWidth, 80); ctx.stroke();

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#27272a", "#ef4444", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(239, 68, 68, 0.4)");
}

function drawRippleTankDarkroomBackground(ctx, t) {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Double Slit Barrier in Center
    ctx.fillStyle = "#334155";
    ctx.fillRect(viewWidth * 0.42, 0, 16, viewHeight * 0.38);
    ctx.fillRect(viewWidth * 0.42, viewHeight * 0.45, 16, viewHeight * 0.1);
    ctx.fillRect(viewWidth * 0.42, viewHeight * 0.62, 16, viewHeight * 0.38);

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#0f172a", "#38bdf8", 3);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(56, 189, 248, 0.4)");
}

function drawQuantumTokamakBackground(ctx, t) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Glowing Tokamak Plasma Torus
    const pulse = 1.0 + Math.sin(t * 8) * 0.25;
    const torusGrad = ctx.createRadialGradient(viewWidth * 0.5, viewHeight * 0.4, 20, viewWidth * 0.5, viewHeight * 0.4, 220 * pulse);
    torusGrad.addColorStop(0, "rgba(234, 179, 8, 0.65)");
    torusGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.45)");
    torusGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = torusGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#09090b", "#facc15", 4);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(250, 204, 21, 0.6)");
}

function drawLabBackground(ctx, t) {
    const wallGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    wallGrad.addColorStop(0, "#0b132b");
    wallGrad.addColorStop(1, "#1c2541");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#0f172a", "#00f0ff", 3);
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(viewWidth, floorY); ctx.stroke();
    drawAmbientParticles(ctx, "rgba(0, 240, 255, 0.4)");
}

// ==========================================================================
// 5. 2D HERO & VILLAIN CHARACTER RIGGING (Glowing Cores & Actions)
// ==========================================================================

function drawGOne2D(ctx, x, y, scale = 1.0, pose = "idle", time = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const bob = Math.sin(time * 6) * 4;

    // Rocket Thruster Flames
    if (pose === "rocket") {
        ctx.save();
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = i === 0 ? "#facc15" : (i === 1 ? "#f97316" : "#ef4444");
            ctx.beginPath();
            const flen = 38 + Math.sin(time * 30 + i) * 18;
            ctx.moveTo(-16, 120); ctx.lineTo(-16 - flen, 130); ctx.lineTo(-10, 122);
            ctx.moveTo(16, 120); ctx.lineTo(16 - flen, 130); ctx.lineTo(10, 122);
            ctx.fill();
        }
        ctx.restore();
    }

    // Parachute Rigging
    if (pose === "parachute") {
        ctx.save();
        applyInk(ctx, "#06b6d4", "#05050a", 3);
        ctx.beginPath(); ctx.arc(0, -95 + bob, 58, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-52, -95 + bob); ctx.lineTo(-10, -20 + bob);
        ctx.moveTo(0, -152 + bob); ctx.lineTo(0, -20 + bob);
        ctx.moveTo(52, -95 + bob); ctx.lineTo(10, -20 + bob);
        ctx.stroke();
        ctx.restore();
    }

    // Skateboard Deck
    if (pose === "skateboard") {
        applyInk(ctx, "#f59e0b", "#05050a", 3);
        ctx.beginPath(); ctx.roundRect(-45, 124, 90, 8, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0284c7";
        ctx.beginPath(); ctx.arc(-30, 134, 5, 0, Math.PI * 2); ctx.arc(30, 134, 5, 0, Math.PI * 2); ctx.fill();
    }

    // Snorkel Mask
    if (pose === "snorkel" || pose === "swim") {
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-18, -16 + bob, 36, 12);
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect(-14, -14 + bob, 28, 8);
    }

    // Legs
    applyInk(ctx, "#0f172a");
    if (pose === "push") {
        ctx.beginPath();
        ctx.moveTo(-15, 60); ctx.lineTo(-45, 120); ctx.lineTo(-30, 120); ctx.lineTo(-5, 75);
        ctx.moveTo(10, 60); ctx.lineTo(35, 120); ctx.lineTo(50, 120); ctx.lineTo(25, 75);
        ctx.fill(); ctx.stroke();
    } else if (pose === "run" || pose === "rocket" || pose === "swim") {
        const sw = Math.sin(time * 14) * 25;
        ctx.beginPath();
        ctx.moveTo(-10, 60); ctx.lineTo(-10 - sw, 120); ctx.lineTo(-5 - sw, 120); ctx.lineTo(-2, 70);
        ctx.moveTo(10, 60); ctx.lineTo(10 + sw, 120); ctx.lineTo(15 + sw, 120); ctx.lineTo(8, 70);
        ctx.fill(); ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(-12, 60); ctx.lineTo(-18, 120); ctx.lineTo(-6, 120); ctx.lineTo(-4, 70);
        ctx.moveTo(12, 60); ctx.lineTo(18, 120); ctx.lineTo(6, 120); ctx.lineTo(4, 70);
        ctx.fill(); ctx.stroke();
    }

    // Shoes
    applyInk(ctx, "#ffffff");
    ctx.beginPath();
    ctx.ellipse(-14, 122, 14, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(14, 122, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Torso / Suit
    const suitGrad = ctx.createLinearGradient(-22, 10, 22, 65);
    suitGrad.addColorStop(0, "#38bdf8");
    suitGrad.addColorStop(1, "#0284c7");
    applyInk(ctx, suitGrad);
    ctx.beginPath();
    ctx.moveTo(-22, 10 + bob); ctx.lineTo(-14, 65 + bob); ctx.lineTo(14, 65 + bob); ctx.lineTo(22, 10 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Glowing H.A.R.T. Core with Rotating Plasma Rings
    const pulse = 1.0 + Math.sin(time * 10) * 0.25;
    ctx.save();
    ctx.shadowColor = "#00f0ff"; ctx.shadowBlur = 20;
    applyInk(ctx, "#ffffff", "#00f0ff", 3);
    ctx.beginPath(); ctx.arc(0, 32 + bob, 12 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Rotating Orbital Ring
    ctx.strokeStyle = "#00f0ff"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 32 + bob, 16 * pulse, 6 * pulse, time * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Arms
    applyInk(ctx, suitGrad);
    if (pose === "push") {
        ctx.beginPath();
        ctx.moveTo(18, 20 + bob); ctx.lineTo(65, 30 + bob); ctx.lineTo(65, 45 + bob); ctx.lineTo(18, 35 + bob);
        ctx.fill(); ctx.stroke();
    } else if (pose === "flex") {
        ctx.beginPath();
        ctx.moveTo(-20, 20 + bob); ctx.lineTo(-45, 0 + bob); ctx.lineTo(-35, -20 + bob); ctx.lineTo(-15, 10 + bob);
        ctx.moveTo(20, 20 + bob); ctx.lineTo(45, 0 + bob); ctx.lineTo(35, -20 + bob); ctx.lineTo(15, 10 + bob);
        ctx.fill(); ctx.stroke();
    } else if (pose === "laser") {
        ctx.beginPath();
        ctx.moveTo(18, 20 + bob); ctx.lineTo(75, 20 + bob); ctx.lineTo(75, 32 + bob); ctx.lineTo(18, 32 + bob);
        ctx.fill(); ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(-22, 20 + bob); ctx.lineTo(-38, 40 + bob); ctx.lineTo(-20, 50 + bob);
        ctx.moveTo(22, 20 + bob); ctx.lineTo(38, 40 + bob); ctx.lineTo(20, 50 + bob);
        ctx.stroke();
    }

    // Head
    applyInk(ctx, "#ffd1b3");
    ctx.beginPath(); ctx.arc(0, -10 + bob, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Spiky Black Hair
    applyInk(ctx, "#05050a");
    ctx.beginPath();
    ctx.moveTo(-22, -15 + bob);
    ctx.lineTo(-32, -42 + bob); ctx.lineTo(-18, -32 + bob);
    ctx.lineTo(-12, -55 + bob); ctx.lineTo(0, -38 + bob);
    ctx.lineTo(12, -58 + bob); ctx.lineTo(18, -35 + bob);
    ctx.lineTo(32, -45 + bob); ctx.lineTo(22, -15 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(-8, -12 + bob, 6, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(8, -12 + bob, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(-7, -12 + bob, 3.5, 0, Math.PI * 2);
    ctx.arc(9, -12 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    applyInk(ctx, "#881337", "#05050a", 2.5);
    ctx.beginPath();
    ctx.arc(0, -1 + bob, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
}

function drawRaOne2D(ctx, x, y, scale = 1.0, pose = "idle", time = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const bob = Math.sin(time * 5 + 1) * 3;

    if (pose === "puddle") {
        applyInk(ctx, "#dc2626");
        ctx.beginPath(); ctx.ellipse(0, 115, 65, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(-15, 114, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(15, 114, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
    }

    if (pose === "flatten") {
        ctx.scale(1.8, 0.3);
    }

    if (pose === "shock") {
        ctx.save();
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 4;
        for (let i = 0; i < 4; i++) {
            const zx = -30 + i * 20;
            ctx.beginPath();
            ctx.moveTo(zx, -30); ctx.lineTo(zx + 10, 0); ctx.lineTo(zx - 5, 30); ctx.lineTo(zx + 10, 60);
            ctx.stroke();
        }
        ctx.restore();
    }

    if (pose === "spin") {
        ctx.rotate(time * 12);
        for (let i = 0; i < 3; i++) {
            const sang = time * 8 + (i * Math.PI * 2) / 3;
            ctx.fillStyle = "#facc15";
            ctx.fillText("⭐", Math.cos(sang) * 45, Math.sin(sang) * 45 - 40);
        }
    }

    // Billowing Black Cape
    applyInk(ctx, "#09090b");
    ctx.beginPath();
    const flap = Math.sin(time * 8) * 16;
    ctx.moveTo(-20, 15 + bob);
    ctx.quadraticCurveTo(-60 + flap, 60, -45 + flap, 125);
    ctx.lineTo(45 + flap, 125);
    ctx.quadraticCurveTo(60 + flap, 60, 20, 15 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Crimson Legs
    applyInk(ctx, "#dc2626");
    ctx.beginPath();
    ctx.moveTo(-12, 60); ctx.lineTo(-16, 120); ctx.lineTo(-6, 120); ctx.lineTo(-4, 70);
    ctx.moveTo(12, 60); ctx.lineTo(16, 120); ctx.lineTo(6, 120); ctx.lineTo(4, 70);
    ctx.fill(); ctx.stroke();

    // Crimson Torso
    applyInk(ctx, "#dc2626");
    ctx.beginPath();
    ctx.moveTo(-22, 10 + bob); ctx.lineTo(-14, 65 + bob); ctx.lineTo(14, 65 + bob); ctx.lineTo(22, 10 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Arms
    if (pose === "hammer") {
        applyInk(ctx, "#dc2626");
        ctx.beginPath(); ctx.moveTo(18, 20 + bob); ctx.lineTo(35, -20 + bob); ctx.lineTo(45, -15 + bob); ctx.stroke();
        applyInk(ctx, "#92400e", "#05050a", 4);
        ctx.beginPath(); ctx.rect(20, -55 + bob, 40, 25); ctx.fill(); ctx.stroke();
    } else {
        applyInk(ctx, "#dc2626");
        ctx.beginPath();
        ctx.moveTo(-22, 20 + bob); ctx.lineTo(-35, 45 + bob); ctx.lineTo(-20, 50 + bob);
        ctx.moveTo(22, 20 + bob); ctx.lineTo(35, 45 + bob); ctx.lineTo(20, 50 + bob);
        ctx.stroke();
    }

    // Skull Face
    applyInk(ctx, "#f8fafc");
    ctx.beginPath(); ctx.arc(0, -10 + bob, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    applyInk(ctx, "#09090b");
    ctx.beginPath(); ctx.arc(0, -12 + bob, 23, Math.PI * 0.8, Math.PI * 2.2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#05050a";
    ctx.beginPath();
    ctx.ellipse(-8, -10 + bob, 6, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(8, -10 + bob, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Yellow Villain Pupils
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(-7, -10 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(9, -10 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    applyInk(ctx, "#881337", "#05050a", 2.5);
    ctx.beginPath();
    ctx.arc(0, 0 + bob, 6, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.restore();
}

function drawForceArrow(ctx, fx, fy, tx, ty, label, col = "#00f0ff") {
    const headLen = 14;
    const dx = tx - fx;
    const dy = ty - fy;
    const ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.shadowColor = col; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - headLen * Math.cos(ang - Math.PI / 6), ty - headLen * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(tx - headLen * Math.cos(ang + Math.PI / 6), ty - headLen * Math.sin(ang + Math.PI / 6));
    ctx.closePath(); ctx.fill();

    if (label) {
        ctx.font = "bold 14px 'Outfit', sans-serif";
        ctx.fillStyle = "#090d1f";
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - 12;
        const tw = ctx.measureText(label).width;
        ctx.fillRect(mx - tw / 2 - 6, my - 14, tw + 12, 20);
        ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        ctx.strokeRect(mx - tw / 2 - 6, my - 14, tw + 12, 20);
        ctx.fillStyle = col; ctx.textAlign = "center";
        ctx.fillText(label, mx, my);
    }
    ctx.restore();
}

// ==========================================================================
// 6. 18 PHYSICS TOPIC CONFIG & 30-SECOND MULTI-PHASE DIALOGUES
// ==========================================================================

let currentTopicKey = "inertia";
const TOPIC_DURATION = 30;
let currentTimelineTime = 0;
let isPlaying = false;
let isIdleState = true;
let isWelcomeMode = true;
let dialogueTriggered = {};

const TOPIC_CONFIG = {
    inertia: {
        title: "1. LAW OF INERTIA (NEWTON 1ST)",
        sub: "ΣF = 0 ➔ CONSTANT VELOCITY (v = const)",
        level: "LVL 1 • 30s",
        quote: "An object at rest stays at rest, and an object in motion continues moving unless an external force acts on it!",
        dialogues: {
            p1: { speaker: "teacher", text: "Newton's First Law: An object at rest stays at rest until an external force is applied!" },
            p2: { speaker: "gone", text: "Inertia in action! Pushing the 500kg crate across frictionless glacier ice!" },
            p3: { speaker: "raone", text: "My 100kg hammer shattered! Frictionless velocity remains perfectly constant!" }
        }
    },
    fma: {
        title: "2. FORCE & ACCELERATION (F = ma)",
        sub: "ACCELERATION a = F / m",
        level: "LVL 2 • 30s",
        quote: "Acceleration is directly proportional to net force and inversely proportional to mass!",
        dialogues: {
            p1: { speaker: "teacher", text: "Newton's Second Law: Force equals mass times acceleration (F = ma)!" },
            p2: { speaker: "gone", text: "Rocket thrusters engaged! Lighter mass achieves massive acceleration at 25 m/s²!" },
            p3: { speaker: "raone", text: "Flattened under the 1000kg safe! Mass resists acceleration!" }
        }
    },
    action: {
        title: "3. ACTION & REACTION (NEWTON 3RD)",
        sub: "F_action = -F_reaction (EQUAL & OPPOSITE)",
        level: "LVL 3 • 30s",
        quote: "For every action, there is an equal and opposite reaction force!",
        dialogues: {
            p1: { speaker: "teacher", text: "Newton's Third Law: For every action, there is an equal and opposite reaction!" },
            p2: { speaker: "gone", text: "Firing cyan plasma beam! Notice the equal and opposite recoil power-slide!" },
            p3: { speaker: "raone", text: "Equal recoil blast! I am liquefying into a comic puddle!" }
        }
    },
    gravity: {
        title: "4. GRAVITY & FREE FALL (g = 9.8 m/s²)",
        sub: "F_g = mg • ACCELERATION INDEPENDENT OF MASS",
        level: "LVL 4 • 30s",
        quote: "All objects in a vacuum accelerate downward at the exact same rate: 9.8 m/s²!",
        dialogues: {
            p1: { speaker: "teacher", text: "Gravitational Acceleration: Earth accelerates all falling bodies at g = 9.8 m/s²!" },
            p2: { speaker: "gone", text: "Dropping apple and anvil from 20m tower! Both hit the ground simultaneously!" },
            p3: { speaker: "raone", text: "Boing! Trampoline recoil proves constant gravitational acceleration!" }
        }
    },
    momentum: {
        title: "5. CONSERVATION OF MOMENTUM (p = mv)",
        sub: "TOTAL MOMENTUM BEFORE = TOTAL AFTER",
        level: "LVL 5 • 30s",
        quote: "In a closed system, total momentum is conserved in every collision!",
        dialogues: {
            p1: { speaker: "teacher", text: "Law of Momentum Conservation: Total momentum p = mv is completely conserved!" },
            p2: { speaker: "gone", text: "Rocket skate collision! 100% velocity transfers elastically across the skatepark!" },
            p3: { speaker: "raone", text: "Spinning like a bowling pin! Momentum conserved perfectly!" }
        }
    },
    energy: {
        title: "6. WORK & KINETIC ENERGY (KE = ½mv²)",
        sub: "POTENTIAL ENERGY (mgh) ➔ KINETIC ENERGY (½mv²)",
        level: "LVL 6 • 30s",
        quote: "Energy cannot be created or destroyed, only converted from one form to another!",
        dialogues: {
            p1: { speaker: "teacher", text: "Conservation of Energy: Potential energy at the hill converts directly to kinetic energy!" },
            p2: { speaker: "gone", text: "Peak coaster speed! Kinetic energy powers smoothly through the 360 degree loop!" },
            p3: { speaker: "raone", text: "Tachometer maxed out! Mechanical energy is fully conserved!" }
        }
    },
    friction: {
        title: "7. FRICTION & DRAG FORCES (F_frict = μN)",
        sub: "OPPOSING RESISTANCE TO MOTION",
        level: "LVL 7 • 30s",
        quote: "Friction acts parallel to contacting surfaces in the direction opposing motion!",
        dialogues: {
            p1: { speaker: "teacher", text: "Frictional Resistance: Friction force F = μN always opposes motion!" },
            p2: { speaker: "gone", text: "Gliding effortlessly on ice (μ = 0.05), while wood and sand cause immense drag!" },
            p3: { speaker: "raone", text: "Sand friction and drag parachute brought me to an immediate halt!" }
        }
    },
    electricity: {
        title: "8. ELECTRICITY & CIRCUITS (V = IR)",
        sub: "OHM'S LAW • CURRENT I = V / R",
        level: "LVL 8 • 30s",
        quote: "Voltage pushes electric current through resistance following Ohm's Law V = IR!",
        dialogues: {
            p1: { speaker: "teacher", text: "Ohm's Law: Voltage pushes electric current through circuit resistance (V = IR)!" },
            p2: { speaker: "gone", text: "Knife switch closed! Electrons flow in a closed loop, powering the lightbulb!" },
            p3: { speaker: "raone", text: "ZAP! High voltage current flowing through the circuit!" }
        }
    },
    magnetism: {
        title: "9. MAGNETISM & MAGNETIC FIELDS",
        sub: "OPPOSITES ATTRACT • LIKES REPEL",
        level: "LVL 9 • 30s",
        quote: "Magnetic field lines flow from North to South, generating Lorentz forces on moving charges!",
        dialogues: {
            p1: { speaker: "teacher", text: "Magnetic Force: North and South opposite poles attract with powerful flux lines!" },
            p2: { speaker: "gone", text: "Electromagnet activated! Magnetic field curves attract iron shield!" },
            p3: { speaker: "raone", text: "Repelling magnetic poles send me into a dizzy 360 degree spin!" }
        }
    },
    doppler: {
        title: "10. SOUND WAVES & DOPPLER EFFECT",
        sub: "f' = f [v / (v ± v_source)]",
        level: "LVL 10 • 30s",
        quote: "The perceived pitch increases as a sound source approaches and decreases as it moves away!",
        dialogues: {
            p1: { speaker: "teacher", text: "Doppler Effect: Approaching sound waves compress, shifting to a higher frequency!" },
            p2: { speaker: "gone", text: "Siren sound ambulance speeding by! Concentric wavefronts compress in front!" },
            p3: { speaker: "raone", text: "High frequency wave compression shattered my resonant glass beaker!" }
        }
    },
    light: {
        title: "11. LIGHT REFRACTION & PRISMS",
        sub: "SNELL'S LAW: n₁ sin θ₁ = n₂ sin θ₂",
        level: "LVL 11 • 30s",
        quote: "Light bends when changing mediums and disperses into a continuous spectrum through prisms!",
        dialogues: {
            p1: { speaker: "teacher", text: "Snell's Law: Light bends at medium boundaries and disperses into 7 rainbow colors!" },
            p2: { speaker: "gone", text: "Triangular glass prism active! White laser beam split into 7 vibrant colors!" },
            p3: { speaker: "raone", text: "Dancing under the spectral rainbow in dark sunglasses!" }
        }
    },
    centripetal: {
        title: "12. CENTRIPETAL FORCE (Fc = mv² / r)",
        sub: "INWARD ACCELERATION IN CIRCULAR PATHS",
        level: "LVL 12 • 30s",
        quote: "Inward centripetal force continuously changes velocity direction, enabling circular orbits!",
        dialogues: {
            p1: { speaker: "teacher", text: "Centripetal Force: Inward radial force Fc = mv²/r enables 360 degree vertical loops!" },
            p2: { speaker: "gone", text: "Defying gravity! Inward radial vector arrow keeps velocity on circular track!" },
            p3: { speaker: "raone", text: "Inward acceleration verified around the vertical loop arena!" }
        }
    },
    buoyancy: {
        title: "13. ARCHIMEDES' BUOYANCY (Fb = ρVg)",
        sub: "BUOYANT FORCE EQUALS WEIGHT OF DISPLACED FLUID",
        level: "LVL 13 • 30s",
        quote: "An object submerged in a fluid experiences an upward buoyant force equal to the weight of fluid displaced!",
        dialogues: {
            p1: { speaker: "teacher", text: "Archimedes' Principle: Upward buoyant force Fb = ρVg keeps floating objects afloat!" },
            p2: { speaker: "gone", text: "Wooden block floats while heavy iron ball sinks in the hydrodynamics ocean tank!" },
            p3: { speaker: "raone", text: "Buoyancy verified with water displacement and rising bubbles!" }
        }
    },
    pendulum: {
        title: "14. SIMPLE PENDULUM & SHM",
        sub: "PERIOD T = 2π √(L / g) • PERIODIC HARMONIC MOTION",
        level: "LVL 14 • 30s",
        quote: "The period of a simple pendulum depends only on string length and gravitational acceleration!",
        dialogues: {
            p1: { speaker: "teacher", text: "Simple Harmonic Motion: Pendulum period T = 2π√(L/g) is independent of bob mass!" },
            p2: { speaker: "gone", text: "Oscillating smoothly through the grand Victorian clock tower with trapeze swing!" },
            p3: { speaker: "raone", text: "Periodic motion verified with harmonic restoring forces!" }
        }
    },
    pascal: {
        title: "15. PASCAL'S LAW & HYDRAULICS",
        sub: "P = F₁ / A₁ = F₂ / A₂ • PRESSURE TRANSMISSION",
        level: "LVL 15 • 30s",
        quote: "Pressure applied to an enclosed fluid is transmitted undiminished throughout the entire fluid!",
        dialogues: {
            p1: { speaker: "teacher", text: "Pascal's Law: Small force on small piston A1 effortlessly lifts heavy vehicle on piston A2!" },
            p2: { speaker: "gone", text: "Hydraulic multiplication! Lifting the entire 2000kg truck with fluid pressure!" },
            p3: { speaker: "raone", text: "Pascal's fluid pressure is transmitted undiminished in all directions!" }
        }
    },
    thermal: {
        title: "16. HEAT TRANSFER & THERMODYNAMICS",
        sub: "HEAT Q = mc ΔT • CONDUCTION & CONVECTION",
        level: "LVL 16 • 30s",
        quote: "Heat naturally flows from regions of higher temperature to lower temperature following the laws of thermodynamics!",
        dialogues: {
            p1: { speaker: "teacher", text: "Thermodynamics: Heat energy Q = mcΔT flows from hot boiling steam to colder matter!" },
            p2: { speaker: "gone", text: "Thermal conduction bar glowing red hot with expanding steam kettle!" },
            p3: { speaker: "raone", text: "Ouch! Heat flows directly into my gauntlet via thermal conduction!" }
        }
    },
    interference: {
        title: "17. WAVE INTERFERENCE & DOUBLE SLIT",
        sub: "CONSTRUCTIVE & DESTRUCTIVE INTERFERENCE",
        level: "LVL 17 • 30s",
        quote: "Overlapping coherent waves combine constructively to create bright fringes and destructively to create dark nodes!",
        dialogues: {
            p1: { speaker: "teacher", text: "Wave Interference: Coherent wave peaks align to produce bright constructive bands!" },
            p2: { speaker: "gone", text: "Double-slit wave diffraction confirmed with bright interference fringes!" },
            p3: { speaker: "raone", text: "Dark destructive nodes and bright constructive bands verified on screen!" }
        }
    },
    nuclear: {
        title: "18. MASS-ENERGY EQUIVALENCE (E = mc²)",
        sub: "EINSTEIN'S MASS-ENERGY & NUCLEAR FISSION",
        level: "LVL 18 • 30s",
        quote: "Mass and energy are interchangeable; a tiny amount of mass converts into colossal energy: E = mc²!",
        dialogues: {
            p1: { speaker: "teacher", text: "Einstein's Mass-Energy Equivalence: E = mc² powers the stars and nuclear reactions!" },
            p2: { speaker: "gone", text: "Mass converts directly into pure energy! H.A.R.T. Core resonance peak in tokamak chamber!" },
            p3: { speaker: "raone", text: "Colossal energy burst verified! Einstein's formula E = mc² mastered!" }
        }
    }
};

function stopAllActionsImmediately() {
    isPlaying = false;
    isIdleState = true;

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    sounds.stopAll();

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

function generateAndPlayTopic(topicKey) {
    if (!TOPIC_CONFIG[topicKey]) return;

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

// ==========================================================================
// 7. MAIN 2D SCENE RENDERER WITH ATTRACTIVE VISUAL EFFECTS
// ==========================================================================

function renderScene2D(t) {
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    switch (currentTopicKey) {
        case "inertia": drawIceGlacierBackground(ctx, t); break;
        case "fma": drawRocketLaunchPadBackground(ctx, t); break;
        case "action": drawSciFiArenaBackground(ctx, t); break;
        case "gravity": drawSkyTowerBackground(ctx, t); break;
        case "momentum": drawSkateParkBackground(ctx, t); break;
        case "energy": drawRollercoasterSkylineBackground(ctx, t); break;
        case "friction": drawThreeTerrainBackground(ctx, t); break;
        case "electricity": drawCircuitBoardBackground(ctx, t); break;
        case "magnetism": drawMagneticObservatoryBackground(ctx, t); break;
        case "doppler": drawCityStreetBackground(ctx, t); break;
        case "light": drawOpticsDarkroomBackground(ctx, t); break;
        case "centripetal": drawVerticalLoopArenaBackground(ctx, t); break;
        case "buoyancy": drawOceanTankBackground(ctx, t); break;
        case "pendulum": drawClockTowerBackground(ctx, t); break;
        case "pascal": drawHydraulicGarageBackground(ctx, t); break;
        case "thermal": drawThermalLabBackground(ctx, t); break;
        case "interference": drawRippleTankDarkroomBackground(ctx, t); break;
        case "nuclear": drawQuantumTokamakBackground(ctx, t); break;
        default: drawLabBackground(ctx, t); break;
    }

    const groundY = viewHeight * 0.72;

    const victoryBanner = document.getElementById("victory-banner");
    if (!isIdleState && t >= 23.5 && t < TOPIC_DURATION) {
        if (victoryBanner) victoryBanner.classList.remove("hidden");
    } else {
        if (victoryBanner) victoryBanner.classList.add("hidden");
    }

    if (isIdleState) {
        drawGOne2D(ctx, viewWidth * 0.32, groundY, 1.1, "idle", performance.now() * 0.001);
        drawRaOne2D(ctx, viewWidth * 0.68, groundY, 1.1, "idle", performance.now() * 0.001);
        return;
    }

    const cfg = TOPIC_CONFIG[currentTopicKey] || TOPIC_CONFIG.inertia;

    if (t < 10.0 && !dialogueTriggered["t_p1"]) {
        dialogueTriggered["t_p1"] = true;
        if (cfg.dialogues?.p1) speakDialogue(cfg.dialogues.p1.speaker, cfg.dialogues.p1.text);
    } else if (t >= 10.0 && t < 20.0 && !dialogueTriggered["t_p2"]) {
        dialogueTriggered["t_p2"] = true;
        if (cfg.dialogues?.p2) speakDialogue(cfg.dialogues.p2.speaker, cfg.dialogues.p2.text);
    } else if (t >= 20.0 && !dialogueTriggered["t_p3"]) {
        dialogueTriggered["t_p3"] = true;
        if (cfg.dialogues?.p3) speakDialogue(cfg.dialogues.p3.speaker, cfg.dialogues.p3.text);
    }

    // 1. INERTIA
    if (currentTopicKey === "inertia") {
        if (t < 10.0) {
            drawSteelCrate(ctx, viewWidth * 0.45, groundY + 60, "500 KG", "v = 0 (At Rest)");
            drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "push", t);
            drawForceArrow(ctx, viewWidth * 0.2, groundY + 20, viewWidth * 0.4, groundY + 20, "F_push", "#00f0ff");
            drawRaOne2D(ctx, viewWidth * 0.78, groundY, 1.1, "laugh", t);
        } else if (t < 20.0) {
            const bx = viewWidth * 0.3 + (t - 10.0) * 35;
            drawGOne2D(ctx, bx - 85, groundY, 1.1, "push", t);
            drawSteelCrate(ctx, bx, groundY + 60, "500 KG", "v > 0 (Inertia)");
            drawForceArrow(ctx, bx - 110, groundY + 30, bx, groundY + 30, "F_push = 500 N", "#00f0ff");
            drawRaOne2D(ctx, viewWidth * 0.82, groundY, 1.1, "hammer", t);
            if (t > 15.0 && !dialogueTriggered["in_shatter"]) { dialogueTriggered["in_shatter"] = true; sounds.playShatter(); }
        } else {
            const gx = viewWidth * 0.65 + (t - 20.0) * 30;
            drawSteelCrate(ctx, gx, groundY + 60, "500 KG", "v = CONSTANT");
            drawForceArrow(ctx, gx - 40, groundY - 20, gx + 80, groundY - 20, "Velocity (v = const)", "#facc15");
            drawGOne2D(ctx, viewWidth * 0.35, groundY, 1.1, "skateboard", t);
            drawRaOne2D(ctx, viewWidth * 0.85, groundY, 1.1, "flatten", t);
        }
    }

    // 2. F = ma
    else if (currentTopicKey === "fma") {
        if (t < 10.0) {
            drawIronSafe(ctx, viewWidth * 0.45, groundY + 60);
            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "run", t);
            drawRaOne2D(ctx, viewWidth * 0.6, groundY, 1.1, "push", t);
            drawForceArrow(ctx, viewWidth * 0.68, groundY + 20, viewWidth * 0.52, groundY + 20, "Mass Resists Acceleration", "#ef4444");
        } else if (t < 20.0) {
            const bx = viewWidth * 0.35 + (t - 10.0) * 45;
            drawGOne2D(ctx, bx - 80, groundY, 1.1, "rocket", t);
            drawIronSafe(ctx, bx + 50, groundY + 60);
            drawForceArrow(ctx, bx - 60, groundY + 30, bx + 60, groundY + 30, "a = 25 m/s²", "#facc15");
            drawRaOne2D(ctx, viewWidth * 0.82, groundY, 1.1, "flatten", t);
        } else {
            drawGOne2D(ctx, viewWidth * 0.4, groundY - 40, 1.1, "rocket", t);
            drawIronSafe(ctx, viewWidth * 0.75, groundY + 60);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "flatten", t);
        }
    }

    // 3. ACTION & REACTION
    else if (currentTopicKey === "action") {
        if (t < 10.0) {
            drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "laser", t);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "laser", t);
            drawForceArrow(ctx, viewWidth * 0.3, groundY - 30, viewWidth * 0.45, groundY - 30, "Charging F_action", "#00f0ff");
            drawForceArrow(ctx, viewWidth * 0.7, groundY - 30, viewWidth * 0.55, groundY - 30, "Charging F_reaction", "#ef4444");
        } else if (t < 20.0) {
            drawForceArrow(ctx, viewWidth * 0.35, groundY - 10, viewWidth * 0.5, groundY - 10, "F_action ➔", "#00f0ff");
            drawForceArrow(ctx, viewWidth * 0.65, groundY - 10, viewWidth * 0.5, groundY - 10, "⬅ F_reaction", "#ef4444");
            drawPlasmaClash(ctx, viewWidth * 0.35, viewWidth * 0.65, groundY + 25, t);
            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "push", t);
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "laser", t);
        } else {
            drawGOne2D(ctx, viewWidth * 0.35, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "puddle", t);
        }
    }

    // 4. GRAVITY & FREE FALL
    else if (currentTopicKey === "gravity") {
        if (t < 10.0) {
            drawAnvil(ctx, viewWidth * 0.28, 140);
            ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(viewWidth * 0.24, 140, 12, 0, Math.PI * 2); ctx.fill();
            drawRaOne2D(ctx, viewWidth * 0.15, 60, 0.9, "laugh", t);
            drawGOne2D(ctx, viewWidth * 0.15, 140, 0.9, "flex", t);
            drawForceArrow(ctx, viewWidth * 0.26, 170, viewWidth * 0.26, 230, "g = 9.8 m/s²", "#00f0ff");
        } else if (t < 20.0) {
            const fallY = Math.min(groundY + 95, 140 + (t - 10.0) * 55);
            drawAnvil(ctx, viewWidth * 0.42, fallY);
            ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(viewWidth * 0.48, fallY, 12, 0, Math.PI * 2); ctx.fill();
            drawForceArrow(ctx, viewWidth * 0.45, fallY - 40, viewWidth * 0.45, fallY + 30, "Free Fall Acceleration", "#00f0ff");

            const bounceY = groundY + Math.sin((t - 10.0) * 8) * 45;
            drawRaOne2D(ctx, viewWidth * 0.45, bounceY, 1.0, "shock", t);
            if (!dialogueTriggered["grav_bounce"] && t > 12.0) { dialogueTriggered["grav_bounce"] = true; sounds.playBounce(); }

            const paraY = Math.min(groundY - 10, 100 + (t - 10.0) * 35);
            drawGOne2D(ctx, viewWidth * 0.75, paraY, 1.0, "parachute", t);
        } else {
            const bounceY = groundY + Math.sin((t - 20.0) * 6) * 35;
            drawRaOne2D(ctx, viewWidth * 0.45, bounceY, 1.0, "shock", t);
            drawGOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "flex", t);
        }
    }

    // 5. MOMENTUM
    else if (currentTopicKey === "momentum") {
        if (t < 10.0) {
            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "skateboard", t);
            drawRaOne2D(ctx, viewWidth * 0.65, groundY, 1.1, "idle", t);
            drawForceArrow(ctx, viewWidth * 0.2, groundY - 30, viewWidth * 0.35, groundY - 30, "p1 = 250 kg·m/s", "#00f0ff");
        } else if (t < 20.0) {
            const rx = viewWidth * 0.65 + (t - 10.0) * 35;
            drawGOne2D(ctx, viewWidth * 0.5, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, rx, groundY - 20, 1.1, "spin", t);
            drawForceArrow(ctx, rx - 30, groundY - 30, rx + 60, groundY - 30, "p2' = 250 kg·m/s", "#facc15");
        } else {
            drawGOne2D(ctx, viewWidth * 0.35, groundY, 1.1, "skateboard", t);
            drawRaOne2D(ctx, viewWidth * 0.85, groundY, 1.1, "spin", t);
        }
    }

    // 6. WORK & ENERGY
    else if (currentTopicKey === "energy") {
        if (t < 10.0) {
            drawGOne2D(ctx, viewWidth * 0.2, groundY - 70, 0.9, "push", t);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "laugh", t);
            drawForceArrow(ctx, viewWidth * 0.15, groundY - 90, viewWidth * 0.25, groundY - 90, "PE = mgh = 5000 J", "#facc15");
        } else if (t < 20.0) {
            const cx = viewWidth * 0.2 + (t - 10.0) * 60;
            drawGOne2D(ctx, cx, groundY - 30, 0.9, "run", t);
            drawForceArrow(ctx, cx, groundY - 60, cx + 60, groundY - 60, "KE = ½mv² = 5000 J", "#00f0ff");
            drawRaOne2D(ctx, viewWidth * 0.85, groundY, 1.1, "shock", t);
        } else {
            drawGOne2D(ctx, viewWidth * 0.35, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.85, groundY, 1.1, "flatten", t);
        }
    }

    // 7. FRICTION & DRAG
    else if (currentTopicKey === "friction") {
        if (t < 10.0) {
            drawGOne2D(ctx, viewWidth * 0.15, groundY, 1.1, "skateboard", t);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "run", t);
            drawForceArrow(ctx, viewWidth * 0.75, groundY + 30, viewWidth * 0.65, groundY + 30, "High Sand Drag", "#ef4444");
        } else if (t < 20.0) {
            drawGOne2D(ctx, viewWidth * 0.35, groundY, 1.1, "skateboard", t);
            drawForceArrow(ctx, viewWidth * 0.35, groundY - 20, viewWidth * 0.5, groundY - 20, "Smooth Ice μ = 0.05", "#00f0ff");
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "parachute", t);
            drawForceArrow(ctx, viewWidth * 0.85, groundY + 30, viewWidth * 0.7, groundY + 30, "Drag Parachute ⬅", "#ef4444");
        } else {
            drawGOne2D(ctx, viewWidth * 0.4, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "flatten", t);
        }
    }

    // 8. ELECTRICITY & CIRCUITS
    else if (currentTopicKey === "electricity") {
        if (t < 10.0) {
            drawElectricCircuit(ctx, groundY, 0, false);
            drawGOne2D(ctx, viewWidth * 0.22, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.78, groundY, 1.1, "run", t);
            drawForceArrow(ctx, viewWidth * 0.22, groundY - 35, viewWidth * 0.4, groundY - 35, "12V Battery Ready", "#00f0ff");
        } else if (t < 20.0) {
            drawElectricCircuit(ctx, groundY, t, true);
            drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "push", t);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "shock", t);
            drawForceArrow(ctx, viewWidth * 0.3, groundY - 30, viewWidth * 0.7, groundY - 30, "Current I = V/R Flowing ➔", "#facc15");
            if (t > 12.0 && !dialogueTriggered["elec_zap"]) { dialogueTriggered["elec_zap"] = true; sounds.playZap(); }
        } else {
            drawElectricCircuit(ctx, groundY, t, true);
            drawGOne2D(ctx, viewWidth * 0.3, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "shock", t);
        }
    }

    // 9. MAGNETISM
    else if (currentTopicKey === "magnetism") {
        if (t < 10.0) {
            drawHorseshoeMagnet(ctx, viewWidth * 0.35, groundY - 40, t);
            drawGOne2D(ctx, viewWidth * 0.22, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.78, groundY, 1.1, "run", t);
            drawForceArrow(ctx, viewWidth * 0.35, groundY - 30, viewWidth * 0.55, groundY - 30, "Magnetic Flux Lines", "#00f0ff");
        } else if (t < 20.0) {
            drawHorseshoeMagnet(ctx, viewWidth * 0.45, groundY - 40, t);
            drawGOne2D(ctx, viewWidth * 0.3, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, "spin", t);
            drawForceArrow(ctx, viewWidth * 0.75, groundY - 40, viewWidth * 0.9, groundY - 40, "Magnetic Repulsion", "#ef4444");
        } else {
            drawHorseshoeMagnet(ctx, viewWidth * 0.4, groundY - 40, t);
            drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "spin", t);
        }
    }

    // 10. DOPPLER EFFECT
    else if (currentTopicKey === "doppler") {
        const cartX = viewWidth * 0.15 + (t * 22);
        for (let r = 20; r <= 140; r += 30) {
            ctx.strokeStyle = "rgba(0, 240, 255, 0.45)"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(cartX, groundY + 30, r, 0, Math.PI * 2); ctx.stroke();
        }
        drawGOne2D(ctx, cartX, groundY, 1.1, "run", t);
        if (t < 15.0) {
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "idle", t);
            drawForceArrow(ctx, cartX, groundY - 30, viewWidth * 0.8, groundY - 30, "Frequency f' Increases", "#facc15");
        } else {
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "shock", t);
            if (!dialogueTriggered["dop_shatter"]) { dialogueTriggered["dop_shatter"] = true; sounds.playShatter(); }
        }
    }

    // 11. LIGHT & PRISM REFRACTION
    else if (currentTopicKey === "light") {
        const prismX = viewWidth * 0.48;
        const prismY = groundY - 20;
        const prismAng = Math.sin(t * 1.5) * 0.15;

        ctx.save();
        ctx.translate(prismX, prismY);
        ctx.rotate(prismAng);
        applyInk(ctx, "rgba(255,255,255,0.32)", "#00f0ff", 4);
        ctx.beginPath();
        ctx.moveTo(0, -65);
        ctx.lineTo(-45, 60);
        ctx.lineTo(45, 60);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();

        const laserX = viewWidth * 0.12;
        const laserY = groundY - 15;
        applyInk(ctx, "#1e293b", "#00f0ff", 3);
        ctx.fillRect(laserX, laserY - 15, 60, 30);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(laserX + 60, laserY, 8, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(laserX + 60, laserY); ctx.lineTo(prismX - 25, prismY); ctx.stroke();
        drawForceArrow(ctx, laserX + 80, laserY - 20, prismX - 40, laserY - 20, "White Laser Beam", "#ffffff");

        const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"];
        colors.forEach((col, idx) => {
            const spreadY = groundY - 90 + idx * 26 + Math.sin(t * 3 + idx) * 4;
            ctx.strokeStyle = col; ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(prismX + 20, prismY - 10 + idx * 3);
            ctx.lineTo(viewWidth * 0.88, spreadY);
            ctx.stroke();
        });

        if (t < 10.0) {
            drawGOne2D(ctx, viewWidth * 0.18, groundY, 1.1, "push", t);
            drawRaOne2D(ctx, viewWidth * 0.78, groundY, 1.1, "run", t);
        } else if (t < 20.0) {
            const danceX = viewWidth * 0.72 + Math.sin(t * 5) * 35;
            drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, danceX, groundY, 1.1, "run", t);
            ctx.fillStyle = "#05050a";
            ctx.fillRect(danceX - 14, groundY - 12, 28, 7);
        } else {
            applyInk(ctx, "rgba(255,255,255,0.28)", "#facc15", 3);
            ctx.beginPath();
            ctx.moveTo(viewWidth * 0.75, groundY - 80);
            ctx.lineTo(viewWidth * 0.71, groundY + 40);
            ctx.lineTo(viewWidth * 0.79, groundY + 40);
            ctx.closePath(); ctx.fill(); ctx.stroke();

            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 8;
            ctx.beginPath(); ctx.moveTo(viewWidth * 0.79, groundY - 20); ctx.lineTo(viewWidth * 0.95, groundY - 20); ctx.stroke();

            drawGOne2D(ctx, viewWidth * 0.28, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, viewWidth * 0.88, groundY, 1.1, "laugh", t);
        }
    }

    // 12. CENTRIPETAL FORCE
    else if (currentTopicKey === "centripetal") {
        const loopR = 95;
        const ang = t * 3.5;
        ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(viewWidth * 0.5, groundY - 10, loopR, 0, Math.PI * 2); ctx.stroke();
        const gx = viewWidth * 0.5 + Math.cos(ang) * loopR;
        const gy = groundY - 10 + Math.sin(ang) * loopR;
        drawForceArrow(ctx, gx, gy, viewWidth * 0.5, groundY - 10, "Fc = mv²/r", "#facc15");
        drawGOne2D(ctx, gx, gy - 60, 0.85, "run", t);
        drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.1, "shock", t);
    }

    // 13. BUOYANCY & ARCHIMEDES
    else if (currentTopicKey === "buoyancy") {
        const waterTopY = viewHeight * 0.38;
        const woodX = viewWidth * 0.42;
        const woodY = waterTopY + Math.sin(t * 3) * 6;

        applyInk(ctx, "#92400e", "#05050a", 3);
        ctx.fillRect(woodX, woodY, 65, 45);
        ctx.fillStyle = "#facc15"; ctx.font = "bold 12px 'Outfit', sans-serif";
        ctx.fillText("Wood Block", woodX + 3, woodY + 26);
        drawForceArrow(ctx, woodX + 32, woodY + 55, woodX + 32, woodY - 25, "Upward Fb = ρVg", "#00f0ff");

        const ballX = viewWidth * 0.65;
        const ballY = Math.min(groundY + 70, waterTopY + 20 + (t % 15) * 25);
        applyInk(ctx, "#09090b", "#475569", 4);
        ctx.beginPath(); ctx.arc(ballX, ballY, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 11px 'Outfit', sans-serif";
        ctx.fillText("50kg Lead", ballX - 22, ballY + 4);
        drawForceArrow(ctx, ballX, ballY - 30, ballX, ballY + 35, "Weight W > Fb", "#ef4444");

        if (t < 10.0) {
            const swimX = viewWidth * 0.15 + (t * 25);
            const swimY = waterTopY + 50 + Math.sin(t * 4) * 15;
            drawGOne2D(ctx, swimX, swimY, 1.0, "swim", t);
            drawRaOne2D(ctx, viewWidth * 0.82, groundY - 140, 1.0, "push", t);
        } else if (t < 20.0) {
            const swimY = Math.min(groundY + 30, waterTopY + 40 + (t - 10.0) * 18);
            drawGOne2D(ctx, ballX - 45, swimY, 1.0, "swim", t);
            drawRaOne2D(ctx, viewWidth * 0.85, groundY - 120, 1.0, "shock", t);
        } else {
            drawGOne2D(ctx, woodX + 30, woodY - 60, 1.0, "snorkel", t);
            const floatRaY = waterTopY + 20 + Math.sin(t * 3 + 1) * 8;
            drawRaOne2D(ctx, viewWidth * 0.78, floatRaY, 0.95, "shock", t);
            applyInk(ctx, "#facc15", "#ea580c", 3);
            ctx.beginPath(); ctx.ellipse(viewWidth * 0.78, floatRaY + 50, 35, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
    }

    // 14. SIMPLE PENDULUM & SHM
    else if (currentTopicKey === "pendulum") {
        const pLen = 140;
        const pAng = Math.sin(t * 3.5) * 0.65;
        const bobX = viewWidth * 0.5 + Math.sin(pAng) * pLen;
        const bobY = 80 + Math.cos(pAng) * pLen;
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(viewWidth * 0.5, 80); ctx.lineTo(bobX, bobY); ctx.stroke();
        applyInk(ctx, "#facc15", "#05050a", 4);
        ctx.beginPath(); ctx.arc(bobX, bobY, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        drawForceArrow(ctx, bobX, bobY, bobX + Math.sin(pAng) * 45, bobY, "Restoring Force", "#00f0ff");
        drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "flex", t);
        drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, t > 10.0 ? "shock" : "idle", t);
    }

    // 15. PASCAL'S LAW & HYDRAULICS
    else if (currentTopicKey === "pascal") {
        const p1X = viewWidth * 0.25;
        const p2X = viewWidth * 0.68;
        const baseFloorY = groundY + 80;

        if (t < 10.0) {
            const pumpY = Math.sin(t * 6) * 10;
            const p1PistonY = groundY + 15 + pumpY;
            const p2PistonY = groundY - 10;

            drawHydraulicApparatus(ctx, p1X, p2X, p1PistonY, p2PistonY, baseFloorY, t, 0.4);
            drawHydraulicTruck(ctx, p2X, p2PistonY - 45, 0);

            // G.One actively pumping on small piston
            drawGOne2D(ctx, p1X - 25, p1PistonY - 60, 1.0, "push", t);
            drawForceArrow(ctx, p1X - 25, p1PistonY - 115, p1X - 25, p1PistonY - 55, "Small Force F1 = 200 N", "#ef4444");

            // Ra.One lounging on truck roof
            drawRaOne2D(ctx, p2X, p2PistonY - 150, 0.95, "laugh", t);
            drawForceArrow(ctx, p2X, p2PistonY - 30, p2X, p2PistonY - 70, "Piston A2 (Waiting)", "#38bdf8");
        } else if (t < 20.0) {
            const pumpProg = (t - 10.0) / 10.0;
            const pumpY = Math.sin(t * 14) * 14;
            const p1PistonY = groundY + 30 + pumpY;
            const liftHeight = pumpProg * 140;
            const p2PistonY = groundY - 10 - liftHeight;

            drawHydraulicApparatus(ctx, p1X, p2X, p1PistonY, p2PistonY, baseFloorY, t, 1.0);
            drawHydraulicTruck(ctx, p2X, p2PistonY - 45, Math.sin(t * 6) * 0.04);

            // G.One rapid pumping action
            drawGOne2D(ctx, p1X - 25, p1PistonY - 60, 1.0, "push", t);
            drawForceArrow(ctx, p1X - 25, p1PistonY - 120, p1X - 25, p1PistonY - 55, "P = F1/A1 = 100 kPa", "#facc15");

            // Ra.One teetering and panicking on elevating truck
            const raTilt = Math.sin(t * 8) * 0.25;
            ctx.save();
            ctx.translate(p2X + 15, p2PistonY - 150);
            ctx.rotate(raTilt);
            drawRaOne2D(ctx, 0, 0, 0.95, "shock", t);
            ctx.restore();

            drawForceArrow(ctx, p2X, p2PistonY + 40, p2X, p2PistonY - 80, "HUGE LIFT F2 = 2000 N (10x!)", "#00f0ff");

            if (!dialogueTriggered["pasc_hum"] && t > 12.0) {
                dialogueTriggered["pasc_hum"] = true;
                sounds.playHum();
            }
        } else {
            const maxLiftPistonY = groundY - 150;
            drawHydraulicApparatus(ctx, p1X, p2X, groundY + 40, maxLiftPistonY, baseFloorY, t, 0.8);
            drawHydraulicTruck(ctx, p2X, maxLiftPistonY - 45, 0);

            // G.One victory jumping & flexing on ground
            const jumpY = Math.abs(Math.sin((t - 20) * 4)) * 30;
            drawGOne2D(ctx, viewWidth * 0.28, groundY - jumpY, 1.1, "flex", t);

            // Ra.One dangling comically from truck bumper in mid-air
            drawRaOne2D(ctx, p2X + 75, maxLiftPistonY + 15, 0.95, "spin", t);

            drawForceArrow(ctx, p2X, maxLiftPistonY + 60, p2X, maxLiftPistonY - 90, "Pascal Equilibrium P1 = P2", "#facc15");
        }
    }

    // 16. THERMAL & HEAT TRANSFER
    else if (currentTopicKey === "thermal") {
        const flameX = viewWidth * 0.26;
        const rodX1 = viewWidth * 0.28;
        const rodX2 = viewWidth * 0.72;
        const rodY = groundY + 15;
        const bucketX = viewWidth * 0.82;

        if (t < 10.0) {
            drawThermalLabApparatus(ctx, flameX, rodX1, rodX2, rodY, 0.25, t);
            drawIceWaterBucket(ctx, bucketX, groundY + 50, false, t);

            // G.One carefully adjusting Bunsen burner flame
            drawGOne2D(ctx, viewWidth * 0.18, groundY, 1.05, "push", t);
            drawForceArrow(ctx, flameX, rodY - 30, rodX1 + 40, rodY - 30, "Bunsen Flame T1 = 500°C", "#f97316");

            // Ra.One confidently gripping the cold metal rod
            drawRaOne2D(ctx, rodX2 + 20, groundY, 1.05, "laugh", t);
            drawForceArrow(ctx, rodX2, rodY - 20, rodX2 + 30, rodY - 20, "Cold Rod T2 = 25°C", "#38bdf8");
        } else if (t < 20.0) {
            const heatProg = 0.25 + ((t - 10.0) / 10.0) * 0.75;
            drawThermalLabApparatus(ctx, flameX, rodX1, rodX2, rodY, heatProg, t);
            drawIceWaterBucket(ctx, bucketX, groundY + 50, false, t);

            // G.One measuring thermal conduction with sensor wand
            drawGOne2D(ctx, viewWidth * 0.18, groundY, 1.05, "laser", t);
            drawForceArrow(ctx, rodX1 + 40, rodY - 25, rodX2 - 20, rodY - 25, "Heat Conduction Q = mcΔT ➔", "#facc15");

            // Ra.One doing frantic "hot potato" burn dance with hopping feet
            const hopY = Math.abs(Math.sin(t * 14)) * 38;
            const raX = rodX2 + 25 + Math.sin(t * 8) * 15;
            drawRaOne2D(ctx, raX, groundY - hopY, 1.05, "shock", t);

            // Smoke and red burn glow on Ra.One's hands
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            for (let i = 0; i < 4; i++) {
                const smkX = raX - 10 + i * 8 + Math.sin(t * 10 + i) * 6;
                const smkY = groundY - hopY - 20 - ((t * 40 + i * 20) % 50);
                ctx.beginPath(); ctx.arc(smkX, smkY, 5 + (i % 3), 0, Math.PI * 2); ctx.fill();
            }

            drawForceArrow(ctx, raX, groundY - hopY - 50, raX, groundY - hopY - 100, "OUCH! Scorching Hot T = 350°C!", "#ef4444");

            if (!dialogueTriggered["therm_zap"] && t > 12.0) {
                dialogueTriggered["therm_zap"] = true;
                sounds.playZap();
            }
        } else {
            drawThermalLabApparatus(ctx, flameX, rodX1, rodX2, rodY, 0.95, t);
            drawIceWaterBucket(ctx, bucketX, groundY + 50, true, t);

            // G.One superhero victory flex on left
            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "flex", t);

            // Ra.One comically headfirst in the ice-water bucket, legs kicking
            const kickAng = Math.sin(t * 10) * 0.25;
            ctx.save();
            ctx.translate(bucketX, groundY - 10);
            ctx.rotate(Math.PI + kickAng);
            drawRaOne2D(ctx, 0, 0, 0.9, "shock", t);
            ctx.restore();

            drawForceArrow(ctx, viewWidth * 0.4, groundY - 60, bucketX - 40, groundY - 60, "Thermal Equilibrium Reached!", "#38bdf8");
        }
    }

    // 17. WAVE INTERFERENCE & DOUBLE SLIT
    else if (currentTopicKey === "interference") {
        const slit1Y = groundY - 80;
        const slit2Y = groundY + 20;
        const barrierX = viewWidth * 0.42;

        for (let r = 20; r <= 180; r += 32) {
            const wavePhase = (r + (t * 40)) % 180;
            ctx.strokeStyle = "rgba(56, 189, 248, 0.5)"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(barrierX, slit1Y, wavePhase, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
            ctx.beginPath(); ctx.arc(barrierX, slit2Y, wavePhase, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
        }

        const screenX = viewWidth * 0.85;
        for (let y = groundY - 140; y <= groundY + 80; y += 30) {
            const isConstructive = Math.floor((y + t * 10) / 30) % 2 === 0;
            ctx.fillStyle = isConstructive ? "#38bdf8" : "#020617";
            ctx.fillRect(screenX, y, 14, 25);
            if (isConstructive) {
                ctx.fillStyle = "#38bdf8"; ctx.font = "bold 10px sans-serif";
                ctx.fillText("Max", screenX + 18, y + 16);
            }
        }

        drawForceArrow(ctx, viewWidth * 0.15, groundY - 30, barrierX - 20, groundY - 30, "Coherent Waves", "#38bdf8");

        if (t < 10.0) {
            drawGOne2D(ctx, viewWidth * 0.18, groundY, 1.1, "push", t);
            drawRaOne2D(ctx, viewWidth * 0.72, groundY, 1.1, "run", t);
        } else if (t < 20.0) {
            const wandX = barrierX + 60 + (t - 10.0) * 15;
            drawGOne2D(ctx, wandX, groundY, 1.1, "laser", t);
            drawRaOne2D(ctx, viewWidth * 0.76, groundY, 1.1, "shock", t);
        } else {
            const stepX = viewWidth * 0.68 + Math.sin(t * 3) * 30;
            drawGOne2D(ctx, viewWidth * 0.25, groundY, 1.1, "flex", t);
            drawRaOne2D(ctx, stepX, groundY, 1.1, "run", t);
        }
    }

    // 18. NUCLEAR ENERGY (E = mc²)
    else if (currentTopicKey === "nuclear") {
        const coreX = viewWidth * 0.5;
        const coreY = groundY - 45;
        const gunX = viewWidth * 0.15;

        if (t < 10.0) {
            const neutronProg = Math.min(t / 10.0, 1.0);
            const nX = gunX + 60 + neutronProg * (coreX - gunX - 85);
            const nY = coreY;

            drawNuclearReactorApparatus(ctx, coreX, coreY, "charge", t, nX, nY);

            // G.One operating particle accelerator gun
            drawGOne2D(ctx, gunX - 10, groundY, 1.05, "laser", t);
            drawForceArrow(ctx, gunX + 40, coreY - 25, nX + 20, coreY - 25, "Neutron Trigger n⁰ ➔", "#00f0ff");

            // Ra.One scoffing near reactor
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.05, "laugh", t);
            drawForceArrow(ctx, viewWidth * 0.8, groundY - 30, viewWidth * 0.8, groundY - 70, "Mass Target (²³⁵U)", "#facc15");
        } else if (t < 20.0) {
            const fissionTime = t - 10.0;
            drawNuclearReactorApparatus(ctx, coreX, coreY, "fission", t, 0, 0, fissionTime);

            // G.One holding magnetic containment shield
            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "flex", t);

            // Ra.One blasted backwards in mid-air, spinning uncontrollably
            const raX = viewWidth * 0.62 + fissionTime * 18;
            const raY = groundY - 60 + Math.sin(t * 6) * 35;
            drawRaOne2D(ctx, raX, raY, 1.0, "spin", t);

            drawForceArrow(ctx, coreX, coreY - 60, coreX, coreY - 120, "COLOSSAL BLAST E = Δm·c² (200 MeV)!", "#facc15");

            if (!dialogueTriggered["nuc_zap"] && t > 12.0) {
                dialogueTriggered["nuc_zap"] = true;
                sounds.playZap();
            }
        } else {
            drawNuclearReactorApparatus(ctx, coreX, coreY, "stable", t);

            // G.One superhero rocket hover victory on left
            const hoverY = Math.sin(t * 4) * 15;
            drawGOne2D(ctx, viewWidth * 0.22, groundY - 35 + hoverY, 1.1, "rocket", t);

            // Ra.One comically melted into puddle on right
            drawRaOne2D(ctx, viewWidth * 0.82, groundY, 1.1, "puddle", t);

            drawForceArrow(ctx, viewWidth * 0.35, groundY - 70, coreX + 60, groundY - 70, "E = mc² Fusion Torus Mastered!", "#00f0ff");
        }
    }

    else {
        drawGOne2D(ctx, viewWidth * 0.3, groundY, 1.1, "flex", t);
        drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, t > 15 ? "puddle" : "idle", t);
    }
}

// Helper Object Renderers with Cel-Shaded Highlights
function drawSteelCrate(ctx, x, y, label, sub) {
    ctx.save();
    ctx.translate(x, y);
    applyInk(ctx, "#334155", "#05050a", 5);
    ctx.beginPath(); ctx.rect(-60, -60, 120, 120); ctx.fill(); ctx.stroke();
    // Warning Hazard Stripes
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-55, -55, 110, 15);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 18px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText(label, 0, 5);
    if (sub) {
        ctx.fillStyle = "#38bdf8"; ctx.font = "13px 'Inter', sans-serif";
        ctx.fillText(sub, 0, 30);
    }
    ctx.restore();
}

function drawIronSafe(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    applyInk(ctx, "#1e293b", "#05050a", 5);
    ctx.beginPath(); ctx.rect(-50, -50, 100, 100); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#facc15";
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 14px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("1000 KG", 0, 38);
    ctx.restore();
}

function drawAnvil(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    applyInk(ctx, "#09090b", "#05050a", 4);
    ctx.beginPath();
    ctx.moveTo(-35, -20); ctx.lineTo(35, -20); ctx.lineTo(25, 0); ctx.lineTo(35, 20); ctx.lineTo(-35, 20); ctx.lineTo(-25, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("50 KG", 0, 5);
    ctx.restore();
}

function drawPlasmaClash(ctx, fromX, toX, y, t) {
    ctx.save();
    const midX = (fromX + toX) / 2;
    ctx.strokeStyle = "#00f0ff"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(fromX, y); ctx.lineTo(midX, y); ctx.stroke();
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath(); ctx.moveTo(toX, y); ctx.lineTo(midX, y); ctx.stroke();
    const pulse = 22 + Math.sin(t * 20) * 8;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#facc15"; ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.arc(midX, y, pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

function drawElectricCircuit(ctx, groundY, t, switchClosed) {
    ctx.save();
    applyInk(ctx, "#1e293b", "#00f0ff", 3);
    ctx.fillRect(viewWidth * 0.15, groundY - 20, 60, 40);
    ctx.fillStyle = "#facc15"; ctx.font = "bold 12px 'Outfit', sans-serif";
    ctx.fillText("+ 12V -", viewWidth * 0.16, groundY + 5);

    ctx.strokeStyle = switchClosed ? "#facc15" : "#475569"; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(viewWidth * 0.21, groundY);
    ctx.lineTo(viewWidth * 0.5, groundY);
    ctx.lineTo(viewWidth * 0.5, groundY - 60);
    ctx.lineTo(viewWidth * 0.8, groundY - 60);
    ctx.lineTo(viewWidth * 0.8, groundY);
    ctx.stroke();

    applyInk(ctx, "#b45309", "#05050a", 3);
    ctx.beginPath();
    if (switchClosed) {
        ctx.moveTo(viewWidth * 0.45, groundY); ctx.lineTo(viewWidth * 0.55, groundY);
    } else {
        ctx.moveTo(viewWidth * 0.45, groundY); ctx.lineTo(viewWidth * 0.52, groundY - 30);
    }
    ctx.stroke();

    applyInk(ctx, switchClosed ? "#fef08a" : "#334155", "#05050a", 3);
    ctx.beginPath(); ctx.arc(viewWidth * 0.65, groundY - 60, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (switchClosed) {
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const sang = (i * Math.PI * 2) / 8;
            ctx.beginPath();
            ctx.moveTo(viewWidth * 0.65 + Math.cos(sang) * 22, groundY - 60 + Math.sin(sang) * 22);
            ctx.lineTo(viewWidth * 0.65 + Math.cos(sang) * 32, groundY - 60 + Math.sin(sang) * 32);
            ctx.stroke();
        }
    }

    if (switchClosed) {
        for (let i = 0; i < 8; i++) {
            const ex = (viewWidth * 0.21) + ((t * 120 + i * 50) % (viewWidth * 0.59));
            ctx.fillStyle = "#00f0ff";
            ctx.beginPath(); ctx.arc(ex, groundY, 4, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.restore();
}

function drawHorseshoeMagnet(ctx, x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    applyInk(ctx, "#ef4444", "#05050a", 3);
    ctx.beginPath(); ctx.rect(-30, -30, 20, 50); ctx.fill(); ctx.stroke();
    applyInk(ctx, "#3b82f6", "#05050a", 3);
    ctx.beginPath(); ctx.rect(10, -30, 20, 50); ctx.fill(); ctx.stroke();
    applyInk(ctx, "#475569", "#05050a", 3);
    ctx.beginPath(); ctx.arc(0, -30, 30, Math.PI, 0); ctx.stroke();
    ctx.restore();
}

function drawHydraulicApparatus(ctx, p1X, p2X, p1Y, p2Y, baseY, t, pressureIntensity) {
    ctx.save();

    // Connecting Hydraulic Pipe at bottom
    const pipeY = baseY - 25;
    const pipeH = 35;
    applyInk(ctx, "#1e293b", "#05050a", 4);
    ctx.fillRect(p1X - 30, pipeY, (p2X - p1X) + 110, pipeH);
    ctx.strokeRect(p1X - 30, pipeY, (p2X - p1X) + 110, pipeH);

    // Glowing Hydraulic Oil Fluid
    const fluidGrad = ctx.createLinearGradient(0, pipeY, 0, pipeY + pipeH);
    fluidGrad.addColorStop(0, "#00f0ff");
    fluidGrad.addColorStop(0.5, "#0284c7");
    fluidGrad.addColorStop(1, "#0369a1");
    ctx.fillStyle = fluidGrad;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 15 * pressureIntensity;
    ctx.fillRect(p1X - 25, pipeY + 4, (p2X - p1X) + 100, pipeH - 8);

    // Animated Pressure Packets Flowing
    for (let i = 0; i < 6; i++) {
        const px = (p1X - 15) + ((t * 110 * pressureIntensity + i * 85) % ((p2X - p1X) + 80));
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, pipeY + pipeH / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Small Cylinder A1 (Left)
    applyInk(ctx, "#334155", "#05050a", 4);
    ctx.fillRect(p1X - 28, p1Y, 56, baseY - p1Y);
    ctx.strokeRect(p1X - 28, p1Y, 56, baseY - p1Y);

    // Small Piston Head & Handle Shaft
    applyInk(ctx, "#64748b", "#05050a", 3);
    ctx.fillRect(p1X - 8, p1Y - 45, 16, 50);
    applyInk(ctx, "#facc15", "#05050a", 3);
    ctx.beginPath(); ctx.roundRect(p1X - 32, p1Y - 55, 64, 14, 4); ctx.fill(); ctx.stroke();

    // Large Cylinder A2 (Right)
    applyInk(ctx, "#334155", "#05050a", 5);
    ctx.fillRect(p2X - 70, p2Y, 140, baseY - p2Y);
    ctx.strokeRect(p2X - 70, p2Y, 140, baseY - p2Y);

    // Large Piston Shaft
    applyInk(ctx, "#475569", "#05050a", 4);
    ctx.fillRect(p2X - 25, p2Y - 35, 50, 40);

    // Lifting Steel Platform
    applyInk(ctx, "#e2e8f0", "#05050a", 4);
    ctx.beginPath(); ctx.roundRect(p2X - 85, p2Y - 45, 170, 14, 4); ctx.fill(); ctx.stroke();

    // Digital Pressure Gauge in Center
    const midX = (p1X + p2X) / 2;
    const midY = pipeY - 20;
    applyInk(ctx, "#0f172a", "#00f0ff", 3);
    ctx.beginPath(); ctx.arc(midX, midY, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 10px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("100 kPa", midX, midY - 6);
    // Gauge Needle
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5;
    const needleAng = (pressureIntensity * Math.PI * 0.8) - Math.PI * 0.9;
    ctx.beginPath(); ctx.moveTo(midX, midY + 4); ctx.lineTo(midX + Math.cos(needleAng) * 16, midY + 4 + Math.sin(needleAng) * 16); ctx.stroke();

    ctx.restore();
}

function drawHydraulicTruck(ctx, x, y, tilt = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    // Truck Body
    applyInk(ctx, "#0284c7", "#05050a", 4);
    ctx.beginPath();
    ctx.roundRect(-75, -55, 150, 48, 6);
    ctx.fill(); ctx.stroke();

    // Cab / Windows
    applyInk(ctx, "#38bdf8", "#05050a", 3);
    ctx.beginPath();
    ctx.roundRect(-70, -50, 50, 24, 4);
    ctx.fill(); ctx.stroke();
    applyInk(ctx, "#bae6fd", "#05050a", 2);
    ctx.beginPath();
    ctx.roundRect(-15, -50, 40, 24, 4);
    ctx.fill(); ctx.stroke();

    // Yellow Hazard Stripe on Truck Bed
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-70, -22, 140, 6);

    // 2000 KG Label on Door
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("2000 KG", 15, -32);

    // Wheels
    const drawWheel = (wx) => {
        applyInk(ctx, "#09090b", "#05050a", 3);
        ctx.beginPath(); ctx.arc(wx, 0, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        applyInk(ctx, "#94a3b8", "#05050a", 2);
        ctx.beginPath(); ctx.arc(wx, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    };
    drawWheel(-50);
    drawWheel(50);

    // Headlight Beam
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.arc(-74, -28, 5, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
}

function drawThermalLabApparatus(ctx, flameX, rodX1, rodX2, rodY, heatProg, t) {
    ctx.save();

    // Lab Table Surface
    applyInk(ctx, "#1e293b", "#05050a", 4);
    ctx.fillRect(flameX - 45, rodY + 25, (rodX2 - flameX) + 90, 20);
    ctx.strokeRect(flameX - 45, rodY + 25, (rodX2 - flameX) + 90, 20);

    // Bunsen Burner Base & Stand (Left)
    applyInk(ctx, "#334155", "#05050a", 3);
    ctx.beginPath();
    ctx.roundRect(flameX - 22, rodY + 12, 44, 14, 3);
    ctx.rect(flameX - 6, rodY - 15, 12, 28);
    ctx.fill(); ctx.stroke();

    // Multi-tier Animated Bunsen Flame
    const flmH = 32 + Math.sin(t * 22) * 6;
    // Outer Flame (Orange/Red)
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#f97316"; ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(flameX - 14, rodY - 15);
    ctx.quadraticCurveTo(flameX - 16, rodY - 15 - flmH * 0.7, flameX, rodY - 15 - flmH);
    ctx.quadraticCurveTo(flameX + 16, rodY - 15 - flmH * 0.7, flameX + 14, rodY - 15);
    ctx.closePath(); ctx.fill();

    // Inner Flame Core (Cyan/Yellow)
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.moveTo(flameX - 7, rodY - 15);
    ctx.quadraticCurveTo(flameX - 8, rodY - 15 - flmH * 0.5, flameX, rodY - 15 - flmH * 0.7);
    ctx.quadraticCurveTo(flameX + 8, rodY - 15 - flmH * 0.5, flameX + 7, rodY - 15);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;

    // Sparks from Flame
    for (let i = 0; i < 3; i++) {
        const spkX = flameX - 8 + Math.sin(t * 15 + i * 2) * 16;
        const spkY = rodY - 25 - ((t * 60 + i * 25) % 40);
        ctx.fillStyle = "#fde047";
        ctx.beginPath(); ctx.arc(spkX, spkY, 2.5, 0, Math.PI * 2); ctx.fill();
    }

    // Boiling Erlenmeyer Flask above Flame
    const flaskX = flameX;
    const flaskY = rodY - 55;
    applyInk(ctx, "rgba(255, 255, 255, 0.2)", "#38bdf8", 2.5);
    ctx.beginPath();
    ctx.moveTo(flaskX - 6, flaskY - 25); ctx.lineTo(flaskX + 6, flaskY - 25);
    ctx.lineTo(flaskX + 6, flaskY - 10); ctx.lineTo(flaskX + 22, flaskY + 18);
    ctx.lineTo(flaskX - 22, flaskY + 18); ctx.lineTo(flaskX - 6, flaskY - 10);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Bubbling Liquid in Flask
    ctx.fillStyle = "rgba(249, 115, 22, 0.65)";
    ctx.beginPath();
    ctx.moveTo(flaskX - 18, flaskY + 6); ctx.lineTo(flaskX + 18, flaskY + 6);
    ctx.lineTo(flaskX + 22, flaskY + 18); ctx.lineTo(flaskX - 22, flaskY + 18);
    ctx.closePath(); ctx.fill();

    // Swirling Steam Convection Clouds
    for (let i = 0; i < 3; i++) {
        const stmX = flaskX + Math.sin(t * 4 + i) * 12;
        const stmY = flaskY - 35 - ((t * 35 + i * 25) % 55);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath(); ctx.arc(stmX, stmY, 6 + i * 3, 0, Math.PI * 2); ctx.fill();
    }

    // Solid Metal Conduction Rod with Dynamic Heat Gradient
    const rodW = rodX2 - rodX1;
    const rodH = 14;
    const rodGrad = ctx.createLinearGradient(rodX1, 0, rodX1 + rodW, 0);

    const prog = Math.min(Math.max(heatProg, 0), 1);
    rodGrad.addColorStop(0, "#ffffff"); // White-hot
    rodGrad.addColorStop(Math.min(prog * 0.3, 0.3), "#facc15"); // Yellow
    rodGrad.addColorStop(Math.min(prog * 0.6, 0.6), "#f97316"); // Orange
    rodGrad.addColorStop(Math.min(prog, 0.99), "#dc2626"); // Red
    rodGrad.addColorStop(Math.min(prog + 0.01, 1), "#64748b"); // Cold Steel
    rodGrad.addColorStop(1, "#475569");

    applyInk(ctx, rodGrad, "#05050a", 3);
    ctx.shadowColor = "#f97316"; ctx.shadowBlur = 15 * prog;
    ctx.beginPath(); ctx.roundRect(rodX1, rodY - rodH / 2, rodW, rodH, 4); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;

    // Digital Temperature Readout on Stand
    applyInk(ctx, "#090d1f", "#f97316", 2);
    ctx.fillRect(flameX + 60, rodY + 30, 85, 22);
    ctx.fillStyle = "#facc15"; ctx.font = "bold 11px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`T = ${Math.round(50 + prog * 300)}°C`, flameX + 102, rodY + 45);

    ctx.restore();
}

function drawIceWaterBucket(ctx, x, y, isDunked, t) {
    ctx.save();
    ctx.translate(x, y);

    // Metal Bucket Tub
    applyInk(ctx, "#64748b", "#05050a", 4);
    ctx.beginPath();
    ctx.moveTo(-45, -35); ctx.lineTo(45, -35);
    ctx.lineTo(35, 20); ctx.lineTo(-35, 20);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Ice Water
    ctx.fillStyle = "rgba(14, 165, 233, 0.85)";
    ctx.fillRect(-38, -30, 76, 45);

    // Floating Ice Cubes
    ctx.fillStyle = "rgba(224, 242, 254, 0.9)";
    ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 1.5;
    const drawCube = (cx, cy) => {
        ctx.fillRect(cx - 7, cy - 7, 14, 14);
        ctx.strokeRect(cx - 7, cy - 7, 14, 14);
    };
    drawCube(-20, -25);
    drawCube(12, -28);
    drawCube(-4, -18);

    // Water Splash / Steam Sizzle if Dunked
    if (isDunked) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        for (let i = 0; i < 5; i++) {
            const spX = -25 + i * 12 + Math.sin(t * 12 + i) * 6;
            const spY = -45 - ((t * 40 + i * 15) % 35);
            ctx.beginPath(); ctx.arc(spX, spY, 5 + (i % 3), 0, Math.PI * 2); ctx.fill();
        }
    }

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 11px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("0°C ICE DUNK", 0, 36);

    ctx.restore();
}

function drawNuclearReactorApparatus(ctx, coreX, coreY, phase, t, nX = 0, nY = 0, fissionTime = 0) {
    ctx.save();

    // Quantum Reactor Base Pedestal
    applyInk(ctx, "#18181b", "#facc15", 3);
    ctx.beginPath();
    ctx.roundRect(coreX - 70, coreY + 45, 140, 24, 4);
    ctx.fill(); ctx.stroke();

    // Tokamak Magnetic Field Rings
    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
        const ringAng = t * 1.5 + (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.ellipse(coreX, coreY, 95, 38, ringAng, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Particle Accelerator Gun on Left
    const gunX = viewWidth * 0.15;
    applyInk(ctx, "#1e293b", "#00f0ff", 3);
    ctx.beginPath();
    ctx.roundRect(gunX - 25, coreY - 14, 60, 28, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath(); ctx.arc(gunX + 35, coreY, 7, 0, Math.PI * 2); ctx.fill();

    if (phase === "charge") {
        // Incoming Accelerated Neutron Trigger Particle
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f0ff"; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.arc(nX, nY, 6, 0, Math.PI * 2); ctx.fill();
        // Cyan Ion Wake Trail
        ctx.strokeStyle = "rgba(0, 240, 255, 0.7)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gunX + 35, coreY); ctx.lineTo(nX, nY); ctx.stroke();
        ctx.shadowBlur = 0;

        // Uranium-235 Nucleus Cluster (Red Protons & Gold Neutrons)
        ctx.save();
        ctx.translate(coreX, coreY);
        const vib = Math.sin(t * 25) * 2;
        ctx.shadowColor = "#facc15"; ctx.shadowBlur = 20;
        for (let i = 0; i < 9; i++) {
            const ang = (i * Math.PI * 2) / 9 + t * 2;
            const rad = 14 + (i % 2) * 8;
            const px = Math.cos(ang) * rad + vib;
            const py = Math.sin(ang) * rad + vib;
            ctx.fillStyle = (i % 2 === 0) ? "#ef4444" : "#facc15";
            ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    } else if (phase === "fission") {
        // Colossal Fission Plasma Starburst & Expanding Shockwaves
        const blastR = (fissionTime * 35) % 160;
        ctx.strokeStyle = "rgba(250, 204, 21, 0.85)"; ctx.lineWidth = 4;
        ctx.shadowColor = "#facc15"; ctx.shadowBlur = 30;
        ctx.beginPath(); ctx.arc(coreX, coreY, blastR, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.65)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(coreX, coreY, Math.max(0, blastR - 30), 0, Math.PI * 2); ctx.stroke();

        // 2 Fission Fragments flying apart (Ba-141 & Kr-92)
        const fragDist = fissionTime * 22;
        // Fragment 1 (Barium)
        applyInk(ctx, "#ef4444", "#ffffff", 2);
        ctx.beginPath(); ctx.arc(coreX - 25 - fragDist, coreY - 20 - fragDist * 0.4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 9px sans-serif"; ctx.fillText("¹⁴¹Ba", coreX - 35 - fragDist, coreY - 22 - fragDist * 0.4);

        // Fragment 2 (Krypton)
        applyInk(ctx, "#3b82f6", "#ffffff", 2);
        ctx.beginPath(); ctx.arc(coreX + 25 + fragDist, coreY + 20 + fragDist * 0.4, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 9px sans-serif"; ctx.fillText("⁹²Kr", coreX + 18 + fragDist, coreY + 22 + fragDist * 0.4);

        // 3 Secondary Fast Neutrons flying outward
        for (let i = 0; i < 3; i++) {
            const nang = (i * Math.PI * 2) / 3 + fissionTime * 4;
            const nrad = 30 + fissionTime * 45;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath(); ctx.arc(coreX + Math.cos(nang) * nrad, coreY + Math.sin(nang) * nrad, 4.5, 0, Math.PI * 2); ctx.fill();
        }
    } else {
        // Stable Tokamak Fusion Torus with Orbiting Electrons
        const pulse = 1.0 + Math.sin(t * 8) * 0.15;
        const torusGrad = ctx.createRadialGradient(coreX, coreY, 10, coreX, coreY, 55 * pulse);
        torusGrad.addColorStop(0, "#ffffff");
        torusGrad.addColorStop(0.4, "#facc15");
        torusGrad.addColorStop(0.8, "#00f0ff");
        torusGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = torusGrad;
        ctx.beginPath(); ctx.arc(coreX, coreY, 55 * pulse, 0, Math.PI * 2); ctx.fill();

        // Orbiting Electron Particles
        for (let i = 0; i < 4; i++) {
            const eang = t * 5 + (i * Math.PI) / 2;
            ctx.fillStyle = "#00f0ff";
            ctx.beginPath(); ctx.arc(coreX + Math.cos(eang) * 65, coreY + Math.sin(eang) * 28, 4, 0, Math.PI * 2); ctx.fill();
        }
    }

    ctx.restore();
}

// ==========================================================================
// 8. REAL-TIME TEACHER AUDIO STREAM PIPELINE
// ==========================================================================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

const micToggleBtn = document.getElementById("micToggleBtn");
const micPulseWrapper = document.querySelector(".pulse-ring-wrapper");
const micLiveBadge = document.getElementById("micLiveBadge");
const liveTranscriptText = document.getElementById("liveTranscriptText");

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

// ==========================================================================
// 9. 1-CLICK HD VIDEO EXPORT (30s)
// ==========================================================================

let mediaRecorder = null;
let recordedChunks = [];
const recordVideoBtn = document.getElementById("recordVideoBtn");
const exportModal = document.getElementById("exportModal");
const closeExportModal = document.getElementById("closeExportModal");
const cancelExportBtn = document.getElementById("cancelExportBtn");
const downloadVideoLink = document.getElementById("downloadVideoLink");
const exportProgressBar = document.getElementById("exportProgressBar");
const exportStatusText = document.getElementById("exportStatusText");

function startVideoExport() {
    const welcomeHero = document.getElementById("welcome-hero-banner");
    if (welcomeHero) welcomeHero.classList.add("hidden");
    isWelcomeMode = false;
    isIdleState = false;
    isPlaying = true;

    exportModal.classList.remove("hidden");
    downloadVideoLink.classList.add("hidden");
    exportProgressBar.style.width = "0%";
    exportStatusText.textContent = "Recording 1080p 30-Second 2D Stream...";

    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    dialogueTriggered = {};

    recordedChunks = [];
    const canvasStream = canvas.captureStream(60);
    const audioStream = sounds.getStream();
    const tracks = [...canvasStream.getVideoTracks()];
    if (audioStream && audioStream.getAudioTracks().length > 0) tracks.push(...audioStream.getAudioTracks());

    const combinedStream = new MediaStream(tracks);
    const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? 'video/webm; codecs=vp9' : 'video/webm';
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 6000000 });

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        downloadVideoLink.href = URL.createObjectURL(blob);
        downloadVideoLink.classList.remove("hidden");
        exportStatusText.textContent = "✅ 30s 2D Physics Video Ready!";
        exportProgressBar.style.width = "100%";
    };

    updateTimeline(0);
    playStoryboard();
    mediaRecorder.start();

    let exportTime = 0;
    const interval = setInterval(() => {
        exportTime += 0.5;
        exportProgressBar.style.width = `${Math.min((exportTime / TOPIC_DURATION) * 100, 100)}%`;
        if (exportTime >= TOPIC_DURATION) {
            clearInterval(interval);
            if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
        }
    }, 500);
}

// ==========================================================================
// 10. INTERACTIVE 18-TOPIC PHYSICS QUIZ SYSTEM (1-2 Qs)
// ==========================================================================

const QUIZ_DATA = {
    inertia: [
        {
            q: "What is Newton's First Law also commonly known as?",
            options: ["Law of Universal Gravitation", "Law of Inertia", "Law of Acceleration", "Law of Action & Reaction"],
            correct: 1,
            exp: "Newton's 1st Law is known as the Law of Inertia: objects resist changes in their state of motion unless acted upon by a net external force."
        },
        {
            q: "If the net external force on a moving object is zero (ΣF = 0), what happens to its velocity?",
            options: ["It accelerates rapidly", "It stops instantly", "It continues at constant velocity", "It reverses direction"],
            correct: 2,
            exp: "With zero net force, acceleration is zero, so velocity remains perfectly constant in magnitude and direction."
        }
    ],
    fma: [
        {
            q: "According to Newton's Second Law (F = ma), if force is kept constant while mass increases, acceleration will:",
            options: ["Increase proportionally", "Decrease", "Remain unchanged", "Drop to zero instantly"],
            correct: 1,
            exp: "Acceleration is inversely proportional to mass (a = F / m), so a larger mass accelerates more slowly under the same force."
        },
        {
            q: "A net force of 500 N is applied to a 20 kg mass. What is its acceleration?",
            options: ["10 m/s²", "25 m/s²", "50 m/s²", "100 m/s²"],
            correct: 1,
            exp: "Using a = F / m: a = 500 N / 20 kg = 25 m/s²."
        }
    ],
    action: [
        {
            q: "When G.One fires a cyan plasma blast forward, what direction is the reaction recoil force?",
            options: ["Upward", "Forward in the same direction", "Backward with equal magnitude", "Perpendicular to the blast"],
            correct: 2,
            exp: "Newton's Third Law: For every action, there is an equal and opposite reaction (F_action = -F_reaction)."
        },
        {
            q: "Action and reaction force pairs always act on:",
            options: ["The same single object", "Two different objects", "Only objects in vacuums", "Only moving objects"],
            correct: 1,
            exp: "Action and reaction forces act on two different interacting bodies, so they never cancel each other out."
        }
    ],
    gravity: [
        {
            q: "In a vacuum with no air resistance, dropping a 50kg anvil and an apple simultaneously from a 20m tower results in:",
            options: ["The anvil hits first", "The apple hits first", "Both hit the ground at the exact same instant", "The apple floats"],
            correct: 2,
            exp: "Near Earth's surface, all objects experience the exact same gravitational acceleration g = 9.8 m/s² regardless of mass."
        },
        {
            q: "What is the standard value of Earth's surface gravitational acceleration?",
            options: ["9.8 m/s²", "1.6 m/s²", "32.2 m/s²", "100 m/s²"],
            correct: 0,
            exp: "Standard Earth gravitational acceleration is g ≈ 9.8 m/s² directed downward toward Earth's center."
        }
    ],
    momentum: [
        {
            q: "What is the mathematical formula for linear momentum (p)?",
            options: ["p = ½ m v²", "p = m v", "p = F / m", "p = m g h"],
            correct: 1,
            exp: "Momentum is the product of mass and velocity: p = mv (measured in kg·m/s)."
        },
        {
            q: "In a closed system with no external forces, total momentum during an elastic collision is:",
            options: ["Completely lost to heat", "Doubled after impact", "Strictly conserved", "Reduced by half"],
            correct: 2,
            exp: "The Law of Conservation of Momentum states that total momentum before collision equals total momentum after."
        }
    ],
    energy: [
        {
            q: "At the highest peak of a rollercoaster hill before it drops, what form of energy is at its maximum?",
            options: ["Kinetic Energy (KE)", "Gravitational Potential Energy (PE)", "Thermal Energy", "Chemical Energy"],
            correct: 1,
            exp: "At maximum height h, Potential Energy PE = mgh is maximized. It converts into Kinetic Energy as the coaster descends."
        },
        {
            q: "If an object's speed doubles (2x), its kinetic energy (KE = ½mv²) will:",
            options: ["Double (2x)", "Stay the same", "Quadruple (4x)", "Increase by 8x"],
            correct: 2,
            exp: "Because kinetic energy depends on velocity squared (v²), doubling velocity multiplies KE by 2² = 4."
        }
    ],
    friction: [
        {
            q: "In which direction does friction force always act relative to the sliding surface?",
            options: ["In the same direction of motion", "Opposite to the direction of motion", "Perpendicular to the surface", "Straight downward"],
            correct: 1,
            exp: "Friction acts parallel to contacting surfaces in the direction directly opposing relative motion."
        },
        {
            q: "Which surface typically has the lowest coefficient of friction (μ)?",
            options: ["Dry Sand (μ = 0.8)", "Polished Wood (μ = 0.3)", "Glacier Ice (μ = 0.05)", "Rubber on Concrete (μ = 0.9)"],
            correct: 2,
            exp: "Smooth glacier ice provides minimal microscopic resistance, with μ ≈ 0.05 enabling effortless gliding."
        }
    ],
    electricity: [
        {
            q: "What is Ohm's Law formula relating Voltage (V), Current (I), and Resistance (R)?",
            options: ["V = I / R", "V = I × R", "I = V × R", "R = V × I"],
            correct: 1,
            exp: "Ohm's Law states V = I × R (Voltage equals Current multiplied by Resistance)."
        },
        {
            q: "What is required for continuous electric current to flow and power a lightbulb?",
            options: ["An open broken circuit", "A complete closed conductive loop", "Zero voltage source", "Infinite resistance"],
            correct: 1,
            exp: "Electrons require an unbroken closed conducting loop connecting the voltage source across the load."
        }
    ],
    magnetism: [
        {
            q: "Magnetic field lines outside a permanent magnet always flow from:",
            options: ["North pole to South pole", "South pole to North pole", "Center outward in circles", "Negative to positive"],
            correct: 0,
            exp: "By convention, magnetic flux lines emerge from the North pole and curve into the South pole."
        },
        {
            q: "When bringing two North poles (N - N) close together, they will:",
            options: ["Attract strongly", "Repel each other", "Neutralize completely", "Rotate without force"],
            correct: 1,
            exp: "Fundamental rule of magnetism: Like poles repel, and opposite poles attract."
        }
    ],
    doppler: [
        {
            q: "When an ambulance siren approaches you, what happens to the perceived sound pitch/frequency?",
            options: ["It decreases (lower pitch)", "It increases (higher pitch)", "It remains completely unchanged", "It vanishes"],
            correct: 1,
            exp: "As the sound source approaches, wavefronts compress together, increasing the perceived frequency and pitch."
        },
        {
            q: "The Doppler Effect occurs whenever there is:",
            options: ["High air temperature", "Relative motion between source and observer", "Complete silence in vacuum", "Zero wave speed"],
            correct: 1,
            exp: "Relative motion compresses wavefronts in front of the source and stretches them behind."
        }
    ],
    light: [
        {
            q: "When white laser light enters a triangular glass prism, why does it separate into 7 rainbow colors?",
            options: ["The glass dyes the light", "Different colors refract at different angles due to wavelength dispersion", "Light speed is infinite in glass", "Prisms emit ultraviolet rays"],
            correct: 1,
            exp: "Optical dispersion: higher frequency violet light refracts more strongly than red light, fanning into a spectrum."
        },
        {
            q: "What mathematical law governs the refraction of light at the boundary between two media?",
            options: ["Newton's Law", "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂", "Coulomb's Law", "Hooke's Law"],
            correct: 1,
            exp: "Snell's Law determines the angle of refraction based on the refractive indices n1 and n2."
        }
    ],
    centripetal: [
        {
            q: "In which direction does centripetal force point during circular vertical loops?",
            options: ["Tangential to the circle", "Radially inward toward the center", "Radially outward away from the center", "Straight upward"],
            correct: 1,
            exp: "Centripetal means 'center-seeking'; it constantly pulls velocity inward perpendicular to the motion path."
        },
        {
            q: "What is the formula for centripetal force (Fc)?",
            options: ["Fc = m v / r", "Fc = m v² / r", "Fc = ½ m v²", "Fc = m g h"],
            correct: 1,
            exp: "Centripetal force Fc = mv²/r provides the inward acceleration a_c = v²/r for circular motion."
        }
    ],
    buoyancy: [
        {
            q: "According to Archimedes' Principle, the upward buoyant force (Fb) on a submerged object equals:",
            options: ["The total weight of the object", "The weight of the fluid displaced by the object", "The surface area of the tank", "Zero in deep water"],
            correct: 1,
            exp: "Archimedes' Principle states that Fb = ρ_fluid × V_submerged × g (weight of displaced fluid)."
        },
        {
            q: "Why does a 50kg solid lead ball sink in water while a wooden block floats?",
            options: ["Lead is magnetic", "Lead density is greater than water, while wood density is less than water", "Wood repels gravity", "Lead dissolves in water"],
            correct: 1,
            exp: "An object floats if its average density is less than fluid density (ρ_wood < ρ_water), and sinks if denser."
        }
    ],
    pendulum: [
        {
            q: "The period of oscillation of a simple pendulum (T = 2π√(L/g)) depends primarily on:",
            options: ["The mass of the bob", "The length of the string and gravity", "The color of the pendulum", "The room temperature"],
            correct: 1,
            exp: "Simple pendulum period is independent of bob mass; it depends only on string length L and gravity g."
        },
        {
            q: "At the lowest point (equilibrium) of a swinging pendulum, which quantity is at its maximum?",
            options: ["Potential Energy", "Kinetic Energy and Speed", "Restoring Force", "String Tension is zero"],
            correct: 1,
            exp: "At the lowest point, all potential energy has converted into kinetic energy, maximizing speed."
        }
    ],
    pascal: [
        {
            q: "Pascal's Law states that pressure applied to an enclosed fluid is transmitted:",
            options: ["Only in the downward direction", "Undiminished in all directions throughout the fluid", "Only along the container walls", "Lost as friction"],
            correct: 1,
            exp: "Pascal's Principle: Pressure changes in an enclosed incompressible fluid are transmitted equally throughout."
        },
        {
            q: "How does a hydraulic lift raise a 2000kg truck using a small input force?",
            options: ["By multiplying force across a larger output piston area (F2 = F1 × A2/A1)", "By decreasing fluid pressure", "By creating new mass", "By eliminating gravity"],
            correct: 0,
            exp: "Because pressure P = F1/A1 = F2/A2 is equal, a larger area A2 yields a proportionally larger output force F2."
        }
    ],
    thermal: [
        {
            q: "Heat energy naturally flows from:",
            options: ["Cold bodies to hot bodies", "Regions of higher temperature to lower temperature", "Low pressure to high pressure", "Inside atoms outward only"],
            correct: 1,
            exp: "The 2nd Law of Thermodynamics states heat spontaneously transfers from higher temperature to lower temperature."
        },
        {
            q: "Heat transfer occurring directly through solid matter via molecular vibration is called:",
            options: ["Radiation", "Thermal Conduction", "Convection", "Nuclear fission"],
            correct: 1,
            exp: "Thermal conduction is the transfer of heat through stationary matter by physical contact."
        }
    ],
    interference: [
        {
            q: "In Young's Double-Slit experiment, bright bands on the detector screen are produced by:",
            options: ["Destructive interference", "Constructive interference (waves in phase)", "Total internal reflection", "Absorption"],
            correct: 1,
            exp: "Constructive interference occurs when wave crests align in phase (path difference = nλ), amplifying intensity."
        },
        {
            q: "Dark nodes on an interference pattern occur when overlapping waves are:",
            options: ["Completely in phase", "180° out of phase (crest meets trough)", "Polarized at 90°", "Amplified"],
            correct: 1,
            exp: "Destructive interference happens when wave peaks cancel troughs, resulting in zero net wave amplitude."
        }
    ],
    nuclear: [
        {
            q: "In Einstein's famous equation E = mc², what does the letter 'c' represent?",
            options: ["Speed of Sound", "Speed of Light in vacuum (3 × 10⁸ m/s)", "Centripetal acceleration", "Coulomb's constant"],
            correct: 1,
            exp: "c represents the universal speed of light (≈ 300,000,000 m/s). Because c² is enormous, tiny mass yields colossal energy."
        },
        {
            q: "What fundamental process converts mass directly into pure energy in the Sun and stars?",
            options: ["Chemical combustion", "Nuclear Fusion", "Mechanical friction", "Magnetic induction"],
            correct: 1,
            exp: "Nuclear fusion fuses light nuclei into heavier nuclei, releasing mass difference Δm as pure energy according to E = mc²."
        }
    ]
};

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
        sounds.playBounce();
    } else {
        sounds.playShatter();
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

// ==========================================================================
// 11. CONTROLS & EVENT LISTENERS
// ==========================================================================

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

micToggleBtn?.addEventListener("click", toggleListening);

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

recordVideoBtn?.addEventListener("click", startVideoExport);
closeExportModal?.addEventListener("click", () => exportModal.classList.add("hidden"));
cancelExportBtn?.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
    exportModal.classList.add("hidden");
});

document.getElementById("fullscreenBtn")?.addEventListener("click", () => {
    const frame = document.getElementById("smartboard-frame");
    if (!document.fullscreenElement) frame.requestFullscreen?.();
    else document.exitFullscreen?.();
});

setTimeout(() => {
    speakDialogue("teacher", "Welcome to the World of Physics! Speak or click any topic to start!");
}, 500);

// ==========================================================================
// 11. MAIN RENDER LOOP
// ==========================================================================

let lastTime = performance.now();

function animate2D(now) {
    requestAnimationFrame(animate2D);
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (isPlaying && !isIdleState) {
        updateTimeline(currentTimelineTime + delta);
    }
    renderScene2D(currentTimelineTime);
}

requestAnimationFrame(animate2D);
