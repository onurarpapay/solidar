import { useEffect, useRef } from 'react';

export const useAudio = () => {
  const audioInitialized = useRef(false);

  useEffect(() => {
    const initializeAudio = () => {
      if (!audioInitialized.current) {
        // Initialize AudioContext for user interaction (browser policy)
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            audioContext.resume();
          }
        } catch (e) {
          console.error('Failed to initialize audio context:', e);
        }
        audioInitialized.current = true;
        document.removeEventListener('click', initializeAudio);
        document.removeEventListener('touchstart', initializeAudio);
      }
    };

    document.addEventListener('click', initializeAudio);
    document.addEventListener('touchstart', initializeAudio);

    return () => {
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('touchstart', initializeAudio);
    };
  }, []);

  return { audioInitialized };
};
