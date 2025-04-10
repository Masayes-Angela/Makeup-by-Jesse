"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/ManageWebsite.module.css";

export default function ManageWebsite() {
  const [services, setServices] = useState([
    { name: "Service 1", image: "/images/service1.jpg" },
    { name: "Service 2", image: "/images/service2.jpg" },
  ]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = (index) => {
    if (isClient && window.confirm("Are you sure you want to delete this service?")) {
      const updatedList = services.filter((_, i) => i !== index);
      setServices(updatedList);
    }
  };

  return (
    <div className={styles.manageWebsite}>
      <h2>Manage Website</h2>
      <ul className={styles.serviceList}>
        {services.map((service, index) => (
          <li key={index} className={styles.serviceItem}>
            <Image
              src={service.image}
              alt={service.name}
              width={200}
              height={150}
              className={styles.serviceImage}
            />
            <p>{service.name}</p>
            <button onClick={() => handleDelete(index)} className={styles.deleteButton}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}