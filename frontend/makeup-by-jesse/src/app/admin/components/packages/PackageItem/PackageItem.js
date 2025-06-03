"use client"

import { useState, useEffect } from "react"
import { useUpdatePackageMutation } from "@/rtk/packageApi"
import styles from "../../../content/content.module.css"

const PackageItem = ({ package: pkg, isEditing, onDelete, isDeleting, refetchPackages }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(pkg.name)
  const [updatedPrice, setUpdatedPrice] = useState(pkg.price)
  const [updatedDescription, setUpdatedDescription] = useState(pkg.description)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)

  const [updatePackage, { isLoading: isSubmitting }] = useUpdatePackageMutation()

  // Update local state when package prop changes
  useEffect(() => {
    setUpdatedName(pkg.name)
    setUpdatedPrice(pkg.price)
    setUpdatedDescription(pkg.description)
    setPreviewImage(null)
  }, [pkg])

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

  const handleSave = async () => {
    setError(null)

    if (!updatedName) {
      setError("Package name is required")
      return
    }

    if (!updatedPrice) {
      setError("Price is required")
      return
    }

    if (!updatedDescription) {
      setError("Description is required")
      return
    }

    try {
      // Create form data
      const formData = new FormData()
      formData.append("name", updatedName)
      formData.append("price", updatedPrice)
      formData.append("description", updatedDescription)
      formData.append("status", pkg.status || "ACTIVE")
      
      if (imageFile) {
        formData.append("image", imageFile)
      }

      await updatePackage({ id: pkg.id, formData }).unwrap()
      if (refetchPackages) await refetchPackages()
      setIsUpdating(false)
    } catch (error) {
      console.error("Error updating package:", error)
      setError(`Failed to update package: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <div className={styles["package-item"]}>
      {isUpdating ? (
        <div className={styles["package-update-form"]}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input
            type="file"
            accept="image/*"
            name={`updateImage-${pkg.id}`}
            id={`updateImage-${pkg.id}`}
            onChange={handleImageChange}
            disabled={isSubmitting}
          />

          {previewImage && (
            <div className={styles["image-preview-container"]}>
              <img src={previewImage} alt="Preview" className={styles["image-preview"]} />
            </div>
          )}

          <input
            type="text"
            name={`updateName-${pkg.id}`}
            id={`updateName-${pkg.id}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Package name"
          />

          <input
            type="number"
            name={`updatePrice-${pkg.id}`}
            id={`updatePrice-${pkg.id}`}
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            disabled={isSubmitting}
            placeholder="Price"
            min="0"
            step="0.01"
          />

          <textarea
            name={`updateDescription-${pkg.id}`}
            id={`updateDescription-${pkg.id}`}
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            disabled={isSubmitting}
            placeholder="Description"
            rows="3"
          />

          <div className={styles["update-actions"]}>
            <button className={styles.cancelButton} onClick={() => setIsUpdating(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles["service-image-container"]}>
            {pkg.image_url ? (
              <img
                src={`http://localhost:8080${pkg.image_url}`}
                alt={pkg.name}
                className={styles.packageImage}
                onError={(e) => {
                  console.error("Image failed to load:", pkg.image_url)
                  e.target.src = "/images/placeholder-package.jpg"
                  e.target.onerror = null // Prevent infinite error loop
                }}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>No image available</span>
              </div>
            )}
          </div>
          <div className={styles.packageDetails}>
            <h3 className={styles.packageName}>{pkg.name}</h3>
            <div className={styles.packagePrice}>₱{Number.parseFloat(pkg.price).toFixed(2)}</div>
            <p className={styles.packageDescription}>{pkg.description}</p>

            {isEditing && (
              <div className={styles["package-actions"]}>
                <button className={styles.updateButton} onClick={() => setIsUpdating(true)}>
                  Update
                </button>
                <button className={styles.deleteButton} onClick={onDelete} disabled={isDeleting}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PackageItem
