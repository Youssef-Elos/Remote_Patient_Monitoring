from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.iot_data import IoTData, IoTDataCreate
from ..services import iot_service
from ..data.database import get_db
import logging

router = APIRouter()

@router.post("/iot_data/", response_model=IoTData)
def create_iot_data(iot_data: IoTDataCreate, db: Session = Depends(get_db)):
    try:
        logging.info(f"Received IoT data: {iot_data}")
        result = iot_service.create_iot_data(db=db, iot_data=iot_data)
        logging.info(f"Successfully created IoT data: {result}")
        return result
    except Exception as e:
        logging.error(f"Error creating IoT data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/iot_data/latest/{patient_id}", response_model=IoTData)
def get_latest_iot_data(patient_id: int, db: Session = Depends(get_db)):
    data = iot_service.get_latest_iot_data(db, patient_id=patient_id)
    if data is None:
        raise HTTPException(status_code=404, detail="No IoT data found for this patient")
    return data

@router.get("/iot_data/history/{patient_id}", response_model=list[IoTData])
def get_iot_data_history(patient_id: int, limit: int = 100, db: Session = Depends(get_db)):
    return iot_service.get_iot_data_history(db, patient_id=patient_id, limit=limit)