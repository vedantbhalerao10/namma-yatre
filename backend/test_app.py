import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "mode" in data

def test_destinations_list():
    response = client.get("/api/destinations")
    assert response.status_code == 200
    dests = response.json()
    assert len(dests) >= 10
    assert any(d["name"].startswith("Mysuru Palace") for d in dests)

def test_destinations_filter_heritage():
    response = client.get("/api/destinations?category=heritage")
    assert response.status_code == 200
    dests = response.json()
    assert len(dests) > 0
    assert all(d["category"] == "heritage" for d in dests)

def test_kannada_phrases():
    response = client.get("/api/kannada-phrases")
    assert response.status_code == 200
    phrases = response.json()
    assert len(phrases) >= 15
    # Verify Kannada script and transliteration
    assert any("ನಮಸ್ಕಾರ" in p["kannada"] for p in phrases)

def test_deterministic_budget_calculation():
    # 3 days, 2 travelers, moderate tier, cab rental
    response = client.post("/api/budget/calculate?days=3&travelers=2&tier=moderate&transport_mode=cab_rental")
    assert response.status_code == 200
    b = response.json()
    assert b["total_group_inr"] > 0
    assert b["per_person_inr"] == b["total_group_inr"] // 2
    assert b["cost_per_day_inr"] == b["total_group_inr"] // 3
    # Check sum of category breakdown equals total
    breakdown_sum = sum(b["breakdown"].values())
    assert breakdown_sum == b["total_group_inr"]

def test_itinerary_generation():
    req_payload = {
        "starting_city": "Bengaluru",
        "travel_days": 2,
        "travelers_count": 2,
        "budget_tier": "budget",
        "interests": ["heritage", "culture"],
        "travel_pace": "balanced",
        "transport_preference": "public_transport"
    }
    response = client.post("/api/itineraries/generate", json=req_payload)
    assert response.status_code == 200
    itinerary = response.json()
    assert len(itinerary["days"]) == 2
    assert itinerary["starting_city"] == "Bengaluru"
    assert "budget_estimate" in itinerary
    assert len(itinerary["days"][0]["activities"]) >= 2
    # Verify Kannada phrases attached
    assert len(itinerary["days"][0]["activities"][0]["kannada_phrases"]) > 0

def test_itinerary_persistence():
    # Create and fetch
    req_payload = {
        "starting_city": "Mysuru",
        "travel_days": 1,
        "travelers_count": 1,
        "budget_tier": "moderate",
        "interests": ["spiritual"],
        "travel_pace": "relaxed",
        "transport_preference": "cab_rental"
    }
    gen_res = client.post("/api/itineraries/generate", json=req_payload)
    itinerary = gen_res.json()
    it_id = itinerary["id"]

    # Get by ID
    get_res = client.get(f"/api/itineraries/{it_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == it_id

    # Delete
    del_res = client.delete(f"/api/itineraries/{it_id}")
    assert del_res.status_code == 200
