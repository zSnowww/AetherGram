import React from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";

export default function CredentialsDrawer({
  useCustom,
  onToggleCustom,
  apiId,
  setApiId,
  apiHash,
  setApiHash,
}) {
  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-tg-surface/60 border border-tg-border">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white">
            Credenciales API personalizadas
          </span>
          <span className="text-[10px] text-tg-muted">
            Desde my.telegram.org (Opcional)
          </span>
        </div>
        <input
          type="checkbox"
          checked={useCustom}
          onChange={(e) => onToggleCustom(e.target.checked)}
          className="w-4 h-4 rounded text-tg-primary bg-tg-bg border-tg-border cursor-pointer"
        />
      </div>

      {/* Drawer content */}
      {useCustom && (
        <div className="space-y-3 p-3.5 rounded-xl bg-tg-bg/50 border border-tg-border animate-fade-in">
          <div className="flex items-center justify-between text-[11px] text-tg-accent">
            <span>Obtener credenciales</span>
            <a
              href="https://my.telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <span>my.telegram.org</span>
              <ArrowSquareOut size={13} />
            </a>
          </div>

          <div>
            <label className="block text-xs font-medium text-tg-muted mb-1">
              API ID
            </label>
            <input
              type="text"
              value={apiId}
              onChange={(e) => setApiId(e.target.value)}
              placeholder="Ej. 12345678"
              className="w-full px-3 py-2 rounded-lg bg-tg-bg border border-tg-border text-white text-xs focus:outline-none focus:border-tg-accent transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-tg-muted mb-1">
              API HASH
            </label>
            <input
              type="text"
              value={apiHash}
              onChange={(e) => setApiHash(e.target.value)}
              placeholder="Ej. 8da85b0d5bfe0a1315b89a64ed13805c"
              className="w-full px-3 py-2 rounded-lg bg-tg-bg border border-tg-border text-white text-xs focus:outline-none focus:border-tg-accent transition-colors font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
