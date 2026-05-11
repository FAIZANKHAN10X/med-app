"use client";

import { Medicine } from "@/lib/data";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Minus } from "lucide-react";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === medicine.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 active:bg-slate-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-slate-900">{medicine.name}</h3>
        <p className="text-sm text-slate-500">
          {medicine.strength} • {medicine.company}
        </p>
        <p className="text-xs text-slate-400 mt-1">{medicine.category}</p>
      </div>

      <div className="ml-4">
        {quantity === 0 ? (
          <button
            onClick={() => addItem(medicine)}
            className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-full bg-blue-50 active:bg-blue-100 transition-colors"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full">
            <button
              onClick={() => updateQuantity(medicine.id, quantity - 1)}
              className="p-2 text-blue-600 active:bg-blue-100 rounded-l-full"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-sm font-medium text-blue-900">
              {quantity}
            </span>
            <button
              onClick={() => addItem(medicine)}
              className="p-2 text-blue-600 active:bg-blue-100 rounded-r-full"
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
