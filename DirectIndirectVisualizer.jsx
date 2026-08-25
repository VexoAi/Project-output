import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Play, Pause, Sparkles, MessageSquare, ArrowRight, BookOpen } from 'lucide-react';

export default function DirectIndirectVisualizer({ activeExample, onSelectExample }) {
  const [speechMode, setSpeechMode] = useState('direct'); // 'direct' or 'indirect'
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const tourTimerRef = useRef(null);

  const examples = [
    {
      id: 'hungry-boy',
      speaker: 'Rahul',
      directText: 'Rahul said, "I am very hungry."',
      indirectText: 'Rahul said that he was very hungry.',
      quotePart: '"I am very hungry."',
      reportedPart: 'that he was very hungry.',
      tenseShift: 'Present "am" ➔ Past "was" | Pronoun "I" ➔ "he"',
      directScript: 'Direct speech quotes exact spoken words: Rahul said, I am very hungry.',
      indirectScript: 'Indirect reported speech: Rahul said that he was very hungry. Notice "am" becomes "was" and "I" becomes "he"!'
    },
    {
      id: 'study-girl',
      speaker: 'Ananya',
      directText: 'Ananya said, "I like reading books."',
      indirectText: 'Ananya said that she liked reading books.',
      quotePart: '"I like reading books."',
      reportedPart: 'that she liked reading books.',
      tenseShift: 'Present "like" ➔ Past "liked" | Pronoun "I" ➔ "she"',
      directScript: 'Direct speech: Ananya said, I like reading books.',
      indirectScript: 'Indirect speech: Ananya said that she liked reading books.'
    }
  ];

  const currentEx = examples[selectedExampleIndex];

  const handleToggleMode = (mode) => {
    audioService.playClickSound();
    setSpeechMode(mode);
    audioService.speak(mode === 'direct' ? currentEx.directScript : currentEx.indirectScript);
  };

  const runAutoVoiceTour = () => {
    if (isTourPlaying) {
      setIsTourPlaying(false);
      clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
      return;
    }

    setIsTourPlaying(true);
    let step = 0;

    const tourSteps = [
      {
        action: () => {
          setSpeechMode('direct');
          setSelectedExampleIndex(0);
          audioService.speak('Step 1: Direct Speech uses quotation marks for the exact words spoken: Rahul said, I am very hungry.');
        }
      },
      {
        action: () => {
          setSpeechMode('indirect');
          audioService.speak('Step 2: When reporting indirectly without quotes: Rahul said that he was very hungry. We add "that", change pronoun "I" to "he", and shift tense from "am" to "was"!');
        }
      }
    ];

    const runStep = () => {
      if (step >= tourSteps.length) {
        setIsTourPlaying(false);
        audioService.playSuccessSound();
        return;
      }
      tourSteps[step].action();
      step++;
      tourTimerRef.current = setTimeout(runStep, 6500);
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
    <div className="direct-indirect-container">
      {/* Top Toolbar */}
      <div className="di-toolbar">
        <div className="di-chips">
          {examples.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => { setSelectedExampleIndex(idx); setSpeechMode('direct'); }}
              className={`di-chip-btn ${selectedExampleIndex === idx ? 'active' : ''}`}
            >
              <span>{ex.speaker}'s Speech</span>
            </button>
          ))}
        </div>

        <button
          onClick={runAutoVoiceTour}
          className={`btn-voice-tour-demo ${isTourPlaying ? 'tour-active' : ''}`}
        >
          {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isTourPlaying ? 'Pause Voice Tour' : '🗣️ Auto Voice Speech Tour'}</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="speech-mode-selector">
        <button
          onClick={() => handleToggleMode('direct')}
          className={`speech-tab-btn ${speechMode === 'direct' ? 'active-direct' : ''}`}
        >
          <MessageSquare size={16} />
          <span>DIRECT SPEECH (Exact Quotes)</span>
        </button>

        <button
          onClick={() => handleToggleMode('indirect')}
          className={`speech-tab-btn ${speechMode === 'indirect' ? 'active-indirect' : ''}`}
        >
          <BookOpen size={16} />
          <span>INDIRECT SPEECH (Reported with 'that')</span>
        </button>
      </div>

      {/* Visual Transformer Stage */}
      <div className="speech-stage-canvas">
        <svg viewBox="0 0 500 220" className="speech-svg">
          <rect x="0" y="0" width="500" height="220" fill="#0F172A" rx="12" />

          {speechMode === 'direct' ? (
            <g className="direct-speech-art">
              {/* Speaker Tag */}
              <g transform="translate(60, 60)">
                <rect x="0" y="0" width="130" height="50" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="65" y="30" fontSize="13" fontWeight="bold" fill="#38BDF8" textAnchor="middle">{currentEx.speaker} said,</text>
              </g>

              {/* Quotation Speech Bubble */}
              <g transform="translate(220, 45)">
                <rect x="0" y="0" width="240" height="80" rx="16" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" filter="drop-shadow(0 0 16px #F59E0B)" />
                <polygon points="0,30 -20,40 0,50" fill="#F59E0B" />
                <text x="120" y="32" fontSize="12" fontWeight="bold" fill="#FBBF24" textAnchor="middle">QUOTATION MARKS " "</text>
                <text x="120" y="58" fontSize="14" fontWeight="extrabold" fill="#FFFFFF" textAnchor="middle">{currentEx.quotePart}</text>
              </g>

              <text x="250" y="185" fontSize="13" fontWeight="bold" fill="#38BDF8" textAnchor="middle">
                💬 Direct: Spoken words enclosed in double quotes verbatim
              </text>
            </g>
          ) : (
            <g className="indirect-speech-art">
              {/* Reported Scroll Container */}
              <g transform="translate(60, 50)">
                <rect x="0" y="0" width="380" height="85" rx="12" fill="#1E293B" stroke="#10B981" strokeWidth="3" filter="drop-shadow(0 0 16px #10B981)" />
                <text x="190" y="32" fontSize="11" fontWeight="bold" fill="#34D399" textAnchor="middle">NO QUOTES + CONJUNCTION "THAT" + TENSE SHIFT</text>
                <text x="190" y="62" fontSize="14" fontWeight="extrabold" fill="#FFFFFF" textAnchor="middle">
                  {currentEx.speaker} said <tspan fill="#34D399">{currentEx.reportedPart}</tspan>
                </text>
              </g>

              <text x="250" y="185" fontSize="13" fontWeight="bold" fill="#10B981" textAnchor="middle">
                📜 Indirect Shift: {currentEx.tenseShift}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Shift Rule Banner */}
      <div className="speech-shift-banner">
        <Sparkles size={16} className="text-amber-500" />
        <span>Grammar Conversion Shift: <strong>{currentEx.tenseShift}</strong></span>
      </div>
    </div>
  );
}
