# Namma Yatre (ನಮ್ಮ ಯಾತ್ರೆ)

### AI Travel Planner for Karnataka & Contextual Survival Kannada Companion

**Kannada Digital Innovation Hackathon 2026 — Problem Statement 6: AI Travel Planner for Karnataka**

> *"Explore Karnataka. Experience Its Culture. Speak Kannada."*

---

## 1. Project Overview

**Namma Yatre (ನಮ್ಮ ಯಾತ್ರೆ)** is an AI-assisted travel planning and cultural tourism platform built specifically for Karnataka. It combines:
1. **Personalized Itinerary Generation**: Day-by-day itineraries tailored to duration, budget tier, travel pace, and interests (heritage, coastal, nature, wildlife, food, temples).
2. **Verified Destination Records**: Curated places across Karnataka with official entrance fees, opening hours, cultural etiquette advice, and GPS coordinates.
3. **Deterministic Budget Estimator**: Exact category-wise breakdowns (accommodation, transport, food, tickets, local transit) calculated strictly via backend arithmetic without AI math hallucinations.
4. **Interactive Route Maps**: Zero-dependency Leaflet/OpenStreetMap route sequence visualization with direct 1-click Google Maps turn-by-turn navigation deep links.
5. **Contextual Survival Kannada Companion**: Practical Kannada travel phrases linked directly to daily stops (ordering dosas, negotiating auto fares, asking directions) with verified script, phonetic guides, and browser-native speech audio.
6. **Responsible Tourism**: Embedded guidelines promoting Western Ghats conservation, temple decorum, and patronizing local GI-tagged handicraft cooperatives.

---

## 2. Problem Statement

Travelers planning journeys across Karnataka face significant hurdles:
* **Fragmented Information**: Tourist spots, transportation options, meal stops, and timings are scattered across multiple websites.
* **Unreliable AI Estimates**: Generic chatbots frequently hallucinate ticket prices, calculate incorrect budget sums, or create impossible itineraries with excessive travel times between distant cities.
* **Language & Cultural Barrier**: Non-Kannada speakers often struggle with day-to-day interactions (auto rickshaws, local bus stops, traditional messes). Language apps present isolated flashcards rather than situational phrases needed while standing at a bus depot or market.

---

## 3. The Proposed Solution

**Namma Yatre** solves these problems with a unified, culturally grounded application:
* **Structured Generative AI + Curated Failover**: Connects with Google Gemini for structured JSON itineraries. If API quota is exceeded or no key is configured, it seamlessly falls back to a verified Curated Demonstration Engine with zero downtime.
* **Deterministic Financial Arithmetic**: Backend Python arithmetic enforces mathematical integrity across per-person, total group, and category costs.
* **Activity-Linked Language Learning**: Every morning, afternoon, and evening stop features curated survival Kannada phrases with audio pronunciation.
* **No Mandatory Billing Blocker**: Evaluators can run and test 100% of the platform without entering credit cards or external map API keys.

---

## 4. Target Users

1. **Students & Young Travelers**: Need affordable destinations, public transit advice, and transparent budget estimates.
2. **Families**: Need manageable daily schedules, moderate travel pace, and child/senior-friendly attractions.
3. **Tourists Unfamiliar with Kannada**: Need practical phrases with pronunciation guidance for ordering food, taking autos, and asking directions.
4. **Heritage & Culture Enthusiasts**: Need context on Hoysala, Chalukya, and Vijayanagara history, temple etiquette, and authentic regional cuisine.
5. **Regional Explorers**: Travelers discovering lesser-known spots across Malnad, Karavali, and North Karnataka.

---

## 5. Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend**: Python 3.14, FastAPI, Pydantic v2 (Strict Schema Validation), Uvicorn.
* **AI Model**: Google Gemini API (`gemini-1.5-flash`) via structured JSON schema with offline Curated Demonstration Engine fallback.
* **Interactive Mapping**: Leaflet, OpenStreetMap, Google Maps Navigation Deep Links.
* **Audio & Speech**: Web Speech API (`SpeechSynthesisUtterance` with `kn-IN` voice support).
* **Storage**: LocalStorage (Guest Mode Vault) + FastAPI JSON storage.

