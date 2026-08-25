import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function VerbActionVisualizer({ activeExample, onSelectExample }) {
  const [selectedVerb, setSelectedVerb] = useState(activeExample?.action || 'run');

  const verbsList = [
    { id: 'run', name: 'RUN ⚡', color: '#38BDF8', sentence: 'The cheetah runs swiftly across the plains.', desc: 'High-velocity movement propelling across space.' },
    { id: 'jump', name: 'JUMP ⬆️', color: '#EF4444', sentence: 'The athlete jumps high into the air.', desc: 'Upward vertical thrust defying gravity.' },
    { id: 'eat', name: 'EAT 🍎', color: '#10B981', sentence: 'Sam eats fresh organic fruits.', desc: 'Taking in nutritional energy and chewing.' },
    { id: 'read', name: 'READ 📖', color: '#EC4899', sentence: 'Maya reads an adventurous story.', desc: 'Decoding knowledge from written symbols.' },
    { id: 'write', name: 'WRITE ✍️', color: '#8B5CF6', sentence: 'The student writes notes with a pen.', desc: 'Generating text and recording insights.' },
    { id: 'dance', name: 'DANCE 🎵', color: '#F59E0B', sentence: 'They dance rhythmically to the music.', desc: 'Harmonic rhythmic vibration in sync with beats.' }
  ];

  useEffect(() => {
    if (activeExample?.action) {
      setSelectedVerb(activeExample.action);
    }
  }, [activeExample]);

  const handleSelectVerb = (vId) => {
    audioService.playClickSound();
    setSelectedVerb(vId);
    const item = verbsList.find(v => v.id === vId);
    if (item && onSelectExample) {
      onSelectExample({
        id: item.id,
        action: item.id,
        sentence: item.sentence,
        visualDescription: item.desc
      });
    }
  };

  const currentVerbData = verbsList.find(v => v.id === selectedVerb) || verbsList[0];

  return (
    <div className="verb-action-visualizer-container">
      {/* Verb Selection Chips */}
      <div className="verb-selection-grid">
        {verbsList.map(v => (
          <button
            key={v.id}
            onClick={() => handleSelectVerb(v.id)}
            className={`verb-select-btn ${selectedVerb === v.id ? 'active' : ''}`}
          >
            <span className="v-name">{v.name}</span>
          </button>
        ))}
      </div>

      {/* Pure Kinetic Motion Graphics Stage */}
      <div className="verb-video-stage">
        <svg viewBox="0 0 450 240" className="verb-svg">
          <rect x="0" y="0" width="450" height="240" fill="#0F172A" />

          {/* Action 1: RUN */}
          {selectedVerb === 'run' && (
            <g transform="translate(225, 120)">
              <line x1="-180" y1="40" x2="180" y2="40" stroke="#334155" strokeWidth="4" />
              <line x1="-180" y1="40" x2="180" y2="40" stroke="#38BDF8" strokeWidth="4" strokeDasharray="12 6" className="speed-track-pulse" />
              <circle cx="0" cy="0" r="32" fill="#38BDF8" filter="drop-shadow(0 0 20px #38BDF8)" />
              <text x="0" y="8" fontSize="20" fontWeight="bold" fill="#0F172A" textAnchor="middle">⚡</text>
            </g>
          )}

          {/* Action 2: JUMP */}
          {selectedVerb === 'jump' && (
            <g transform="translate(225, 120)">
              <path d="M -120 60 Q 0 -60 120 60" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="8 4" />
              <circle cx="0" cy="-30" r="28" fill="#EF4444" filter="drop-shadow(0 0 20px #EF4444)" />
              <text x="0" y="-22" fontSize="20" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">⬆️</text>
            </g>
          )}

          {/* Action 3: EAT */}
          {selectedVerb === 'eat' && (
            <g transform="translate(225, 120)">
              <circle cx="0" cy="0" r="45" fill="#10B981" filter="drop-shadow(0 0 20px #10B981)" />
              <circle cx="28" cy="-8" r="18" fill="#0F172A" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
              <text x="0" y="6" fontSize="20" textAnchor="middle">🍎</text>
            </g>
          )}

          {/* Action 4: READ */}
          {selectedVerb === 'read' && (
            <g transform="translate(225, 120)">
              <path d="M -70 -25 L -5 -20 L -5 40 L -70 35 Z" fill="#1E293B" stroke="#EC4899" strokeWidth="2.5" />
              <path d="M 70 -25 L 5 -20 L 5 40 L 70 35 Z" fill="#1E293B" stroke="#EC4899" strokeWidth="2.5" />
              <text x="0" y="-35" fontSize="22">✨</text>
            </g>
          )}

          {/* Action 5: WRITE */}
          {selectedVerb === 'write' && (
            <g transform="translate(225, 120)">
              <rect x="-100" y="-30" width="200" height="70" rx="6" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
              <path d="M -80 0 Q -40 -15 0 0 T 80 0" fill="none" stroke="#C084FC" strokeWidth="3" strokeDasharray="6 3" />
              <text x="0" y="45" fontSize="16">✍️</text>
            </g>
          )}

          {/* Action 6: DANCE */}
          {selectedVerb === 'dance' && (
            <g transform="translate(225, 120)">
              {[-60, -30, 0, 30, 60].map((bx, i) => (
                <rect key={i} x={bx} y={-20 - (i % 2) * 15} width="16" height={40 + (i % 2) * 30} rx="4" fill="#F59E0B" className="eq-bar-pulse" />
              ))}
              <text x="0" y="50" fontSize="16">🎵 🎶</text>
            </g>
          )}
        </svg>

        <div className="verb-action-badge">
          <Zap size={14} className="text-amber-400" />
          <span>ACTION CONCEPT: <strong>{currentVerbData.name}</strong></span>
        </div>
      </div>

      <div className="verb-sentence-display">
        <span className="v-label">Grammar Action Sentence:</span>
        <strong className="v-text">“{currentVerbData.sentence}”</strong>
      </div>
    </div>
  );
}
