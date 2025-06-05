'use client'

import { useEffect, useState, useRef } from 'react'
import styles from '../styles/gallery.module.css'
import { BiSolidEditAlt } from 'react-icons/bi'

export default function GallerySection() {
  const [gallery, setGallery] = useState([])
  const [editGallery, setEditGallery] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [imageToDelete, setImageToDelete] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage('')
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [message])

  const askDelete = (id) => {
    setImageToDelete(id)
  }

  const confirmDelete = () => {
    setEditGallery(editGallery.filter((item) => item.id !== imageToDelete))
    setMessage('Image removed.')
    setImageToDelete(null)
  }

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
      const newImage = { id: Date.now(), src: preview }
      setEditGallery((prev) => [...prev, newImage])
      setSelectedImage(null)
      setPreview(null)
      setIsUploading(false)
      setMessage('Image added.')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 500)
  }

  const startEditing = () => {
    setEditGallery([...gallery])
    setIsEditing(true)
    setMessage('')
  }

  const cancelEditing = () => {
    setEditGallery([])
    setSelectedImage(null)
    setPreview(null)
    setIsEditing(false)
    setMessage('Changes canceled.')
  }

  const saveChanges = () => {
    setGallery([...editGallery])
    setEditGallery([])
    setIsEditing(false)
    setMessage('Changes saved successfully.')
  }

  const displayGallery = isEditing ? editGallery : gallery

  return (
    <div className={styles['content-section']}>
      <div className={styles.sectionHeader}>
        <h2 className={styles['section-title']}>Gallery</h2>
        {!isEditing ? (
          <button className={styles.editButton} onClick={startEditing}>
            <span className={styles.buttonText}>Edit</span>
            <span className={styles.iconWrapper}><BiSolidEditAlt /></span>
          </button>
        ) : (
          <div className={styles.editActions}>
            <button className={styles.cancelButton} onClick={cancelEditing}>Cancel</button>
            <button className={styles.saveButton} onClick={saveChanges}>Save Changes</button>
          </div>
        )}
      </div>

      {isEditing && (
        <>
          <p style={{ marginBottom: '4rem', fontSize: '14px', color: '#555' }}>
            Upload one image at a time.
          </p>

          <div className={styles['contact-form']}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              ref={fileInputRef}
            />

            {preview && (
              <div className={styles['image-preview-container']}>
                <img src={preview} alt="Preview" className={styles['image-preview']} />
              </div>
            )}

            <button
              type="button"
              className={styles.uploadButton}
              onClick={handleUpload}
              disabled={isUploading || !preview}
            >
              {isUploading ? 'Uploading...' : 'Add to Gallery'}
            </button>
          </div>
        </>
      )}

      {message && <p className={styles.successMessage}>{message}</p>}

      <div className={styles.galleryGrid}>
        {displayGallery.length === 0 ? (
          <p>No images in the gallery yet.</p>
        ) : (
          displayGallery.map((item) => (
            <div key={item.id} className={styles.galleryItem}>
              <img src={item.src} alt="Gallery item" className={styles.galleryImage} />
              {isEditing && (
                <button
                  onClick={() => askDelete(item.id)}
                  className={styles.deleteButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {imageToDelete !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to delete this image?</p>
            <div className={styles.modalActions}>
              <button onClick={confirmDelete} className={styles.confirmBtn}>Yes</button>
              <button onClick={() => setImageToDelete(null)} className={styles.cancelBtn}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}