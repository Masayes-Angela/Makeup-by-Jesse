// components/Service/ServiceItem.js
'use client';

import { useState } from 'react';

const ServiceItem = ({ service, index, isEditing, onUpdate, onDelete }) => {
  const [editedName, setEditedName] = useState(service.name);
  const [editedImage, setEditedImage] = useState(service.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate(index, { name: editedName, image: editedImage });
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '10px',
    marginBottom: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
  };

  const imageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#f2f2f2',
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '150px',
  };

  const buttonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
  };

  return (
    <div style={containerStyle}>
      <img src={editedImage} alt={editedName} style={imageStyle} />

      {isEditing ? (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={inputStyle}
          />
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={handleSave}>
            Save
          </button>
          <button style={deleteButtonStyle} onClick={() => onDelete(index)}>
            Delete
          </button>
        </>
      ) : (
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{service.name}</p>
      )}
    </div>
  );
};

export default ServiceItem;
