"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "../styles/Services.module.css"
import Image from "next/image"
import { useGetServicesQuery } from "@/rtk/serviceApi"

// Reusable card component
function ServiceCard({ image, title, description }) {
  const router = useRouter()

  const handleBookClick = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
    } else {
      router.push("/appointments")
    }
  }

  // Fix the image URL construction
  const getImageSrc = (image) => {
    if (!image) return "/default.jpg"

    // If it's already a full URL (base64 or http), use it directly
    if (image.startsWith("data:") || image.startsWith("http")) {
      return image
    }

    // If it's a file path, construct the proper URL
    if (image.startsWith("/uploads/")) {
      return `http://localhost:8080${image}`
    }

    // Default construction for backward compatibility
    return `http://localhost:8080/uploads/services/${image}`
  }

  const imageSrc = getImageSrc(image)

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title || "Service image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
          onError={(e) => {
            console.error("Image failed to load:", imageSrc)
            e.target.src = "/default.jpg"
          }}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <button className={styles.bookBtn} onClick={handleBookClick}>
          Book Now
        </button>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const { data: services = [], isLoading, isError } = useGetServicesQuery()

  const activeServices = services.filter((service) => service.status === "ACTIVE")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  // Debug logging to help troubleshoot
  useEffect(() => {
    if (services.length > 0) {
      console.log("Services data:", services)
      services.forEach((service) => {
        console.log(`Service: ${service.service_name}, Image: ${service.inspo}`)
      })
    }
  }, [services])

  return (
    <section id="services" className={styles.services} ref={sectionRef}>
      <div className={styles.servicesWrapper}>
        <p className={`${styles.subheading} ${styles.fadeInUp} ${isVisible ? styles.visible : ""}`}>What We Offer</p>
        <h2 className={`${styles.heading} ${styles.fadeInUp} ${isVisible ? styles.visible : ""}`}>Our Services</h2>
        <div className={`${styles.serviceCards} ${styles.fadeInUp} ${isVisible ? styles.visible : ""}`}>
          {isLoading ? (
            <p>Loading services...</p>
          ) : isError ? (
            <p>Error loading services. Please try again later.</p>
          ) : activeServices.length > 0 ? (
            activeServices.map((service) => (
              <ServiceCard
                key={service.id}
                image={service.inspo}
                title={service.service_name}
                description={service.service_description}
              />
            ))
          ) : (
            <p className={styles.noServices}>No services available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  )
}
