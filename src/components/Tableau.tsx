import React from 'react';
import type { Card as CardType } from '../types/game';
import { CardComponent } from './Card';
import '../styles/Tableau.css';

interface TableauProps {
  piles: CardType[][];
  selectedPile: number | null;
  selectedCard: CardType | null;
  selectedCardIndex: number | null;
  isDragging: boolean;
  dragFrom: { pile: number; index: number } | { source: 'waste' } | null;
  onCardClick: (pileIndex: number, cardIndex: number) => void;
  onCardDoubleClick: (pileIndex: number, cardIndex: number) => void;
  onCardMouseDown: (pileIndex: number, cardIndex: number, e: React.MouseEvent) => void;
  onDragDrop: (toPile: number) => void;
}

export const Tableau: React.FC<TableauProps> = ({
  piles,
  selectedPile,
  selectedCard,
  selectedCardIndex,
  isDragging,
  dragFrom,
  onCardClick,
  onCardDoubleClick,
  onCardMouseDown,
  onDragDrop,
}) => {
  return (
    <div className="tableau">
      <h3>Oyun Alanı (Tableau)</h3>
      <div className="tableau-piles">
        {piles.map((pile, pileIndex) => (
          <div
            key={pileIndex}
            className={`tableau-pile ${selectedPile === pileIndex ? 'selected' : ''}`}
            onMouseUp={() => onDragDrop(pileIndex)}
            onDragOver={(e) => e.preventDefault()}
          >
            {pile.length === 0 ? (
              <div
                className="empty-slot"
                onClick={() => onCardClick(pileIndex, -1)}
              ></div>
            ) : (
              pile.map((card, cardIndex) => (
                <CardComponent
                  key={card.id}
                  card={card}
                  onClick={() => onCardClick(pileIndex, cardIndex)}
                  onDoubleClick={() => onCardDoubleClick(pileIndex, cardIndex)}
                  onMouseDown={(e) => onCardMouseDown(pileIndex, cardIndex, e)}
                  isDragging={isDragging && dragFrom !== null && 'pile' in dragFrom && dragFrom.pile === pileIndex && dragFrom.index === cardIndex}
                  isSelected={
                    selectedCard?.id === card.id ||
                    (selectedPile === pileIndex &&
                      selectedCardIndex !== null &&
                      cardIndex >= selectedCardIndex)
                  }
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
