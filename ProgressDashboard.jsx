import React from 'react';
import { Award, Flame, CheckCircle, BookOpen, ArrowRight, X, Sparkles, TrendingUp } from 'lucide-react';
import { audioService } from '../services/audioService';
import { SUBJECTS, CONCEPTS } from '../data/curriculumData';

export default function ProgressDashboard({ progress, onSelectConcept, onClose }) {
  const completedList = Object.values(progress?.completedConcepts || {});
  const totalCompleted = completedList.length;
  
  const totalScore = completedList.reduce((acc, c) => acc + (c.score || 0), 0);
  const totalPossible = completedList.reduce((acc, c) => acc + (c.total || 0), 0);
  const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;

  // Identify weak topics (score < 80%)
  const weakTopics = completedList.filter(c => (c.score / c.total) < 0.8);

  const handleRevise = (conceptId) => {
    audioService.playClickSound();
    const concept = CONCEPTS[conceptId];
    if (concept && onSelectConcept) {
      onSelectConcept(concept);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content progress-dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dash-title-box">
            <div className="dash-avatar">🎓</div>
            <div>
              <h2>Student Learning Progress</h2>
              <p>Your visual understanding journey and mastery tracker</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-cards-grid">
          <div className="stat-card stat-completed">
            <div className="stat-icon-wrapper">
              <BookOpen size={24} className="text-indigo-600" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{totalCompleted}</span>
              <span className="stat-label">Concepts Learned</span>
            </div>
          </div>

          <div className="stat-card stat-accuracy">
            <div className="stat-icon-wrapper">
              <TrendingUp size={24} className="text-teal-600" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{accuracy}%</span>
              <span className="stat-label">Quiz Accuracy</span>
            </div>
          </div>

          <div className="stat-card stat-streak">
            <div className="stat-icon-wrapper">
              <Flame size={24} className="text-orange-500" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{progress?.streak || 3} Days</span>
              <span className="stat-label">Learning Streak</span>
            </div>
          </div>

          <div className="stat-card stat-stars">
            <div className="stat-icon-wrapper">
              <Award size={24} className="text-amber-500" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{totalScore * 10}</span>
              <span className="stat-label">Star XP Points</span>
            </div>
          </div>
        </div>

        {/* Subject Progress Mastery */}
        <div className="subject-mastery-section">
          <h3>Subject Mastery</h3>
          <div className="subject-bars-list">
            {SUBJECTS.map(subj => {
              const subjConcepts = Object.values(CONCEPTS).filter(c => c.subjectId === subj.id);
              const finishedInSubj = completedList.filter(c => {
                const matched = CONCEPTS[c.conceptId];
                return matched && matched.subjectId === subj.id;
              });
              const pct = subjConcepts.length > 0 ? Math.round((finishedInSubj.length / subjConcepts.length) * 100) : 0;

              return (
                <div key={subj.id} className="subj-mastery-row">
                  <div className="subj-name-icon">
                    <span>{subj.icon}</span>
                    <strong>{subj.name}</strong>
                  </div>
                  <div className="mastery-track">
                    <div
                      className="mastery-fill"
                      style={{ width: `${Math.max(8, pct)}%`, backgroundColor: subj.color }}
                    ></div>
                  </div>
                  <span className="mastery-pct">{pct}% ({finishedInSubj.length}/{subjConcepts.length})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics Revision Queue */}
        <div className="weak-topics-section">
          <div className="weak-header">
            <Sparkles size={18} className="text-amber-500" />
            <h3>Topics to Review & Strengthen</h3>
          </div>

          {weakTopics.length > 0 ? (
            <div className="weak-list">
              {weakTopics.map(w => (
                <div key={w.conceptId} className="weak-item-card">
                  <div>
                    <strong>{w.conceptTitle}</strong>
                    <small>Previous Score: {w.score}/{w.total}</small>
                  </div>
                  <button onClick={() => handleRevise(w.conceptId)} className="btn-revise">
                    <span>Practice Again</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-weak-box">
              <p>🌟 You are doing great across all attempted visual topics! Keep it up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
