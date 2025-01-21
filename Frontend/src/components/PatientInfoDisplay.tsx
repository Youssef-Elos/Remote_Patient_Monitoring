import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Utiliser les composants de ShadCN
import { format } from 'date-fns';

interface PatientInfoDisplayProps {
  patientId: string;
  name: string;
  age: number;
  timestamp: string;
  pictureUrl: string;
}

const PatientInfoDisplay = ({ name, age, timestamp, pictureUrl }: PatientInfoDisplayProps) => {
  const formattedTime = format(new Date(timestamp), 'PPpp'); // Formatage de l'heure

  return (
    <Card className="flex flex-col items-center text-center max-w-xs mx-auto">
      <CardHeader>
        <img src={pictureUrl} alt={`${name}'s picture`} className="w-24 h-24 rounded-full mb-4" />
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-sm text-gray-500">Âge : {age} ans</p>
        <p className="text-sm text-gray-400">Dernière mise à jour : {formattedTime}</p>
      </CardContent>
    </Card>
  );
};

export default PatientInfoDisplay;
