import React, { useState } from 'react';
import { Sun, Droplets, Wind, Sparkles, Zap, RotateCcw } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function PhotosynthesisLab() {
  const [sunlight, setSunlight] = useState(80);
  const [waterActive, setWaterActive] = useState(true);
  const [co2Active, setCo2Active] = useState(true);
  const [activeStep, setActiveStep] = useState('all');

  const handleToggleWater = () => {
    audioService.playClickSound();
    setWaterActive(!waterActive);
  };

  const handleToggleCO2 = () => {
    audioService.playClickSound();
    setCo2Active(!co2Active);
  };

  const isPhotosynthesisActive = sunlight > 25 && waterActive && co2Active;

  return (
    <div className="photosynthesis-lab-container">
      {/* Top Laboratory Control Bar */}
      <div className="lab-controls-bar">
        <div className="control-item">
          <Sun size={18} className="text-amber-500" />
          <span className="ctrl-label">Sunlight: {sunlight}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sunlight}
            onChange={(e) => setSunlight(Number(e.target.value))}
            className="slider-input"
          />
        </div>

        <button
          onClick={handleToggleWater}
          className={`toggle-ctrl-btn ${waterActive ? 'active-water' : ''}`}
        >
          <Droplets size={16} />
          <span>Water Roots: {waterActive ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={handleToggleCO2}
          className={`toggle-ctrl-btn ${co2Active ? 'active-co2' : ''}`}
        >
          <Wind size={16} />
          <span>CO₂ Stomata: {co2Active ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Interactive Plant SVG Visual Stage */}
      <div className="photo-stage">
        <svg viewBox="0 0 450 300" className="photo-svg">
          {/* Sky & Ground Gradient */}
          <rect x="0" y="0" width="450" height="230" fill="#F0FDF4" />
          <rect x="0" y="230" width="450" height="70" fill="#78350F" />
          <line x1="0" y1="230" x2="450" y2="230" stroke="#15803D" strokeWidth="4" />

          {/* Glowing Sun */}
          <g className="glowing-sun" opacity={sunlight / 100}>
            <circle cx="60" cy="50" r="32" fill="#FBBF24" filter="drop-shadow(0 0 16px #F59E0B)" />
            <circle cx="60" cy="50" r="24" fill="#FEF08A" />
            {/* Sun Rays streaming down to leaf */}
            <line x1="85" y1="70" x2="200" y2="150" stroke="#FDE047" strokeWidth="3" strokeDasharray="6 4" className="sun-ray-beam" />
            <line x1="75" y1="85" x2="180" y2="160" stroke="#FDE047" strokeWidth="3" strokeDasharray="6 4" className="sun-ray-beam" />
          </g>

          {/* Plant Pot */}
          <polygon points="185,225 265,225 250,285 200,285" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
          <rect x="180" y="220" width="90" height="8" rx="2" fill="#C2410C" />

          {/* Soil & Root System */}
          <g className="roots-system">
            <path d="M 225 230 Q 220 255 210 275" stroke="#FDE68A" strokeWidth="3" fill="none" />
            <path d="M 225 230 Q 235 250 245 270" stroke="#FDE68A" strokeWidth="3" fill="none" />
            <path d="M 220 245 Q 195 260 195 275" stroke="#FDE68A" strokeWidth="2.5" fill="none" />
            
            {/* Animated Water Droplets traveling up from roots */}
            {waterActive && (
              <g className="water-particles-up">
                <circle cx="210" cy="270" r="3.5" fill="#38BDF8" className="water-dot w1" />
                <circle cx="225" cy="250" r="3.5" fill="#38BDF8" className="water-dot w2" />
                <circle cx="225" cy="220" r="3.5" fill="#38BDF8" className="water-dot w3" />
              </g>
            )}
          </g>

          {/* Plant Stem */}
          <path d="M 225 220 Q 222 170 225 120" stroke="#16A34A" strokeWidth="10" strokeLinecap="round" fill="none" />

          {/* Big Green Leaf */}
          <g className="main-leaf-group">
            {/* Left Leaf */}
            <path d="M 225 170 Q 150 140 140 180 Q 180 200 225 180 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <path d="M 225 175 Q 180 165 145 175" stroke="#15803D" strokeWidth="2" fill="none" />

            {/* Right Leaf */}
            <path d="M 225 145 Q 310 110 320 150 Q 280 180 225 155 Z" fill="#16A34A" stroke="#14532D" strokeWidth="2.5" />
            <path d="M 225 150 Q 275 135 315 145" stroke="#14532D" strokeWidth="2" fill="none" />

            {/* Top Leaf */}
            <path d="M 225 120 Q 200 80 225 60 Q 250 80 225 120 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
          </g>

          {/* Inflow: CO2 Gas */}
          {co2Active && (
            <g className="co2-inflow">
              <circle cx="110" cy="140" r="14" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" className="floating-gas" />
              <text x="110" y="144" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">CO₂</text>
              <path d="M 125 145 L 160 165" stroke="#64748B" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#arrow)" />
            </g>
          )}

          {/* Outflow: Oxygen (O2) */}
          {isPhotosynthesisActive && (
            <g className="oxygen-outflow">
              <circle cx="340" cy="115" r="15" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" className="bubble-float b1" />
              <text x="340" y="120" fontSize="11" fontWeight="bold" fill="#0369A1" textAnchor="middle">O₂</text>

              <circle cx="370" cy="90" r="13" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" className="bubble-float b2" />
              <text x="370" y="95" fontSize="10" fontWeight="bold" fill="#0369A1" textAnchor="middle">O₂</text>
            </g>
          )}

          {/* Plant Food Glucose Droplet inside leaf */}
          {isPhotosynthesisActive && (
            <g className="glucose-food">
              <circle cx="225" cy="150" r="10" fill="#FBBF24" stroke="#D97706" strokeWidth="2" className="pulse-glow" />
              <text x="225" y="154" fontSize="9" fontWeight="bold" fill="#78350F" textAnchor="middle">Food</text>
            </g>
          )}
        </svg>

        {/* Status Indicator */}
        <div className={`lab-status-badge ${isPhotosynthesisActive ? 'status-active' : 'status-idle'}`}>
          <Zap size={14} />
          <span>
            {isPhotosynthesisActive
              ? 'Photosynthesis ACTIVE: Producing Glucose (Sugar) & Oxygen (O₂)'
              : 'Photosynthesis IDLE: Needs Sunlight + Water + CO₂'}
          </span>
        </div>
      </div>

      {/* Chemical Equation Bar */}
      <div className="equation-bar">
        <div className="eq-box eq-in">6CO₂ (Carbon Dioxide)</div>
        <span className="eq-op">+</span>
        <div className="eq-box eq-in">6H₂O (Water)</div>
        <span className="eq-op">+</span>
        <div className="eq-box eq-sun">☀️ Sunlight</div>
        <span className="eq-arrow">➔</span>
        <div className="eq-box eq-out-food">C₆H₁₂O₆ (Glucose Sugar)</div>
        <span className="eq-op">+</span>
        <div className="eq-box eq-out-ox">6O₂ (Fresh Oxygen)</div>
      </div>
    </div>
  );
}
