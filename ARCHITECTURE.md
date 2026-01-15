# Solitaire Oyunu - Mimari

## Sistem Tasarımı

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Uygulaması                           │
│  React + TypeScript + Vite (React 19.2.0)                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐       │
│  │   Deck       │  │ Foundation    │  │  Tableau    │       │
│  │  Component   │  │  Component    │  │  Component  │       │
│  └──────────────┘  └──────────────┘  └─────────────┘       │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
│                    ┌──────▼──────┐                          │
│                    │ App.tsx      │                          │
│                    │ State Mgmt   │                          │
│                    └──────┬──────┘                          │
│                           │                                 │
│                    ┌──────▼──────────┐                      │
│                    │ types/game.ts    │                      │
│                    │ Game Logic       │                      │
│                    │ Types            │                      │
│                    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ Shared Code
                           │
┌─────────────────────────────────────────────────────────────┐
│                  React Native Uygulaması                     │
│  React + TypeScript (React Native 0.73)                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐       │
│  │   Deck       │  │ Foundation    │  │  Tableau    │       │
│  │  Component   │  │  Component    │  │  Component  │       │
│  └──────────────┘  └──────────────┘  └─────────────┘       │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
│                    ┌──────▼──────┐                          │
│                    │ App.tsx      │                          │
│                    │ State Mgmt   │                          │
│                    └──────┬──────┘                          │
│                           │                                 │
│                    ┌──────▼──────────┐                      │
│                    │ types/game.ts    │                      │
│                    │ Game Logic       │                      │
│                    │ Types            │                      │
│                    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Dosya Hiyerarşisi

### Web (src/)
```
src/
├── App.tsx                      # Ana uygulama komponenti
├── App.css                      # Global stiller
├── main.tsx                     # Entry point
├── index.html                   # HTML şablonu
├── components/
│   ├── Card.tsx                 # Kart bileşeni
│   ├── Deck.tsx                 # Deck bileşeni
│   ├── Foundation.tsx           # Foundation pile'ları
│   ├── Tableau.tsx              # Oyun alanı
│   └── Stats.tsx                # İstatistikler
├── types/
│   └── game.ts                  # Oyun mantığı ve türleri
├── styles/
│   ├── Card.css                 # Kart stilleri
│   ├── Deck.css                 # Deck stilleri
│   ├── Foundation.css           # Foundation stilleri
│   ├── Tableau.css              # Tableau stilleri
│   └── Stats.css                # Stats stilleri
└── config/
    └── cards.json               # Kart konfigürasyonu
```

### React Native (native/src/)
```
native/
├── src/
│   ├── App.tsx                  # Ana uygulama komponenti
│   ├── components/
│   │   ├── Card.tsx             # Kart bileşeni (React Native)
│   │   ├── Deck.tsx             # Deck bileşeni
│   │   ├── Foundation.tsx       # Foundation bileşeni
│   │   ├── Tableau.tsx          # Tableau bileşeni
│   │   └── Stats.tsx            # Stats bileşeni
│   ├── types/
│   │   └── game.ts              # Oyun mantığı (Web ile aynı)
│   └── hooks/
│       └── useFonts.ts          # Font yükleme hook'u
├── index.js                     # React Native entry point
└── package.json
```

## State Yönetimi

Her bileşen şu state'e sahiptir:

```typescript
interface GameState {
  deck: Card[];                    // Kalan kartlar
  waste: Card[];                   # Çekilen kartlar
  foundation: {                    # Foundation pile'ları
    hearts: Card[];
    diamonds: Card[];
    clubs: Card[];
    spades: Card[];
  };
  tableau: Card[][];               # Oyun alanı (7 sütun)
  selectedCard: Card | null;       # Seçili kart
  selectedPile: number | null;     # Seçili pile
  moves: number;                   # Toplam hamle sayısı
  score: number;                   # Oyun puanı
  gameWon: boolean;                # Oyun kazanıldı mı?
}
```

## Oyun Mantığı

### Kart Yerleştirme Kuralları

#### Foundation
- **Başlangıç**: Ace (1) kartı
- **Ardışık**: Aynı suit, ardışık değerler
- **Final**: King (13) kartı

#### Tableau
- **Boş Pile**: Sadece King (13) başlayabilir
- **Üstüne Ekleme**: Alternating renkler, azalan değerler
- **Örnek**: 6♠ (siyah) üzerine 5♥ (kırmızı) konulabilir

### Oyun Akışı

1. Deck 7 sütuna açılır
2. Kullanıcı kartları hareket ettirir
3. Hamle sayısı ve puan güncellenir
4. Tüm kartlar foundation'a gidince oyun biter

## Veri Akışı

```
User Input
    │
    ▼
Component Event
    │
    ▼
Game Logic Check (types/game.ts)
    │
    ├─► Valid   ─► Update State ─► Re-render
    │
    └─► Invalid ─► Ignore
```

## Platform Farklılıkları

### Web
- CSS kullanır
- Responsive grid layout
- Yüksek çözünürlüklü görüntüler
- Keyboard + mouse support

### React Native  
- StyleSheet kullanır
- Flex layout
- SVG/Unicode karakterler
- Touch gestures

## Bileşen Harita

```
App
├── Stats
│   └── Buttons (NewGame, Undo)
├── Deck
│   ├── Card (Deck pile)
│   └── Card (Waste pile)
├── Foundation
│   └── Card x 4 (Hearts, Diamonds, Clubs, Spades)
└── Tableau
    └── Card[] x 7 (7 columns)
```

## Performans Optimizasyonları

1. **Immutable State**: State güncellemelerinde spread operator
2. **Component Reuse**: Card bileşeni tüm yerlerde tekrarlanır
3. **Minimal Re-renders**: useState ve useCallback optimizasyonları
4. **Game Logic Separation**: Oyun mantığı bileşenlerden ayrı

## Gelecek Iyileştirmeler

1. **Animasyonlar**
   - Kart hareketi
   - Kazanma animasyonu
   
2. **Sound**
   - Kart çekme sesi
   - Kazanma sesi

3. **AI**
   - Otomatik hamle önerileri
   - Çözülemez durumları tespit etme

4. **Depolama**
   - Oyun durumu kaydetme
   - Skor tablosu

5. **Tema**
   - Koyu/Aydınlık mod
   - Kartlar stilleri
