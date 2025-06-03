'use client'

import { useState } from 'react'
import styles from '../styles/gallery.module.css'

export default function GallerySection() {
  const [gallery, setGallery] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedImage(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      setMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (!selectedImage || !preview) return
    setIsUploading(true)
    setMessage('')

    setTimeout(() => {
      setGallery((prev) => [...prev, { id: Date.now(), src: preview }])
      setSelectedImage(null)
      setPreview(null)
      setIsUploading(false)
      setMessage('Image added to gallery.')
    }, 500)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this image?')) {
      setGallery(gallery.filter((item) => item.id !== id))
      setMessage('Image deleted.')
    }
  }

  return (
    <div className={styles['content-section']}>
      <h2 className={styles['section-title']}>Gallery</h2>
      <p style={{ marginBottom: '1rem', fontSize: '14px', color: '#555' }}>
        Upload one image at a time.
      </p>

      <div className={styles['contact-form']}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
        />

        {preview && (
          <div className={styles['image-preview-container']}>
            <img
              src={preview}
              alt="Preview"
              className={styles['image-preview']}
            />
          </div>
        )}

        <button
          type="button"
          className={styles.saveButton}
          onClick={handleUpload}
          disabled={isUploading || !preview}
        >
          {isUploading ? 'Uploading...' : 'Add to Gallery'}
        </button>

        {message && <p className={styles.successMessage}>{message}</p>}
      </div>

      <div className={styles.galleryGrid}>
        {gallery.length === 0 ? (
          <p>No images in the gallery yet.</p>
        ) : (
          gallery.map((item) => (
            <div key={item.id} className={styles.galleryItem}>
              <img
                src={item.src}
                alt="Gallery item"
                className={styles.galleryImage}
              />
              <button
                onClick={() => handleDelete(item.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}