import React from 'react';
import type { Card as CardType } from '../types/game';
import { CardComponent } from './Card';
import '../styles/Foundation.css';

interface FoundationProps {
  hearts: CardType[];
  diamonds: CardType[];
  clubs: CardType[];
  spades: CardType[];
  onFoundationClick?: (suit: string) => void;
  onFoundationDragDrop?: (suit: string) => void;
}

export const Foundation: React.FC<FoundationProps> = ({
  hearts,
  diamonds,
  clubs,
  spades,
  onFoundationClick,
  onFoundationDragDrop,
}) => {
  const piles = [
    { suit: 'hearts', cards: hearts, symbol: '♥' },
    { suit: 'diamonds', cards: diamonds, symbol: '♦' },
    { suit: 'clubs', cards: clubs, symbol: '♣' },
    { suit: 'spades', cards: spades, symbol: '♠' },
  ];

  return (
    <div className="foundation">
      <div className="foundation-piles">
        {piles.map(({ suit, cards, symbol }) => (
          <div
            key={suit}
            className="foundation-pile"
            onClick={() => onFoundationClick?.(suit)}
            onMouseUp={() => onFoundationDragDrop?.(suit)}
          >
            <div className="pile-label">{symbol}</div>
            {cards.length > 0 && (
              <CardComponent card={cards[cards.length - 1]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
