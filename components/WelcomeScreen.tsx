import React, { useEffect } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SladekAvatar } from './SladekAvatar';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { speak, czechVoiceAvailable, isSpeaking } = useTextToSpeech();
  const welcomeMessage = "Buďtež vítáni, přátelé drazí. Mé jméno jest Josef Václav Sládek. Těší mou maličkost, že jste cestu sem vážili. Projděmež společně stezkami života mého a plody práce mé. Jste připraveni, odvážní duchové?";

  useEffect(() => {
    speak(welcomeMessage);
  }, [speak]);
  
  return (
    <div className="text-center p-6">
      <SladekAvatar className="w-36 h-36 mx-auto mb-6" isSpeaking={isSpeaking} />
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Kvíz Josefa Václava Sládka</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
        Mé jméno jest Josef Václav Sládek. Těší mou maličkost, že jste cestu sem vážili. Projděmež společně stezkami života mého a plody práce mé. Jste připraveni?
      </p>

      {!czechVoiceAvailable && (
        <p className="text-sm text-amber-700 bg-amber-100 p-3 rounded-md mb-6 max-w-lg mx-auto">
          Ctihodný prohlížeč Váš, jak se zdá, nepodpírá hlas český ku předříkávání určený. Kvíz sám o sobě konati se bude, avšak běda, mluv mé slyšeti Vám nebude dopřáno.
        </p>
      )}
      <button
        onClick={onStart}
        className="bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg"
      >
        Spustit kvíz
      </button>
    </div>
  );
};
