import React from 'react';
import EnglishActionVisualizer from './EnglishActionVisualizer';
import PastTenseVisualizer from './PastTenseVisualizer';
import VerbActionVisualizer from './VerbActionVisualizer';
import PrepositionVisualizer from './PrepositionVisualizer';
import NounsVisualizer from './NounsVisualizer';
import AdjectivesVisualizer from './AdjectivesVisualizer';
import SentenceFormationVisualizer from './SentenceFormationVisualizer';

// New Advanced English Concepts
import ActivePassiveVisualizer from './ActivePassiveVisualizer';
import ParajumbleVisualizer from './ParajumbleVisualizer';
import DirectIndirectVisualizer from './DirectIndirectVisualizer';
import ArticlesVisualizer from './ArticlesVisualizer';

import FractionPizzaLab from './FractionPizzaLab';
import GeometryShapesLab from './GeometryShapesLab';
import MultiplicationArrayLab from './MultiplicationArrayLab';

import PhotosynthesisLab from './PhotosynthesisLab';
import WaterCycleLab from './WaterCycleLab';
import SolarSystemLab from './SolarSystemLab';
import StatesOfMatterVisualizer from './StatesOfMatterVisualizer';

import EarthRotationVisualizer from './EarthRotationVisualizer';
import ContinentsOceansLab from './ContinentsOceansLab';
import VolcanoVisualizer from './VolcanoVisualizer';

import BinaryLab from './BinaryLab';
import InternetWorksVisualizer from './InternetWorksVisualizer';
import GenericVisualizer from './GenericVisualizer';

export default function VisualRenderer({ concept, activeExample, onSelectExample, onOpenQuiz }) {
  if (!concept) {
    return (
      <div className="visual-empty-placeholder">
        <div className="placeholder-icon">🎬</div>
        <h3>Select or Ask a Topic to Begin Visual Learning</h3>
        <p>Type any question or click the microphone to see real-time visual explanations.</p>
      </div>
    );
  }

  // Route every single concept directly to its dedicated visual animation engine!
  switch (concept.id) {
    // English
    case 'present-continuous':
      return (
        <EnglishActionVisualizer
          concept={concept}
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'past-tense':
      return (
        <PastTenseVisualizer
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'verbs':
      return (
        <VerbActionVisualizer
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'prepositions':
      return (
        <PrepositionVisualizer
          concept={concept}
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'active-passive':
      return (
        <ActivePassiveVisualizer
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'parajumbles':
      return (
        <ParajumbleVisualizer
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'direct-indirect':
      return (
        <DirectIndirectVisualizer
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'articles':
      return (
        <ArticlesVisualizer
          activeExample={activeExample}
          onSelectExample={onSelectExample}
          onOpenQuiz={onOpenQuiz}
        />
      );

    case 'nouns':
      return <NounsVisualizer />;

    case 'adjectives':
      return <AdjectivesVisualizer />;

    case 'sentence-formation':
      return <SentenceFormationVisualizer />;

    // Mathematics
    case 'fractions':
      return <FractionPizzaLab activeExample={activeExample} />;

    case 'geometry-shapes':
      return <GeometryShapesLab />;

    case 'multiplication':
      return <MultiplicationArrayLab />;

    case 'angles':
      return <GenericVisualizer concept={concept} activeExample={activeExample} />;

    // Science
    case 'photosynthesis':
      return <PhotosynthesisLab />;

    case 'water-cycle':
      return <WaterCycleLab />;

    case 'solar-system':
      return <SolarSystemLab />;

    case 'states-of-matter':
      return <StatesOfMatterVisualizer />;

    // Social Science
    case 'earth-rotation':
      return <EarthRotationVisualizer />;

    case 'continents-oceans':
      return <ContinentsOceansLab />;

    case 'volcanoes':
      return <VolcanoVisualizer />;

    // Computer Science
    case 'binary-code':
      return <BinaryLab />;

    case 'algorithms-flowcharts':
      return <GenericVisualizer concept={concept} activeExample={activeExample} />;

    case 'how-internet-works':
      return <InternetWorksVisualizer />;

    default:
      return (
        <GenericVisualizer
          concept={concept}
          activeExample={activeExample}
        />
      );
  }
}
