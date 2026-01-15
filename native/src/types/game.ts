export interface Suit {
  id: string;
  name: string;
  symbol: string;
  color: 'red' | 'black';
}

export interface Rank {
  id: string;
  name: string;
  value: number;
  display: string;
}

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface GameState {
  deck: Card[];
  waste: Card[];
  foundation: {
    hearts: Card[];
    diamonds: Card[];
    clubs: Card[];
    spades: Card[];
  };
  tableau: Card[][];
  selectedCard: Card | null;
  selectedPile: number | null;
  selectedCardIndex: number | null;
  moves: number;
  score: number;
  gameWon: boolean;
}

export interface CardConfig {
  suits: Suit[];
  ranks: Rank[];
}

// Card configuration
const suits: Suit[] = [
  {
    id: 'hearts',
    name: 'Kupa',
    symbol: '♥',
    color: 'red',
  },
  {
    id: 'diamonds',
    name: 'Karo',
    symbol: '♦',
    color: 'red',
  },
  {
    id: 'clubs',
    name: 'Sinek',
    symbol: '♣',
    color: 'black',
  },
  {
    id: 'spades',
    name: 'Maça',
    symbol: '♠',
    color: 'black',
  },
];

const ranks: Rank[] = [
  { id: 'ace', name: 'As', value: 1, display: 'A' },
  { id: '2', name: '2', value: 2, display: '2' },
  { id: '3', name: '3', value: 3, display: '3' },
  { id: '4', name: '4', value: 4, display: '4' },
  { id: '5', name: '5', value: 5, display: '5' },
  { id: '6', name: '6', value: 6, display: '6' },
  { id: '7', name: '7', value: 7, display: '7' },
  { id: '8', name: '8', value: 8, display: '8' },
  { id: '9', name: '9', value: 9, display: '9' },
  { id: '10', name: '10', value: 10, display: '10' },
  { id: 'jack', name: 'Vale', value: 11, display: 'J' },
  { id: 'queen', name: 'Kız', value: 12, display: 'Q' },
  { id: 'king', name: 'Kral', value: 13, display: 'K' },
];

export const cardConfig: CardConfig = { suits, ranks };

// Create a full deck of cards
export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  for (const suit of cardConfig.suits) {
    for (const rank of cardConfig.ranks) {
      deck.push({
        id: `${rank.id}-${suit.id}`,
        suit,
        rank,
        faceUp: false,
      });
    }
  }

  return shuffleDeck(deck);
};

// Fisher-Yates shuffle algorithm
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Initialize game state
export const initializeGame = (): GameState => {
  const deck = createDeck();
  const tableau: Card[][] = Array(7)
    .fill(null)
    .map(() => []);

  // Deal cards to tableau
  let deckIndex = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = col; row < 7; row++) {
      const card = deck[deckIndex++];
      card.faceUp = row === col; // Only the last card is face up
      tableau[row].push(card);
    }
  }

  return {
    deck: deck.slice(deckIndex),
    waste: [],
    foundation: {
      hearts: [],
      diamonds: [],
      clubs: [],
      spades: [],
    },
    tableau,
    selectedCard: null,
    selectedPile: null,
    selectedCardIndex: null,
    moves: 0,
    score: 0,
    gameWon: false,
  };
};

// Check if a card can be placed on foundation
export const canPlaceOnFoundation = (
  card: Card,
  foundationPile: Card[]
): boolean => {
  if (card.rank.value === 1) {
    // Ace can go on empty foundation
    return foundationPile.length === 0;
  }

  if (foundationPile.length === 0) {
    return false;
  }

  const topCard = foundationPile[foundationPile.length - 1];
  return (
    card.suit.id === topCard.suit.id &&
    card.rank.value === topCard.rank.value + 1
  );
};

// Check if a card can be placed on tableau
export const canPlaceOnTableau = (
  card: Card,
  tableauPile: Card[]
): boolean => {
  if (tableauPile.length === 0) {
    // Only King can go on empty tableau
    return card.rank.value === 13;
  }

  const topCard = tableauPile[tableauPile.length - 1];
  return (
    topCard.suit.color !== card.suit.color &&
    topCard.rank.value === card.rank.value + 1
  );
};

// Draw card from deck
export const drawFromDeck = (state: GameState): GameState => {
  if (state.deck.length === 0) {
    // Reset deck from waste
    if (state.waste.length === 0) {
      return state;
    }
    const newDeck = state.waste
      .reverse()
      .map((card) => ({ ...card, faceUp: false }));
    return { ...state, deck: newDeck, waste: [] };
  }

  const card = state.deck[0];
  card.faceUp = true;
  return {
    ...state,
    deck: state.deck.slice(1),
    waste: [card, ...state.waste],
  };
};

// Check if game is won
export const isGameWon = (state: GameState): boolean => {
  return (
    state.foundation.hearts.length === 13 &&
    state.foundation.diamonds.length === 13 &&
    state.foundation.clubs.length === 13 &&
    state.foundation.spades.length === 13
  );
};

// Calculate score
export const calculateScore = (state: GameState): number => {
  let score = 0;

  // Points for cards in foundation
  Object.values(state.foundation).forEach((pile) => {
    score += pile.length * 10;
  });

  // Time bonus (simplified)
  return Math.max(0, score - state.moves);
};
