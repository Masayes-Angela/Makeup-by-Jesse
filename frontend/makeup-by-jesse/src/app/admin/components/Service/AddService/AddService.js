"use client"

import { useState } from "react"
import { useAddServiceMutation } from "@/rtk/serviceApi"
import styles from "../../../manage-content/content.module.css"

const AddService = ({ onServiceAdded }) => {
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)

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
          }).unwrap()

          // Reset form
          setName("")
          setImageFile(null)
          setPreviewImage(null)
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

      {previewImage && (
        <div className={styles["image-preview-container"]}>
          <img src={previewImage || "/placeholder.svg"} alt="Preview" className={styles["image-preview"]} />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        name="serviceImage"
        id="serviceImage"
        onChange={handleImageChange}
        disabled={isSubmitting}
      />

      <input
        type="text"
        name="serviceName"
        id="serviceName"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />

      <button className={styles.addServiceButton} type="submit" disabled={isSubmitting || !name || !imageFile}>
        {isSubmitting ? "Adding..." : "Add Service"}
      </button>
    </form>
  )
}

export default AddService
