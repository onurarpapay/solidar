# Solitaire Oyunu

Web, Android ve iOS'te native olarak çalışan standart bir Solitaire (Patience) oyunu.

## 🎮 Özellikler

- **Cross-Platform**: Web (React), iOS ve Android (React Native) için optimize edilmiş
- **Configurable Kartlar**: Kartlar ve suitler JSON dosyasında tanımlanmış (kolayca özelleştirilebilir)
- **Tam Oyun Mantığı**: 
  - Deck'ten kart çekme
  - Foundation pile'larına kart yerleştirme
  - Tableau üzerinde kart haraketleri
  - Hamle geri alma (Undo)
  - Oyun durumu takibi (hamle sayısı, puan)
  - Oyun kazanma durumu

## 📁 Proje Yapısı

```
Solidar3/
├── src/                          # Web uygulaması (React)
│   ├── components/               # React bileşenleri
│   │   ├── Card.tsx             # Kart bileşeni
│   │   ├── Deck.tsx             # Deck bileşeni
│   │   ├── Foundation.tsx        # Foundation pile'ları
│   │   ├── Tableau.tsx          # Oyun alanı
│   │   └── Stats.tsx            # İstatistikler ve butonlar
│   ├── types/
│   │   └── game.ts              # Oyun türleri ve mantığı
│   ├── styles/                   # CSS dosyaları
│   ├── config/
│   │   └── cards.json           # Kart konfigürasyonu
│   ├── App.tsx                  # Ana uygulama
│   └── main.tsx
├── native/                       # React Native uygulaması
│   ├── src/
│   │   ├── components/          # React Native bileşenleri
│   │   ├── types/
│   │   │   └── game.ts          # Paylaşılan oyun mantığı
│   │   └── App.tsx              # Ana uygulama
│   ├── index.js
│   └── package.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 🚀 Kurulum ve Çalıştırma

### Web Versiyonu

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production için derle
npm run build
```

Web sunucusu `http://localhost:5173/` adresinde çalışacaktır.

### React Native (Android/iOS)

```bash
cd native

# Bağımlılıkları yükle
npm install

# Android için çalıştır
npm run android

# iOS için çalıştır (macOS gerekir)
npm run ios

# Development server başlat
npm start
```

## 🎯 Oyun Kuralları

1. **Deck**: Soldaki deck'ten kart çekilir
2. **Foundation**: Aynı suit'in kartları değeri sırasıyla As'ten King'e kadar
3. **Tableau**: Alternating renkler ve azalan değerler (Kral en yüksek)
4. **Amaç**: Tüm kartları foundation'a yerleştirerek oyunu bitir

## 🛠️ Kart Konfigürasyonu

`src/config/cards.json` dosyasında kartlar ve suitler tanımlanmıştır:

```json
{
  "suits": [
    {
      "id": "hearts",
      "name": "Kupa",
      "symbol": "♥",
      "color": "red"
    },
    ...
  ],
  "ranks": [
    {
      "id": "ace",
      "name": "As",
      "value": 1,
      "display": "A"
    },
    ...
  ]
}
```

Kartları ve suitler özelleştirmek için bu dosyayı düzenleyin. Tüm kart mantığı otomatik olarak yeni konfigürasyonla çalışacaktır.

## 📱 Responsive Tasarım

- **Desktop**: Tam ekran deneyimi
- **Tablet**: Uygun düzeni
- **Mobile**: Optimized kart boyutları ve dokunmatik arayüz

## 💻 Teknolojiler

### Web
- React 19.2.0
- TypeScript
- Vite
- CSS3

### Mobile
- React Native 0.73.0
- TypeScript
- React Native StyleSheet

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunun

1. Fork yapın
2. Feature branch'i oluşturun
3. Değişikleri commit edin
4. Branch'e push yapın
5. Pull Request açın

---

**Not**: Bu proje öğrenme amacıyla oluşturulmuştur.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
