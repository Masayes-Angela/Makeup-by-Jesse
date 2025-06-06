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
} from '@/rtk/packageApi'
import PackageItem from '../../components/packages/PackageItem/PackageItem'

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

  const handleUpdatePackage = async (id, updatedPackage) => {
    try {
      const formData = new FormData()
      formData.append('name', updatedPackage.name)
      formData.append('description', updatedPackage.description)
      if (updatedPackage.image) {
        formData.append('image', updatedPackage.image)
      }

      await updatePackage({ id, formData }).unwrap()
      await refetchPackages()
    } catch (error) {
      alert(`Error updating package: ${error.message || 'Unknown error'}`)
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
        <div className={styles['package-header']}>
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
        <div className={styles['package-scroll-container']}>
          <div className={styles['package-list']}>
            {isLoadingPackages ? (
              <p>Loading packages...</p>
            ) : isErrorPackages ? (
              <div>
                <p>Error loading packages</p>
                <button onClick={refetchPackages}>Try Again</button>
              </div>
            ) : (() => {
              const activePackages = packages.filter(pkg => pkg.status === 'ACTIVE')
              return activePackages.length === 0 ? (
                <p>No packages found. Add a package to get started.</p>
              ) : (
                activePackages.map((pkg) => (
                  <PackageItem
                    key={pkg.id}
                    package={pkg}
                    isEditing={isEditingPackages}
                    refetchPackages={refetchPackages}
                  />
                ))
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}