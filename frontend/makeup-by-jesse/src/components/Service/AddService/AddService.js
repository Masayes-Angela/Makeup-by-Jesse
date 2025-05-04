"use client"

import { useState } from "react"
import { useAddServiceMutation } from "@/rtk/serviceApi"

const AddServiceForm = () => {
  const [name, setName] = useState("")
  const [image, setImage] = useState(null)
  const [addService, { isLoading }] = useAddServiceMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !image) {
      alert("Please provide both name and image!")
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        await addService({
          service_name: name,
          image: reader.result,
        })

        // Reset form after successful submission
        setName("")
        setImage(null)
        e.target.reset()
        alert("Service added successfully!")
      } catch (error) {
        console.error("Error adding service:", error)
        alert("Failed to add service. Please try again.")
      }
    }

    reader.readAsDataURL(image)
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
  }

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  }

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }

  const buttonHoverStyle = {
    backgroundColor: "#45a049",
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={inputStyle}
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        disabled={isLoading}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Service"}
      </button>
    </form>
  )
}

export default AddServiceForm