---

## 6. System Architecture

```mermaid
graph TD
    User([Traveler / Judge]) --> Frontend[Next.js 16 Frontend UI]
    Frontend --> Nav[Navbar, Pages: /, /plan, /itinerary, /explore, /kannada, /saved, /about]
    Frontend --> MapComp[Interactive Leaflet OSM & Route Polyline]
    Frontend --> AudioComp[Web Speech API Kannada Voice Synthesizer]
    Frontend --> APIClient[lib/api.ts Client with Offline Fallback]
    
    APIClient --> Backend[FastAPI Backend Server :8000]
    Backend --> RouteGen[/api/itineraries/generate]
    Backend --> DestService[/api/destinations]
    Backend --> PhraseService[/api/kannada-phrases]
    Backend --> BudgetService[/api/budget/calculate]
    
    RouteGen --> Gemini[Google Gemini API]
    RouteGen --> Fallback[Curated Demonstration Engine]
    RouteGen --> BudgetMath[Deterministic Arithmetic Service]
    RouteGen --> DestDB[(destinations.json)]
    RouteGen --> PhraseDB[(kannada_phrases.json)]
```

---

## 7. Folder Structure

```
nammo kannada/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   ├── destinations.json       # Verified Karnataka destinations
│   │   │   ├── kannada_phrases.json    # Verified survival Kannada phrases
│   │   │   └── saved_itineraries.json  # Backend persisted trips
│   │   ├── services/
│   │   │   ├── budget_service.py       # Deterministic cost arithmetic
│   │   │   ├── destination_service.py  # Destination catalog search/filter
│   │   │   ├── itinerary_service.py    # Gemini AI + Curated Fallback
│   │   │   ├── kannada_service.py      # Contextual phrase retrieval
│   │   │   └── storage_service.py      # Storage CRUD
│   │   ├── main.py                     # FastAPI routes and middleware
│   │   └── models.py                   # Pydantic schemas
│   ├── venv/                           # Python virtual environment
│   ├── .env.example                    # Backend environment template
│   ├── requirements.txt                # Python dependencies
│   └── test_app.py                     # Pytest test suite (7 passed)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Page 1: Landing Page
│   │   │   ├── plan/page.tsx           # Page 2: Trip Planner Form
│   │   │   ├── itinerary/page.tsx      # Page 3: Itinerary Results & Map
│   │   │   ├── explore/page.tsx        # Page 4: Destination Explorer
│   │   │   ├── kannada/page.tsx        # Page 5: Kannada Companion
│   │   │   ├── saved/page.tsx          # Page 6: Saved Trips Vault
│   │   │   ├── about/page.tsx          # Page 7: Hackathon Impact & Architecture
│   │   │   ├── globals.css             # Tailwind CSS tokens
│   │   │   └── layout.tsx              # Root Layout with Navbar & Footer
│   │   ├── components/
│   │   │   ├── BudgetCard.tsx          # Deterministic budget breakdown UI
│   │   │   ├── Footer.tsx              # Cultural tourism footer
│   │   │   ├── InteractiveMap.tsx      # Leaflet map with custom pins & route lines
│   │   │   ├── KannadaAudioButton.tsx  # Audio pronunciation player
│   │   │   └── Navbar.tsx              # Responsive top navigation
│   │   └── lib/
│   │       ├── api.ts                  # API client with auto fallback
│   │       ├── mockData.ts             # Curated client data assets
│   │       └── types.ts                # TypeScript data interfaces
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 8. Local Setup & Running Instructions

### Prerequisites
* **Node.js**: v18+ (tested on Node v24.12.0)
* **Python**: 3.10+ (tested on Python 3.14.2)
* **Operating System**: Windows (PowerShell), macOS, or Linux

### 1. Backend Setup
Open a terminal in the root folder:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run tests to verify backend logic:
```powershell
pytest test_app.py
```

Start the FastAPI backend server:
```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Interactive API Documentation (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Health check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 2. Frontend Setup
Open a second terminal in the root folder:

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Environment Variables Configuration

### Backend (`backend/.env`)
```bash
# Optional: Set your Gemini API key for live LLM generation.
# If omitted or quota-limited, Namma Yatre automatically runs in Curated Demo Mode!
GEMINI_API_KEY=
PORT=8000
HOST=0.0.0.0
```

### Frontend (`frontend/.env.local`)
```bash
# Points to local FastAPI backend; falls back automatically if backend is stopped
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

---

## 10. Verification & Test Results

All 10 required hackathon test scenarios were executed and verified:

| Test ID | Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **TEST 1** | Budget Trip (Bengaluru, 2d, Budget) | Sensible stops, transparent math, Kannada phrases | **PASSED** |
| **TEST 2** | Nature Trip (Bengaluru, 3d, Nature/Wildlife) | Western ghats route without impossible travel times | **PASSED** |
| **TEST 3** | Coastal Trip (Mysuru, 3d, Coastal & Food) | Karavali route with Gokarna/Udupi & Neer Dosa tips | **PASSED** |
| **TEST 4** | Invalid Inputs (0 days, empty city) | Clear validation alerts without server crash | **PASSED** |
| **TEST 5** | AI Service Outage / Missing Key | Auto fallback to verified Curated Engine with badge | **PASSED** |
| **TEST 6** | Zero API Credentials | 100% features work without billing blockers | **PASSED** |
| **TEST 7** | Budget Arithmetic | Sum of breakdown equals total; exact per-day/person | **PASSED** |
| **TEST 8** | Mobile Responsiveness | Clean mobile layout, responsive menu, touch-friendly | **PASSED** |
| **TEST 9** | Kannada Phrase Accuracy | Unicode script, phonetics, and speech audio playback | **PASSED** |
| **TEST 10** | Trip Persistence | Saved trips persist in browser vault after refresh | **PASSED** |

---

## 11. Kannada Digital Innovation Contribution

* **Active Cultural Acquisition**: Learners are taught Kannada when they actually need it: ordering Mysore Masala Dosa (*"Ondu Mysore Masala Dosa kodi"*), negotiating auto meters (*"Dayavittu meter haaki"*), or requesting mild spice (*"Kaara swalpa kammi maadi"*).
* **Politeness & Dignity**: Highlights respectful cultural nuances (e.g. why adding *-ri* or using *kodi* rather than *kodu* builds friendship with local communities).
* **Accessible Pronunciation**: Pairs Kannada script with standard English transliteration, phonetic syllables (e.g., `[duh-yuh-VIT-too]`), and browser speech audio.

---

## 12. Responsible Tourism Charter

Namma Yatre explicitly embeds responsible travel principles:
* **Western Ghats Eco-Safety**: Reminders to carry plastic waste back from Jog Falls and Coorg waterfalls.
* **Monument Sanctity**: Dress codes and footwear deposit guidance for Badami, Virupaksha, and Chamundeshwari temples.
* **Local Economy**: Directing tourists to local co-operatives for Channapatna toys, Mysore silk, and Dharwad peda.

---

## 13. Known Limitations & Future Work

* **Live Weather**: Weather forecasts are advisory; production will integrate IMD Karnataka radar feeds.
* **Live Transit Booking**: Currently provides official KSRTC bus and IRCTC train links; future versions can integrate direct booking APIs.
* **Native Mobile Apps**: Architecture is decoupled via REST APIs, ready for React Native / Flutter deployment.

---

## 14. License & Credits

Built for the **Kannada Digital Innovation Hackathon 2026**.  
*Open-source and designed to promote Karnataka tourism, culture, and the Kannada language.*
