"use client"

import { useState } from "react"
import { useAddServiceMutation } from "@/rtk/serviceApi"
import styles from "../../../manage-content/styles/servicesandpackages.module.css"

const AddService = ({ onServiceAdded }) => {
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)
  const [description, setDescription] = useState("")

  const [addService, { isLoading: isSubmitting }] = useAddServiceMutation()

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
      setError("Please provide a service name!")
      return
    }

    if (!imageFile) {
      setError("Please select an image!")
      return
    }

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(imageFile)

      reader.onload = async () => {
        const base64Image = reader.result

        try {
          await addService({
            name,
            image: base64Image,
            description,
          }).unwrap()

          // Reset form
          setName("")
          setImageFile(null)
          setPreviewImage(null)
          setDescription("")
          e.target.reset()

          // Notify parent component
          if (onServiceAdded) onServiceAdded()
        } catch (err) {
          console.error("Error adding service:", err)
          setError(`Failed to add service: ${err.message || "Unknown error"}`)
        }
      }

      reader.onerror = (err) => {
        setError("Failed to read the image file")
        console.error("Reader error:", err)
      }
    } catch (err) {
      console.error("Error processing image:", err)
      setError(`Failed to process image: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <form className={styles["add-service-form"]} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles["service-update-form"]}>
        <input
          type="file"
          accept="image/*"
          name="serviceImage"
          id="serviceImage"
          onChange={handleImageChange}
          disabled={isSubmitting}
          className={styles.fileInput}
        />

        {previewImage && (
          <div className={styles["image-preview-container"]}>
            <img src={previewImage || "/placeholder.svg"} alt="Preview" className={styles["image-preview"]} />
          </div>
        )}

        <div style={{ color: "#6B7280", fontSize: "14px" }}>Service Name</div>
        <input
          type="text"
          name="serviceName"
          id="serviceName"
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className={styles.serviceName}
        />

        <div style={{ color: "#6B7280", fontSize: "14px" }}>Description</div>
        <textarea
          name="serviceDescription"
          id="serviceDescription"
          placeholder="Service description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows="3"
          className={styles.serviceDescription}
        />

        <button
          className={styles.addServiceButton}
          type="submit"
          disabled={isSubmitting || !name || !imageFile}
          style={{
            padding: "8px 24px",
            backgroundColor: "#1e1b4b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "10px",
          }}
        >
          {isSubmitting ? "Adding..." : "Add Service"}
        </button>
      </div>
    </form>
  )
}

export default AddService
