import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Binary, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export default function BinaryLab() {
  // 8-bit state: index 0 is 128, index 7 is 1
  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]); // default: 65 = 'A'

  const toggleBit = (index) => {
    audioService.playClickSound();
    setBits(prev => {
      const copy = [...prev];
      copy[index] = copy[index] === 1 ? 0 : 1;
      return copy;
    });
  };

  const setPreset = (num) => {
    audioService.playClickSound();
    const newBits = [];
    let rem = num;
    for (let i = 0; i < 8; i++) {
      if (rem >= bitWeights[i]) {
        newBits.push(1);
        rem -= bitWeights[i];
      } else {
        newBits.push(0);
      }
    }
    setBits(newBits);
  };

  const decimalValue = bits.reduce((acc, bit, idx) => acc + (bit * bitWeights[idx]), 0);
  const asciiChar = decimalValue >= 32 && decimalValue <= 126 ? String.fromCharCode(decimalValue) : 'Special/Non-printable';

  return (
    <div className="binary-lab-container">
      {/* Preset Numbers Bar */}
      <div className="binary-presets">
        <span className="preset-label">Quick Presets:</span>
        {[
          { label: 'Number 5', val: 5 },
          { label: 'Number 42 (Answer to Life)', val: 42 },
          { label: 'Letter "A" (65)', val: 65 },
          { label: 'Letter "Z" (90)', val: 90 },
          { label: 'Max Byte (255)', val: 255 },
          { label: 'Reset (0)', val: 0 }
        ].map(p => (
          <button
            key={p.label}
            onClick={() => setPreset(p.val)}
            className="preset-btn"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 8-Bit Interactive Switchboard */}
      <div className="switchboard-grid">
        {bits.map((bit, idx) => {
          const weight = bitWeights[idx];
          const isOn = bit === 1;
          return (
            <div key={idx} className={`bit-card ${isOn ? 'bit-on' : 'bit-off'}`}>
              <span className="bit-weight-label">{weight}</span>
              <span className="bit-power-label">2^{7 - idx}</span>

              <button
                onClick={() => toggleBit(idx)}
                className={`bit-toggle-btn ${isOn ? 'toggle-on' : 'toggle-off'}`}
              >
                {bit}
              </button>

              <span className="bit-status-text">{isOn ? 'ON (1)' : 'OFF (0)'}</span>
            </div>
          );
        })}
      </div>

      {/* Real-time Calculation Panel */}
      <div className="binary-calculation-panel">
        <div className="calc-breakdown">
          <span className="calc-title">Active Bit Sum:</span>
          <div className="sum-equation">
            {bits.map((b, i) => b === 1 ? bitWeights[i] : null).filter(Boolean).join(' + ') || '0'}
          </div>
        </div>

        <div className="calc-results-grid">
          <div className="result-card res-decimal">
            <span className="res-tag">Decimal Number</span>
            <span className="res-value">{decimalValue}</span>
          </div>

          <div className="result-card res-binary">
            <span className="res-tag">Binary String</span>
            <span className="res-value">{bits.join('')}</span>
          </div>

          <div className="result-card res-ascii">
            <span className="res-tag">ASCII Character</span>
            <span className="res-value">{decimalValue >= 32 && decimalValue <= 126 ? `"${asciiChar}"` : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
