from sqlalchemy.orm import Session
from ..models.iot_data import IoTData
from ..schemas.iot_data import IoTDataCreate

def create_iot_data(db: Session, iot_data: IoTDataCreate):
    db_iot_data = IoTData(**iot_data.dict())
    db.add(db_iot_data)
    db.commit()
    db.refresh(db_iot_data)
    return db_iot_data

def get_latest_iot_data(db: Session, patient_id: int):
    return db.query(IoTData).filter(IoTData.patient_id == patient_id).order_by(IoTData.timestamp.desc()).first()

def get_iot_data_history(db: Session, patient_id: int, limit: int = 100):
    return db.query(IoTData).filter(IoTData.patient_id == patient_id).order_by(IoTData.timestamp.desc()).limit(limit).all()