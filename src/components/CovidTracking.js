import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import LoadingSpinner from './LoadingSpinner'; 

const CovidTracking = () => {
  const [data, setData] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [statesList, setStatesList] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const API_URL = "https://disease.sh/v3/covid-19/countries/India?strict=true";
  const STATES_API_URL = "https://disease.sh/v3/covid-19/gov/India";

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    
    const fetchStatesList = async () => {
      try {
        const response = await axios.get(STATES_API_URL);
        if (response.data && response.data.states) {
          setStatesList(response.data.states.map((state) => state.state));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatesList();
  }, []);

  const fetchStateData = async (state) => {
    try {
      const response = await axios.get(STATES_API_URL);
      const stateInfo = response.data.states.find((item) => item.state === state);
      setStateData(stateInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    if (state) {
      fetchStateData(state);
    } else {
      setStateData(null); 
    }
  };

  const toggleMapVisibility = () => {
    setShowMap(!showMap);
  };

  if (!data) return <LoadingSpinner />; 

 
  const totalCases = stateData ? stateData.cases : data.cases;
  const activeCases = stateData ? stateData.active : data.active;
  const recoveredCases = stateData ? stateData.recovered : data.recovered;
  const deaths = stateData ? stateData.deaths : data.deaths;

  const pieChartData = [
    totalCases,
    activeCases,
    recoveredCases,
    deaths,
  ];

  const lineChartData = [
    {
      x: ['Total Cases', 'Active Cases', 'Recovered', 'Deaths'],
      y: pieChartData,
      type: 'scatter',
      mode: 'lines+markers',
      name: selectedState ? selectedState : 'India',
    },
  ];

  return (
    <div className="App">
      <h1>COVID-19 Tracker in India</h1>

      <select className="custom-select-box" onChange={handleStateChange}>
        <option value="">Select State</option>
        {statesList.map((state, index) => (
          <option key={index} value={state}>
            {state}
          </option>
        ))}
      </select>


      <div>
        <h2>{selectedState ? selectedState : 'India'}</h2>
        <p>Total Cases: {totalCases}</p>
        <p>Active Cases: {activeCases}</p>
        <p>Recovered: {recoveredCases}</p>
        <p>Deaths: {deaths}</p>

        <Plot
          data={[
            {
              values: pieChartData,
              labels: ['Total Cases', 'Active Cases', 'Recovered', 'Deaths'],
              type: 'pie',
            },
          ]}
          layout={{ title: `COVID-19 Data Distribution for ${selectedState ? selectedState : 'India'}` }}
        />

        <Plot
          data={lineChartData}
          layout={{ title: `COVID-19 Line Chart for ${selectedState ? selectedState : 'India'}`, xaxis: { title: 'Categories' }, yaxis: { title: 'Number of Cases' } }}
        />

        <button className="map-toggle-button" onClick={toggleMapVisibility}>
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
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
        )}
      </div>
    </div>
  );
};

export default CovidTracking;
