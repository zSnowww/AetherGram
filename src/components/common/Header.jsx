import React from "react";
import { PaperPlaneTilt, SignOut } from "@phosphor-icons/react";

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b border-tg-border bg-tg-surface/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-tg-primary/20 text-tg-accent flex items-center justify-center border border-tg-primary/30">
            <PaperPlaneTilt size={18} weight="fill" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            AetherGram
          </span>
        </div>

        {/* User Session Info */}
        {user && (
          <div className="flex items-center gap-2 bg-tg-bg/70 border border-tg-border rounded-xl px-3 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-tg-text font-medium truncate max-w-[140px] sm:max-w-[180px]">
              {user.firstName || user.username || "Conectado"}
            </span>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="ml-1 text-tg-muted hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10 cursor-pointer"
            >
              <SignOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
