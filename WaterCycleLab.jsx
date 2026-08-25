import React, { useState } from 'react';
import { CloudRain, Sun, Wind, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function WaterCycleLab() {
  const [selectedPhase, setSelectedPhase] = useState('all'); // all, evap, cond, precip, coll

  const phases = [
    { id: 'all', label: 'All Cycles', emoji: '🔄' },
    { id: 'evap', label: '1. Evaporation', emoji: '💨', color: '#F59E0B' },
    { id: 'cond', label: '2. Condensation', emoji: '☁️', color: '#60A5FA' },
    { id: 'precip', label: '3. Precipitation', emoji: '🌧️', color: '#3B82F6' },
    { id: 'coll', label: '4. Collection', emoji: '🌊', color: '#0D9488' }
  ];

  const handleSelectPhase = (phaseId) => {
    audioService.playClickSound();
    setSelectedPhase(phaseId);
  };

  return (
    <div className="water-cycle-container">
      {/* Stage Selector Bar */}
      <div className="cycle-phase-selector">
        {phases.map(p => (
          <button
            key={p.id}
            onClick={() => handleSelectPhase(p.id)}
            className={`phase-btn ${selectedPhase === p.id ? 'active' : ''}`}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Water Cycle SVG Canvas */}
      <div className="water-stage">
        <svg viewBox="0 0 500 320" className="water-svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect x="0" y="0" width="500" height="230" fill="url(#skyGrad)" />

          {/* Glowing Sun */}
          <g className="water-sun">
            <circle cx="70" cy="55" r="32" fill="#FBBF24" filter="drop-shadow(0 0 12px #F59E0B)" />
            <circle cx="70" cy="55" r="24" fill="#FEF08A" />
          </g>

          {/* Mountains on the right */}
          <polygon points="260,230 360,90 440,230" fill="url(#mountainGrad)" />
          <polygon points="330,230 420,110 500,230" fill="#475569" />
          {/* Snow caps */}
          <polygon points="345,110 360,90 375,110 368,115 360,112 352,115" fill="#FFFFFF" />
          <polygon points="405,130 420,110 435,130 428,135 420,132 412,135" fill="#FFFFFF" />

          {/* Green Land / Hills */}
          <path d="M 0 230 Q 150 210 280 230 L 280 320 L 0 320 Z" fill="#16A34A" />

          {/* Ocean & Lake Water Body */}
          <path d="M 0 240 Q 120 235 240 260 L 240 320 L 0 320 Z" fill="url(#oceanGrad)" />

          {/* River stream flowing down mountain to ocean (Collection) */}
          <path
            d="M 370 170 Q 320 220 220 265"
            stroke="#38BDF8"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity={selectedPhase === 'all' || selectedPhase === 'coll' ? 1 : 0.4}
          />

          {/* ================= PHASE 1: EVAPORATION ================= */}
          {(selectedPhase === 'all' || selectedPhase === 'evap') && (
            <g className="evap-group">
              {/* Rising Vapor arrows */}
              <path d="M 80 230 Q 90 180 85 130" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" fill="none" className="rising-vapour v1" />
              <path d="M 120 235 Q 130 175 125 125" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" fill="none" className="rising-vapour v2" />
              <path d="M 160 240 Q 170 185 165 135" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" fill="none" className="rising-vapour v3" />
              
              <rect x="70" y="150" width="105" height="24" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="122" y="166" fontSize="11" fontWeight="bold" fill="#B45309" textAnchor="middle">1. Evaporation 💨</text>
            </g>
          )}

          {/* ================= PHASE 2: CONDENSATION ================= */}
          {(selectedPhase === 'all' || selectedPhase === 'cond') && (
            <g className="cond-group">
              {/* Big fluffy Cloud */}
              <path
                d="M 190 70 Q 190 50 210 50 Q 225 35 245 45 Q 265 35 285 50 Q 305 50 305 70 Q 315 85 300 95 Q 190 100 190 70 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="2"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))"
              />
              <rect x="205" y="25" width="115" height="24" rx="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="262" y="41" fontSize="11" fontWeight="bold" fill="#1D4ED8" textAnchor="middle">2. Condensation ☁️</text>
            </g>
          )}

          {/* ================= PHASE 3: PRECIPITATION ================= */}
          {(selectedPhase === 'all' || selectedPhase === 'precip') && (
            <g className="precip-group">
              {/* Darker rain cloud */}
              <path
                d="M 310 80 Q 310 60 330 60 Q 345 45 365 55 Q 385 45 405 60 Q 425 60 425 80 Q 435 95 420 105 Q 310 110 310 80 Z"
                fill="#94A3B8"
                stroke="#475569"
                strokeWidth="2"
              />
              {/* Animated Raindrops */}
              <line x1="335" y1="115" x2="330" y2="140" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" className="raindrop r1" />
              <line x1="360" y1="118" x2="355" y2="145" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" className="raindrop r2" />
              <line x1="385" y1="115" x2="380" y2="142" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" className="raindrop r3" />
              <line x1="410" y1="118" x2="405" y2="146" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" className="raindrop r4" />

              <rect x="330" y="30" width="120" height="24" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
              <text x="390" y="46" fontSize="11" fontWeight="bold" fill="#0369A1" textAnchor="middle">3. Precipitation 🌧️</text>
            </g>
          )}

          {/* ================= PHASE 4: COLLECTION ================= */}
          {(selectedPhase === 'all' || selectedPhase === 'coll') && (
            <g className="coll-group">
              <rect x="180" y="275" width="115" height="24" rx="12" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
              <text x="237" y="291" fontSize="11" fontWeight="bold" fill="#0F766E" textAnchor="middle">4. Collection 🌊</text>
            </g>
          )}
        </svg>
      </div>

      {/* Explanation Banner */}
      <div className="water-cycle-footer">
        <p>
          {selectedPhase === 'evap' && '💨 Evaporation: Solar thermal energy heats ocean and lake water, turning liquid into rising invisible water vapor gas.'}
          {selectedPhase === 'cond' && '☁️ Condensation: As rising water vapor cools high in the atmosphere, it condenses into billions of microscopic droplets forming clouds.'}
          {selectedPhase === 'precip' && '🌧️ Precipitation: When cloud water droplets become too dense and heavy, gravity pulls them down as rain, snow, or hail.'}
          {selectedPhase === 'coll' && '🌊 Collection: Rainwater drains through rivers and underground aquifers back into the oceans, completing the endless cycle!'}
          {selectedPhase === 'all' && '🔄 Continuous Hydrologic Loop: Water is infinitely recycled across Earth’s atmosphere, land, and oceans without ever running out!'}
        </p>
      </div>
    </div>
  );
}
