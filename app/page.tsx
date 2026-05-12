"use client";
import { useState, useMemo, useEffect, useDeferredValue } from "react";
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  MessageSquarePlus,
} from "lucide-react";
import { medicines, categories } from "@/lib/data";
import { MedicineCard } from "@/components/MedicineCard";
import { useCartStore, selectTotalItems } from "@/store/useCartStore";
import { CartDrawer } from "@/components/CartDrawer";

// ---------------------------------------------------------------------------
// Skeleton card — mirrors the real MedicineCard layout
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-white border-b border-slate-100">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 w-36 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-3 w-28 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-3 w-16 bg-slate-100 rounded-md animate-pulse" />
      </div>
      <div className="h-10 w-[72px] bg-slate-100 rounded-full animate-pulse shrink-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Request‑a‑Feature page
// ---------------------------------------------------------------------------
function RequestFeaturePage({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    const encoded = encodeURIComponent(message);
    window.open(
      `https://wa.me/?text=${encoded}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 glass border-b border-slate-100 px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="w-9 h-9 flex items-center justify-center text-slate-600 active:bg-slate-100 rounded-full -ml-1"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Request a Feature
          </h1>
        </div>
      </header>

      <div className="flex flex-col flex-1 px-4 pt-6 gap-4">
        <textarea
          placeholder="Write your query here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition resize-none"
        />
        <button
          onClick={handleSend}
          className="w-full h-12 bg-green-500 text-white font-semibold rounded-2xl active:bg-green-600 active:scale-[0.98] transition-transform shadow-md shadow-green-500/30"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "request-feature">(
    "home",
  );

  // Defer heavy filtering on each keystroke (React 19) — smoother typing on low-end devices
  const deferredQuery = useDeferredValue(searchQuery);

  const totalItems = useCartStore(selectTotalItems);

  useEffect(() => {
    // Hydrate persisted cart on the client (skipHydration is true in the store)
    useCartStore.persist?.rehydrate?.();

    // Brief skeleton window — improves perceived performance on first paint
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Show the "Request a Feature" special result whenever the query is a
  // non-empty prefix of the phrase (case-insensitive).
  const showRequestFeature = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return q.length > 0 && "request a feature".startsWith(q);
  }, [deferredQuery]);

  const filteredMedicines = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return medicines.filter((med) => {
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.company.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || med.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [deferredQuery, activeCategory]);

  // -------------------------------------------------------------------------
  // Request‑a‑Feature view
  // -------------------------------------------------------------------------
  if (currentView === "request-feature") {
    return <RequestFeaturePage onBack={() => setCurrentView("home")} />;
  }

  // -------------------------------------------------------------------------
  // Main home view
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col flex-1 bg-white relative pb-28">
      {/* Sticky header with search */}
      <header className="sticky top-0 z-30 bg-white/95 glass border-b border-slate-100 px-4 pt-5 pb-3">
        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            MediQuick
          </h1>
          <span className="text-xs text-slate-400 font-medium">
            {filteredMedicines.length} items
          </span>
        </div>

        {/* Search — native clear button only (no custom X) */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Search medicines or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition"
          />
        </div>
      </header>

      {/* Category chips */}
      <div className="sticky top-28 z-20 bg-white/95 glass px-4 py-3 border-b border-slate-100">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 h-9 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 active:bg-slate-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Medicine list */}
      <div className="flex-1">
        {isLoading ? (
          // Skeleton loaders for initial load
          <ul>
            {Array.from({ length: 7 }).map((_, i) => (
              <li key={i}>
                <SkeletonCard />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* "Request a Feature" smart suggestion */}
            {showRequestFeature && (
              <button
                onClick={() => setCurrentView("request-feature")}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-blue-50 border-b border-slate-100 active:bg-blue-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <MessageSquarePlus size={18} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-blue-700">Request a Feature</p>
                  <p className="text-xs text-blue-400">
                    Tell us what you&apos;d like to see
                  </p>
                </div>
              </button>
            )}

            {filteredMedicines.length > 0 ? (
              <ul className="animate-fade-in">
                {filteredMedicines.map((medicine) => (
                  <li key={medicine.id}>
                    <MedicineCard medicine={medicine} />
                  </li>
                ))}
              </ul>
            ) : !showRequestFeature ? (
              <div className="text-center text-slate-500 mt-16 px-6">
                <p className="font-medium text-slate-700">No medicines found</p>
                <p className="text-sm text-slate-400 mt-1">
                  Try a different search or category
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Sticky bottom cart bar */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 z-40 animate-slide-up"
          style={{
            paddingBottom: "calc(var(--safe-bottom) + 12px)",
            paddingTop: 8,
          }}
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-slate-900/25 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-full relative">
                <ShoppingBag size={18} />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full min-w-4.5h-[18px] px-1 flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="font-medium text-sm">
                {totalItems} item{totalItems !== 1 ? "s" : ""} added
              </span>
            </div>
            <span className="font-semibold text-sm bg-white text-slate-900 px-4 py-1.5 rounded-full">
              View Cart
            </span>
          </button>
        </div>
      )}

      {/* Slide-up cart modal */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
