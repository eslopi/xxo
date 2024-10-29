import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '../firebase';

mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsb3BpIiwiYSI6ImNtMWV6OHI3eDFoeGMybHF6bmR0OXcwbWIifQ.PgBVsl5bPmcOQ_47NDK10A';

const Index = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadPlaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'places'));
      const placesData = querySnapshot.docs.map(doc => doc.data());
      setPlaces(placesData);
    };

    if (!mapRef.current) {
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

    places.forEach((place) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([place.longitude, place.latitude])
        .addTo(mapRef.current);

      marker.getElement().addEventListener('click', () => {
        setSelectedPlace(place);
      });
    });
  }, [places]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div id="info-panel" style={{ width: '50%', padding: '20px' }}>
        <h2>MY STYLE MY VISION</h2>
        {selectedPlace ? (
          <div id="place-info">
            <h3>{selectedPlace.name}</h3>
            <p>{selectedPlace.description}</p>
            <img src={selectedPlace.imageUrl} alt={selectedPlace.name} style={{ width: '100%', height: 'auto' }} />
            <button id="botChat" className="chat-button" onClick={() => alert("سيتم فتح MS|MV مساعد بوت.")}>
              🛠 MS|MV مساعد بوت
            </button>
            <button id="liveChat" className="chat-button" onClick={() => alert("سيتم فتح دردشة حية مع المتواجدين")}>
              💬 دردشة حية مع المتواجدين
            </button>
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
