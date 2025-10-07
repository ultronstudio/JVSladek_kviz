import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [czechVoice, setCzechVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const foundVoice = voices.find(voice => voice.lang === 'cs-CZ');
        if (foundVoice) {
          setCzechVoice(foundVoice);
        } else {
           const fallbackVoice = voices.find(voice => voice.lang.startsWith('cs'));
           setCzechVoice(fallbackVoice || null);
        }
      };

      setVoice();
      // Voices are loaded asynchronously
      window.speechSynthesis.onvoiceschanged = setVoice;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSupported || !text) {
        if (onEnd) onEnd();
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (czechVoice) {
      utterance.voice = czechVoice;
    }
    utterance.lang = 'cs-CZ';
    utterance.pitch = 1;
    utterance.rate = 1.2;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
    };
    utterance.onerror = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd(); // Call onEnd on error too
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, czechVoice]);
  
  const cancel = useCallback(() => {
    if(isSupported) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isSupported, czechVoiceAvailable: !!czechVoice };
};