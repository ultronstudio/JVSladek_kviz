import React, { useState, useEffect, useMemo } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SladekAvatar } from './SladekAvatar';
import { ScoreDisplay } from './ScoreDisplay';
import { QuizQuestion } from '../types';

declare const confetti: any;

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  answerHistory: (boolean | null)[];
  quizQuestions: QuizQuestion[];
  userAnswers: (string | null)[];
}

const getResultMessage = (score: number, totalQuestions: number): string => {
  const percentage = (score / totalQuestions) * 100;
  if (percentage === 100) {
    return `Výtečně, vskutku výtečně! Dosažení plného počtu bodů jest výkon hodný mistra. Vaše znalosti o životě mém jsou převeliké. Byla to pro mou maličkost převeliká čest.`;
  }
  if (percentage >= 70) {
    return `Vpravdě obdivuhodný výsledek! Vaše vědomosti jsou vskutku hluboké. Děkuji uctivě za Vaši ctěnou pozornost.`;
  }
  if (percentage >= 40) {
    return `Dobře jste si vedli! Některé z otázek byly, přiznávám, poněkud ošemetné. Však doufám, že jste i tak nalezli poučení a potěchu v tomto malém přezkoušení.`;
  }
  return `Děkuji Vám za Váš čas a odvahu. Nikdo učený z nebe nespadl. Snad příště osud Vám bude více nakloněn a zkusíte své štěstí znovu?`;
};

export const EndScreen: React.FC<EndScreenProps> = ({ score, totalQuestions, onRestart, answerHistory, quizQuestions, userAnswers }) => {
  const { speak, isSpeaking } = useTextToSpeech();
  const resultMessage = useMemo(() => getResultMessage(score, totalQuestions), [score, totalQuestions]);
  const [showReview, setShowReview] = useState(false);

  const incorrectAnswers = useMemo(() => {
    return quizQuestions
      .map((q, i) => ({ ...q, userAnswer: userAnswers[i], questionIndex: i }))
      .filter((_, i) => answerHistory[i] === false);
  }, [quizQuestions, userAnswers, answerHistory]);

  useEffect(() => {
    const message = `Toto přezkoušení vědomostí jest u konce. Získali jste ${score} z ${totalQuestions} možných. ${resultMessage}`;
    speak(message);

    if (score === totalQuestions && typeof confetti === 'function') {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
  }, [speak, score, totalQuestions, resultMessage]);
  
  return (
    <div className="text-center p-6 animate-fade-in max-h-[80vh] overflow-y-auto">
      <SladekAvatar className="w-24 h-24 mx-auto mb-4" isSpeaking={isSpeaking} />
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Konec kvízu</h1>
      <p className="text-xl text-slate-600 mb-6">Vaše konečné skóre jest:</p>
      
      <div className="my-8">
        <ScoreDisplay answerHistory={answerHistory} total={totalQuestions} animated={true} iconSize="w-10 h-10 md:w-12 md:h-12"/>
      </div>

      <p className="text-4xl font-bold text-slate-800 my-4" aria-label={`Konečné skóre: ${score} z ${totalQuestions}`}>
        {score} / {totalQuestions}
      </p>

      <p className="text-lg text-slate-700 max-w-xl mx-auto">{resultMessage}</p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <button
          onClick={onRestart}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg order-1"
        >
          Hrát znovu
        </button>
        {incorrectAnswers.length > 0 && (
          <button
            onClick={() => setShowReview(!showReview)}
            className="bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 ease-in-out shadow-md order-2"
          >
            {showReview ? 'Skrýt odpovědi' : 'Zobrazit špatné odpovědi'}
          </button>
        )}
      </div>

      {showReview && incorrectAnswers.length > 0 && (
        <div className="mt-10 text-left border-t-2 border-slate-200 pt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Přezkoušení chyb Vašich</h2>
          <ul className="space-y-6">
            {incorrectAnswers.map((item) => (
               <li key={item.questionIndex} className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-700 mb-3 text-lg">{item.questionIndex + 1}. {item.question}</p>
                <div className="space-y-3">
                  <div className="pl-4 border-l-4 border-red-400">
                    <p className="text-sm text-slate-500">Vaše odpověď:</p>
                    <p className="font-medium text-red-700">{item.userAnswer}</p>
                  </div>
                  <div className="pl-4 border-l-4 border-green-400">
                    <p className="text-sm text-slate-500">Správná odpověď:</p>
                    <p className="font-medium text-green-700">{item.correctAnswer}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-slate-600"><span className="font-semibold">Vysvětlení:</span> {item.explanation}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
