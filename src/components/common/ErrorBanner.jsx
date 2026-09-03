import React from "react";
import { WarningCircle, X } from "@phosphor-icons/react";

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center justify-between animate-fade-in max-w-lg mx-auto w-full">
      <div className="flex items-center gap-2">
        <WarningCircle size={17} className="shrink-0 text-red-400" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
