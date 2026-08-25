import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, Compass, Eye, Play, Layers } from 'lucide-react';

export default function GenericVisualizer({ concept, activeExample }) {
  // Interactive state for angles
  const [angleDegree, setAngleDegree] = useState(60);
  // Interactive state for sorting bars
  const [sortBars, setSortBars] = useState([45, 85, 20, 95, 60, 30]);
  const [isSorting, setIsSorting] = useState(false);
  // Interactive state for nouns
  const [activeNounCategory, setActiveNounCategory] = useState('person');

  // Angle type classifier
  const getAngleType = (deg) => {
    if (deg < 90) return { name: 'Acute Angle', desc: 'Sharp and less than 90°', color: '#10B981' };
    if (deg === 90) return { name: 'Right Angle', desc: 'Exact square corner (90°)', color: '#3B82F6' };
    if (deg < 180) return { name: 'Obtuse Angle', desc: 'Wide open between 90° and 180°', color: '#F59E0B' };
    return { name: 'Straight Angle', desc: 'Exact straight line (180°)', color: '#8B5CF6' };
  };

  // Run bubble sort step animation
  const runSortStep = () => {
    audioService.playClickSound();
    setIsSorting(true);
    let arr = [...sortBars];
    let swapped = false;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
        break;
      }
    }

    setSortBars(arr);
    if (!swapped) {
      audioService.playSuccessSound();
      setIsSorting(false);
    }
  };

  const resetBars = () => {
    audioService.playClickSound();
    setSortBars([45, 85, 20, 95, 60, 30]);
    setIsSorting(false);
  };

  // Render Angles Protractor
  if (concept?.id === 'angles') {
    const angleInfo = getAngleType(angleDegree);
    const rad = (angleDegree * Math.PI) / 180;
    const endX = 200 + 120 * Math.cos(-rad);
    const endY = 200 + 120 * Math.sin(-rad);

    return (
      <div className="generic-viz-box angles-viz">
        <div className="angle-slider-bar">
          <span>Angle: <strong>{angleDegree}°</strong></span>
          <input
            type="range"
            min="10"
            max="180"
            value={angleDegree}
            onChange={(e) => setAngleDegree(Number(e.target.value))}
            className="slider-input"
          />
          <span className="badge-pill" style={{ backgroundColor: `${angleInfo.color}20`, color: angleInfo.color, borderColor: angleInfo.color }}>
            {angleInfo.name}
          </span>
        </div>

        <div className="protractor-stage">
          <svg viewBox="0 0 400 240" className="protractor-svg">
            {/* Protractor Semi-Circle Outline */}
            <path d="M 60 200 A 140 140 0 0 1 340 200 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
            <line x1="60" y1="200" x2="340" y2="200" stroke="#475569" strokeWidth="3" />

            {/* Protractor tick marks */}
            {[0, 30, 45, 60, 90, 120, 135, 150, 180].map(deg => {
              const r = (deg * Math.PI) / 180;
              const tx1 = 200 + 140 * Math.cos(-r);
              const ty1 = 200 + 140 * Math.sin(-r);
              const tx2 = 200 + 125 * Math.cos(-r);
              const ty2 = 200 + 125 * Math.sin(-r);
              const lx = 200 + 112 * Math.cos(-r);
              const ly = 200 + 112 * Math.sin(-r);

              return (
                <g key={deg}>
                  <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#64748B" strokeWidth="1.5" />
                  <text x={lx} y={ly + 4} fontSize="9" fill="#64748B" textAnchor="middle">{deg}°</text>
                </g>
              );
            })}

            {/* Base Ray (0°) */}
            <line x1="200" y1="200" x2="340" y2="200" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

            {/* Dynamic Angle Ray */}
            <line x1="200" y1="200" x2={endX} y2={endY} stroke={angleInfo.color} strokeWidth="4" strokeLinecap="round" />

            {/* Arc sector fill */}
            <path
              d={`M 200 200 L 250 200 A 50 50 0 0 0 ${200 + 50 * Math.cos(-rad)} ${200 + 50 * Math.sin(-rad)} Z`}
              fill={angleInfo.color}
              opacity="0.25"
            />

            {/* Vertex Hub */}
            <circle cx="200" cy="200" r="7" fill="#1E293B" />
          </svg>
        </div>

        <div className="angle-desc-pill" style={{ borderColor: angleInfo.color }}>
          <Sparkles size={16} style={{ color: angleInfo.color }} />
          <span>{angleInfo.desc}</span>
        </div>
      </div>
    );
  }

  // Render Nouns Visualizer
  if (concept?.id === 'nouns') {
    const categories = [
      { id: 'person', label: 'Person 👨‍🏫', items: ['Teacher', 'Doctor', 'Astronaut', 'Chef', 'Student'] },
      { id: 'place', label: 'Place 🏫', items: ['School', 'Hospital', 'Library', 'Park', 'Island'] },
      { id: 'animal', label: 'Animal 🦁', items: ['Lion', 'Elephant', 'Dolphin', 'Eagle', 'Koala'] },
      { id: 'thing', label: 'Thing ⚽', items: ['Book', 'Telescope', 'Soccer Ball', 'Computer', 'Guitar'] }
    ];
    const currentCat = categories.find(c => c.id === activeNounCategory) || categories[0];

    return (
      <div className="generic-viz-box nouns-viz">
        <div className="nouns-category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { audioService.playClickSound(); setActiveNounCategory(cat.id); }}
              className={`cat-tab-btn ${activeNounCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="nouns-items-grid">
          {currentCat.items.map((item, i) => (
            <div key={i} className="noun-card">
              <span className="noun-icon">✨</span>
              <span className="noun-name">{item}</span>
              <span className="noun-tag">{currentCat.id.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Algorithm Sorting Visualizer
  if (concept?.id === 'algorithms-flowcharts') {
    return (
      <div className="generic-viz-box algorithms-viz">
        <div className="algo-toolbar">
          <button onClick={runSortStep} className="algo-btn-step">
            <Play size={16} />
            <span>Sort Next Step (Bubble Sort)</span>
          </button>
          <button onClick={resetBars} className="algo-btn-reset">
            <span>Shuffle / Reset</span>
          </button>
        </div>

        <div className="algo-bars-stage">
          {sortBars.map((val, idx) => (
            <div key={idx} className="bar-column">
              <div
                className="bar-fill"
                style={{
                  height: `${val * 2}px`,
                  backgroundColor: `hsl(${val * 2.2}, 80%, 50%)`
                }}
              >
                <span className="bar-num">{val}</span>
              </div>
              <span className="bar-idx">[{idx}]</span>
            </div>
          ))}
        </div>
        <p className="algo-hint">👆 Click "Sort Next Step" to watch adjacent comparison and swapping in action!</p>
      </div>
    );
  }

  // Render Volcano Structure
  if (concept?.id === 'volcanoes') {
    return (
      <div className="generic-viz-box volcano-viz">
        <svg viewBox="0 0 450 260" className="volcano-svg">
          <rect x="0" y="0" width="450" height="180" fill="#FEF2F2" />
          <rect x="0" y="180" width="450" height="80" fill="#451A03" />

          {/* Volcano Conical Slopes */}
          <polygon points="50,220 225,60 400,220" fill="#78350F" />

          {/* Main Magma Conduit Pipe */}
          <rect x="215" y="60" width="20" height="160" fill="#DC2626" />

          {/* Subterranean Magma Chamber */}
          <ellipse cx="225" cy="230" rx="90" ry="25" fill="#EF4444" className="pulse-magma" />
          <text x="225" y="235" fontSize="11" fontWeight="bold" fill="#FEF2F2" textAnchor="middle">MAGMA CHAMBER</text>

          {/* Crater summit & Erupting Lava / Smoke */}
          <ellipse cx="225" cy="60" rx="20" ry="6" fill="#B91C1C" />
          
          {/* Glowing Lava fountains */}
          <path d="M 220 60 Q 210 20 180 50 Q 195 90 205 130" fill="none" stroke="#F59E0B" strokeWidth="5" className="lava-flow" />
          <path d="M 230 60 Q 240 20 270 50 Q 255 90 245 130" fill="none" stroke="#EF4444" strokeWidth="5" className="lava-flow" />

          {/* Smoke Ash Clouds */}
          <circle cx="210" cy="30" r="16" fill="#94A3B8" opacity="0.7" />
          <circle cx="240" cy="25" r="20" fill="#64748B" opacity="0.7" />
        </svg>
      </div>
    );
  }

  // Default Concept Card Fallback
  return (
    <div className="generic-concept-card">
      <div className="concept-diagram-header">
        <Sparkles size={20} className="text-indigo-500" />
        <h3>{concept?.title || 'Visual Concept Diagram'}</h3>
      </div>

      <div className="objects-grid">
        {concept?.visualObjects?.map((obj, i) => (
          <div key={i} className="visual-object-badge">
            <span className="obj-icon">🔹</span>
            <div className="obj-text">
              <strong>{obj.name}</strong>
              <small>{obj.tag}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
