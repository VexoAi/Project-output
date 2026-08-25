import React, { useState } from 'react';
import { Mic, MicOff, Search, ArrowRight, ArrowLeft, Sparkles, BookOpen, Layers } from 'lucide-react';
import { CONCEPTS } from '../data/curriculumData';
import { audioService } from '../services/audioService';
import { aiEngine } from '../services/aiEngine';

export default function ConceptBrowser({
  subject,
  onSelectConcept,
  onBackToSubjects,
  onOpenDisambiguation
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');

  const subjectConcepts = Object.values(CONCEPTS).filter(c => c.subjectId === subject.id);
  
  const filteredConcepts = subjectConcepts.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle Query Submission
  const handleQuerySubmit = (text) => {
    const q = (text || searchTerm).trim();
    if (!q) return;

    audioService.playClickSound();
    const result = aiEngine.understandTopic(q);

    if (result.status === 'matched') {
      onSelectConcept(result.concept);
    } else if (result.status === 'disambiguation_needed' || result.status === 'low_confidence') {
      if (onOpenDisambiguation) {
        onOpenDisambiguation({
          query: q,
          suggestions: result.suggestions || []
        });
      }
    }
  };

  // Toggle Voice Input
  const toggleVoiceInput = () => {
    if (isListening) {
      audioService.stopListening();
      setIsListening(false);
    } else {
      setVoiceQuery('');
      const started = audioService.startListening({
        onInterim: (text) => {
          setVoiceQuery(text);
          setSearchTerm(text);
        },
        onResult: (finalText) => {
          setIsListening(false);
          setVoiceQuery(finalText);
          setSearchTerm(finalText);
          handleQuerySubmit(finalText);
        },
        onError: (err) => {
          setIsListening(false);
          console.warn(err);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
      if (started) setIsListening(true);
    }
  };

  return (
    <div className="concept-browser-container">
      {/* Back button & Subject Title */}
      <div className="concept-browser-header">
        <button onClick={onBackToSubjects} className="btn-back-nav">
          <ArrowLeft size={18} />
          <span>All Subjects</span>
        </button>

        <div className="subject-title-banner" style={{ color: subject.color }}>
          <span className="subj-icon">{subject.icon}</span>
          <div>
            <h1>{subject.name} Visual Concepts</h1>
            <p>{subject.description}</p>
          </div>
        </div>
      </div>

      {/* Input Options: Select Concept OR Ask Voice OR Type Question */}
      <div className="concept-input-options-bar">
        {/* Voice Option */}
        <button
          onClick={toggleVoiceInput}
          className={`btn-voice-option ${isListening ? 'listening' : ''}`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          <span>{isListening ? 'Listening... Speak Now' : '🎤 Ask using Voice'}</span>
        </button>

        {/* Text / Search Option */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="⌨️ Type a question or search concept (e.g. Present continuous)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => handleQuerySubmit()} className="btn-search-go">
              Go
            </button>
          )}
        </div>
      </div>

      {/* Voice Transcript feedback */}
      {voiceQuery && (
        <div className="voice-transcript-banner">
          <span>You asked:</span>
          <strong>“{voiceQuery}”</strong>
        </div>
      )}

      {/* Concepts Grid */}
      <div className="concepts-cards-grid">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            onClick={() => { audioService.playClickSound(); onSelectConcept(concept); }}
            className="concept-interactive-card"
          >
            <div className="concept-card-top">
              <span className="concept-badge-pill">{concept.badge}</span>
              <span className="visual-indicator-badge">🎬 Interactive Visual</span>
            </div>

            <h3 className="concept-title">{concept.title}</h3>
            <p className="concept-subtitle">{concept.subtitle}</p>

            <div className="concept-rule-preview">
              <span className="rule-label">Rule:</span>
              <span className="rule-text">{concept.rule}</span>
            </div>

            <div className="concept-card-footer">
              <span className="examples-count-tag">
                {concept.examples?.length || 1} Animated Example{concept.examples?.length !== 1 ? 's' : ''}
              </span>
              <div className="action-learn-link">
                <span>Enter Classroom</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
