import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { Card as CardType } from '../types/game';
import { CardComponent } from './Card';

interface TableauProps {
  piles: CardType[][];
  selectedPile: number | null;
  onCardClick: (pileIndex: number, cardIndex: number) => void;
}

export const Tableau: React.FC<TableauProps> = ({
  piles,
  selectedPile,
  onCardClick,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oyun Alanı (Tableau)</Text>
      <View style={styles.tableauPiles}>
        {piles.map((pile, pileIndex) => (
          <View
            key={pileIndex}
            style={[
              styles.tableauPile,
              selectedPile === pileIndex && styles.selectedPile,
            ]}
          >
            {pile.length === 0 ? (
              <View style={styles.emptySlot} />
            ) : (
              pile.map((card, cardIndex) => (
                <View
                  key={card.id}
                  style={[
                    styles.cardWrapper,
                    cardIndex === pile.length - 1 && styles.topCard,
                  ]}
                >
                  <CardComponent card={card} />
                </View>
              ))
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
    gap: 15,
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tableauPiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },
  tableauPile: {
    flex: 1,
    minWidth: 80,
    minHeight: 300,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
  },
  selectedPile: {
    borderColor: 'rgba(243, 156, 18, 0.8)',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
  },
  cardWrapper: {
    position: 'relative',
    marginTop: -60,
  },
  topCard: {
    marginTop: -30,
  },
  emptySlot: {
    width: 80,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
