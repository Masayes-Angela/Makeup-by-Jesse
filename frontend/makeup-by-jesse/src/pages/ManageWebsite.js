import React, { useState } from 'react';
import '../styles/ManageWebsite.css';

const ManageWebsite = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', image: '' });
  const [aboutContent, setAboutContent] = useState({
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '', // Default image path or empty if no image
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsEditingServices(false); // Reset editing state when switching tabs
    setIsEditingAbout(false);
  };

  const handleImageUpload = (e, section) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (section === 'about') {
        setAboutContent({ ...aboutContent, image: imageUrl });
      } else if (section === 'services') {
        setNewService({ ...newService, image: imageUrl });
      }
    }
  };

  const handleDescriptionChange = (e) => {
    setAboutContent({ ...aboutContent, description: e.target.value });
  };

  const handleAddService = () => {
    if (newService.name && newService.image) {
      setServices([...services, newService]);
      setNewService({ name: '', image: '' });
      setIsEditingServices(false);
    }
  };

  const handleSaveAboutContent = () => {
    setIsEditingAbout(false);
  };

  const renderContent = () => {
    if (activeTab === 'services') {
      return (
        <div className="tab-content">
          <div className="tab-header">
            <h2>Services Content</h2>
            <button className="edit-btn" onClick={() => setIsEditingServices(true)}>
              Edit
            </button>
          </div>

          {isEditingServices ? (
            <div className="add-service-form">
              <input
                type="text"
                placeholder="Service name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'services')}
              />
              {newService.image && (
                <img
                  src={newService.image}
                  alt="Preview"
                  className="preview-img"
                />
              )}
              <button onClick={handleAddService}>Save</button>
            </div>
          ) : (
            <div className="services-list">
              {services.length === 0 ? (
                <p>No services added yet.</p>
              ) : (
                services.map((service, index) => (
                  <div className="service-card" key={index}>
                    <img src={service.image} alt={service.name} />
                    <p>{service.name}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      );
    } else if (activeTab === 'about me') {
      return (
        <div className="tab-content">
          <div className="tab-header">
            <h2>About Me</h2>
            <button className="edit-btn" onClick={() => setIsEditingAbout(true)}>
              Edit
            </button>
          </div>

          {isEditingAbout ? (
            <div className="about-edit-form">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'about')}
              />
              {aboutContent.image && (
                <img
                  src={aboutContent.image}
                  alt="Preview"
                  className="preview-img"
                />
              )}
              <textarea
                value={aboutContent.description}
                onChange={handleDescriptionChange}
                rows="5"
                cols="50"
              />
              <button onClick={handleSaveAboutContent}>Save</button>
            </div>
          ) : (
            <div className="about-content">
              <img
                src={aboutContent.image || 'default-photo.jpg'}
                alt="About Me"
                width="200"
                height="200"
              />
              <p>{aboutContent.description}</p>
            </div>
          )}
        </div>
      );
    } else {
      return <div className="tab-content"><p>{activeTab} content coming soon.</p></div>;
    }
  };

  return (
    <div className="manage-website">
      <h1>Manage Website Content</h1>
      <div className="nav-tabs">
        {['services', 'about me', 'gallery', 'reviews'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default ManageWebsite;
