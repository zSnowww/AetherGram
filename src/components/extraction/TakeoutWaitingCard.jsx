import React from "react";
import { DeviceMobile, Spinner } from "@phosphor-icons/react";

export default function TakeoutWaitingCard({ takeoutStatus }) {
  return (
    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5">
      <div className="flex items-center gap-2 font-semibold text-amber-300 text-xs">
        <DeviceMobile size={18} className="shrink-0 text-amber-400" />
        <span>Confirma en tu Telegram móvil:</span>
      </div>

      <div className="bg-black/30 p-2.5 rounded-lg border border-amber-500/20 text-[11px] text-amber-100/90 leading-relaxed">
        Abre la app de <strong>Telegram</strong> en tu teléfono y presiona el botón <strong className="text-emerald-400 font-bold underline">"Allow" (Permitir)</strong> en la notificación de exportación recibida.
      </div>

      <div className="flex items-center justify-between text-[11px] text-amber-300/80">
        <span className="flex items-center gap-1.5 font-mono">
          <Spinner size={13} className="animate-spin" />
          Esperando confirmación... (Intento #{takeoutStatus?.attempt || 1})
        </span>
      </div>
    </div>
  );
}
