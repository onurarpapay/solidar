# Solitaire Oyunu - İnşaat Rehberi

## Proje Hakkında

Bu proje web, iOS ve Android'te çalışabilen bir Solitaire oyunudur.

### Web Sürümü
- **Framework**: React 19
- **Build Tool**: Vite
- **Dil**: TypeScript
- **Styling**: CSS3

### Mobil Sürüm  
- **Framework**: React Native
- **Dil**: TypeScript
- **Platform**: iOS & Android

## Paylaşılan Kod

Oyun mantığı her iki platform arasında paylaşılır:
- `src/types/game.ts` (Web)
- `native/src/types/game.ts` (Mobile)

Bu dosyalar aynı oyun kurallarını ve veri yapılarını tanımlar.

## Kart Konfigürasyonu

### Web
`src/config/cards.json` dosyasından kartlar yüklenir.

### Mobile  
`native/src/types/game.ts` dosyasında hardcoded tanımlanmıştır (JSON desteği yoktur).

Kartları değiştirmek için:
1. Her iki dosyadaki `suits` ve `ranks` dizilerini düzenleyin
2. Derleme işlemini çalıştırın
3. Oyun mantığı otomatik olarak yeni kartlarla çalışacaktır

## Phased Rollout

### Phase 1: Web Sürümü ✅
- Temel oyun mantığı
- React bileşenleri
- Styling
- Responsive tasarım

### Phase 2: React Native ✅
- Mobil bileşenler
- Touch-optimized UI
- iOS & Android uyumluluğu

### Phase 3: Opsiyonel Gelişmeler
- Skor tablosu
- Zorluk seviyeleri
- Yardım sistemi
- Çoklu oyun modları
- Sesler ve animasyonlar

## Geliştirme Ipuçları

1. **Local Development**
   ```bash
   npm run dev  # Web
   npm run android  # Android
   npm run ios  # iOS
   ```

2. **TypeScript Hatalarını Düzelt**
   ```bash
   npm run build  # Web
   ```

3. **Code Sharing**
   - `types/game.ts` her iki platform'da aynıdır
   - Bileşenler platform-spesific'tir

## Proje Yapısı

```
src/
├── components/      # Web React bileşenleri
├── types/          # Shared oyun mantığı
├── styles/         # CSS
├── config/         # JSON config
└── App.tsx         # Ana sayfa

native/src/
├── components/     # React Native bileşenleri
├── types/         # Shared oyun mantığı
└── App.tsx        # Ana sayfa
```

## Katkı İçin İpuçları

1. **İlk Setup**
   ```bash
   cd Solidar3
   npm install
   cd native
   npm install
   ```

2. **Yeni Özellik Eklerken**
   - Oyun mantığını `types/game.ts`'de tanımlayın
   - Her platform için bileşenleri oluşturun

3. **Testler**
   - Geliştirme sunucusunda test edin
   - Her iki platform'da kontrol edin

## İletişim

Sorularınız varsa issue açın!
