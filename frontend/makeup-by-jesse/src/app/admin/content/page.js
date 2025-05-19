"use client"

import { useState } from "react"
import styles from "./content.module.css"
import { FaEdit } from "react-icons/fa"
import { AddService, ServiceList } from "../components/Service"
import { useGetServicesQuery } from "@/rtk/serviceApi"

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
  const [isEditingPackages, setIsEditingPackages] = useState(false)

  // Dummy packages data for initial UI
  const [packages, setPackages] = useState([])

  // Use RTK Query hook for services
  const { refetch: refetchServices } = useGetServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  // Package handlers (temporary implementation until we connect to backend)
  const handleAddPackage = (newPackage) => {
    setPackages([...packages, { ...newPackage, id: Date.now() }])
  }

  const handleUpdatePackage = (id, updatedPackage) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...updatedPackage, id } : pkg)))
  }

  const handleDeletePackage = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter((pkg) => pkg.id !== id))
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return (
          <div className={styles["services-packages-container"]}>
            {/* Services Section */}
            <div className={styles["content-section"]}>
              <div className={styles["services-header"]}>
                <h2 className={styles["section-title"]}>Services</h2>
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

              {isEditing && <AddService onServiceAdded={refetchServices} />}
              <ServiceList isEditing={isEditing} refetchServices={refetchServices} />
            </div>

            {/* Packages Section */}
            <div className={styles["content-section"]}>
              <div className={styles["services-header"]}>
                <h2 className={styles["section-title"]}>Packages</h2>
                <div>
                  {isEditingPackages ? (
                    <>
                      <button className={styles.cancelButton} onClick={() => setIsEditingPackages(false)}>
                        Cancel
                      </button>
                      <button className={styles.saveButton} onClick={() => setIsEditingPackages(false)}>
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button className={styles.editButton} onClick={() => setIsEditingPackages(true)}>
                      <span className={styles.buttonText}>Edit</span>
                      <span className={styles.iconWrapper}>
                        <FaEdit />
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {isEditingPackages && <AddPackageForm onAdd={handleAddPackage} />}

              <div className={styles["services-scroll-container"]}>
                <div className={styles["services-list"]}>
                  {packages.length === 0 ? (
                    <p>No packages found. Add a package to get started.</p>
                  ) : (
                    packages.map((pkg) => (
                      <PackageItem
                        key={pkg.id}
                        package={pkg}
                        isEditing={isEditingPackages}
                        onUpdate={(updatedPackage) => handleUpdatePackage(pkg.id, updatedPackage)}
                        onDelete={(updatedPackage) => handleDeletePackage(pkg.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case "about":
        return (
          <div className={styles["content-section"]}>
            <p>Content for About Me goes here.</p>
          </div>
        )
      case "gallery":
        return (
          <div className={styles["content-section"]}>
            <p>Content for Gallery goes here.</p>
          </div>
        )
      case "reviews":
        return (
          <div className={styles["content-section"]}>
            <p>Content for Reviews goes here.</p>
          </div>
        )
      default:
        return (
          <div className={styles["content-section"]}>
            <p>Select a tab to view content.</p>
          </div>
        )
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
          Services & Packages
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

const AddPackageForm = ({ onAdd }) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !price || !description || !image) {
      alert("Please fill in all fields!")
      return
    }

    setIsSubmitting(true)
    const reader = new FileReader()
    reader.onload = () => {
      onAdd({
        name,
        price: Number.parseFloat(price),
        description,
        image: reader.result,
      })
      setName("")
      setPrice("")
      setDescription("")
      setImage(null)
      e.target.reset()
      setIsSubmitting(false)
    }
    reader.readAsDataURL(image)
  }

  return (
    <form className={styles["add-package-form"]} onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        name="packageImage"
        id="packageImage"
        onChange={(e) => setImage(e.target.files[0])}
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
      <label htmlFor="packagePrice" className={styles.label}>
        Price (₱)
      </label>
      <input
        type="number"
        name="packagePrice"
        id="packagePrice"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={isSubmitting}
        min="0"
        step="0.01"
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
      <button className={styles.addPackageButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Package"}
      </button>
    </form>
  )
}

const PackageItem = ({ package: pkg, isEditing, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(pkg.name)
  const [updatedPrice, setUpdatedPrice] = useState(pkg.price)
  const [updatedDescription, setUpdatedDescription] = useState(pkg.description)
  const [updatedImage, setUpdatedImage] = useState(pkg.image)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update local state when package prop changes
  useState(() => {
    setUpdatedName(pkg.name)
    setUpdatedPrice(pkg.price)
    setUpdatedDescription(pkg.description)
    setUpdatedImage(pkg.image)
  }, [pkg])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUpdatedImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setIsSubmitting(true)
    onUpdate({
      name: updatedName,
      price: Number.parseFloat(updatedPrice),
      description: updatedDescription,
      image: updatedImage,
    })
    setIsUpdating(false)
    setIsSubmitting(false)
  }

  return (
    <div className={styles["package-item"]}>
      {isUpdating ? (
        <div className={styles["package-update-form"]}>
          <input
            type="file"
            accept="image/*"
            name={`updatePackageImage-${pkg.id}`}
            id={`updatePackageImage-${pkg.id}`}
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          <input
            type="text"
            name={`updatePackageName-${pkg.id}`}
            id={`updatePackageName-${pkg.id}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Package name"
          />
          <input
            type="number"
            name={`updatePackagePrice-${pkg.id}`}
            id={`updatePackagePrice-${pkg.id}`}
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            disabled={isSubmitting}
            placeholder="Price"
            min="0"
            step="0.01"
          />
          <textarea
            name={`updatePackageDescription-${pkg.id}`}
            id={`updatePackageDescription-${pkg.id}`}
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
          <img src={pkg.image || "/placeholder.svg"} alt={pkg.name} />
          <div className={styles.packageDetails}>
            <h3 className={styles.packageName}>{pkg.name}</h3>
            <div className={styles.packagePrice}>₱{pkg.price.toFixed(2)}</div>
            <p className={styles.packageDescription}>{pkg.description}</p>

            {isEditing && (
              <div className={styles["package-actions"]}>
                <button className={styles.updateButton} onClick={() => setIsUpdating(true)}>
                  Update
                </button>
                <button className={styles.deleteButton} onClick={onDelete}>
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
