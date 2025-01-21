import requests
import time
import random
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load configuration from environment variables
API_URL = os.getenv('API_URL', 'http://localhost:8000')
SEND_INTERVAL = int(os.getenv('SEND_INTERVAL', '1'))  # seconds

# Load device and patient configurations
DEVICES = json.loads(os.getenv('DEVICES', '{}'))

def generate_vital_signs():
    """Generate mock vital signs data."""
    return {
        'heart_rate': random.randint(60, 100),
        'blood_pressure': f"{random.randint(100, 140)}/{random.randint(60, 90)}",
        'temperature': round(random.uniform(36.1, 37.5), 1),
        'oxygen_saturation': random.randint(95, 100),
        'respiratory_rate': random.randint(12, 20),
    }

def send_data(device_id, patient_id, data):
    """Send data to the backend API."""
    url = f"{API_URL}/api/v1/iot_data/"
    payload = {
        'device_id': device_id,
        'patient_id': int(patient_id),
        'timestamp': datetime.now().isoformat(),
        'data': data
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print(f"Data sent successfully for Device {device_id}, Patient {patient_id}: {json.dumps(payload, indent=2)}")
    except requests.RequestException as e:
        print(f"Failed to send data for Device {device_id}, Patient {patient_id}: {e}")
        print(f"Response content: {e.response.content if e.response else 'No response'}")

def main():
    print(f"IoT Device Simulator started. Sending data every {SEND_INTERVAL} seconds.")
    print(f"API URL: {API_URL}")
    print(f"Devices and Patients: {DEVICES}")

    while True:
        for device_id, patient_id in DEVICES.items():
            vital_signs = generate_vital_signs()
            send_data(device_id, patient_id, vital_signs)
        time.sleep(SEND_INTERVAL)

if __name__ == "__main__":
    main()