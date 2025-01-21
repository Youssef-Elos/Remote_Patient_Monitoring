from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any

class IoTDataBase(BaseModel):
    device_id: str
    patient_id: int
    timestamp: datetime
    data: Dict[str, Any]

class IoTDataCreate(IoTDataBase):
    pass

class IoTData(IoTDataBase):
    id: int

    class Config:
        orm_mode = True