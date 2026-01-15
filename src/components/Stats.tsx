import React from 'react';
import '../styles/Stats.css';

interface StatsProps {
  moves: number;
  score: number;
  gameWon: boolean;
  onNewGame: () => void;
  onUndo?: () => void;
}

export const Stats: React.FC<StatsProps> = ({
  moves,
  score,
  gameWon,
  onNewGame,
  onUndo,
}) => {
  return (
    <div className="stats">
      <div className="stats-info">
        <div className="stat-item">
          <span className="stat-label">Hamle Sayısı:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Puan:</span>
          <span className="stat-value">{score}</span>
        </div>
      </div>

      <div className="stats-buttons">
        {onUndo && (
          <button onClick={onUndo} className="btn btn-undo">
            Geri Al
          </button>
        )}
        <button onClick={onNewGame} className="btn btn-new-game">
          Yeni Oyun
        </button>
      </div>

      {gameWon && (
        <div className="game-won-message">
          <h2>🎉 Tebrikler! 🎉</h2>
          <p>Oyunu başarıyla tamamladınız!</p>
          <p>Puan: {score}</p>
        </div>
      )}
    </div>
  );
};
