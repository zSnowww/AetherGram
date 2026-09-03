import React, { useState } from "react";
import { MagnifyingGlass, ArrowsClockwise, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";
import PriorityTargetBanner from "./PriorityTargetBanner";
import DialogItem from "./DialogItem";
import ExtractionLimitSelector from "./ExtractionLimitSelector";

export default function ChatSelector({
  dialogs,
  filteredDialogs,
  isLoadingDialogs,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onRefreshDialogs,
  onSelectChat,
}) {
  const [manualInput, setManualInput] = useState("");
  const [maxMessages, setMaxMessages] = useState(0);
  const [inputError, setInputError] = useState("");

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setInputError("Ingresa un @username o ID numérico.");
      return;
    }
    setInputError("");
    onSelectChat({
      name: manualInput.trim(),
      username: manualInput.startsWith("@") ? manualInput.slice(1) : null,
      id: null,
      targetInput: manualInput.trim(),
      maxMessages,
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up space-y-3.5">
      {/* Priority 1-Click Preset */}
      <PriorityTargetBanner
        onSelectDefaultTarget={onSelectChat}
        maxMessages={maxMessages}
      />

      {/* Main Selector Panel */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl border border-tg-border space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Seleccionar Chat
            </h2>
            <p className="text-xs text-tg-muted">
              Elige de la lista o escribe un ID / @username
            </p>
          </div>

          <button
            onClick={onRefreshDialogs}
            disabled={isLoadingDialogs}
            title="Recargar chats"
            className="p-1.5 rounded-lg bg-tg-surface hover:bg-tg-surfaceHover border border-tg-border text-tg-muted hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowsClockwise size={15} className={isLoadingDialogs ? "animate-spin text-tg-accent" : ""} />
          </button>
        </div>

        {/* Message Limit Dropdown */}
        <ExtractionLimitSelector
          maxMessages={maxMessages}
          onChangeLimit={setMaxMessages}
        />

        {/* Manual Target Input Form */}
        <form onSubmit={handleManualSubmit} className="space-y-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Ej. @Asuka2ChkBot o 7181572516"
              className="flex-1 px-3.5 py-2 rounded-xl bg-tg-bg border border-tg-border text-white text-xs focus:outline-none focus:border-tg-accent transition-colors font-mono"
            />
            <button
              type="submit"
              className="py-2 px-3.5 rounded-xl bg-tg-primary hover:bg-tg-primaryHover text-white font-medium text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Extraer</span>
              <PaperPlaneTilt size={13} weight="fill" />
            </button>
          </div>
          {inputError && (
            <div className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
              <WarningCircle size={13} />
              <span>{inputError}</span>
            </div>
          )}
        </form>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-tg-bg rounded-xl border border-tg-border text-xs">
          {[
            { id: "all", label: "Todos" },
            { id: "bots", label: "Bots" },
            { id: "channels", label: "Canales" },
            { id: "users", label: "Usuarios" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-tg-surface text-white shadow-sm border border-tg-border"
                  : "text-tg-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-tg-bg border border-tg-border text-white text-xs focus:outline-none focus:border-tg-accent transition-colors"
          />
        </div>

        {/* Dialogs List */}
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {isLoadingDialogs && dialogs.length === 0 ? (
            <div className="p-6 text-center space-y-1.5 text-tg-muted">
              <ArrowsClockwise size={20} className="animate-spin mx-auto text-tg-accent" />
              <div className="text-xs">Cargando chats...</div>
            </div>
          ) : filteredDialogs.length === 0 ? (
            <div className="p-5 text-center text-xs text-tg-muted bg-tg-bg/30 rounded-xl border border-tg-border">
              {searchQuery ? "No se encontraron resultados." : "No hay chats disponibles."}
            </div>
          ) : (
            filteredDialogs.map((d) => (
              <DialogItem
                key={d.id}
                dialog={d}
                onSelect={() =>
                  onSelectChat({
                    name: d.name,
                    username: d.username,
                    id: d.id,
                    entity: d.entity,
                    maxMessages,
                  })
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
