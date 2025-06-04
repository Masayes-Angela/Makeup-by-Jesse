"use client"

import { useState } from "react"
import styles from "../styles/servicesandpackages.module.css"
import { BiSolidEditAlt } from "react-icons/bi"
import AddContacts from "../../components/contacts/AddContacts"

export default function ContactsAndInfo() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className={styles["services-packages-container"]}>
      {/* Contact Information */}
      <div className={styles["content-section"]}>
        <div className={styles["services-header"]}>
          <h2 className={styles["section-title"]}>Contact Details</h2>
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
                  <BiSolidEditAlt />
                </span>
              </button>
            )}
          </div>
        </div>

        <div className={styles["services-scroll-container"]}>
          <AddContacts isEditing={isEditing} />
        </div>
      </div>
    </div>
  )
}
