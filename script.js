// ==========================================================================
// VEXO-AI — SMART TEACHER: 2D PHYSICS ENGINE & CLASSROOM
// Modular Driver: physicsAudio.js + physicsCurriculum.js + physicsRenderer.js + physicsTeaching.js
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize UI Controls, Speech AI, and Voice Recognition
    if (typeof initPhysicsControls === "function") {
        initPhysicsControls();
    }

    // 2. Main 60FPS Animation & Render Loop
    let lastTime = performance.now();

    function animate2D(now) {
        requestAnimationFrame(animate2D);
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        const state = (typeof getPhysicsState === "function") ? getPhysicsState() : {};

        if (state.isPlaying && !state.isIdleState) {
            if (typeof updateTimeline === "function") {
                updateTimeline(state.currentTimelineTime + delta);
            }
        }

        if (typeof renderScene2D === "function") {
            renderScene2D(
                state.currentTimelineTime || 0,
                state.currentTopicKey || "inertia",
                state.isIdleState !== undefined ? state.isIdleState : true,
                state.dialogueTriggered || {}
            );
        }
    }

    requestAnimationFrame(animate2D);
});
