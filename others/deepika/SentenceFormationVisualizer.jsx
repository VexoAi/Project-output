import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function SentenceFormationVisualizer() {
  const subjects = ['The cat', 'Emma', 'The astronaut', 'The chef'];
  const verbs = ['caught', 'baked', 'visited', 'cooked'];
  const objects = ['the mouse.', 'a delicious cake.', 'the moon.', 'fresh pasta.'];

  const [selectedSubj, setSelectedSubj] = useState(0);
  const [selectedVerb, setSelectedVerb] = useState(0);
  const [selectedObj, setSelectedObj] = useState(0);
  const [isAssembled, setIsAssembled] = useState(true);

  const fullSentence = `${subjects[selectedSubj]} ${verbs[selectedVerb]} ${objects[selectedObj]}`;

  const handleSelect = (type, index) => {
    audioService.playClickSound();
    if (type === 'subj') setSelectedSubj(index);
    if (type === 'verb') setSelectedVerb(index);
    if (type === 'obj') setSelectedObj(index);
  };

  return (
    <div className="sentence-builder-container">
      {/* Jigsaw Construction Stage */}
      <div className="jigsaw-blocks-stage">
        <div className="jigsaw-block-col">
          <span className="block-type-header">1. WHO (Subject)</span>
          <div className="block-choices">
            {subjects.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect('subj', idx)}
                className={`jigsaw-choice-btn subj-choice ${selectedSubj === idx ? 'active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="jigsaw-block-col">
          <span className="block-type-header">2. ACTION (Verb)</span>
          <div className="block-choices">
            {verbs.map((v, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect('verb', idx)}
                className={`jigsaw-choice-btn verb-choice ${selectedVerb === idx ? 'active' : ''}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="jigsaw-block-col">
          <span className="block-type-header">3. WHAT (Object)</span>
          <div className="block-choices">
            {objects.map((o, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect('obj', idx)}
                className={`jigsaw-choice-btn obj-choice ${selectedObj === idx ? 'active' : ''}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assembled Sentence Banner */}
      <div className="assembled-sentence-card">
        <div className="assembled-title">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>Assembled Complete Sentence:</span>
        </div>
        <div className="sentence-tokens-row">
          <span className="token-pill token-subj">{subjects[selectedSubj]}</span>
          <span className="token-pill token-verb">{verbs[selectedVerb]}</span>
          <span className="token-pill token-obj">{objects[selectedObj]}</span>
        </div>
      </div>
    </div>
  );
}
