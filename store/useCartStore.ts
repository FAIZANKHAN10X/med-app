import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Medicine } from "@/lib/data";

export interface CartItem extends Medicine {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (medicine: Medicine) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (medicine) => {
        const existing = get().items.find((i) => i.id === medicine.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === medicine.id ? { ...i, quantity: i.quantity + 1 } : i,
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
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "mediquick-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // we'll hydrate on client to avoid SSR mismatch
    },
  ),
);

// Stable derived selectors (avoid recomputing identities)
export const selectTotalItems = (s: CartStore) =>
  s.items.reduce((t, i) => t + i.quantity, 0);

export const selectQuantityById = (id: string) => (s: CartStore) =>
  s.items.find((i) => i.id === id)?.quantity ?? 0;
