import React, { useState, useCallback, useMemo } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Quiz } from './components/Quiz';
import { EndScreen } from './components/EndScreen';
import { GameState, QuizQuestion } from './types';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { quizData } from './data/quizData';

const useSoundEffects = () => {
  const sounds = useMemo(() => {
    if (typeof Audio === 'undefined') return {};
    return {
      correct: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAAAJAAAAAgAISkxLHG8gDQsPExAfGx8vKistLScgHxAQDw4NFBQRDQ4PEA8ODxARERAPDg8QDw4OEA0ODg8QDw4PEBAPEA8ODxAPEA8ODw4OEA0ODg8QDw4PEBAPEA8ODxAPEA8ODw4OEA0ODg8QDw4PEA8OEA8QDw4ODw4ODQ0ODg8ODg4ODg4NDQ4NDQ0NDQ0NDQ0NDQ4NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg-'),
      incorrect: new Audio('data:audio/wav;base64,UklGRqRoAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAYAEABkYXRhkBoAAMzMz83Pz8/Pz9DPz9DPz87Pz8/Pz9DQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ-'),
    };
  }, []);

  const playSound = (sound: HTMLAudioElement) => {
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.error("Chyba při přehrávání zvuku:", e));
    }
  };

  return {
    playCorrect: () => playSound(sounds.correct),
    playIncorrect: () => playSound(sounds.incorrect),
  };
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerHistory, setAnswerHistory] = useState<(boolean | null)[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const { cancel } = useTextToSpeech();
  const { playCorrect, playIncorrect } = useSoundEffects();


  const startGame = useCallback(() => {
    cancel();
    const questions = quizData;
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setAnswerHistory(Array(questions.length).fill(null));
    setUserAnswers(Array(questions.length).fill(null));
    setGameState(GameState.Playing);
  }, [cancel]);

  const restartGame = useCallback(() => {
    setGameState(GameState.Welcome);
    setQuizQuestions([]);
    setAnswerHistory([]);
    setUserAnswers([]);
  }, []);
  
  const handleAnswer = useCallback((selectedAnswer: string) => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
        playCorrect();
    } else {
        playIncorrect();
    }
    setAnswerHistory(prev => {
        const newHistory = [...prev];
        newHistory[currentQuestionIndex] = isCorrect;
        return newHistory;
    });
     setUserAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = selectedAnswer;
        return newAnswers;
    });
  }, [currentQuestionIndex, quizQuestions, playCorrect, playIncorrect]);

  const handleNextQuestion = useCallback(() => {
    cancel();
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState(GameState.Finished);
    }
  }, [currentQuestionIndex, cancel, quizQuestions.length]);

  const renderContent = () => {
    const score = answerHistory.filter(r => r === true).length;
    
    switch (gameState) {
      case GameState.Playing:
        if (quizQuestions.length === 0) return <WelcomeScreen onStart={startGame} />;
        return (
            <Quiz
              answerHistory={answerHistory}
              questionData={quizQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              onComplete={handleNextQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizQuestions.length}
            />
        );
      case GameState.Finished:
        return (
            <EndScreen 
                score={score} 
                answerHistory={answerHistory} 
                totalQuestions={quizQuestions.length} 
                onRestart={restartGame} 
                quizQuestions={quizQuestions}
                userAnswers={userAnswers}
            />
        );
      case GameState.Welcome:
      default:
        return <WelcomeScreen onStart={startGame} />;
    }
  };
  
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col p-4">
      <div className="flex-grow flex items-center justify-center">
        <main className="bg-white rounded-2xl shadow-xl w-full max-w-4xl min-h-[500px] p-6 md:p-10 flex flex-col justify-center transition-all duration-500">
            {renderContent()}
        </main>
      </div>
      <footer className="text-center text-slate-400 text-xs pt-8">
        <p>
          &copy; {currentYear}{' '}
          <a
            href="https://petrvurm.cz?utm_source=sladek_kviz&utm_medium=footer&utm_campaign=portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-700 transition-colors"
          >
            Petr Vurm
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
