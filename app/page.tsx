"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Send,
  ArrowUpDown,
} from "lucide-react";
import { medicines, categories } from "@/lib/data";
import { MedicineCard } from "@/components/MedicineCard";
import { useCartStore, selectTotalItems, haptic } from "@/store/useCartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { ToastProvider, useToast } from "@/components/Toast";

// ---------------------------------------------------------------------------
// Skeleton card
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)]">
      <div className="w-11 h-11 rounded-2xl bg-[var(--color-surface-2)] animate-pulse" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 w-36 bg-[var(--color-surface-2)] rounded-md animate-pulse" />
        <div className="h-3 w-28 bg-[var(--color-surface-2)] rounded-md animate-pulse" />
        <div className="h-4 w-16 bg-[var(--color-surface-2)] rounded-full animate-pulse" />
      </div>
      <div className="h-10 w-[72px] bg-[var(--color-surface-2)] rounded-full animate-pulse shrink-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Request-a-Feature page
// ---------------------------------------------------------------------------
const QUICK_PROMPTS = [
  "I need an out-of-stock medicine",
  "Please add a new brand",
  "Bulk order inquiry",
];

function RequestFeaturePage({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState("");
  const max = 500;
  const canSend = message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    haptic(8);
    const encoded = encodeURIComponent(message.trim());
    window.open(
      `https://wa.me/?text=${encoded}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 glass border-b border-[var(--color-border)] px-4 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center text-[var(--color-ink-900)] active:bg-[var(--color-surface-2)] rounded-full -ml-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[var(--color-ink-900)] tracking-tight">
            Request a Feature
          </h1>
        </div>
      </header>

      <div className="flex flex-col flex-1 px-5 pt-6 gap-5">
        <div>
          <h2 className="text-[22px] font-bold text-[var(--color-ink-900)] tracking-tight">
            Tell us what you need
          </h2>
          <p className="text-sm text-[var(--color-ink-500)] mt-1">
            We&apos;ll get back to you on WhatsApp.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-1 shadow-soft">
          <textarea
            placeholder="I'd like to order…"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, max))}
            rows={6}
            className="w-full bg-transparent text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-300)] rounded-xl p-4 outline-none resize-none"
          />
          <div className="flex justify-end px-3 pb-2">
            <span className="text-[11px] tabular-nums text-[var(--color-ink-300)]">
              {message.length} / {max}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-500)] mb-2 flex items-center gap-1.5">
            <Sparkles size={12} /> Quick prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setMessage(p)}
                className="text-sm px-3.5 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink-900)] active:bg-[var(--color-surface-2)] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pb-6">
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="w-full h-13 min-h-[52px] flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white font-semibold rounded-2xl active:scale-[0.98] transition-transform shadow-accent disabled:opacity-40 disabled:shadow-none"
          >
            <Send size={18} />
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home — inner (uses toast)
// ---------------------------------------------------------------------------
function HomeInner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortAZ, setSortAZ] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "request-feature">(
    "home",
  );

  const deferredQuery = useDeferredValue(searchQuery);
  const totalItems = useCartStore(selectTotalItems);

  useEffect(() => {
    useCartStore.persist?.rehydrate?.();
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const showRequestFeature = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return q.length > 0 && "request a feature".startsWith(q);
  }, [deferredQuery]);

  const filteredMedicines = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const list = medicines.filter((med) => {
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.company.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || med.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    return sortAZ
      ? [...list].sort((a, b) => a.name.localeCompare(b.name))
      : list;
  }, [deferredQuery, activeCategory, sortAZ]);

  if (currentView === "request-feature") {
    return <RequestFeaturePage onBack={() => setCurrentView("home")} />;
  }

  return (
    <div
      className="flex flex-col flex-1 relative"
      style={{ paddingBottom: totalItems > 0 ? 112 : 24 }}
    >
      {/* Sticky header (title + search + chips bundled) */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/90 glass border-b border-[var(--color-border)]">
        <header className="px-5 pt-6 pb-3">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[12px] text-[var(--color-ink-500)] font-medium">
                Good day 👋
              </p>
              <h1 className="text-[26px] font-bold text-[var(--color-ink-900)] tracking-tight leading-tight">
                MediQuick
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-300)] pointer-events-none"
              size={18}
            />
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Search medicines or brands…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-300)] rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 transition shadow-soft"
            />
          </div>
        </header>

        {/* Category chips */}
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    haptic(4);
                    setActiveCategory(category);
                  }}
                  className={`px-4 h-9 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-[var(--color-ink-900)] text-white shadow-soft"
                      : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink-500)] active:bg-[var(--color-surface-2)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results toolbar */}
      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-[12px] text-[var(--color-ink-500)] font-medium">
          <span className="tabular-nums text-[var(--color-ink-900)] font-semibold">
            {filteredMedicines.length}
          </span>{" "}
          {filteredMedicines.length === 1 ? "result" : "results"}
        </p>
        <button
          onClick={() => setSortAZ((v) => !v)}
          className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-ink-500)] active:text-[var(--color-ink-900)]"
        >
          <ArrowUpDown size={12} />
          {sortAZ ? "A–Z" : "Default"}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 mx-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-soft overflow-hidden">
        {isLoading ? (
          <ul>
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className={
                  i !== 0 ? "border-t border-[var(--color-border)]" : ""
                }
              >
                <SkeletonCard />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {showRequestFeature && (
              <button
                onClick={() => {
                  haptic(6);
                  setCurrentView("request-feature");
                }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left active:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-brand-soft) 0%, #f3e8ff 100%)",
                }}
              >
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-soft">
                  <Sparkles size={20} className="text-[var(--color-brand)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-ink-900)] text-[15px] leading-tight">
                    Can&apos;t find what you need?
                  </p>
                  <p className="text-[12px] text-[var(--color-ink-500)] mt-0.5">
                    Request a Feature — we&apos;ll add it for you
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-[var(--color-brand)] shrink-0"
                />
              </button>
            )}

            {filteredMedicines.length > 0 ? (
              <ul className="animate-fade-in">
                {filteredMedicines.map((medicine, idx) => (
                  <li
                    key={medicine.id}
                    className={
                      idx !== 0 || showRequestFeature
                        ? "border-t border-[var(--color-border)]"
                        : ""
                    }
                  >
                    <MedicineCard medicine={medicine} />
                  </li>
                ))}
              </ul>
            ) : !showRequestFeature ? (
              <div className="text-center py-16 px-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mb-3">
                  <Search size={22} className="text-[var(--color-ink-300)]" />
                </div>
                <p className="font-semibold text-[var(--color-ink-900)]">
                  No medicines found
                </p>
                <p className="text-sm text-[var(--color-ink-500)] mt-1">
                  Try a different search or category
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Floating cart bar */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 z-40 animate-slide-up pointer-events-none"
          style={{
            paddingBottom: "calc(var(--safe-bottom) + 12px)",
            paddingTop: 8,
          }}
        >
          <button
            onClick={() => {
              haptic(6);
              setIsCartOpen(true);
            }}
            className="pointer-events-auto w-full bg-[var(--color-brand)] text-white rounded-2xl p-4 flex items-center justify-between shadow-cta active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded-xl relative">
                <ShoppingBag size={18} />
                <span
                  key={totalItems}
                  className="absolute -top-1.5 -right-1.5 bg-white text-[var(--color-brand)] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center animate-pop"
                >
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm leading-tight">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} added
                </p>
                <p className="text-[11px] text-white/70 leading-tight mt-0.5">
                  Ready to order
                </p>
              </div>
            </div>
            <span className="font-semibold text-sm bg-white text-[var(--color-brand)] px-4 py-2 rounded-full flex items-center gap-1">
              View Cart <ArrowRight size={14} />
            </span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default export — wraps with ToastProvider
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <ToastProvider>
      <HomeInner />
    </ToastProvider>
  );
}
