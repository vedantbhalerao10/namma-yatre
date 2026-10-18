import { BudgetEstimate } from "@/lib/types";
import { IndianRupee, PieChart, Users, Calendar, AlertCircle } from "lucide-react";

interface Props {
  budget: BudgetEstimate;
  travelers: number;
  days: number;
}

export default function BudgetCard({ budget, travelers, days }: Props) {
  const categoryColors: Record<string, string> = {
    transportation: "bg-blue-600",
    accommodation: "bg-emerald-600",
    food: "bg-amber-500",
    attractions: "bg-rose-500",
    local_transport: "bg-purple-600",
    miscellaneous: "bg-slate-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#0F382A]">
              <IndianRupee className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Estimated Trip Budget</h3>
              <p className="text-xs text-neutral-500">
                Deterministic Karnataka cost calculation ({budget.tier.toUpperCase()} Tier)
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800">
          Backend Arithmetic
        </span>
      </div>

      {/* Main Totals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Per Person</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[#0F382A]">
              ₹{budget.per_person_inr.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>For {travelers} traveler{travelers > 1 ? "s" : ""}</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F9B208]/10 border border-[#F9B208]/30">
          <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Total Group Cost</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-neutral-900">
              ₹{budget.total_group_inr.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1">All-inclusive trip total</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Daily Average</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-blue-950">
              ₹{budget.cost_per_day_inr.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-blue-700">/ day</span>
          </div>
          <p className="text-[11px] text-blue-700 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Across {days} day{days > 1 ? "s" : ""}</span>
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="space-y-3.5 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-emerald-700" />
          <span>Category-Wise Breakdown</span>
        </h4>

        {budget.category_shares.map((cat) => (
          <div key={cat.category} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-neutral-800">{cat.category}</span>
              <span className="text-neutral-600 font-medium">
                ₹{cat.amount_inr.toLocaleString("en-IN")}{" "}
                <span className="text-neutral-400">({cat.percentage}%)</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0F382A]"
                style={{ width: `${Math.min(100, Math.max(3, cat.percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Assumptions & Disclosures */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Budget Assumptions:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-500">
          {budget.assumptions.map((asm, idx) => (
            <li key={idx}>{asm}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
