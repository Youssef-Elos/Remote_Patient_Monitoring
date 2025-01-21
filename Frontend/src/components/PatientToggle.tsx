import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'; // Assurez-vous que ces imports sont corrects en fonction de votre configuration

interface Patient {
  id: string;
  name: string;
}

interface PatientToggleProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onChange: (patient: Patient) => void;
}

const PatientToggle: React.FC<PatientToggleProps> = ({ patients, selectedPatient, onChange }) => {
  const handleChange = (value: string) => {
    const selectedId = value;
    const selected = patients.find(patient => patient.id === selectedId);
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <div className="patient-toggle">
      <label htmlFor="patient-select">Sélectionner un patient :</label>
      <Select value={selectedPatient?.id || ''} onValueChange={handleChange}>
        <SelectTrigger>
          {selectedPatient ? selectedPatient.name : "Choisir un patient"}
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PatientToggle;
