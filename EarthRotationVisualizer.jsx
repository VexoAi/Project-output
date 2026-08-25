import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Sun, Moon, RotateCw, Globe } from 'lucide-react';

export default function EarthRotationVisualizer() {
  const [viewMode, setViewMode] = useState('day-night'); // 'day-night' or 'seasons'

  const handleToggle = (mode) => {
    audioService.playClickSound();
    setViewMode(mode);
  };

  return (
    <div className="earth-rotation-container">
      {/* Mode Selector */}
      <div className="earth-mode-selector">
        <button
          onClick={() => handleToggle('day-night')}
          className={`earth-mode-btn ${viewMode === 'day-night' ? 'active' : ''}`}
        >
          <RotateCw size={16} />
          <span>Rotation (24 Hours = Day & Night)</span>
        </button>

        <button
          onClick={() => handleToggle('seasons')}
          className={`earth-mode-btn ${viewMode === 'seasons' ? 'active' : ''}`}
        >
          <Globe size={16} />
          <span>Revolution (365 Days = 4 Seasons)</span>
        </button>
      </div>

      {/* Visual Canvas Stage */}
      <div className="earth-visual-stage">
        {viewMode === 'day-night' ? (
          <svg viewBox="0 0 450 260" className="earth-svg">
            <rect x="0" y="0" width="450" height="260" fill="#0B0F19" />

            {/* Glowing Sun on left */}
            <g className="sun-group" transform="translate(60, 130)">
              <circle cx="0" cy="0" r="38" fill="#FBBF24" filter="drop-shadow(0 0 20px #F59E0B)" />
              <circle cx="0" cy="0" r="28" fill="#FEF08A" />
              <text x="0" y="5" fontSize="11" fontWeight="bold" fill="#78350F" textAnchor="middle">SUN</text>
            </g>

            {/* Sun Rays beaming to Earth */}
            <line x1="100" y1="130" x2="230" y2="130" stroke="#FDE047" strokeWidth="3" strokeDasharray="6 4" />

            {/* Earth Globe with Day & Night Split */}
            <g className="earth-globe" transform="translate(300, 130) rotate(23.5)">
              {/* Tilted Axis Line */}
              <line x1="0" y1="-85" x2="0" y2="85" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="0" y="-92" fontSize="9" fill="#94A3B8" textAnchor="middle">23.5° Tilt Axis</text>

              {/* Day Hemisphere (Light Blue) */}
              <path d="M 0 -65 A 65 65 0 0 0 0 65 Z" fill="#38BDF8" />
              {/* Green Continents on Day side */}
              <path d="M -30 -30 Q -10 -20 -20 10 Q -40 20 -30 -30 Z" fill="#22C55E" />

              {/* Night Hemisphere (Dark Navy) */}
              <path d="M 0 -65 A 65 65 0 0 1 0 65 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              {/* City night lights */}
              <circle cx="25" cy="-20" r="1.5" fill="#FDE047" />
              <circle cx="35" cy="10" r="1.5" fill="#FDE047" />

              {/* Central dividing terminator line */}
              <line x1="0" y1="-65" x2="0" y2="65" stroke="#FBBF24" strokeWidth="1.5" />
            </g>

            {/* Day / Night Text Labels */}
            <rect x="230" y="30" width="80" height="25" rx="6" fill="#0284C7" />
            <text x="270" y="46" fontSize="11" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">☀️ DAY</text>

            <rect x="330" y="30" width="80" height="25" rx="6" fill="#1E293B" />
            <text x="370" y="46" fontSize="11" fontWeight="bold" fill="#F8FAFC" textAnchor="middle">🌙 NIGHT</text>
          </svg>
        ) : (
          <svg viewBox="0 0 450 260" className="earth-svg">
            <rect x="0" y="0" width="450" height="260" fill="#0B0F19" />
            {/* Center Sun */}
            <circle cx="225" cy="130" r="28" fill="#FBBF24" filter="drop-shadow(0 0 18px #F59E0B)" />
            {/* Orbit Path */}
            <ellipse cx="225" cy="130" rx="160" ry="80" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* 4 Seasons Earth Positions */}
            {/* Summer (Top) */}
            <circle cx="225" cy="50" r="14" fill="#38BDF8" />
            <text x="225" y="30" fontSize="11" fontWeight="bold" fill="#38BDF8" textAnchor="middle">Summer ☀️</text>

            {/* Autumn (Right) */}
            <circle cx="385" cy="130" r="14" fill="#38BDF8" />
            <text x="385" y="160" fontSize="11" fontWeight="bold" fill="#F59E0B" textAnchor="middle">Autumn 🍂</text>

            {/* Winter (Bottom) */}
            <circle cx="225" cy="210" r="14" fill="#38BDF8" />
            <text x="225" y="240" fontSize="11" fontWeight="bold" fill="#67E8F9" textAnchor="middle">Winter ❄️</text>

            {/* Spring (Left) */}
            <circle cx="65" cy="130" r="14" fill="#38BDF8" />
            <text x="65" y="160" fontSize="11" fontWeight="bold" fill="#22C55E" textAnchor="middle">Spring 🌸</text>
          </svg>
        )}
      </div>

      <div className="earth-footer-desc">
        <p>
          {viewMode === 'day-night'
            ? '🌍 Earth spins completely once every 24 hours. The side facing the Sun gets light (Day), while the opposite side is in shadow (Night).'
            : '🔄 As Earth travels along its 365-day elliptical orbit, its tilted axis causes direct sunlight to shift between hemispheres, creating Spring, Summer, Autumn, and Winter!'}
        </p>
      </div>
    </div>
  );
}
