import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTheme } from 'next-themes';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HeartRateDisplayProps {
  patientId: string;
}

const HeartRateDisplay = ({ patientId }: HeartRateDisplayProps) => {
  const { theme } = useTheme(); // Get the current theme
  const [heartRateData, setHeartRateData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const iotResponse = await axios.get(`http://localhost:8000/api/v1/iot_data/latest/${patientId}`);
        const newHeartRate = iotResponse.data.data.heart_rate;

        // Add the new heart rate to the data array, limiting to the last 50 entries
        setHeartRateData((prevData) => [...prevData.slice(-49), newHeartRate]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500); // Update every 500 ms

    return () => clearInterval(interval);
  }, [patientId]); // Use patientId in dependency array

  if (error) return <div className="error">Erreur : {error}</div>;

  // Prepare data for the ECG chart
  const ecgData = {
    labels: heartRateData.map((_, index) => index + 1), // Create labels based on the index
    datasets: [
      {
        label: 'ECG',
        data: heartRateData,
        borderColor: theme === 'dark' ? '#FF0000' : '#ff5733', // Change color based on theme
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const ecgOptions = {
    scales: {
      x: {
        display: true, // Show the X-axis
      },
      y: {
        display: true, // Show the Y-axis
        min: Math.min(...heartRateData) - 20, // Adjust to show minimum
        max: Math.max(...heartRateData) + 20, // Adjust to show maximum
      },
    },
    elements: {
      point: {
        radius: 0, // No point markers
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card className={`max-w-2xl ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} min-w-l`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            <i className="fas fa-heart"></i> {heartRateData[heartRateData.length - 1]} BPM
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-40">
        <Line data={ecgData} options={ecgOptions} />
      </CardContent>
    </Card>
  );
};

export default HeartRateDisplay;
