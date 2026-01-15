// Web Audio API - Ses efektleri

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume AudioContext if suspended (gerekli modern browsers'de)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const playSound = (frequency: number, duration: number, type: 'sine' | 'triangle' = 'sine') => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio context not available
  }
};

// Kart hamle sesi
export const playMoveSound = () => {
  playSound(440, 0.1, 'sine');
};

// Kart çevirme sesi
export const playFlipSound = () => {
  playSound(600, 0.08, 'triangle');
};

// Oyun kazanma sesi
export const playWinSound = () => {
  const notes = [523, 659, 784]; // C, E, G (major chord)
  notes.forEach((freq, i) => {
    setTimeout(() => playSound(freq, 0.3, 'sine'), i * 100);
  });
};
