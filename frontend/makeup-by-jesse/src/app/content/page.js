'use client'

import { useState } from 'react';
import Image from 'next/image';
import styles from './content.module.css'; 
import { FaEdit } from 'react-icons/fa';

const ManageWebsite = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = (newService) => {
    setServices([...services, newService]);
  };

  const handleUpdate = (index, updatedService) => {
    const updatedList = [...services];
    updatedList[index] = updatedService;
    setServices(updatedList);
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
                    <span className={styles.iconWrapper}>
                      <FaEdit />
                    </span>
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
                  onUpdate={handleUpdate}
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

  return (
    <div className={styles['manage-website']}>
      <div className={styles.container}>
        <div className={styles['icon-container']}>
          <FaEdit />
        </div>
        <h1>Manage Website Content</h1>
      </div>

      <nav className={styles['mw-nav']}>
        <button
          onClick={() => setActiveTab('services')}
          className={activeTab === 'services' ? styles.active : ''}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={activeTab === 'about' ? styles.active : ''}
        >
          About Me
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={activeTab === 'gallery' ? styles.active : ''}
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={activeTab === 'reviews' ? styles.active : ''}
        >
          Reviews
        </button>
      </nav>

      <div className={styles['tab-content-container']}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManageWebsite;

// Components

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
        type="file" 
        accept="image/*" 
        name="serviceImage"
        id="serviceImage"
        onChange={(e) => setImage(e.target.files[0])} 
      />
      <input
        type="text"
        name="serviceName"
        id="serviceName"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className={styles.addServiceButton} type="submit">Add Service</button>
    </form>
  );
};

const ServiceItem = ({ index, service, isEditing, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedName, setUpdatedName] = useState(service.name);
  const [updatedImage, setUpdatedImage] = useState(service.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUpdatedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onUpdate(index, { name: updatedName, image: updatedImage });
    setIsUpdating(false);
  };

  return (
    <div className={styles['service-item']}>
      {isUpdating ? (
        <>
          <input 
            type="file" 
            name={`updateImage-${index}`} 
            id={`updateImage-${index}`} 
            onChange={handleImageChange} 
          />
          <input
            type="text"
            name={`updateName-${index}`} 
            id={`updateName-${index}`}
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
          <button className={styles.cancelButton} onClick={() => setIsUpdating(false)}>Cancel</button>
          <button className={styles.saveButton} onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <img src={service.image} alt={service.name} />
          <div className={styles.serviceDetails}>
            <label htmlFor="service-name" className={styles.serviceNameLabel}>Service Name</label>
            <p className={styles.serviceName}>{service.name}</p>
          
          {isEditing && (
            <div className={styles['service-actions']}>
              <button className={styles.updateButton} onClick={() => setIsUpdating(true)}>Update</button>
              <button className={styles.deleteButton} onClick={() => onDelete(index)}>Delete</button>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
};