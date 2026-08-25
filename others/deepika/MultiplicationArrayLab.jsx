import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Sparkles, Grid } from 'lucide-react';

export default function MultiplicationArrayLab() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);

  const total = rows * cols;

  const handleRowsChange = (r) => {
    audioService.playClickSound();
    setRows(r);
  };

  const handleColsChange = (c) => {
    audioService.playClickSound();
    setCols(c);
  };

  return (
    <div className="multiplication-lab-container">
      {/* Array Dimensions Controls */}
      <div className="array-controls-bar">
        <div className="ctrl-group">
          <span>Rows (Groups): <strong>{rows}</strong></span>
          <div className="dim-buttons">
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                onClick={() => handleRowsChange(r)}
                className={`dim-btn ${rows === r ? 'active' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <span className="mult-sign">×</span>

        <div className="ctrl-group">
          <span>Columns (Per Row): <strong>{cols}</strong></span>
          <div className="dim-buttons">
            {[1, 2, 3, 4, 5, 6].map(c => (
              <button
                key={c}
                onClick={() => handleColsChange(c)}
                className={`dim-btn ${cols === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Apple Array Grid */}
      <div className="apple-array-stage">
        <div
          className="apple-grid"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${cols}, 1fr)`
          }}
        >
          {Array.from({ length: total }).map((_, idx) => (
            <div key={idx} className="apple-item-cell">
              <span className="apple-emoji">🍎</span>
              <small className="apple-count-idx">#{idx + 1}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Repeated Addition & Multiplication Scorecard */}
      <div className="multiplication-equation-card">
        <div className="eq-main-line">
          <span className="eq-term">{rows} Rows</span>
          <span className="eq-op">×</span>
          <span className="eq-term">{cols} Apples</span>
          <span className="eq-op">=</span>
          <span className="eq-total">{total} Apples</span>
        </div>

        <div className="repeated-addition-line">
          <span>Repeated Addition:</span>
          <strong>{Array(rows).fill(cols).join(' + ')} = {total}</strong>
        </div>
      </div>
    </div>
  );
}
