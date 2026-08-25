// BioProcess Lab - Web Speech API Voice Engine with Sentence Chunking & GC Protection
class BioSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.rate = 0.95; // Natural, clear pedagogical pace
    this.pitch = 1.05; // Friendly, clear teacher tone
    this.enabled = true;
    this.subtitlesEnabled = true;
    this.speaking = false;
    this.onStart = null;
    this.onEnd = null;
    
    // Active utterance queue and references to prevent Chromium Garbage Collection drops
    this._activeQueue = [];
    this._currentSessionId = 0;
    this._keepAliveInterval = null;

    window._bioActiveUtterances = window._bioActiveUtterances || [];

    this._initVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this._initVoices();
    }
  }

  _initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize high-quality natural English voices
    const preferred = voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Samantha') || 
        v.name.includes('Karen') || 
        v.name.includes('Zira') || 
        v.name.includes('Jenny') || 
        v.name.includes('David') ||
        v.name.includes('Mark')
      )
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    this.voice = preferred;
  }

  // Convert scientific formulas, symbols, and notation into smooth spoken English
  sanitizeForSpeech(text) {
    if (!text) return '';
    let s = text.replace(/<[^>]*>/g, ' '); // Strip HTML

    // Replace scientific symbols and arrows
    s = s.replace(/➔|→|➜|➝/g, ' to ');
    s = s.replace(/3'-OH/gi, '3-prime hydroxyl');
    s = s.replace(/5'\s*(?:➔|->|to)\s*3'/gi, '5-prime to 3-prime');
    s = s.replace(/3'\s*(?:➔|->|to)\s*5'/gi, '3-prime to 5-prime');
    s = s.replace(/5'/g, '5-prime');
    s = s.replace(/3'/g, '3-prime');
    s = s.replace(/µm/g, ' micrometers');
    s = s.replace(/CO₂/gi, 'carbon dioxide');
    s = s.replace(/H₂O/gi, 'water');
    s = s.replace(/O₂/gi, 'oxygen');
    s = s.replace(/C₆H₁₂O₆/gi, 'glucose');
    s = s.replace(/ATP/g, 'A T P');
    s = s.replace(/GTP/g, 'G T P');
    s = s.replace(/NADPH/g, 'N A D P H');
    s = s.replace(/NADP\+/g, 'N A D P plus');
    s = s.replace(/NADH/g, 'N A D H');
    s = s.replace(/FADH₂/g, 'F A D H 2');
    s = s.replace(/RNA/g, 'R N A');
    s = s.replace(/DNA/g, 'D N A');
    s = s.replace(/HCl/g, 'hydrochloric acid');
    s = s.replace(/pH\s*([0-9.]+)/gi, 'p H $1');
    s = s.replace(/bpm/gi, 'beats per minute');
    s = s.replace(/mmHg/gi, 'millimeters of mercury');
    s = s.replace(/\(A-T,\s*C-G\)/gi, 'Adenine with Thymine, and Cytosine with Guanine');
    s = s.replace(/\(A=T,\s*G≡C\)/gi, 'Adenine Thymine, Guanine Cytosine');
    s = s.replace(/~([0-9]+)/g, 'approximately $1');
    s = s.replace(/\+/g, ' plus ');
    s = s.replace(/=/g, ' equals ');
    s = s.replace(/&/g, ' and ');
    s = s.replace(/</g, ' less than ');
    s = s.replace(/>/g, ' greater than ');
    s = s.replace(/\^([0-9]+)/g, ' to the power of $1');

    // Clean up brackets so text sounds natural
    s = s.replace(/\(([^)]*)\)/g, ', $1, ');
    s = s.replace(/[[\]{}]/g, ' ');

    // Normalize punctuation spacing
    s = s.replace(/\s+([,.;:!?])/g, '$1');
    s = s.replace(/,\s*,+/g, ',');
    s = s.replace(/,\s*\./g, '.');
    s = s.replace(/\.\s*\.+/g, '.');
    s = s.replace(/\s+/g, ' ').trim();

    return s;
  }

  // Split text into natural, digestible sentence chunks (< 120 chars)
  chunkText(text) {
    const clean = this.sanitizeForSpeech(text);
    if (!clean) return [];

    // Split on sentence terminators (. ! ? ; :)
    const rawSentences = clean.split(/(?<=[.!?])\s+/);
    const chunks = [];

    for (let raw of rawSentences) {
      raw = raw.trim();
      if (!raw) continue;

      if (raw.length <= 130) {
        chunks.push(raw);
      } else {
        // If a sentence is long, split on commas or clauses
        const subParts = raw.split(/,\s*/);
        let currentChunk = '';
        for (const part of subParts) {
          if ((currentChunk + ', ' + part).length <= 130) {
            currentChunk = currentChunk ? (currentChunk + ', ' + part) : part;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = part;
          }
        }
        if (currentChunk) chunks.push(currentChunk);
      }
    }

    return chunks.length > 0 ? chunks : [clean];
  }

  speak(text, onStartCb, onEndCb) {
    if (!text) {
      if (onEndCb) onEndCb();
      return;
    }

    // Stop any existing speech session cleanly
    this.stop(false);

    const sessionId = ++this._currentSessionId;
    const chunks = this.chunkText(text);

    if (!this.synth || !this.enabled || chunks.length === 0) {
      // Fallback: calculate realistic reading time
      if (onStartCb) onStartCb();
      this.speaking = true;
      const words = text.split(/\s+/).length;
      const duration = Math.max(words * 320, 3200);
      setTimeout(() => {
        if (this._currentSessionId === sessionId) {
          this.speaking = false;
          if (onEndCb) onEndCb();
        }
      }, duration);
      return;
    }

    this.speaking = true;
    if (onStartCb) onStartCb();
    if (this.onStart) this.onStart();

    // Start Chrome Keep-Alive watchdog to prevent 15-second speech freezing
    this._startKeepAlive();

    let chunkIdx = 0;

    const speakNextChunk = () => {
      if (this._currentSessionId !== sessionId) return;

      if (chunkIdx >= chunks.length) {
        // All chunks have finished speaking completely!
        this._stopKeepAlive();
        this.speaking = false;
        window._bioActiveUtterances = [];
        if (onEndCb) onEndCb();
        if (this.onEnd) this.onEnd();
        return;
      }

      const chunkText = chunks[chunkIdx];
      chunkIdx++;

      const utterance = new SpeechSynthesisUtterance(chunkText);
      if (this.voice) utterance.voice = this.voice;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;

      // Keep utterance in global array to prevent GC collection in Chromium
      window._bioActiveUtterances.push(utterance);

      utterance.onend = () => {
        // Remove completed utterance from active memory
        const idx = window._bioActiveUtterances.indexOf(utterance);
        if (idx !== -1) window._bioActiveUtterances.splice(idx, 1);

        if (this._currentSessionId === sessionId) {
          // Slight natural pause between sentence chunks (120ms)
          setTimeout(() => {
            speakNextChunk();
          }, 120);
        }
      };

      utterance.onerror = (e) => {
        const idx = window._bioActiveUtterances.indexOf(utterance);
        if (idx !== -1) window._bioActiveUtterances.splice(idx, 1);

        // If interrupted or canceled by stop(), do not proceed or trigger onEndCb
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }

        console.warn("Speech chunk non-fatal error:", e.error, "proceeding to next chunk.");
        if (this._currentSessionId === sessionId) {
          setTimeout(() => speakNextChunk(), 100);
        }
      };

      try {
        this.synth.speak(utterance);
      } catch (err) {
        console.error("Speech speak error:", err);
        if (this._currentSessionId === sessionId) {
          speakNextChunk();
        }
      }
    };

    // Begin speaking the first chunk
    speakNextChunk();
  }

  _startKeepAlive() {
    this._stopKeepAlive();
    this._keepAliveInterval = setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 6000);
  }

  _stopKeepAlive() {
    if (this._keepAliveInterval) {
      clearInterval(this._keepAliveInterval);
      this._keepAliveInterval = null;
    }
  }

  stop(triggerEnd = false) {
    this._currentSessionId++; // Invalidate active speech session
    this._stopKeepAlive();
    window._bioActiveUtterances = [];

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.speaking = false;
  }

  toggleSpeech() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  }
}

if (typeof window !== 'undefined') {
  window.bioSpeech = new BioSpeech();
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BioSpeech;
}
