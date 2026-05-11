"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { medicines, categories } from "@/lib/data";
import { MedicineCard } from "@/components/MedicineCard";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/CartDrawer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = useCartStore((state) => state.getTotalItems());

  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || med.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative pb-24">
      {/* Header & Sticky Search */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
          MediQuick
        </h1>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 text-slate-900 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow"
          />
        </div>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="px-4 py-4 bg-slate-50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 active:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine List */}
      <div className="flex-1 bg-white border-t border-slate-100">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))
        ) : (
          <div className="text-center text-slate-500 mt-10">
            No medicines found.
          </div>
        )}
      </div>

      {/* Sticky Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-20">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-full">
                <ShoppingBag size={20} />
              </div>
              <span className="font-medium">{totalItems} items added</span>
            </div>
            <span className="font-semibold text-sm bg-white text-slate-900 px-4 py-1.5 rounded-full">
              View Cart
            </span>
          </button>
        </div>
      )}

      {/* Slide-up Cart Modal */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
