import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SladekAvatar } from './SladekAvatar';
import { ScoreDisplay } from './ScoreDisplay';

interface QuizProps {
  answerHistory: (boolean | null)[];
  questionData: QuizQuestion;
  onAnswer: (selectedAnswer: string) => void;
  onComplete: () => void; // Callback to proceed to the next question
  questionNumber: number;
  totalQuestions: number;
}

const correctFeedbackPhrases = [
  "Vskutku výtečně!",
  "Zajisté, správná odpověď!",
  "Věru, tak jest!",
  "Přesně tak, Váš důvtip je obdivuhodný.",
  "Výborně! Máte mé uznání.",
  "Bezesporu správně, ctěný příteli."
];

const incorrectFeedbackPhrases = [
  "Škoda, mýlka se vloudila.",
  "Ach, tentokrát jste se zmýlili.",
  "Běda, správná cesta vedla jinudy.",
  "Nikoli, příteli, leč nezoufejte.",
  "Bohužel, to není správná odpověď.",
  "Kdepak, tato odpověď není správná."
];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const RepeatSpeechButton: React.FC<{ onRepeat: () => void, isSpeaking: boolean }> = ({ onRepeat, isSpeaking }) => (
    <button onClick={onRepeat} title="Zopakovat hlas" className={`text-slate-500 hover:text-blue-700 transition-colors duration-200 ${isSpeaking ? 'opacity-50' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 0v2h6V5m0 0a2 2 0 012 2v3h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3H6a2 2 0 01-2-2V7a2 2 0 012-2h2z" />
        </svg>
    </button>
);


export const Quiz: React.FC<QuizProps> = ({ answerHistory, questionData, onAnswer, onComplete, questionNumber, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [explanationText, setExplanationText] = useState('');
  const [feedbackPhrase, setFeedbackPhrase] = useState('');
  const { speak, isSpeaking, cancel, czechVoiceAvailable } = useTextToSpeech();

  const isCorrect = useMemo(() => {
    return selectedAnswer === questionData.correctAnswer;
  }, [selectedAnswer, questionData.correctAnswer]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setExplanationText('');
    setFeedbackPhrase('');
    
    const timeoutId = setTimeout(() => {
        speak(questionData.question);
    }, 500); // Small delay to allow transition
    
    return () => {
        clearTimeout(timeoutId);
        cancel();
    };
  }, [questionData, speak, cancel]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;

    cancel();
    setSelectedAnswer(answer);
    setIsAnswered(true);
    onAnswer(answer);
    
    // Short pause after click to allow user to see visual feedback
    setTimeout(() => {
        const correct = answer === questionData.correctAnswer;
        const phrase = correct 
            ? getRandomItem(correctFeedbackPhrases) 
            : getRandomItem(incorrectFeedbackPhrases);
        
        setFeedbackPhrase(phrase);

        const fullMessage = `${phrase} ${questionData.explanation}`;
        setExplanationText(fullMessage);

        const proceed = () => onComplete();

        if (czechVoiceAvailable) {
            speak(fullMessage, () => setTimeout(proceed, 750));
        } else {
            setTimeout(proceed, 3000);
        }
    }, 500);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      // Add hover and active states for better interactivity
      return 'bg-white hover:bg-blue-100 text-blue-800 border-blue-300 transform hover:scale-105 hover:shadow-md active:scale-95';
    }
    
    const isCorrectAnswer = option === questionData.correctAnswer;
    const isSelectedAnswer = option === selectedAnswer;

    if (isCorrectAnswer) {
      // Correct answer stands out
      return 'bg-green-200 text-green-800 border-green-400 transform scale-105 animate-pulse-correct';
    }
    if (isSelectedAnswer && !isCorrectAnswer) {
      // Incorrect answer shakes
      return 'bg-red-200 text-red-800 border-red-400 animate-shake';
    }
    // Other options are muted
    return 'bg-white text-slate-700 border-slate-300 opacity-60';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
       <div className="mb-4 flex justify-end items-center h-10">
          <ScoreDisplay answerHistory={answerHistory} total={totalQuestions} iconSize="w-6 h-6" />
        </div>
      
      <div className="flex items-center gap-6 mb-6 animate-fade-in">
        <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center">
            <SladekAvatar 
              className={`transition-all duration-500 ease-in-out ${isSpeaking ? 'w-40 h-40' : 'w-28 h-28'}`}
              isSpeaking={isSpeaking} 
            />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-700 font-semibold mb-1">Otázka {questionNumber} / {totalQuestions}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{questionData.question}</h2>
            </div>
             {czechVoiceAvailable && !isAnswered && <RepeatSpeechButton onRepeat={() => speak(questionData.question)} isSpeaking={isSpeaking} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionData.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswerClick(option)}
            disabled={isAnswered}
            className={`w-full p-4 text-left font-semibold rounded-lg border-2 shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div 
          className="mt-8 p-5 rounded-lg bg-slate-100 border border-slate-200 animate-fade-in"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex justify-between items-start">
             <h3 className="font-bold text-xl mb-2 text-slate-800">
                {feedbackPhrase}
             </h3>
             {czechVoiceAvailable && explanationText && <RepeatSpeechButton onRepeat={() => speak(explanationText)} isSpeaking={isSpeaking} />}
          </div>
          {!isCorrect && (
              <div className="mb-3">
                  <p className="text-sm text-slate-600">Správná odpověď jest:</p>
                  <p className="text-lg font-bold text-green-700">{questionData.correctAnswer}</p>
              </div>
          )}
           <hr className="my-3 border-slate-300" />
          <p className="text-slate-600">{questionData.explanation}</p>
        </div>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
.animate-shake {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
}
.animate-pulse-correct {
    animation: pulse 1s;
}
`;
document.head.appendChild(style);