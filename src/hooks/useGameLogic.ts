import { useState, useEffect } from 'react';
import type { GameState } from '../types/game';
import {
  initializeGame,
  drawFromDeck,
  isGameWon,
  calculateScore,
} from '../types/game';
import { playWinSound, playDrawSound, playDealSound, playFlipSound } from '../utils/sound';

// Helper function to deep copy game state for immutability
const copyGameState = (state: GameState): GameState => ({
  ...state,
  tableau: state.tableau.map(pile => pile.map(card => ({ ...card }))),
  waste: state.waste.map(card => ({ ...card })),
  foundation: {
    hearts: state.foundation.hearts.map(card => ({ ...card })),
    diamonds: state.foundation.diamonds.map(card => ({ ...card })),
    clubs: state.foundation.clubs.map(card => ({ ...card })),
    spades: state.foundation.spades.map(card => ({ ...card })),
  }
});

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame()
  );
  const [history, setHistory] = useState<GameState[]>([]);

  // Check if game is won
  useEffect(() => {
    if (isGameWon(gameState) && !gameState.gameWon) {
      const newScore = calculateScore(gameState);
      setGameState((prev) => ({
        ...prev,
        gameWon: true,
        score: newScore,
      }));
      setTimeout(() => {
        playWinSound();
      }, 300);
    }
  }, [gameState]);

  const handleDrawCard = () => {
    setHistory([...history, copyGameState(gameState)]);
    const newState = drawFromDeck(gameState);
    newState.moves++;
    setGameState(newState);
    playFlipSound();
  };

  const handleNewGame = () => {
    setGameState(initializeGame());
    setHistory([]);
    playDealSound();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setGameState(previousState);
      setHistory(history.slice(0, -1));
    }
  };

  return {
    gameState,
    setGameState,
    history,
    setHistory,
    copyGameState,
    handleDrawCard,
    handleNewGame,
    handleUndo,
  };
};
