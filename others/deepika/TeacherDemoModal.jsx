import React, { useState, useEffect } from 'react';
import { Play, Mic, Sparkles, CheckCircle2, ArrowRight, X, Volume2, Award } from 'lucide-react';
import { audioService } from '../services/audioService';
import { CONCEPTS } from '../data/curriculumData';

export default function TeacherDemoModal({ onClose, onLaunchDemoConcept }) {
  const [step, setStep] = useState(1);
  const [isPlayingAuto, setIsPlayingAuto] = useState(true);

  const steps = [
    {
      num: 1,
      title: 'Teacher Speaks (Voice Input)',
      desc: 'Teacher clicks microphone and says: “Explain Present Continuous Tense.”',
      action: 'Speech-to-Text conversion in real-time.',
      previewText: '🎤 Listening... ➔ "Explain Present Continuous Tense."'
    },
    {
      num: 2,
      title: 'AI Semantic Understanding',
      desc: 'NLP + Semantic embeddings identify the intent: Present Continuous Tense.',
      action: 'Confidence 98% matched to Grammar & Tenses domain.',
      previewText: '🧠 Identified: Present Continuous Tense (Subject + am/is/are + Verb-ing)'
    },
    {
      num: 3,
      title: 'AI Generates Child-Friendly Explanation',
      desc: 'Generates concise, simple explanation suitable for visual learning.',
      action: '“We use this tense for actions happening right now at this exact moment!”',
      previewText: '📝 Simple child-friendly concept synthesized.'
    },
    {
      num: 4,
      title: 'Visual Concept & Action Extraction',
      desc: 'AI extracts primary action: "running" and actor: "boy".',
      action: 'Extracts { Subject: "He", Action: "running", Object: "track" }',
      previewText: '🎯 Visual Object Detected: Boy Running 🏃'
    },
    {
      num: 5,
      title: 'Display Animated Boy Running',
      desc: 'Classroom visual center loads live animated cartoon boy sprinting.',
      action: 'Motion trails, speed controls, and dynamic track rendering.',
      previewText: '🎬 Visual Stage Active: Animated Boy Sprinting'
    },
    {
      num: 6,
      title: 'Displays Sentence: “He is running.”',
      desc: 'Synchronizes grammatical sentence with the visual animation.',
      action: 'Color-coded tokens: [He (Subject)] + [is (Aux)] + [running (Verb-ing)].',
      previewText: '🔤 “He is running.”'
    },
    {
      num: 7,
      title: 'Show 2nd Visual Example: “She is reading a book.”',
      desc: 'Instant visual transition to a girl sitting and reading a turning storybook.',
      action: 'Demonstrates versatility across multiple action verbs.',
      previewText: '📖 Visual Example 2: “She is reading a book.”'
    },
    {
      num: 8,
      title: 'Multi-Modal Voice & Rule Explanation',
      desc: 'AI speaks the lesson aloud with live word highlighting & formula badges.',
      action: 'Rule: Subject + am/is/are + Verb-ing',
      previewText: '🔊 Voice Narration + Interactive Formula Bar'
    },
    {
      num: 9,
      title: 'Interactive Mini Quiz',
      desc: 'Student answers interactive visual question with instant feedback & chime.',
      action: 'Question: "Look at the visual animation. Which sentence describes the boy?"',
      previewText: '🧩 Mini Quiz with instant ✅ Correct! feedback.'
    },
    {
      num: 10,
      title: 'Student Score & Feedback',
      desc: 'Displays 4/5 score card, diagnostic mastery feedback, and revision recommendations.',
      action: 'Complete visual teaching workflow successfully demonstrated!',
      previewText: '🏆 Score: 4/5 — Great progress with Present Continuous!'
    }
  ];

  const currentStepData = steps[step - 1];

  const handleNext = () => {
    audioService.playClickSound();
    if (step < 10) {
      setStep(step + 1);
    } else {
      if (onLaunchDemoConcept) {
        onLaunchDemoConcept(CONCEPTS['present-continuous']);
      }
      onClose();
    }
  };

  const handlePrev = () => {
    audioService.playClickSound();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGoDirectlyToClassroom = () => {
    audioService.playClickSound();
    if (onLaunchDemoConcept) {
      onLaunchDemoConcept(CONCEPTS['present-continuous']);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content teacher-demo-card">
        {/* Header */}
        <div className="demo-header">
          <div className="demo-badge">
            <Sparkles size={16} className="text-amber-500" />
            <span>Interactive 10-Step AI Teaching System Tour</span>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Core USP Banner */}
        <div className="demo-usp-banner">
          <div className="usp-step">🎤 Teacher Speaks</div>
          <span className="usp-arrow">➔</span>
          <div className="usp-step">🧠 AI Understands</div>
          <span className="usp-arrow">➔</span>
          <div className="usp-step">🎬 Visual Appears</div>
          <span className="usp-arrow">➔</span>
          <div className="usp-step">💡 Student Understands</div>
        </div>

        {/* Step Progress Dots */}
        <div className="demo-step-dots">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => { audioService.playClickSound(); setStep(s.num); }}
              className={`step-dot ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}
              title={`Step ${s.num}: ${s.title}`}
            >
              {s.num}
            </button>
          ))}
        </div>

        {/* Current Step Body Card */}
        <div className="demo-step-body">
          <div className="step-tag">Step {currentStepData.num} of 10</div>
          <h2>{currentStepData.title}</h2>
          <p className="step-desc">{currentStepData.desc}</p>

          <div className="step-action-pill">
            <Sparkles size={16} className="text-indigo-500" />
            <span>{currentStepData.action}</span>
          </div>

          <div className="step-preview-box">
            <code>{currentStepData.previewText}</code>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="demo-footer">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="btn-secondary"
          >
            Previous
          </button>

          <button onClick={handleGoDirectlyToClassroom} className="btn-secondary jump-btn">
            Open in Classroom Now
          </button>

          <button onClick={handleNext} className="btn-primary">
            <span>{step < 10 ? 'Next Step' : 'Launch Interactive Classroom'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
