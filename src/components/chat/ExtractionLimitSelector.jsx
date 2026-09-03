import React from "react";
import { EXTRACTION_LIMIT_OPTIONS } from "../../config/constants";

export default function ExtractionLimitSelector({ maxMessages, onChangeLimit }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-tg-muted">
        Límite de mensajes a exportar:
      </label>
      <select
        value={maxMessages}
        onChange={(e) => onChangeLimit(Number(e.target.value))}
        className="w-full px-3.5 py-2.5 rounded-xl bg-tg-bg border border-tg-border text-white text-xs focus:outline-none focus:border-tg-accent transition-colors cursor-pointer"
      >
        {EXTRACTION_LIMIT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
