import React from 'react';
import Plot from 'react-plotly.js';

const LineChart = ({ totalCases, activeCases, recoveredCases, deaths, selectedState }) => {
  const lineChartData = [
    {
      x: ['Total Cases', 'Active Cases', 'Recovered', 'Deaths'],
      y: [totalCases, activeCases, recoveredCases, deaths],
      type: 'scatter',
      mode: 'lines+markers',
      name: selectedState ? selectedState : 'India',
    },
  ];

  return (
    <Plot
      data={lineChartData}
      layout={{
        title: `COVID-19 Line Chart for ${selectedState ? selectedState : 'India'}`,
        xaxis: { title: 'Categories' },
        yaxis: { title: 'Number of Cases' },
      }}
    />
  );
};

export default LineChart;
