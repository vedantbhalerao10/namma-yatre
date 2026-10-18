from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

# Request Model
class TripPlanRequest(BaseModel):
    starting_city: str = Field(..., description="Starting city (e.g., Bengaluru, Mysuru, Hubballi)")
    destination_preference: Optional[str] = Field(None, description="Target destination or region, or null for auto-recommendation")
    travel_days: int = Field(..., ge=1, le=14, description="Number of travel days (1 to 14)")
    travelers_count: int = Field(1, ge=1, le=20, description="Total number of travelers")
    budget_tier: Literal["budget", "moderate", "luxury"] = Field("moderate", description="Budget tier")
    interests: List[str] = Field(default_factory=lambda: ["heritage", "nature"], description="Interests: heritage, nature, wildlife, coastal, food, spiritual, adventure")
    travel_pace: Literal["relaxed", "balanced", "packed"] = Field("balanced", description="Travel pace")
    transport_preference: Literal["public_transport", "cab_rental", "self_drive"] = Field("cab_rental", description="Transportation preference")
    accessibility_needs: Optional[str] = Field(None, description="Any mobility or accessibility preferences")

# Destination Models
class GeoCoordinates(BaseModel):
    latitude: float
    longitude: float

class Destination(BaseModel):
    id: str
    name: str
    kannada_name: str
    district: str
    category: str
    description: str
    suggested_duration_mins: int
    entry_fee_inr: int
    cost_status: str
    opening_hours: str
    best_time_to_visit: str
    coordinates: GeoCoordinates
    cultural_note: str
    must_try_food: str
    image_url: str
    accessibility: Optional[str] = None

# Kannada Phrase Model
class KannadaPhrase(BaseModel):
    id: str
    category: str
    kannada: str
    transliteration: str
    meaning: str
    context: str
    politeness_level: str
    audio_phonetic: str

# Activity & Itinerary Day Models
class ItineraryActivity(BaseModel):
    time_of_day: Literal["morning", "afternoon", "evening"]
    place_name: str
    kannada_name: Optional[str] = None
    description: str
    duration_minutes: int
    estimated_cost_inr: int
    cost_status: str = "illustrative_estimate"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cultural_note: Optional[str] = None
    must_try_food: Optional[str] = None
    travel_notes: List[str] = Field(default_factory=list)
    kannada_phrases: List[KannadaPhrase] = Field(default_factory=list)

class ItineraryDay(BaseModel):
    day_number: int
    title: str
    theme: str
    activities: List[ItineraryActivity]

# Budget Breakdown Model
class CategoryCost(BaseModel):
    category: str
    amount_inr: int
    percentage: float
    note: str

class BudgetEstimate(BaseModel):
    currency: str = "INR"
    per_person_inr: int
    total_group_inr: int
    cost_per_day_inr: int
    tier: str
    breakdown: Dict[str, int]
    category_shares: List[CategoryCost]
    assumptions: List[str]
    pricing_status: Literal["deterministic_estimate", "live_verified"] = "deterministic_estimate"

# Complete Itinerary
class Itinerary(BaseModel):
    id: str
    trip_title: str
    kannada_title: str
    summary: str
    starting_city: str
    travel_days: int
    travelers_count: int
    budget_tier: str
    interests: List[str]
    travel_pace: str
    transport_preference: str
    days: List[ItineraryDay]
    budget_estimate: BudgetEstimate
    mode: Literal["live_ai_generated", "curated_demonstration"]
    responsible_tourism_tips: List[str]
    created_at: str
