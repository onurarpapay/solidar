// Web Audio API - Ses efektleri ve dosyaları

let audioContext: AudioContext | null = null;

// Ses dosyaları
const SOUNDS = {
  deal: '/sounds/deal.mp3',
  flip: '/sounds/flip.wav',
  move: '/sounds/move.wav',
};

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

// Ses dosyasını yükle ve oynat
const playAudioFile = (filePath: string): void => {
  try {
    ensureAudioContextRunning();
    const audio = new Audio(filePath);
    audio.volume = 0.7;
    audio.play().catch((e) => {
      console.error('❌ Failed to play audio:', e);
    });
  } catch (e) {
    console.error('❌ Audio error:', e);
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

// Oyun başlangıç sesi (deal.mp3)
export const playDealSound = () => {
  playAudioFile(SOUNDS.deal);
};

// Kart çevirme sesi (flip.wav)
export const playFlipSound = () => {
  playAudioFile(SOUNDS.flip);
};

// Tableau taşıma sesi (move.wav)
export const playTableauMoveSound = () => {
  playAudioFile(SOUNDS.move);
};

// Foundation taşıma sesi (iki tonlu olumlu feedback)
export const playFoundationMoveSound = () => {
  // İlk bip - düşük ton
  playSound(440, 0.1, 'sine');
  // İkinci bip - daha yüksek ton (olumlu feedback)
  setTimeout(() => playSound(550, 0.1, 'sine'), 80);
};

// Eski ad - backward compatibility (foundation için)
export const playMoveSound = playFoundationMoveSound;

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
