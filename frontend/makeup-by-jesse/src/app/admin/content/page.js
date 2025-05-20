"use client"

import { useState } from "react"
import styles from "./content.module.css"
import { FaEdit } from "react-icons/fa"
import { AddService, ServiceList } from "../components/Service"
import { AddPackage } from "../components/Package"
import { useGetServicesQuery } from "@/rtk/serviceApi"
import { useGetPackagesQuery, useUpdatePackageMutation, useDeletePackageMutation } from "@/rtk/packageApi"

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

  // Use RTK Query hooks for services and packages
  const { refetch: refetchServices } = useGetServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const {
    data: packages = [],
    isLoading: isLoadingPackages,
    isError: isErrorPackages,
    refetch: refetchPackages,
  } = useGetPackagesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [updatePackage] = useUpdatePackageMutation()
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation()

  // Package handlers
  const handleUpdatePackage = async (id, updatedPackage) => {
    try {
      await updatePackage({ id, ...updatedPackage }).unwrap()
      await refetchPackages()
    } catch (error) {
      console.error("Failed to update package:", error)
      alert(`Error updating package: ${error.message || "Unknown error"}`)
    }
  }

  const handleDeletePackage = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(id).unwrap()
        await refetchPackages()
      } catch (error) {
        console.error("Failed to delete package:", error)
        alert(`Error deleting package: ${error.message || "Unknown error"}`)
      }
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

              {isEditingPackages && <AddPackage onPackageAdded={refetchPackages} />}

              <div className={styles["services-scroll-container"]}>
                <div className={styles["services-list"]}>
                  {isLoadingPackages ? (
                    <p>Loading packages...</p>
                  ) : isErrorPackages ? (
                    <div>
                      <p>Error loading packages</p>
                      <button onClick={refetchPackages}>Try Again</button>
                    </div>
                  ) : packages.length === 0 ? (
                    <p>No packages found. Add a package to get started.</p>
                  ) : (
                    // Filter to only show active packages
                    packages
                      .filter((pkg) => pkg.status === "ACTIVE")
                      .map((pkg) => (
                        <PackageItem
                          key={pkg.id}
                          package={pkg}
                          isEditing={isEditingPackages}
                          onUpdate={(updatedPackage) => handleUpdatePackage(pkg.id, updatedPackage)}
                          onDelete={() => handleDeletePackage(pkg.id)}
                          isDeleting={isDeleting}
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

// PackageItem Component
const PackageItem = ({ package: pkg, isEditing, onUpdate, onDelete, isDeleting }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(pkg.name)
  const [updatedPrice, setUpdatedPrice] = useState(pkg.price)
  const [updatedDescription, setUpdatedDescription] = useState(pkg.description)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Update local state when package prop changes
  useState(() => {
    setUpdatedName(pkg.name)
    setUpdatedPrice(pkg.price)
    setUpdatedDescription(pkg.description)
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

  const handleSave = () => {
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

    setIsSubmitting(true)

    const updateData = {
      name: updatedName,
      price: Number.parseFloat(updatedPrice),
      description: updatedDescription,
    }

    if (imageFile) {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          await onUpdate({
            ...updateData,
            image: reader.result,
          })
          setIsUpdating(false)
        } catch (err) {
          setError(`Failed to update package: ${err.message || "Unknown error"}`)
        } finally {
          setIsSubmitting(false)
        }
      }
      reader.onerror = () => {
        setError("Failed to read the image file")
        setIsSubmitting(false)
      }
      reader.readAsDataURL(imageFile)
    } else {
      // No new image
      onUpdate(updateData)
        .then(() => setIsUpdating(false))
        .catch((err) => setError(`Failed to update package: ${err.message || "Unknown error"}`))
        .finally(() => setIsSubmitting(false))
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
            name={`updatePackageImage-${pkg.id}`}
            id={`updatePackageImage-${pkg.id}`}
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
          <div className={styles["service-image-container"]}>
            {pkg.image_url ? (
              <img
                src={pkg.image_url || "/placeholder.svg"}
                alt={pkg.name}
                className={styles.packageImage}
                onError={(e) => {
                  console.error("Image failed to load:", pkg.image_url)
                  e.target.src = "/placeholder.svg?height=200&width=300"
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
