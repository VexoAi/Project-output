import React from 'react';
import { Sparkles, Award, BookOpen, Home, Play, Flame } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function Navbar({
  currentView,
  onNavigate,
  onOpenProgress,
  onOpenDemo,
  progress,
  activeConcept
}) {
  const handleNav = (view) => {
    audioService.playClickSound();
    onNavigate(view);
  };

  const totalPoints = Object.values(progress?.completedConcepts || {}).reduce((acc, c) => acc + ((c.score || 0) * 10), 0);

  return (
    <header className="app-navbar">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <div className="nav-brand" onClick={() => handleNav('landing')}>
          <div className="brand-logo-icon">🎓</div>
          <div className="brand-text">
            <span className="brand-title">AI VISUAL EDUCATION</span>
            <span className="brand-sub">Smart Teaching System</span>
          </div>
        </div>

        {/* Core USP Flow Tagline (Desktop) */}
        <div className="nav-usp-tagline">
          <span className="usp-flow-chip">
            🎤 Speak ➔ 🧠 Understand ➔ 🎬 Visualize ➔ 💡 Learn ➔ 🧩 Quiz
          </span>
        </div>

        {/* Navigation & Action Links */}
        <nav className="nav-actions-group">
          <button
            onClick={() => handleNav('landing')}
            className={`nav-link-btn ${currentView === 'landing' ? 'active' : ''}`}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('subjects')}
            className={`nav-link-btn ${currentView === 'subjects' || currentView === 'concepts' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Subjects</span>
          </button>

          {activeConcept && (
            <button
              onClick={() => handleNav('classroom')}
              className={`nav-link-btn ${currentView === 'classroom' ? 'active' : ''}`}
            >
              <span className="live-pulsing-dot"></span>
              <span>Classroom</span>
            </button>
          )}

          {/* Progress Tracker Pill */}
          <button
            onClick={() => { audioService.playClickSound(); onOpenProgress(); }}
            className="nav-progress-btn"
            title="View Student Progress & Quiz Scores"
          >
            <Award size={18} className="text-amber-400" />
            <span className="points-val">{totalPoints} XP</span>
          </button>

          {/* Teacher Demo Button */}
          <button
            onClick={() => { audioService.playClickSound(); onOpenDemo(); }}
            className="nav-demo-btn"
          >
            <Sparkles size={16} />
            <span>Teacher Demo</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
