'use client'

import { useState } from 'react'
import styles from '../styles/servicesandpackages.module.css'
import { BiSolidEditAlt } from 'react-icons/bi'
import { AddService, ServiceList } from '../../components/Service'
import { AddPackage } from '../../components/packages'
import {
  useGetServicesQuery,
} from '@/rtk/serviceApi'
import {
  useGetPackagesQuery,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from '@/rtk/packageApi'

export default function ServicesAndPackages() {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPackages, setIsEditingPackages] = useState(false)

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

  const handleUpdatePackage = async (id, updatedPackage) => {
    try {
      await updatePackage({ id, ...updatedPackage }).unwrap()
      await refetchPackages()
    } catch (error) {
      alert(`Error updating package: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id).unwrap()
        await refetchPackages()
      } catch (error) {
        alert(`Error deleting package: ${error.message || 'Unknown error'}`)
      }
    }
  }

  return (
    <div className={styles['services-packages-container']}>
      {/* Services */}
      <div className={styles['content-section']}>
        <div className={styles['services-header']}>
          <h2 className={styles['section-title']}>Services</h2>
          <div>
            {isEditing ? (
              <>
                <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                <button className={styles.saveButton} onClick={() => setIsEditing(false)}>Save Changes</button>
              </>
            ) : (
              <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                <span className={styles.buttonText}>Edit</span>
                <span className={styles.iconWrapper}><BiSolidEditAlt /></span>
              </button>
            )}
          </div>
        </div>
        {isEditing && <AddService onServiceAdded={refetchServices} />}
        <ServiceList isEditing={isEditing} refetchServices={refetchServices} />
      </div>

      {/* Packages */}
      <div className={styles['content-section']}>
        <div className={styles['services-header']}>
          <h2 className={styles['section-title']}>Packages</h2>
          <div>
            {isEditingPackages ? (
              <>
                <button className={styles.cancelButton} onClick={() => setIsEditingPackages(false)}>Cancel</button>
                <button className={styles.saveButton} onClick={() => setIsEditingPackages(false)}>Save Changes</button>
              </>
            ) : (
              <button className={styles.editButton} onClick={() => setIsEditingPackages(true)}>
                <span className={styles.buttonText}>Edit</span>
                <span className={styles.iconWrapper}><BiSolidEditAlt /></span>
              </button>
            )}
          </div>
        </div>

        {isEditingPackages && <AddPackage onPackageAdded={refetchPackages} />}
        <div className={styles['services-scroll-container']}>
          <div className={styles['services-list']}>
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
              packages
                .filter((pkg) => pkg.status === 'ACTIVE')
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
}

// 👇 PackageItem component is embedded below
function PackageItem({ package: pkg, isEditing, onUpdate, onDelete, isDeleting }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedName, setUpdatedName] = useState(pkg.name)
  const [updatedPrice, setUpdatedPrice] = useState(pkg.price)
  const [updatedDescription, setUpdatedDescription] = useState(pkg.description)
  const [imageFile, setImageFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

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

  const handleSave = () => {
    setError(null)

    if (!updatedName || !updatedPrice || !updatedDescription) {
      setError('All fields are required.')
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
          setError(`Failed to update package: ${err.message || 'Unknown error'}`)
        } finally {
          setIsSubmitting(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read image')
        setIsSubmitting(false)
      }
      reader.readAsDataURL(imageFile)
    } else {
      onUpdate(updateData)
        .then(() => setIsUpdating(false))
        .catch((err) => setError(`Failed to update package: ${err.message || 'Unknown error'}`))
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <div className={styles['package-item']}>
      {isUpdating ? (
        <div className={styles['package-update-form']}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />

          {previewImage && (
            <div className={styles['image-preview-container']}>
              <img src={previewImage || '/placeholder.svg'} alt="Preview" className={styles['image-preview']} />
            </div>
          )}

          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Package name"
          />
          <input
            type="number"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            disabled={isSubmitting}
            placeholder="Price"
            min="0"
            step="0.01"
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            disabled={isSubmitting}
            placeholder="Description"
            rows="3"
          />
          <div className={styles['update-actions']}>
            <button onClick={() => setIsUpdating(false)} disabled={isSubmitting}>Cancel</button>
            <button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles['service-image-container']}>
            {pkg.image_url ? (
              <img
                src={pkg.image_url}
                alt={pkg.name}
                className={styles.packageImage}
                onError={(e) => {
                  e.target.src = '/placeholder.svg'
                  e.target.onerror = null
                }}
              />
            ) : (
              <div className={styles.imagePlaceholder}><span>No image</span></div>
            )}
          </div>
          <div className={styles.packageDetails}>
            <h3 className={styles.packageName}>{pkg.name}</h3>
            <div className={styles.packagePrice}>₱{Number.parseFloat(pkg.price).toFixed(2)}</div>
            <p className={styles.packageDescription}>{pkg.description}</p>

            {isEditing && (
              <div className={styles['package-actions']}>
                <button onClick={() => setIsUpdating(true)}>Update</button>
                <button onClick={onDelete} disabled={isDeleting}>Delete</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}