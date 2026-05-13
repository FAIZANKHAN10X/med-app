"use client";

import { useCartStore, selectTotalItems, haptic } from "@/store/useCartStore";
import { categoryStyle } from "@/lib/data";
import {
  X,
  Copy,
  Send,
  Trash2,
  Plus,
  Minus,
  Check,
  Pill,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./Toast";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const undoClear = useCartStore((s) => s.undoClear);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const formatMessage = useCallback(() => {
    let text = "Hello, I'd like to order:\n\n";
    items.forEach((item, i) => {
      text += `${i + 1}. ${item.name} (${item.strength}) — Qty: ${item.quantity}\n`;
    });
    text += `\nTotal items: ${totalItems}`;
    return text;
  }, [items, totalItems]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatMessage());
    } catch {
      const ta = document.createElement("textarea");
      ta.value = formatMessage();
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
    }
    haptic(8);
    setCopied(true);
    toast.show("Copied to clipboard", { icon: "check" });
    setTimeout(() => setCopied(false), 1800);
  };

  const handleWhatsApp = () => {
    haptic(8);
    const text = encodeURIComponent(formatMessage());
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleClear = () => {
    clearCart();
    toast.show("Cart cleared", {
      icon: "undo",
      action: { label: "Undo", onClick: undoClear },
      duration: 4000,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Your cart"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[var(--color-ink-900)]/55 animate-fade-in"
      />

      {/* Drawer */}
      <div
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-md bg-[var(--color-surface)] rounded-t-3xl shadow-2xl flex flex-col max-h-[88dvh] animate-slide-up"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-[var(--color-border)]" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-ink-900)] tracking-tight">
              Your Cart
            </h2>
            <p className="text-[13px] text-[var(--color-ink-500)] mt-0.5">
              {totalItems === 0
                ? "Empty"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} ready to order`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 -mr-1 -mt-1 flex items-center justify-center text-[var(--color-ink-500)] active:bg-[var(--color-surface-2)] rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar overscroll-contain">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mb-4">
                <ShoppingBag
                  size={28}
                  className="text-[var(--color-ink-300)]"
                />
              </div>
              <p className="font-semibold text-[var(--color-ink-900)]">
                Your cart is empty
              </p>
              <p className="text-sm text-[var(--color-ink-500)] mt-1">
                Browse medicines to get started
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => {
                const cat = categoryStyle(item.category);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-2xl bg-[var(--color-surface-2)]"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: cat.bg, color: cat.fg }}
                    >
                      <Pill size={18} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--color-ink-900)] text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-[12px] text-[var(--color-ink-500)] truncate">
                        {item.strength} · {item.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center bg-white border border-[var(--color-border)] rounded-full h-9">
                        <button
                          onClick={() => {
                            haptic(4);
                            updateQuantity(item.id, item.quantity - 1);
                          }}
                          aria-label="Decrease"
                          className="w-9 h-9 flex items-center justify-center text-[var(--color-ink-500)] active:bg-[var(--color-surface-2)] rounded-l-full"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums text-[var(--color-ink-900)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            haptic(4);
                            addItem(item);
                          }}
                          aria-label="Increase"
                          disabled={item.quantity >= 99}
                          className="w-9 h-9 flex items-center justify-center text-[var(--color-ink-500)] active:bg-[var(--color-surface-2)] rounded-r-full disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.id, 0)}
                        aria-label="Remove item"
                        className="w-9 h-9 flex items-center justify-center text-[var(--color-ink-300)] active:bg-red-50 active:text-[var(--color-danger)] rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Order summary */}
          {items.length > 0 && (
            <div className="mt-5 p-4 rounded-2xl bg-[var(--color-surface-2)]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-500)] mb-2">
                Order summary
              </p>
              <div className="flex justify-between text-sm py-1">
                <span className="text-[var(--color-ink-500)]">Total items</span>
                <span className="font-semibold text-[var(--color-ink-900)] tabular-nums">
                  {totalItems}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-[var(--color-ink-500)]">
                  Estimated delivery
                </span>
                <span className="font-semibold text-[var(--color-ink-900)]">
                  ~30 min
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pt-3 pb-5 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 h-12 bg-[var(--color-surface-2)] text-[var(--color-ink-900)] font-semibold rounded-2xl active:bg-[var(--color-border)] active:scale-[0.98] transition-transform"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy List"}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 h-12 bg-[var(--color-accent)] text-white font-semibold rounded-2xl active:scale-[0.98] transition-transform shadow-accent"
              >
                <Send size={18} />
                WhatsApp
              </button>
            </div>
            <button
              onClick={handleClear}
              className="w-full text-center text-sm text-[var(--color-ink-500)] active:text-[var(--color-danger)] py-2 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
