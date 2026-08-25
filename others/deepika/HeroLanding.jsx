import React from 'react';
import { Sparkles, Play, Mic, Eye, Volume2, Award, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';
import { audioService } from '../services/audioService';
import { SUBJECTS } from '../data/curriculumData';

export default function HeroLanding({ onStartLearning, onOpenDemo, onSelectSubject }) {
  const handleStart = () => {
    audioService.playClickSound();
    onStartLearning();
  };

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="hero-hero-section">
        <div className="hero-badge-pill">
          <Sparkles size={16} className="text-amber-500" />
          <span>SMART EDUCATION – Real-Time Visual Teaching System</span>
        </div>

        <h1 className="hero-main-title">
          AI VISUAL EDUCATION
        </h1>

        <p className="hero-tagline">
          “Learn concepts by seeing, hearing and understanding.”
        </p>

        <p className="hero-description">
          An AI-powered real-time teaching platform that converts complex educational concepts into vibrant cartoon animations, interactive physics labs, and synchronized voice explanations.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta-buttons">
          <button onClick={handleStart} className="btn-hero-primary">
            <span>START LEARNING</span>
            <ArrowRight size={20} />
          </button>

          <button onClick={onOpenDemo} className="btn-hero-demo">
            <Sparkles size={18} className="text-amber-400" />
            <span>1-Click Teacher Voice Demo</span>
          </button>
        </div>

        {/* CORE USP PROMINENT BANNER */}
        <div className="core-usp-flow-card">
          <div className="usp-card-title">
            <Brain size={18} className="text-indigo-400" />
            <span>Core Teaching Engine Pipeline</span>
          </div>

          <div className="usp-flow-steps">
            <div className="usp-node">
              <span className="node-icon">🎤</span>
              <div className="node-text">
                <strong>Teacher Speaks</strong>
                <small>Voice or Text input</small>
              </div>
            </div>

            <div className="usp-connector">➔</div>

            <div className="usp-node">
              <span className="node-icon">🧠</span>
              <div className="node-text">
                <strong>AI Understands</strong>
                <small>NLP & Semantic Vector RAG</small>
              </div>
            </div>

            <div className="usp-connector">➔</div>

            <div className="usp-node">
              <span className="node-icon">🎬</span>
              <div className="node-text">
                <strong>Visual Appears</strong>
                <small>Dynamic Animations & Labs</small>
              </div>
            </div>

            <div className="usp-connector">➔</div>

            <div className="usp-node">
              <span className="node-icon">💡</span>
              <div className="node-text">
                <strong>Student Understands</strong>
                <small>See + Hear + Read + Quiz</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Subjects Fast-Access Grid */}
      <section className="landing-subjects-section">
        <div className="section-header">
          <h2>Explore Visual Subjects</h2>
          <p>Click any subject below to launch straight into animated lessons:</p>
        </div>

        <div className="landing-subjects-grid">
          {SUBJECTS.map((subj) => (
            <div
              key={subj.id}
              onClick={() => { audioService.playClickSound(); onSelectSubject(subj); }}
              className="landing-subj-card"
              style={{ '--subj-accent': subj.color }}
            >
              <span className="subj-icon-big">{subj.icon}</span>
              <h3>{subj.name}</h3>
              <p>{subj.description}</p>
              <span className="subj-explore-btn">
                <span>Explore Concepts</span>
                <ArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Modal Feature Pillars */}
      <section className="features-pillars-section">
        <div className="feature-pillar">
          <div className="feat-icon-box">
            <Eye size={24} className="text-blue-500" />
          </div>
          <h3>Never Text Alone</h3>
          <p>Every concept generates matching cartoon animations, SVG models, or science lab simulations.</p>
        </div>

        <div className="feature-pillar">
          <div className="feat-icon-box">
            <Volume2 size={24} className="text-teal-500" />
          </div>
          <h3>See + Hear + Read</h3>
          <p>AI Voice explanation narrates concepts aloud with synchronized live word highlighting.</p>
        </div>

        <div className="feature-pillar">
          <div className="feat-icon-box">
            <Award size={24} className="text-amber-500" />
          </div>
          <h3>Interactive Mini Quizzes</h3>
          <p>3-5 question diagnostic quizzes with instant audio feedback, cheering confetti, and revision tips.</p>
        </div>
      </section>
    </div>
  );
}
