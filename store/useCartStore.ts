import { create } from "zustand";
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
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (medicine) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === medicine.id);
    if (existingItem) {
      set({
        items: items.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      set({ items: [...items, { ...medicine, quantity: 1 }] });
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter((item) => item.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));
