"use client"

import { useGetServicesQuery, useDeleteServiceMutation } from "@/rtk/serviceApi"
import styles from "../../../content/content.module.css"
import ServiceItem from "../ServiceItem/ServiceItem"

const ServiceList = ({ isEditing, refetchServices }) => {
  const {
    data: services = [],
    isLoading,
    isError,
    refetch,
  } = useGetServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id).unwrap()
        await refetch()
        if (refetchServices) refetchServices()
      } catch (error) {
        console.error("Failed to delete service:", error)
        alert(`Error deleting service: ${error.message || "Unknown error"}`)
      }
    }
  }

  // Only show active services
  const activeServices = services.filter((service) => service.status === "ACTIVE")

  if (isLoading) return <p>Loading services...</p>

  if (isError) {
    return (
      <div>
        <p>Error loading services</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    )
  }

  return (
    <div className={styles["services-scroll-container"]}>
      <div className={styles["services-list"]}>
        {activeServices.length === 0 ? (
          <p>No services found. Add a service to get started.</p>
        ) : (
          activeServices.map((service) => (
            <ServiceItem
              key={service.id}
              service={{
                id: service.id,
                name: service.service_name,
                inspo: service.inspo,
                status: service.status,
              }}
              isEditing={isEditing}
              onDelete={() => handleDelete(service.id)}
              isDeleting={isDeleting}
              refetchServices={refetch}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ServiceList
