import { useState } from 'react'

const fallbackImage = 'https://via.placeholder.com/600x400?text=Item'

export default function ItemImageGallery({ item }) {
  const images = [...new Set([item.image, ...(Array.isArray(item.images) ? item.images : [])].filter(Boolean))]
  const galleryImages = images.length ? images : [fallbackImage]
  const [activeIndex, setActiveIndex] = useState(0)
  const showImage = (index) => setActiveIndex((index + galleryImages.length) % galleryImages.length)

  return <div className="item-image-gallery">
    <div className="item-gallery-stage">
      <img className="item-detail-image" src={galleryImages[activeIndex]} alt={`${item.name} image ${activeIndex + 1}`} onError={(event) => { event.currentTarget.src = fallbackImage }} />
      {galleryImages.length > 1 && <>
        <button type="button" className="gallery-arrow previous" onClick={() => showImage(activeIndex - 1)} aria-label="Show previous product image" title="Previous image">‹</button>
        <button type="button" className="gallery-arrow next" onClick={() => showImage(activeIndex + 1)} aria-label="Show next product image" title="Next image">›</button>
      </>}
    </div>
    {galleryImages.length > 1 && <div className="item-gallery-thumbnails" aria-label="More product images">
      {galleryImages.map((image, index) => <button type="button" key={image} className={`item-gallery-thumbnail ${index === activeIndex ? 'active' : ''}`} onClick={() => showImage(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={index === activeIndex}>
        <img src={image} alt="" onError={(event) => { event.currentTarget.src = fallbackImage }} />
      </button>)}
    </div>}
    <p className="item-gallery-status" aria-live="polite">Image {activeIndex + 1} of {galleryImages.length} · {item.name}</p>
  </div>
}