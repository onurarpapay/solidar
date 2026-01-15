import React from 'react';
import type { Card as CardType } from '../types/game';
import '../styles/Card.css';

interface CardProps {
  card: CardType | null;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  isDragging?: boolean;
  className?: string;
}

export const CardComponent: React.FC<CardProps> = ({
  card,
  onClick,
  onDoubleClick,
  onMouseDown,
  isSelected,
  isDragging,
  className = '',
}) => {
  if (!card) {
    return <div className={`card card-empty ${className}`} onClick={onClick} />;
  }

  return (
    <div
      className={`card card-${card.suit.color} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${className}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      style={{ cursor: card.faceUp ? 'grab' : 'default', userSelect: 'none' }}
    >
      {card.faceUp ? (
        <>
          <div className="card-content">
            <div className="card-rank">{card.rank.display}</div>
            <div className="card-suit" style={{ color: card.suit.color }}>
              {card.suit.symbol}
            </div>
          </div>
          <div className="card-peek" style={{ color: card.suit.color }}>
            <div className="card-peek-rank">{card.rank.display}</div>
            <div className="card-peek-suit">{card.suit.symbol}</div>
          </div>
        </>
      ) : (
        <div className="card-back">
          <div className="card-back-pattern"></div>
        </div>
      )}
    </div>
  );
};
