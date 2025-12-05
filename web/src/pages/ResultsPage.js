import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ResultsPage.css";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
// ResultsPage Component to display simulation results and charts
const ResultsPage = () => {
  const location = useLocation();
  const { videoUrl, results } = location.state || {};
  const [isVideoVisible, setIsVideoVisible] = useState(false); // State to manage video visibility
  const speciesNames = Object.keys(results?.distinctCreatures || {});

  // Check if video URL is provided in the location state data
  if (!videoUrl) {
    return <div>Error: No video URL provided.</div>;
  }

  //console.log(videoUrl);

  // Structure data for charts using already binned data
  const structuredCreatureCountData = results?.creatureCount.map((value, index) => ({
    x: index + 1,
    y: value,
  }));

  // Structure data for charts for species counts over time
  const structuredSpeciesCountsData = speciesNames.map((speciesName) => {
    const creatureData = results.distinctCreatures[speciesName];
    return {
      label: speciesName,
      data: creatureData.count.map((value, index) => ({
        x: index + 1,
        y: value,
      })),
      borderColor: `rgba(${creatureData.color.r}, ${creatureData.color.g}, ${creatureData.color.b}, 1)`,
      fill: true,
      pointStyle: false,
      cubicInterpolationMode: "monotone",
    };
  });

  // Structure data for charts for birth count
  const structuredBirthCountData = results?.birthCount.map((value, index) => ({
    x: index + 1,
    y: value,
  }));

  // Structure data for charts for death count
  const structuredDeathCountData = results?.deathCount.map((value, index) => ({
    x: index + 1,
    y: value,
  }));

  // Structure data for charts for death breakdown by cause
  const deathBreakdownData = {
    labels: ["Age", "Starvation", "Predation"],
    datasets: [
      {
        data: [results.deathTypeCount.age, results.deathTypeCount.hunger, results.deathTypeCount.predation],
        backgroundColor: ["rgba(75,192,192,0.6)", "rgba(153,102,255,0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75,192,192,1)", "rgba(153,102,255,1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Structure data for charts for food count
  const structuredFoodCountData = results?.foodCount.map((value, index) => ({
    x: index + 1,
    y: value,
  }));

  // Options for line chart
  const chartOptions = {
    maintainAspectRatio: true,
    responsive: true,
    parsing: false,
    layout: {
      padding: {
        bottom: 20, // Add some padding to the bottom
      },
    },
    scales: {
      x: {
        type: "linear",
        beginAtZero: false,
      },
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  // Options for bar chart
  const barChartOptions = {
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      x: {
        type: "category", // Use 'category' scale for bar charts
        beginAtZero: true,
        stacked: true, // Enable stacking on the x-axis
        grid: {
          display: false, // Optional: hide x-axis gridlines
        },
      },
      y: {
        beginAtZero: true,
        stacked: true, // Enable stacking on the y-axis
        grid: {
          display: true, // Show y-axis gridlines
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  // Options for pie chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  // Function to toggle video visibility on button click
  const toggleVideoVisibility = () => {
    setIsVideoVisible(!isVideoVisible);
  };

  return (
    <div className="results-container">
      <h1>Simulation Results</h1>
      {isVideoVisible && (
        <div className="video-container">
          <video src={videoUrl} controls autoPlay />
        </div>
      )}
      <button onClick={toggleVideoVisibility} className="toggle-button">
        {isVideoVisible ? "Hide Video" : "Show Video"}
      </button>
      <div className="charts-container">
        {/* Total Creature Count over Time */}
        <div className="chart">
          <h2>Total Creature Count over Time</h2>
          <Line
            data={{
              datasets: [
                {
                  label: "Total Creature Count",
                  data: structuredCreatureCountData,
                  borderColor: "rgba(75,192,192,1)",
                  fill: true,
                  pointStyle: false,
                  cubicInterpolationMode: "monotone",
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        {/* Species Counts over Time */}
        <div className="chart">
          <h2>Species Counts over Time</h2>
          <Line data={{ datasets: structuredSpeciesCountsData }} options={chartOptions} />
        </div>

        {/* Total Births over Time */}
        <div className="chart">
          <h2>Total Births over Time</h2>
          <Bar
            data={{
              labels: structuredBirthCountData.map((_, index) => `Bin ${index + 1}`),
              datasets: [
                {
                  label: "Birth Count",
                  data: structuredBirthCountData,
                  backgroundColor: "rgba(0, 123, 255, 0.8)",
                  borderColor: "rgba(0, 123, 255, 1)",
                  barPercentage: 1,
                  categoryPercentage: 1,
                },
              ],
            }}
            options={barChartOptions}
          />
        </div>

        {/* Species Births over Time */}
        <div className="chart">
          <h2>Species Births over Time</h2>
          <Bar
            data={{
              labels: structuredBirthCountData.map((_, index) => `Bin ${index + 1}`),
              datasets: speciesNames.map((speciesName) => {
                const creatureData = results.distinctCreatures[speciesName];
                return {
                  label: `${speciesName} Births`,
                  data: creatureData.births.map((value, index) => ({
                    x: index + 1,
                    y: value,
                  })),
                  backgroundColor: `rgba(${creatureData.color.r}, ${creatureData.color.g}, ${creatureData.color.b}, 0.8)`,
                  borderColor: `rgba(${creatureData.color.r}, ${creatureData.color.g}, ${creatureData.color.b}, 1)`,
                  barPercentage: 1,
                  categoryPercentage: 1,
                };
              }),
            }}
            options={barChartOptions}
          />
        </div>

        {/* Total Deaths over Time */}
        <div className="chart">
          <h2>Total Deaths over Time</h2>
          <Bar
            data={{
              labels: structuredDeathCountData.map((_, index) => `Bin ${index + 1}`),
              datasets: [
                {
                  label: "Death Count",
                  data: structuredDeathCountData,
                  backgroundColor: "rgba(0, 123, 255, 0.8)",
                  borderColor: "rgba(0, 123, 255, 1)",
                  barPercentage: 1,
                  categoryPercentage: 1,
                },
              ],
            }}
            options={barChartOptions}
          />
        </div>

        {/* Species Deaths over Time */}
        <div className="chart">
          <h2>Species Deaths over Time</h2>
          <Bar
            data={{
              labels: structuredDeathCountData.map((_, index) => `Bin ${index + 1}`),
              datasets: speciesNames.map((speciesName) => {
                const creatureData = results.distinctCreatures[speciesName];
                return {
                  label: `${speciesName} Deaths`,
                  data: creatureData.deaths.map((value, index) => ({
                    x: index + 1,
                    y: value,
                  })),
                  backgroundColor: `rgba(${creatureData.color.r}, ${creatureData.color.g}, ${creatureData.color.b}, 0.8)`,
                  borderColor: `rgba(${creatureData.color.r}, ${creatureData.color.g}, ${creatureData.color.b}, 1)`,
                  barPercentage: 1,
                  categoryPercentage: 1,
                };
              }),
            }}
            options={barChartOptions}
          />
        </div>

        {/* Death Breakdown by Cause (Pie Chart) */}
        <div className="chart">
          <h2>Death Breakdown by Cause</h2>
          <Pie data={deathBreakdownData} options={pieChartOptions} />
        </div>

        {/* Food Availability over Time */}
        <div className="chart">
          <h2>Food Availability over Time</h2>
          <Line
            data={{
              datasets: [
                {
                  label: "Food Availability",
                  data: structuredFoodCountData,
                  borderColor: "rgba(153,102,255,1)",
                  fill: true,
                  pointStyle: false,
                  cubicInterpolationMode: "monotone",
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
