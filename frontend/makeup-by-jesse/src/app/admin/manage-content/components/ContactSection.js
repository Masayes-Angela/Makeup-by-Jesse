"use client"

import { useState } from "react"
import styles from "../styles/contact.module.css"
import AddContacts from "../../components/contacts/AddContacts"

export default function ContactsAndInfo() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className={styles["contact-container"]}>
      <div className={styles["content-section"]}>
        <div className={styles["contact-header"]}>
          <h2 className={styles["section-title"]}>Contact Details</h2>
        </div>

        <div className={styles["contact-scroll-container"]}>
          <AddContacts isEditing={isEditing} />
        </div>
      </div>
    </div>
  )
}
