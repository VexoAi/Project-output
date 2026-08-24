// ==========================================================================
// PHYSICS SOUND FX ENGINE (Web Audio API)
// Real-time procedural audio synthesis for collisions, lasers, electric zaps
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

if (typeof window !== "undefined") {
    window.PhysicsAudioEngine = PhysicsAudioEngine;
    window.sounds = sounds;
}
