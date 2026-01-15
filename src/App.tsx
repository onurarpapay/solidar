import { useState, useEffect, useRef } from 'react';
import type {
  GameState,
  Card,
} from './types/game';
import {
  initializeGame,
  drawFromDeck,
  canPlaceOnFoundation,
  canPlaceOnTableau,
  isGameWon,
  calculateScore,
} from './types/game';
import { Deck } from './components/Deck';
import { Foundation } from './components/Foundation';
import { Tableau } from './components/Tableau';
import { Stats } from './components/Stats';
import { CardComponent } from './components/Card';
import { playMoveSound, playFlipSound, playWinSound, playDrawSound } from './utils/sound';
import './App.css';

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

function App() {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame()
  );
  const [history, setHistory] = useState<GameState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragFrom, setDragFrom] = useState<{ pile: number; index: number } | { source: 'waste' } | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const audioInitialized = useRef(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initializeAudio = () => {
      if (!audioInitialized.current) {
        playMoveSound(); // This will trigger AudioContext creation and resume
        audioInitialized.current = true;
        document.removeEventListener('click', initializeAudio);
        document.removeEventListener('touchstart', initializeAudio);
      }
    };

    document.addEventListener('click', initializeAudio);
    document.addEventListener('touchstart', initializeAudio);

    return () => {
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('touchstart', initializeAudio);
    };
  }, []);

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
    playDrawSound();
  };

  const handleCardClick = (pileIndex: number, cardIndex: number) => {
    const pile = gameState.tableau[pileIndex];
    const card = pile[cardIndex >= 0 ? cardIndex : pile.length - 1];

    // If we already have a selected card, try to place it
    if (gameState.selectedCard) {
      // Can't place on same tableau pile
      if (gameState.selectedPile === pileIndex) {
        return;
      }

      // Handle tableau to tableau move (sequence)
      if (gameState.selectedPile !== null && gameState.selectedCardIndex !== null) {
        const sourcePile = gameState.tableau[gameState.selectedPile];
        const selectedStartIndex = gameState.selectedCardIndex;
        
        // Get all cards from selection point to end (the sequence)
        const cardsToMove = sourcePile.slice(selectedStartIndex);

        // Check if the first card of the sequence can be placed on the destination
        if (canPlaceOnTableau(cardsToMove[0], pile)) {
          setHistory([...history, copyGameState(gameState)]);
          const newState = { ...gameState };

          // Remove all cards in sequence from source
          newState.tableau[gameState.selectedPile] = sourcePile.slice(0, selectedStartIndex);

          // Flip the card below in source pile
          if (newState.tableau[gameState.selectedPile].length > 0) {
            newState.tableau[gameState.selectedPile][
              newState.tableau[gameState.selectedPile].length - 1
            ].faceUp = true;
            playFlipSound();
          }

          // Add all cards to destination
          newState.tableau[pileIndex] = [...newState.tableau[pileIndex], ...cardsToMove];
          newState.selectedCard = null;
          newState.selectedPile = null;
          newState.selectedCardIndex = null;
          newState.moves++;
          newState.score = calculateScore(newState);
          setGameState(newState);
          playMoveSound();
          return;
        }

        // If invalid move, deselect and select new card if card exists
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

          // Remove from waste
          newState.waste = newState.waste.filter((c) => c.id !== selectedCard.id);

          // Add to tableau
          newState.tableau[pileIndex] = [...newState.tableau[pileIndex], selectedCard];
          newState.selectedCard = null;
          newState.selectedPile = null;
          newState.selectedCardIndex = null;
          newState.moves++;
          newState.score = calculateScore(newState);
          setGameState(newState);
          playMoveSound();
          return;
        }

        // If invalid move, deselect and select new card if card exists
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

    // If pile is empty, don't try to select anything
    if (!card || !card.faceUp) return;

    // Select this card and all cards below it (sequence selection)
    const newState = { ...gameState };
    newState.selectedCard = card;
    newState.selectedPile = pileIndex;
    newState.selectedCardIndex = cardIndex;
    setGameState(newState);
  };

  const handleWasteCardClick = () => {
    if (gameState.waste.length === 0) return;

    const card = gameState.waste[0];

    // If already selected, deselect
    if (gameState.selectedCard?.id === card.id) {
      setGameState((prev) => ({
        ...prev,
        selectedCard: null,
        selectedPile: null,
        selectedCardIndex: null,
      }));
      return;
    }

    // Select waste card (no auto-placement, let user click destination)
    const newState = { ...gameState };
    newState.selectedCard = card;
    newState.selectedPile = null; // null indicates waste pile
    newState.selectedCardIndex = null;
    setGameState(newState);
  };

  const handleFoundationClick = (suit: string) => {
    if (!gameState.selectedCard) return;

    const suitKey = suit as keyof typeof gameState.foundation;
    const card = gameState.selectedCard;

    // Check if it's the right suit and valid placement
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

    // Remove from source
    if (gameState.selectedPile !== null) {
      // From tableau
      newState.tableau[gameState.selectedPile] = newState.tableau[
        gameState.selectedPile
      ].filter((c) => c.id !== card.id);

      // Flip the card below
      if (newState.tableau[gameState.selectedPile].length > 0) {
        newState.tableau[gameState.selectedPile][
          newState.tableau[gameState.selectedPile].length - 1
        ].faceUp = true;
        playFlipSound();
      }
    } else if (newState.waste.length > 0 && newState.waste[0].id === card.id) {
      // From waste
      newState.waste = newState.waste.slice(1);
    }

    // Add to foundation
    newState.foundation[suitKey] = [...newState.foundation[suitKey], card];
    newState.selectedCard = null;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    newState.moves++;
    newState.score = calculateScore(newState);
    setGameState(newState);
    playMoveSound();
  };

  const handleNewGame = () => {
    setGameState(initializeGame());
    setHistory([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setGameState(previousState);
      setHistory(history.slice(0, -1));
      // Reset drag state
      setIsDragging(false);
      setDragFrom(null);
    }
  };

  const handleCardMouseDown = (pileIndex: number, cardIndex: number, e: React.MouseEvent) => {
    const pile = gameState.tableau[pileIndex];
    const card = pile[cardIndex];
    
    if (!card || !card.faceUp) return;
    
    setDragFrom({ pile: pileIndex, index: cardIndex });
    setDragPos({
      x: e.clientX - 40,
      y: e.clientY - 60,
    });
    setIsDragging(true);
  };

  const handleWasteMouseDown = (e: React.MouseEvent) => {
    if (gameState.waste.length === 0) return;
    
    setDragFrom({ source: 'waste' });
    setDragPos({
      x: e.clientX - 40,
      y: e.clientY - 60,
    });
    setIsDragging(true);
  };  const handleDragDrop = (toPile: number) => {
    if (!isDragging || !dragFrom) {
      setIsDragging(false);
      setDragFrom(null);
      return;
    }

    // Waste to Tableau drag & drop
    if ('source' in dragFrom && dragFrom.source === 'waste') {
      if (gameState.waste.length === 0) {
        setIsDragging(false);
        setDragFrom(null);
        return;
      }

      const card = gameState.waste[0];
      const destPile = gameState.tableau[toPile];

      // Validate move
      if (!canPlaceOnTableau(card, destPile)) {
        setIsDragging(false);
        setDragFrom(null);
        return;
      }

      // Perform move
      setHistory([...history, copyGameState(gameState)]);
      const newState = { ...gameState };

      // Remove from waste
      newState.waste = newState.waste.slice(1);

      // Add to tableau
      newState.tableau[toPile] = [...destPile, card];
      newState.selectedCard = null;
      newState.selectedPile = null;
      newState.selectedCardIndex = null;
      newState.moves++;
      newState.score = calculateScore(newState);

      setGameState(newState);
      setIsDragging(false);
      setDragFrom(null);
      playMoveSound();
      return;
    }

    // Tableau to Tableau drag & drop
    const dragData = dragFrom as { pile: number; index: number };
    const { pile: fromPile, index: fromIndex } = dragData;
    
    // Can't drop on same pile
    if (fromPile === toPile) {
      setIsDragging(false);
      setDragFrom(null);
      return;
    }

    const sourcePile = gameState.tableau[fromPile];
    const destPile = gameState.tableau[toPile];
    const cardsToMove = sourcePile.slice(fromIndex);

    // Validate move
    if (cardsToMove.length === 0 || !canPlaceOnTableau(cardsToMove[0], destPile)) {
      setIsDragging(false);
      setDragFrom(null);
      return;
    }

    // Perform move
    setHistory([...history, copyGameState(gameState)]);
    const newState = { ...gameState };

    // Remove from source
    newState.tableau[fromPile] = sourcePile.slice(0, fromIndex);
    
    // Flip card below in source
    if (newState.tableau[fromPile].length > 0) {
      newState.tableau[fromPile][newState.tableau[fromPile].length - 1].faceUp = true;
      playFlipSound();
    }

    // Add to destination
    newState.tableau[toPile] = [...destPile, ...cardsToMove];
    newState.selectedCard = null;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    newState.moves++;
    newState.score = calculateScore(newState);

    setGameState(newState);
    setIsDragging(false);
    setDragFrom(null);
    playMoveSound();
  };

  const handleFoundationDragDrop = (suit: string) => {
    if (!isDragging || !dragFrom) {
      setIsDragging(false);
      setDragFrom(null);
      return;
    }

    const suitKey = suit as keyof typeof gameState.foundation;
    let card: Card | null = null;

    // Get card from source (waste or tableau)
    if ('source' in dragFrom && dragFrom.source === 'waste') {
      if (gameState.waste.length === 0) {
        setIsDragging(false);
        setDragFrom(null);
        return;
      }
      card = gameState.waste[0];
    } else {
      const dragData = dragFrom as { pile: number; index: number };
      const sourcePile = gameState.tableau[dragData.pile];
      if (dragData.index >= sourcePile.length) {
        setIsDragging(false);
        setDragFrom(null);
        return;
      }
      card = sourcePile[dragData.index];
    }

    if (!card) {
      setIsDragging(false);
      setDragFrom(null);
      return;
    }

    // Validate foundation move
    if (card.suit.id !== suit || !canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
      setIsDragging(false);
      setDragFrom(null);
      return;
    }

    // Perform move
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

    // Remove from source
    if ('source' in dragFrom && dragFrom.source === 'waste') {
      newState.waste = newState.waste.slice(1);
    } else {
      const dragData = dragFrom as { pile: number; index: number };
      newState.tableau[dragData.pile] = newState.tableau[dragData.pile].slice(0, dragData.index);
      
      // Flip card below
      if (newState.tableau[dragData.pile].length > 0) {
        newState.tableau[dragData.pile][newState.tableau[dragData.pile].length - 1].faceUp = true;
      }
    }

    // Add to foundation
    newState.foundation[suitKey] = [...newState.foundation[suitKey], card];
    newState.selectedCard = null;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    newState.moves++;
    newState.score = calculateScore(newState);

    setGameState(newState);
    setIsDragging(false);
    setDragFrom(null);
    playMoveSound();
  };

  const tryMoveToFoundation = (card: Card, fromPile: number | null): boolean => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

    for (const suit of suits) {
      const suitKey = suit as keyof typeof gameState.foundation;
      if (card.suit.id === suit && canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
        // Card can be placed on this foundation
        setHistory([...history, copyGameState(gameState)]);
        const newState = { ...gameState };

        // Remove from source
        if (fromPile !== null) {
          // From tableau
          newState.tableau[fromPile] = newState.tableau[fromPile].filter((c) => c.id !== card.id);

          // Flip the card below
          if (newState.tableau[fromPile].length > 0) {
            newState.tableau[fromPile][newState.tableau[fromPile].length - 1].faceUp = true;
          }
        } else {
          // From waste
          newState.waste = newState.waste.filter((c) => c.id !== card.id);
        }

        // Add to foundation
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

  // Global mouse up handler for drag
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragFrom(null);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragPos({
          x: e.clientX - 40, // Center the card (80px / 2 = 40)
          y: e.clientY - 60, // Center the card (120px / 2 = 60)
        });
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div className="app">
      {/* Dragging card ghost */}
      {isDragging && dragFrom && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: 0.8,
          }}
        >
          {('source' in dragFrom && dragFrom.source === 'waste' && gameState.waste[0]) ? (
            <CardComponent card={gameState.waste[0]} />
          ) : (
            'pile' in dragFrom && gameState.tableau[dragFrom.pile] ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '-100px' }}>
                {gameState.tableau[dragFrom.pile].slice(dragFrom.index).map((card, idx) => (
                  <div key={card.id} style={{ marginTop: idx > 0 ? '-100px' : '0' }}>
                    <CardComponent card={card} />
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      )}

      <header className="app-header">
        <h1>Solitaire Oyunu</h1>
        <p>Kartları foundation'a sırasıyla yerleştirin</p>
      </header>

      <main className="app-main">
        <Stats
          moves={gameState.moves}
          score={gameState.score}
          gameWon={gameState.gameWon}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
        />

        <div className="game-area">
          <Deck
            deck={gameState.deck}
            waste={gameState.waste}
            onDrawCard={handleDrawCard}
            onWasteCardClick={handleWasteCardClick}
            onWasteCardDoubleClick={handleWasteDoubleClick}
            selectedCard={gameState.selectedCard}
            isDragging={isDragging && dragFrom !== null && 'source' in dragFrom}
            onWasteMouseDown={handleWasteMouseDown}
          />

          <Foundation
            hearts={gameState.foundation.hearts}
            diamonds={gameState.foundation.diamonds}
            clubs={gameState.foundation.clubs}
            spades={gameState.foundation.spades}
            onFoundationClick={handleFoundationClick}
            onFoundationDragDrop={handleFoundationDragDrop}
          />
        </div>

        <Tableau
          piles={gameState.tableau}
          selectedPile={gameState.selectedPile}
          selectedCard={gameState.selectedCard}
          selectedCardIndex={gameState.selectedCardIndex}
          isDragging={isDragging}
          dragFrom={dragFrom}
          onCardClick={handleCardClick}
          onCardDoubleClick={handleCardDoubleClick}
          onCardMouseDown={handleCardMouseDown}
          onDragDrop={handleDragDrop}
        />
      </main>

      <footer className="app-footer">
        <p>Web, Android ve iOS için Solitaire Oyunu</p>
      </footer>
    </div>
  );
}

export default App;
