"use client";

import { memo } from "react";
import { Medicine, categoryStyle } from "@/lib/data";
import { useCartStore, selectQuantityById, haptic } from "@/store/useCartStore";
import { Plus, Minus, Pill } from "lucide-react";

function MedicineCardBase({ medicine }: { medicine: Medicine }) {
  const quantity = useCartStore(selectQuantityById(medicine.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cat = categoryStyle(medicine.category);

  const handleAdd = () => {
    haptic(6);
    addItem(medicine);
  };
  const handleDec = () => {
    haptic(4);
    updateQuantity(medicine.id, quantity - 1);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] active:bg-[var(--color-surface-2)] transition-colors">
      {/* Category avatar */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: cat.bg, color: cat.fg }}
        aria-hidden
      >
        <Pill size={20} strokeWidth={2.2} />
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[15px] leading-tight text-[var(--color-ink-900)] truncate">
          {medicine.name}
        </h3>
        <p className="text-[13px] text-[var(--color-ink-500)] truncate mt-0.5">
          {medicine.strength} · {medicine.company}
        </p>
        <span
          className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: cat.bg, color: cat.fg }}
        >
          {medicine.category}
        </span>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            aria-label={`Add ${medicine.name} to cart`}
            className="min-w-[72px] h-10 px-4 text-sm font-semibold text-[var(--color-brand)] border border-[var(--color-brand)]/20 rounded-full bg-[var(--color-brand-soft)] active:scale-95 active:bg-[var(--color-brand)]/15 transition-transform"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center bg-[var(--color-brand)] rounded-full h-10 shadow-soft animate-pop">
            <button
              onClick={handleDec}
              className="w-10 h-10 flex items-center justify-center text-white active:bg-white/15 rounded-l-full"
              aria-label="Decrease quantity"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <span className="w-7 text-center text-sm font-bold text-white tabular-nums">
              {quantity}
            </span>
            <button
              onClick={handleAdd}
              className="w-10 h-10 flex items-center justify-center text-white active:bg-white/15 rounded-r-full"
              aria-label="Increase quantity"
              disabled={quantity >= 99}
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const MedicineCard = memo(MedicineCardBase);
