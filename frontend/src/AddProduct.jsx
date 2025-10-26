import { useState } from 'react'
import './AddProduct.css'

function AddProduct({ onClose, onAddProduct, currentAddress }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Elektronik',
    imageUrl: ''
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validasyon
    if (!formData.name || !formData.price) {
      alert('Lütfen ürün adı ve fiyat giriniz!')
      return
    }

    if (parseFloat(formData.price) <= 0) {
      alert('Fiyat 0\'dan büyük olmalıdır!')
      return
    }

    // Yeni ürün oluştur
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      description: formData.description || 'Açıklama eklenmemiş',
      price: formData.price + '₺',
      category: formData.category,
      image: formData.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.name)}`,
      seller: currentAddress,
      isAuthentic: true,
      ownershipHistory: [currentAddress]
    }

    onAddProduct(newProduct)
    alert('Ürün başarıyla eklendi! 🎉')
    onClose()
  }

  return (
    <div className="add-product-modal">
      <div className="add-product-content">
        <button className="add-product-close" onClick={onClose}>×</button>

        <h2>📦 Yeni Ürün Ekle</h2>
        <p className="add-product-subtitle">Ürününüz otomatik olarak NFT'ye dönüştürülecek</p>

        <form onSubmit={handleSubmit} className="add-product-form">
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
              placeholder="0"
              min="0"
              step="0.01"
              required
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
            <button type="button" className="btn-cancel" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn-submit">
              🚀 Ürünü Ekle ve NFT Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct