from src.data.database import engine
from src.models.iot_data import Base as IoTDataBase
from src.models.patient import Base as PatientBase

def create_tables():
    IoTDataBase.metadata.create_all(bind=engine)
    PatientBase.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Tables created successfully.")