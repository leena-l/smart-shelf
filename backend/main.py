from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import inventory
from app.db.session import engine, Base

# 1. Automatically create database tables when the Chef starts
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartShelf API - Production")

# 2. Setup CORS (Cross-Origin Resource Sharing)
# This is CRITICAL. Without this, browsers will block the Frontend from 
# talking to the Backend for security reasons.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for your student project
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, DELETE, etc.
    allow_headers=["*"],
)

# 3. Include our Inventory Routes
app.include_router(
    inventory.router, 
    prefix="/api/v1/inventory", 
    tags=["Inventory"]
)

@app.get("/")
def health_check():
    return {"status": "online", "message": "SmartShelf Backend is ready!"}