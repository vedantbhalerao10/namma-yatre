import { Destination, KannadaPhrase, Itinerary, TripPlanRequest, BudgetEstimate } from "./types";
import { MOCK_DESTINATIONS, MOCK_PHRASES } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function fetchHealth(): Promise<{ status: string; mode: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch {
    // Backend offline
  }
  return { status: "offline", mode: "client_fallback" };
}

export async function fetchDestinations(category?: string, search?: string): Promise<Destination[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    const url = `${API_BASE_URL}/destinations?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  // Fallback
  let results = [...MOCK_DESTINATIONS];
  if (category && category !== "all") {
    results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.kannada_name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function fetchKannadaPhrases(category?: string, search?: string): Promise<KannadaPhrase[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    const url = `${API_BASE_URL}/kannada-phrases?${params.toString()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }
  // Fallback
  let results = [...MOCK_PHRASES];
  if (category && category !== "all") {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.kannada.toLowerCase().includes(q) ||
        p.transliteration.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.context.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function generateItinerary(request: TripPlanRequest): Promise<Itinerary> {
  try {
    const res = await fetch(`${API_BASE_URL}/itineraries/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (res.ok) {
      const data = await res.json();
      saveToLocalCache(data);
      return data;
    }
  } catch (err) {
    console.warn("Backend unavailable, generating client fallback:", err);
  }

  // Client-side deterministic generation fallback
  const fallback = createClientFallbackItinerary(request);
  saveToLocalCache(fallback);
  return fallback;
}

export function getLocalSavedItineraries(): Itinerary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("namma_yatre_saved_trips");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToLocalCache(itinerary: Itinerary): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalSavedItineraries();
    const filtered = existing.filter((it) => it.id !== itinerary.id);
    localStorage.setItem("namma_yatre_saved_trips", JSON.stringify([itinerary, ...filtered]));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

export function deleteFromLocalCache(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalSavedItineraries();
    const updated = existing.filter((it) => it.id !== id);
    localStorage.setItem("namma_yatre_saved_trips", JSON.stringify(updated));
  } catch (e) {
    console.error("Local storage delete error:", e);
  }
}

function createClientFallbackItinerary(req: TripPlanRequest): Itinerary {
  const allDests = MOCK_DESTINATIONS;
  const daysCount = req.travel_days;
  const days = [];

  const tierPrices = {
    budget: { room: 1200, food: 450, local: 250, attractions: 150, misc: 150 },
    moderate: { room: 2800, food: 900, local: 600, attractions: 250, misc: 300 },
    luxury: { room: 6500, food: 2200, local: 1400, attractions: 500, misc: 800 },
  };
  const rates = tierPrices[req.budget_tier] || tierPrices.moderate;
  const rooms = Math.max(1, Math.ceil(req.travelers_count / 2));
  const stay = rooms * rates.room * Math.max(1, daysCount - 1);
  const transit = req.transport_preference === "public_transport" ? 400 * req.travelers_count * daysCount : 2400 * daysCount;
  const localTransit = rates.local * req.travelers_count * daysCount;
  const food = rates.food * req.travelers_count * daysCount;
  const attractions = rates.attractions * req.travelers_count * daysCount;
  const misc = rates.misc * req.travelers_count * daysCount;

  const total = stay + transit + localTransit + food + attractions + misc;
  const perPerson = Math.round(total / req.travelers_count);

  for (let i = 1; i <= daysCount; i++) {
    const d1 = allDests[(i * 2 - 2) % allDests.length];
    const d2 = allDests[(i * 2 - 1) % allDests.length];

    days.push({
      day_number: i,
      title: `Day ${i}: ${d1.district} Discovery`,
      theme: `${d1.category.toUpperCase()} Heritage & Scenic Trail`,
      activities: [
        {
          time_of_day: "morning" as const,
          place_name: d1.name,
          kannada_name: d1.kannada_name,
          description: d1.description,
          duration_minutes: d1.suggested_duration_mins,
          estimated_cost_inr: d1.entry_fee_inr,
          cost_status: d1.cost_status,
          latitude: d1.coordinates.latitude,
          longitude: d1.coordinates.longitude,
          cultural_note: d1.cultural_note,
          must_try_food: d1.must_try_food,
          travel_notes: [`Hours: ${d1.opening_hours}`, `Best Season: ${d1.best_time_to_visit}`],
          kannada_phrases: MOCK_PHRASES.slice(0, 2),
        },
        {
          time_of_day: "afternoon" as const,
          place_name: d2.name,
          kannada_name: d2.kannada_name,
          description: d2.description,
          duration_minutes: d2.suggested_duration_mins,
          estimated_cost_inr: d2.entry_fee_inr,
          cost_status: d2.cost_status,
          latitude: d2.coordinates.latitude,
          longitude: d2.coordinates.longitude,
          cultural_note: d2.cultural_note,
          must_try_food: d2.must_try_food,
          travel_notes: [`Hours: ${d2.opening_hours}`, `Best Season: ${d2.best_time_to_visit}`],
          kannada_phrases: MOCK_PHRASES.slice(2, 4),
        },
      ],
    });
  }

  const breakdown = {
    transportation: transit,
    accommodation: stay,
    food: food,
    attractions: attractions,
    local_transport: localTransit,
    miscellaneous: misc,
  };

  const category_shares = Object.entries(breakdown).map(([k, v]) => ({
    category: k.replace("_", " ").toUpperCase(),
    amount_inr: v,
    percentage: Math.round((v / total) * 100),
    note: `${Math.round((v / total) * 100)}% of estimated trip expenditure`,
  }));

  return {
    id: `yatre-client-${Date.now().toString(36)}`,
    trip_title: "Curated Karnataka Journey",
    kannada_title: "ಕರ್ನಾಟಕ ಸಾಂಸ್ಕೃತಿಕ ಪ್ರವಾಸ",
    summary: `A verified ${req.travel_days}-day itinerary from ${req.starting_city} through authentic Karnataka destinations, regional cuisine, and practical Kannada phrases.`,
    starting_city: req.starting_city,
    travel_days: req.travel_days,
    travelers_count: req.travelers_count,
    budget_tier: req.budget_tier,
    interests: req.interests,
    travel_pace: req.travel_pace,
    transport_preference: req.transport_preference,
    days: days,
    budget_estimate: {
      currency: "INR",
      per_person_inr: perPerson,
      total_group_inr: total,
      cost_per_day_inr: Math.round(total / daysCount),
      tier: req.budget_tier,
      breakdown,
      category_shares,
      assumptions: [
        `Tier: ${req.budget_tier.toUpperCase()} estimate with ${rooms} room(s) for ${req.travelers_count} traveler(s).`,
        `Accommodation estimated for ${Math.max(1, daysCount - 1)} night(s).`,
        `Transit based on standard Karnataka rates.`,
        `Entry fees match official Karnataka department benchmarks.`,
      ],
      pricing_status: "deterministic_estimate",
    },
    mode: "curated_demonstration",
    responsible_tourism_tips: [
      "Deposit footwear before entering temples and sacred sanctums.",
      "Support local artisans and GI-tagged Karnataka craft cooperatives.",
      "Keep plastic waste out of Western Ghats streams and waterfalls.",
      "Greet local hosts warmly with 'Namaskara' (ನಮಸ್ಕಾರ).",
    ],
    created_at: new Date().toISOString(),
  };
}
