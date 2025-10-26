import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { QrReader } from 'react-qr-reader'
import './QRScanner.css'

function QRScanner({ onClose, onScanSuccess, productData, mode }) {
  const [scanMode, setScanMode] = useState(mode || 'scan') // 'scan' or 'generate'
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState(null)

  // QR Okuma işlemi
  const handleScan = (result, error) => {
    if (result) {
      try {
        const data = JSON.parse(result?.text)
        setScanResult(data)
        setError(null)
        
        // Başarılı okuma bildirimi
        setTimeout(() => {
          if (onScanSuccess) {
            onScanSuccess(data)
          }
        }, 1000)
      } catch (e) {
        setError('Geçersiz QR kod formatı!')
      }
    }
    
    if (error) {
      // Sürekli hata gösterme
      console.info(error)
    }
  }

  // QR için ürün datasını hazırla
  const generateQRData = () => {
    if (!productData) return null
    
    return JSON.stringify({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      category: productData.category,
      seller: productData.seller,
      isAuthentic: productData.isAuthentic,
      nftId: productData.id,
      timestamp: new Date().toISOString()
    })
  }

  // QR datayı indirme
  const downloadQR = () => {
    const canvas = document.querySelector('canvas')
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `nft-${productData.name}-qr.png`
    link.href = url
    link.click()
  }

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-content">
        <button className="qr-close" onClick={onClose}>×</button>

        {/* Header */}
        <div className="qr-header">
          <h2>
            {scanMode === 'scan' ? '📷 QR Kod Oku' : '🎯 QR Kod Oluştur'}
          </h2>
          <p className="qr-subtitle">
            {scanMode === 'scan' 
              ? 'Kamera ile QR kodu okutun ve ürün bilgilerini görün'
              : 'Ürününüz için benzersiz QR kod'}
          </p>
        </div>

        {/* Mode Switch */}
        <div className="mode-switch">
          <button 
            className={`mode-btn ${scanMode === 'scan' ? 'active' : ''}`}
            onClick={() => setScanMode('scan')}
          >
            📷 QR Oku
          </button>
          <button 
            className={`mode-btn ${scanMode === 'generate' ? 'active' : ''}`}
            onClick={() => setScanMode('generate')}
            disabled={!productData}
          >
            🎯 QR Oluştur
          </button>
        </div>

        {/* QR Scanner Mode */}
        {/* QR Scanner Mode */}
        {scanMode === 'scan' && (
          <div className="scanner-container">
            {!scanResult && (
              <div className="camera-frame">
                <QrReader
                  onResult={handleScan}
                  constraints={{ facingMode: 'environment' }}
                  containerStyle={{ width: '100%' }}
                  videoContainerStyle={{ paddingTop: '100%' }}
                />
              </div>
            )}

            {error && (
              <div className="scan-error">
                ⚠️ {error}
              </div>
            )}

            {scanResult && (
              <div className="scan-result">
                <h3>✅ QR Kod Okundu!</h3>
                <div className="result-info">
                  <div className="result-row">
                    <span className="label">Ürün:</span>
                    <span className="value">{scanResult.name}</span>
                  </div>
                  <div className="result-row">
                    <span className="label">Fiyat:</span>
                    <span className="value">{scanResult.price}</span>
                  </div>
                  <div className="result-row">
                    <span className="label">Kategori:</span>
                    <span className="value">{scanResult.category}</span>
                  </div>
                  <div className="result-row">
                    <span className="label">NFT ID:</span>
                    <span className="value">#{scanResult.nftId}</span>
                  </div>
                  <div className="result-row">
                    <span className="label">Durum:</span>
                    <span className="value authentic">
                      {scanResult.isAuthentic ? '✓ Orijinal NFT' : '⚠ Doğrulanmamış'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="scan-instructions">
              <p>💡 <strong>Nasıl kullanılır?</strong></p>
              <ul>
                <li>Kameraya izin verin</li>
                <li>QR kodu çerçeveye hizalayın</li>
                <li>Otomatik olarak taranacak</li>
              </ul>
            </div>
          </div>
        )}
        {/* QR Generator Mode */}
        {scanMode === 'generate' && productData && (
          <div className="generator-container">
            <div className="qr-display">
              <QRCodeCanvas 
                value={generateQRData()}
                size={300}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23667eea'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="qr-product-info">
              <h3>🔗 NFT Bilgileri</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Ürün Adı</span>
                  <span className="info-value">{productData.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fiyat</span>
                  <span className="info-value">{productData.price}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Kategori</span>
                  <span className="info-value">{productData.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">NFT ID</span>
                  <span className="info-value">#{productData.id}</span>
                </div>
              </div>
            </div>

            <button className="btn-download-qr" onClick={downloadQR}>
              📥 QR Kodunu İndir
            </button>

            <div className="qr-usage-info">
              <p>💡 <strong>Bu QR kodu ile:</strong></p>
              <ul>
                <li>Ürün orijinalliğini doğrulayabilirsiniz</li>
                <li>NFT bilgilerine hızlıca erişebilirsiniz</li>
                <li>Blockchain üzerindeki kayıtları görebilirsiniz</li>
              </ul>
            </div>
          </div>
        )}

        {/* No Product Data */}
        {scanMode === 'generate' && !productData && (
          <div className="no-data">
            <p>⚠️ QR kod oluşturmak için bir ürün seçmelisiniz.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRScanner