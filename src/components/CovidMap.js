import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const CovidMap = ({ showMap, selectedState, totalCases }) => {
  if (!showMap) return null;

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[20.5937, 78.9629]}>
        <Popup>
          {selectedState ? selectedState : 'India'} <br /> Total Cases: {totalCases}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default CovidMap;
