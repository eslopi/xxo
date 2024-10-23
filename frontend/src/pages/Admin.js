import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // إدارة تسجيل الدخول والتسجيل
import { db } from '../firebase'; // استيراد Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Firestore لإدارة الأماكن
import mapboxgl from 'mapbox-gl'; // استيراد مكتبة Mapbox
import 'mapbox-gl/dist/mapbox-gl.css'; // تأكد من استيراد ملف CSS الخاص بـ Mapbox

// إضافة مفتاح Mapbox الخاص بك
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const Admin = () => {
  // حالة لإدارة تسجيل الدخول/التسجيل
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // بيانات المكان
  const [place, setPlace] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    imageUrl: ''
  });

  const [places, setPlaces] = useState([]); // لحفظ الأماكن من Firestore

  useEffect(() => {
    // تهيئة خريطة Mapbox بعد تحميل المكون
    const map = new mapboxgl.Map({
      container: 'map', // العنصر الذي سيتم وضع الخريطة فيه
      style: 'mapbox://styles/mapbox/streets-v11', // نمط الخريطة
      center: [46.6753, 24.7136], // إحداثيات الرياض كمثال
      zoom: 10 // مستوى التكبير الافتراضي
    });

    // إضافة التحكم في التكبير والتصغير
    map.addControl(new mapboxgl.NavigationControl());

    // إضافة زر الموقع الحالي
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    // إضافة ماركر على الموقع المحدد عند النقر على الخريطة
    map.on('click', function (e) {
      const lat = e.lngLat.lat;
      const lon = e.lngLat.lng;

      // تحديث القيم في الحقول
      setPlace((prevState) => ({
        ...prevState,
        latitude: lat.toFixed(6), // تحديث خط العرض
        longitude: lon.toFixed(6) // تحديث خط الطول
      }));

      // إضافة الماركر للموقع
      new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
    });

    // استرجاع الأماكن من Firestore عند تحميل الصفحة
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'places'));
      const placesArray = querySnapshot.docs.map(doc => doc.data());
      setPlaces(placesArray); // تخزين الأماكن المسترجعة في الـ state
    };

    fetchPlaces(); // استدعاء الدالة لجلب الأماكن من Firestore

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'places'), {
        name: place.name,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        imageUrl: place.imageUrl
      });
      console.log("Place added successfully");

      // تحديث الجدول بعد إضافة المكان
      setPlaces([...places, place]);
      setPlace({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        imageUrl: ''
      });
    } catch (error) {
      console.error("Error adding place: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace({ ...place, [name]: value });
  };

  // دوال تسجيل الدخول والتسجيل
  const registerUser = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered: ", userCredential.user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Error registering: ", error.code, error.message);
      });
  };

  const loginUser = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in: ", userCredential.user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Error logging in: ", error.code, error.message);
      });
  };

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h1>تسجيل الدخول أو التسجيل</h1>
          <button onClick={() => registerUser('test@example.com', 'password123')}>تسجيل مستخدم</button>
          <button onClick={() => loginUser('test@example.com', 'password123')}>تسجيل الدخول</button>
        </div>
      ) : (
        <div>
          <h1>إدارة الأماكن</h1>
          <div id="map" style={{ height: '400px', marginBottom: '20px' }}></div> {/* عنصر الخريطة */}
          <form onSubmit={handleSubmit}>
            <label>اسم المكان:</label>
            <input type="text" name="name" value={place.name} onChange={handleChange} required />
            <label>وصف المكان:</label>
            <textarea name="description" value={place.description} onChange={handleChange} required></textarea>
            <label>خط العرض:</label>
            <input type="text" name="latitude" value={place.latitude} onChange={handleChange} required readOnly />
            <label>خط الطول:</label>
            <input type="text" name="longitude" value={place.longitude} onChange={handleChange} required readOnly />
            <label>رابط الصورة:</label>
            <input type="text" name="imageUrl" value={place.imageUrl} onChange={handleChange} required />
            <button type="submit">إضافة المكان</button>
          </form>

          <h2>الأماكن المضافة</h2>
          <table>
            <thead>
              <tr>
                <th>اسم المكان</th>
                <th>الوصف</th>
                <th>الإحداثيات</th>
                <th>رابط الصورة</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, index) => (
                <tr key={index}>
                  <td>{place.name}</td>
                  <td>{place.description}</td>
                  <td>{place.latitude}, {place.longitude}</td>
                  <td><a href={place.imageUrl} target="_blank" rel="noopener noreferrer">عرض الصورة</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
