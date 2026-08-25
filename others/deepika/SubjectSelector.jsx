import React from 'react';
import { SUBJECTS, CONCEPTS } from '../data/curriculumData';
import { audioService } from '../services/audioService';
import { BookOpen, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function SubjectSelector({ onSelectSubject, onOpenDemo }) {
  const handleSubjectClick = (subject) => {
    audioService.playClickSound();
    onSelectSubject(subject);
  };

  return (
    <div className="subjects-view-container">
      {/* Title Header */}
      <div className="subjects-header-section">
        <div className="header-badge">
          <Sparkles size={16} className="text-amber-500" />
          <span>Step 2: Choose Your Learning Adventure</span>
        </div>
        <h1 className="subjects-main-title">Select Your Subject</h1>
        <p className="subjects-subtitle">
          Choose any subject below to explore interactive visual concepts and animations.
        </p>
      </div>

      {/* 5 Subject Cards Grid */}
      <div className="subject-cards-grid">
        {SUBJECTS.map((subj) => {
          const conceptsInSubject = Object.values(CONCEPTS).filter(c => c.subjectId === subj.id);

          return (
            <div
              key={subj.id}
              onClick={() => handleSubjectClick(subj)}
              className="subject-card-interactive"
              style={{ '--subj-color': subj.color }}
            >
              <div className="card-top-row">
                <span className="card-emoji-icon">{subj.icon}</span>
                <span className="card-count-badge">{conceptsInSubject.length} Visual Lessons</span>
              </div>

              <div className="card-content-area">
                <h3 className="card-subject-name">{subj.name}</h3>
                <p className="card-subject-desc">{subj.description}</p>
              </div>

              {/* Sample concept chips preview */}
              <div className="card-chips-preview">
                {conceptsInSubject.slice(0, 3).map(c => (
                  <span key={c.id} className="mini-preview-chip">
                    {c.title}
                  </span>
                ))}
                {conceptsInSubject.length > 3 && (
                  <span className="mini-preview-chip more-chip">+{conceptsInSubject.length - 3} more</span>
                )}
              </div>

              <div className="card-footer-action">
                <span>Start Visual Learning</span>
                <ArrowRight size={18} className="arrow-icon" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Tour Banner Callout */}
      <div className="demo-callout-banner">
        <div className="callout-content">
          <div className="callout-icon">🎯</div>
          <div>
            <h4>Want to see the system in action?</h4>
            <p>Experience the 10-step Teacher Voice Demo: “Explain Present Continuous Tense”</p>
          </div>
        </div>
        <button onClick={onOpenDemo} className="btn-tour-launch">
          <Sparkles size={16} />
          <span>Try Teacher Voice Demo</span>
        </button>
      </div>
    </div>
  );
}
