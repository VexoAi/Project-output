import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Flame, Play, Sparkles } from 'lucide-react';

export default function VolcanoVisualizer() {
  const [isErupting, setIsErupting] = useState(true);

  const toggleEruption = () => {
    audioService.playClickSound();
    setIsErupting(!isErupting);
  };

  return (
    <div className="volcano-visualizer-container">
      {/* Top Controls */}
      <div className="volcano-toolbar">
        <button
          onClick={toggleEruption}
          className={`volcano-toggle-btn ${isErupting ? 'active' : ''}`}
        >
          <Flame size={16} />
          <span>{isErupting ? 'Eruption Mode: ACTIVE 🔥' : 'Eruption Mode: DORMANT 💤'}</span>
        </button>
      </div>

      {/* SVG Geological Cutaway Stage */}
      <div className="volcano-stage">
        <svg viewBox="0 0 450 270" className="volcano-svg">
          {/* Sky */}
          <rect x="0" y="0" width="450" height="190" fill="#FEF2F2" />
          {/* Underground Earth Crust */}
          <rect x="0" y="190" width="450" height="80" fill="#451A03" />

          {/* Volcano Cone Mountain */}
          <polygon points="50,210 225,50 400,210" fill="#78350F" />
          {/* Ash and rock layers */}
          <polygon points="120,210 225,90 330,210" fill="#92400E" />

          {/* Main Magma Conduit Pipe */}
          <rect x="215" y="50" width="20" height="160" fill={isErupting ? '#DC2626' : '#991B1B'} />

          {/* Subsurface Magma Chamber */}
          <ellipse cx="225" cy="225" rx="85" ry="25" fill="#EF4444" className={isErupting ? 'pulse-magma' : ''} />
          <text x="225" y="229" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">MAGMA CHAMBER</text>

          {/* Erupting Lava Fountains & Ash Clouds */}
          {isErupting && (
            <g className="eruption-elements">
              {/* Glowing Lava Streams */}
              <path d="M 220 50 Q 210 15 170 65 Q 185 105 195 145" fill="none" stroke="#F59E0B" strokeWidth="5" className="lava-flow" />
              <path d="M 230 50 Q 240 15 280 65 Q 265 105 255 145" fill="none" stroke="#EF4444" strokeWidth="5" className="lava-flow" />

              {/* Billowing Ash Clouds */}
              <circle cx="210" cy="25" r="18" fill="#64748B" opacity="0.8" />
              <circle cx="240" cy="20" r="22" fill="#475569" opacity="0.8" />
              <circle cx="225" cy="10" r="16" fill="#94A3B8" opacity="0.8" />

              {/* Lava projectile sparks */}
              <circle cx="190" cy="30" r="3" fill="#FDE047" />
              <circle cx="260" cy="35" r="3.5" fill="#EF4444" />
            </g>
          )}

          {/* Geological Anatomy Labels */}
          <rect x="20" y="70" width="100" height="22" rx="4" fill="#FFFFFF" stroke="#D1D5DB" />
          <text x="70" y="85" fontSize="9" fontWeight="bold" fill="#1E293B" textAnchor="middle">Crater / Vent 🌋</text>

          <rect x="330" y="110" width="100" height="22" rx="4" fill="#FFFFFF" stroke="#D1D5DB" />
          <text x="380" y="125" fontSize="9" fontWeight="bold" fill="#DC2626" textAnchor="middle">Flowing Lava ♨️</text>
        </svg>
      </div>

      <div className="volcano-footer-info">
        <Sparkles size={16} className="text-amber-500" />
        <p><strong>Magma</strong> is liquid rock underground in the chamber. Once it erupts onto the surface, it is called <strong>Lava</strong>!</p>
      </div>
    </div>
  );
}
