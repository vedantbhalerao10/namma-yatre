import os
import uuid
import datetime
import json
import httpx
from typing import Optional, List, Dict, Any
from ..models import (
    TripPlanRequest, Itinerary, ItineraryDay, ItineraryActivity,
    BudgetEstimate
)
from .destination_service import destination_service
from .kannada_service import kannada_service
from .budget_service import budget_service

class ItineraryService:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()

    async def generate_itinerary(self, req: TripPlanRequest) -> Itinerary:
        """Attempts live Gemini generation if key is present; otherwise falls back gracefully to curated demo engine."""
        if self.gemini_api_key:
            try:
                live_itinerary = await self._generate_with_gemini(req)
                if live_itinerary:
                    return live_itinerary
            except Exception as e:
                print(f"[Warning] Gemini generation failed: {e}. Falling back to Curated Engine.")

        # Fallback to Curated Demonstration Engine
        return self._generate_curated_itinerary(req)

    async def _generate_with_gemini(self, req: TripPlanRequest) -> Optional[Itinerary]:
        """Calls Gemini API with structured prompt and strict schema."""
        destinations = destination_service.get_all()
        dest_summary = [
            {"id": d.id, "name": d.name, "kannada": d.kannada_name, "district": d.district, "category": d.category}
            for d in destinations
        ]

        prompt = f"""
You are Namma Yatre's expert Karnataka travel architect.
Plan a {req.travel_days}-day trip starting from {req.starting_city}.
Travelers: {req.travelers_count}. Budget tier: {req.budget_tier}.
Pace: {req.travel_pace}. Interests: {", ".join(req.interests)}.
Preferred transit: {req.transport_preference}.

Select real places from Karnataka, especially prioritizing these known destinations where applicable:
{json.dumps(dest_summary, ensure_ascii=False)}

Return a strict JSON object with this exact structure:
{{
  "trip_title": "string",
  "kannada_title": "string (in Kannada script)",
  "summary": "string",
  "days": [
    {{
      "day_number": 1,
      "title": "string",
      "theme": "string",
      "activities": [
        {{
          "time_of_day": "morning",
          "place_name": "string",
          "kannada_name": "string in Kannada",
          "description": "string",
          "duration_minutes": 120,
          "estimated_cost_inr": 100,
          "latitude": 12.3052,
          "longitude": 76.6552,
          "cultural_note": "string",
          "must_try_food": "string",
          "travel_notes": ["string"]
        }}
      ]
    }}
  ],
  "responsible_tourism_tips": ["string"]
}}
Only return valid JSON. Do not wrap in markdown or backticks.
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "response_mime_type": "application/json"}
        }

        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                result_json = resp.json()
                raw_text = result_json["candidates"][0]["content"]["parts"][0]["text"]
                data = json.loads(raw_text)

                # Hydrate days with verified Kannada phrases and coordinates
                days: List[ItineraryDay] = []
                custom_ticket_sum = 0
                for day_data in data.get("days", []):
                    activities: List[ItineraryActivity] = []
                    for act in day_data.get("activities", []):
                        # Match with verified destination if possible
                        matched_dest = None
                        for d in destinations:
                            if d.name.lower() in act["place_name"].lower() or act["place_name"].lower() in d.name.lower():
                                matched_dest = d
                                break

                        lat = matched_dest.coordinates.latitude if matched_dest else act.get("latitude")
                        lon = matched_dest.coordinates.longitude if matched_dest else act.get("longitude")
                        k_name = matched_dest.kannada_name if matched_dest else act.get("kannada_name")
                        cost = matched_dest.entry_fee_inr if matched_dest else act.get("estimated_cost_inr", 50)
                        custom_ticket_sum += cost

                        # Contextual phrases
                        phrases = kannada_service.get_contextual_phrases(act.get("time_of_day", "morning"))

                        activity = ItineraryActivity(
                            time_of_day=act.get("time_of_day", "morning"),
                            place_name=act.get("place_name", "Scenic Location"),
                            kannada_name=k_name,
                            description=act.get("description", ""),
                            duration_minutes=act.get("duration_minutes", 120),
                            estimated_cost_inr=cost,
                            cost_status="verified_reference" if matched_dest else "illustrative_estimate",
                            latitude=lat,
                            longitude=lon,
                            cultural_note=matched_dest.cultural_note if matched_dest else act.get("cultural_note"),
                            must_try_food=matched_dest.must_try_food if matched_dest else act.get("must_try_food"),
                            travel_notes=act.get("travel_notes", ["Carry water and comfortable walking shoes."]),
                            kannada_phrases=phrases
                        )
                        activities.append(activity)

                    days.append(ItineraryDay(
                        day_number=day_data.get("day_number", len(days) + 1),
                        title=day_data.get("title", f"Day {len(days) + 1}"),
                        theme=day_data.get("theme", "Exploration"),
                        activities=activities
                    ))

                # Deterministic budget calculation
                budget = budget_service.calculate_budget(
                    days=req.travel_days,
                    travelers=req.travelers_count,
                    tier=req.budget_tier,
                    transport_mode=req.transport_preference,
                    custom_ticket_sum=custom_ticket_sum
                )

                return Itinerary(
                    id=f"yatre-{uuid.uuid4().hex[:8]}",
                    trip_title=data.get("trip_title", "Karnataka Cultural Expedition"),
                    kannada_title=data.get("kannada_title", "ಕರ್ನಾಟಕ ಸಾಂಸ್ಕೃತಿಕ ಪ್ರವಾಸ"),
                    summary=data.get("summary", "Personalized journey exploring the heritage and landscapes of Karnataka."),
                    starting_city=req.starting_city,
                    travel_days=req.travel_days,
                    travelers_count=req.travelers_count,
                    budget_tier=req.budget_tier,
                    interests=req.interests,
                    travel_pace=req.travel_pace,
                    transport_preference=req.transport_preference,
                    days=days,
                    budget_estimate=budget,
                    mode="live_ai_generated",
                    responsible_tourism_tips=data.get("responsible_tourism_tips", [
                        "Respect temple customs and remove footwear where designated.",
                        "Support local artisans and buy GI-tagged regional crafts.",
                        "Minimize single-use plastics along waterfalls and nature trails."
                    ]),
                    created_at=datetime.datetime.now().isoformat()
                )
        return None

    def _generate_curated_itinerary(self, req: TripPlanRequest) -> Itinerary:
        """Deterministic curated generator guaranteeing a culturally rich, realistic Karnataka itinerary without external API dependencies."""
        all_dests = destination_service.get_all()
        interests = [i.lower() for i in req.interests]

        # Prioritize destinations matching user interests
        matched_dests = [d for d in all_dests if any(i in d.category.lower() for i in interests)]
        if len(matched_dests) < req.travel_days * 2:
            # Backfill with remaining destinations
            remaining = [d for d in all_dests if d not in matched_dests]
            matched_dests.extend(remaining)

        # Build days
        days: List[ItineraryDay] = []
        dest_idx = 0
        total_ticket_sum = 0

        day_themes = [
            ("Heritage Awakening", "ಪ್ರಾಚೀನ ಪರಂಪರೆ ಮತ್ತು ಶಿಲ್ಪಕಲೆ"),
            ("Scenic Natural Wonders", "ಮಲೆನಾಡಿನ ಹಸಿರು ಮತ್ತು ನಿಸರ್ಗ"),
            ("Spiritual & Coastal Horizons", "ಕರಾವಳಿಯ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಕಡಲತೀರ"),
            ("Artisan Traditions & Markets", "ಸ್ಥಳೀಯ ಕಲೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆಗಳು"),
            ("Grand Architectural Wonders", "ಭವ್ಯ ಕೋಟೆಗಳು ಮತ್ತು ಅರಮನೆಗಳು"),
            ("Serene Western Ghats", "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಸೌಂದರ್ಯ"),
            ("Flavors of Karunadu", "ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿಗಳು")
        ]

        for day_num in range(1, req.travel_days + 1):
            theme_en, theme_kn = day_themes[(day_num - 1) % len(day_themes)]
            activities: List[ItineraryActivity] = []

            # 2 to 3 activities per day based on pace
            act_count = 2 if req.travel_pace == "relaxed" else (4 if req.travel_pace == "packed" else 3)
            time_slots = ["morning", "afternoon", "evening"][:act_count]

            for time_slot in time_slots:
                d = matched_dests[dest_idx % len(matched_dests)]
                dest_idx += 1
                total_ticket_sum += d.entry_fee_inr

                phrases = kannada_service.get_contextual_phrases(time_slot, count=2)

                act = ItineraryActivity(
                    time_of_day=time_slot,  # type: ignore
                    place_name=d.name,
                    kannada_name=d.kannada_name,
                    description=d.description,
                    duration_minutes=d.suggested_duration_mins,
                    estimated_cost_inr=d.entry_fee_inr,
                    cost_status=d.cost_status,
                    latitude=d.coordinates.latitude,
                    longitude=d.coordinates.longitude,
                    cultural_note=d.cultural_note,
                    must_try_food=d.must_try_food,
                    travel_notes=[
                        f"Opening hours: {d.opening_hours}.",
                        f"Best experience: {d.best_time_to_visit}."
                    ],
                    kannada_phrases=phrases
                )
                activities.append(act)

            days.append(ItineraryDay(
                day_number=day_num,
                title=f"Day {day_num}: {theme_en}",
                theme=f"{theme_en} ({theme_kn})",
                activities=activities
            ))

        # Deterministic Budget
        budget = budget_service.calculate_budget(
            days=req.travel_days,
            travelers=req.travelers_count,
            tier=req.budget_tier,
            transport_mode=req.transport_preference,
            custom_ticket_sum=total_ticket_sum
        )

        title_map = {
            "heritage": ("Karnataka Heritage & Royal Odyssey", "ಕರ್ನಾಟಕದ ಭವ್ಯ ಇತಿಹಾಸ ಮತ್ತು ರಾಜಪರಂಪರೆಯ ಯಾತ್ರೆ"),
            "nature": ("Malnad & Western Ghats Nature Trail", "ಮಲೆನಾಡು ಮತ್ತು ಹಚ್ಚಹಸಿರಿನ ಪ್ರಕೃತಿ ಯಾತ್ರೆ"),
            "coastal": ("Karavali Coastal & Sunset Expedition", "ಕರಾವಳಿಯ ಸೊಬಗು ಮತ್ತು ಕಡಲತೀರದ ಸವಿನೆನಪು"),
            "adventure": ("Karnataka Hill & Adventure Quest", "ಕರ್ನಾಟಕದ ಗಿರಿಶಿಖರ ಮತ್ತು ಸಾಹಸ ಯಾತ್ರೆ")
        }
        first_interest = interests[0] if interests else "heritage"
        title_en, title_kn = title_map.get(first_interest, ("Namma Yatre Karnataka Journey", "ನಮ್ಮ ಯಾತ್ರೆ - ಕರ್ನಾಟಕ ದರ್ಶನ"))

        return Itinerary(
            id=f"yatre-demo-{uuid.uuid4().hex[:8]}",
            trip_title=title_en,
            kannada_title=title_kn,
            summary=f"A curated {req.travel_days}-day itinerary from {req.starting_city} highlighting Karnataka's cultural treasures, regional delicacies, and practical Kannada phrases.",
            starting_city=req.starting_city,
            travel_days=req.travel_days,
            travelers_count=req.travelers_count,
            budget_tier=req.budget_tier,
            interests=req.interests,
            travel_pace=req.travel_pace,
            transport_preference=req.transport_preference,
            days=days,
            budget_estimate=budget,
            mode="curated_demonstration",
            responsible_tourism_tips=[
                "Footwear must be deposited outside sacred sanctums and heritage monuments.",
                "Support local craftspersons at artisan markets and cooperative stalls.",
                "Dispose waste responsibly and keep Karnataka's ghats and waterfalls pristine.",
                "Speak politely with local drivers and shopkeepers using the survival Kannada phrases provided."
            ],
            created_at=datetime.datetime.now().isoformat()
        )

itinerary_service = ItineraryService()
