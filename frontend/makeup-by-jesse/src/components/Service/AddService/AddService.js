import React, { useState, useEffect } from 'react';
import { useAddServiceMutation } from '@/rtk/serviceApi'; // ← You should have this in your RTK slice

export default function AddService() {
  const [serviceName, setServiceName] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [addService] = useAddServiceMutation();

  // 🔼 This should be similar to how you added books using RTK

  const openUploadWidget = () => {
    if (window.cloudinary) {
      const cloudinaryWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'codestudio28',
          uploadPreset: 'wmnayrn3',
          sources: ['local', 'url', 'unsplash'],
          cropping: true,
          multiple: false,
          maxFileSize: 2000000,
          clientAllowedFormats: ['jpg', 'png', 'webp'],
          folder: 'servicesupload',
        },
        (error, result) => {
          if (!error && result.event === 'success') {
            console.log('Upload successful:', result.info.secure_url);
            setServiceImage(result.info.secure_url);
          }
        }
      );
      cloudinaryWidget.open();
    }
  };

  const handleSubmit = async () => {
    const newService = {
      service_name: serviceName,
      image: serviceImage,
    };

    console.log('Submitting:', newService);
    await addService(newService);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="genre-form">
      <input
        type="text"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        placeholder="Enter service name"
      />
      <button onClick={openUploadWidget}>Upload Image</button>

      {serviceImage && (
        <div style={{ marginTop: '10px' }}>
          <img src={serviceImage} alt="Service Preview" width="150" />
        </div>
      )}

      <button
        style={{ backgroundColor: 'blue', color: 'white', marginTop: '10px' }}
        onClick={handleSubmit}
      >
        Add Service
      </button>
    </div>
  );
}
