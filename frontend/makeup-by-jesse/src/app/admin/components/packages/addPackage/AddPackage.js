"use client"

import { useState } from "react"
import styles from "./addPackage.module.css"

const AddPackageForm = ({ onAdd }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !price || !description || !image) {
      alert("Please fill in all fields!")
      return
    }

    setIsSubmitting(true)
    const reader = new FileReader()
    reader.onload = () => {
      onAdd({
        name,
        price: Number.parseFloat(price),
        description,
        image: reader.result,
      })
      setName("")
      setPrice("")
      setDescription("")
      setImage(null)
      e.target.reset()
      setIsSubmitting(false)
    }
    reader.readAsDataURL(image)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="packageImage" className={styles.label}>
          Package Image
        </label>
        <input
          type="file"
          accept="image/*"
          name="packageImage"
          id="packageImage"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={isSubmitting}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="packageName" className={styles.label}>
          Package Name
        </label>
        <input
          type="text"
          name="packageName"
          id="packageName"
          placeholder="Enter package name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className={styles.textInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="packagePrice" className={styles.label}>
          Price ($)
        </label>
        <input
          type="number"
          name="packagePrice"
          id="packagePrice"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={isSubmitting}
          min="0"
          step="0.01"
          className={styles.textInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="packageDescription" className={styles.label}>
          Description
        </label>
        <textarea
          name="packageDescription"
          id="packageDescription"
          placeholder="Enter package description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows="3"
          className={styles.textarea}
        />
      </div>

      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Package"}
      </button>
    </form>
  )
}

export default AddPackageForm
