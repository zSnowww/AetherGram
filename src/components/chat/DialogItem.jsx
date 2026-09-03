import React from "react";
import { Robot, Broadcast, UsersThree, User, CaretRight } from "@phosphor-icons/react";

export default function DialogItem({ dialog, onSelect }) {
  const getIcon = () => {
    if (dialog.isBot) return <Robot size={18} className="text-tg-accent" />;
    if (dialog.isChannel) return <Broadcast size={18} className="text-purple-400" />;
    if (dialog.isGroup) return <UsersThree size={18} className="text-blue-400" />;
    return <User size={18} className="text-emerald-400" />;
  };

  const getBadge = () => {
    if (dialog.isBot) return <span className="text-[10px] bg-tg-primary/20 text-tg-accent px-1.5 py-0.2 rounded font-medium">Bot</span>;
    if (dialog.isChannel) return <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-medium">Canal</span>;
    if (dialog.isGroup) return <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-medium">Grupo</span>;
    return <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-medium">Usuario</span>;
  };

  return (
    <div
      onClick={() => onSelect(dialog)}
      className="p-2.5 rounded-xl bg-tg-surface/60 hover:bg-tg-surface border border-tg-border hover:border-tg-accent/40 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-tg-bg flex items-center justify-center border border-tg-border shrink-0">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-[220px]">
              {dialog.name}
            </span>
            {getBadge()}
          </div>
          <div className="text-[10px] text-tg-muted truncate font-mono">
            {dialog.username ? `@${dialog.username}` : `ID: ${dialog.id}`}
          </div>
        </div>
      </div>

      <CaretRight size={14} className="text-tg-muted group-hover:text-white transition-colors shrink-0 ml-2" />
    </div>
  );
}
