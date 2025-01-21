import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import classNames from 'classnames';

interface RespiratoryRateDisplayProps {
  patientId: string;
}

const RespiratoryRateDisplay = ({ patientId }: RespiratoryRateDisplayProps) => {
  const { theme } = useTheme();
  const [respiratoryRate, setRespiratoryRate] = useState<number>(0);
  const [respiratoryRateData, setRespiratoryRateData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const iotResponse = await axios.get(`http://localhost:8000/api/v1/iot_data/latest/${patientId}`);
        const newRespiratoryRate = iotResponse.data.data.respiratory_rate;

        setRespiratoryRate(newRespiratoryRate);
        setRespiratoryRateData((prevData) => [...prevData.slice(-49), newRespiratoryRate]);

      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500);

    return () => clearInterval(interval);
  }, [patientId]);

  if (error) return <div className="error">Erreur : {error}</div>;

  const isDangerous = respiratoryRate < 12 || respiratoryRate > 25;

  return (
    <Card className={`max-w-2xl ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} min-w-l`}>
      <CardHeader>
        <CardTitle>Respiratory Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={classNames('respiratory-rate', { 'text-red-500': isDangerous })}>
          <p>Current Respiratory Rate: {respiratoryRate} breaths per minute</p>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <XAxis dataKey="index" type="number" name="Time" />
              <YAxis dataKey="value" type="number" name="Respiratory Rate" domain={[0, 40]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={respiratoryRateData.map((value, index) => ({ index, value }))} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RespiratoryRateDisplay;