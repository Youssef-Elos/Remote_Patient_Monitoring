import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Line } from 'react-chartjs-2';
import classNames from 'classnames';

interface BloodPressureDisplayProps {
  patientId: string;
}

const BloodPressureDisplay = ({ patientId }: BloodPressureDisplayProps) => {
  const { theme } = useTheme(); // Gestion du thème
  const [systolic, setSystolic] = useState<number>(0);
  const [diastolic, setDiastolic] = useState<number>(0);
  const [bloodPressureData, setBloodPressureData] = useState<Array<{ systolic: number, diastolic: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false); // Suivi des mises à jour

  useEffect(() => {
    const fetchData = async () => {
      try {
        const iotResponse = await axios.get(`http://localhost:8000/api/v1/iot_data/latest/${patientId}`);
        const bloodPressure = iotResponse.data.data.blood_pressure;

        // Split blood pressure (e.g., "120/80")
        const [systolicValue, diastolicValue] = bloodPressure.split('/').map(Number);

        setSystolic(systolicValue);
        setDiastolic(diastolicValue);

        // Ajouter les nouvelles valeurs au graphique
        setBloodPressureData((prevData) => [...prevData.slice(-49), { systolic: systolicValue, diastolic: diastolicValue }]);

        // Indiquer que les données ont été mises à jour
        setUpdated(true);
        setTimeout(() => setUpdated(false), 500); // Le clignotement dure 500ms

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500); // Mise à jour toutes les 500 ms

    return () => clearInterval(interval);
  }, [patientId]);

  if (error) return <div className="error">Erreur : {error}</div>;

  const isDangerous = systolic > 140 || diastolic > 90;

  // Données pour le graphique
  const chartData = {
    labels: bloodPressureData.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Systolic',
        data: bloodPressureData.map((data) => data.systolic),
        borderColor: theme === 'dark' ? '#FF0000' : '#ff5733', // Rouge si mode sombre
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Diastolic',
        data: bloodPressureData.map((data) => data.diastolic),
        borderColor: theme === 'dark' ? '#00FF00' : '#33ccff', // Vert si mode sombre
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        min: 40,
        max: 180,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card className={`max-w-2xl ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} min-w-l`}>
      <CardHeader>
        <CardTitle>Blood Pressure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-lg">Systolic:</div>
          <div
            className={classNames(
              'text-xl font-bold',
              isDangerous ? 'text-red-600' : updated ? 'text-green-500' : 'text-black'
            )}
          >
            {systolic} mmHg
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-lg">Diastolic:</div>
          <div
            className={classNames(
              'text-xl font-bold',
              isDangerous ? 'text-red-600' : updated ? 'text-green-500' : 'text-black'
            )}
          >
            {diastolic} mmHg
          </div>
        </div>

        {/* Affichage du graphique */}
        <div className="h-40 mt-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodPressureDisplay;
