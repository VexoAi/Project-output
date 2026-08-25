import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

export default function AdjectivesVisualizer() {
  const pairs = [
    {
      id: 'size',
      title: 'Size Comparison: Big vs Small',
      adj1: 'Huge / Gigantic',
      obj1: 'Elephant 🐘',
      scale1: 1.4,
      adj2: 'Tiny / Small',
      obj2: 'Mouse 🐁',
      scale2: 0.5,
      sentence: 'A huge elephant stands proudly beside a tiny mouse.'
    },
    {
      id: 'speed',
      title: 'Speed Comparison: Fast vs Slow',
      adj1: 'Lightning Fast ⚡',
      obj1: 'Cheetah 🐆',
      scale1: 1.2,
      adj2: 'Slow & Steady ⏳',
      obj2: 'Turtle 🐢',
      scale2: 0.8,
      sentence: 'The fast cheetah sprints ahead of the slow turtle.'
    },
    {
      id: 'height',
      title: 'Height Comparison: Tall vs Short',
      adj1: 'Towering Tall 🦒',
      obj1: 'Giraffe',
      scale1: 1.5,
      adj2: 'Cute & Short 🐕',
      obj2: 'Puppy',
      scale2: 0.6,
      sentence: 'The tall giraffe reaches the high treetops while the short puppy plays on the grass.'
    }
  ];

  const [activePairIndex, setActivePairIndex] = useState(0);
  const currentPair = pairs[activePairIndex];

  const handleSelectPair = (idx) => {
    audioService.playClickSound();
    setActivePairIndex(idx);
  };

  return (
    <div className="adjectives-visualizer-container">
      {/* Pair Switcher */}
      <div className="adj-pair-selector">
        {pairs.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectPair(idx)}
            className={`adj-tab-btn ${activePairIndex === idx ? 'active' : ''}`}
          >
            {p.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Visual Contrast Stage */}
      <div className="adj-contrast-stage">
        <div className="contrast-card card-left">
          <span className="adj-highlight-badge">{currentPair.adj1}</span>
          <div className="contrast-emoji" style={{ transform: `scale(${currentPair.scale1})` }}>
            {currentPair.obj1}
          </div>
          <strong className="obj-name-label">{currentPair.obj1}</strong>
        </div>

        <div className="contrast-versus">
          <ArrowRightLeft size={24} className="text-amber-500" />
          <span>VS</span>
        </div>

        <div className="contrast-card card-right">
          <span className="adj-highlight-badge badge-alt">{currentPair.adj2}</span>
          <div className="contrast-emoji" style={{ transform: `scale(${currentPair.scale2})` }}>
            {currentPair.obj2}
          </div>
          <strong className="obj-name-label">{currentPair.obj2}</strong>
        </div>
      </div>

      {/* Sentence Description */}
      <div className="adj-sentence-banner">
        <span>“{currentPair.sentence}”</span>
      </div>
    </div>
  );
}
