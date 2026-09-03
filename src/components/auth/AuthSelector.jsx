import React from "react";
import { DeviceMobile, QrCode } from "@phosphor-icons/react";

export default function AuthSelector({ authMethod, onSelectMethod }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-tg-bg rounded-xl border border-tg-border">
      <button
        type="button"
        onClick={() => onSelectMethod("phone")}
        className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
          authMethod === "phone"
            ? "bg-tg-surface text-white shadow-sm border border-tg-border"
            : "text-tg-muted hover:text-white"
        }`}
      >
        <DeviceMobile size={17} className={authMethod === "phone" ? "text-tg-accent" : ""} />
        <span>En este Teléfono</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectMethod("qr")}
        className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
          authMethod === "qr"
            ? "bg-tg-surface text-white shadow-sm border border-tg-border"
            : "text-tg-muted hover:text-white"
        }`}
      >
        <QrCode size={17} className={authMethod === "qr" ? "text-tg-accent" : ""} />
        <span>Código QR</span>
      </button>
    </div>
  );
}
