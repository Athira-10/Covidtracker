import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from './PieChart';
import LineChart from './LineChart';
import CovidMap from './CovidMap';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import LoadingSpinner from './LoadingSpinner';
import L from 'leaflet';

const CovidTracking = () => {
  const [data, setData] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [statesList, setStatesList] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const API_URL = "https://disease.sh/v3/covid-19/countries/India?strict=true";
  const STATES_API_URL = "https://disease.sh/v3/covid-19/gov/India";


  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

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
        <div className="data-card">
          <h2>{selectedState ? selectedState : 'India'}</h2>
          <div className="cases-row">
            <p>Total Cases: {totalCases}</p>
            <p>Active Cases: {activeCases}</p>
          </div>
          <div className="cases-row">
            <p>Recovered: {recoveredCases}</p>
            <p>Deaths: {deaths}</p>
          </div>
        </div>


        <PieChart
          totalCases={totalCases}
          activeCases={activeCases}
          recoveredCases={recoveredCases}
          deaths={deaths}
          selectedState={selectedState}
        />

        <LineChart
          totalCases={totalCases}
          activeCases={activeCases}
          recoveredCases={recoveredCases}
          deaths={deaths}
          selectedState={selectedState}
        />

        <div className="button-container">
          <button className="map-toggle-button" onClick={toggleMapVisibility}>
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        <CovidMap
          showMap={showMap}
          selectedState={selectedState}
          totalCases={totalCases}
        />
      </div>
    </div>
  );
};

export default CovidTracking;
