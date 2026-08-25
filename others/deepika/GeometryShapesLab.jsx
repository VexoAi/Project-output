import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Box, Sparkles, Layers } from 'lucide-react';

export default function GeometryShapesLab() {
  const shapes = [
    { id: 'cube', name: '3D Cube', faces: 6, edges: 12, vertices: 8, color: '#3B82F6', desc: 'A solid 3D box where all 6 faces are identical flat squares.' },
    { id: 'sphere', name: '3D Sphere', faces: 1, edges: 0, vertices: 0, color: '#10B981', desc: 'A perfectly round 3D ball where every surface point is equidistant from the center.' },
    { id: 'cylinder', name: '3D Cylinder', faces: 3, edges: 2, vertices: 0, color: '#F59E0B', desc: 'A solid with 2 identical circular flat bases connected by a smooth curved surface.' },
    { id: 'pyramid', name: '3D Pyramid', faces: 5, edges: 8, vertices: 5, color: '#8B5CF6', desc: 'A polygon base connected to a sharp single apex point by triangular faces.' }
  ];

  const [selectedShapeId, setSelectedShapeId] = useState('cube');
  const currentShape = shapes.find(s => s.id === selectedShapeId) || shapes[0];

  const handleSelectShape = (id) => {
    audioService.playClickSound();
    setSelectedShapeId(id);
  };

  return (
    <div className="geometry-lab-container">
      {/* Shape Selector Bar */}
      <div className="shapes-selector-bar">
        {shapes.map(s => (
          <button
            key={s.id}
            onClick={() => handleSelectShape(s.id)}
            className={`shape-pill-btn ${selectedShapeId === s.id ? 'active' : ''}`}
          >
            <Box size={16} />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* 3D Shape SVG & Stats */}
      <div className="shape-display-stage">
        <div className="shape-svg-wrapper">
          <svg viewBox="0 0 300 240" className="shape-svg">
            {/* Cube */}
            {currentShape.id === 'cube' && (
              <g className="cube-3d-group" transform="translate(75, 40)">
                <polygon points="40,30 110,30 110,100 40,100" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2.5" />
                <polygon points="40,30 80,0 150,0 110,30" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2.5" />
                <polygon points="110,30 150,0 150,70 110,100" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
              </g>
            )}

            {/* Sphere */}
            {currentShape.id === 'sphere' && (
              <g className="sphere-3d-group" transform="translate(150, 120)">
                <circle cx="0" cy="0" r="70" fill="#10B981" stroke="#047857" strokeWidth="3" />
                <ellipse cx="0" cy="0" rx="70" ry="25" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="-25" cy="-25" r="14" fill="#FFFFFF" opacity="0.6" />
              </g>
            )}

            {/* Cylinder */}
            {currentShape.id === 'cylinder' && (
              <g className="cylinder-3d-group" transform="translate(100, 30)">
                <ellipse cx="50" cy="30" rx="50" ry="18" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
                <rect x="0" y="30" width="100" height="110" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" />
                <ellipse cx="50" cy="140" rx="50" ry="18" fill="#D97706" stroke="#B45309" strokeWidth="2.5" />
              </g>
            )}

            {/* Pyramid */}
            {currentShape.id === 'pyramid' && (
              <g className="pyramid-3d-group" transform="translate(80, 40)">
                <polygon points="70,10 10,130 90,145" fill="#A78BFA" stroke="#5B21B6" strokeWidth="2.5" />
                <polygon points="70,10 90,145 140,115" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2.5" />
              </g>
            )}
          </svg>
        </div>

        {/* Shape Stats Card */}
        <div className="shape-properties-card">
          <h3>{currentShape.name}</h3>
          <p className="shape-desc">{currentShape.desc}</p>

          <div className="properties-grid">
            <div className="prop-box">
              <span className="p-num">{currentShape.faces}</span>
              <span className="p-label">Faces</span>
            </div>
            <div className="prop-box">
              <span className="p-num">{currentShape.edges}</span>
              <span className="p-label">Edges</span>
            </div>
            <div className="prop-box">
              <span className="p-num">{currentShape.vertices}</span>
              <span className="p-label">Vertices (Corners)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
