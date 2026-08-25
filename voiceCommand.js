// BioProcess Voice Control, Speech Recognition, AI Teacher, Kid Tours & Smart Question-to-Video Engine
class BioVoiceCommander {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.supported = false;
    this.restartTimeout = null;

    this.topicFacts = {
      dnaGenetics: "If unraveled, the DNA in a single human cell would measure about 2 meters long, and all your body's DNA could stretch to Pluto and back!",
      circulatory: "Your heart beats around 100,000 times per day, pumping about 2,000 gallons of blood through 60,000 miles of vessels!",
      respiratory: "Your lungs contain over 300 million tiny air sacs called alveoli, creating a gas exchange surface area as large as a tennis court!",
      nervous: "Action potentials travel through your nervous system at speeds up to 268 miles per hour, allowing split-second reflexes!",
      photosynthesis: "Microscopic marine phytoplankton perform over half of all photosynthesis on Earth, producing the majority of our planetary oxygen!",
      cellStructure: "Mitochondria possess their own distinct circular DNA, inherited exclusively from the maternal lineage!",
      microorganisms: "A single teaspoon of healthy soil contains over one billion beneficial bacteria and microscopic fungi!",
      digestive: "The human digestive tract is approximately 30 feet long from mouth to colon, with the small intestine handling most nutrient absorption!",
      animalClass: "Over 95 percent of all documented animal species on Earth are invertebrates, with arthropods being the most diverse!",
      ecosystem: "Due to the 10 percent ecological energy law, 90 percent of energy is lost as metabolic heat between each step of the food chain!"
    };

    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.supported = true;
      this.bindEvents();
    } else {
      console.warn("Web Speech Recognition API is not supported natively in this browser.");
    }
  }

  bindEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateUI();
      if (window.bioAudio) window.bioAudio.playClick();
      this.showFeedback("🎙️ Voice Active – Say 'Teacher Mode', 'Kid Mode', or ask any question!", 'active');
      if (window.drHelix) {
        window.drHelix.say("Voice control active! You can say 'Teacher Mode', 'Kid Tour', 'Start Quiz', or ask any question.", 'explaining', false);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = setTimeout(() => {
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch (e) {
              console.warn("Speech recognition restart skipped:", e);
            }
          }
        }, 300);
      } else {
        this.updateUI();
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.isListening = false;
        this.updateUI();
        this.showFeedback("⚠️ Microphone access denied. Allow microphone permission in browser to use voice control.", "error");
      }
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      const display = finalTranscript || interim;
      if (display) {
        this.showTranscript(display);
      }

      if (finalTranscript) {
        this.processCommand(finalTranscript.trim().toLowerCase());
      }
    };
  }

  toggleListening() {
    if (!this.supported) {
      this.showModalHelp();
      this.showFeedback("Speech recognition is not natively supported in this browser. Try Chrome/Edge or use the manual command bar below.", "warn");
      return false;
    }

    if (this.isListening) {
      this.isListening = false;
      clearTimeout(this.restartTimeout);
      try {
        this.recognition.stop();
      } catch (e) {}
      this.updateUI();
      this.showFeedback("🎙️ Voice control paused. Click microphone to resume.", "idle");
      return false;
    } else {
      try {
        this.isListening = true;
        this.recognition.start();
        return true;
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
        this.isListening = false;
        this.updateUI();
        return false;
      }
    }
  }

  showTranscript(text) {
    const transcriptElem = document.getElementById('voice-transcript-text');
    const hud = document.getElementById('voice-command-hud');
    if (transcriptElem) {
      transcriptElem.textContent = `"${text}"`;
    }
    if (hud) {
      hud.classList.add('hearing-speech');
      clearTimeout(this._hearingTimeout);
      this._hearingTimeout = setTimeout(() => hud.classList.remove('hearing-speech'), 1200);
    }
  }

  showFeedback(msg, type = 'normal') {
    const feedbackElem = document.getElementById('voice-feedback-pill');
    if (feedbackElem) {
      feedbackElem.textContent = msg;
      feedbackElem.className = `voice-feedback-pill ${type}`;
    }
  }

  processCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase().trim();
    console.log("Voice Command / Question:", cmd);

    if (window.bioAudio) window.bioAudio.playSuccess();
    this.showFeedback(`Heard: "${rawCmd}"`, 'success');

    // 1. AI Teacher Lesson Trigger
    if (cmd.includes('teacher') || cmd.includes('teacher mode') || cmd.includes('teach me') || cmd.includes('lesson') || cmd.includes('ai teacher')) {
      if (window.teacherLessonEngine) {
        window.teacherLessonEngine.startLesson();
      }
      return;
    }

    // 2. Kid Adventure Tour Trigger
    if (cmd.includes('kid') || cmd.includes('children') || cmd.includes('kid tour') || cmd.includes('kid mode') || cmd.includes('2 minute tour') || cmd.includes('story')) {
      if (window.kidModeEngine) {
        window.kidModeEngine.startKidTour();
      }
      return;
    }

    // 3. Interactive Quiz Controls (High Priority when quiz is open)
    if (window.bioQuizEngine && window.bioQuizEngine.isQuizActive) {
      if (cmd.includes('option a') || cmd.includes('choose a') || cmd === 'a' || cmd === 'hey') {
        window.bioQuizEngine.answerByLetter('A');
        return;
      }
      if (cmd.includes('option b') || cmd.includes('choose b') || cmd === 'b' || cmd === 'bee') {
        window.bioQuizEngine.answerByLetter('B');
        return;
      }
      if (cmd.includes('option c') || cmd.includes('choose c') || cmd === 'c' || cmd === 'see') {
        window.bioQuizEngine.answerByLetter('C');
        return;
      }
      if (cmd.includes('option d') || cmd.includes('choose d') || cmd === 'd' || cmd === 'dee') {
        window.bioQuizEngine.answerByLetter('D');
        return;
      }
      if (cmd.includes('close quiz') || cmd.includes('exit quiz') || cmd.includes('return to lab')) {
        window.bioQuizEngine.closeQuiz();
        return;
      }
    }

    if (cmd.includes('start quiz') || cmd.includes('take quiz') || cmd.includes('quiz me') || cmd.includes('test me') || cmd.includes('challenge')) {
      if (window.bioQuizEngine) {
        window.bioQuizEngine.openQuiz();
      }
      return;
    }

    // 4. Direct Topic Navigation Commands
    if (cmd.includes('dna') || cmd.includes('genetics') || cmd.includes('gene') || cmd.includes('helix')) {
      window.bioApp.loadTopic('dnaGenetics');
      return;
    }
    if (cmd.includes('circulatory') || cmd.includes('heart') || cmd.includes('blood') || cmd.includes('cardio')) {
      window.bioApp.loadTopic('circulatory');
      return;
    }
    if (cmd.includes('respiratory') || cmd.includes('lung') || cmd.includes('breathe') || cmd.includes('breathing')) {
      window.bioApp.loadTopic('respiratory');
      return;
    }
    if (cmd.includes('nervous') || cmd.includes('brain') || cmd.includes('neuron') || cmd.includes('nerve') || cmd.includes('synapse')) {
      window.bioApp.loadTopic('nervous');
      return;
    }
    if (cmd.includes('photosynthesis') || cmd.includes('plant') || cmd.includes('chloroplast') || cmd.includes('sunlight') || cmd.includes('leaf')) {
      window.bioApp.loadTopic('photosynthesis');
      return;
    }
    if (cmd.includes('cell structure') || cmd.includes('cell') || cmd.includes('organelle') || cmd.includes('microscope')) {
      window.bioApp.loadTopic('cellStructure');
      return;
    }
    if (cmd.includes('microorganism') || cmd.includes('microbe') || cmd.includes('bacteria') || cmd.includes('virus') || cmd.includes('fungi')) {
      window.bioApp.loadTopic('microorganisms');
      return;
    }
    if (cmd.includes('digestive') || cmd.includes('digestion') || cmd.includes('stomach') || cmd.includes('gut') || cmd.includes('food')) {
      window.bioApp.loadTopic('digestive');
      return;
    }
    if (cmd.includes('animal') || cmd.includes('classification') || cmd.includes('species') || cmd.includes('taxonomy') || cmd.includes('mammal')) {
      window.bioApp.loadTopic('animalClass');
      return;
    }
    if (cmd.includes('ecosystem') || cmd.includes('food web') || cmd.includes('food chain') || cmd.includes('pyramid') || cmd.includes('ecology')) {
      window.bioApp.loadTopic('ecosystem');
      return;
    }

    // 5. Student Study Notes & Exam Commands
    if (cmd.includes('read note') || cmd.includes('read summary') || cmd.includes('notes') || cmd.includes('study note')) {
      if (window.bioStudyNotesUI) {
        window.bioStudyNotesUI.openTab('summary');
        window.bioStudyNotesUI.readCurrentNotes();
      }
      return;
    }

    if (cmd.includes('exam') || cmd.includes('mnemonic') || cmd.includes('test tip') || cmd.includes('trap')) {
      if (window.bioStudyNotesUI) {
        window.bioStudyNotesUI.openTab('exam');
        window.bioStudyNotesUI.readCurrentNotes();
      }
      return;
    }

    if (cmd.includes('deep dive') || cmd.includes('in depth') || cmd.includes('detail') || cmd.includes('mechanism')) {
      if (window.bioStudyNotesUI) {
        window.bioStudyNotesUI.openTab('deepdive');
        window.bioStudyNotesUI.readCurrentNotes();
      }
      return;
    }

    // 6. Video Playback & Navigation Controls
    const currentTopic = window.bioApp?.currentTopicInstance;

    if (cmd.includes('play') || cmd.includes('start video') || cmd.includes('resume') || cmd.includes('unpause')) {
      if (currentTopic && currentTopic.state) {
        currentTopic.state.isPlaying = true;
        const playBtn = document.getElementById('btn-play-pause') || document.querySelector('.play-btn');
        if (playBtn) playBtn.textContent = '⏸ Pause Video';
        if (window.drHelix) window.drHelix.say("Resuming process animation.", 'explaining', false);
      }
      return;
    }

    if (cmd.includes('pause') || cmd.includes('stop video') || cmd.includes('freeze') || cmd.includes('hold')) {
      if (currentTopic && currentTopic.state) {
        currentTopic.state.isPlaying = false;
        const playBtn = document.getElementById('btn-play-pause') || document.querySelector('.play-btn');
        if (playBtn) playBtn.textContent = '▶ Play Video';
        if (window.drHelix) window.drHelix.say("Process video paused.", 'explaining', false);
      }
      return;
    }

    if (cmd.includes('next') || cmd.includes('forward') || cmd.includes('advance')) {
      if (currentTopic && currentTopic.nextStep) {
        currentTopic.nextStep();
      }
      return;
    }

    if (cmd.includes('previous') || cmd.includes('prev') || cmd.includes('back') || cmd.includes('rewind')) {
      if (currentTopic && currentTopic.prevStep) {
        currentTopic.prevStep();
      }
      return;
    }

    if (cmd.includes('replay') || cmd.includes('restart') || cmd.includes('start over') || cmd.includes('beginning')) {
      if (currentTopic && currentTopic.seekStep) {
        currentTopic.seekStep(0, true);
        currentTopic.state.isPlaying = true;
        const playBtn = document.getElementById('btn-play-pause') || document.querySelector('.play-btn');
        if (playBtn) playBtn.textContent = '⏸ Pause Video';
      }
      return;
    }

    // 7. SMART QUESTION-TO-VIDEO MATCHING FOR NATURAL LANGUAGE QUESTIONS
    if (window.smartQuestionEngine) {
      const matched = window.smartQuestionEngine.showVideoForQuestion(cmd, true);
      if (matched) {
        return;
      }
    }

    // Fallback
    if (window.drHelix) {
      window.drHelix.say(`I heard "${cmd}". Say "Teacher Mode" for an 8-step lesson, "Kid Mode" for fun, or ask any question!`, 'explaining', false);
    }
  }

  updateUI() {
    const btn = document.getElementById('btn-toggle-voice');
    const hud = document.getElementById('voice-command-hud');
    const statusText = document.getElementById('voice-status-indicator');

    if (btn) {
      btn.innerHTML = this.isListening 
        ? '<span class="mic-pulse-ring"></span>🎙️ <span>Voice Active</span>' 
        : '🎙️ <span>Voice Control: OFF</span>';
      btn.classList.toggle('active-listening', this.isListening);
    }

    if (hud) {
      hud.classList.toggle('visible', this.isListening);
    }

    if (statusText) {
      statusText.textContent = this.isListening ? '● Listening live...' : 'Mic standby';
    }
  }

  showModalHelp() {
    const modal = document.getElementById('voice-help-modal');
    if (modal) modal.classList.add('open');
  }

  hideModalHelp() {
    const modal = document.getElementById('voice-help-modal');
    if (modal) modal.classList.remove('open');
  }
}

window.bioVoiceCommander = new BioVoiceCommander();
