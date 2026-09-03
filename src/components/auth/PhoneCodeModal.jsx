import React, { useState } from "react";
import { ChatCircleText, ArrowRight, X, WarningCircle } from "@phosphor-icons/react";

export default function PhoneCodeModal({ phoneNumber, isCodeViaApp, onSubmit, onCancel }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Ingresa el código recibido.");
      return;
    }
    setError("");
    onSubmit(code.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-tg-surface rounded-2xl border border-tg-border p-6 shadow-2xl animate-slide-up space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatCircleText size={20} className="text-tg-accent" />
            <h3 className="text-sm font-bold text-white leading-tight">
              Código de Verificación
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-tg-muted hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <p className="text-xs text-tg-muted leading-relaxed">
          Ingresa el código enviado a tu cuenta de Telegram para <span className="text-tg-text font-mono font-medium">{phoneNumber}</span>:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="12345"
            maxLength={8}
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl bg-tg-bg border border-tg-border text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:border-tg-accent transition-colors"
          />

          {error && (
            <div className="text-xs text-red-400 flex items-center gap-1.5">
              <WarningCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-3 rounded-xl bg-tg-bg hover:bg-tg-surfaceHover border border-tg-border text-tg-muted text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-xl bg-tg-primary hover:bg-tg-primaryHover text-white text-xs font-medium shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Verificar</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
