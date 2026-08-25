import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, Play, Pause, ZoomIn } from 'lucide-react';

export default function SolarSystemLab() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const planets = [
    { name: 'Sun', dist: 0, r: 24, color: '#FBBF24', speed: 0, fact: 'The massive star at the center holding 99.8% of solar mass.' },
    { name: 'Mercury', dist: 45, r: 6, color: '#94A3B8', speed: 4.1, fact: 'Smallest planet and closest to the sun. Extreme temperatures!' },
    { name: 'Venus', dist: 70, r: 8, color: '#F59E0B', speed: 2.8, fact: 'Hottest planet with thick greenhouse gas clouds.' },
    { name: 'Earth', dist: 100, r: 9, color: '#38BDF8', speed: 2.0, fact: 'Our home! Rich in water, oxygen, and thriving life.' },
    { name: 'Mars', dist: 130, r: 7, color: '#EF4444', speed: 1.5, fact: 'The Red Planet with giant volcanoes and red iron-oxide dust.' },
    { name: 'Jupiter', dist: 170, r: 16, color: '#D97706', speed: 1.0, fact: 'The largest gas giant with the Great Red Spot storm.' },
    { name: 'Saturn', dist: 210, r: 13, color: '#FCD34D', hasRings: true, speed: 0.7, fact: 'Famous for its glorious rings made of ice and rock chunks.' },
    { name: 'Uranus', dist: 250, r: 10, color: '#67E8F9', speed: 0.5, fact: 'An icy gas giant that rotates tilted sideways on its axis.' },
    { name: 'Neptune', dist: 285, r: 10, color: '#3B82F6', speed: 0.4, fact: 'The outermost ice giant with supersonic winds.' }
  ];

  const handlePlanetClick = (p) => {
    audioService.playClickSound();
    setSelectedPlanet(p);
  };

  return (
    <div className="solar-system-container">
      {/* Top Toolbar */}
      <div className="solar-toolbar">
        <div className="controls-group">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="icon-ctrl-btn"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause Orbits' : 'Resume Orbits'}</span>
          </button>
          <button
            onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)}
            className="icon-ctrl-btn speed-badge"
          >
            <span>Speed: {speed}x</span>
          </button>
        </div>

        <div className="planet-pill-chips">
          {planets.slice(1).map(p => (
            <button
              key={p.name}
              onClick={() => handlePlanetClick(p)}
              className={`planet-chip ${selectedPlanet?.name === p.name ? 'active' : ''}`}
            >
              <span className="dot" style={{ backgroundColor: p.color }}></span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orbit Canvas / SVG Stage */}
      <div className={`solar-stage ${!isPlaying ? 'paused-stage' : ''}`}>
        <svg viewBox="0 0 650 650" className="solar-svg">
          {/* Deep Space Background with Stars */}
          <rect x="0" y="0" width="650" height="650" fill="#0B0F19" />
          
          {/* Star twinkle dots */}
          {[
            [50, 40], [120, 90], [540, 80], [600, 200], [50, 500], [580, 520], [200, 600], [450, 580]
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r="1.5" fill="#FFFFFF" opacity="0.6" />
          ))}

          {/* Central Sun */}
          <g className="sun-group">
            <circle cx="325" cy="325" r="32" fill="#FBBF24" filter="drop-shadow(0 0 25px #F59E0B)" />
            <circle cx="325" cy="325" r="22" fill="#FEF08A" />
            <text x="325" y="330" fontSize="12" fontWeight="bold" fill="#78350F" textAnchor="middle">SUN</text>
          </g>

          {/* Planetary Orbits & Animated Planets */}
          {planets.slice(1).map((p) => {
            const orbitDuration = (20 / (p.speed * speed)).toFixed(1);
            return (
              <g key={p.name}>
                {/* Orbital path line */}
                <circle
                  cx="325"
                  cy="325"
                  r={p.dist}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="none"
                />

                {/* Orbiting Planet Group with CSS Animation */}
                <g
                  className="planet-orbit-anim"
                  style={{
                    transformOrigin: '325px 325px',
                    animationDuration: `${orbitDuration}s`,
                    animationPlayState: isPlaying ? 'running' : 'paused'
                  }}
                >
                  {/* Planet body */}
                  <g
                    transform={`translate(${325 + p.dist}, 325)`}
                    onClick={() => handlePlanetClick(p)}
                    className="planet-click-target cursor-pointer"
                  >
                    {/* Saturn rings */}
                    {p.hasRings && (
                      <ellipse cx="0" cy="0" rx={p.r * 2.2} ry={p.r * 0.7} fill="none" stroke="#FDE68A" strokeWidth="3" opacity="0.8" transform="rotate(-20)" />
                    )}

                    <circle
                      cx="0"
                      cy="0"
                      r={p.r}
                      fill={p.color}
                      stroke="#0F172A"
                      strokeWidth="1.5"
                      className="planet-orb"
                    />

                    {/* Planet label */}
                    <text
                      x="0"
                      y={p.r + 12}
                      fontSize="9"
                      fontWeight="bold"
                      fill="#94A3B8"
                      textAnchor="middle"
                    >
                      {p.name}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Planet Fact Card */}
      {selectedPlanet && (
        <div className="planet-fact-card">
          <div className="fact-header">
            <span className="fact-dot" style={{ backgroundColor: selectedPlanet.color }}></span>
            <h3>{selectedPlanet.name}</h3>
            <span className="fact-speed">{selectedPlanet.speed > 0 ? `Orbital Speed: ${selectedPlanet.speed} AU/yr` : 'Central Star'}</span>
          </div>
          <p>{selectedPlanet.fact}</p>
        </div>
      )}
    </div>
  );
}
