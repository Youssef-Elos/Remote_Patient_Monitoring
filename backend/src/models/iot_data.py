from sqlalchemy import Column, Integer, String, DateTime, JSON
from ..data.database import Base

class IoTData(Base):
    __tablename__ = "iot_data"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    patient_id = Column(Integer, index=True)
    timestamp = Column(DateTime, index=True)
    data = Column(JSON)