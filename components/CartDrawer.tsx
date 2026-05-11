"use client";

import { useCartStore, selectTotalItems } from "@/store/useCartStore";
import { X, Copy, Send, Trash2, Plus, Minus, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

  const [copied, setCopied] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const formatMessage = useCallback(() => {
    let text = "Hello, I want to order:\n\n";

    items.forEach((item, i) => {
      text += `${i + 1}. ${item.name} (${item.strength}) x ${item.quantity}\n`;
    });

    return text;
  }, [items]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatMessage());

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      const ta = document.createElement("textarea");

      ta.value = formatMessage();

      document.body.appendChild(ta);

      ta.select();

      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {}

      document.body.removeChild(ta);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatMessage());

    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 animate-fade-in"
      />

      {/* Drawer */}
      <div
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-md bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[88dvh] animate-slide-up"
        style={{
          paddingBottom: "var(--safe-bottom)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Your Cart{" "}
            <span className="text-slate-400 font-medium">({totalItems})</span>
          </h2>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 -mr-2 flex items-center justify-center text-slate-500 active:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar overscroll-contain">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 py-16">
              <p className="font-medium text-slate-700">Your cart is empty</p>

              <p className="text-sm text-slate-400 mt-1">
                Add medicines to get started
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {item.name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {item.strength}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-full h-9">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease"
                        className="w-9 h-9 flex items-center justify-center text-slate-600 active:bg-slate-200 rounded-l-full"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-6 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => addItem(item)}
                        aria-label="Increase"
                        className="w-9 h-9 flex items-center justify-center text-slate-600 active:bg-slate-200 rounded-r-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => updateQuantity(item.id, 0)}
                      aria-label="Remove item"
                      className="w-9 h-9 flex items-center justify-center text-red-400 active:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pt-3 pb-5 border-t border-slate-100 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500">
                {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </span>

              <button
                onClick={clearCart}
                className="text-sm text-slate-500 active:text-slate-700"
              >
                Clear cart
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 h-12 bg-slate-100 text-slate-800 font-medium rounded-xl active:bg-slate-200 active:scale-[0.98] transition-transform"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}

                {copied ? "Copied!" : "Copy List"}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 h-12 bg-green-500 text-white font-semibold rounded-xl active:bg-green-600 active:scale-[0.98] transition-transform shadow-md shadow-green-500/30"
              >
                <Send size={18} />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
