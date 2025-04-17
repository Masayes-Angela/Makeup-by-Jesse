'use client';

import { useState } from 'react';

const AddServiceForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert('Please provide both name and image!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newService = {
        name,
        image: reader.result,
      };

      onAdd(newService);
      setName('');
      setImage(null);
      e.target.reset();
    };

    reader.readAsDataURL(image);
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#45a049',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Service name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
      >
        Add Service
      </button>
    </form>
  );
};

export default AddServiceForm;
