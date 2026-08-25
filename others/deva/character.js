// BioProcess Lab - Voice Narration & Live Subtitles Engine
class ProcessNarrator {
  constructor(containerId = null) {
    this.container = containerId ? document.getElementById(containerId) : null;
    this.lastText = "Welcome students! I'm Dr. Helix, your AI Biology Teacher. Choose any topic in the top bar, click Teacher Mode to start an interactive 8-step lesson, or ask me any question!";
    this.isSpeaking = false;
    this.audioEnabled = true;
  }

  say(text, emotion = 'explaining', speakAudio = true, onComplete = null) {
    if (!text) {
      if (onComplete) onComplete();
      return;
    }
    this.lastText = text;

    // Update any active subtitle banner in the UI
    const subtitleEl = document.getElementById('active-process-subtitle-text');
    if (subtitleEl) {
      subtitleEl.textContent = text;
      subtitleEl.classList.remove('fade-pulse');
      void subtitleEl.offsetWidth; // Trigger reflow
      subtitleEl.classList.add('fade-pulse');
    }

    // Dispatch Live Speech Event for Real-Time Live Notes Generator
    try {
      window.dispatchEvent(new CustomEvent('helix-speech-start', {
        detail: {
          text: text,
          topicId: window.bioApp ? window.bioApp.currentTopicId : 'dnaGenetics',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      }));
    } catch (e) {
      console.warn('Speech event error:', e);
    }

    // Play Voice Narration via Web Speech API if enabled
    if (speakAudio && window.bioSpeech && window.bioSpeech.enabled) {
      this.isSpeaking = true;
      window.bioSpeech.speak(
        text,
        () => {
          this.isSpeaking = true;
        },
        () => {
          this.isSpeaking = false;
          window.dispatchEvent(new CustomEvent('helix-speech-end', { detail: { text } }));
          if (onComplete) onComplete();
        }
      );
    } else {
      // If voice is disabled or unsupported, calculate realistic reading duration
      this.isSpeaking = false;
      const words = text.split(/\s+/).length;
      const readDuration = Math.max(words * 320, 2500);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('helix-speech-end', { detail: { text } }));
        if (onComplete) onComplete();
      }, readDuration);
    }
  }

  replay() {
    if (this.lastText) {
      this.say(this.lastText, 'explaining', true);
    }
  }

  stop() {
    if (window.bioSpeech) {
      window.bioSpeech.stop();
    }
    this.isSpeaking = false;
    window.dispatchEvent(new CustomEvent('helix-speech-end', { detail: { text: '' } }));
  }

  // Compatibility shims
  setEmotion(e) { /* non-visual */ }
  setAccessory(a) { /* non-visual */ }
  setOutfitColor(c) { /* non-visual */ }
}

// Global instance for compatibility
window.HelixCharacter = ProcessNarrator;
window.drHelix = new ProcessNarrator();
