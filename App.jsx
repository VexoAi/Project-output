import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import SubjectSelector from './components/SubjectSelector';
import ConceptBrowser from './components/ConceptBrowser';
import Classroom from './components/Classroom';
import QuizModal from './components/QuizModal';
import DisambiguationModal from './components/DisambiguationModal';
import ProgressDashboard from './components/ProgressDashboard';
import TeacherDemoModal from './components/TeacherDemoModal';
import { SUBJECTS, CONCEPTS } from './data/curriculumData';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, subjects, concepts, classroom
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [activeConcept, setActiveConcept] = useState(CONCEPTS['present-continuous']);
  
  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizConcept, setQuizConcept] = useState(null);
  const [isDisambiguationOpen, setIsDisambiguationOpen] = useState(false);
  const [disambigData, setDisambigData] = useState({ query: '', suggestions: [] });
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Student progress state (stored in localStorage)
  const [studentProgress, setStudentProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_visual_education_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      completedConcepts: {
        'present-continuous': {
          conceptId: 'present-continuous',
          conceptTitle: 'Present Continuous Tense',
          score: 4,
          total: 4,
          date: new Date().toISOString()
        }
      },
      streak: 3
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_visual_education_progress', JSON.stringify(studentProgress));
    } catch (e) {
      console.warn(e);
    }
  }, [studentProgress]);

  // Navigate to Subjects view
  const handleStartLearning = () => {
    setCurrentView('subjects');
  };

  // Select Subject & go to Concept Browser
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('concepts');
  };

  // Select Concept & go to Real-time Visual Classroom
  const handleSelectConcept = (concept) => {
    setActiveConcept(concept);
    const subj = SUBJECTS.find(s => s.id === concept.subjectId);
    if (subj) setSelectedSubject(subj);
    setCurrentView('classroom');
  };

  // Open Quiz
  const handleOpenQuiz = (conceptToQuiz) => {
    setQuizConcept(conceptToQuiz || activeConcept);
    setIsQuizOpen(true);
  };

  // Finish Quiz and update student progress
  const handleFinishQuiz = (result) => {
    setStudentProgress(prev => ({
      ...prev,
      completedConcepts: {
        ...prev.completedConcepts,
        [result.conceptId]: result
      }
    }));
  };

  // Open Disambiguation Modal
  const handleOpenDisambiguation = (data) => {
    setDisambigData(data);
    setIsDisambiguationOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Sticky Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenProgress={() => setIsProgressOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        progress={studentProgress}
        activeConcept={activeConcept}
      />

      {/* Main Screen Content Switching */}
      <main className="main-content-viewport">
        {currentView === 'landing' && (
          <HeroLanding
            onStartLearning={handleStartLearning}
            onOpenDemo={() => setIsDemoOpen(true)}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {currentView === 'subjects' && (
          <SubjectSelector
            onSelectSubject={handleSelectSubject}
            onOpenDemo={() => setIsDemoOpen(true)}
          />
        )}

        {currentView === 'concepts' && (
          <ConceptBrowser
            subject={selectedSubject}
            onSelectConcept={handleSelectConcept}
            onBackToSubjects={() => setCurrentView('subjects')}
            onOpenDisambiguation={handleOpenDisambiguation}
          />
        )}

        {currentView === 'classroom' && (
          <Classroom
            concept={activeConcept}
            onSelectConcept={handleSelectConcept}
            onOpenQuiz={handleOpenQuiz}
            onOpenDisambiguation={handleOpenDisambiguation}
            onBackToSubjects={() => setCurrentView('subjects')}
          />
        )}
      </main>

      {/* Interactive Mini Quiz Modal */}
      {isQuizOpen && quizConcept && (
        <QuizModal
          concept={quizConcept}
          onClose={() => setIsQuizOpen(false)}
          onFinishQuiz={handleFinishQuiz}
        />
      )}

      {/* AI Semantic Disambiguation Modal ("Did you mean: ...") */}
      {isDisambiguationOpen && (
        <DisambiguationModal
          query={disambigData.query}
          suggestions={disambigData.suggestions}
          onSelectConcept={(concept) => {
            setIsDisambiguationOpen(false);
            handleSelectConcept(concept);
          }}
          onClose={() => setIsDisambiguationOpen(false)}
        />
      )}

      {/* Student Progress Analytics Dashboard */}
      {isProgressOpen && (
        <ProgressDashboard
          progress={studentProgress}
          onSelectConcept={(concept) => {
            handleSelectConcept(concept);
          }}
          onClose={() => setIsProgressOpen(false)}
        />
      )}

      {/* Teacher 10-Step Demo Tour */}
      {isDemoOpen && (
        <TeacherDemoModal
          onClose={() => setIsDemoOpen(false)}
          onLaunchDemoConcept={(concept) => {
            handleSelectConcept(concept);
          }}
        />
      )}
    </div>
  );
}
