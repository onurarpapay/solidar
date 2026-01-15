import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

interface StatsProps {
  moves: number;
  score: number;
  gameWon: boolean;
  onNewGame: () => void;
  onUndo?: () => void;
}

export const Stats: React.FC<StatsProps> = ({
  moves,
  score,
  gameWon,
  onNewGame,
  onUndo,
}) => {
  return (
    <>
      <View style={styles.stats}>
        <View style={styles.statsInfo}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Hamle Sayısı:</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Puan:</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.statsButtons}>
          {onUndo && (
            <TouchableOpacity
              onPress={onUndo}
              style={[styles.btn, styles.btnUndo]}
            >
              <Text style={styles.btnText}>Geri Al</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onNewGame}
            style={[styles.btn, styles.btnNewGame]}
          >
            <Text style={styles.btnText}>Yeni Oyun</Text>
          </TouchableOpacity>
        </View>
      </View>

      {gameWon && (
        <Modal transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🎉 Tebrikler! 🎉</Text>
              <Text style={styles.modalText}>
                Oyunu başarıyla tamamladınız!
              </Text>
              <Text style={styles.modalScore}>Puan: {score}</Text>
              <TouchableOpacity
                onPress={onNewGame}
                style={[styles.btn, styles.btnNewGame]}
              >
                <Text style={styles.btnText}>Tekrar Oyna</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  stats: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsInfo: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'column',
    gap: 5,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: '500',
    color: 'white',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1c40f',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    padding: 12,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNewGame: {
    backgroundColor: '#3498db',
  },
  btnUndo: {
    backgroundColor: '#9b59b6',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#e67e22',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 36,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    fontWeight: '600',
  },
  modalScore: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
