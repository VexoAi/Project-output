import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Zap, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function PastTenseVisualizer({ activeExample, onSelectExample }) {
  const [currentExampleId, setCurrentExampleId] = useState(activeExample?.id || 'played');
  const [timelinePosition, setTimelinePosition] = useState('past'); // 'past' or 'present'
  const [animKey, setAnimKey] = useState(0);

  const pastExamples = [
    {
      id: 'played',
      baseVerb: 'play',
      pastVerb: 'played',
      isRegular: true,
      sentence: 'He played football yesterday.',
      object: 'Football Match',
      timeLabel: 'Yesterday ⚽',
      sceneType: 'goal-burst',
      desc: 'Action Concluded: Glowing ball trajectory scores in goal with victory fireworks!'
    },
    {
      id: 'walked',
      baseVerb: 'walk',
      pastVerb: 'walked',
      isRegular: true,
      sentence: 'She walked to school this morning.',
      object: 'School Route',
      timeLabel: 'This Morning 🏫',
      sceneType: 'route-completed',
      desc: 'Action Concluded: Map route checkpoints fully completed from start to school!'
    },
    {
      id: 'ate',
      baseVerb: 'eat',
      pastVerb: 'ate',
      isRegular: false,
      sentence: 'The boy ate a delicious pizza.',
      object: 'Pizza Feast',
      timeLabel: '1 Hour Ago 🍕',
      sceneType: 'plate-empty',
      desc: 'Action Concluded: Pizza slices consumed, clean plate with glowing finish checkmark!'
    },
    {
      id: 'wrote',
      baseVerb: 'write',
      pastVerb: 'wrote',
      isRegular: false,
      sentence: 'She wrote a letter last night.',
      object: 'Sealed Letter',
      timeLabel: 'Last Night ✉️',
      sceneType: 'letter-sealed',
      desc: 'Action Concluded: Letter written, wax-sealed, and launched into mailbox tube!'
    },
    {
      id: 'danced',
      baseVerb: 'dance',
      pastVerb: 'danced',
      isRegular: true,
      sentence: 'They danced at the party.',
      object: 'Dance Rhythm',
      timeLabel: 'Last Saturday 🎉',
      sceneType: 'party-waves',
      desc: 'Action Concluded: Audio wave peak completed with celebratory disco lights!'
    }
  ];

  useEffect(() => {
    if (activeExample?.id) {
      const match = pastExamples.find(e => e.id === activeExample.id || e.sentence.includes(activeExample.sentence));
      if (match) {
        setCurrentExampleId(match.id);
        setAnimKey(prev => prev + 1);
      }
    }
  }, [activeExample]);

  const handleSelectExample = (ex) => {
    audioService.playClickSound();
    setCurrentExampleId(ex.id);
    setAnimKey(prev => prev + 1);
    if (onSelectExample) {
      onSelectExample({
        id: ex.id,
        sentence: ex.sentence,
        action: ex.id,
        visualDescription: ex.desc
      });
    }
  };

  const currentData = pastExamples.find(e => e.id === currentExampleId) || pastExamples[0];

  return (
    <div className="past-tense-visualizer-container">
      {/* Example Selection Bar */}
      <div className="past-examples-toolbar">
        <div className="past-pills-list">
          {pastExamples.map(ex => (
            <button
              key={ex.id}
              onClick={() => handleSelectExample(ex)}
              className={`past-pill-btn ${currentExampleId === ex.id ? 'active' : ''}`}
            >
              <span className="pill-verb">{ex.pastVerb.toUpperCase()}</span>
              <span className="pill-time">{ex.timeLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Continuum Continuum Slider */}
      <div className="time-machine-banner">
        <div className="timeline-labels">
          <button
            onClick={() => { audioService.playClickSound(); setTimelinePosition('past'); }}
            className={`timeline-node ${timelinePosition === 'past' ? 'active-past' : ''}`}
          >
            <Clock size={16} />
            <strong>PAST TENSE (Finished Action)</strong>
            <span className="node-formula">Verb + ed / Irregular: "{currentData.pastVerb}"</span>
          </button>

          <span className="timeline-arrow">➔</span>

          <button
            onClick={() => { audioService.playClickSound(); setTimelinePosition('present'); }}
            className={`timeline-node ${timelinePosition === 'present' ? 'active-present' : ''}`}
          >
            <Sparkles size={16} />
            <strong>PRESENT (Happening Right Now)</strong>
            <span className="node-formula">is + {currentData.baseVerb}ing</span>
          </button>
        </div>
      </div>

      {/* Pure Animated Motion Graphics Stage */}
      <div className="past-scene-stage">
        <svg viewBox="0 0 500 280" className="past-scene-svg" key={animKey}>
          <defs>
            <linearGradient id="bgPastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Futuristic Grid Canvas */}
          <rect x="0" y="0" width="500" height="280" fill="url(#bgPastGrad)" />
          
          {/* Glowing Time Ring in Background */}
          <circle cx="250" cy="140" r="100" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="250" cy="140" r="70" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

          {/* ================= SCENE 1: PLAYED (Goal Trajectory & Fireworks) ================= */}
          {currentData.id === 'played' && (
            <g className="kinetic-played">
              {/* Goal Box Outline */}
              <rect x="360" y="70" width="110" height="140" rx="8" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.8" />
              <line x1="360" y1="70" x2="470" y2="100" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="360" y1="210" x2="470" y2="180" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Glowing Curved Trajectory vector */}
              <path
                d="M 50 200 Q 200 40 410 130"
                fill="none"
                stroke="url(#goldGlow)"
                strokeWidth="4"
                strokeDasharray="8 4"
                className="vector-trail"
              />

              {/* Soccer Ball at Final Rest Position inside Net */}
              <g transform="translate(410, 130)">
                <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" filter="drop-shadow(0 0 12px #F59E0B)" />
                <polygon points="0,-10 8,-4 5,8 -5,8 -8,-4" fill="#0F172A" />
                {/* Finished Goal Burst */}
                <circle cx="0" cy="0" r="34" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" className="pulse-burst" />
              </g>

              {/* Victory Badge */}
              <g transform="translate(160, 100)">
                <rect x="0" y="0" width="180" height="60" rx="10" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="90" y="24" fontSize="11" fontWeight="bold" fill="#34D399" textAnchor="middle">ACTION COMPLETED ✅</text>
                <text x="90" y="46" fontSize="16" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">GOAL SCORED!</text>
              </g>
            </g>
          )}

          {/* ================= SCENE 2: WALKED (Navigation Route) ================= */}
          {currentData.id === 'walked' && (
            <g className="kinetic-walked">
              {/* Checkpoints Route Path */}
              <path
                d="M 60 210 L 170 110 L 300 170 L 420 80"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="6 6"
              />

              {/* Nodes */}
              <circle cx="60" cy="210" r="14" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <text x="60" y="214" fontSize="9" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">HOME</text>

              <circle cx="170" cy="110" r="10" fill="#10B981" />
              <circle cx="300" cy="170" r="10" fill="#10B981" />

              {/* Destination Arrived */}
              <circle cx="420" cy="80" r="22" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" filter="drop-shadow(0 0 14px #10B981)" />
              <text x="420" y="85" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">🏫</text>
              <text x="420" y="118" fontSize="11" fontWeight="bold" fill="#34D399" textAnchor="middle">ARRIVED!</text>

              <g transform="translate(140, 30)">
                <rect x="0" y="0" width="200" height="40" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="100" y="25" fontSize="13" fontWeight="bold" fill="#38BDF8" textAnchor="middle">Walk Finished ➔ At School</text>
              </g>
            </g>
          )}

          {/* ================= SCENE 3: ATE (Clean Plate & Finished Pizza) ================= */}
          {currentData.id === 'ate' && (
            <g className="kinetic-ate" transform="translate(250, 140)">
              {/* Empty Ceramic Plate */}
              <ellipse cx="0" cy="0" rx="120" ry="70" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="4" filter="drop-shadow(0 0 20px rgba(0,0,0,0.5))" />
              <ellipse cx="0" cy="0" rx="90" ry="50" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />

              {/* Crumb Sparkles */}
              <circle cx="-30" cy="-10" r="4" fill="#F59E0B" />
              <circle cx="20" cy="15" r="5" fill="#EF4444" />
              <circle cx="40" cy="-20" r="3" fill="#10B981" />
              <circle cx="-10" cy="25" r="4" fill="#F59E0B" />

              {/* 100% Eaten Checkmark Badge */}
              <circle cx="0" cy="0" r="32" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" filter="drop-shadow(0 0 16px #10B981)" />
              <text x="0" y="7" fontSize="22" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">✓</text>
              <text x="0" y="-80" fontSize="15" fontWeight="bold" fill="#FBBF24" textAnchor="middle">ALL PIZZA EATEN! (100% GONE)</text>
            </g>
          )}

          {/* ================= SCENE 4: WROTE (Sealed Stamped Envelope) ================= */}
          {currentData.id === 'wrote' && (
            <g className="kinetic-wrote" transform="translate(250, 140)">
              {/* Glowing Envelope */}
              <rect x="-80" y="-50" width="160" height="100" rx="8" fill="#FFFBEB" stroke="#D97706" strokeWidth="3" filter="drop-shadow(0 0 16px rgba(245, 158, 11, 0.4))" />
              <polygon points="-80,-50 0,10 80,-50" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />

              {/* Red Wax Seal */}
              <circle cx="0" cy="10" r="16" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              <text x="0" y="15" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">SEAL</text>

              <text x="0" y="80" fontSize="14" fontWeight="bold" fill="#38BDF8" textAnchor="middle">✉️ Letter Sealed & Dispatched</text>
            </g>
          )}

          {/* ================= SCENE 5: DANCED (Celebratory Audio Waves) ================= */}
          {currentData.id === 'danced' && (
            <g className="kinetic-danced" transform="translate(250, 140)">
              {/* Equalizer Frequency Bars */}
              {[-80, -50, -20, 10, 40, 70].map((bx, i) => (
                <rect
                  key={i}
                  x={bx}
                  y={-30 - (i % 3) * 15}
                  width="18"
                  height={60 + (i % 3) * 30}
                  rx="6"
                  fill={`hsl(${i * 50 + 200}, 90%, 55%)`}
                  className="eq-bar-pulse"
                />
              ))}
              <text x="0" y="80" fontSize="15" fontWeight="bold" fill="#F472B6" textAnchor="middle">🎉 Party Dance Concluded</text>
            </g>
          )}
        </svg>
      </div>

      {/* Verb Morphing Transformation Card */}
      <div className="verb-transformation-card">
        <div className="morph-header">
          <Sparkles size={16} className="text-amber-500" />
          <span>Interactive Verb Morphology Laboratory:</span>
        </div>

        <div className="morph-formula-row">
          <div className="morph-box base-box">
            <span className="morph-tag">Base Form</span>
            <span className="morph-word">{currentData.baseVerb.toUpperCase()}</span>
          </div>

          <span className="morph-op">➔</span>

          {currentData.isRegular ? (
            <div className="morph-box suffix-box">
              <span className="morph-tag">Regular Rule</span>
              <span className="morph-word">+ ED</span>
            </div>
          ) : (
            <div className="morph-box irregular-box">
              <span className="morph-tag">Irregular Morph</span>
              <span className="morph-word">Magic Vowel Shift ✨</span>
            </div>
          )}

          <span className="morph-op">=</span>

          <div className="morph-box result-box">
            <span className="morph-tag">Past Tense Verb</span>
            <span className="morph-word text-emerald-600 font-extrabold">{currentData.pastVerb.toUpperCase()}</span>
          </div>
        </div>

        <div className="past-sentence-banner">
          <span className="sentence-text">“{currentData.sentence}”</span>
        </div>
      </div>
    </div>
  );
}
