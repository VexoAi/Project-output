import React from 'react';
import { HelpCircle, ArrowRight, Sparkles, X } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function DisambiguationModal({ query, suggestions, onSelectConcept, onClose }) {
  const handleSelect = (concept) => {
    audioService.playClickSound();
    onSelectConcept(concept);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content disambiguation-card">
        <div className="disambig-header">
          <div className="disambig-icon-circle">
            <HelpCircle size={28} className="text-amber-500" />
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="disambig-body">
          <span className="asked-label">You asked:</span>
          <p className="user-query-quote">“{query}”</p>

          <div className="disambig-prompt">
            <h3>I’m not completely sure what you mean.</h3>
            <p>Did you mean one of these visual topics?</p>
          </div>

          <div className="suggestions-list">
            {suggestions.map((concept) => (
              <button
                key={concept.id}
                onClick={() => handleSelect(concept)}
                className="suggestion-item-btn"
              >
                <div className="sugg-left">
                  <span className="sugg-badge">{concept.badge || 'Concept'}</span>
                  <h4>{concept.title}</h4>
                  <p>{concept.subtitle}</p>
                </div>
                <ArrowRight size={20} className="sugg-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
