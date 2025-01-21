from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.patient import Patient, PatientCreate
from ..services import patient_service
from ..data.database import get_db
from ..models.patient import Patient as PatientModel
router = APIRouter()

@router.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        # Tentez de récupérer des patients pour tester la connexion
        patients = db.query(PatientModel).all()  # Remplacez `Patient` par votre modèle SQLAlchemy
        return {"patients": patients}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/patients/", response_model=Patient)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    return patient_service.create_patient(db=db, patient=patient)

@router.get("/patients/{patient_id:int}", response_model=Patient)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = patient_service.get_patient(db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.get("/patients/", response_model=list[Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = patient_service.get_patients(db, skip=skip, limit=limit)
    return patients

@router.put("/patients/{patient_id:int}", response_model=Patient)
def update_patient(patient_id: int, patient_data: dict, db: Session = Depends(get_db)):
    updated_patient = patient_service.update_patient(db, patient_id, patient_data)
    if updated_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated_patient

@router.delete("/patients/{patient_id:int}", response_model=Patient)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    deleted_patient = patient_service.delete_patient(db, patient_id)
    if deleted_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return deleted_patient