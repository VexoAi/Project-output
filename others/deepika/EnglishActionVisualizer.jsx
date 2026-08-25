import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Sparkles, Layers, Zap } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function EnglishActionVisualizer({ activeExample, concept, onSelectExample }) {
  const [currentAction, setCurrentAction] = useState(activeExample?.action || 'running');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    if (activeExample?.action) {
      setCurrentAction(activeExample.action);
    }
  }, [activeExample]);

  const handleActionChange = (actionKey) => {
    audioService.playClickSound();
    setCurrentAction(actionKey);
    setAnimTick(prev => prev + 1);
    const matchedEx = concept?.examples?.find(e => e.action === actionKey);
    if (matchedEx && onSelectExample) {
      onSelectExample(matchedEx);
    }
  };

  const getGrammarParts = () => {
    switch (currentAction) {
      case 'running':
        return { subject: 'He', aux: 'is', verbIng: 'running', object: 'on the speed track', emoji: '⚡', color: '#3B82F6' };
      case 'reading':
        return { subject: 'She', aux: 'is', verbIng: 'reading', object: 'an animated storybook', emoji: '📖', color: '#EC4899' };
      case 'eating':
        return { subject: 'He', aux: 'is', verbIng: 'eating', object: 'a fresh red apple', emoji: '🍎', color: '#10B981' };
      case 'writing':
        return { subject: 'She', aux: 'is', verbIng: 'writing', object: 'a handwritten letter', emoji: '✍️', color: '#8B5CF6' };
      case 'playing':
        return { subject: 'They', aux: 'are', verbIng: 'playing', object: 'football in the field', emoji: '⚽', color: '#F59E0B' };
      default:
        return { subject: 'He', aux: 'is', verbIng: 'running', object: 'fast', emoji: '⚡', color: '#3B82F6' };
    }
  };

  const parts = getGrammarParts();

  return (
    <div className="action-visualizer-container">
      {/* Top Action Pills Toolbar */}
      <div className="action-toolbar">
        <div className="action-buttons-group">
          {[
            { id: 'running', label: 'Running Motion ⚡', emoji: '🏃' },
            { id: 'reading', label: 'Reading Pages 📖', emoji: '📚' },
            { id: 'eating', label: 'Eating Apple 🍎', emoji: '🍏' },
            { id: 'writing', label: 'Writing Ink ✍️', emoji: '📝' },
            { id: 'playing', label: 'Football Kick ⚽', emoji: '🥅' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => handleActionChange(btn.id)}
              className={`action-pill-btn ${currentAction === btn.id ? 'active' : ''}`}
            >
              <span className="btn-label">{btn.label}</span>
            </button>
          ))}
        </div>

        <div className="playback-controls">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="icon-ctrl-btn"
            title={isPlaying ? "Pause Animation" : "Play Animation"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 0.6 : 1)}
            className="icon-ctrl-btn speed-badge"
          >
            <FastForward size={14} />
            <span>{speed}x</span>
          </button>
        </div>
      </div>

      {/* Pure Animated Kinetic Stage (No humanoid characters) */}
      <div className="scene-stage" style={{ background: '#0F172A', '--anim-speed': `${1 / speed}s` }} key={animTick}>
        <svg viewBox="0 0 500 280" className="character-svg">
          <defs>
            <linearGradient id="neonTrack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect x="0" y="0" width="500" height="280" fill="#0F172A" />

          {/* ================= 1. RUNNING (Kinetic Speed Vectors & Motion Trails) ================= */}
          {currentAction === 'running' && (
            <g className="kinetic-running-group">
              {/* Pulsing Sprint Track */}
              <line x1="30" y1="200" x2="470" y2="200" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
              <line x1="30" y1="200" x2="470" y2="200" stroke="url(#neonTrack)" strokeWidth="4" strokeDasharray="16 8" className="speed-track-pulse" />

              {/* Glowing High-Speed Orb */}
              <g className="speed-orb" transform="translate(250, 160)">
                <circle cx="0" cy="0" r="30" fill="#38BDF8" filter="drop-shadow(0 0 24px #38BDF8)" />
                <circle cx="0" cy="0" r="18" fill="#FFFFFF" />
                <text x="0" y="6" fontSize="18" fontWeight="bold" fill="#0F172A" textAnchor="middle">⚡</text>

                {/* Speed Wind Streaks */}
                <line x1="-40" y1="-15" x2="-120" y2="-15" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" className="motion-streak s1" />
                <line x1="-35" y1="0" x2="-140" y2="0" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" className="motion-streak s2" />
                <line x1="-40" y1="15" x2="-100" y2="15" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" className="motion-streak s3" />
              </g>

              <g transform="translate(150, 40)">
                <rect x="0" y="0" width="200" height="40" rx="20" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="100" y="25" fontSize="13" fontWeight="bold" fill="#38BDF8" textAnchor="middle">
                  Active Sprint ➔ IS RUNNING
                </text>
              </g>
            </g>
          )}

          {/* ================= 2. READING (Turning Book Pages & Glowing Knowledge Particles) ================= */}
          {currentAction === 'reading' && (
            <g className="kinetic-reading-group" transform="translate(250, 140)">
              {/* Grand Open Book */}
              <path d="M -110 -40 L -10 -30 L -10 60 L -110 50 Z" fill="#1E293B" stroke="#60A5FA" strokeWidth="3" />
              <path d="M 110 -40 L 10 -30 L 10 60 L 110 50 Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="3" />

              {/* Turning Page */}
              <path d="M 0 -30 Q 50 -60 90 -40 L 90 50 Q 50 30 0 60 Z" fill="#3B82F6" opacity="0.6" className="turning-page" />

              {/* Floating Glowing Alphabet Particles */}
              {['A', 'B', 'C', '✨', '📖', '💡'].map((sym, i) => (
                <g key={i} transform={`translate(${-80 + i * 32}, ${-70 - (i % 2) * 20})`} className="float-letter">
                  <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="#EC4899" strokeWidth="1.5" />
                  <text x="0" y="5" fontSize="11" fontWeight="bold" fill="#F472B6" textAnchor="middle">{sym}</text>
                </g>
              ))}

              <text x="0" y="90" fontSize="13" fontWeight="bold" fill="#F472B6" textAnchor="middle">
                Page Turning Live ➔ IS READING
              </text>
            </g>
          )}

          {/* ================= 3. EATING (Fruit Physics & Bite Sparkles) ================= */}
          {currentAction === 'eating' && (
            <g className="kinetic-eating-group" transform="translate(250, 130)">
              {/* Juicy Red Apple with Bite Geometry */}
              <circle cx="0" cy="0" r="50" fill="#EF4444" filter="drop-shadow(0 0 20px #EF4444)" />
              {/* Leaf Stem */}
              <path d="M 0 -50 Q 20 -70 30 -60 Q 15 -45 0 -50 Z" fill="#10B981" />
              <line x1="0" y1="-50" x2="0" y2="-65" stroke="#78350F" strokeWidth="4" />

              {/* Animated Bite Rings */}
              <circle cx="35" cy="-10" r="22" fill="#0F172A" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="25" cy="20" r="18" fill="#0F172A" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />

              <text x="0" y="85" fontSize="13" fontWeight="bold" fill="#34D399" textAnchor="middle">
                Bite in Progress ➔ IS EATING
              </text>
            </g>
          )}

          {/* ================= 4. WRITING (Dancing Glowing Stylus & Flowing Ink Wave) ================= */}
          {currentAction === 'writing' && (
            <g className="kinetic-writing-group">
              {/* Flowing Parchment Plane */}
              <rect x="100" y="70" width="300" height="140" rx="8" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />

              {/* Glowing Written Ink Line */}
              <path
                d="M 130 140 Q 180 110 230 140 T 330 140 T 370 130"
                fill="none"
                stroke="#C084FC"
                strokeWidth="4"
                strokeDasharray="10 4"
                className="ink-stream"
              />

              {/* Glowing Golden Stylus Pen */}
              <g transform="translate(370, 125) rotate(-35)">
                <polygon points="0,0 8,-50 16,-50 24,0" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                <circle cx="12" cy="0" r="4" fill="#C084FC" filter="drop-shadow(0 0 8px #C084FC)" />
              </g>

              <text x="250" y="240" fontSize="13" fontWeight="bold" fill="#C084FC" textAnchor="middle">
                Dynamic Pen Ink ➔ IS WRITING
              </text>
            </g>
          )}

          {/* ================= 5. PLAYING (Bouncing Soccer Ball & Kinetic Goal Arc) ================= */}
          {currentAction === 'playing' && (
            <g className="kinetic-playing-group">
              {/* Field Arc */}
              <path d="M 50 230 Q 250 80 450 230" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" />

              {/* Bouncing Soccer Ball */}
              <g transform="translate(250, 110)" className="bouncing-ball-vector">
                <circle cx="0" cy="0" r="26" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" filter="drop-shadow(0 0 16px #F59E0B)" />
                <polygon points="0,-12 10,-5 6,10 -6,10 -10,-5" fill="#0F172A" />
              </g>

              <text x="250" y="250" fontSize="13" fontWeight="bold" fill="#FBBF24" textAnchor="middle">
                Ball in Play ➔ ARE PLAYING
              </text>
            </g>
          )}
        </svg>

        {/* Live Action Status Pill */}
        <div className="live-action-badge">
          <Zap size={14} className="text-amber-400" />
          <span>CURRENT ACTION: <strong>{currentAction.toUpperCase()}</strong></span>
        </div>
      </div>

      {/* Grammar Breakdown Rule Formula */}
      <div className="grammar-breakdown-card">
        <div className="grammar-breakdown-title">
          <Sparkles size={16} className="text-amber-500" />
          <span>Real-Time Formula Construction:</span>
        </div>

        <div className="grammar-blocks">
          <div className="grammar-block block-subject">
            <span className="block-label">Subject</span>
            <span className="block-val">{parts.subject}</span>
          </div>
          <span className="block-plus">+</span>
          <div className="grammar-block block-aux">
            <span className="block-label">Auxiliary Verb</span>
            <span className="block-val">{parts.aux}</span>
          </div>
          <span className="block-plus">+</span>
          <div className="grammar-block block-verbing">
            <span className="block-label">Verb + ing</span>
            <span className="block-val">{parts.verbIng}</span>
          </div>
          <span className="block-plus">+</span>
          <div className="grammar-block block-object">
            <span className="block-label">Context</span>
            <span className="block-val">{parts.object}</span>
          </div>
        </div>

        <div className="sentence-display-pill">
          <span className="sentence-emoji">{parts.emoji}</span>
          <span className="sentence-text">“{parts.subject} {parts.aux} {parts.verbIng} {parts.object}.”</span>
        </div>
      </div>
    </div>
  );
}
