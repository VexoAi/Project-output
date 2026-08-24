// ==========================================================================
// 2D CANVAS PHYSICS RENDERER & SIMULATION ENGINE
// Dynamic 60FPS 2D Animation • 18 Environments • G.One & Ra.One Rigging
// ==========================================================================

const canvas = document.getElementById("physicsCanvas2D");
const ctx = canvas.getContext("2d");
let viewWidth = 1000;
let viewHeight = 560;

function resizeCanvas() {
    const container = document.getElementById("canvas3d-container");
    if (!container) return;
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
const ambientParticles = Array.from({ length: 28 }, () => ({
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
// 18 HIGH-PRODUCTION DEDICATED 2D BACKGROUND ENVIRONMENTS
// ==========================================================================

function drawIceGlacierBackground(ctx, t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight * 0.65);
    skyGrad.addColorStop(0, "#082f49");
    skyGrad.addColorStop(0.5, "#0284c7");
    skyGrad.addColorStop(1, "#38bdf8");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    ctx.fillStyle = "#0369a1";
    ctx.beginPath();
    ctx.moveTo(0, viewHeight * 0.65);
    ctx.lineTo(viewWidth * 0.18, viewHeight * 0.32);
    ctx.lineTo(viewWidth * 0.42, viewHeight * 0.65);
    ctx.lineTo(viewWidth * 0.68, viewHeight * 0.26);
    ctx.lineTo(viewWidth, viewHeight * 0.65);
    ctx.fill();

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

    const iceY = viewHeight * 0.68;
    const iceGrad = ctx.createLinearGradient(0, iceY, 0, viewHeight);
    iceGrad.addColorStop(0, "#e0f2fe");
    iceGrad.addColorStop(0.3, "#bae6fd");
    iceGrad.addColorStop(1, "#0284c7");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, iceY, viewWidth, viewHeight - iceY);

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

    applyInk(ctx, "#334155", "#0f172a", 3);
    ctx.fillRect(viewWidth * 0.82, 50, 65, viewHeight * 0.65);
    ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2;
    for (let y = 70; y < viewHeight * 0.7; y += 35) {
        ctx.beginPath(); ctx.moveTo(viewWidth * 0.82, y); ctx.lineTo(viewWidth * 0.82 + 65, y + 20); ctx.stroke();
    }

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

    ctx.strokeStyle = "rgba(0, 240, 255, 0.18)"; ctx.lineWidth = 1.5;
    for (let x = 0; x <= viewWidth; x += 45) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, viewHeight); ctx.stroke();
    }
    for (let y = 0; y <= viewHeight; y += 45) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(viewWidth, y); ctx.stroke();
    }

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

    for (let i = 0; i < 3; i++) {
        const cx = ((t * 22 + i * 360) % (viewWidth + 240)) - 120;
        const cy = 55 + i * 38;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.arc(cx + 28, cy - 12, 38, 0, Math.PI * 2); ctx.arc(cx + 60, cy, 32, 0, Math.PI * 2); ctx.fill();
    }

    const towerX = viewWidth * 0.15;
    const groundY = viewHeight * 0.72;
    applyInk(ctx, "#64748b", "#0f172a", 4);
    ctx.beginPath(); ctx.rect(towerX - 48, groundY - 260, 96, 320); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = "rgba(15, 23, 42, 0.4)"; ctx.lineWidth = 1.5;
    for (let by = groundY - 240; by < groundY + 40; by += 25) {
        ctx.beginPath(); ctx.moveTo(towerX - 48, by); ctx.lineTo(towerX + 48, by); ctx.stroke();
    }

    applyInk(ctx, "#0f172a", "#334155", 2);
    ctx.beginPath();
    ctx.arc(towerX, groundY - 200, 16, Math.PI, 0);
    ctx.rect(towerX - 16, groundY - 200, 32, 35);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#facc15"; ctx.font = "bold 13px 'Outfit', sans-serif";
    for (let h = 0; h <= 20; h += 5) {
        const ry = groundY - 20 - (h * 11);
        ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(towerX + 48, ry); ctx.lineTo(towerX + 62, ry); ctx.stroke();
        ctx.fillText(`${h}m`, towerX + 68, ry + 4);
    }

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

    ctx.fillStyle = "#1e1b4b";
    for (let x = 0; x < viewWidth; x += 65) {
        const bh = 80 + (x % 115);
        ctx.fillRect(x, viewHeight * 0.72 - bh, 50, bh);
        ctx.fillStyle = "#facc15";
        ctx.fillRect(x + 10, viewHeight * 0.72 - bh + 20, 8, 8);
        ctx.fillRect(x + 28, viewHeight * 0.72 - bh + 40, 8, 8);
        ctx.fillStyle = "#1e1b4b";
    }

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

    const iceGrad = ctx.createLinearGradient(0, floorY, viewWidth * 0.33, viewHeight);
    iceGrad.addColorStop(0, "rgba(0, 240, 255, 0.35)");
    iceGrad.addColorStop(1, "rgba(2, 132, 199, 0.5)");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, floorY, viewWidth * 0.33, viewHeight - floorY);
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.fillText("1. Ice Track (μ = 0.05)", 15, floorY + 25);

    const woodGrad = ctx.createLinearGradient(viewWidth * 0.33, floorY, viewWidth * 0.66, viewHeight);
    woodGrad.addColorStop(0, "rgba(180, 83, 9, 0.35)");
    woodGrad.addColorStop(1, "rgba(120, 53, 15, 0.5)");
    ctx.fillStyle = woodGrad;
    ctx.fillRect(viewWidth * 0.33, floorY, viewWidth * 0.33, viewHeight - floorY);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("2. Polished Wood (μ = 0.3)", viewWidth * 0.33 + 15, floorY + 25);

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

    ctx.fillStyle = "#1e293b";
    for (let x = 0; x < viewWidth; x += 85) {
        ctx.fillRect(x, viewHeight * 0.65 - 120, 70, 120);
    }

    const floorY = viewHeight * 0.72;
    applyInk(ctx, "#334155", "#0f172a", 4);
    ctx.fillRect(0, floorY, viewWidth, viewHeight - floorY);

    ctx.strokeStyle = "#facc15"; ctx.lineWidth = 4;
    ctx.setLineDash([20, 15]);
    ctx.beginPath(); ctx.moveTo(0, floorY + 30); ctx.lineTo(viewWidth, floorY + 30); ctx.stroke();
    ctx.setLineDash([]);
}

