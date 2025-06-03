"use client"

import { useState, useEffect } from "react"
import { useUpdateServiceMutation } from "@/rtk/serviceApi"
import styles from "../../../manage-content/content.module.css"

const ServiceItem = ({ service, isEditing, onDelete, isDeleting, refetchServices }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(service.name)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)

  const [updateService, { isLoading: isSubmitting }] = useUpdateServiceMutation()

  // Update local state when service prop changes
  useEffect(() => {
    setUpdatedName(service.name)
    setPreviewImage(null)
  }, [service])

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
      setError("Service name is required")
      return
    }

    try {
      const updateData = {
        id: service.id,
        name: updatedName,
        status: service.status || "ACTIVE",
      }

      if (imageFile) {
        // Convert image to base64
        const reader = new FileReader()
        reader.readAsDataURL(imageFile)

        reader.onload = async () => {
          updateData.image = reader.result

          try {
            await updateService(updateData).unwrap()
            if (refetchServices) await refetchServices()
            setIsUpdating(false)
          } catch (error) {
            console.error("Error updating service:", error)
            setError(`Failed to update service: ${error.message || "Unknown error"}`)
          }
        }

        reader.onerror = () => {
          setError("Failed to read the image file")
        }
      } else {
        // No new image, just update the name and status
        try {
          await updateService(updateData).unwrap()
          if (refetchServices) await refetchServices()
          setIsUpdating(false)
        } catch (error) {
          console.error("Error updating service:", error)
          setError(`Failed to update service: ${error.message || "Unknown error"}`)
        }
      }
    } catch (error) {
      console.error("Error processing update:", error)
      setError(`Failed to process update: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <div className={styles["service-item"]}>
      {isUpdating ? (
        <>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input
            type="file"
            accept="image/*"
            name={`updateImage-${service.id}`}
            id={`updateImage-${service.id}`}
            onChange={handleImageChange}
            disabled={isSubmitting}
          />

          {previewImage && (
            <div className={styles["image-preview-container"]}>
              <img src={previewImage || "/placeholder.svg"} alt="Preview" className={styles["image-preview"]} />
            </div>
          )}

          <input
            type="text"
            name={`updateName-${service.id}`}
            id={`updateName-${service.id}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
          />

          <div className={styles["button-group"]}>
            <button className={styles.cancelButton} onClick={() => setIsUpdating(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles["service-image-container"]}>
            {service.inspo ? (
              <img
                src={service.inspo || "/placeholder.svg"}
                alt={service.name}
                className={styles.serviceImage}
                onError={(e) => {
                  console.error("Image failed to load:", service.inspo)
                  e.target.src = "/placeholder.svg"
                }}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>No image available</span>
              </div>
            )}
          </div>

          <div className={styles.serviceDetails}>
            <label htmlFor="service-name" className={styles.serviceNameLabel}>
              Service Name
            </label>
            <p className={styles.serviceName}>{service.name}</p>

            {isEditing && (
              <div className={styles["service-actions"]}>
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

export default ServiceItem
