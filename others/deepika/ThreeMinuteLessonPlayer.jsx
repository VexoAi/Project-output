import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function ThreeMinuteLessonPlayer({ concept, activeExample, onPhaseChange, onLaunchQuiz }) {
  // 3-minute lesson is 180 seconds
  const TOTAL_SECONDS = 180;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // 4 Structured 3-Minute Teaching Phases
  const phases = [
    {
      id: 'phase-1',
      timeRange: '0:00 - 0:45',
      startTime: 180,
      endTime: 135,
      title: 'Phase 1: Concept & Core Visual Meaning',
      badge: 'Introduction & Seeing the Concept',
      script: `Welcome to the 3-minute visual lesson on ${concept?.title}. ${concept?.explanation}`,
      highlightRule: concept?.rule
    },
    {
      id: 'phase-2',
      timeRange: '0:45 - 1:30',
      startTime: 135,
      endTime: 90,
      title: 'Phase 2: Visual Anatomy & Interactive Rule',
      badge: 'How It Works Visually',
      script: `Notice the core rule: ${concept?.rule}. Look at how each element transforms in real time.`,
      highlightRule: concept?.rule
    },
    {
      id: 'phase-3',
      timeRange: '1:30 - 2:20',
      startTime: 90,
      endTime: 40,
      title: 'Phase 3: Multi-Example Animated Demonstrations',
      badge: 'Visual Examples in Action',
      script: `Now let us observe multiple animated examples. ${concept?.examples?.map(e => e.sentence).join('. ')}`,
      highlightRule: concept?.examples?.[0]?.sentence || ''
    },
    {
      id: 'phase-4',
      timeRange: '2:20 - 3:00',
      startTime: 40,
      endTime: 0,
      title: 'Phase 4: Visual Mastery Summary & Quiz Check',
      badge: 'Quick Summary & Quiz Ready',
      script: `Outstanding progress! You have completed the 3-minute visual lesson for ${concept?.title}. Let's test your understanding with a mini quiz!`,
      highlightRule: 'Ready for Mini Quiz!'
    }
  ];

  // Timer Tick Interval
  useEffect(() => {
    let timer = null;
    if (isPlaying && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            audioService.playFanfare();
            audioService.speak(`Awesome work! You completed the lesson for ${concept?.title}. Generating your quiz now.`);
            
            // AUTOMATICALLY GENERATE AND OPEN QUIZ!
            setTimeout(() => {
              if (onLaunchQuiz) onLaunchQuiz();
            }, 1500);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsPlaying(false);
    }

    return () => clearInterval(timer);
  }, [isPlaying, secondsLeft]);

  // Determine current phase based on seconds elapsed
  const elapsed = TOTAL_SECONDS - secondsLeft;
  useEffect(() => {
    let newPhaseIdx = 0;
    if (elapsed >= 140) newPhaseIdx = 3;
    else if (elapsed >= 90) newPhaseIdx = 2;
    else if (elapsed >= 45) newPhaseIdx = 1;
    else newPhaseIdx = 0;

    if (newPhaseIdx !== currentPhaseIndex) {
      setCurrentPhaseIndex(newPhaseIdx);
      if (onPhaseChange) onPhaseChange(newPhaseIdx);
      
      // Auto-narrate phase if voice is enabled and playing
      if (isVoiceEnabled && isPlaying) {
        audioService.speak(phases[newPhaseIdx].script);
      }
    }
  }, [elapsed, isPlaying, isVoiceEnabled]);

  const togglePlay = () => {
    audioService.playClickSound();
    if (!isPlaying) {
      setIsPlaying(true);
      if (isVoiceEnabled) {
        audioService.speak(phases[currentPhaseIndex].script);
      }
    } else {
      setIsPlaying(false);
      audioService.stopSpeaking();
    }
  };

  const handleRestart = () => {
    audioService.playClickSound();
    audioService.stopSpeaking();
    setSecondsLeft(TOTAL_SECONDS);
    setCurrentPhaseIndex(0);
    setIsPlaying(false);
  };

  const handleJumpToPhase = (index) => {
    audioService.playClickSound();
    audioService.stopSpeaking();
    const jumpSeconds = phases[index].startTime;
    setSecondsLeft(jumpSeconds);
    setCurrentPhaseIndex(index);
    if (isVoiceEnabled) {
      audioService.speak(phases[index].script);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentPhase = phases[currentPhaseIndex];
  const progressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

  return (
    <div className="three-min-lesson-player">
      {/* Top Player Header */}
      <div className="player-top-header">
        <div className="timer-badge">
          <Clock size={16} className="text-amber-500" />
          <span className="time-display">{formatTime(secondsLeft)}</span>
          <small className="time-total">/ 3:00 Min Lesson</small>
        </div>

        <div className="phase-indicator-pill">
          <Sparkles size={14} className="text-indigo-400" />
          <span>{currentPhase.title}</span>
        </div>

        <div className="player-header-actions">
          <button
            onClick={() => {
              audioService.playClickSound();
              if (isVoiceEnabled) audioService.stopSpeaking();
              setIsVoiceEnabled(!isVoiceEnabled);
            }}
            className={`icon-ctrl-btn ${isVoiceEnabled ? 'voice-active' : ''}`}
            title="Toggle Voice Teaching Narration"
          >
            {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isVoiceEnabled ? 'Voice ON' : 'Voice Muted'}</span>
          </button>
        </div>
      </div>

      {/* 3-Minute Progress Scrubber Timeline */}
      <div className="lesson-scrubber-timeline">
        <div className="scrubber-track">
          <div className="scrubber-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="phase-step-nodes">
          {phases.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleJumpToPhase(idx)}
              className={`phase-step-node ${currentPhaseIndex === idx ? 'current' : currentPhaseIndex > idx ? 'completed' : ''}`}
              title={`${p.title} (${p.timeRange})`}
            >
              <span className="step-num">{idx + 1}</span>
              <span className="step-label">{p.timeRange}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Player Action Controls Bar */}
      <div className="player-controls-bar">
        <button
          onClick={togglePlay}
          className={`btn-play-lesson ${isPlaying ? 'btn-playing' : ''}`}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? 'Pause 3-Min Lesson' : secondsLeft === TOTAL_SECONDS ? '▶️ Start 3-Minute Visual Lesson' : 'Resume Lesson'}</span>
        </button>

        <button onClick={handleRestart} className="btn-restart-lesson" title="Restart from 0:00">
          <RotateCcw size={16} />
          <span>Restart</span>
        </button>

        {secondsLeft <= 40 && onLaunchQuiz && (
          <button onClick={onLaunchQuiz} className="btn-quick-quiz-jump">
            <CheckCircle2 size={16} />
            <span>Launch Mini Quiz Now</span>
          </button>
        )}
      </div>

      {/* Active Phase Live Narration Script Banner */}
      <div className="phase-narration-banner">
        <span className="narration-badge">🗣️ AI Visual Teacher Narration:</span>
        <p className="narration-text">“{currentPhase.script}”</p>
      </div>
    </div>
  );
}
