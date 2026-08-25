import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, Volume2, Play, Pause, Zap, CheckCircle2, Maximize2, Minimize2, X } from 'lucide-react';

export default function PrepositionVisualizer({ activeExample, onSelectExample, onOpenQuiz }) {
  const [position, setPosition] = useState(activeExample?.action || 'on');
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [activeTourIndex, setActiveTourIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const tourTimerRef = useRef(null);

  const positions = [
    {
      id: 'on',
      label: 'On the table',
      emoji: '👆',
      cx: 200,
      cy: 110,
      color: '#10B981',
      sentence: 'The ball is ON the table.',
      voiceScript: 'The ball moves smoothly ON top of the table surface.',
      description: 'Resting on the upper surface of the table'
    },
    {
      id: 'under',
      label: 'Under the table',
      emoji: '👇',
      cx: 200,
      cy: 220,
      color: '#EF4444',
      sentence: 'The ball is UNDER the table.',
      voiceScript: 'Now watch: the ball slides directly UNDER the table, beneath its surface.',
      description: 'Located directly beneath the table'
    },
    {
      id: 'above',
      label: 'Above the table',
      emoji: '⬆️',
      cx: 200,
      cy: 40,
      color: '#3B82F6',
      sentence: 'The ball is ABOVE the table.',
      voiceScript: 'The ball ascends and floats ABOVE the table in the air.',
      description: 'Suspended in mid-air over the table'
    },
    {
      id: 'in',
      label: 'In the box',
      emoji: '📦',
      cx: 160,
      cy: 100,
      color: '#8B5CF6',
      sentence: 'The ball is IN the wooden box.',
      voiceScript: 'The ball drops gracefully INSIDE the wooden storage box.',
      description: 'Enclosed within the box container'
    },
    {
      id: 'beside',
      label: 'Beside the table',
      emoji: '👉',
      cx: 340,
      cy: 200,
      color: '#F59E0B',
      sentence: 'The ball is BESIDE the table leg.',
      voiceScript: 'The ball rolls BESIDE the right table leg, right next to it.',
      description: 'Positioned adjacent/next to the table'
    },
    {
      id: 'behind',
      label: 'Behind the table',
      emoji: '🔍',
      cx: 220,
      cy: 80,
      color: '#EC4899',
      sentence: 'The ball is BEHIND the table.',
      voiceScript: 'The ball peeks out from BEHIND the wooden tabletop.',
      description: 'At the back side of the table'
    }
  ];

  // Sync if active example prop changes (e.g. from voice query)
  useEffect(() => {
    if (activeExample?.action) {
      const match = positions.find(p => p.id === activeExample.action || activeExample.sentence?.toLowerCase().includes(p.id));
      if (match) {
        setPosition(match.id);
      }
    }
  }, [activeExample]);

  const handlePositionChange = (posKey, speakAloud = true) => {
    audioService.playClickSound();
    setPosition(posKey);
    const item = positions.find(p => p.id === posKey);
    if (item) {
      if (speakAloud) {
        audioService.speak(item.voiceScript);
      }
      if (onSelectExample) {
        onSelectExample({
          id: item.id,
          action: item.id,
          sentence: item.sentence,
          visualDescription: item.description
        });
      }
    }
  };

  // Automated Voice-Controlled Preposition Sequence with Auto-Fullscreen and Auto-Minimize
  const runVoiceTour = () => {
    if (isTourPlaying) {
      setIsTourPlaying(false);
      setIsFullScreen(false); // Automatically minimize on cancel
      clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
      return;
    }

    // AUTOMATICALLY EXPAND TO FULL SCREEN WHEN EXPLANATION STARTS!
    setIsFullScreen(true);
    setIsTourPlaying(true);
    let step = 0;

    const executeStep = () => {
      // WHEN EXPLANATION IS COMPLETED, AUTOMATICALLY MINIMIZE AND GENERATE QUIZ!
      if (step >= positions.length) {
        setIsTourPlaying(false);
        setIsFullScreen(false); // Automatically minimize back to standard view!
        audioService.playSuccessSound();
        audioService.speak('Preposition visual explanation completed! Generating your quiz now.');
        
        // AUTOMATICALLY GENERATE AND OPEN QUIZ!
        setTimeout(() => {
          if (onOpenQuiz) {
            onOpenQuiz();
          } else if (onSelectExample && onSelectExample.onOpenQuiz) {
            onSelectExample.onOpenQuiz();
          }
        }, 1200);
        return;
      }

      const currentPos = positions[step];
      setPosition(currentPos.id);
      setActiveTourIndex(step);
      audioService.speak(currentPos.voiceScript);

      step++;
      tourTimerRef.current = setTimeout(executeStep, 4500);
    };

    executeStep();
  };

  useEffect(() => {
    return () => {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
    };
  }, []);

  const currentPosData = positions.find(p => p.id === position) || positions[0];

  const renderVisualStage = (inModal = false) => (
    <div className={`preposition-stage ${inModal ? 'stage-fullscreen-mode' : ''}`}>
      {/* Fullscreen header toggle */}
      <div className="stage-top-controls">
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="btn-fullscreen-toggle"
          title={isFullScreen ? "Minimize to standard view" : "Expand to full screen"}
        >
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isFullScreen ? 'Minimize Screen' : 'Full Screen'}</span>
        </button>
      </div>

      <svg viewBox="0 0 400 280" className="prep-svg">
        <defs>
          <radialGradient id="ballGlowGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="40%" stopColor={currentPosData.color} />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
        </defs>

        {/* Room Wall & Floor Canvas */}
        <rect x="0" y="0" width="400" height="200" fill="#0F172A" />
        <rect x="0" y="200" width="400" height="80" fill="#1E293B" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#334155" strokeWidth="2" />

        {/* If 'behind', render ball in back behind table plank */}
        {position === 'behind' && (
          <g className="animated-ball-behind" style={{ transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <circle
              cx={currentPosData.cx}
              cy={currentPosData.cy}
              r="22"
              fill={currentPosData.color}
              opacity="0.7"
              stroke="#F472B6"
              strokeWidth="2"
              filter="drop-shadow(0 0 14px #EC4899)"
            />
            <text x={currentPosData.cx} y={currentPosData.cy + 5} fontSize="11" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">
              BEHIND
            </text>
          </g>
        )}

        {/* Wooden Table Structure */}
        {/* Table legs shadow */}
        <ellipse cx="100" cy="240" rx="16" ry="5" fill="#000000" opacity="0.5" />
        <ellipse cx="300" cy="240" rx="16" ry="5" fill="#000000" opacity="0.5" />
        
        {/* Table Legs */}
        <rect x="92" y="135" width="16" height="105" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
        <rect x="292" y="135" width="16" height="105" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
        
        {/* Table Top Plank with 3D Depth */}
        <rect x="60" y="120" width="280" height="24" rx="6" fill="#92400E" stroke="#78350F" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))" />
        <rect x="60" y="120" width="280" height="8" rx="4" fill="#B45309" />

        {/* Wooden Storage Box on table (for 'in' position) */}
        <g className="box-on-table" transform="translate(130, 85)">
          <rect x="0" y="0" width="60" height="40" rx="4" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <polygon points="0,0 15,-12 75,-12 60,0" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" />
          <text x="30" y="24" fontSize="10" fontWeight="bold" fill="#78350F" textAnchor="middle">BOX</text>
        </g>

        {/* Smooth Physics Animated Red Ball (for all other positions) */}
        {position !== 'behind' && (
          <g
            className="animated-ball-group"
            style={{
              transform: `translate(${currentPosData.cx}px, ${currentPosData.cy}px)`,
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Ball Shadow on table or floor */}
            <ellipse
              cx="0"
              cy={position === 'above' ? 80 : 24}
              rx={position === 'above' ? 12 : 20}
              ry="5"
              fill="#000000"
              opacity={position === 'above' ? 0.2 : 0.45}
              className="ball-shadow"
            />

            {/* Glowing Interactive Ball */}
            <circle
              cx="0"
              cy="0"
              r="24"
              fill={currentPosData.color}
              stroke="#FFFFFF"
              strokeWidth="3"
              filter={`drop-shadow(0 0 16px ${currentPosData.color})`}
              className="bouncing-ball-smooth"
            />
            
            {/* Ball Shine Highlight */}
            <circle cx="-7" cy="-7" r="6" fill="#FFFFFF" opacity="0.75" />
            
            {/* Label Inside Ball */}
            <text x="0" y="5" fontSize="10" fill="#FFFFFF" fontWeight="extrabold" textAnchor="middle">
              BALL
            </text>
          </g>
        )}
      </svg>

      {/* Spatial Position Live Badge */}
      <div className="spatial-label-badge" style={{ borderColor: currentPosData.color }}>
        <Sparkles size={14} style={{ color: currentPosData.color }} />
        <span>Spatial Position: <strong style={{ color: currentPosData.color }}>{currentPosData.label.toUpperCase()}</strong></span>
      </div>
    </div>
  );

  return (
    <div className="preposition-visualizer-container">
      {/* Position Selector Bar */}
      <div className="preposition-nav-bar">
        {positions.map(btn => (
          <button
            key={btn.id}
            onClick={() => {
              if (isTourPlaying) setIsTourPlaying(false);
              handlePositionChange(btn.id, true);
            }}
            className={`prep-btn ${position === btn.id ? 'active' : ''}`}
          >
            <span>{btn.emoji}</span>
            <span>{btn.label}</span>
          </button>
        ))}

        {/* Interactive Voice Tour Controller Button */}
        <button
          onClick={runVoiceTour}
          className={`btn-voice-tour-demo ${isTourPlaying ? 'tour-active' : ''}`}
          title="Watch the voice automated demonstration in full screen mode"
        >
          {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isTourPlaying ? 'Pause Voice Tour' : '🗣️ Auto Fullscreen Voice Tour'}</span>
        </button>
      </div>

      {/* Standard Half-Screen Visual Canvas */}
      {!isFullScreen && renderVisualStage(false)}

      {/* Dynamic Sentence Banner */}
      <div className="prep-sentence-banner">
        <span>🗣️ Voice Target Sentence:</span>
        <div className="sentence-formula">
          <span className="part-sub">The ball</span>
          <span className="part-verb">is</span>
          <span
            className="part-prep"
            style={{
              backgroundColor: `${currentPosData.color}25`,
              borderColor: currentPosData.color,
              color: currentPosData.color
            }}
          >
            {currentPosData.id.toUpperCase()}
          </span>
          <span className="part-obj">{currentPosData.id === 'in' ? 'the wooden box.' : 'the table.'}</span>
        </div>
      </div>

      {/* ================= FULL SCREEN THEATER OVERLAY ================= */}
      {isFullScreen && (
        <div className="preposition-fullscreen-overlay">
          <div className="fullscreen-modal-card">
            <div className="fullscreen-header-bar">
              <div className="fs-badge">
                <Sparkles size={16} className="text-amber-400" />
                <span>Theater Mode: Auto Voice Preposition Animation</span>
              </div>

              <div className="fs-controls">
                <button
                  onClick={() => {
                    setIsFullScreen(false);
                    if (isTourPlaying) {
                      setIsTourPlaying(false);
                      clearTimeout(tourTimerRef.current);
                      audioService.stopSpeaking();
                    }
                  }}
                  className="btn-close-fs"
                  title="Minimize back to classroom"
                >
                  <Minimize2 size={18} />
                  <span>Minimize View</span>
                </button>
              </div>
            </div>

            {/* Large Fullscreen Animated Stage */}
            <div className="fullscreen-canvas-body">
              {renderVisualStage(true)}
            </div>

            {/* Fullscreen Subtitle Script Banner */}
            <div className="fullscreen-subtitle-banner">
              <span className="fs-sub-label">🗣️ AI Teacher Narration:</span>
              <p className="fs-sub-text">“{currentPosData.voiceScript}”</p>
              <div className="fs-pill-row">
                {positions.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handlePositionChange(p.id, true)}
                    className={`fs-pill ${position === p.id ? 'active' : ''}`}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
