"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Copy, Send, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, clearCart, getTotalItems } = useCartStore();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const formatMessage = () => {
    let text = "Hello, I want to order:\n\n";
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (${item.strength}) x ${item.quantity}\n`;
    });
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatMessage());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl max-w-md mx-auto max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Your Cart ({getTotalItems()})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 active:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">{item.strength}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-full">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1.5 text-slate-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5 text-slate-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.id, 0)}
                      className="text-red-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex justify-between mb-4">
              <button
                onClick={clearCart}
                className="text-sm text-slate-500 underline"
              >
                Clear Cart
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl active:bg-slate-200 transition-colors"
              >
                <Copy size={18} />
                {copied ? "Copied!" : "Copy List"}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white font-medium rounded-xl active:bg-green-600 transition-colors shadow-sm shadow-green-500/20"
              >
                <Send size={18} />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
