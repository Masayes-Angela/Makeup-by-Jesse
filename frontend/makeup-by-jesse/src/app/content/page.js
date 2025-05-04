"use client"

import { useState } from "react"
import styles from "./content.module.css"
import { FaEdit } from "react-icons/fa"
import {
  useGetServicesQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "@/rtk/serviceApi"

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

const ManageWebsite = () => {
  const [activeTab, setActiveTab] = useState("services")
  const [isEditing, setIsEditing] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null })

  // Use RTK Query hooks with refetch capability
  const {
    data: services = [],
    isLoading,
    isError,
    refetch,
  } = useGetServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [addService] = useAddServiceMutation()
  const [updateService] = useUpdateServiceMutation()
  const [deleteService] = useDeleteServiceMutation()

  const handleAdd = async (newService) => {
    try {
      await addService({
        service_name: newService.name,
        image: newService.image,
      })
      refetch()
    } catch (error) {
      console.error("Failed to add service:", error)
    }
  }

  const handleUpdate = async (id, updatedService) => {
    try {
      await updateService({
        id,
        service_name: updatedService.name,
        image: updatedService.image,
      })
      refetch()
    } catch (error) {
      console.error("Failed to update service:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        setDeleteStatus({ loading: true, error: null })
        console.log("Deleting service with ID:", id) // Debug log

        // Call the delete mutation with the ID
        const response = await deleteService(id).unwrap()
        console.log("Delete response:", response) // Debug log

        // Explicitly refetch to update the UI
        await refetch()
        setDeleteStatus({ loading: false, error: null })
      } catch (error) {
        console.error("Failed to delete service:", error)
        setDeleteStatus({ loading: false, error: error.message || "Failed to delete service" })
        alert(`Error deleting service: ${error.message || "Unknown error"}`)
      }
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return (
          <div className={styles["services-container"]}>
            <div className={styles["services-header"]}>
              <div>
                {isEditing ? (
                  <>
                    <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button className={styles.saveButton} onClick={() => setIsEditing(false)}>
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                    <span className={styles.buttonText}>Edit</span>
                    <span className={styles.iconWrapper}>
                      <FaEdit />
                    </span>
                  </button>
                )}
              </div>
            </div>

            {isEditing && <AddServiceForm onAdd={handleAdd} />}

            {isLoading ? (
              <p>Loading services...</p>
            ) : isError ? (
              <div>
                <p>Error loading services</p>
                <button onClick={refetch}>Try Again</button>
              </div>
            ) : (
              <div className={styles["services-list"]}>
                {services.length === 0 ? (
                  <p>No services found. Add a service to get started.</p>
                ) : (
                  services.map((service) => (
                    <ServiceItem
                      key={service.id}
                      service={{
                        id: service.id,
                        name: service.service_name,
                        image: service.inspo,
                      }}
                      isEditing={isEditing}
                      onUpdate={(updatedService) => handleUpdate(service.id, updatedService)}
                      onDelete={() => handleDelete(service.id)}
                      deleteStatus={deleteStatus}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )
      case "about":
        return <p>Content for About Me goes here.</p>
      case "gallery":
        return <p>Content for Gallery goes here.</p>
      case "reviews":
        return <p>Content for Reviews goes here.</p>
      default:
        return <p>Select a tab to view content.</p>
    }
  }

  return (
    <div className={styles["manage-website"]}>
      <div className={styles.container}>
        <div className={styles["icon-container"]}>
          <FaEdit />
        </div>
        <h1>Manage Website Content</h1>
      </div>

      <nav className={styles["mw-nav"]}>
        <button onClick={() => setActiveTab("services")} className={activeTab === "services" ? styles.active : ""}>
          Services
        </button>
        <button onClick={() => setActiveTab("about")} className={activeTab === "about" ? styles.active : ""}>
          About Me
        </button>
        <button onClick={() => setActiveTab("gallery")} className={activeTab === "gallery" ? styles.active : ""}>
          Gallery
        </button>
        <button onClick={() => setActiveTab("reviews")} className={activeTab === "reviews" ? styles.active : ""}>
          Reviews
        </button>
      </nav>

      <div className={styles["tab-content-container"]}>{renderTabContent()}</div>
    </div>
  )
}

export default ManageWebsite

// Components

const AddServiceForm = ({ onAdd }) => {
  const [name, setName] = useState("")
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !image) {
      alert("Please provide both name and image!")
      return
    }

    setIsSubmitting(true)
    const reader = new FileReader()
    reader.onload = () => {
      onAdd({ name, image: reader.result })
      setName("")
      setImage(null)
      e.target.reset()
      setIsSubmitting(false)
    }
    reader.readAsDataURL(image)
  }

  return (
    <form className={styles["add-service-form"]} onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        name="serviceImage"
        id="serviceImage"
        onChange={(e) => setImage(e.target.files[0])}
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
      <button className={styles.addServiceButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Service"}
      </button>
    </form>
  )
}

const ServiceItem = ({ service, isEditing, onUpdate, onDelete, deleteStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(service.name)
  const [updatedImage, setUpdatedImage] = useState(service.image)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update local state when service prop changes
  useState(() => {
    setUpdatedName(service.name)
    setUpdatedImage(service.image)
  }, [service])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUpdatedImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setIsSubmitting(true)
    onUpdate({ name: updatedName, image: updatedImage })
      .then(() => {
        setIsUpdating(false)
        setIsSubmitting(false)
      })
      .catch((error) => {
        console.error("Error updating service:", error)
        setIsSubmitting(false)
        alert("Failed to update service. Please try again.")
      })
  }

  return (
    <div className={styles["service-item"]}>
      {isUpdating ? (
        <>
          <input
            type="file"
            name={`updateImage-${service.id}`}
            id={`updateImage-${service.id}`}
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          <input
            type="text"
            name={`updateName-${service.id}`}
            id={`updateName-${service.id}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
          />
          <button className={styles.cancelButton} onClick={() => setIsUpdating(false)} disabled={isSubmitting}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </>
      ) : (
        <>
          <img src={service.image || "/placeholder.svg"} alt={service.name} />
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
                <button className={styles.deleteButton} onClick={onDelete} disabled={deleteStatus?.loading}>
                  {deleteStatus?.loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
