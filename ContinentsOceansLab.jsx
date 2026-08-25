import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Globe, MapPin } from 'lucide-react';

export default function ContinentsOceansLab() {
  const continents = [
    { id: 'asia', name: 'Asia', fact: 'Largest continent by land and population! Home to Mt. Everest.', color: '#EF4444', emoji: '🌏' },
    { id: 'africa', name: 'Africa', fact: 'Second largest continent, home to the Sahara Desert and Nile River.', color: '#F59E0B', emoji: '🦁' },
    { id: 'north-america', name: 'North America', fact: 'Contains Canada, USA, and Mexico with majestic Rocky Mountains.', color: '#10B981', emoji: '🦅' },
    { id: 'south-america', name: 'South America', fact: 'Home to the Amazon Rainforest and the Andes mountain range.', color: '#06B6D4', emoji: '🦜' },
    { id: 'antarctica', name: 'Antarctica', fact: 'The coldest, windiest, and driest ice-covered continent.', color: '#38BDF8', emoji: '🐧' },
    { id: 'europe', name: 'Europe', fact: 'Historic continent with over 40 diverse nations.', color: '#8B5CF6', emoji: '🏰' },
    { id: 'australia', name: 'Australia', fact: 'The smallest continent and largest island nation with the Great Barrier Reef.', color: '#EC4899', emoji: '🦘' }
  ];

  const [selectedContinent, setSelectedContinent] = useState(continents[0]);

  const handleSelect = (c) => {
    audioService.playClickSound();
    setSelectedContinent(c);
  };

  return (
    <div className="continents-lab-container">
      {/* Continents Pill Selector */}
      <div className="continents-chips-bar">
        {continents.map(c => (
          <button
            key={c.id}
            onClick={() => handleSelect(c)}
            className={`continent-chip ${selectedContinent.id === c.id ? 'active' : ''}`}
          >
            <span>{c.emoji}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* World Map SVG Display Stage */}
      <div className="world-map-stage">
        <svg viewBox="0 0 500 260" className="map-svg">
          {/* Blue Ocean Background */}
          <rect x="0" y="0" width="500" height="260" fill="#0284C7" />

          {/* 5 Oceans Text */}
          <text x="50" y="140" fontSize="9" fontWeight="bold" fill="#BAE6FD" opacity="0.6">PACIFIC OCEAN</text>
          <text x="210" y="120" fontSize="9" fontWeight="bold" fill="#BAE6FD" opacity="0.6">ATLANTIC OCEAN</text>
          <text x="320" y="190" fontSize="9" fontWeight="bold" fill="#BAE6FD" opacity="0.6">INDIAN OCEAN</text>
          <text x="250" y="20" fontSize="9" fontWeight="bold" fill="#BAE6FD" opacity="0.6">ARCTIC OCEAN</text>
          <text x="250" y="250" fontSize="9" fontWeight="bold" fill="#BAE6FD" opacity="0.6">SOUTHERN OCEAN</text>

          {/* Stylized Continents Outlines */}
          {/* North America */}
          <polygon
            points="60,40 140,30 150,90 100,120 70,80"
            fill={selectedContinent.id === 'north-america' ? '#10B981' : '#E2E8F0'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[2])}
            className="cursor-pointer map-continent"
          />

          {/* South America */}
          <polygon
            points="110,130 160,140 140,210 115,190"
            fill={selectedContinent.id === 'south-america' ? '#06B6D4' : '#E2E8F0'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[3])}
            className="cursor-pointer map-continent"
          />

          {/* Europe */}
          <polygon
            points="220,40 280,35 290,75 230,75"
            fill={selectedContinent.id === 'europe' ? '#8B5CF6' : '#E2E8F0'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[5])}
            className="cursor-pointer map-continent"
          />

          {/* Africa */}
          <polygon
            points="220,85 285,85 290,140 250,190 220,130"
            fill={selectedContinent.id === 'africa' ? '#F59E0B' : '#E2E8F0'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[1])}
            className="cursor-pointer map-continent"
          />

          {/* Asia */}
          <polygon
            points="290,30 440,30 450,110 370,130 300,75"
            fill={selectedContinent.id === 'asia' ? '#EF4444' : '#E2E8F0'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[0])}
            className="cursor-pointer map-continent"
          />

          {/* Australia */}
          <polygon
            points="380,165 445,160 440,205 385,200"
            fill={selectedContinent.id === 'australia' ? '#EC4899' : '#E2E8F0'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[6])}
            className="cursor-pointer map-continent"
          />

          {/* Antarctica */}
          <rect
            x="80"
            y="235"
            width="340"
            height="20"
            rx="4"
            fill={selectedContinent.id === 'antarctica' ? '#38BDF8' : '#F1F5F9'}
            stroke="#0F172A"
            strokeWidth="1.5"
            onClick={() => handleSelect(continents[4])}
            className="cursor-pointer map-continent"
          />
        </svg>
      </div>

      {/* Selected Continent Card */}
      <div className="continent-fact-card" style={{ borderColor: selectedContinent.color }}>
        <div className="c-fact-header">
          <span className="c-emoji">{selectedContinent.emoji}</span>
          <h3>{selectedContinent.name}</h3>
        </div>
        <p className="c-fact-text">{selectedContinent.fact}</p>
      </div>
    </div>
  );
}
