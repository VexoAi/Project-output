// BioProcess Interactive Student Study Companion & Real-Time Live AI Scribe
class BioStudyNotesUI {
  constructor() {
    this.activeTab = 'live'; // 'live' | 'summary' | 'deepdive' | 'exam' | 'vocab' | 'clinical'
    this.currentTopicId = 'dnaGenetics';
    this.currentStepIdx = 0;
    this.isPanelCollapsed = false;
    this.liveNotes = []; // Stores real-time transcribed spoken notes
    this.isSpeaking = false;
    this.currentSpeakingText = '';

    // Keywords dictionary for automatic real-time term highlighting
    this.highlightKeywords = [
      'DNA', 'RNA', 'Deoxyribonucleic Acid', 'Double-Helix', 'Double Helix', 'Adenine', 'Thymine', 'Cytosine', 'Guanine',
      'Hydrogen Bonds', 'Complementary Base Pairing', 'Chromosomes', 'Genes', 'Inheritance', 'Punnett Square',
      'Heart', 'Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle', 'Aorta', 'Arteries', 'Veins', 'Capillaries',
      'Pulmonary Circuit', 'Systemic Circuit', 'Red Blood Cells', 'Oxygen', 'SpO2', 'Tidal Volume',
      'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli', 'Diaphragm', 'Gas Exchange', 'Diffusion', 'Carbon Dioxide',
      'Peristalsis', 'Amylase', 'Pepsin', 'Hydrochloric Acid', 'HCl', 'Chyme', 'Bile', 'Small Intestine', 'Villi', 'Microvilli', 'Colon',
      'Neuron', 'Action Potential', 'Synapse', 'Synaptic Cleft', 'Neurotransmitter', 'Reflex Arc', 'Myelin Sheath',
      'Chloroplast', 'Chlorophyll', 'Thylakoid', 'Stroma', 'Calvin Cycle', 'Glucose', 'Stomata', 'Photons',
      'Mitochondria', 'ATP', 'Nucleus', 'Ribosomes', 'Endoplasmic Reticulum', 'Golgi Apparatus', 'Cell Wall', 'Vacuole',
      'Vertebrate', 'Invertebrate', 'Mammals', 'Aves', 'Reptilia', 'Amphibia', 'Pisces', 'Kingdom Animalia', 'Plantae', 'Fungi', 'Protista', 'Monera',
      'Bacteria', 'Antibiotic', 'Penicillin', 'Zone of Inhibition', 'Macrophage', 'Phagocytosis', 'Food Web', 'Trophic Level', 'Producers', 'Consumers'
    ];
  }

  init() {
    this.renderPanel();
    this.bindEvents();
    this.listenToLiveSpeech();
  }

  setTopic(topicId, stepIdx = 0) {
    this.currentTopicId = topicId;
    this.currentStepIdx = stepIdx;
    this.renderContent();
  }

  setStep(stepIdx) {
    this.currentStepIdx = stepIdx;
    if (this.activeTab === 'deepdive') {
      this.renderContent();
    } else {
      const stepBadge = document.getElementById('notes-step-badge');
      if (stepBadge) stepBadge.textContent = `Step ${stepIdx + 1}/5`;
    }

    if (stepIdx === 4) {
      const banner = document.getElementById('topic-completion-banner');
      if (banner) banner.classList.add('visible');
    }
  }

  listenToLiveSpeech() {
    window.addEventListener('helix-speech-start', (e) => {
      const { text, topicId, timestamp } = e.detail;
      this.isSpeaking = true;
      this.currentSpeakingText = text;

      // Extract highlights and takeaways in real-time
      const noteEntry = this.processSpokenNote(text, topicId, timestamp);
      this.liveNotes.unshift(noteEntry); // Newest on top

      // Keep max 50 live notes
      if (this.liveNotes.length > 50) this.liveNotes.pop();

      this.updateLiveScribeBadge(true, text);

      // If active tab is live, re-render immediately
      if (this.activeTab === 'live') {
        this.renderLiveNotes();
      }

      // Update Live Notes count chip
      const countChip = document.getElementById('live-notes-count');
      if (countChip) countChip.textContent = this.liveNotes.length;
    });

    window.addEventListener('helix-speech-end', () => {
      this.isSpeaking = false;
      this.updateLiveScribeBadge(false);
      if (this.activeTab === 'live') {
        const liveIndicator = document.getElementById('live-active-speaker-status');
        if (liveIndicator) liveIndicator.style.display = 'none';
      }
    });
  }

