import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map, { Marker } from 'react-map-gl'; // استيراد مكونات Mapbox
import 'mapbox-gl/dist/mapbox-gl.css'; // استيراد CSS الخاص بـ Mapbox

const Admin = () => {
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState({
    name: '',
    description: '',
    image_url: '',
    latitude: '',
    longitude: '',
  });
  const [viewport, setViewport] = useState({
    latitude: 37.7749, // إحداثيات افتراضية (يمكن تعديلها لاحقاً)
    longitude: -122.4194,
    zoom: 8,
  });

  // جلب الأماكن الموجودة عند تحميل الصفحة
  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await axios.get('http://localhost:5000/api/places'); // تعديل المسار الكامل
      setPlaces(response.data);
    };
    fetchPlaces();
  }, []);

  // تحديث حالة الحقول عند تغيير المدخلات
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({ ...prevPlace, [name]: value }));
  };

  // إضافة مكان جديد
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, image_url, latitude, longitude } = place; // تأكد من استخدام place object
    try {
      const response = await axios.post('http://localhost:5000/api/places', {
        name,
        description,
        image_url,
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      });
      setPlaces([...places, response.data]);
      setPlace({ name: '', description: '', image_url: '', latitude: '', longitude: '' });
    } catch (error) {
      console.error('Error adding place:', error);
    }
  };

  // حذف مكان
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/places/${id}`);
      setPlaces(places.filter((place) => place._id !== id));
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* النصف الأيسر: نموذج الإدخال */}
      <div style={{ width: '50%', padding: '20px' }}>
        <h2>إضافة مكان جديد</h2>
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
            <input type="number" step="any" name="latitude" value={place.latitude} onChange={handleChange} required />
          </div>
          <div>
            <label>إحداثيات (Longitude):</label>
            <input type="number" step="any" name="longitude" value={place.longitude} onChange={handleChange} required />
          </div>
          <button type="submit">إضافة المكان</button>
        </form>

        <h2>الأماكن المضافة</h2>
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>إحداثيات</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place._id}>
                <td>{place.name}</td>
                <td>{place.description}</td>
                <td>{place.coordinates.coordinates.join(', ')}</td>
                <td>
                  <button onClick={() => handleDelete(place._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* النصف الأيمن: خريطة Mapbox */}
      <div style={{ width: '50%', padding: '20px' }}>
        <Map
          initialViewState={viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken="pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A" // تضمين مفتاح Mapbox مباشرة
          onClick={(e) => {
            setPlace({
              ...place,
              latitude: e.lngLat.lat,
              longitude: e.lngLat.lng,
            });
          }}
        >
          {/* عرض العلامة للموقع الجديد */}
          {place.latitude && place.longitude && (
            <Marker latitude={parseFloat(place.latitude)} longitude={parseFloat(place.longitude)} />
          )}

          {/* عرض العلامات للأماكن المضافة */}
          {places.map((place) => (
            <Marker
              key={place._id}
              latitude={place.coordinates.coordinates[1]}
              longitude={place.coordinates.coordinates[0]}
            />
          ))}
        </Map>
      </div>
    </div>
  );
};

export default Admin;
