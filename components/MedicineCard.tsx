"use client";
import { memo } from "react";
import { Medicine } from "@/lib/data";
import { useCartStore, selectQuantityById } from "@/store/useCartStore";
import { Plus, Minus } from "lucide-react";

function MedicineCardBase({ medicine }: { medicine: Medicine }) {
  const quantity = useCartStore(selectQuantityById(medicine.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-white border-b border-slate-100 active:bg-slate-50 transition-colors">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 truncate">{medicine.name}</h3>

        <p className="text-sm text-slate-500 truncate">
          {medicine.strength} · {medicine.company}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">{medicine.category}</span>
        </div>
      </div>

      <div className="shrink-0">
        {quantity === 0 ? (
          <button
            onClick={() => addItem(medicine)}
            aria-label={`Add ${medicine.name} to cart`}
            className="min-w-18 h-10 px-4 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full bg-blue-50 active:bg-blue-100 active:scale-95 transition-transform"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full h-10">
            <button
              onClick={() => updateQuantity(medicine.id, quantity - 1)}
              className="w-10 h-10 flex items-center justify-center text-blue-600 active:bg-blue-100 rounded-l-full"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>

            <span className="w-7 text-center text-sm font-semibold text-blue-900 tabular-nums">
              {quantity}
            </span>

            <button
              onClick={() => addItem(medicine)}
              className="w-10 h-10 flex items-center justify-center text-blue-600 active:bg-blue-100 rounded-r-full"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const MedicineCard = memo(MedicineCardBase);
