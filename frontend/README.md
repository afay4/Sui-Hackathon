# 🔗 NFT Payment

**Uygun Fiyatlı & Değerli Ürünler - Blockchain ile Güvence**

NFT Payment, ürünlerin orijinalliğini NFT teknolojisi ile doğrulayan, sahiplik geçmişini şeffaf bir şekilde kaydeden ve satıcı güvenilirliğini topluluk yorumları ile değerlendiren yenilikçi bir e-ticaret platformudur.

---

## 🌟 Özellikler

### 🎯 Temel Özellikler

- **NFT ile Orijinallik Doğrulama**: Her ürün benzersiz bir NFT'ye bağlanır, sahtecilik önlenir
- **Şeffaf Sahiplik Geçmişi**: Tüm önceki sahipler blockchain üzerinde kayıtlıdır
- **Satıcı Değerlendirme Sistemi**: Kullanıcılar satıcıları puanlayabilir ve yorum yapabilir
- **Kolay NFT Transferi**: Ürün satıldığında NFT otomatik olarak yeni sahibine geçer
- **Sui Wallet Entegrasyonu**: Güvenli blockchain cüzdan bağlantısı

### 💎 Kullanıcı Özellikleri

- ✅ Ürün listeleme ve arama
- ✅ Ürün detayları ve sahiplik geçmişi görüntüleme
- ✅ Yeni ürün ekleme ve NFT oluşturma
- ✅ Satıcı profili ve yorum sistemi
- ✅ Gerçek zamanlı cüzdan bağlantısı

---

## 🛠️ Teknoloji Stack

### Frontend
- **React** - Modern UI framework
- **Vite** - Hızlı geliştirme ortamı
- **@mysten/dapp-kit** - Sui blockchain entegrasyonu
- **@mysten/sui.js** - Sui JavaScript SDK

### Blockchain
- **Sui Network** - Yüksek performanslı blockchain
- **Move Language** - Güvenli smart contract dili
- **NFT Standard** - Sui NFT protokolü

---

## 📦 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Sui Wallet tarayıcı eklentisi
- Sui CLI (smart contract deploy için)

### Adımlar

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd nft_payment
   ```

2. **Frontend bağımlılıklarını yükleyin:**
   ```bash
   cd frontend
   npm install
   ```

3. **Frontend'i çalıştırın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda açın:**
   ```
   http://localhost:5173
   ```

5. **Sui Wallet'ı bağlayın:**
   - Sui Wallet eklentisini yükleyin
   - Testnet'e geçin
   - "Connect Wallet" butonuna tıklayın

---

## 📁 Proje Yapısı

```
nft_payment/
├── frontend/              # React frontend uygulaması
│   ├── src/
│   │   ├── App.jsx       # Ana uygulama komponenti
│   │   ├── SellerReview.jsx  # Satıcı yorumlama sistemi
│   │   ├── AddProduct.jsx    # Ürün ekleme formu
│   │   └── main.jsx      # Sui provider konfigürasyonu
│   ├── package.json
│   └── vite.config.js
│
└── move/                  # Sui Smart Contracts
    ├── sources/
    │   └── product_nft.move  # NFT ve ürün yönetimi
    └── Move.toml          # Paket konfigürasyonu
```

---

## 🚀 Smart Contract

### Ana Yapılar

#### ProductNFT
```move
public struct ProductNFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: String,
    original_price: u64,
    current_price: u64,
    category: String,
    is_authentic: bool,
    creation_timestamp: u64,
    ownership_history: vector<address>,
}
```

#### SellerProfile
```move
public struct SellerProfile has key {
    id: UID,
    owner: address,
    total_sales: u64,
    total_reviews: u64,
    rating_sum: u64,
    reviews: vector<Review>,
}
```

### Ana Fonksiyonlar

- `mint_product_nft()` - Yeni ürün NFT'si oluşturma
- `transfer_nft()` - NFT sahiplik transferi
- `create_seller_profile()` - Satıcı profili oluşturma
- `add_review()` - Satıcıya yorum ekleme

---

## 🎮 Kullanım

### 1. Cüzdan Bağlama
- Ana sayfada "Connect Wallet" butonuna tıklayın
- Sui Wallet'ı seçin ve onaylayın

### 2. Ürünleri Görüntüleme
- Bağlantı sonrası ürün listesi görünür
- Ürün kartlarına tıklayarak detayları görüntüleyin

### 3. Satıcı Değerlendirme
- Ürün detayında "Satıcı Profilini Gör" butonuna tıklayın
- Satıcının geçmiş yorumlarını görüntüleyin
- "Yorum Yaz" ile kendi değerlendirmenizi yapın

### 4. Yeni Ürün Ekleme
- "➕ Ürün Ekle" butonuna tıklayın
- Ürün bilgilerini doldurun
- "Ürünü Ekle ve NFT Oluştur" ile kaydedin

---

## 🔐 Güvenlik

- ✅ Her ürün benzersiz NFT ile korunur
- ✅ Sahiplik geçmişi değiştirilemez (immutable)
- ✅ Smart contract'lar Sui Move ile güvenli şekilde yazılmıştır
- ✅ Cüzdan imzaları gereklidir
- ✅ Blockchain üzerinde şeffaf kayıt

---

## 🌐 Sui Testnet

Proje şu anda Sui Testnet üzerinde çalışmaktadır:
- **Network**: Sui Testnet
- **RPC**: https://fullnode.testnet.sui.io:443

Test token almak için: https://faucet.sui.io

---

## 📈 Gelecek Planlar

- [ ] Mainnet deploy
- [ ] Gelişmiş arama ve filtreleme
- [ ] Kategori bazlı listeleme
- [ ] Mesajlaşma sistemi
- [ ] Ödeme entegrasyonu
- [ ] Mobil uygulama
- [ ] NFT marketplace entegrasyonu

---

## 👥 Ekip

Bu proje hackathon için geliştirilmiştir.

---

## 📄 Lisans

MIT License

---

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açın.

---

## 📞 İletişim

Sorularınız için lütfen issue açın veya bize ulaşın.

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**