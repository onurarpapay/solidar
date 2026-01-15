import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { Card as CardType } from '../types/game';
import { CardComponent } from './Card';

interface FoundationProps {
  hearts: CardType[];
  diamonds: CardType[];
  clubs: CardType[];
  spades: CardType[];
}

export const Foundation: React.FC<FoundationProps> = ({
  hearts,
  diamonds,
  clubs,
  spades,
}) => {
  const piles = [
    { suit: 'hearts', cards: hearts, symbol: '♥' },
    { suit: 'diamonds', cards: diamonds, symbol: '♦' },
    { suit: 'clubs', cards: clubs, symbol: '♣' },
    { suit: 'spades', cards: spades, symbol: '♠' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temel (Foundation)</Text>
      <View style={styles.foundationPiles}>
        {piles.map(({ suit, cards, symbol }) => (
          <View key={suit} style={styles.foundationPile}>
            <Text style={styles.pileLabel}>{symbol}</Text>
            <Text style={styles.pileCount}>{cards.length}/13</Text>
            {cards.length > 0 && (
              <CardComponent card={cards[cards.length - 1]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  foundationPiles: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  foundationPile: {
    width: 80,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pileLabel: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: 'white',
    fontSize: 20,
    opacity: 0.7,
  },
  pileCount: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    color: 'white',
    fontSize: 12,
    opacity: 0.7,
    fontWeight: 'bold',
  },
});
