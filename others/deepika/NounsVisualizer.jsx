import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function NounsVisualizer() {
  const categories = [
    { id: 'person', label: 'Person', emoji: '👨‍🏫', color: '#3B82F6', items: ['Teacher', 'Doctor', 'Astronaut', 'Chef'] },
    { id: 'place', label: 'Place', emoji: '🏫', color: '#10B981', items: ['School', 'Hospital', 'Park', 'Library'] },
    { id: 'animal', label: 'Animal', emoji: '🦁', color: '#F59E0B', items: ['Lion', 'Elephant', 'Dolphin', 'Eagle'] },
    { id: 'thing', label: 'Thing', emoji: '⚽', color: '#8B5CF6', items: ['Book', 'Soccer Ball', 'Telescope', 'Pencil'] }
  ];

  const [activeCategory, setActiveCategory] = useState('person');

  const handleSelectCat = (catId) => {
    audioService.playClickSound();
    setActiveCategory(catId);
  };

  const currentCat = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="nouns-visualizer-container">
      {/* 4 Category Basket Selector */}
      <div className="noun-category-baskets">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleSelectCat(cat.id)}
            className={`noun-basket-btn ${activeCategory === cat.id ? 'active' : ''}`}
            style={{ '--basket-color': cat.color }}
          >
            <span className="b-emoji">{cat.emoji}</span>
            <span className="b-name">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Visual Display Stage */}
      <div className="noun-stage-wrapper">
        <div className="noun-basket-header">
          <span className="basket-indicator" style={{ backgroundColor: currentCat.color }}></span>
          <h3>Category: {currentCat.label} ({currentCat.emoji})</h3>
        </div>

        <div className="noun-cards-interactive-grid">
          {currentCat.items.map((item, idx) => (
            <div key={idx} className="noun-interactive-card" style={{ borderColor: currentCat.color }}>
              <div className="item-icon-circle" style={{ backgroundColor: `${currentCat.color}20`, color: currentCat.color }}>
                {currentCat.emoji}
              </div>
              <strong className="item-title">{item}</strong>
              <span className="item-tag-pill" style={{ backgroundColor: `${currentCat.color}15`, color: currentCat.color }}>
                Noun: {currentCat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
