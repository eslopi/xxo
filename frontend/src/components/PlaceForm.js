// src/components/PlaceForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PlaceForm = ({ onPlaceAdded }) => {
  const [place, setPlace] = useState({
    name: '',
    description: '',
    image_url: '',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({ ...prevPlace, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, image_url, latitude, longitude } = place;
    
    // إرسال البيانات إلى الخادم الخلفي
    try {
      const response = await axios.post('/api/places', {
        name,
        description,
        image_url,
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude], // تنسيق الإحداثيات
        },
      });
      onPlaceAdded(response.data);
      setPlace({ name: '', description: '', image_url: '', latitude: '', longitude: '' });
    } catch (error) {
      console.error('Error adding place:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>اسم المكان:</label>
        <input type="text" name="name" value={place.name} onChange={handleChange} required />
      </div>
      <div>
        <label>الوصف:</label>
        <input type="text" name="description" value={place.description} onChange={handleChange} />
      </div>
      <div>
        <label>رابط الصورة:</label>
        <input type="text" name="image_url" value={place.image_url} onChange={handleChange} />
      </div>
      <div>
        <label>إحداثيات (Latitude):</label>
        <input type="number" name="latitude" value={place.latitude} onChange={handleChange} required />
      </div>
      <div>
        <label>إحداثيات (Longitude):</label>
        <input type="number" name="longitude" value={place.longitude} onChange={handleChange} required />
      </div>
      <button type="submit">إضافة المكان</button>
    </form>
  );
};

export default PlaceForm;
