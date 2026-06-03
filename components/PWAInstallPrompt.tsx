"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Download, Smartphone, Zap, Wifi, Star } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setIsInstalling(false);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowPrompt(false);

    setTimeout(
      () => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      },
      60 * 60 * 1000,
    );
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4 bg-white/95 backdrop-blur-xl border border-slate-200 px-5 py-3 rounded-full shadow-xl shadow-blue-500/10 max-w-md w-full sm:w-auto">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            Install SMARTSIS App
          </p>
          <p className="text-xs text-slate-400 truncate">
            Lebih cepat & bisa offline
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isInstalling ? "Memasang..." : "Install"}
            </span>
          </button>

          <button
            onClick={() => setDeferredPrompt(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
