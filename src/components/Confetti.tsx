import React, { useEffect, useState } from 'react';
import '../styles/Confetti.css';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐', '🎈', '🏆'];
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
};
