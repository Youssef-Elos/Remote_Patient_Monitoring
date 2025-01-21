import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import classNames from 'classnames';

interface TemperatureDisplayProps {
  patientId: string;
}

const TemperatureDisplay = ({ patientId }: TemperatureDisplayProps) => {
  const { theme } = useTheme();
  const [temperature, setTemperature] = useState<number>(0);
  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const iotResponse = await axios.get(`http://localhost:8000/api/v1/iot_data/latest/${patientId}`);
        const newTemperature = iotResponse.data.data.temperature;

        setTemperature(newTemperature);
        setTemperatureData((prevData) => [...prevData.slice(-49), newTemperature]);

        setUpdated(true);
        setTimeout(() => setUpdated(false), 500);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500);

    return () => clearInterval(interval);
  }, [patientId]);

  if (error) return <div className="error">Erreur : {error}</div>;

  const isDangerous = temperature > 38;

  return (
    <Card className={`max-w-2xl ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} min-w-l`}>
      <CardHeader>
        <CardTitle>Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-lg">Température:</div>
          <div
            className={classNames(
              'text-3xl font-bold',
              isDangerous ? 'text-red-600' : updated ? 'text-green-500' : 'text-black'
            )}
          >
            {temperature} °C
          </div>
        </div>
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={temperatureData.map((temp, index) => ({ temp, index }))}>
              <XAxis dataKey="index" />
              <YAxis domain={[34, 40]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="temp"
                stroke={theme === 'dark' ? '#FF0000' : '#33ccff'}
                fill={theme === 'dark' ? '#ff4d4d' : '#99dfff'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureDisplay;
