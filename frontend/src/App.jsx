import AddProduct from './AddProduct'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { useState, useEffect, useCallback } from 'react'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client' // SuiClient eklendi
import './App.css'
import SellerReview from './SellerReview'
import QRScanner from './QRScanner'
import { PACKAGE_ID } from './config' // Kontrat ID'sini import et
import logo from './assets/logo.png'

// Sui Client'ı kur
// main.jsx dosyanızda 'testnet' olarak belirlediğiniz için burayı da güncelledim.
const client = new SuiClient({ url: getFullnodeUrl('testnet') }) // 'devnet' -> 'testnet'

function App() {
  const account = useCurrentAccount()
  const [products, setProducts] = useState([]) // Başlangıçta boş
  const [isLoadingProducts, setIsLoadingProducts] = useState(false) // Yükleme durumu

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showSellerReview, setShowSellerReview] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [qrMode, setQrMode] = useState('scan')
  const [qrProductData, setQrProductData] = useState(null)

  // Ürünleri (NFT'leri) blockchain'den çeken fonksiyon
  const fetchProducts = useCallback(async () => {
    if (!account) return

    setIsLoadingProducts(true)
    try {
      const objects = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::product_nft::ProductNFT`
        },
        options: {
          showContent: true,
          showType: true,
          showDisplay: true,
        }
      })
      
      console.log("Fetched Objects:", objects);

      const fetchedProducts = objects.data
        .filter(obj => obj.data && obj.data.content && obj.data.content.fields)
        .map(obj => {
          const fields = obj.data.content.fields
          const price = fields.current_price ? `${fields.current_price}₺` : 'Fiyat Yok'
          
          return {
            id: fields.id.id,
            name: fields.name,
            price: price,
            category: fields.category,
            image: fields.image_url,
            seller: fields.ownership_history[fields.ownership_history.length - 1],
            isAuthentic: fields.is_authentic,
            ownershipHistory: fields.ownership_history,
            objectId: obj.data.objectId 
          }
        })

      setProducts(fetchedProducts.reverse())
    } catch (error) {
      console.error('Ürünler getirilirken hata oluştu:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }, [account])

  // Cüzdan bağlandığında ürünleri çek
  useEffect(() => {
    if (account) {
      fetchProducts()
    } else {
      setProducts([])
    }
  }, [account, fetchProducts])

  
  const handleQRScan = (data) => {
    alert('QR Kod başarıyla okundu!')
    setShowQRScanner(false)
    
    const foundProduct = products.find(p => p.objectId === data.id)
    if (foundProduct) {
      setSelectedProduct(foundProduct)
    } else {
      alert("Bu ürün sizin cüzdanınızda bulunamadı.")
    }
  }

  const openQRScanner = (mode, product = null) => {
    setQrMode(mode)
    setQrProductData(product ? { id: product.objectId } : null) 
    setShowQRScanner(true)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-title">
            <img src={logo} alt="NFT Payment Product Logo" className="logo" />
            <div className="title-block">
              <h1>🔗 NFT Payment Product</h1>
              <p className="tagline">Uygun Fiyatlı & Değerli Ürünler - Blockchain ile Güvence</p>
            </div>
          </div>
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
                <h2>🛍️ Cüzdanımdaki Ürünler</h2>
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
            <button 
              className="btn-primary"
              style={{padding: '0.6rem 0.8rem', width: 'auto', backgroundColor: '#555'}}
              onClick={fetchProducts}
              disabled={isLoadingProducts}
            >
              {isLoadingProducts ? 'Yenileniyor...' : '🔄 Yenile'}
            </button>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="loading-products" style={{padding: '2rem', textAlign: 'center'}}>Ürünler yükleniyor...</div>
            ) : products.length === 0 ? (
              <div className="connect-prompt" style={{minHeight: '200px', justifyContent: 'center'}}>
                <p>Bu cüzdanda hiç ürün NFT'si bulunamadı.</p>
                <p>Yeni bir ürün ekleyerek başlayabilirsiniz!</p>
              </div>
            ) : (
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
            )}
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
                <span className="label">Mevcut Sahip:</span>
                <span className="value" style={{wordBreak: 'break-all'}}><code>{selectedProduct.seller}</code></span>
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
              <div className="detail-row">
                <span className="label">NFT Object ID:</span>
                <span className="value" style={{wordBreak: 'break-all'}}><code>{selectedProduct.objectId}</code></span>
              </div>
            </div>

            <div className="ownership-history">
              <h3>📜 Sahiplik Geçmişi</h3>
              <div className="history-list">
                {selectedProduct.ownershipHistory.map((owner, index) => (
                  <div key={index} className="history-item">
                    <span className="history-number">#{selectedProduct.ownershipHistory.length - index}</span>
                    <code style={{wordBreak: 'break-all'}}>{owner}</code>
                    {index === 0 && (
                      <span className="current-badge" style={{backgroundColor: '#666'}}>Yaratıcı</span>
                    )}
                    {index === selectedProduct.ownershipHistory.length - 1 && (
                      <span className="current-badge">Mevcut Sahip</span>
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
            <button className="btn-buy" onClick={() => alert('Satın alma fonksiyonu henüz eklenmedi.')}>Satın Al</button>
            
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
          onAddProductSuccess={fetchProducts}
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