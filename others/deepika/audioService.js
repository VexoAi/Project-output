// Web Audio API Sound Effects Synthesizer + Web Speech API (TTS and STT)

class AudioService {
  constructor() {
    this.audioCtx = null;
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.initAudioContext();
    this.initSpeechRecognition();
  }

  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play pleasant, warm chime on correct answer
  playSuccessSound() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Chord notes: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + index * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.5);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Play gentle, encouraging "try again" boop
  playTryAgainSound() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.error(e);
    }
  }

  // Play futuristic click sound
  playClickSound() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.error(e);
    }
  }

  // Play Fanfare for quiz complete!
  playFanfare() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
      const times = [0, 0.12, 0.24, 0.36, 0.48, 0.65];
      const durations = [0.1, 0.1, 0.1, 0.1, 0.15, 0.6];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + times[i]);

        gain.gain.setValueAtTime(0.18, now + times[i]);
        gain.gain.exponentialRampToValueAtTime(0.001, now + times[i] + durations[i]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + times[i]);
        osc.stop(now + times[i] + durations[i] + 0.05);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Initialize Web Speech API Recognition
  initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  // Start Speech Recognition with callback handlers
  startListening({ onResult, onInterim, onError, onEnd }) {
    if (!this.recognition) {
      if (onError) onError(new Error("Speech recognition is not supported in this browser. Please use text input or Chrome/Edge."));
      return false;
    }

    try {
      this.isListening = true;
      this.playClickSound();

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript && onInterim) {
          onInterim(interimTranscript);
        }
        if (finalTranscript && onResult) {
          onResult(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      this.isListening = false;
      if (onError) onError(err);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error(e);
      }
      this.isListening = false;
    }
  }

  // Text-To-Speech with word boundary tracking for live highlighting
  speak(text, { onStart, onEnd, onBoundary, rate = 0.92, pitch = 1.05 } = {}) {
    if (!this.speechSynth) return;
    
    // Stop any ongoing speech
    this.speechSynth.cancel();

    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate; // slightly friendly pace for students
    utterance.pitch = pitch; // slightly warm/friendly pitch
    utterance.lang = 'en-US';

    // Pick best natural voice if available
    const voices = this.speechSynth.getVoices();
    const friendlyVoice = voices.find(v => 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny')) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onBoundary) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onBoundary({ charIndex: event.charIndex, charLength: event.charLength });
        }
      };
    }

    this.speechSynth.speak(utterance);
    return utterance;
  }

  stopSpeaking() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  isSpeaking() {
    return this.speechSynth ? this.speechSynth.speaking : false;
  }
}

export const audioService = new AudioService();
