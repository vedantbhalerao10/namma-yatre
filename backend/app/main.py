import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from .models import (
    TripPlanRequest, Itinerary, Destination, KannadaPhrase,
    BudgetEstimate
)
from .services.destination_service import destination_service
from .services.kannada_service import kannada_service
from .services.budget_service import budget_service
from .services.itinerary_service import itinerary_service
from .services.storage_service import storage_service

app = FastAPI(
    title="Namma Yatre (ನಮ್ಮ ಯಾತ್ರೆ) API",
    description="Backend services for Kannada Digital Innovation Hackathon 2026 - AI Travel Planner & Cultural Companion for Karnataka",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["System"])
def health_check():
    gemini_configured = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {
        "status": "healthy",
        "service": "Namma Yatre API",
        "version": "1.0.0",
        "gemini_live_configured": gemini_configured,
        "mode": "live_ai_enabled" if gemini_configured else "curated_demonstration_mode"
    }

# Destinations Endpoints
@app.get("/api/destinations", response_model=List[Destination], tags=["Destinations"])
def list_destinations(
    category: Optional[str] = Query(None, description="Category filter (heritage, nature, spiritual, coastal, adventure, urban)"),
    search: Optional[str] = Query(None, description="Search keyword")
):
    return destination_service.get_all(category=category, search=search)

@app.get("/api/destinations/{dest_id}", response_model=Destination, tags=["Destinations"])
def get_destination(dest_id: str):
    dest = destination_service.get_by_id(dest_id)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

# Kannada Phrases Endpoints
@app.get("/api/kannada-phrases", response_model=List[KannadaPhrase], tags=["Kannada Companion"])
def list_kannada_phrases(
    category: Optional[str] = Query(None, description="Category filter (greetings, directions, transport, dining, shopping, emergency)"),
    search: Optional[str] = Query(None, description="Search keyword in Kannada or English")
):
    return kannada_service.get_all(category=category, search=search)

# Budget Calculation Endpoint
@app.post("/api/budget/calculate", response_model=BudgetEstimate, tags=["Budget"])
def calculate_budget(
    days: int = Query(..., ge=1, le=14),
    travelers: int = Query(1, ge=1, le=20),
    tier: str = Query("moderate"),
    transport_mode: str = Query("cab_rental"),
    custom_ticket_sum: int = Query(0)
):
    return budget_service.calculate_budget(
        days=days,
        travelers=travelers,
        tier=tier,
        transport_mode=transport_mode,
        custom_ticket_sum=custom_ticket_sum
    )

# Itinerary Endpoints
@app.post("/api/itineraries/generate", response_model=Itinerary, tags=["Itinerary Generator"])
async def generate_itinerary(request: TripPlanRequest):
    try:
        itinerary = await itinerary_service.generate_itinerary(request)
        # Automatically cache to storage service as well
        storage_service.save(itinerary)
        return itinerary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}"
        )

@app.post("/api/itineraries", response_model=Itinerary, tags=["Saved Trips"])
def save_itinerary(itinerary: Itinerary):
    return storage_service.save(itinerary)

@app.get("/api/itineraries", response_model=List[Itinerary], tags=["Saved Trips"])
def list_saved_itineraries():
    return storage_service.list_all()

@app.get("/api/itineraries/{itinerary_id}", response_model=Itinerary, tags=["Saved Trips"])
def get_saved_itinerary(itinerary_id: str):
    itinerary = storage_service.get(itinerary_id)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary

@app.put("/api/itineraries/{itinerary_id}", response_model=Itinerary, tags=["Saved Trips"])
def update_itinerary(itinerary_id: str, updated: Itinerary):
    if updated.id != itinerary_id:
        updated.id = itinerary_id
    return storage_service.save(updated)

@app.delete("/api/itineraries/{itinerary_id}", tags=["Saved Trips"])
def delete_itinerary(itinerary_id: str):
    success = storage_service.delete(itinerary_id)
    if not success:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return {"message": "Itinerary deleted successfully", "id": itinerary_id}
