import { useState } from 'react'
import './SellerReview.css'

function SellerReview({ seller, onClose }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: '0xabc...123',
      rating: 5,
      comment: 'Harika satıcı! Ürün açıklaması gibi geldi, çok memnunum.',
      date: '2024-10-20'
    },
    {
      id: 2,
      reviewer: '0xdef...456',
      rating: 4,
      comment: 'Güvenilir satıcı. Kargo biraz geç geldi ama ürün mükemmel.',
      date: '2024-10-18'
    },
    {
      id: 3,
      reviewer: '0xghi...789',
      rating: 5,
      comment: 'Orijinal ürün, NFT doğrulaması çok güzel bir özellik!',
      date: '2024-10-15'
    }
  ])

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })

  const [showForm, setShowForm] = useState(false)

  // Ortalama puan hesapla
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  // Yıldız render
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  // Yeni yorum ekle
  const handleSubmitReview = (e) => {
    e.preventDefault()
    
    if (newReview.comment.trim() === '') {
      alert('Lütfen yorum yazın!')
      return
    }

    const review = {
      id: reviews.length + 1,
      reviewer: '0x' + Math.random().toString(36).substring(2, 9) + '...',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 5, comment: '' })
    setShowForm(false)
    alert('Yorumunuz eklendi! 🎉')
  }

  return (
    <div className="seller-review-modal">
      <div className="review-modal-content">
        <button className="review-modal-close" onClick={onClose}>×</button>

        {/* Satıcı Bilgileri */}
        <div className="seller-info-header">
          <div className="seller-avatar">👤</div>
          <div className="seller-details">
            <h2>Satıcı Profili</h2>
            <code>{seller}</code>
            <div className="seller-stats">
              <div className="stat-item">
                <span className="stat-value">{reviews.length}</span>
                <span className="stat-label">Toplam Yorum</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{averageRating.toFixed(1)}</span>
                <span className="stat-label">Ortalama Puan</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">15</span>
                <span className="stat-label">Toplam Satış</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ortalama Puan Gösterimi */}
        <div className="rating-summary">
          <div className="rating-big">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="rating-stars-big">{renderStars(Math.round(averageRating))}</div>
            <p>{reviews.length} değerlendirme</p>
          </div>
        </div>

        {/* Yorum Ekleme Butonu */}
        {!showForm && (
          <button className="btn-add-review" onClick={() => setShowForm(true)}>
            ✍️ Yorum Yaz
          </button>
        )}

        {/* Yorum Ekleme Formu */}
        {showForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Yeni Yorum Ekle</h3>
            
            <div className="form-group">
              <label>Puanınız:</label>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${newReview.rating >= star ? 'selected' : ''}`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Yorumunuz:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Satıcı hakkındaki deneyiminizi paylaşın..."
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                İptal
              </button>
              <button type="submit" className="btn-submit">
                Gönder
              </button>
            </div>
          </form>
        )}

        {/* Yorumlar Listesi */}
        <div className="reviews-list">
          <h3>📝 Yorumlar ({reviews.length})</h3>
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-avatar">👤</span>
                  <div>
                    <code className="reviewer-address">{review.reviewer}</code>
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellerReview