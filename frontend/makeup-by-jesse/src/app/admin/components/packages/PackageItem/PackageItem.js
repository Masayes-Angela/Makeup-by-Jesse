"use client"

import { useState, useEffect } from "react"
import { useUpdatePackageMutation, useDeletePackageMutation } from "@/rtk/packageApi"
import styles from "../../../manage-content/styles/servicesandpackages.module.css"

const PackageItem = ({ package: pkg, isEditing, refetchPackages }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(pkg.name)
  const [updatedDescription, setUpdatedDescription] = useState(pkg.description)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [updatePackage, { isLoading: isSubmitting }] = useUpdatePackageMutation()
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation()

  useEffect(() => {
    setUpdatedName(pkg.name)
    setUpdatedDescription(pkg.description)
    setPreviewImage(null)
  }, [pkg])

  useEffect(() => {
    if (isUpdating && pkg.image_url) {
      setPreviewImage(`http://localhost:8080${pkg.image_url}`)
    }
  }, [isUpdating, pkg.image_url])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setError(null)

    if (!updatedName || !updatedDescription) {
      setError("All fields are required.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", updatedName)
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

  const handleDeleteConfirmed = async () => {
    try {
      await deletePackage(pkg.id).unwrap()
      if (refetchPackages) await refetchPackages()
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Something went wrong while deleting.")
      setShowDeleteModal(false)
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
            className={styles.fileInput}
          />

          {previewImage && (
            <div className={styles["image-preview-container"]}>
              <img src={previewImage || "/placeholder.svg"} alt="Preview" className={styles["image-preview"]} />
            </div>
          )}

          <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px" }}>Package Name</div>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Package name"
            className={styles.packageName}
          />

          <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>Description</div>
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            disabled={isSubmitting}
            placeholder="Description"
            rows="3"
            className={styles.packageDescription}
          />

          <div className={styles["update-actions"]}>
            <button
              style={{
                padding: "8px 24px",
                backgroundColor: "transparent",
                color: "#1e1b4b",
                border: "2px solid #1e1b4b",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
                fontWeight: "600",
              }}
              onClick={() => setIsUpdating(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "8px 24px",
                backgroundColor: "#1e1b4b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles["package-image-container"]}>
            {pkg.image_url ? (
              <img
                src={`http://localhost:8080${pkg.image_url}`}
                alt={pkg.name}
                className={styles.packageImage}
                onError={(e) => {
                  console.error("Image failed to load:", pkg.image_url)
                  e.target.src = "/placeholder.svg"
                  e.target.onerror = null
                }}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>No image available</span>
              </div>
            )}
          </div>
          <div className={styles.packageDetails}>
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px" }}>Package Name</div>
            <div className={styles.packageName}>{pkg.name}</div>

            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>Description</div>
            <div className={styles.packageDescription}>{pkg.description}</div>

            {isEditing && (
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "#1e1b4b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsUpdating(true)}
                >
                  Update
                </button>
                <button
                  style={{
                    padding: "8px 24px",
                    backgroundColor: "#1e1b4b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Are you sure you want to delete?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                style={{
                  backgroundColor: "#282C4B",
                  color: "white",
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "500",
                  fontFamily: "Roboto",
                  letterSpacing: ".6px",
                  cursor: "pointer",
                }}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  backgroundColor: "#e9e7ee",
                  color: "#282C4B",
                  padding: "8px 20px",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "500",
                  fontFamily: "Roboto",
                  letterSpacing: ".6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PackageItem