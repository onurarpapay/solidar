// Web Audio API - Ses efektleri

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('❌ Failed to create AudioContext:', e);
      throw e;
    }
  }
  return audioContext;
};

const ensureAudioContextRunning = (): void => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    try {
      ctx.resume().then(() => {
        // resumed successfully
      }).catch((e) => {
        console.error('❌ Failed to resume:', e);
      });
    } catch (e) {
      console.error('❌ Error resuming audio context:', e);
    }
  }
};

export const playSound = (frequency: number, duration: number, type: 'sine' | 'triangle' = 'sine') => {
  try {
    ensureAudioContextRunning();
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime); // Increased from 0.2
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error('❌ Sound error:', e);
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

// Depo açma sesi
export const playDrawSound = () => {
  playSound(350, 0.06, 'sine');
};
