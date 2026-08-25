import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Flame, Snowflake, Sparkles } from 'lucide-react';

export default function StatesOfMatterVisualizer() {
  const [temperature, setTemperature] = useState(25); // -10 to 120 C

  const getState = (temp) => {
    if (temp <= 0) return { name: 'Solid (Ice)', emoji: '🧊', color: '#38BDF8', desc: 'Molecules tightly locked in a rigid crystal lattice. Vibrating in place with fixed shape and volume.' };
    if (temp < 100) return { name: 'Liquid (Water)', emoji: '💧', color: '#0284C7', desc: 'Molecules have enough thermal energy to slide around each other. Takes the shape of its container.' };
    return { name: 'Gas (Steam)', emoji: '💨', color: '#F59E0B', desc: 'High thermal energy! Molecules fly freely in all directions, spreading out to fill all available space.' };
  };

  const stateInfo = getState(temperature);

  return (
    <div className="states-matter-container">
      {/* Temperature Control Bar */}
      <div className="temp-control-bar">
        <div className="temp-title">
          <Flame size={18} className="text-amber-500" />
          <span>Thermal Energy (Temperature): <strong>{temperature}°C</strong></span>
        </div>
        <input
          type="range"
          min="-15"
          max="125"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="slider-input"
        />
        <div className="state-badge" style={{ backgroundColor: `${stateInfo.color}25`, color: stateInfo.color, borderColor: stateInfo.color }}>
          <span>{stateInfo.emoji} {stateInfo.name}</span>
        </div>
      </div>

      {/* Molecular Animation Stage */}
      <div className="molecules-stage">
        <svg viewBox="0 0 400 240" className="molecules-svg">
          {/* Glass Beaker Container */}
          <rect x="70" y="30" width="260" height="180" rx="10" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="4" />
          <line x1="60" y1="30" x2="340" y2="30" stroke="#64748B" strokeWidth="4" />

          {/* Molecule Particles */}
          {temperature <= 0 && (
            <g className="solid-lattice">
              {[
                [140, 130], [170, 130], [200, 130], [230, 130], [260, 130],
                [140, 160], [170, 160], [200, 160], [230, 160], [260, 160],
                [140, 190], [170, 190], [200, 190], [230, 190], [260, 190]
              ].map(([mx, my], i) => (
                <circle key={i} cx={mx} cy={my} r="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" className="mol-solid" />
              ))}
            </g>
          )}

          {temperature > 0 && temperature < 100 && (
            <g className="liquid-flow">
              <path d="M 72 130 Q 200 120 328 130 L 328 208 L 72 208 Z" fill="#E0F2FE" opacity="0.6" />
              {[
                [110, 150], [145, 175], [180, 145], [210, 185], [250, 150], [285, 175],
                [130, 195], [170, 190], [210, 155], [245, 195], [280, 140]
              ].map(([mx, my], i) => (
                <circle key={i} cx={mx} cy={my} r="10" fill="#0284C7" stroke="#0369A1" strokeWidth="2" className="mol-liquid" />
              ))}
            </g>
          )}

          {temperature >= 100 && (
            <g className="gas-steam">
              {[
                [100, 60], [160, 45], [220, 75], [280, 50],
                [130, 110], [190, 95], [250, 120], [300, 90],
                [110, 160], [180, 155], [240, 175], [290, 150]
              ].map(([mx, my], i) => (
                <circle key={i} cx={mx} cy={my} r="9" fill="#F59E0B" stroke="#D97706" strokeWidth="2" className="mol-gas" />
              ))}
            </g>
          )}
        </svg>
      </div>

      <div className="matter-desc-card">
        <Sparkles size={16} className="text-indigo-500" />
        <p>{stateInfo.desc}</p>
      </div>
    </div>
  );
}
