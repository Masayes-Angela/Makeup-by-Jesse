"use client"

import { useState, useEffect } from "react"
import { useUpdateServiceMutation } from "@/rtk/serviceApi"
import styles from "../../../manage-content/styles/servicesandpackages.module.css"

const ServiceItem = ({ service, isEditing, onDelete, isDeleting, refetchServices }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(service.name)
  const [updatedDescription, setUpdatedDescription] = useState(service.description || "")
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)

  const [updateService, { isLoading: isSubmitting }] = useUpdateServiceMutation()

  // Update local state when service prop changes
  useEffect(() => {
    setUpdatedName(service.name)
    setUpdatedDescription(service.description || "")
    setPreviewImage(null)
  }, [service])

  // Set preview image when entering update mode
  useEffect(() => {
    if (isUpdating && service.inspo) {
      setPreviewImage(service.inspo)
    }
  }, [isUpdating, service.inspo])

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
        description: updatedDescription,
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
        <div className={styles["service-update-form"]}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input
            type="file"
            accept="image/*"
            name={`updateImage-${service.id}`}
            id={`updateImage-${service.id}`}
            onChange={handleImageChange}
            disabled={isSubmitting}
            className={styles.fileInput}
          />

          {previewImage && (
            <div className={styles["image-preview-container"]}>
              <img src={previewImage || "/placeholder.svg"} alt="Preview" className={styles["image-preview"]} />
            </div>
          )}

          <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px" }}>Service Name</div>
          <input
            type="text"
            name={`updateName-${service.id}`}
            id={`updateName-${service.id}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Service name"
            className={styles.serviceName}
          />

          <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>Description</div>
          <textarea
            name={`updateDescription-${service.id}`}
            id={`updateDescription-${service.id}`}
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Service description"
            disabled={isSubmitting}
            rows="3"
            className={styles.serviceDescription}
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
            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px" }}>Service Name</div>
            <div className={styles.serviceName}>{service.name}</div>

            <div style={{ color: "#6B7280", fontSize: "16px", marginBottom: "8px", marginTop: "16px" }}>
              Description
            </div>
            <div className={styles.serviceDescription}>{service.description || "No description available"}</div>

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
                  onClick={onDelete}
                  disabled={isDeleting}
                >
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
