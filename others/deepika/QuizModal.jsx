import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audioService } from '../services/audioService';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import QuizResult from './QuizResult';

export default function QuizModal({ concept, onClose, onFinishQuiz }) {
  const questions = concept?.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = currentQ.options[optionIndex].correct;
    if (isCorrect) {
      audioService.playSuccessSound();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      audioService.playTryAgainSound();
    }

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        selectedOption: currentQ.options[optionIndex].text,
        isCorrect,
        correctOption: currentQ.options.find(o => o.correct)?.text,
        explanation: currentQ.explanation
      }
    ]);
  };

  const handleNext = () => {
    audioService.playClickSound();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      audioService.playFanfare();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
      if (onFinishQuiz) {
        const correctCount = userAnswers.filter(a => a.isCorrect).length + (currentQ.options[selectedOption]?.correct ? 1 : 0);
        onFinishQuiz({
          conceptId: concept.id,
          conceptTitle: concept.title,
          score: correctCount,
          total: questions.length,
          date: new Date().toISOString()
        });
      }
    }
  };

  const handleRetry = () => {
    audioService.playClickSound();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content quiz-modal">
          <h3>No Quiz Available for this topic yet.</h3>
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content quiz-modal-card">
        {isCompleted ? (
          <QuizResult
            concept={concept}
            userAnswers={userAnswers}
            onRetry={handleRetry}
            onClose={onClose}
          />
        ) : (
          <div className="quiz-flow">
            {/* Header */}
            <div className="quiz-header">
              <div className="quiz-title-box">
                <span className="quiz-badge">Interactive Mini Quiz</span>
                <h2>{concept.title}</h2>
              </div>
              <div className="quiz-progress-pill">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="quiz-track">
              <div
                className="quiz-fill"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <div className="quiz-question-box">
              <p className="question-text">{currentQ.question}</p>
            </div>

            {/* Options List */}
            <div className="quiz-options-grid">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optClass = 'option-btn';

                if (isAnswered) {
                  if (opt.correct) {
                    optClass += ' option-correct';
                  } else if (isSelected && !opt.correct) {
                    optClass += ' option-wrong';
                  } else {
                    optClass += ' option-disabled';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={optClass}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="opt-text">{opt.text}</span>
                    {isAnswered && opt.correct && <CheckCircle2 size={20} className="text-emerald-500 ml-auto" />}
                    {isAnswered && isSelected && !opt.correct && <XCircle size={20} className="text-red-500 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Explanation Box */}
            {isAnswered && (
              <div className={`answer-feedback-box ${currentQ.options[selectedOption]?.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
                <div className="feedback-status">
                  {currentQ.options[selectedOption]?.correct ? (
                    <span className="status-badge-correct">✅ Correct! Excellent understanding!</span>
                  ) : (
                    <span className="status-badge-wrong">❌ Let's learn: Here is why...</span>
                  )}
                </div>
                <p className="feedback-explanation">{currentQ.explanation}</p>

                <button onClick={handleNext} className="btn-next-question">
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Results'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
