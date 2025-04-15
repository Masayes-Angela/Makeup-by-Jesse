'use client'

import { useState } from 'react';
import Image from 'next/image';
import styles from './content.module.css';
import { FaEdit } from 'react-icons/fa';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const ManageWebsite = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (newService) => {
    setServices([...services, newService]);
  };

  const handleUpdate = (index, updatedService) => {
    const updatedList = [...services];
    updatedList[index] = updatedService;
    setServices(updatedList);
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you wanna delete?')) {
      const updatedList = services.filter((_, i) => i !== index);
      setServices(updatedList);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return (
          <div className={styles['services-container']}>
            <div className={styles['services-header']}>
              <div>
                {isEditing ? (
                  <>
                    <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className={styles.saveButton} onClick={() => setIsEditing(false)}>Save Changes</button>
                  </>
                ) : (
                  <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                    <span className={styles.buttonText}>Edit</span>
                    <span className={styles.iconWrapper}><FaEdit /></span>
                  </button>
                )}
              </div>
            </div>

            {isEditing && <AddServiceForm onAdd={handleAdd} />}

            <div className={styles['services-list']}>
              {services.map((service, index) => (
                <ServiceItem
                  key={index}
                  index={index}
                  service={service}
                  isEditing={isEditing}
                  onEditClick={() => {
                    setSelectedServiceIndex(index);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        );
      case 'about':
        return <p>Content for About Me goes here.</p>;
      case 'gallery':
        return <p>Content for Gallery goes here.</p>;
      case 'reviews':
        return <p>Content for Reviews goes here.</p>;
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  const selectedService = selectedServiceIndex !== null ? services[selectedServiceIndex] : null;

  return (
    <div className={styles['manage-website']}>
      <div className={styles.container}>
        <div className={styles['icon-container']}>
          <FaEdit />
        </div>
        <h1>Manage Website Content</h1>
      </div>

      <nav className={styles['mw-nav']}>
        <button onClick={() => setActiveTab('services')} className={activeTab === 'services' ? styles.active : ''}>Services</button>
        <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? styles.active : ''}>About Me</button>
        <button onClick={() => setActiveTab('gallery')} className={activeTab === 'gallery' ? styles.active : ''}>Gallery</button>
        <button onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? styles.active : ''}>Reviews</button>
      </nav>

      <div className={styles['tab-content-container']}>
        {renderTabContent()}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedService && (
          <UpdateServiceForm
            service={selectedService}
            onSave={(updatedService) => handleUpdate(selectedServiceIndex, updatedService)}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageWebsite;

// Add Service
const AddServiceForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;

    const reader = new FileReader();
    reader.onload = () => {
      onAdd({ name, image: reader.result });
      setName('');
      setImage(null);
    };
    reader.readAsDataURL(image);
  };

  return (
    <form className={styles['add-service-form']} onSubmit={handleSubmit}>
      <input
        id="service-image"
        name="serviceImage"
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <input
        id="service-name"
        name="serviceName"
        type="text"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className={styles.addServiceButton} type="submit">Add Service</button>
    </form>
  );
};

// Update Service Modal Form
const UpdateServiceForm = ({ service, onSave, onCancel }) => {
  const [updatedName, setUpdatedName] = useState(service.name);
  const [updatedImage, setUpdatedImage] = useState(service.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUpdatedImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.updateForm}>
      <h3 className={styles.modalTitle}>Update Service</h3>

      <label htmlFor="update-image" className={styles.inputLabel}>Change Image</label>
      <label className={styles.fileInputWrapper}>
        Choose File
        <input
          id="update-image"
          name="updatedServiceImage"
          type="file"
          className={styles.fileInput}
          onChange={handleImageChange}
        />
      </label>

      <label htmlFor="update-name" className={styles.inputLabel}>Service Name</label>
      <input
        id="update-name"
        name="updatedServiceName"
        type="text"
        className={styles.textInput}
        value={updatedName}
        onChange={(e) => setUpdatedName(e.target.value)}
      />

      <div className={styles.updateButtons}>
        <button className={styles.UpdmodalcancelButton} onClick={onCancel}>Cancel</button>
        <button
          className={styles.UpdmodalsaveButton}
          onClick={() => onSave({ name: updatedName, image: updatedImage })}
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Service Item
const ServiceItem = ({ index, service, isEditing, onEditClick, onDelete }) => {
  return (
    <div className={styles['service-item']}>
      <img src={service.image} alt={service.name} />
      <div className={styles.serviceText}>
        <p className={styles.serviceNameLabel}>Service Name</p>
        <p className={styles.serviceName}>{service.name}</p>

        {isEditing && (
          <div className={styles['service-actions']}>
            <button className={styles.updateButton} onClick={() => onEditClick(index)}>Update</button>
            <button className={styles.deleteButton} onClick={() => onDelete(index)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};