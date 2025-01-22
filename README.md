# Remote Patient Monitoring System
![alt text](https://github.com/Youssef-Elos/Remote_Patient_Monitoring/blob/main/Frontend/white.PNG?raw=true)
![alt text](https://github.com/Youssef-Elos/Remote_Patient_Monitoring/blob/main/Frontend/black.PNG)
## About the Project
The Remote Patient Monitoring System is a full-stack application designed to monitor patient health data in real time. The project integrates a backend API built with FastAPI, a simulated IoT device to generate patient health data, and a React-based front-end dashboard for visualizing the data. The application is particularly useful for remote healthcare providers to track patient vitals and provide timely interventions.

## Features
- Real-time patient health data visualization (e.g., heart rate, blood pressure, etc.).
- CRUD operations for managing patient records.
- Simulated IoT device to send health data to the backend.
- Responsive and professional UI for the front-end dashboard.

## Getting Started
Follow the steps below to set up and run the project.

### Prerequisites
1. **Python**: Install Python 3.8+ from [python.org](https://www.python.org/downloads/).
2. **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
3. **Virtual Environment**: Set up a Python virtual environment (recommended).

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
###Install required Python dependencies:


   ```bash
    pip install -r requirements.txt
   ```

Launch the backend server:



uvicorn src.main:app --reload

The backend API will be available at http://127.0.0.1:8000.
IoT Device Setup
Navigate to the iot_device/src directory:


```bash
cd iot_device/src
```
Run the simulated IoT device:


```bash
python simulate_device.py
```
Frontend Setup
Navigate to the frontend directory:


```bash
cd frontend
```
Install the required Node.js modules:


```bash
npm install
```
Start the development server:


```bash
npm run dev
```
##The front-end dashboard will be accessible at http://localhost:3000.
Usage
Start the backend API server.
Run the simulated IoT device to generate and send health data.
Access the front-end dashboard to visualize real-time patient health data.
###Contributing
Contributions are welcome! Please fork the repository and create a pull request with your improvements.
