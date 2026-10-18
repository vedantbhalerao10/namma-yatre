import json
import os
from typing import Dict, Optional, List
from ..models import Itinerary

STORE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "saved_itineraries.json")

class StorageService:
    def __init__(self):
        self._cache: Dict[str, Itinerary] = {}
        self._load()

    def _load(self):
        if os.path.exists(STORE_FILE):
            try:
                with open(STORE_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        itinerary = Itinerary(**item)
                        self._cache[itinerary.id] = itinerary
            except Exception as e:
                print(f"[Warning] Error loading saved itineraries: {e}")

    def _persist(self):
        try:
            os.makedirs(os.path.dirname(STORE_FILE), exist_ok=True)
            with open(STORE_FILE, "w", encoding="utf-8") as f:
                json.dump([it.model_dump() for it in self._cache.values()], f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[Warning] Error persisting itineraries: {e}")

    def save(self, itinerary: Itinerary) -> Itinerary:
        self._cache[itinerary.id] = itinerary
        self._persist()
        return itinerary

    def get(self, itinerary_id: str) -> Optional[Itinerary]:
        return self._cache.get(itinerary_id)

    def list_all(self) -> List[Itinerary]:
        return list(self._cache.values())

    def delete(self, itinerary_id: str) -> bool:
        if itinerary_id in self._cache:
            del self._cache[itinerary_id]
            self._persist()
            return True
        return False

storage_service = StorageService()
