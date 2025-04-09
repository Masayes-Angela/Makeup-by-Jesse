// src/pages/ManageWebsite/ManageWebsite.js
import React, { useState } from 'react';
import '../styles/ManageWebsite.css';
import {
    FaTachometerAlt,
    FaBookmark,
    FaCalendarAlt,
    FaEdit,
    FaCog,
    FaSignOutAlt
  } from 'react-icons/fa';

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

  return (
    <div className="manage-website">
        <div className="container">
            <div className="icon-container">
                <FaEdit />
            </div>
            <h1>Manage Website Content</h1>
        </div>
        

      {/* Top Nav */}
      <nav className="mw-nav">
        <button
            onClick={() => setActiveTab('services')}
            className={activeTab === 'services' ? 'active' : ''}
        >
            Services
        </button>
        <button
            onClick={() => setActiveTab('about')}
            className={activeTab === 'about' ? 'active' : ''}
        >
            About Me
        </button>
        <button
            onClick={() => setActiveTab('gallery')}
            className={activeTab === 'gallery' ? 'active' : ''}
        >
            Gallery
        </button>
        <button
            onClick={() => setActiveTab('reviews')}
            className={activeTab === 'reviews' ? 'active' : ''}
        >
            Reviews
        </button>
    </nav>


      {activeTab === 'services' && (
        <div className="services-container">
          <div className="services-header">
            <div>
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                  <button onClick={() => setIsEditing(false)}>Save Changes</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
          </div>

          {isEditing && <AddServiceForm onAdd={handleAdd} />}

          <div className="services-list">
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
      )}

      {activeTab !== 'services' && (
        <p style={{ marginTop: '2rem' }}>Content for "{activeTab}" goes here.</p>
      )}
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
    <form className="add-service-form" onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <input
        type="text"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Service</button>
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
    <div className="service-item">
      {isUpdating ? (
        <>
          <input type="file" onChange={handleImageChange} />
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsUpdating(false)}>Cancel</button>
        </>
      ) : (
        <>
          <img src={service.image} alt={service.name} />
          <p>{service.name}</p>
          {isEditing && (
            <div className="service-actions">
              <button onClick={() => setIsUpdating(true)}>Update</button>
              <button onClick={() => onDelete(index)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};