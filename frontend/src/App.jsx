import AddProduct from './AddProduct'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useState } from 'react'
import './App.css'
import SellerReview from './SellerReview'
import QRScanner from './QRScanner'


function App() {
  const account = useCurrentAccount()
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 13 Pro',
      price: '15000₺',
      category: 'Elektronik',
      image: 'https://via.placeholder.com/300x200?text=iPhone+13+Pro',
      seller: '0x123...abc',
      isAuthentic: true,
      ownershipHistory: ['0x123...abc']
    },
    {
      id: 2,
      name: 'Nike Air Jordan',
      price: '3500₺',
      category: 'Ayakkabı',
      image: 'https://via.placeholder.com/300x200?text=Nike+Air+Jordan',
      seller: '0x456...def',
      isAuthentic: true,
      ownershipHistory: ['0x789...ghi', '0x456...def']
    },
    {
      id: 3,
      name: 'MacBook Pro M2',
      price: '45000₺',
      category: 'Elektronik',
      image: 'https://via.placeholder.com/300x200?text=MacBook+Pro',
      seller: '0x789...xyz',
      isAuthentic: true,
      ownershipHistory: ['0x789...xyz']
    }
  ])

  const [selectedProduct, setSelectedProduct] = useState(null)
const [showSellerReview, setShowSellerReview] = useState(false)
const [selectedSeller, setSelectedSeller] = useState(null)
 const [showAddProduct, setShowAddProduct] = useState(false)
const [showQRScanner, setShowQRScanner] = useState(false)
const [qrMode, setQrMode] = useState('scan')
const [qrProductData, setQrProductData] = useState(null)
const handleAddProduct = (newProduct) => {
  setProducts([newProduct, ...products])
}
const handleQRScan = (data) => {
  alert('QR Kod başarıyla okundu!')
  setShowQRScanner(false)
  
  const foundProduct = products.find(p => p.id === data.id)
  if (foundProduct) {
    setSelectedProduct(foundProduct)
  }
}

const openQRScanner = (mode, product = null) => {
  setQrMode(mode)
  setQrProductData(product)
  setShowQRScanner(true)
}
 return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🔗 NFT Payment</h1>
          <p className="tagline">Uygun Fiyatlı & Değerli Ürünler - Blockchain ile Güvence</p>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!account ? (
          <div className="connect-prompt">
            <h2>👋 Hoş Geldiniz!</h2>
            <p>Ürünleri görmek ve alışveriş yapmak için lütfen Sui Wallet'ınızı bağlayın.</p>
            <div className="features">
              <div className="feature-card">
                <span className="feature-icon">✅</span>
                <h3>Orijinallik Garantisi</h3>
                <p>Her ürün NFT ile doğrulanır</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📜</span>
                <h3>Sahiplik Geçmişi</h3>
                <p>Tüm eski sahipleri görün</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⭐</span>
                <h3>Satıcı Değerlendirme</h3>
                <p>Güvenilir satıcılar</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="products-section">
            <div className="section-header">
  <div>
    <h2>🛍️ Ürünler</h2>
  </div>
  <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
    <p className="wallet-info">
      Bağlı Cüzdan: <code>{account.address.slice(0, 6)}...{account.address.slice(-4)}</code>
    </p>
    <button 
      className="btn-primary"
      style={{padding: '0.6rem 1.2rem', width: 'auto'}}
      onClick={() => setShowAddProduct(true)}
    >
    
  ➕ Ürün Ekle
</button>
<button 
  className="btn-primary"
  style={{padding: '0.6rem 1.2rem', width: 'auto', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
  onClick={() => openQRScanner('scan')}
>
  📷 QR Oku
</button>
  </div>
</div>

            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p className="product-price">{product.price}</p>
                    
                    <div className="product-meta">
                      <span className="authentic-badge">
                        {product.isAuthentic ? '✓ Orijinal' : '⚠ Doğrulanmamış'}
                      </span>
                      <span className="owner-count">
                        👤 {product.ownershipHistory.length} Sahip
                      </span>
                    </div>

                    <button 
                      className="btn-primary"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Detayları Gör
                    </button>
                  </div>
                </div>
                
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
            
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
            
            <div className="modal-details">
              <div className="detail-row">
                <span className="label">Fiyat:</span>
                <span className="value">{selectedProduct.price}</span>
              </div>
              <div className="detail-row">
                <span className="label">Kategori:</span>
                <span className="value">{selectedProduct.category}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Satıcı:</span>
                <span className="value">{selectedProduct.seller}</span>
              </div>
              <button 
  className="btn-primary" 
  style={{marginTop: '1rem'}}
  onClick={() => {
    setSelectedSeller(selectedProduct.seller)
    setShowSellerReview(true)
    setSelectedProduct(null)
  }}
>
  👤 Satıcı Profilini Gör
</button>
              <div className="detail-row">
                <span className="label">Durum:</span>
                <span className="value">
                  {selectedProduct.isAuthentic ? '✅ Orijinal NFT' : '⚠️ Doğrulanmamış'}
                </span>
              </div>
            </div>

            <div className="ownership-history">
              <h3>📜 Sahiplik Geçmişi</h3>
              <div className="history-list">
                {selectedProduct.ownershipHistory.map((owner, index) => (
                  <div key={index} className="history-item">
                    <span className="history-number">#{selectedProduct.ownershipHistory.length - index}</span>
                    <code>{owner}</code>
                    {index === selectedProduct.ownershipHistory.length - 1 && (
                      <span className="current-badge">Mevcut</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
<button 
              className="btn-primary"
              style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '1rem'}}
              onClick={() => openQRScanner('generate', selectedProduct)}
            >
              🎯 QR Kod Oluştur
            </button>
            <button className="btn-buy">Satın Al</button>
            
          </div>
        </div>
      )}
  {/* Seller Review Modal */}
      {showSellerReview && selectedSeller && (
        <SellerReview 
          seller={selectedSeller} 
          onClose={() => setShowSellerReview(false)} 
        />
      )}
      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProduct 
          onClose={() => setShowAddProduct(false)}
          onAddProduct={handleAddProduct}
          currentAddress={account.address}
        />
      )}
      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={handleQRScan}
          productData={qrProductData}
          mode={qrMode}
        />
      )}
    </div>  
    )
}

export default App