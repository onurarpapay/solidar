import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType | null;
  onPress?: () => void;
  isSelected?: boolean;
}

export const CardComponent: React.FC<CardProps> = ({
  card,
  onPress,
  isSelected,
}) => {
  if (!card) {
    return (
      <View
        style={[
          styles.card,
          styles.cardEmpty,
        ]}
      />
    );
  }

  const cardColor = card.suit.color === 'red' ? '#e74c3c' : '#1a1a1a';

  return (
    <View
      style={[
        styles.card,
        card.suit.color === 'red' ? styles.cardRed : styles.cardBlack,
        isSelected && styles.selected,
      ]}
      onLongPress={onPress}
    >
      {card.faceUp ? (
        <View style={styles.cardContent}>
          <Text style={[styles.cardRank, { color: cardColor }]}>
            {card.rank.display}
          </Text>
          <Text style={[styles.cardSuit, { color: cardColor }]}>
            {card.suit.symbol}
          </Text>
        </View>
      ) : (
        <View style={styles.cardBack}>
          <Text style={styles.cardBackPattern}>◆</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 120,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardRed: {
    borderColor: '#e74c3c',
  },
  cardBlack: {
    borderColor: '#1a1a1a',
  },
  cardEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  selected: {
    borderColor: '#f39c12',
    borderWidth: 3,
    shadowColor: '#f39c12',
    shadowOpacity: 0.5,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  cardRank: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSuit: {
    fontSize: 32,
    lineHeight: 32,
  },
  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#2c3e50',
    borderRadius: 8,
  },
  cardBackPattern: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.2)',
  },
});
