import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { Card as CardType } from '../types/game';
import { CardComponent } from './Card';

interface DeckProps {
  deck: CardType[];
  waste: CardType[];
  onDrawCard: () => void;
}

export const Deck: React.FC<DeckProps> = ({ deck, waste, onDrawCard }) => {
  const topWaste = waste.length > 0 ? waste[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.deckPiles}>
        <TouchableOpacity
          style={[styles.deckPile, { backgroundColor: deck.length > 0 ? '#2c3e50' : '#ecf0f1' }]}
          onPress={onDrawCard}
        >
          <Text style={styles.deckText}>
            {deck.length > 0 ? `Depo\n(${deck.length})` : '0'}
          </Text>
        </TouchableOpacity>

        <View style={styles.wastePile}>
          {topWaste ? (
            <CardComponent card={topWaste} />
          ) : (
            <Text style={styles.emptyText}>Boş</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
  },
  deckPiles: {
    flexDirection: 'row',
    gap: 15,
  },
  deckPile: {
    width: 80,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wastePile: {
    width: 80,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
