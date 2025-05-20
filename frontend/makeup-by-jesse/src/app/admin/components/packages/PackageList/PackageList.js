"use client"

import { useGetPackagesQuery, useDeletePackageMutation } from "@/rtk/packageApi"
import styles from "../../../content/content.module.css"
import PackageItem from "../PackageItem/PackageItem"

const PackageList = ({ isEditing, refetchPackages }) => {
  const {
    data: packages = [],
    isLoading,
    isError,
    refetch,
  } = useGetPackagesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation()

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(id).unwrap()
        await refetch()
        if (refetchPackages) refetchPackages()
      } catch (error) {
        console.error("Failed to delete package:", error)
        alert(`Error deleting package: ${error.message || "Unknown error"}`)
      }
    }
  }

  // Only show active packages and ensure all packages have required fields
  const activePackages = packages
    .filter((pkg) => pkg.status === "ACTIVE")
    .map((pkg) => ({
      ...pkg,
      // Ensure price is a number
      price: typeof pkg.price === "string" ? Number.parseFloat(pkg.price) : pkg.price,
      // Ensure image_url exists
      image_url: pkg.image_url || null,
    }))

  if (isLoading) return <p>Loading packages...</p>

  if (isError) {
    return (
      <div>
        <p>Error loading packages</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    )
  }

  return (
    <div className={styles["packages-scroll-container"]}>
      <div className={styles["packages-list"]}>
        {activePackages.length === 0 ? (
          <p>No packages found. Add a package to get started.</p>
        ) : (
          activePackages.map((pkg) => (
            <PackageItem
              key={pkg.id}
              package={pkg}
              isEditing={isEditing}
              onDelete={() => handleDelete(pkg.id)}
              isDeleting={isDeleting}
              refetchPackages={refetch}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PackageList
