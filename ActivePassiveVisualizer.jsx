import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Play, Pause, Sparkles, ArrowRight, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export default function ActivePassiveVisualizer({ activeExample, onSelectExample }) {
  const [voiceMode, setVoiceMode] = useState('active'); // 'active' or 'passive'
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const tourTimerRef = useRef(null);

  const examples = [
    {
      id: 'chef-cake',
      actor: 'The Chef 👨‍🍳',
      verbActive: 'bakes',
      verbPassive: 'is baked by',
      receiver: 'a delicious cake 🎂',
      activeSentence: 'The chef bakes a delicious cake.',
      passiveSentence: 'A delicious cake is baked by the chef.',
      activeExplanation: 'In ACTIVE voice: The Subject (The Chef) performs the action (bakes).',
      passiveExplanation: 'In PASSIVE voice: The Focus shifts to the Object (The Cake) which receives the action.',
      activeScript: 'Active voice: The chef bakes a delicious cake. Here, the chef is the doer of the action.',
      passiveScript: 'Passive voice: A delicious cake is baked by the chef. Now the delicious cake is the focus!'
    },
    {
      id: 'boy-ball',
      actor: 'The Boy 👦',
      verbActive: 'kicked',
      verbPassive: 'was kicked by',
      receiver: 'the football ⚽',
      activeSentence: 'The boy kicked the football.',
      passiveSentence: 'The football was kicked by the boy.',
      activeExplanation: 'In ACTIVE voice: The Boy (Subject) directly kicks the ball.',
      passiveExplanation: 'In PASSIVE voice: The Football is put in the front, and was kicked by the boy.',
      activeScript: 'Active voice: The boy kicked the football. The boy does the kicking.',
      passiveScript: 'Passive voice: The football was kicked by the boy. The football receives the action.'
    },
    {
      id: 'girl-letter',
      actor: 'The Girl 👧',
      verbActive: 'wrote',
      verbPassive: 'was written by',
      receiver: 'a letter ✉️',
      activeSentence: 'The girl wrote a letter.',
      passiveSentence: 'A letter was written by the girl.',
      activeExplanation: 'In ACTIVE voice: The Girl writes the letter.',
      passiveExplanation: 'In PASSIVE voice: The Letter is placed first, was written by the girl.',
      activeScript: 'Active voice: The girl wrote a letter.',
      passiveScript: 'Passive voice: A letter was written by the girl.'
    }
  ];

  const currentEx = examples[selectedExampleIndex];

  const handleToggleVoice = (mode, speak = true) => {
    audioService.playClickSound();
    setVoiceMode(mode);
    if (speak) {
      const script = mode === 'active' ? currentEx.activeScript : currentEx.passiveScript;
      audioService.speak(script);
    }
  };

  const handleSelectExample = (idx) => {
    audioService.playClickSound();
    setSelectedExampleIndex(idx);
    const ex = examples[idx];
    if (onSelectExample) {
      onSelectExample({
        id: ex.id,
        sentence: voiceMode === 'active' ? ex.activeSentence : ex.passiveSentence,
        visualDescription: voiceMode === 'active' ? ex.activeExplanation : ex.passiveExplanation
      });
    }
  };

  // Step 1: Explain Concept -> Step 2: Auto Voice Tour for Examples
  const runAutoVoiceTour = () => {
    if (isTourPlaying) {
      setIsTourPlaying(false);
      clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
      return;
    }

    setIsTourPlaying(true);
    let step = 0;

    const stepsSequence = [
      {
        action: () => {
          setVoiceMode('active');
          setSelectedExampleIndex(0);
          audioService.speak('Step 1: Understanding Active and Passive Voice. In Active Voice, the Subject does the action: The chef bakes a delicious cake.');
        }
      },
      {
        action: () => {
          setVoiceMode('passive');
          audioService.speak('Step 2: Now watch the transformation to Passive Voice. The Cake moves to the front: A delicious cake is baked by the chef!');
        }
      },
      {
        action: () => {
          setSelectedExampleIndex(1);
          setVoiceMode('active');
          audioService.speak('Example 2 in Active: The boy kicked the football.');
        }
      },
      {
        action: () => {
          setVoiceMode('passive');
          audioService.speak('Example 2 transformed into Passive: The football was kicked by the boy.');
        }
      }
    ];

    const runStep = () => {
      if (step >= stepsSequence.length) {
        setIsTourPlaying(false);
        audioService.playSuccessSound();
        return;
      }

      stepsSequence[step].action();
      step++;
      tourTimerRef.current = setTimeout(runStep, 6000);
    };

    runStep();
  };

  useEffect(() => {
    return () => {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
    };
  }, []);

  return (
    <div className="active-passive-container">
      {/* Top Controller Bar */}
      <div className="ap-toolbar">
        <div className="ap-examples-chips">
          {examples.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => handleSelectExample(idx)}
              className={`ap-ex-btn ${selectedExampleIndex === idx ? 'active' : ''}`}
            >
              <span>{ex.actor} & {ex.receiver}</span>
            </button>
          ))}
        </div>

        <button
          onClick={runAutoVoiceTour}
          className={`btn-voice-tour-demo ${isTourPlaying ? 'tour-active' : ''}`}
        >
          {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isTourPlaying ? 'Pause Voice Tour' : '🗣️ Auto Voice Concept & Example Tour'}</span>
        </button>
      </div>

      {/* Voice Mode Toggle Bar (Active vs Passive) */}
      <div className="voice-mode-toggle-bar">
        <button
          onClick={() => handleToggleVoice('active')}
          className={`mode-btn ${voiceMode === 'active' ? 'active-mode-btn' : ''}`}
        >
          <strong>ACTIVE VOICE</strong>
          <small>Subject does action (Subject + Verb + Object)</small>
        </button>

        <div className="switch-arrow-indicator" onClick={() => handleToggleVoice(voiceMode === 'active' ? 'passive' : 'active')}>
          <ArrowLeftRight size={20} />
          <span>Transform</span>
        </div>

        <button
          onClick={() => handleToggleVoice('passive')}
          className={`mode-btn ${voiceMode === 'passive' ? 'passive-mode-btn' : ''}`}
        >
          <strong>PASSIVE VOICE</strong>
          <small>Object receives action (Object + be + V3 + by Subject)</small>
        </button>
      </div>

      {/* 2-Way Animated Kinetic Stage */}
      <div className="ap-kinetic-stage">
        <svg viewBox="0 0 500 240" className="ap-svg">
          <rect x="0" y="0" width="500" height="240" fill="#0F172A" rx="12" />

          {voiceMode === 'active' ? (
            /* ACTIVE: Actor -> Verb -> Receiver */
            <g className="active-flow-group">
              {/* Actor Box (Left) */}
              <g transform="translate(60, 80)">
                <rect x="0" y="0" width="120" height="70" rx="10" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" filter="drop-shadow(0 0 16px #38BDF8)" />
                <text x="60" y="24" fontSize="10" fontWeight="bold" fill="#38BDF8" textAnchor="middle">SUBJECT (DOER)</text>
                <text x="60" y="50" fontSize="14" fontWeight="extrabold" fill="#FFFFFF" textAnchor="middle">{currentEx.actor}</text>
              </g>

              {/* Connecting Arrow with Verb */}
              <g transform="translate(195, 115)">
                <line x1="0" y1="0" x2="90" y2="0" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6 4" className="speed-track-pulse" />
                <polygon points="90,-6 102,0 90,6" fill="#F59E0B" />
                <rect x="15" y="-18" width="70" height="26" rx="6" fill="#F59E0B" />
                <text x="50" y="0" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">{currentEx.verbActive.toUpperCase()}</text>
              </g>

              {/* Receiver Box (Right) */}
              <g transform="translate(315, 80)">
                <rect x="0" y="0" width="140" height="70" rx="10" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="70" y="24" fontSize="10" fontWeight="bold" fill="#34D399" textAnchor="middle">OBJECT (RECEIVER)</text>
                <text x="70" y="50" fontSize="13" fontWeight="extrabold" fill="#FFFFFF" textAnchor="middle">{currentEx.receiver}</text>
              </g>

              <text x="250" y="205" fontSize="13" fontWeight="bold" fill="#38BDF8" textAnchor="middle">
                ⚡ Active Flow: Subject acts directly on Object
              </text>
            </g>
          ) : (
            /* PASSIVE: Receiver -> was/is + V3 -> by Actor */
            <g className="passive-flow-group">
              {/* Receiver Box Moved to Front (Left) */}
              <g transform="translate(60, 80)">
                <rect x="0" y="0" width="140" height="70" rx="10" fill="#1E293B" stroke="#10B981" strokeWidth="3" filter="drop-shadow(0 0 16px #10B981)" />
                <text x="70" y="24" fontSize="10" fontWeight="bold" fill="#34D399" textAnchor="middle">NEW FOCUS (OBJECT)</text>
                <text x="70" y="50" fontSize="13" fontWeight="extrabold" fill="#FFFFFF" textAnchor="middle">{currentEx.receiver}</text>
              </g>

              {/* Passive Transformation Verb */}
              <g transform="translate(210, 115)">
                <line x1="0" y1="0" x2="80" y2="0" stroke="#EC4899" strokeWidth="4" strokeDasharray="6 4" className="speed-track-pulse" />
                <polygon points="80,-6 92,0 80,6" fill="#EC4899" />
                <rect x="0" y="-18" width="80" height="26" rx="6" fill="#EC4899" />
                <text x="40" y="0" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">{currentEx.verbPassive.toUpperCase()}</text>
              </g>

              {/* Actor Box with 'by' Agent (Right) */}
              <g transform="translate(315, 80)">
                <rect x="0" y="0" width="130" height="70" rx="10" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
                <text x="65" y="24" fontSize="10" fontWeight="bold" fill="#94A3B8" textAnchor="middle">BY AGENT</text>
                <text x="65" y="50" fontSize="14" fontWeight="extrabold" fill="#FFFFFF" textAnchor="middle">{currentEx.actor}</text>
              </g>

              <text x="250" y="205" fontSize="13" fontWeight="bold" fill="#EC4899" textAnchor="middle">
                🔄 Passive Shift: Object is now the front focus + (be + V3) + by
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic Sentence Banner */}
      <div className="ap-sentence-banner">
        <span className="ap-badge-label">{voiceMode === 'active' ? 'Active Sentence:' : 'Passive Sentence:'}</span>
        <strong className="ap-sentence-text">
          “{voiceMode === 'active' ? currentEx.activeSentence : currentEx.passiveSentence}”
        </strong>
      </div>
    </div>
  );
}
