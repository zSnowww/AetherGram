import React from "react";
import { Robot, ArrowRight } from "@phosphor-icons/react";
import { DEFAULT_TARGET } from "../../config/constants";

export default function PriorityTargetBanner({ onSelectDefaultTarget, maxMessages }) {
  return (
    <div className="p-3.5 rounded-2xl bg-tg-surface/70 border border-tg-border hover:border-tg-accent/40 shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-tg-primary/15 text-tg-accent flex items-center justify-center border border-tg-primary/25 shrink-0">
          <Robot size={22} weight="duotone" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">@{DEFAULT_TARGET.username}</span>
            {DEFAULT_TARGET.id && <span className="text-[10px] text-tg-muted font-mono">ID: {DEFAULT_TARGET.id}</span>}
          </div>
          <p className="text-[11px] text-tg-muted">Acceso directo recomendado</p>
        </div>
      </div>

      <button
        onClick={() =>
          onSelectDefaultTarget({
            name: `@${DEFAULT_TARGET.username}`,
            username: DEFAULT_TARGET.username,
            id: DEFAULT_TARGET.id,
            targetInput: DEFAULT_TARGET.id,
            maxMessages,
          })
        }
        className="py-2 px-3.5 rounded-xl bg-tg-primary hover:bg-tg-primaryHover text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
      >
        <span>Extraer @{DEFAULT_TARGET.username}</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
