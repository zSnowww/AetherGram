import React, { useState } from "react";
import { LockKey, Eye, EyeSlash, WarningCircle, ArrowRight, X } from "@phosphor-icons/react";

export default function TwoFactorModal({ hint, onSubmit, onCancel }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Ingresa tu contraseña.");
      return;
    }
    setError("");
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-tg-surface rounded-2xl border border-tg-border p-6 shadow-2xl animate-slide-up space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LockKey size={20} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white leading-tight">
              Contraseña 2FA
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-tg-muted hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {hint && (
          <div className="p-2.5 rounded-lg bg-tg-bg border border-tg-border text-xs text-tg-muted">
            <span className="text-tg-accent font-medium">Pista:</span>{" "}
            <span className="text-tg-text">{hint}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña en la nube"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-tg-bg border border-tg-border text-white text-xs focus:outline-none focus:border-tg-accent transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tg-muted hover:text-white p-1 cursor-pointer"
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>

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
