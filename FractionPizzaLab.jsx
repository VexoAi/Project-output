import React, { useState, useEffect } from 'react';
import { audioService } from '../../services/audioService';
import { Pizza, Sparkles, RefreshCw } from 'lucide-react';

export default function FractionPizzaLab({ activeExample }) {
  const [totalSlices, setTotalSlices] = useState(4); // Denominator
  const [selectedSlices, setSelectedSlices] = useState(new Set([0])); // Numerator slices

  useEffect(() => {
    if (activeExample?.denominator) {
      setTotalSlices(activeExample.denominator);
      const num = activeExample.numerator || 1;
      const initial = new Set();
      for (let i = 0; i < num; i++) initial.add(i);
      setSelectedSlices(initial);
    }
  }, [activeExample]);

  const handleDenomChange = (d) => {
    audioService.playClickSound();
    setTotalSlices(d);
    setSelectedSlices(new Set([0]));
  };

  const toggleSlice = (index) => {
    audioService.playClickSound();
    setSelectedSlices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        if (next.size > 0) next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const numerator = selectedSlices.size;
  const fractionValue = totalSlices > 0 ? (numerator / totalSlices) : 0;
  const percentage = Math.round(fractionValue * 100);

  // Generate SVG slice paths
  const renderSlices = () => {
    const center = 150;
    const radius = 110;
    const sliceAngle = 360 / totalSlices;
    const slices = [];

    for (let i = 0; i < totalSlices; i++) {
      const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const isSelected = selectedSlices.has(i);
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      // Slice path
      const pathData = totalSlices === 1
        ? `M ${center - radius} ${center} A ${radius} ${radius} 0 1 0 ${center + radius} ${center} A ${radius} ${radius} 0 1 0 ${center - radius} ${center}`
        : `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      // Midpoint angle for slice topping & label
      const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
      const topX = center + (radius * 0.6) * Math.cos(midAngle);
      const topY = center + (radius * 0.6) * Math.sin(midAngle);

      slices.push(
        <g key={i} onClick={() => toggleSlice(i)} className="pizza-slice-group cursor-pointer">
          <path
            d={pathData}
            fill={isSelected ? '#F59E0B' : '#FEF3C7'}
            stroke="#D97706"
            strokeWidth="3"
            className={`slice-path ${isSelected ? 'slice-selected' : 'slice-unselected'}`}
          />
          {/* Crust border */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
            stroke="#B45309"
            strokeWidth="10"
            fill="none"
          />

          {/* Pepperoni toppings if selected */}
          {isSelected && (
            <circle cx={topX} cy={topY} r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          )}
          {isSelected && (
            <circle cx={topX + 8} cy={topY - 8} r="5" fill="#15803D" />
          )}

          {/* Slice number */}
          <text
            x={topX}
            y={topY + (isSelected ? 18 : 4)}
            fontSize="11"
            fontWeight="bold"
            fill={isSelected ? '#78350F' : '#94A3B8'}
            textAnchor="middle"
          >
            #{i + 1}
          </text>
        </g>
      );
    }
    return slices;
  };

  return (
    <div className="fraction-lab-container">
      {/* Denominator Selector */}
      <div className="fraction-toolbar">
        <span className="denom-title">Cut Pizza Into:</span>
        {[2, 3, 4, 6, 8].map(d => (
          <button
            key={d}
            onClick={() => handleDenomChange(d)}
            className={`denom-btn ${totalSlices === d ? 'active' : ''}`}
          >
            {d} Slices (1/{d})
          </button>
        ))}
      </div>

      {/* Main Interactive Pizza Area */}
      <div className="pizza-interactive-stage">
        <div className="pizza-svg-wrapper">
          <svg viewBox="0 0 300 300" className="pizza-svg">
            {/* Wooden Cutting Board */}
            <circle cx="150" cy="150" r="135" fill="#78350F" opacity="0.15" />
            <circle cx="150" cy="150" r="125" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="3" />

            {/* Slices */}
            {renderSlices()}

            {/* Center Pizza Hub */}
            <circle cx="150" cy="150" r="10" fill="#B45309" />
          </svg>
          <p className="click-hint">👆 Click any slice to add or remove it!</p>
        </div>

        {/* Real-time Math Scorecard */}
        <div className="fraction-scorecard">
          <div className="fraction-display-box">
            <div className="numerator-val">{numerator}</div>
            <div className="fraction-bar-line"></div>
            <div className="denominator-val">{totalSlices}</div>
          </div>

          <div className="fraction-details">
            <div className="math-row">
              <span className="row-label">Numerator (Selected):</span>
              <strong className="text-amber-600">{numerator} slice{numerator !== 1 ? 's' : ''}</strong>
            </div>
            <div className="math-row">
              <span className="row-label">Denominator (Total):</span>
              <strong className="text-teal-600">{totalSlices} equal slices</strong>
            </div>
            <div className="math-row">
              <span className="row-label">Decimal Value:</span>
              <strong className="text-blue-600">{fractionValue.toFixed(3)}</strong>
            </div>
            <div className="math-row">
              <span className="row-label">Percentage of Whole:</span>
              <strong className="text-purple-600">{percentage}%</strong>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="bar-visualizer">
            <span className="bar-title">Fraction Bar:</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%`, backgroundColor: '#F59E0B' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
