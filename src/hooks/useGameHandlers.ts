import type { GameState, Card } from '../types/game';
import {
  canPlaceOnFoundation,
  canPlaceOnTableau,
  calculateScore,
} from '../types/game';
import { playTableauMoveSound, playMoveSound, playFlipSound } from '../utils/sound';
import type { DragFromType } from './useDragAndDrop';

interface GameHandlerDeps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
  history: GameState[];
  setHistory: (history: GameState[]) => void;
  copyGameState: (state: GameState) => GameState;
  resetDrag: () => void;
}

export const useGameHandlers = ({
  gameState,
  setGameState,
  history,
  setHistory,
  copyGameState,
  resetDrag,
}: GameHandlerDeps) => {
  
  const handleCardClick = (pileIndex: number, cardIndex: number) => {
    const pile = gameState.tableau[pileIndex];
    const card = pile[cardIndex >= 0 ? cardIndex : pile.length - 1];

    if (gameState.selectedCard) {
      if (gameState.selectedPile === pileIndex) {
        return;
      }

      // Handle tableau to tableau move (sequence)
      if (gameState.selectedPile !== null && gameState.selectedCardIndex !== null) {
        const sourcePile = gameState.tableau[gameState.selectedPile];
        const selectedStartIndex = gameState.selectedCardIndex;
        const cardsToMove = sourcePile.slice(selectedStartIndex);

        if (canPlaceOnTableau(cardsToMove[0], pile)) {
          setHistory([...history, copyGameState(gameState)]);
          const newState = { ...gameState };

          newState.tableau[gameState.selectedPile] = sourcePile.slice(0, selectedStartIndex);

          if (newState.tableau[gameState.selectedPile].length > 0) {
            newState.tableau[gameState.selectedPile][
              newState.tableau[gameState.selectedPile].length - 1
            ].faceUp = true;
            playFlipSound();
          }

          newState.tableau[pileIndex] = [...newState.tableau[pileIndex], ...cardsToMove];
          newState.selectedCard = null;
          newState.selectedPile = null;
          newState.selectedCardIndex = null;
          newState.moves++;
          newState.score = calculateScore(newState);
          setGameState(newState);
          playTableauMoveSound();
          return;
        }

        if (card && card.faceUp) {
          setGameState({
            ...gameState,
            selectedCard: card,
            selectedPile: pileIndex,
            selectedCardIndex: cardIndex,
          });
        }
        return;
      }

      // Handle waste to tableau move (single card)
      if (gameState.selectedPile === null) {
        const selectedCard = gameState.selectedCard;
        if (canPlaceOnTableau(selectedCard, pile)) {
          setHistory([...history, copyGameState(gameState)]);
          const newState = { ...gameState };

          newState.waste = newState.waste.filter((c) => c.id !== selectedCard.id);
          newState.tableau[pileIndex] = [...newState.tableau[pileIndex], selectedCard];
          newState.selectedCard = null;
          newState.selectedPile = null;
          newState.selectedCardIndex = null;
          newState.moves++;
          newState.score = calculateScore(newState);
          setGameState(newState);
          playTableauMoveSound();
          return;
        }

        if (card && card.faceUp) {
          setGameState({
            ...gameState,
            selectedCard: card,
            selectedPile: pileIndex,
            selectedCardIndex: cardIndex,
          });
        }
        return;
      }
    }

    if (!card || !card.faceUp) return;

    const newState = { ...gameState };
    newState.selectedCard = card;
    newState.selectedPile = pileIndex;
    newState.selectedCardIndex = cardIndex;
    setGameState(newState);
  };

  const handleWasteCardClick = () => {
    if (gameState.waste.length === 0) return;

    const card = gameState.waste[0];

    if (gameState.selectedCard?.id === card.id) {
      setGameState((prev) => ({
        ...prev,
        selectedCard: null,
        selectedPile: null,
        selectedCardIndex: null,
      }));
      return;
    }

    const newState = { ...gameState };
    newState.selectedCard = card;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    setGameState(newState);
  };

  const handleFoundationClick = (suit: string) => {
    if (!gameState.selectedCard) return;

    const suitKey = suit as keyof typeof gameState.foundation;
    const card = gameState.selectedCard;

    if (card.suit.id !== suit || !canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
      return;
    }

    setHistory([...history, copyGameState(gameState)]);
    const newState = {
      ...gameState,
      foundation: {
        hearts: [...gameState.foundation.hearts],
        diamonds: [...gameState.foundation.diamonds],
        clubs: [...gameState.foundation.clubs],
        spades: [...gameState.foundation.spades],
      }
    };

    if (gameState.selectedPile !== null) {
      newState.tableau[gameState.selectedPile] = newState.tableau[
        gameState.selectedPile
      ].filter((c) => c.id !== card.id);

      if (newState.tableau[gameState.selectedPile].length > 0) {
        newState.tableau[gameState.selectedPile][
          newState.tableau[gameState.selectedPile].length - 1
        ].faceUp = true;
        playFlipSound();
      }
    } else if (newState.waste.length > 0 && newState.waste[0].id === card.id) {
      newState.waste = newState.waste.slice(1);
    }

    newState.foundation[suitKey] = [...newState.foundation[suitKey], card];
    newState.selectedCard = null;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    newState.moves++;
    newState.score = calculateScore(newState);
    setGameState(newState);
    playMoveSound();
  };

  const handleDragDrop = (toPile: number) => {
    const dragFrom = null; // This will be provided via closure/props
    // Implementation will be handled in main component
  };

  const handleFoundationDragDrop = (suit: string) => {
    // Implementation will be handled in main component
  };

  const tryMoveToFoundation = (card: Card, fromPile: number | null): boolean => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

    for (const suit of suits) {
      const suitKey = suit as keyof typeof gameState.foundation;
      if (card.suit.id === suit && canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
        setHistory([...history, copyGameState(gameState)]);
        const newState = { ...gameState };

        if (fromPile !== null) {
          newState.tableau[fromPile] = newState.tableau[fromPile].filter((c) => c.id !== card.id);

          if (newState.tableau[fromPile].length > 0) {
            newState.tableau[fromPile][newState.tableau[fromPile].length - 1].faceUp = true;
          }
        } else {
          newState.waste = newState.waste.filter((c) => c.id !== card.id);
        }

        newState.foundation[suitKey] = [...newState.foundation[suitKey], card];
        newState.selectedCard = null;
        newState.selectedPile = null;
        newState.selectedCardIndex = null;
        newState.moves++;
        newState.score = calculateScore(newState);
        setGameState(newState);
        playMoveSound();
        return true;
      }
    }

    return false;
  };

  const handleCardDoubleClick = (pileIndex: number, cardIndex: number) => {
    const pile = gameState.tableau[pileIndex];
    const card = pile[cardIndex];

    if (!card || !card.faceUp) return;
    tryMoveToFoundation(card, pileIndex);
  };

  const handleWasteDoubleClick = () => {
    if (gameState.waste.length === 0) return;
    const card = gameState.waste[0];
    tryMoveToFoundation(card, null);
  };

  return {
    handleCardClick,
    handleWasteCardClick,
    handleFoundationClick,
    handleCardDoubleClick,
    handleWasteDoubleClick,
  };
};
