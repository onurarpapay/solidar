import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import type { GameState } from './types/game';
import {
  initializeGame,
  drawFromDeck,
  canPlaceOnFoundation,
  isGameWon,
  calculateScore,
} from './types/game';
import { Deck } from './components/Deck';
import { Foundation } from './components/Foundation';
import { Tableau } from './components/Tableau';
import { Stats } from './components/Stats';

function App() {
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
    }
  }, [gameState]);

  const handleDrawCard = () => {
    setHistory([...history, gameState]);
    const newState = drawFromDeck(gameState);
    newState.moves++;
    setGameState(newState);
  };

  const handleCardClick = (pileIndex: number, cardIndex: number) => {
    const pile = gameState.tableau[pileIndex];
    const card = pile[cardIndex >= 0 ? cardIndex : pile.length - 1];

    if (!card) return;

    // Try to place on foundation
    const suitKey = card.suit.id as keyof typeof gameState.foundation;
    if (canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
      setHistory([...history, gameState]);
      const newState = { ...gameState };
      newState.tableau[pileIndex] = pile.slice(0, -1);
      newState.foundation[suitKey] = [...newState.foundation[suitKey], card];

      // Flip the card below
      if (newState.tableau[pileIndex].length > 0) {
        newState.tableau[pileIndex][
          newState.tableau[pileIndex].length - 1
        ].faceUp = true;
      }

      newState.moves++;
      newState.score = calculateScore(newState);
      setGameState(newState);
    }
  };

  const handleWasteCardClick = () => {
    if (gameState.waste.length === 0) return;

    const card = gameState.waste[0];
    const suitKey = card.suit.id as keyof typeof gameState.foundation;

    // Try to place on foundation
    if (canPlaceOnFoundation(card, gameState.foundation[suitKey])) {
      setHistory([...history, gameState]);
      const newState = { ...gameState };
      newState.waste = newState.waste.slice(1);
      newState.foundation[suitKey] = [...newState.foundation[suitKey], card];
      newState.moves++;
      newState.score = calculateScore(newState);
      setGameState(newState);
    }
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
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Solitaire Oyunu</Text>
          <Text style={styles.headerSubtitle}>
            Kartları foundation'a sırasıyla yerleştirin
          </Text>
        </View>

        <Stats
          moves={gameState.moves}
          score={gameState.score}
          gameWon={gameState.gameWon}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
        />

        <View style={styles.gameArea}>
          <Deck
            deck={gameState.deck}
            waste={gameState.waste}
            onDrawCard={handleDrawCard}
          />

          <Foundation
            hearts={gameState.foundation.hearts}
            diamonds={gameState.foundation.diamonds}
            clubs={gameState.foundation.clubs}
            spades={gameState.foundation.spades}
            onCardClick={handleWasteCardClick}
          />
        </View>

        <Tableau
          piles={gameState.tableau}
          selectedPile={gameState.selectedPile}
          onCardClick={handleCardClick}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Web, Android ve iOS için Solitaire Oyunu
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#27ae60',
  },
  container: {
    flex: 1,
    backgroundColor: '#27ae60',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  gameArea: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
});

export default App;
