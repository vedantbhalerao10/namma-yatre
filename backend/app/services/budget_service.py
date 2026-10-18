from typing import List, Dict
from ..models import BudgetEstimate, CategoryCost

class BudgetService:
    # Daily per-person cost benchmarks (in INR) across Karnataka regions
    TIER_RATES = {
        "budget": {
            "accommodation_per_room": 1200,   # clean guesthouse / KSTDC Mayura budget rooms
            "food_per_person": 450,          # local darshinis, tiffin centers, rotti oota
            "local_transport_per_person": 250, # KSRTC local buses / shared autos
            "attractions_per_person": 150,    # standard state monument tickets
            "miscellaneous_per_person": 150   # tea, water bottles, emergency
        },
        "moderate": {
            "accommodation_per_room": 2800,   # 3-star boutique hotel / heritage homestay
            "food_per_person": 900,          # popular traditional restaurants, multi-cuisine
            "local_transport_per_person": 600, # dedicated auto-rickshaws, city cabs
            "attractions_per_person": 250,    # tickets + museum entry + boat/guide share
            "miscellaneous_per_person": 300   # souvenirs, filter coffee, snacks
        },
        "luxury": {
            "accommodation_per_room": 6500,   # luxury resort / heritage palace property
            "food_per_person": 2200,         # fine dining, resort buffets, specialized tastings
            "local_transport_per_person": 1400,# private AC sedan/SUV throughout
            "attractions_per_person": 500,    # private guided tours, premium VIP darshan
            "miscellaneous_per_person": 800   # specialty silk, spices, experiences
        }
    }

    # Inter-city transport estimates per group or per person
    TRANSPORT_MULTIPLIERS = {
        "public_transport": 400, # KSRTC Rajahamsa / Airavat bus average per day per person
        "cab_rental": 2400,      # Dedicated inter-district cab per day per group (Sedan/Ertiga)
        "self_drive": 1800       # Rental car base + fuel per day per group
    }

    @classmethod
    def calculate_budget(
        cls,
        days: int,
        travelers: int,
        tier: str = "moderate",
        transport_mode: str = "cab_rental",
        custom_ticket_sum: int = 0
    ) -> BudgetEstimate:
        tier = tier.lower() if tier.lower() in cls.TIER_RATES else "moderate"
        rates = cls.TIER_RATES[tier]

        # Accommodation logic: assume 2 people per room (ceiling division)
        rooms_needed = max(1, (travelers + 1) // 2)
        total_accommodation = rooms_needed * rates["accommodation_per_room"] * max(1, days - 1)

        # Inter-city & primary transit
        if transport_mode == "public_transport":
            total_transit = travelers * cls.TRANSPORT_MULTIPLIERS["public_transport"] * days
        else:
            base_transit = cls.TRANSPORT_MULTIPLIERS.get(transport_mode, 2400) * days
            total_transit = base_transit

        # Local transit, Food, Attractions, Miscellaneous
        total_local_transport = rates["local_transport_per_person"] * travelers * days
        total_food = rates["food_per_person"] * travelers * days
        
        # Attractions: base estimate or calculated sum of planned tickets
        total_attractions = max(custom_ticket_sum * travelers, rates["attractions_per_person"] * travelers * days)
        total_misc = rates["miscellaneous_per_person"] * travelers * days

        breakdown = {
            "transportation": int(total_transit),
            "accommodation": int(total_accommodation),
            "food": int(total_food),
            "attractions": int(total_attractions),
            "local_transport": int(total_local_transport),
            "miscellaneous": int(total_misc)
        }

        total_group = sum(breakdown.values())
        per_person = int(total_group / travelers) if travelers > 0 else total_group
        cost_per_day = int(total_group / days) if days > 0 else total_group

        category_shares = []
        for cat, amt in breakdown.items():
            pct = round((amt / total_group * 100), 1) if total_group > 0 else 0.0
            category_shares.append(
                CategoryCost(
                    category=cat.replace("_", " ").title(),
                    amount_inr=amt,
                    percentage=pct,
                    note=f"{pct}% of estimated trip expenditure"
                )
            )

        assumptions = [
            f"Tier: {tier.capitalize()} style travel with {rooms_needed} room(s) for {travelers} traveler(s).",
            f"Accommodation estimated for {max(1, days - 1)} night(s).",
            f"Primary transit based on '{transport_mode.replace('_', ' ').title()}' Karnataka regional averages.",
            "Attraction entry fees reflect current Karnataka Archaeological & Forest Dept published rates.",
            "All figures are transparent estimates to help financial planning; actual receipts may vary by season."
        ]

        return BudgetEstimate(
            currency="INR",
            per_person_inr=per_person,
            total_group_inr=total_group,
            cost_per_day_inr=cost_per_day,
            tier=tier,
            breakdown=breakdown,
            category_shares=category_shares,
            assumptions=assumptions,
            pricing_status="deterministic_estimate"
        )

budget_service = BudgetService()
