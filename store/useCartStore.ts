import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Medicine } from "@/lib/data";

export interface CartItem extends Medicine {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  lastCleared: CartItem[] | null; // for undo
  addItem: (medicine: Medicine) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  undoClear: () => void;
}

const MAX_QTY = 99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lastCleared: null,
      addItem: (medicine) => {
        const existing = get().items.find((i) => i.id === medicine.id);
        if (existing) {
          if (existing.quantity >= MAX_QTY) return;
          set({
            items: get().items.map((i) =>
              i.id === medicine.id
                ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...medicine, quantity: 1 }] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, MAX_QTY) } : i,
          ),
        });
      },
      clearCart: () => {
        const current = get().items;
        if (current.length === 0) return;
        set({ items: [], lastCleared: current });
      },
      undoClear: () => {
        const last = get().lastCleared;
        if (last) set({ items: last, lastCleared: null });
      },
    }),
    {
      name: "mediquick-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ items: s.items }), // don't persist lastCleared
    },
  ),
);

export const selectTotalItems = (s: CartStore) =>
  s.items.reduce((t, i) => t + i.quantity, 0);

export const selectQuantityById = (id: string) => (s: CartStore) =>
  s.items.find((i) => i.id === id)?.quantity ?? 0;

// Tiny haptic helper (no-op if unsupported)
export function haptic(ms = 6) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {}
  }
}
