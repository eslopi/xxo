import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '../firebase';

mapboxgl.accessToken = 'your-mapbox-access-token';

const Index = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // استخدم useRef لتجنب إعادة تهيئة الخريطة
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // استخدم useRef للاحتفاظ بالخريطة

  useEffect(() => {
    const loadPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'places'));
      const placesData = querySnapshot.docs.map(doc => doc.data());
      setPlaces(placesData);
    };

    if (!mapRef.current) {
      // تهيئة الخريطة مرة واحدة فقط
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [46.6753, 24.7136],
        zoom: 5
      });

      mapRef.current.on('load', () => {
        loadPlaces();
      });
    }

    // إضافة الماركرات بعد تحميل الأماكن
    places.forEach((place) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([place.longitude, place.latitude])
        .addTo(mapRef.current); // استخدم الخريطة من المرجع

      marker.getElement().addEventListener('click', () => {
        setSelectedPlace(place);
      });
    });
  }, [places]);

  const handleBotChat = () => {
    alert("سيتم فتح MS|MV مساعد بوت.");
  };

  const handleLiveChat = () => {
    if (selectedPlace) {
      const db = getDatabase();
      const chatRef = ref(db, 'liveChats/' + selectedPlace.id);
      const messageInput = prompt('أدخل رسالتك:');

      if (messageInput) {
        push(chatRef, { message: messageInput, user: 'UserName' });
      }

      onValue(chatRef, (snapshot) => {
        const newMessages = [];
        snapshot.forEach((messageSnapshot) => {
          newMessages.push(messageSnapshot.val());
        });
        setMessages(newMessages);
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div id="info-panel" style={{ width: '50%', padding: '20px' }}>
        <h2>MY STYL MY VISION</h2>
        {selectedPlace ? (
          <div id="place-info">
            <h3>{selectedPlace.name}</h3>
            <p>{selectedPlace.description}</p>
            <img src={selectedPlace.imageUrl} alt={selectedPlace.name} style={{ width: '100%', height: 'auto' }} />
            <button id="botChat" className="chat-button" onClick={handleBotChat}>🛠 MS|MV مساعد بوت</button>
            <button id="liveChat" className="chat-button" onClick={handleLiveChat}>💬 دردشة حية مع المتواجدين</button>
            <div id="chatWindow" style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '200px', overflowY: 'scroll' }}>
              {messages.map((msg, index) => (
                <p key={index}><strong>{msg.user}:</strong> {msg.message}</p>
              ))}
            </div>
          </div>
        ) : (
          <p id="initial-message">استمتع اكتشف شارك مع MS|MV احداث لا تنسى</p>
        )}
      </div>
      <div id="map" ref={mapContainerRef} style={{ width: '50%', position: 'relative' }}></div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); 
  root.render(<Index />);
} else {
  console.error('عنصر DOM "root" غير موجود.');
}

export default Index;
