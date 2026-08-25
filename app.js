// BioProcess Application Coordinator - Clean Video Cinema Engine with Teacher Mode, Voice, Kid Tours, Study Notes & Quiz
class BioApp {
  constructor() {
    this.activeTopicId = 'dnaGenetics';
    this.topicsList = [
      'dnaGenetics',
      'circulatory',
      'respiratory',
      'nervous',
      'photosynthesis',
      'cellStructure',
      'microorganisms',
      'digestive',
      'animalClass',
      'ecosystem'
    ];
  }

  init() {
    this.renderTopNav();
    if (window.bioStudyNotesUI) {
      window.bioStudyNotesUI.init();
    }
    this.bindVoiceUI();
    this.bindQuizUI();
    this.bindTeacherModeUI();
    this.bindKidModeUI();
    this.bindKeyboardShortcuts();
    this.loadTopic('dnaGenetics');
  }

  renderTopNav() {
    const nav = document.getElementById('topic-pills-nav');
    if (!nav) return;

    nav.innerHTML = this.topicsList.map(tId => {
      const topic = window.bioTopics[tId];
      if (!topic) return '';
      const isActive = this.activeTopicId === tId;

      return `
        <button class="topic-pill-btn ${isActive ? 'active' : ''}" data-topic="${tId}">
          <span>${topic.icon}</span>
          <span>${topic.title}</span>
        </button>
      `;
    }).join('');

    nav.querySelectorAll('.topic-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.bioAudio) window.bioAudio.init();
        this.loadTopic(btn.dataset.topic);
      });
    });
  }

  loadTopic(topicId) {
    if (this.currentTopicInstance && this.currentTopicInstance.destroy) {
      this.currentTopicInstance.destroy();
    }

    this.activeTopicId = topicId;
    const topic = window.bioTopics[topicId];
    if (!topic) return;

    // Update active pill button in navbar
    document.querySelectorAll('.topic-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.topic === topicId);
    });

    // Render topic video player into cinema root
    const root = document.getElementById('cinema-player-root');
    if (root) {
      topic.render(root);
      this.currentTopicInstance = topic;

      // Add action buttons to playback controls
      this.injectPlaybackActionButtons();

      // Hook seekStep to update study notes dynamically when step changes
      const origSeek = topic.seekStep;
      const self = this;
      if (origSeek) {
        topic.seekStep = function(idx, speak) {
          origSeek.call(topic, idx, speak);
          if (window.bioStudyNotesUI) {
            window.bioStudyNotesUI.setStep(idx);
          }
          // If on step 5 (index 4), inject completion banner into cinema player if not present
          if (idx === (topic.processSteps?.length - 1)) {
            self.showCinemaCompletionPrompt();
          }
        };
      }
    }

    // Sync student study notes companion side panel
    if (window.bioStudyNotesUI) {
      window.bioStudyNotesUI.setTopic(topicId, 0);
    }
  }

  injectPlaybackActionButtons() {
    const playbackRight = document.querySelector('.playback-right-group');
    if (playbackRight) {
      if (!document.getElementById('btn-cinema-teacher-lesson')) {
        const teacherBtn = document.createElement('button');
        teacherBtn.className = 'video-btn teacher-cinema-btn';
        teacherBtn.id = 'btn-cinema-teacher-lesson';
        teacherBtn.innerHTML = '👩‍🏫 AI Lesson';
        teacherBtn.title = 'Start Dr. Helix 8-Step Biology Lesson';
        teacherBtn.addEventListener('click', () => {
          if (window.teacherLessonEngine) window.teacherLessonEngine.startLesson(this.activeTopicId);
        });
        playbackRight.prepend(teacherBtn);
      }

      if (!document.getElementById('btn-cinema-kid-tour')) {
        const kidBtn = document.createElement('button');
        kidBtn.className = 'video-btn kid-cinema-btn';
        kidBtn.id = 'btn-cinema-kid-tour';
        kidBtn.innerHTML = '🎒 2-Min Story';
        kidBtn.title = 'Start 2-minute interactive storytelling for kids';
        kidBtn.addEventListener('click', () => {
          if (window.kidModeEngine) window.kidModeEngine.startKidTour(this.activeTopicId);
        });
        playbackRight.appendChild(kidBtn);
      }

      if (!document.getElementById('btn-cinema-quiz')) {
        const quizBtn = document.createElement('button');
        quizBtn.className = 'video-btn quiz-cinema-btn';
        quizBtn.id = 'btn-cinema-quiz';
        quizBtn.innerHTML = '🎯 Take Quiz';
        quizBtn.title = 'Test your knowledge on this topic';
        quizBtn.addEventListener('click', () => {
          if (window.bioQuizEngine) window.bioQuizEngine.openQuiz(this.activeTopicId);
        });
        playbackRight.appendChild(quizBtn);
      }
    }
  }

  showCinemaCompletionPrompt() {
    const banner = document.querySelector('.cinema-subtitles-banner');
    if (banner && !document.getElementById('cinema-step5-quiz-prompt')) {
      const prompt = document.createElement('div');
      prompt.id = 'cinema-step5-quiz-prompt';
      prompt.className = 'cinema-completion-chip';
      prompt.innerHTML = `
        <span>🎉 All 5 Steps Explored!</span>
        <button id="btn-cinema-complete-quiz" class="complete-quiz-action-btn">🎯 Start Knowledge Quiz</button>
      `;
      banner.appendChild(prompt);

      document.getElementById('btn-cinema-complete-quiz')?.addEventListener('click', () => {
        if (window.bioQuizEngine) window.bioQuizEngine.openQuiz(this.activeTopicId);
      });
    }
  }

  bindTeacherModeUI() {
    const headerTeacherBtn = document.getElementById('btn-header-teacher-mode');
    if (headerTeacherBtn) {
      headerTeacherBtn.addEventListener('click', () => {
        if (window.bioAudio) window.bioAudio.init();
        if (window.teacherLessonEngine) {
          window.teacherLessonEngine.startLesson(this.activeTopicId);
        }
      });
    }
  }

  bindKidModeUI() {
    const headerKidBtn = document.getElementById('btn-header-kid-mode');
    if (headerKidBtn) {
      headerKidBtn.addEventListener('click', () => {
        if (window.bioAudio) window.bioAudio.init();
        if (window.kidModeEngine) {
          window.kidModeEngine.startKidTour(this.activeTopicId);
        }
      });
    }
  }

  bindQuizUI() {
    const headerQuizBtn = document.getElementById('btn-header-quiz');
    const closeQuizModalBtn = document.getElementById('btn-close-quiz-modal');
    const quizModal = document.getElementById('quiz-mastery-modal');

    if (headerQuizBtn) {
      headerQuizBtn.addEventListener('click', () => {
        if (window.bioAudio) window.bioAudio.init();
        if (window.bioQuizEngine) window.bioQuizEngine.openQuiz(this.activeTopicId);
      });
    }

    if (closeQuizModalBtn) {
      closeQuizModalBtn.addEventListener('click', () => {
        if (window.bioQuizEngine) window.bioQuizEngine.closeQuiz();
      });
    }

    if (quizModal) {
      quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) {
          if (window.bioQuizEngine) window.bioQuizEngine.closeQuiz();
        }
      });
    }
  }

  bindVoiceUI() {
    // 1. Header Voice Toggle Button
    const voiceToggleBtn = document.getElementById('btn-toggle-voice');
    if (voiceToggleBtn) {
      voiceToggleBtn.addEventListener('click', () => {
        if (window.bioAudio) window.bioAudio.init();
        if (window.bioVoiceCommander) {
          window.bioVoiceCommander.toggleListening();
        }
      });
    }

    // 2. Help Modal Open & Close
    const helpBtn = document.getElementById('btn-voice-help');
    const closeBtn = document.getElementById('btn-close-modal');
    const modal = document.getElementById('voice-help-modal');

    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        if (window.bioVoiceCommander) window.bioVoiceCommander.showModalHelp();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.bioVoiceCommander) window.bioVoiceCommander.hideModalHelp();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (window.bioVoiceCommander) window.bioVoiceCommander.hideModalHelp();
        }
      });
    }

    // 3. Quick Chips and Modal Command Clicks
    document.querySelectorAll('.voice-chip-btn, .cmd-item[data-cmd]').forEach(el => {
      el.addEventListener('click', () => {
        const cmd = el.dataset.cmd;
        if (cmd && window.bioVoiceCommander) {
          if (window.bioAudio) window.bioAudio.init();
          window.bioVoiceCommander.showTranscript(cmd);
          window.bioVoiceCommander.processCommand(cmd);
          if (modal && modal.classList.contains('open')) {
            window.bioVoiceCommander.hideModalHelp();
          }
        }
      });
    });

    // 4. Manual Voice Command Input Form
    const cmdForm = document.getElementById('voice-cmd-form');
    const cmdInput = document.getElementById('voice-manual-input');
    if (cmdForm && cmdInput) {
      cmdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = cmdInput.value.trim();
        if (val && window.bioVoiceCommander) {
          if (window.bioAudio) window.bioAudio.init();
          window.bioVoiceCommander.showTranscript(val);
          window.bioVoiceCommander.processCommand(val);
          cmdInput.value = '';
        }
      });
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const topic = this.currentTopicInstance;

      // 'T' key: Start AI Teacher 8-Step Lesson
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        if (window.teacherLessonEngine) {
          if (window.teacherLessonEngine.isActive) window.teacherLessonEngine.stopLesson();
          else window.teacherLessonEngine.startLesson(this.activeTopicId);
        }
        return;
      }

      // 'K' key: Start 2-Minute Kid Tour
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        if (window.kidModeEngine) {
          if (window.kidModeEngine.isActive) window.kidModeEngine.stopKidTour();
          else window.kidModeEngine.startKidTour(this.activeTopicId);
        }
        return;
      }

      // 'Q' key: Open Quiz
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        if (window.bioQuizEngine) {
          if (window.bioQuizEngine.isQuizActive) window.bioQuizEngine.closeQuiz();
          else window.bioQuizEngine.openQuiz(this.activeTopicId);
        }
        return;
      }

      // 'V' key: Toggle voice control
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        if (window.bioAudio) window.bioAudio.init();
        if (window.bioVoiceCommander) {
          window.bioVoiceCommander.toggleListening();
        }
        return;
      }

      // 'N' key: Read study notes aloud
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        if (window.bioStudyNotesUI) {
          window.bioStudyNotesUI.readCurrentNotes();
        }
        return;
      }

      // Number keys 1-4 or A-D during active quiz
      if (window.bioQuizEngine && window.bioQuizEngine.isQuizActive) {
        if (['1', 'a', 'A'].includes(e.key)) { window.bioQuizEngine.answerByLetter('A'); return; }
        if (['2', 'b', 'B'].includes(e.key)) { window.bioQuizEngine.answerByLetter('B'); return; }
        if (['3', 'c', 'C'].includes(e.key)) { window.bioQuizEngine.answerByLetter('C'); return; }
        if (['4', 'd', 'D'].includes(e.key)) { window.bioQuizEngine.answerByLetter('D'); return; }
      }

      // '?' key: Open voice command help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        if (window.bioVoiceCommander) window.bioVoiceCommander.showModalHelp();
        return;
      }

      if (!topic) return;

      if (e.code === 'Space') {
        e.preventDefault();
        const playBtn = document.querySelector('.play-btn') || document.querySelector('.primary-video-btn') || document.getElementById('btn-play-pause');
        if (playBtn) playBtn.click();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (topic.nextStep) topic.nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (topic.prevStep) topic.prevStep();
      } else if (e.key === 'm' || e.key === 'M') {
        if (window.bioSpeech) {
          const isEnabled = window.bioSpeech.toggleSpeech();
          const voiceBtn = document.getElementById('btn-video-voice') || document.getElementById('btn-voice');
          if (voiceBtn) voiceBtn.textContent = isEnabled ? '🔊 Voice' : '🔇 Muted';
        }
      } else if (e.key === 'f' || e.key === 'F') {
        const cinema = document.getElementById('cinema-player-root');
        if (cinema) {
          if (!document.fullscreenElement) cinema.requestFullscreen?.();
          else document.exitFullscreen?.();
        }
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.bioApp = new BioApp();
  window.bioApp.init();
});
