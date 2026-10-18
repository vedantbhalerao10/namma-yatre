import json
import os
from typing import List, Optional
from ..models import Destination

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "destinations.json")

class DestinationService:
    def __init__(self):
        self._destinations: List[Destination] = []
        self._load_data()

    def _load_data(self):
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._destinations = [Destination(**item) for item in data]
        else:
            self._destinations = []

    def get_all(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Destination]:
        results = self._destinations
        if category and category.lower() != "all":
            results = [d for d in results if d.category.lower() == category.lower()]
        if search:
            q = search.lower()
            results = [
                d for d in results 
                if q in d.name.lower() or q in d.district.lower() or q in d.kannada_name.lower() or q in d.description.lower()
            ]
        return results

    def get_by_id(self, dest_id: str) -> Optional[Destination]:
        for d in self._destinations:
            if d.id == dest_id:
                return d
        return None

destination_service = DestinationService()
