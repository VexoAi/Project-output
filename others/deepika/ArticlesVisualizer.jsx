import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Play, Pause, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ArticlesVisualizer({ activeExample, onSelectExample }) {
  const [selectedArticle, setSelectedArticle] = useState('a'); // 'a', 'an', 'the'
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const tourTimerRef = useRef(null);

  const articleRules = [
    {
      id: 'a',
      article: 'A',
      soundType: 'Consonant Sound (b, c, d, f, g...)',
      color: '#3B82F6',
      examples: [
        { noun: 'Book 📚', sentence: 'I read a book.', sound: '/b/ consonant' },
        { noun: 'Car 🚗', sentence: 'She drives a car.', sound: '/k/ consonant' },
        { noun: 'Dog 🐶', sentence: 'He has a dog.', sound: '/d/ consonant' }
      ],
      ruleText: 'Use "A" before singular nouns starting with a consonant sound.'
    },
    {
      id: 'an',
      article: 'AN',
      soundType: 'Vowel Sound (a, e, i, o, u)',
      color: '#EC4899',
      examples: [
        { noun: 'Apple 🍎', sentence: 'She ate an apple.', sound: '/æ/ vowel' },
        { noun: 'Elephant 🐘', sentence: 'We saw an elephant.', sound: '/e/ vowel' },
        { noun: 'Umbrella ☂️', sentence: 'He opened an umbrella.', sound: '/ʌ/ vowel' }
      ],
      ruleText: 'Use "AN" before singular nouns starting with a vowel sound.'
    },
    {
      id: 'the',
      article: 'THE',
      soundType: 'Specific / Unique Object',
      color: '#10B981',
      examples: [
        { noun: 'Sun ☀️', sentence: 'The sun rises in the morning.', sound: 'Unique celestial star' },
        { noun: 'Moon 🌙', sentence: 'Look at the moon.', sound: 'Specific earth satellite' },
        { noun: 'Red car 🏎️', sentence: 'The red car won the race.', sound: 'Specific known car' }
      ],
      ruleText: 'Use "THE" (Definite Article) when referring to specific or unique things.'
    }
  ];

  const currentRule = articleRules.find(r => r.id === selectedArticle) || articleRules[0];

  const handleSelectArticle = (artId, speak = true) => {
    audioService.playClickSound();
    setSelectedArticle(artId);
    const art = articleRules.find(r => r.id === artId);
    if (art && speak) {
      audioService.speak(`${art.ruleText} For example: ${art.examples[0].sentence}`);
    }
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

    const runStep = () => {
      if (step >= articleRules.length) {
        setIsTourPlaying(false);
        audioService.playSuccessSound();
        return;
      }
      const item = articleRules[step];
      setSelectedArticle(item.id);
      audioService.speak(`Step ${step + 1}: ${item.ruleText} For instance: ${item.examples[0].sentence}`);

      step++;
      tourTimerRef.current = setTimeout(runStep, 5000);
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
    <div className="articles-visualizer-container">
      {/* Article Selector Toolbar */}
      <div className="articles-toolbar">
        <div className="article-tab-buttons">
          {articleRules.map(ar => (
            <button
              key={ar.id}
              onClick={() => handleSelectArticle(ar.id)}
              className={`art-btn ${selectedArticle === ar.id ? 'active' : ''}`}
            >
              <span>{ar.article}</span>
            </button>
          ))}
        </div>

        <button
          onClick={runAutoVoiceTour}
          className={`btn-voice-tour-demo ${isTourPlaying ? 'tour-active' : ''}`}
        >
          {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isTourPlaying ? 'Pause Voice Tour' : '🗣️ Auto Voice Articles Tour'}</span>
        </button>
      </div>

      {/* Article Sound Magnet Stage */}
      <div className="articles-display-stage">
        <div className="magnet-badge" style={{ backgroundColor: currentRule.color }}>
          <span className="magnet-word">{currentRule.article}</span>
          <span className="magnet-type">{currentRule.soundType}</span>
        </div>

        <div className="items-magnet-grid">
          {currentRule.examples.map((ex, i) => (
            <div key={i} className="article-item-card">
              <span className="item-noun-name">{ex.noun}</span>
              <span className="sound-phonics-badge">{ex.sound}</span>
              <strong className="item-sentence-line">“{ex.sentence}”</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Rule Card */}
      <div className="articles-rule-card">
        <Sparkles size={16} className="text-amber-500" />
        <span>Phonics Rule: <strong>{currentRule.ruleText}</strong></span>
      </div>
    </div>
  );
}
