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

  // Use RTK Query hooks
  const { data: services = [], isLoading, isError, refetch } = useGetServicesQuery()
  const [addService] = useAddServiceMutation()
  const [updateService] = useUpdateServiceMutation()
  const [deleteService] = useDeleteServiceMutation()

  const handleAdd = async (newService) => {
    try {
      await addService({
        service_name: newService.name,
        image: newService.image,
      })
      // The services list will automatically update due to RTK Query cache invalidation
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
    } catch (error) {
      console.error("Failed to update service:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteService(id)
      } catch (error) {
        console.error("Failed to delete service:", error)
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
                {services.map((service) => (
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
                  />
                ))}
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !image) {
      alert("Please provide both name and image!")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onAdd({ name, image: reader.result })
      setName("")
      setImage(null)
      e.target.reset()
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
      />
      <input
        type="text"
        name="serviceName"
        id="serviceName"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className={styles.addServiceButton} type="submit">
        Add Service
      </button>
    </form>
  )
}

const ServiceItem = ({ service, isEditing, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(service.name)
  const [updatedImage, setUpdatedImage] = useState(service.image)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUpdatedImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onUpdate({ name: updatedName, image: updatedImage })
    setIsUpdating(false)
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
          />
          <input
            type="text"
            name={`updateName-${service.id}`}
            id={`updateName-${service.id}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
          <button className={styles.cancelButton} onClick={() => setIsUpdating(false)}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
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
                <button className={styles.deleteButton} onClick={() => onDelete()}>
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
