"use client"

import { useState } from "react"
import { useAddPackageMutation } from "@/rtk/packageApi"
import styles from "../../../manage-content/content.module.css"

const AddPackage = ({ onPackageAdded }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)

  const [addPackage, { isLoading: isSubmitting }] = useAddPackageMutation()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name) {
      setError("Please provide a package name!")
      return
    }

    if (!description) {
      setError("Please provide a description!")
      return
    }

    if (!imageFile) {
      setError("Please select an image!")
      return
    }

    try {
      // Create form data
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("image", imageFile)

      const response = await addPackage(formData).unwrap()
      console.log("Package added successfully")

      // Reset form
      setName("")
      setDescription("")
      setImageFile(null)
      setPreviewImage(null)
      e.target.reset()

      // Notify parent component
      if (onPackageAdded) onPackageAdded()
    } catch (err) {
      console.error("Error adding package:", err)
      setError(`Failed to add package: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <form className={styles["add-package-form"]} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      {previewImage && (
        <div className={styles["image-preview-container"]}>
          <img src={previewImage} alt="Preview" className={styles["image-preview"]} />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        name="packageImage"
        id="packageImage"
        onChange={handleImageChange}
        disabled={isSubmitting}
      />

      <input
        type="text"
        name="packageName"
        id="packageName"
        placeholder="Package name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />

      <textarea
        name="packageDescription"
        id="packageDescription"
        placeholder="Package description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
        rows="3"
      />

      <button
        className={styles.addPackageButton}
        type="submit"
        disabled={isSubmitting || !name || !description || !imageFile}
      >
        {isSubmitting ? "Adding..." : "Add Package"}
      </button>
    </form>
  )
}

export default AddPackage
