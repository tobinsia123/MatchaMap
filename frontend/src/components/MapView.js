import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default markers in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Custom matcha icon
const createMatchaIcon = (isFeatured, imageUrl) => {
  // If an image URL is provided, render the image inside the marker. Otherwise fall back to emoji.
  const imgHtml = imageUrl
    ? `<img src="${imageUrl}" class="marker-thumb" alt="spot"/>`
    : '🍵';

  return L.divIcon({
    className: 'matcha-marker',
    html: `
      <div class="marker-container ${isFeatured ? 'featured' : ''}">
        <div class="marker-arrow"></div>
        <div class="marker-icon">${imgHtml}</div>
      </div>
    `,
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -50],
  });
};

// Custom user location icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-marker-container">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-pin"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to handle map centering
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const MapView = ({ spots, onMarkerClick, selectedSpot, onUserLocationChange }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const updateUserLocation = (coords) => {
    setUserLocation(coords);
    if (typeof onUserLocationChange === 'function') {
      onUserLocationChange(coords);
    }
  };
  
  // Default center for Irvine, CA
  const defaultCenter = [33.6846, -117.8265];
  const defaultZoom = 13;

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateUserLocation([latitude, longitude]);
          setLocationError(null);
          // Center map on user location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15, {
              animate: true,
              duration: 1.0
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError(error.message);
          updateUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  // Get user's current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Center map on selected spot
  useEffect(() => {
    if (selectedSpot && selectedSpot.latitude && selectedSpot.longitude && mapRef.current) {
      const position = [parseFloat(selectedSpot.latitude), parseFloat(selectedSpot.longitude)];
      mapRef.current.setView(position, 16, {
        animate: true,
        duration: 1.0
      });
    }
  }, [selectedSpot]);

  return (
    <div className="map-container">
      {/* My Location Button */}
      <button 
        className="my-location-btn"
        onClick={getCurrentLocation}
        title="Show my location"
      >
        <span className="location-icon">📍</span>
      </button>
      {/* Brand / logo (clickable but inert for now) */}
      <a href="#" className="map-brand" onClick={(e) => e.preventDefault()}>
        <img src="/MatchaverseLogo.png" alt="logo" className="map-brand-logo" />
        <span className="map-brand-text">Matchaverse</span>
      </a>
      
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={defaultCenter} zoom={defaultZoom} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="map-popup">
                <h3>📍 Your Location</h3>
                <p className="popup-address">You are here</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {spots.map((spot) => {
          if (spot.latitude && spot.longitude) {
            const position = [parseFloat(spot.latitude), parseFloat(spot.longitude)];
            return (
              <Marker
                key={spot.id}
                position={position}
                icon={createMatchaIcon(spot.is_featured, spot.image_url)}
                eventHandlers={{
                  click: () => onMarkerClick(spot),
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <h3>{spot.name}</h3>
                    {spot.rating && (
                      <p className="popup-rating">⭐ {parseFloat(spot.rating).toFixed(1)}</p>
                    )}
                    <p className="popup-address">{spot.address}</p>
                    {spot.price_range && (
                      <p className="popup-price">{spot.price_range}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
      {/* Brand / logo (clickable but inert for now) */}
      <a href="#" className="map-brand" onClick={(e) => e.preventDefault()}>
        <img src="/MatchaverseLogo.png" alt="logo" className="map-brand-logo" />
        <span className="map-brand-text">Matchaverse</span>
      </a>
    </div>
  );
};

export default MapView;