function drawOpticsDarkroomBackground(ctx, t) {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, viewWidth, viewHeight);

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

    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)"; ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = 0; x <= viewWidth; x += 15) {
        const wy = waterY + Math.sin(t * 4 + x * 0.03) * 5;
        if (x === 0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();

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
// 2D CHARACTER RIGGING & HERO/VILLAIN POSES
// ==========================================================================

function drawGOne2D(ctx, x, y, scale = 1.0, pose = "idle", time = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const bob = Math.sin(time * 6) * 4;

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

    if (pose === "skateboard") {
        applyInk(ctx, "#f59e0b", "#05050a", 3);
        ctx.beginPath(); ctx.roundRect(-45, 124, 90, 8, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0284c7";
        ctx.beginPath(); ctx.arc(-30, 134, 5, 0, Math.PI * 2); ctx.arc(30, 134, 5, 0, Math.PI * 2); ctx.fill();
    }

    if (pose === "snorkel" || pose === "swim") {
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-18, -16 + bob, 36, 12);
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect(-14, -14 + bob, 28, 8);
    }

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

    applyInk(ctx, "#ffffff");
    ctx.beginPath();
    ctx.ellipse(-14, 122, 14, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(14, 122, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    const suitGrad = ctx.createLinearGradient(-22, 10, 22, 65);
    suitGrad.addColorStop(0, "#38bdf8");
    suitGrad.addColorStop(1, "#0284c7");
    applyInk(ctx, suitGrad);
    ctx.beginPath();
    ctx.moveTo(-22, 10 + bob); ctx.lineTo(-14, 65 + bob); ctx.lineTo(14, 65 + bob); ctx.lineTo(22, 10 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    const pulse = 1.0 + Math.sin(time * 10) * 0.25;
    ctx.save();
    ctx.shadowColor = "#00f0ff"; ctx.shadowBlur = 20;
    applyInk(ctx, "#ffffff", "#00f0ff", 3);
    ctx.beginPath(); ctx.arc(0, 32 + bob, 12 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#00f0ff"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 32 + bob, 16 * pulse, 6 * pulse, time * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

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

    applyInk(ctx, "#ffd1b3");
    ctx.beginPath(); ctx.arc(0, -10 + bob, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    applyInk(ctx, "#05050a");
    ctx.beginPath();
    ctx.moveTo(-22, -15 + bob);
    ctx.lineTo(-32, -42 + bob); ctx.lineTo(-18, -32 + bob);
    ctx.lineTo(-12, -55 + bob); ctx.lineTo(0, -38 + bob);
    ctx.lineTo(12, -58 + bob); ctx.lineTo(18, -35 + bob);
    ctx.lineTo(32, -45 + bob); ctx.lineTo(22, -15 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

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

    applyInk(ctx, "#09090b");
    ctx.beginPath();
    const flap = Math.sin(time * 8) * 16;
    ctx.moveTo(-20, 15 + bob);
    ctx.quadraticCurveTo(-60 + flap, 60, -45 + flap, 125);
    ctx.lineTo(45 + flap, 125);
    ctx.quadraticCurveTo(60 + flap, 60, 20, 15 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    applyInk(ctx, "#dc2626");
    ctx.beginPath();
    ctx.moveTo(-12, 60); ctx.lineTo(-16, 120); ctx.lineTo(-6, 120); ctx.lineTo(-4, 70);
    ctx.moveTo(12, 60); ctx.lineTo(16, 120); ctx.lineTo(6, 120); ctx.lineTo(4, 70);
    ctx.fill(); ctx.stroke();

    applyInk(ctx, "#dc2626");
    ctx.beginPath();
    ctx.moveTo(-22, 10 + bob); ctx.lineTo(-14, 65 + bob); ctx.lineTo(14, 65 + bob); ctx.lineTo(22, 10 + bob);
    ctx.closePath(); ctx.fill(); ctx.stroke();

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

    applyInk(ctx, "#f8fafc");
    ctx.beginPath(); ctx.arc(0, -10 + bob, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    applyInk(ctx, "#09090b");
    ctx.beginPath(); ctx.arc(0, -12 + bob, 23, Math.PI * 0.8, Math.PI * 2.2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#05050a";
    ctx.beginPath();
    ctx.ellipse(-8, -10 + bob, 6, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(8, -10 + bob, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(-7, -10 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(9, -10 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

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

function drawSteelCrate(ctx, x, y, label, sub) {
    ctx.save();
    ctx.translate(x, y);
    applyInk(ctx, "#334155", "#05050a", 5);
    ctx.beginPath(); ctx.rect(-60, -60, 120, 120); ctx.fill(); ctx.stroke();
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
    const pipeY = baseY - 25;
    const pipeH = 35;
    applyInk(ctx, "#1e293b", "#05050a", 4);
    ctx.fillRect(p1X - 30, pipeY, (p2X - p1X) + 110, pipeH);
    ctx.strokeRect(p1X - 30, pipeY, (p2X - p1X) + 110, pipeH);

    const fluidGrad = ctx.createLinearGradient(0, pipeY, 0, pipeY + pipeH);
    fluidGrad.addColorStop(0, "#00f0ff");
    fluidGrad.addColorStop(0.5, "#0284c7");
    fluidGrad.addColorStop(1, "#0369a1");
    ctx.fillStyle = fluidGrad;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 15 * pressureIntensity;
    ctx.fillRect(p1X - 25, pipeY + 4, (p2X - p1X) + 100, pipeH - 8);

    for (let i = 0; i < 6; i++) {
        const px = (p1X - 15) + ((t * 110 * pressureIntensity + i * 85) % ((p2X - p1X) + 80));
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, pipeY + pipeH / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    applyInk(ctx, "#334155", "#05050a", 4);
    ctx.fillRect(p1X - 28, p1Y, 56, baseY - p1Y);
    ctx.strokeRect(p1X - 28, p1Y, 56, baseY - p1Y);

    applyInk(ctx, "#64748b", "#05050a", 3);
    ctx.fillRect(p1X - 8, p1Y - 45, 16, 50);
    applyInk(ctx, "#facc15", "#05050a", 3);
    ctx.beginPath(); ctx.roundRect(p1X - 32, p1Y - 55, 64, 14, 4); ctx.fill(); ctx.stroke();

    applyInk(ctx, "#334155", "#05050a", 5);
    ctx.fillRect(p2X - 70, p2Y, 140, baseY - p2Y);
    ctx.strokeRect(p2X - 70, p2Y, 140, baseY - p2Y);

    applyInk(ctx, "#475569", "#05050a", 4);
    ctx.fillRect(p2X - 25, p2Y - 35, 50, 40);

    applyInk(ctx, "#e2e8f0", "#05050a", 4);
    ctx.beginPath(); ctx.roundRect(p2X - 85, p2Y - 45, 170, 14, 4); ctx.fill(); ctx.stroke();

    const midX = (p1X + p2X) / 2;
    const midY = pipeY - 20;
    applyInk(ctx, "#0f172a", "#00f0ff", 3);
    ctx.beginPath(); ctx.arc(midX, midY, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 10px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("100 kPa", midX, midY - 6);

    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5;
    const needleAng = (pressureIntensity * Math.PI * 0.8) - Math.PI * 0.9;
    ctx.beginPath(); ctx.moveTo(midX, midY + 4); ctx.lineTo(midX + Math.cos(needleAng) * 16, midY + 4 + Math.sin(needleAng) * 16); ctx.stroke();

    ctx.restore();
}

function drawHydraulicTruck(ctx, x, y, tilt = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    applyInk(ctx, "#0284c7", "#05050a", 4);
    ctx.beginPath(); ctx.roundRect(-75, -55, 150, 48, 6); ctx.fill(); ctx.stroke();

    applyInk(ctx, "#38bdf8", "#05050a", 3);
    ctx.beginPath(); ctx.roundRect(-70, -50, 50, 24, 4); ctx.fill(); ctx.stroke();
    applyInk(ctx, "#bae6fd", "#05050a", 2);
    ctx.beginPath(); ctx.roundRect(-15, -50, 40, 24, 4); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#facc15";
    ctx.fillRect(-70, -22, 140, 6);

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("2000 KG", 15, -32);

    const drawWheel = (wx) => {
        applyInk(ctx, "#09090b", "#05050a", 3);
        ctx.beginPath(); ctx.arc(wx, 0, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        applyInk(ctx, "#94a3b8", "#05050a", 2);
        ctx.beginPath(); ctx.arc(wx, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    };
    drawWheel(-50);
    drawWheel(50);

    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.arc(-74, -28, 5, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
}

function drawThermalLabApparatus(ctx, flameX, rodX1, rodX2, rodY, heatProg, t) {
    ctx.save();

    applyInk(ctx, "#1e293b", "#05050a", 4);
    ctx.fillRect(flameX - 45, rodY + 25, (rodX2 - flameX) + 90, 20);
    ctx.strokeRect(flameX - 45, rodY + 25, (rodX2 - flameX) + 90, 20);

    applyInk(ctx, "#334155", "#05050a", 3);
    ctx.beginPath();
    ctx.roundRect(flameX - 22, rodY + 12, 44, 14, 3);
    ctx.rect(flameX - 6, rodY - 15, 12, 28);
    ctx.fill(); ctx.stroke();

    const flmH = 32 + Math.sin(t * 22) * 6;
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#f97316"; ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(flameX - 14, rodY - 15);
    ctx.quadraticCurveTo(flameX - 16, rodY - 15 - flmH * 0.7, flameX, rodY - 15 - flmH);
    ctx.quadraticCurveTo(flameX + 16, rodY - 15 - flmH * 0.7, flameX + 14, rodY - 15);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.moveTo(flameX - 7, rodY - 15);
    ctx.quadraticCurveTo(flameX - 8, rodY - 15 - flmH * 0.5, flameX, rodY - 15 - flmH * 0.7);
    ctx.quadraticCurveTo(flameX + 8, rodY - 15 - flmH * 0.5, flameX + 7, rodY - 15);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;

    for (let i = 0; i < 3; i++) {
        const spkX = flameX - 8 + Math.sin(t * 15 + i * 2) * 16;
        const spkY = rodY - 25 - ((t * 60 + i * 25) % 40);
        ctx.fillStyle = "#fde047";
        ctx.beginPath(); ctx.arc(spkX, spkY, 2.5, 0, Math.PI * 2); ctx.fill();
    }

    const flaskX = flameX;
    const flaskY = rodY - 55;
    applyInk(ctx, "rgba(255, 255, 255, 0.2)", "#38bdf8", 2.5);
    ctx.beginPath();
    ctx.moveTo(flaskX - 6, flaskY - 25); ctx.lineTo(flaskX + 6, flaskY - 25);
    ctx.lineTo(flaskX + 6, flaskY - 10); ctx.lineTo(flaskX + 22, flaskY + 18);
    ctx.lineTo(flaskX - 22, flaskY + 18); ctx.lineTo(flaskX - 6, flaskY - 10);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "rgba(249, 115, 22, 0.65)";
    ctx.beginPath();
    ctx.moveTo(flaskX - 18, flaskY + 6); ctx.lineTo(flaskX + 18, flaskY + 6);
    ctx.lineTo(flaskX + 22, flaskY + 18); ctx.lineTo(flaskX - 22, flaskY + 18);
    ctx.closePath(); ctx.fill();

    for (let i = 0; i < 3; i++) {
        const stmX = flaskX + Math.sin(t * 4 + i) * 12;
        const stmY = flaskY - 35 - ((t * 35 + i * 25) % 55);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath(); ctx.arc(stmX, stmY, 6 + i * 3, 0, Math.PI * 2); ctx.fill();
    }

    const rodW = rodX2 - rodX1;
    const rodH = 14;
    const rodGrad = ctx.createLinearGradient(rodX1, 0, rodX1 + rodW, 0);

    const prog = Math.min(Math.max(heatProg, 0), 1);
    rodGrad.addColorStop(0, "#ffffff");
    rodGrad.addColorStop(Math.min(prog * 0.3, 0.3), "#facc15");
    rodGrad.addColorStop(Math.min(prog * 0.6, 0.6), "#f97316");
    rodGrad.addColorStop(Math.min(prog, 0.99), "#dc2626");
    rodGrad.addColorStop(Math.min(prog + 0.01, 1), "#64748b");
    rodGrad.addColorStop(1, "#475569");

    applyInk(ctx, rodGrad, "#05050a", 3);
    ctx.shadowColor = "#f97316"; ctx.shadowBlur = 15 * prog;
    ctx.beginPath(); ctx.roundRect(rodX1, rodY - rodH / 2, rodW, rodH, 4); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;

    applyInk(ctx, "#090d1f", "#f97316", 2);
    ctx.fillRect(flameX + 60, rodY + 30, 85, 22);
    ctx.fillStyle = "#facc15"; ctx.font = "bold 11px 'Outfit', sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`T = ${Math.round(50 + prog * 300)}°C`, flameX + 102, rodY + 45);

    ctx.restore();
}

function drawIceWaterBucket(ctx, x, y, isDunked, t) {
    ctx.save();
    ctx.translate(x, y);

    applyInk(ctx, "#64748b", "#05050a", 4);
    ctx.beginPath();
    ctx.moveTo(-45, -35); ctx.lineTo(45, -35);
    ctx.lineTo(35, 20); ctx.lineTo(-35, 20);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = "rgba(14, 165, 233, 0.85)";
    ctx.fillRect(-38, -30, 76, 45);

    ctx.fillStyle = "rgba(224, 242, 254, 0.9)";
    ctx.strokeStyle = "#0284c7"; ctx.lineWidth = 1.5;
    const drawCube = (cx, cy) => {
        ctx.fillRect(cx - 7, cy - 7, 14, 14);
        ctx.strokeRect(cx - 7, cy - 7, 14, 14);
    };
    drawCube(-20, -25);
    drawCube(12, -28);
    drawCube(-4, -18);

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

    applyInk(ctx, "#18181b", "#facc15", 3);
    ctx.beginPath(); ctx.roundRect(coreX - 70, coreY + 45, 140, 24, 4); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
        const ringAng = t * 1.5 + (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.ellipse(coreX, coreY, 95, 38, ringAng, 0, Math.PI * 2);
        ctx.stroke();
    }

    const gunX = viewWidth * 0.15;
    applyInk(ctx, "#1e293b", "#00f0ff", 3);
    ctx.beginPath(); ctx.roundRect(gunX - 25, coreY - 14, 60, 28, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath(); ctx.arc(gunX + 35, coreY, 7, 0, Math.PI * 2); ctx.fill();

    if (phase === "charge") {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f0ff"; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.arc(nX, nY, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.7)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gunX + 35, coreY); ctx.lineTo(nX, nY); ctx.stroke();
        ctx.shadowBlur = 0;

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
        const blastR = (fissionTime * 35) % 160;
        ctx.strokeStyle = "rgba(250, 204, 21, 0.85)"; ctx.lineWidth = 4;
        ctx.shadowColor = "#facc15"; ctx.shadowBlur = 30;
        ctx.beginPath(); ctx.arc(coreX, coreY, blastR, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.65)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(coreX, coreY, Math.max(0, blastR - 30), 0, Math.PI * 2); ctx.stroke();

        const fragDist = fissionTime * 22;
        applyInk(ctx, "#ef4444", "#ffffff", 2);
        ctx.beginPath(); ctx.arc(coreX - 25 - fragDist, coreY - 20 - fragDist * 0.4, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 9px sans-serif"; ctx.fillText("¹⁴¹Ba", coreX - 35 - fragDist, coreY - 22 - fragDist * 0.4);

        applyInk(ctx, "#3b82f6", "#ffffff", 2);
        ctx.beginPath(); ctx.arc(coreX + 25 + fragDist, coreY + 20 + fragDist * 0.4, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#ffffff"; ctx.font = "bold 9px sans-serif"; ctx.fillText("⁹²Kr", coreX + 18 + fragDist, coreY + 22 + fragDist * 0.4);

        for (let i = 0; i < 3; i++) {
            const nang = (i * Math.PI * 2) / 3 + fissionTime * 4;
            const nrad = 30 + fissionTime * 45;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath(); ctx.arc(coreX + Math.cos(nang) * nrad, coreY + Math.sin(nang) * nrad, 4.5, 0, Math.PI * 2); ctx.fill();
        }
    } else {
        const pulse = 1.0 + Math.sin(t * 8) * 0.15;
        const torusGrad = ctx.createRadialGradient(coreX, coreY, 10, coreX, coreY, 55 * pulse);
        torusGrad.addColorStop(0, "#ffffff");
        torusGrad.addColorStop(0.4, "#facc15");
        torusGrad.addColorStop(0.8, "#00f0ff");
        torusGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = torusGrad;
        ctx.beginPath(); ctx.arc(coreX, coreY, 55 * pulse, 0, Math.PI * 2); ctx.fill();

        for (let i = 0; i < 4; i++) {
            const eang = t * 5 + (i * Math.PI) / 2;
            ctx.fillStyle = "#00f0ff";
            ctx.beginPath(); ctx.arc(coreX + Math.cos(eang) * 65, coreY + Math.sin(eang) * 28, 4, 0, Math.PI * 2); ctx.fill();
        }
    }

    ctx.restore();
}

// ==========================================================================
// MASTER SCENE RENDERER FUNCTION
// ==========================================================================

function renderScene2D(t, currentTopicKey, isIdleState, dialogueTriggered) {
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
    if (!isIdleState && t >= 23.5 && t < 30) {
        if (victoryBanner) victoryBanner.classList.remove("hidden");
    } else {
        if (victoryBanner) victoryBanner.classList.add("hidden");
    }

    if (isIdleState) {
        drawGOne2D(ctx, viewWidth * 0.32, groundY, 1.1, "idle", performance.now() * 0.001);
        drawRaOne2D(ctx, viewWidth * 0.68, groundY, 1.1, "idle", performance.now() * 0.001);
        return;
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

            drawGOne2D(ctx, p1X - 25, p1PistonY - 60, 1.0, "push", t);
            drawForceArrow(ctx, p1X - 25, p1PistonY - 115, p1X - 25, p1PistonY - 55, "Small Force F1 = 200 N", "#ef4444");

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

            drawGOne2D(ctx, p1X - 25, p1PistonY - 60, 1.0, "push", t);
            drawForceArrow(ctx, p1X - 25, p1PistonY - 120, p1X - 25, p1PistonY - 55, "P = F1/A1 = 100 kPa", "#facc15");

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

            const jumpY = Math.abs(Math.sin((t - 20) * 4)) * 30;
            drawGOne2D(ctx, viewWidth * 0.28, groundY - jumpY, 1.1, "flex", t);
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

            drawGOne2D(ctx, viewWidth * 0.18, groundY, 1.05, "push", t);
            drawForceArrow(ctx, flameX, rodY - 30, rodX1 + 40, rodY - 30, "Bunsen Flame T1 = 500°C", "#f97316");

            drawRaOne2D(ctx, rodX2 + 20, groundY, 1.05, "laugh", t);
            drawForceArrow(ctx, rodX2, rodY - 20, rodX2 + 30, rodY - 20, "Cold Rod T2 = 25°C", "#38bdf8");
        } else if (t < 20.0) {
            const heatProg = 0.25 + ((t - 10.0) / 10.0) * 0.75;
            drawThermalLabApparatus(ctx, flameX, rodX1, rodX2, rodY, heatProg, t);
            drawIceWaterBucket(ctx, bucketX, groundY + 50, false, t);

            drawGOne2D(ctx, viewWidth * 0.18, groundY, 1.05, "laser", t);
            drawForceArrow(ctx, rodX1 + 40, rodY - 25, rodX2 - 20, rodY - 25, "Heat Conduction Q = mcΔT ➔", "#facc15");

            const hopY = Math.abs(Math.sin(t * 14)) * 38;
            const raX = rodX2 + 25 + Math.sin(t * 8) * 15;
            drawRaOne2D(ctx, raX, groundY - hopY, 1.05, "shock", t);

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

            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "flex", t);

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
            drawGOne2D(ctx, gunX - 10, groundY, 1.05, "laser", t);
            drawForceArrow(ctx, gunX + 40, coreY - 25, nX + 20, coreY - 25, "Neutron Trigger n⁰ ➔", "#00f0ff");
            drawRaOne2D(ctx, viewWidth * 0.8, groundY, 1.05, "laugh", t);
            drawForceArrow(ctx, viewWidth * 0.8, groundY - 30, viewWidth * 0.8, groundY - 70, "Mass Target (²³⁵U)", "#facc15");
        } else if (t < 20.0) {
            const fissionTime = t - 10.0;
            drawNuclearReactorApparatus(ctx, coreX, coreY, "fission", t, 0, 0, fissionTime);
            drawGOne2D(ctx, viewWidth * 0.2, groundY, 1.1, "flex", t);

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
            const hoverY = Math.sin(t * 4) * 15;
            drawGOne2D(ctx, viewWidth * 0.22, groundY - 35 + hoverY, 1.1, "rocket", t);
            drawRaOne2D(ctx, viewWidth * 0.82, groundY, 1.1, "puddle", t);
            drawForceArrow(ctx, viewWidth * 0.35, groundY - 70, coreX + 60, groundY - 70, "E = mc² Fusion Torus Mastered!", "#00f0ff");
        }
    }

    else {
        drawGOne2D(ctx, viewWidth * 0.3, groundY, 1.1, "flex", t);
        drawRaOne2D(ctx, viewWidth * 0.75, groundY, 1.1, t > 15 ? "puddle" : "idle", t);
    }
}

if (typeof window !== "undefined") {
    window.renderScene2D = renderScene2D;
    window.resizeCanvas = resizeCanvas;
    window.canvas = canvas;
    window.ctx = ctx;
}
