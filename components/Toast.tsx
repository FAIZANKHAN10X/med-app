"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Check, Undo2 } from "lucide-react";

type ToastAction = { label: string; onClick: () => void };
type Toast = {
  id: number;
  message: string;
  action?: ToastAction;
  icon?: "check" | "undo";
};

interface ToastCtx {
  show: (
    message: string,
    opts?: { action?: ToastAction; icon?: "check" | "undo"; duration?: number },
  ) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback<ToastCtx["show"]>((message, opts) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({
      id: Date.now(),
      message,
      action: opts?.action,
      icon: opts?.icon,
    });
    timerRef.current = setTimeout(() => setToast(null), opts?.duration ?? 3000);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed left-1/2 z-[60] animate-toast"
          style={{
            bottom: "calc(var(--safe-bottom) + 96px)",
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex items-center gap-3 bg-[var(--color-ink-900)] text-white px-4 py-3 rounded-2xl shadow-card min-w-[260px] max-w-[88vw]">
            {toast.icon === "check" && (
              <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                <Check size={14} />
              </span>
            )}
            {toast.icon === "undo" && (
              <Undo2 size={16} className="text-white/70 shrink-0" />
            )}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action!.onClick();
                  setToast(null);
                }}
                className="text-sm font-semibold text-[var(--color-brand-soft)] active:opacity-70 px-2 -mr-1"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
