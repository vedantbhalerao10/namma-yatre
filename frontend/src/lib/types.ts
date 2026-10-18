export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Destination {
  id: string;
  name: string;
  kannada_name: string;
  district: string;
  category: "heritage" | "nature" | "wildlife" | "coastal" | "spiritual" | "adventure" | "urban";
  description: string;
  suggested_duration_mins: number;
  entry_fee_inr: number;
  cost_status: string;
  opening_hours: string;
  best_time_to_visit: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  cultural_note: string;
  must_try_food: string;
  image_url: string;
  accessibility?: string;
}

export interface KannadaPhrase {
  id: string;
  category: "greetings" | "directions" | "transport" | "dining" | "shopping" | "emergency";
  kannada: string;
  transliteration: string;
  meaning: string;
  context: string;
  politeness_level: string;
  audio_phonetic: string;
}

export interface ItineraryActivity {
  time_of_day: "morning" | "afternoon" | "evening";
  place_name: string;
  kannada_name?: string;
  description: string;
  duration_minutes: number;
  estimated_cost_inr: number;
  cost_status: string;
  latitude?: number;
  longitude?: number;
  cultural_note?: string;
  must_try_food?: string;
  travel_notes: string[];
  kannada_phrases: KannadaPhrase[];
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface CategoryCost {
  category: string;
  amount_inr: number;
  percentage: number;
  note: string;
}

export interface BudgetEstimate {
  currency: string;
  per_person_inr: number;
  total_group_inr: number;
  cost_per_day_inr: number;
  tier: string;
  breakdown: {
    transportation: number;
    accommodation: number;
    food: number;
    attractions: number;
    local_transport: number;
    miscellaneous: number;
  };
  category_shares: CategoryCost[];
  assumptions: string[];
  pricing_status: "deterministic_estimate" | "live_verified";
}

export interface Itinerary {
  id: string;
  trip_title: string;
  kannada_title: string;
  summary: string;
  starting_city: string;
  travel_days: number;
  travelers_count: number;
  budget_tier: "budget" | "moderate" | "luxury";
  interests: string[];
  travel_pace: "relaxed" | "balanced" | "packed";
  transport_preference: "public_transport" | "cab_rental" | "self_drive";
  days: ItineraryDay[];
  budget_estimate: BudgetEstimate;
  mode: "live_ai_generated" | "curated_demonstration";
  responsible_tourism_tips: string[];
  created_at: string;
}

export interface TripPlanRequest {
  starting_city: string;
  destination_preference?: string;
  travel_days: number;
  travelers_count: number;
  budget_tier: "budget" | "moderate" | "luxury";
  interests: string[];
  travel_pace: "relaxed" | "balanced" | "packed";
  transport_preference: "public_transport" | "cab_rental" | "self_drive";
  accessibility_needs?: string;
}
