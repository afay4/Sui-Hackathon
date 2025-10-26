import { useState } from 'react'
import './AddProduct.css'
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID } from './config.js' // .js uzantısını ekledim (konsol çıktınızda böyle görünüyordu)

function AddProduct({ onClose, onAddProductSuccess, currentAddress }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '', // Fiyatı string olarak alacağız
    category: 'Elektronik',
    imageUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  const categories = [
    'Elektronik',
    'Ayakkabı',
    'Giyim',
    'Mobilya',
    'Kitap',
    'Spor',
    'Oyuncak',
    'Diğer'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true);

    // Validasyon
    if (!formData.name || !formData.price) {
      alert('Lütfen ürün adı ve fiyat giriniz!')
      setIsLoading(false);
      return
    }
    
    const priceAsNumber = parseFloat(formData.price)
    if (priceAsNumber <= 0) {
      alert('Fiyat 0\'dan büyük olmalıdır!')
      setIsLoading(false);
      return
    }

    const priceAsU64 = Math.floor(priceAsNumber);

    const txb = new Transaction()
    
    // !!! HATA BURADAYDI !!!
    // useSignAndExecuteTransaction hook'u sender'ı otomatik ekler.
    // Bu satırı manuel olarak eklemek hataya neden oluyor.
    // txb.setSender(currentAddress) // <-- BU SATIRI SİLİN

    console.log(PACKAGE_ID)
    txb.moveCall({
      target: `${PACKAGE_ID}::product_nft::mint_product_nft`,
      arguments: [
        txb.pure.string(formData.name),
        txb.pure.string(formData.description || 'Açıklama eklenmemiş'),
        txb.pure.string(formData.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.name)}`),
        txb.pure.u64(priceAsU64),
        txb.pure.string(formData.category),
      ],
    })

    

    await signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: (result) => {
          setIsLoading(false);
          console.log('NFT Minted:', result);
          alert('Ürün başarıyla eklendi ve NFT oluşturuldu! 🎉');
          onAddProductSuccess();
          onClose();
        },
        onError: (error) => {
          setIsLoading(false);
          console.error(error);
          alert('NFT oluşturulurken bir hata oluştu: ' + error.message);
        },
      }
    )
  }

  return (
    <div className="add-product-modal">
      <div className="add-product-content">
        <button className="add-product-close" onClick={onClose}>×</button>

        <h2>📦 Yeni Ürün Ekle</h2>
        <p className="add-product-subtitle">Ürününüz otomatik olarak NFT'ye dönüştürülecek</p>

        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Formun geri kalanı aynı... */}
          {/* Ürün Adı */}
          <div className="form-group">
            <label htmlFor="name">
              Ürün Adı <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: iPhone 14 Pro Max"
              required
              disabled={isLoading}
            />
          </div>

          {/* Açıklama */}
          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ürün hakkında detaylı bilgi..."
              rows="4"
              disabled={isLoading}
            />
          </div>

          {/* Fiyat */}
          <div className="form-group">
            <label htmlFor="price">
              Fiyat (₺) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="15000"
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          {/* Kategori */}
          <div className="form-group">
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Resim URL */}
          <div className="form-group">
            <label htmlFor="imageUrl">
              Resim URL (Opsiyonel)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            <small className="form-hint">
              Boş bırakırsanız otomatik placeholder oluşturulur
            </small>
          </div>

          {/* NFT Bilgisi */}
          <div className="nft-info">
            <div className="nft-badge">🔗 NFT</div>
            <div className="nft-details">
              <p><strong>Blockchain:</strong> Sui Network</p>
              <p><strong>Sahip:</strong> <code>{currentAddress.slice(0, 8)}...{currentAddress.slice(-6)}</code></p>
              <p><strong>Durum:</strong> <span className="authentic">✓ Orijinal</span></p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
              İptal
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Oluşturuluyor...' : '🚀 Ürünü Ekle ve NFT Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct