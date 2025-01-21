import { useState, useEffect } from 'react';
import axios from 'axios';
import HeartRateDisplay from './HeartRateDisplay'; // Make sure this path is correct
import PatientToggle from './PatientToggle'; // Import the new PatientToggle component
import { useTheme } from 'next-themes';
import BloodPressureDisplay from './BloodPressureDisplay';
import TemperatureDisplay from './TemperatureDisplay';
import OxygenSaturationDisplay from './OxygenSaturationDisplay';
import RespiratoryRateDisplay from './RespiratoryRateDisplay';


interface Patient {
  id: string;
  name: string;
  // Add other properties as needed
}

const PatientDashboard = () => {
  const { theme } = useTheme();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/patients`);
        setPatients(response.data);
        setSelectedPatient(response.data[0]); // Default to the first patient
      } catch (err) {
        setError((err as any).message);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      const fetchIoTData = async () => {
        try {
          await axios.get(`http://localhost:8000/api/v1/iot_data/latest/${selectedPatient.id}`);
          // Assuming you'll handle the heart rate data in the HeartRateDisplay component
        } catch (err) {
          setError((err as any).message);
        }
      };

      fetchIoTData();
      const interval = setInterval(fetchIoTData, 500); // Update every 500 ms
      return () => clearInterval(interval);
    }
  }, [selectedPatient]);

  if (error) return <div className="error">Erreur : {error}</div>;
  if (!patients.length) return <div className="loading">Chargement...</div>;

  return (
    <div className={`patient-dashboard ${theme === 'dark' ? 'text-white' : 'bg-white text-black'}`}>
      <div className="text-base font-extrabold md:text-lg">
        {/* Composant de sélection du patient */}
        <PatientToggle patients={patients} selectedPatient={selectedPatient} onChange={setSelectedPatient} />
        <br className="hidden sm:inline" />
        
        {/* Afficher les données du patient sélectionné */}
        {selectedPatient && (
          <div className="patient-data-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Afficher le rythme cardiaque */}
            <HeartRateDisplay patientId={selectedPatient.id} />
  
            {/* Afficher la pression artérielle */}
            <BloodPressureDisplay patientId={selectedPatient.id} />
  
            {/* Afficher la température */}
            <TemperatureDisplay patientId={selectedPatient.id} />
  
            {/* Afficher la saturation en oxygène */}
            <OxygenSaturationDisplay patientId={selectedPatient.id} />
  
            {/* Afficher la fréquence respiratoire */}
            <RespiratoryRateDisplay patientId={selectedPatient.id} />
                              
            {/* Afficher les informations du patient */}
            
          </div>
        )}
      </div>
    </div>
  );
};
export default PatientDashboard;
