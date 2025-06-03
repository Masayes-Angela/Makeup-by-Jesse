'use client'

import { useState } from 'react'
import styles from '../styles/aboutme.module.css'

export default function AboutSection() {
  const [aboutInfo, setAboutInfo] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    profession: '',
    description: '',
  })
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    setTimeout(() => {
      setAboutInfo(formData)
      setIsSaving(false)
      setIsEditing(false)
      setMessage('Information saved successfully!')
    }, 500)
  }

  const handleEdit = () => {
    setFormData(aboutInfo)
    setIsEditing(true)
    setMessage('')
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your About Me info?')) {
      setAboutInfo(null)
      setFormData({ firstName: '', profession: '', description: '' })
      setIsEditing(true)
      setMessage('Information deleted.')
    }
  }

  return (
    <div className={styles['content-section']}>
      <h2 className={styles['section-title']}>About Me</h2>

      {isEditing ? (
        <form className={styles['contact-form']} onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            placeholder="Enter your profession"
            value={formData.profession}
            onChange={handleChange}
          />

          <label htmlFor="description">Short Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Write something about yourself..."
            value={formData.description}
            onChange={handleChange}
          />

          <button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Info'}
          </button>
        </form>
      ) : aboutInfo ? (
        <div className={styles['about-view']}>
          <p><strong>Name:</strong> {aboutInfo.firstName}</p>
          <p><strong>Profession:</strong> {aboutInfo.profession}</p>
          <p><strong>Description:</strong><br />{aboutInfo.description}</p>

          <div className={styles['update-actions']}>
            <button onClick={handleEdit} className={styles.editButton}>Edit</button>
            <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
          </div>
        </div>
      ) : (
        <p>No information saved yet.</p>
      )}

      {message && <p className={styles.successMessage}>{message}</p>}
    </div>
  )
}