import { useEffect } from 'react';
import { Deck } from './components/Deck';
import { Foundation } from './components/Foundation';
import { Tableau } from './components/Tableau';
import { Stats } from './components/Stats';
import { CardComponent } from './components/Card';
import { useGameLogic } from './hooks/useGameLogic';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useGameHandlers } from './hooks/useGameHandlers';
import { useAudio } from './hooks/useAudio';
import { canPlaceOnTableau, canPlaceOnFoundation, calculateScore } from './types/game';
import { playTableauMoveSound, playFlipSound, playMoveSound, playDealSound, playWinSound } from './utils/sound';
import './App.css';

function App() {
  // Game logic
  const { gameState, setGameState, history, setHistory, copyGameState, handleDrawCard, handleNewGame, handleUndo } = useGameLogic();
  
  // Drag and drop
  const { isDragging, dragFrom, dragPos, handleCardMouseDown, handleWasteMouseDown, resetDrag, setDragFrom, setIsDragging } = useDragAndDrop();
  
  // Click handlers
  const { handleCardClick, handleWasteCardClick, handleFoundationClick, handleCardDoubleClick, handleWasteDoubleClick } = useGameHandlers({
    gameState,
    setGameState,
    history,
    setHistory,
    copyGameState,
    resetDrag,
  });
  
  // Audio initialization
  useAudio();
  
  // Play deal sound on first load
  useEffect(() => {
    playDealSound();
  }, []);

  // Ctrl+Q - Secret win shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        // Trigger win state
        const finalScore = calculateScore(gameState);
        setGameState((prev) => ({
          ...prev,
          gameWon: true,
          score: finalScore,
        }));
        setTimeout(() => {
          playWinSound();
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, setGameState]);  // Drag and drop to tableau
  const handleDragDrop = (toPile: number) => {
    if (!isDragging || !dragFrom) {
      resetDrag();
      return;
    }

    // Waste to Tableau drag & drop
    if ('source' in dragFrom && dragFrom.source === 'waste') {
      if (gameState.waste.length === 0) {
        resetDrag();
        return;
      }

      const card = gameState.waste[0];
      const destPile = gameState.tableau[toPile];

      if (!canPlaceOnTableau(card, destPile)) {
        resetDrag();
        return;
      }

      setHistory([...history, copyGameState(gameState)]);
      const newState = { ...gameState };
      newState.waste = newState.waste.slice(1);
      newState.tableau[toPile] = [...destPile, card];
      newState.selectedCard = null;
      newState.selectedPile = null;
      newState.selectedCardIndex = null;
      newState.moves++;
      newState.score = calculateScore(newState);
      setGameState(newState);
      resetDrag();
      playTableauMoveSound();
      return;
    }

    // Tableau to Tableau drag & drop
    const dragData = dragFrom as { pile: number; index: number };
    const { pile: fromPile, index: fromIndex } = dragData;

    if (fromPile === toPile) {
      resetDrag();
      return;
    }

    const sourcePile = gameState.tableau[fromPile];
    const destPile = gameState.tableau[toPile];
    const cardsToMove = sourcePile.slice(fromIndex);

    if (cardsToMove.length === 0 || !canPlaceOnTableau(cardsToMove[0], destPile)) {
      resetDrag();
      return;
    }

    setHistory([...history, copyGameState(gameState)]);
    const newState = { ...gameState };
    newState.tableau[fromPile] = sourcePile.slice(0, fromIndex);

    if (newState.tableau[fromPile].length > 0) {
      newState.tableau[fromPile][newState.tableau[fromPile].length - 1].faceUp = true;
      playFlipSound();
    }

    newState.tableau[toPile] = [...destPile, ...cardsToMove];
    newState.selectedCard = null;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    newState.moves++;
    newState.score = calculateScore(newState);
    setGameState(newState);
    resetDrag();
    playTableauMoveSound();
  };

  // Drag and drop to foundation
  const handleFoundationDragDrop = (suit: string) => {
    if (!isDragging || !dragFrom) {
      resetDrag();
      return;
    }

    const suitKey = suit as keyof typeof gameState.foundation;
    let card: typeof gameState.selectedCard = null;

    if ('source' in dragFrom && dragFrom.source === 'waste') {
      if (gameState.waste.length === 0) {
        resetDrag();
        return;
      }
      card = gameState.waste[0];
    } else {
      const dragData = dragFrom as { pile: number; index: number };
      const sourcePile = gameState.tableau[dragData.pile];
      if (dragData.index >= sourcePile.length) {
        resetDrag();
        return;
      }
      card = sourcePile[dragData.index];
    }

    if (!card) {
      resetDrag();
      return;
    }

    if (card.suit.id !== suit || !canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
      resetDrag();
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

    if ('source' in dragFrom && dragFrom.source === 'waste') {
      newState.waste = newState.waste.slice(1);
    } else {
      const dragData = dragFrom as { pile: number; index: number };
      newState.tableau[dragData.pile] = newState.tableau[dragData.pile].slice(0, dragData.index);

      if (newState.tableau[dragData.pile].length > 0) {
        newState.tableau[dragData.pile][newState.tableau[dragData.pile].length - 1].faceUp = true;
        playFlipSound();
      }
    }

    newState.foundation[suitKey] = [...newState.foundation[suitKey], card];
    newState.selectedCard = null;
    newState.selectedPile = null;
    newState.selectedCardIndex = null;
    newState.moves++;
    newState.score = calculateScore(newState);
    setGameState(newState);
    resetDrag();
    playMoveSound();
  };

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
