import React from 'react';
import '../styles/SplashScreen.css';

interface SplashScreenProps {
  onPlayClick: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlayClick }) => {
  return (
    <div className="splash-overlay">
      <div className="splash-container">
        <div className="splash-logo">♠</div>
        <h1 className="splash-title">Solitaire</h1>
        <p className="splash-subtitle">Klasik Kart Oyunu</p>
        <button className="splash-button" onClick={onPlayClick}>
          YENİ OYUN
        </button>
      </div>
    </div>
  );
};
