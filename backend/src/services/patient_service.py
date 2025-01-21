from sqlalchemy.orm import Session
from ..models.patient import Patient
from ..schemas.patient import PatientCreate

def get_patient(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.id == patient_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Patient).offset(skip).limit(limit).all()

def create_patient(db: Session, patient: PatientCreate):
    db_patient = Patient(
    name=patient.name,
    email=patient.email,
    date_of_birth=patient.date_of_birth,
    medical_history=patient.medical_history
)

    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient_id: int, patient_data: dict):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient:
        for key, value in patient_data.items():
            setattr(db_patient, key, value)
        db.commit()
        db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, patient_id: int):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if db_patient:
        db.delete(db_patient)
        db.commit()
    return db_patient