import json
import os
from typing import List, Optional
from ..models import KannadaPhrase

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "kannada_phrases.json")

class KannadaService:
    def __init__(self):
        self._phrases: List[KannadaPhrase] = []
        self._load_data()

    def _load_data(self):
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._phrases = [KannadaPhrase(**item) for item in data]
        else:
            self._phrases = []

    def get_all(self, category: Optional[str] = None, search: Optional[str] = None) -> List[KannadaPhrase]:
        results = self._phrases
        if category and category.lower() != "all":
            results = [p for p in results if p.category.lower() == category.lower()]
        if search:
            q = search.lower()
            results = [
                p for p in results 
                if q in p.kannada.lower() or q in p.transliteration.lower() or q in p.meaning.lower() or q in p.context.lower()
            ]
        return results

    def get_contextual_phrases(self, activity_type: str, count: int = 2) -> List[KannadaPhrase]:
        """Select relevant phrases based on activity or travel stage."""
        mapping = {
            "morning": ["phrase-greet-01", "phrase-food-01"],
            "afternoon": ["phrase-food-04", "phrase-food-05", "phrase-dir-01"],
            "evening": ["phrase-auto-01", "phrase-auto-02", "phrase-shop-01", "phrase-shop-03"],
            "dining": ["phrase-food-01", "phrase-food-02", "phrase-food-03", "phrase-food-04"],
            "transport": ["phrase-auto-01", "phrase-auto-02", "phrase-dir-01", "phrase-dir-05"],
            "shopping": ["phrase-shop-01", "phrase-shop-02", "phrase-shop-03"],
            "emergency": ["phrase-help-01", "phrase-help-02", "phrase-help-03"]
        }
        target_ids = mapping.get(activity_type.lower(), ["phrase-greet-01", "phrase-dir-01"])
        selected = [p for p in self._phrases if p.id in target_ids]
        if not selected:
            selected = self._phrases[:count]
        return selected[:count]

kannada_service = KannadaService()
