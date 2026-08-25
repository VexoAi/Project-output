import React from 'react';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function QuizResult({ concept, userAnswers, onRetry, onClose }) {
  const total = userAnswers.length;
  const score = userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((score / total) * 100);

  // Generate personalized diagnostic feedback
  const getDiagnosticFeedback = () => {
    if (percentage === 100) {
      return {
        title: 'Mastery Achieved! 🌟',
        message: `Outstanding! You have mastered ${concept.title}. You have an exceptional visual and grammatical understanding!`,
        advice: 'Ready to challenge yourself with the next topic or subject!'
      };
    } else if (percentage >= 70) {
      return {
        title: 'Great Job! 🎉',
        message: `You are doing really well with ${concept.title}!`,
        advice: `Review the few missed examples once more to reach 100% mastery.`
      };
    } else {
      return {
        title: 'Keep Practicing! 💪',
        message: `Good effort! Concepts become clearer with practice and visual animation review.`,
        advice: `Let's review the rule: "${concept.rule}" and watch the animated visual demonstrations again.`
      };
    }
  };

  const feedback = getDiagnosticFeedback();

  return (
    <div className="quiz-result-container">
      {/* Trophy Badge Header */}
      <div className="result-header">
        <div className="trophy-circle">
          <Award size={48} className="text-amber-500" />
        </div>
        <h2>{feedback.title}</h2>
        <p className="result-subtitle">{feedback.message}</p>
      </div>

      {/* Score Big Pill */}
      <div className="score-summary-card">
        <div className="score-number-box">
          <span className="score-digit">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{total}</span>
        </div>
        <div className="score-percentage-badge">
          <span>{percentage}% Accuracy</span>
        </div>
      </div>

      {/* Diagnostic & Suggestion Box */}
      <div className="diagnostic-box">
        <div className="diag-header">
          <Sparkles size={18} className="text-indigo-600" />
          <strong>AI Visual Teacher Feedback & Revision Suggestion:</strong>
        </div>
        <p className="diag-text">{feedback.advice}</p>
      </div>

      {/* Question Breakdown List */}
      <div className="breakdown-section">
        <h3>Question Breakdown</h3>
        <div className="breakdown-list">
          {userAnswers.map((ans, idx) => (
            <div key={idx} className={`breakdown-item ${ans.isCorrect ? 'item-correct' : 'item-wrong'}`}>
              <div className="item-header">
                {ans.isCorrect ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : (
                  <XCircle size={18} className="text-red-500" />
                )}
                <strong>Q{idx + 1}: {ans.questionText}</strong>
              </div>

              <div className="item-details">
                <div>Your answer: <span className={ans.isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>{ans.selectedOption}</span></div>
                {!ans.isCorrect && (
                  <div className="correct-answer-hint">Correct answer: <strong className="text-emerald-600">{ans.correctOption}</strong></div>
                )}
                <div className="explanation-snippet">💡 {ans.explanation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="result-actions">
        <button onClick={onRetry} className="btn-secondary">
          <RotateCcw size={16} />
          <span>Try Quiz Again</span>
        </button>
        <button onClick={onClose} className="btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Visual Lesson</span>
        </button>
      </div>
    </div>
  );
}