  processSpokenNote(rawText, topicId, timestamp) {
    const cleanText = rawText.trim();
    
    // Auto-detect matching keywords in spoken sentence
    const detectedKeywords = this.highlightKeywords.filter(k => 
      new RegExp(`\\b${k}\\b`, 'i').test(cleanText)
    );

    // Format with highlighted keywords
    let highlightedText = cleanText;
    detectedKeywords.forEach(k => {
      const regex = new RegExp(`\\b(${k})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="live-kw-highlight">$1</span>');
    });

    // Generate quick key takeaway bullet
    let keyTakeaway = cleanText;
    if (cleanText.includes(':')) {
      keyTakeaway = cleanText.split(':')[1].trim();
    }

    return {
      id: 'note_' + Date.now(),
      topicId: topicId || this.currentTopicId,
      timestamp: timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawText: cleanText,
      highlightedText: highlightedText,
      keywords: detectedKeywords,
      keyTakeaway: keyTakeaway,
      step: this.currentStepIdx + 1
    };
  }

  updateLiveScribeBadge(isSpeaking, activeText = '') {
    const badge = document.getElementById('live-scribe-header-pill');
    if (badge) {
      if (isSpeaking) {
        badge.innerHTML = `<span class="live-pulse-dot" style="background:#22c55e;"></span> ✍️ Live Scribing...`;
        badge.style.borderColor = 'rgba(34, 197, 94, 0.6)';
        badge.style.color = '#86efac';
      } else {
        badge.innerHTML = `<span class="live-pulse-dot" style="background:#38bdf8;"></span> 🎙️ AI Scribe Ready`;
        badge.style.borderColor = 'rgba(56, 189, 248, 0.3)';
        badge.style.color = '#38bdf8';
      }
    }
  }

  renderPanel() {
    const container = document.getElementById('study-notes-sidebar-root');
    if (!container) return;

    container.innerHTML = `
      <aside class="study-notes-panel" id="study-notes-panel">
        <!-- Panel Top Header -->
        <div class="notes-panel-header">
          <div class="notes-header-left">
            <span class="notes-header-icon">📚</span>
            <div>
              <h3 class="notes-header-title">Live Study Notes</h3>
              <span class="notes-header-sub" id="notes-topic-tag">Real-Time Speech Companion</span>
            </div>
          </div>

          <div class="notes-header-actions">
            <button class="notes-action-btn" id="btn-copy-live-notes" title="Copy Live Notes to Clipboard">
              📋 Copy
            </button>
            <button class="notes-action-btn" id="btn-clear-live-notes" title="Clear Live Notes">
              🗑️ Clear
            </button>
            <button class="notes-action-btn toggle-collapse" id="btn-toggle-notes-panel" title="Toggle Sidebar">
              ◧
            </button>
          </div>
        </div>

        <!-- Sticky Live Scribe Status Banner -->
        <div style="padding: 6px 14px; background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid var(--bg-card-border); display: flex; justify-content: space-between; align-items: center;">
          <div id="live-scribe-header-pill" style="display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; color:#38bdf8; background:rgba(2, 132, 199, 0.15); padding:3px 10px; border-radius:14px; border:1px solid rgba(56,189,248,0.3);">
            <span class="live-pulse-dot"></span> 🎙️ AI Scribe Ready
          </div>
          <span style="font-size:10px; color:#94a3b8;">Auto-generates as AI speaks</span>
        </div>

        <!-- Navigation Tabs -->
        <div class="notes-tab-bar" id="notes-tab-bar">
          <button class="notes-tab-btn ${this.activeTab === 'live' ? 'active' : ''}" data-tab="live" style="color:#38bdf8; font-weight:800;">
            🔴 Live Notes <span class="tab-chip" id="live-notes-count">${this.liveNotes.length}</span>
          </button>
          <button class="notes-tab-btn ${this.activeTab === 'summary' ? 'active' : ''}" data-tab="summary">
            📝 Guide
          </button>
          <button class="notes-tab-btn ${this.activeTab === 'deepdive' ? 'active' : ''}" data-tab="deepdive">
            🔬 Step In-Depth <span class="tab-chip" id="notes-step-badge">Step 1</span>
          </button>
          <button class="notes-tab-btn ${this.activeTab === 'exam' ? 'active' : ''}" data-tab="exam">
            🧠 Exam Tips
          </button>
          <button class="notes-tab-btn ${this.activeTab === 'vocab' ? 'active' : ''}" data-tab="vocab">
            📖 Glossary
          </button>
        </div>

        <!-- Tab Content Body Area -->
        <div class="notes-body-scroll" id="notes-body-content">
          <!-- Injected dynamically -->
        </div>

        <!-- Interactive Topic Completion Quiz Prompt Banner -->
        <div class="topic-completion-banner" id="topic-completion-banner">
          <div class="completion-banner-inner">
            <span class="completion-icon">🎉</span>
            <div class="completion-text">
              <strong>Topic Steps Complete!</strong>
              <span>Ready to test your biological mastery?</span>
            </div>
            <button class="completion-quiz-btn" id="btn-take-completion-quiz">🎯 Take Quiz</button>
          </div>
        </div>
      </aside>
    `;

    this.renderContent();
  }

  renderLiveNotes() {
    const body = document.getElementById('notes-body-content');
    if (!body) return;

    if (this.liveNotes.length === 0) {
      body.innerHTML = `
        <div style="padding:16px 8px; text-align:center; color:#94a3b8;">
          <div style="font-size:24px; margin-bottom:6px;">✍️</div>
          <h4 style="color:#e2e8f0; font-size:12px; margin-bottom:4px;">Live AI Scribe Ready</h4>
          <p style="font-size:10.5px; line-height:1.45; margin:0 auto; max-width:200px;">Click <strong>▶ Play</strong> or ask Dr. Helix to see real-time notes streaming live!</p>
          <div style="margin-top:10px; display:inline-flex; align-items:center; gap:5px; background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.3); padding:3px 8px; border-radius:12px; font-size:9.5px; color:#38bdf8;">
            <span class="live-pulse-dot" style="width:5px; height:5px;"></span> Listening to voice...
          </div>
        </div>
      `;
      return;
    }

    body.innerHTML = `
      <div class="live-notes-feed" style="display:flex; flex-direction:column; gap:8px; padding:6px 4px;">
        ${this.isSpeaking ? `
          <div id="live-active-speaker-status" style="background:rgba(34, 197, 94, 0.12); border:1px solid rgba(34, 197, 94, 0.4); border-radius:6px; padding:5px 8px; display:flex; align-items:center; gap:6px;">
            <span class="live-pulse-dot" style="background:#22c55e; width:5px; height:5px;"></span>
            <div style="font-size:10px; color:#86efac; font-weight:700;">
              Dr. Helix speaking ⬇️
            </div>
          </div>
        ` : ''}

        ${this.liveNotes.map(n => `
          <div class="live-note-card" style="background:rgba(30,41,59,0.85); border:1px solid rgba(56,189,248,0.2); border-left:3px solid #38bdf8; border-radius:6px; padding:8px 9px; box-shadow:0 2px 8px rgba(0,0,0,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:9px; font-weight:bold; color:#fef08a; background:rgba(254,240,138,0.12); padding:1px 5px; border-radius:6px;">
                📌 Step ${n.step}
              </span>
              <span style="font-size:8.5px; color:#94a3b8;">${n.timestamp}</span>
            </div>
            
            <div style="font-size:11px; color:#f1f5f9; line-height:1.45;">
              ${n.highlightedText}
            </div>

            ${n.keywords.length > 0 ? `
              <div style="display:flex; gap:3px; flex-wrap:wrap; margin-top:5px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.05);">
                ${n.keywords.map(k => `<span style="font-size:8px; font-weight:bold; color:#38bdf8; background:rgba(56,189,248,0.12); padding:1px 4px; border-radius:3px;">${k}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    // Scroll to top of the feed to see newest note
    body.scrollTop = 0;
  }

  renderContent(searchQuery = '') {
    const body = document.getElementById('notes-body-content');
    const topicTag = document.getElementById('notes-topic-tag');
    const stepBadge = document.getElementById('notes-step-badge');
    const data = window.bioStudyNotes ? window.bioStudyNotes[this.currentTopicId] : null;

    if (!body) return;

    if (this.activeTab === 'live') {
      this.renderLiveNotes();
      return;
    }

    if (!data) return;

    if (topicTag) topicTag.textContent = `${data.icon} ${data.title}`;
    if (stepBadge) stepBadge.textContent = `Step ${this.currentStepIdx + 1}/5`;

    const q = searchQuery.toLowerCase().trim();

    if (this.activeTab === 'summary') {
      body.innerHTML = `
        <div class="notes-section" style="padding:14px;">
          <div class="notes-category-badge">${data.category}</div>
          <h4 class="notes-section-title">${data.icon} ${data.title}</h4>
          
          <div class="notes-formula-card">
            <span class="formula-label">⚡ Core Principle / Equation</span>
            <div class="formula-code">${data.coreFormula}</div>
          </div>

          <div class="notes-overview-text">
            ${data.overview}
          </div>

          ${data.interactiveIdea ? `
            <div class="notes-interactive-idea-banner">
              <span class="idea-icon">💡</span>
              <div class="idea-content">
                <span class="idea-tag">INTERACTIVE SIMULATION CONCEPT</span>
                <p class="idea-text">${data.interactiveIdea}</p>
              </div>
            </div>
          ` : ''}

          <h5 class="notes-subheading">📌 High-Yield Key Points</h5>
          <ul class="notes-points-list">
            ${data.keyPoints
              .filter(pt => !q || pt.toLowerCase().includes(q))
              .map(pt => `<li>${this.formatMarkdown(pt)}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if (this.activeTab === 'deepdive') {
      const stepData = data.stepDeepDives[this.currentStepIdx] || data.stepDeepDives[0];
      body.innerHTML = `
        <div class="notes-section" style="padding:14px;">
          <div class="notes-step-tracker-row">
            <span class="deepdive-badge">Active Step ${stepData.step} of 5</span>
            <div class="step-mini-pills">
              ${data.stepDeepDives.map((sd, i) => `
                <button class="mini-step-btn ${i === this.currentStepIdx ? 'active' : ''}" data-step="${i}">
                  ${i + 1}
                </button>
              `).join('')}
            </div>
          </div>

          <h4 class="notes-section-title">${stepData.title}</h4>

          <div class="deepdive-content-card">
            <p class="deepdive-text">${stepData.content}</p>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'exam') {
      body.innerHTML = `
        <div class="notes-section" style="padding:14px;">
          <h4 class="notes-section-title">🧠 Exam Tips & Mnemonics</h4>
          <div class="exam-tips-list">
            ${data.examTips
              .filter(tip => !q || tip.toLowerCase().includes(q))
              .map(tip => `
                <div class="exam-tip-card">
                  ${this.formatMarkdown(tip)}
                </div>
              `).join('')}
          </div>
        </div>
      `;
    } else if (this.activeTab === 'vocab') {
      body.innerHTML = `
        <div class="notes-section" style="padding:14px;">
          <h4 class="notes-section-title">📖 Key Vocabulary Glossary</h4>
          <div class="vocab-grid">
            ${data.vocabulary
              .filter(v => !q || v.term.toLowerCase().includes(q) || v.definition.toLowerCase().includes(q))
              .map(v => `
                <div class="vocab-card">
                  <div class="vocab-term-row">
                    <span class="vocab-term">${v.term}</span>
                    <button class="vocab-audio-btn" data-word="${v.term}" title="Pronounce term">🔊</button>
                  </div>
                  <p class="vocab-def">${v.definition}</p>
                </div>
              `).join('')}
          </div>
        </div>
      `;
    }

    this.bindDynamicContentEvents();
  }

  bindEvents() {
    // 1. Tab Bar switching
    document.querySelectorAll('.notes-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.notes-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
        this.renderContent();
        if (window.bioAudio) window.bioAudio.playClick();
      });
    });

    // 2. Copy Live Notes button
    document.getElementById('btn-copy-live-notes')?.addEventListener('click', () => {
      this.copyLiveNotesToClipboard();
    });

    // 3. Clear Live Notes button
    document.getElementById('btn-clear-live-notes')?.addEventListener('click', () => {
      this.liveNotes = [];
      this.renderLiveNotes();
      const countChip = document.getElementById('live-notes-count');
      if (countChip) countChip.textContent = '0';
    });

    // 4. Toggle Collapse
    document.getElementById('btn-toggle-notes-panel')?.addEventListener('click', () => {
      const panel = document.getElementById('study-notes-panel');
      const container = document.querySelector('.cinema-main-container');
      if (panel && container) {
        this.isPanelCollapsed = !this.isPanelCollapsed;
        panel.classList.toggle('collapsed', this.isPanelCollapsed);
        container.classList.toggle('notes-collapsed', this.isPanelCollapsed);
      }
    });

    // 5. Completion banner quiz button
    document.getElementById('btn-take-completion-quiz')?.addEventListener('click', () => {
      if (window.bioQuizEngine) {
        window.bioQuizEngine.openQuiz(this.currentTopicId);
      }
    });
  }

  bindDynamicContentEvents() {
    // Mini step buttons in deep-dive tab
    document.querySelectorAll('.mini-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step);
        if (window.bioApp && window.bioApp.currentTopicInstance?.seekStep) {
          window.bioApp.currentTopicInstance.seekStep(step, true);
        }
      });
    });

    // Vocabulary pronunciation buttons
    document.querySelectorAll('.vocab-audio-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        if (word && window.bioSpeech) {
          window.bioSpeech.speak(word);
        }
      });
    });
  }

  copyLiveNotesToClipboard() {
    if (this.liveNotes.length === 0) return;

    let text = `=== Live Biology Notes (Topic: ${this.currentTopicId}) ===\n\n`;
    this.liveNotes.forEach(n => {
      text += `[Step ${n.step} • ${n.timestamp}]\n${n.rawText}\n`;
      if (n.keywords.length > 0) {
        text += `Key Terms: ${n.keywords.join(', ')}\n`;
      }
      text += `\n`;
    });

    navigator.clipboard?.writeText(text).then(() => {
      const btn = document.getElementById('btn-copy-live-notes');
      if (btn) {
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy', 2000);
      }
    });
  }

  formatMarkdown(str) {
    if (!str) return '';
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }
}

window.bioStudyNotesUI = new BioStudyNotesUI();

