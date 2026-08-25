import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Award,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Maximize2,
  RefreshCw,
  Search,
  List
} from 'lucide-react';
import { audioService } from '../services/audioService';
import { aiEngine } from '../services/aiEngine';
import { CONCEPTS, SUBJECTS } from '../data/curriculumData';
import VisualRenderer from './visualizers/VisualRenderer';
import ThreeMinuteLessonPlayer from './ThreeMinuteLessonPlayer';

export default function Classroom({
  concept,
  onSelectConcept,
  onOpenQuiz,
  onOpenDisambiguation,
  onBackToSubjects
}) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);
  const [activeExample, setActiveExample] = useState(concept?.examples?.[0] || null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);

  // Sync active example when concept changes
  useEffect(() => {
    if (concept?.examples && concept.examples.length > 0) {
      setActiveExample(concept.examples[0]);
    }
  }, [concept]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      audioService.stopSpeaking();
      audioService.stopListening();
    };
  }, []);

  const [lastSpokenQuery, setLastSpokenQuery] = useState('');
  const [isAnsweringVoice, setIsAnsweringVoice] = useState(false);

  // Handle Query Submission (Text or Voice)
  const handleQuerySubmit = (queryText, isFromVoice = false) => {
    const q = (queryText || inputText).trim();
    if (!q) return;

    audioService.playClickSound();
    setIsAiProcessing(true);
    setLastSpokenQuery(q);

    setTimeout(() => {
      const result = aiEngine.understandTopic(q);
      setIsAiProcessing(false);

      if (result.status === 'matched') {
        onSelectConcept(result.concept);
        setInputText('');

        // Check if query had a specific action to highlight
        const extracted = aiEngine.extractVisualElements(q);
        if (extracted.action && result.concept.examples) {
          const matchedEx = result.concept.examples.find(e => e.action === extracted.action);
          if (matchedEx) {
            setActiveExample(matchedEx);
          }
        }

        // AUTOMATIC VOICE ANSWER: Speak the answer aloud to the student!
        setIsAnsweringVoice(true);
        setIsSpeaking(true);
        const vocalAnswer = `I understand your question about ${result.concept.title}. ${result.concept.explanation}. Notice the key rule: ${result.concept.rule}.`;
        audioService.speak(vocalAnswer, {
          rate: speechRate,
          onStart: () => {
            setIsSpeaking(true);
            setIsAnsweringVoice(true);
          },
          onEnd: () => {
            setIsSpeaking(false);
            setIsAnsweringVoice(false);
            setHighlightedWordIndex(null);
          }
        });

      } else if (result.status === 'disambiguation_needed' || result.status === 'low_confidence') {
        if (onOpenDisambiguation) {
          onOpenDisambiguation({
            query: q,
            suggestions: result.suggestions || []
          });
        }
      }
    }, 400);
  };

  // Toggle Voice Input (Speech-to-Text)
  const toggleVoiceInput = () => {
    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
      setInterimSpeech('');
    } else {
      setInterimSpeech('');
      const started = audioService.startListening({
        onInterim: (text) => {
          setInterimSpeech(text);
          setInputText(text);
        },
        onResult: (finalText) => {
          setIsListening(false);
          setInputText(finalText);
          setInterimSpeech('');
          handleQuerySubmit(finalText);
        },
        onError: (err) => {
          setIsListening(false);
          setInterimSpeech('');
          console.warn("Speech recognition error:", err);
        },
        onEnd: () => {
          setIsListening(false);
          setInterimSpeech('');
        }
      });
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Toggle AI Voice Explanation (Text-To-Speech)
  const toggleSpeechNarration = () => {
    if (isSpeaking) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
      setHighlightedWordIndex(null);
    } else {
      if (!concept) return;
      audioService.playClickSound();
      setIsSpeaking(true);

      const fullNarration = `${concept.title}. ${concept.explanation}. Key Rule: ${concept.rule}. For example: ${activeExample ? activeExample.sentence : ''}`;
      
      audioService.speak(fullNarration, {
        rate: speechRate,
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setHighlightedWordIndex(null);
        },
        onBoundary: ({ charIndex, charLength }) => {
          // Track word index for live highlight
          setHighlightedWordIndex(charIndex);
        }
      });
    }
  };

  // Select an Example from Example List
  const handleSelectExample = (ex) => {
    audioService.playClickSound();
    setActiveExample(ex);
  };

  const currentSubject = SUBJECTS.find(s => s.id === concept?.subjectId) || SUBJECTS[0];

  return (
    <div className="classroom-main-layout">
      {/* ================= LEFT PANE: INPUT & TOPIC TREE ================= */}
      <aside className="classroom-left-pane">
        <div className="pane-card input-control-panel">
          <div className="panel-title-row">
            <span className="panel-badge">1. Voice / Text Input</span>
            <span className="live-status-pill">{isListening ? '🎤 Listening...' : '⚡ AI Ready'}</span>
          </div>

          {/* Voice Input Button */}
          <div className="voice-mic-container">
            <button
              onClick={toggleVoiceInput}
              className={`big-mic-btn ${isListening ? 'mic-listening' : ''}`}
              title="Click and speak your educational question!"
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              {isListening && <div className="mic-ripple-ring"></div>}
            </button>
            <span className="mic-caption">
              {isListening ? 'Listening to your voice...' : 'Click Mic to Ask with Voice'}
            </span>
          </div>

          {/* Text Input & Submit */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleQuerySubmit(); }}
            className="text-input-form"
          >
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Ask or type a topic (e.g. Present continuous)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="classroom-input-field"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isAiProcessing}
                className="btn-send-query"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* Interim speech or AI Status */}
          {interimSpeech && (
            <div className="speech-transcript-box">
              <span className="transcript-label">🎤 You are saying:</span>
              <p className="transcript-text">“{interimSpeech}”</p>
            </div>
          )}

          {/* Spoken Query & Live AI Voice Answer Status */}
          {lastSpokenQuery && (
            <div className="spoken-answer-card">
              <div className="spoken-header">
                <Volume2 size={16} className={`text-indigo-600 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? '🗣️ AI Speaking Answer Aloud...' : '✅ AI Answered Question'}</span>
              </div>
              <p className="query-quote">“{lastSpokenQuery}”</p>
              {isSpeaking && (
                <div className="voice-waves-visual">
                  <span className="wave-bar w1"></span>
                  <span className="wave-bar w2"></span>
                  <span className="wave-bar w3"></span>
                  <span className="wave-bar w4"></span>
                  <span className="wave-bar w5"></span>
                </div>
              )}
            </div>
          )}

          {/* Suggested Natural Language Prompts (Different Phrasings) */}
          <div className="suggested-prompts-section">
            <span className="prompts-heading">💡 Ask in different ways:</span>
            <div className="prompt-chips">
              {[
                'What is the tense used for something happening now?',
                'How to talk about actions that happened yesterday?',
                'What are doing words called?',
                'Show me position of ball under the table',
                'How to divide a pizza equally into slices?',
                'Why do volcanoes erupt hot lava?',
                'How do computers count using 0 and 1?'
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setInputText(p); handleQuerySubmit(p); }}
                  className="prompt-chip"
                >
                  <span className="chip-arrow">💬</span>
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Subject & Topic Hierarchy Tree */}
        <div className="pane-card topic-tree-panel">
          <div className="panel-title-row">
            <span className="panel-badge">Subject Topics</span>
            <button onClick={onBackToSubjects} className="btn-all-subjects">
              <List size={14} />
              <span>Change Subject</span>
            </button>
          </div>

          <div className="active-subject-header" style={{ color: currentSubject.color }}>
            <span className="subject-icon">{currentSubject.icon}</span>
            <strong>{currentSubject.name} Concepts</strong>
          </div>

          <div className="subject-concepts-list">
            {Object.values(CONCEPTS)
              .filter(c => c.subjectId === currentSubject.id)
              .map(c => (
                <button
                  key={c.id}
                  onClick={() => { audioService.playClickSound(); onSelectConcept(c); }}
                  className={`topic-tree-item ${concept?.id === c.id ? 'active-topic' : ''}`}
                >
                  <span className="topic-bullet"></span>
                  <span className="topic-name">{c.title}</span>
                </button>
              ))}
          </div>
        </div>
      </aside>

      {/* ================= CENTER PANE: LARGE VISUAL LEARNING AREA ================= */}
      <main className="classroom-center-pane">
        <div className="visual-stage-card">
          {/* Visual Area Header */}
          <div className="visual-stage-header">
            <div className="stage-title-box">
              <span className="stage-badge">2. Large Visual Learning Area</span>
              <h2>{concept?.title || 'Visual Simulation'}</h2>
            </div>

            <div className="stage-header-actions">
              <div className="usp-mini-tag">
                <span>🎬 Visual Teaching Engine</span>
              </div>
            </div>
          </div>

          {/* Core Interactive Visual Canvas */}
          <div className="visual-canvas-wrapper">
            <VisualRenderer
              concept={concept}
              activeExample={activeExample}
              onSelectExample={handleSelectExample}
              onOpenQuiz={() => onOpenQuiz(concept)}
            />
          </div>

          {/* 3-Minute Interactive Structured Visual Lesson Player */}
          <div className="three-min-player-section">
            <ThreeMinuteLessonPlayer
              concept={concept}
              activeExample={activeExample}
              onLaunchQuiz={() => onOpenQuiz(concept)}
            />
          </div>

          {/* Visual Area Footer Toolbar */}
          <div className="visual-stage-footer">
            <div className="active-scene-info">
              <span className="scene-indicator-dot"></span>
              <span>Visualizing: <strong>{activeExample ? activeExample.sentence : concept?.title}</strong></span>
            </div>

            <button
              onClick={() => onOpenQuiz(concept)}
              className="btn-launch-quiz"
            >
              <Award size={18} />
              <span>Let's Check Your Understanding (Quiz)</span>
            </button>
          </div>
        </div>
      </main>

      {/* ================= RIGHT PANE: AI EXPLANATION & EXAMPLES ================= */}
      <aside className="classroom-right-pane">
        {/* A. Simple Explanation & Voice Narration */}
        <div className="pane-card explanation-card">
          <div className="panel-title-row">
            <span className="panel-badge">3. AI Multi-Modal Explanation</span>
            <button
              onClick={toggleSpeechNarration}
              className={`btn-listen-voice ${isSpeaking ? 'voice-active' : ''}`}
              title="Hear AI Teacher speak this explanation aloud"
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isSpeaking ? 'Pause Voice' : '🔊 Listen'}</span>
            </button>
          </div>

          <div className="explanation-body">
            <h3 className="concept-heading">{concept?.title}</h3>
            <p className="explanation-paragraph">{concept?.explanation}</p>
          </div>

          {/* B. Key Concept / Grammar Rule */}
          <div className="key-rule-card">
            <div className="rule-badge-tag">
              <Sparkles size={14} className="text-amber-500" />
              <span>Key Concept Rule</span>
            </div>
            <p className="rule-formula">{concept?.rule}</p>
          </div>

          {/* C. Visual Concept & Object Extraction */}
          <div className="visual-objects-section">
            <span className="objects-heading">Identified Visual Objects & Concepts:</span>
            <div className="objects-tag-cloud">
              {concept?.visualObjects?.map((vo, i) => (
                <div key={i} className="object-pill">
                  <span className="obj-dot"></span>
                  <span className="obj-name">{vo.name}</span>
                  <small className="obj-type">{vo.tag}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* D. Interactive Visual Examples (2-3 Examples) */}
        <div className="pane-card examples-list-card">
          <div className="panel-title-row">
            <span className="panel-badge">Interactive Examples</span>
            <span className="examples-count">{concept?.examples?.length || 0} Visuals</span>
          </div>

          <p className="examples-helper-text">Click any example to instantly transform the visual animation:</p>

          <div className="examples-vertical-list">
            {concept?.examples?.map((ex, idx) => (
              <div
                key={ex.id || idx}
                onClick={() => handleSelectExample(ex)}
                className={`example-item-card ${activeExample?.id === ex.id ? 'active-example' : ''}`}
              >
                <div className="ex-header-row">
                  <span className="ex-num-badge">Example {idx + 1}</span>
                  {activeExample?.id === ex.id && <span className="active-indicator">Current Visual 🎬</span>}
                </div>
                <p className="ex-sentence font-bold">“{ex.sentence}”</p>
                {ex.visualDescription && (
                  <p className="ex-visual-desc">➔ {ex.visualDescription}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
