import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import classNames from 'classnames';

interface OxygenSaturationDisplayProps {
  patientId: string;
}

const OxygenSaturationDisplay = ({ patientId }: OxygenSaturationDisplayProps) => {
  const { theme } = useTheme();
  const [oxygenSaturation, setOxygenSaturation] = useState<number>(0);
  const [oxygenSaturationData, setOxygenSaturationData] = useState<number[]>([]);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const iotResponse = await axios.get(`http://localhost:8000/api/v1/iot_data/latest/${patientId}`);
        const newOxygenSaturation = iotResponse.data.data.oxygen_saturation;

        setOxygenSaturation(newOxygenSaturation);
        setOxygenSaturationData((prevData) => [...prevData.slice(-49), newOxygenSaturation]);

        setUpdated(true);
        setTimeout(() => setUpdated(false), 500);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500);

    return () => clearInterval(interval);
  }, [patientId]);

  if (error) return <div className="error">Erreur : {error}</div>;

  const isDangerous = oxygenSaturation < 90;

  return (
    <Card className={`max-w-2xl ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} min-w-l`}>
      <CardHeader>
        <CardTitle>Oxygen Saturation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-lg">Saturation Oxygène:</div>
          <div
            className={classNames(
              'text-xl font-bold',
              isDangerous ? 'text-red-600' : updated ? 'text-green-500' : 'text-black'
            )}
          >
            {oxygenSaturation} %
          </div>
        </div>
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={oxygenSaturationData.map((saturation, index) => ({ saturation, index }))}>
              <XAxis dataKey="index" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Bar
                dataKey="saturation"
                fill={theme === 'dark' ? '#00FF00' : '#33ccff'}
                stroke={isDangerous ? '#FF0000' : theme === 'dark' ? '#00FF00' : '#33ccff'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OxygenSaturationDisplay;
