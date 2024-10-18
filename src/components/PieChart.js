import React from 'react';
import Plot from 'react-plotly.js';

const PieChart = ({ totalCases, activeCases, recoveredCases, deaths, selectedState }) => {
  const pieChartData = [
    totalCases,
    activeCases,
    recoveredCases,
    deaths,
  ];

  return (
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
  );
};

export default PieChart;
