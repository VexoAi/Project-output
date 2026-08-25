import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Play, Pause, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ParajumbleVisualizer({ activeExample, onSelectExample }) {
  const [selectedJumbleIndex, setSelectedJumbleIndex] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const tourTimerRef = useRef(null);

  const jumbles = [
    {
      id: 'birds-sky',
      title: 'Birds in the Sky',
      correctTokens: ['Birds', 'fly gracefully', 'in the blue sky.'],
      scrambledTokens: ['in the blue sky.', 'Birds', 'fly gracefully'],
      explanation: 'Subject ("Birds") + Verb phrase ("fly gracefully") + Prepositional phrase ("in the blue sky.")'
    },
    {
      id: 'sun-shines',
      title: 'The Golden Sun',
      correctTokens: ['The golden sun', 'rises early', 'in the east.'],
      scrambledTokens: ['in the east.', 'The golden sun', 'rises early'],
      explanation: 'Subject ("The golden sun") + Verb ("rises early") + Direction phrase ("in the east.")'
    },
    {
      id: 'children-garden',
      title: 'Kids in the Garden',
      correctTokens: ['The happy children', 'are playing football', 'in the green park.'],
      scrambledTokens: ['in the green park.', 'are playing football', 'The happy children'],
      explanation: 'Subject ("The happy children") + Continuous Verb ("are playing football") + Location ("in the green park.")'
    }
  ];

  const currentJumble = jumbles[selectedJumbleIndex];

  // Initialize / reset on jumble change
  useEffect(() => {
    setUserOrder([]);
    setIsSolved(false);
  }, [selectedJumbleIndex]);

  const handleAddToken = (token) => {
    if (userOrder.includes(token)) return;
    audioService.playClickSound();
    const newOrder = [...userOrder, token];
    setUserOrder(newOrder);

    // Check if complete and correct
    if (newOrder.length === currentJumble.correctTokens.length) {
      const isCorrect = newOrder.every((t, i) => t === currentJumble.correctTokens[i]);
      if (isCorrect) {
        setIsSolved(true);
        audioService.playSuccessSound();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        audioService.speak(`Correct! ${newOrder.join(' ')}`);
      } else {
        audioService.playErrorSound();
      }
    }
  };

  const handleReset = () => {
    audioService.playClickSound();
    setUserOrder([]);
    setIsSolved(false);
  };

  // Auto Voice Demonstration of Parajumble Reordering
  const runAutoVoiceTour = () => {
    if (isTourPlaying) {
      setIsTourPlaying(false);
      clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
      return;
    }

    setIsTourPlaying(true);
    setUserOrder([]);
    setIsSolved(false);

    audioService.speak(`Step 1: Understanding Parajumbles. We have scrambled pieces: ${currentJumble.scrambledTokens.join(', ')}. Let's find the Subject first!`);

    let step = 0;
    const autoOrder = [...currentJumble.correctTokens];

    const runStep = () => {
      if (step >= autoOrder.length) {
        setIsSolved(true);
        setIsTourPlaying(false);
        audioService.playSuccessSound();
        confetti({ particleCount: 50, spread: 60 });
        audioService.speak(`Parajumble solved: ${autoOrder.join(' ')}. ${currentJumble.explanation}`);
        return;
      }

      setUserOrder(prev => [...prev, autoOrder[step]]);
      audioService.playClickSound();
      step++;
      tourTimerRef.current = setTimeout(runStep, 1500);
    };

    tourTimerRef.current = setTimeout(runStep, 3500);
  };

  useEffect(() => {
    return () => {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      audioService.stopSpeaking();
    };
  }, []);

  return (
    <div className="parajumble-visualizer-container">
      {/* Top Toolbar */}
      <div className="parajumble-toolbar">
        <div className="jumble-selector-chips">
          {jumbles.map((j, idx) => (
            <button
              key={j.id}
              onClick={() => setSelectedJumbleIndex(idx)}
              className={`jumble-chip-btn ${selectedJumbleIndex === idx ? 'active' : ''}`}
            >
              <span>{j.title}</span>
            </button>
          ))}
        </div>

        <button
          onClick={runAutoVoiceTour}
          className={`btn-voice-tour-demo ${isTourPlaying ? 'tour-active' : ''}`}
        >
          {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isTourPlaying ? 'Pause Voice Tour' : '🗣️ Auto Voice Parajumble Tour'}</span>
        </button>
      </div>

      {/* Jigsaw Construction Board */}
      <div className="jumble-construction-stage">
        {/* Scrambled Choices Pool */}
        <div className="scrambled-pool-section">
          <span className="pool-heading">🧩 Click tokens in correct grammatical order:</span>
          <div className="tokens-pool-grid">
            {currentJumble.scrambledTokens.map((tok, i) => {
              const isUsed = userOrder.includes(tok);
              return (
                <button
                  key={i}
                  disabled={isUsed}
                  onClick={() => handleAddToken(tok)}
                  className={`scrambled-token-btn ${isUsed ? 'token-used' : ''}`}
                >
                  <span>{tok}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assembled Result Line */}
        <div className={`assembled-slot-tray ${isSolved ? 'solved-tray' : ''}`}>
          <div className="tray-header">
            <span>Assembled Sentence Output:</span>
            {userOrder.length > 0 && (
              <button onClick={handleReset} className="btn-reset-tray">
                <RotateCcw size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="assembled-tokens-line">
            {userOrder.length === 0 ? (
              <span className="placeholder-text">Click the jigsaw words above to build the sentence...</span>
            ) : (
              userOrder.map((tok, idx) => (
                <div key={idx} className="ordered-token-block">
                  <span className="token-idx">{idx + 1}</span>
                  <span className="token-txt">{tok}</span>
                </div>
              ))
            )}
          </div>

          {isSolved && (
            <div className="solved-success-banner">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Perfect Sequence! Complete Sentence: <strong>“{currentJumble.correctTokens.join(' ')}”</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Grammar Rule Card */}
      <div className="jumble-rule-card">
        <Sparkles size={16} className="text-amber-500" />
        <span>Grammar Order Rule: <strong>{currentJumble.explanation}</strong></span>
      </div>
    </div>
  );
}
