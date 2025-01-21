from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import patients, iot_data  # Changed from relative to absolute import

app = FastAPI(title="Remote Patient Monitoring System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include the routers
app.include_router(patients.router, prefix="/api/v1", tags=["patients"])
app.include_router(iot_data.router, prefix="/api/v1", tags=["iot_data"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Remote Patient Monitoring System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)