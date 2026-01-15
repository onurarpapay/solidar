import React from 'react';
import type { Card as CardType } from '../types/game';
import { CardComponent } from './Card';
import '../styles/Deck.css';

interface DeckProps {
  deck: CardType[];
  waste: CardType[];
  onDrawCard: () => void;
  onWasteCardClick?: () => void;
  onWasteCardDoubleClick?: () => void;
  selectedCard?: CardType | null;
  isDragging?: boolean;
  onWasteMouseDown?: (e: React.MouseEvent) => void;
}

export const Deck: React.FC<DeckProps> = ({
  deck,
  waste,
  onDrawCard,
  onWasteCardClick,
  onWasteCardDoubleClick,
  selectedCard,
  isDragging,
  onWasteMouseDown,
}) => {
  const topWaste = waste.length > 0 ? waste[0] : null;

  return (
    <div className="deck">
      <div className="deck-piles">
        <div className="deck-pile" onClick={onDrawCard}>
          {deck.length > 0 ? (
            <div className="deck-back">Depo ({deck.length})</div>
          ) : (
            <div className="empty-deck">0</div>
          )}
        </div>
        <div className="waste-pile" onClick={onWasteCardClick}>
          {topWaste ? (
            <CardComponent
              card={topWaste}
              isSelected={selectedCard?.id === topWaste.id}
              isDragging={isDragging}
              onDoubleClick={onWasteCardDoubleClick}
              onMouseDown={(e) => onWasteMouseDown?.(e)}
            />
          ) : (
            <div className="empty-waste">Boş</div>
          )}
        </div>
      </div>
    </div>
  );
};
