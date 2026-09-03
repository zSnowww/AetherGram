import React from "react";
import { Spinner, Warning, FileText } from "@phosphor-icons/react";
import TakeoutWaitingCard from "./TakeoutWaitingCard";

export default function ExtractionProgress({
  progressData,
  floodWaitSeconds,
  takeoutStatus,
  targetName,
  onCancel,
}) {
  const isWaitingTakeout = takeoutStatus?.isWaiting;

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl border border-tg-border space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-tg-primary/10 border border-tg-primary/20 text-tg-accent mb-1 shadow-inner">
            <Spinner size={22} className="animate-spin text-tg-accent" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {isWaitingTakeout ? "Esperando Confirmación" : "Extrayendo Historial"}
          </h2>
          <p className="text-xs text-tg-muted truncate max-w-xs mx-auto">
            {targetName}
          </p>
        </div>

        {/* Takeout Approval Waiting Banner */}
        {isWaitingTakeout && <TakeoutWaitingCard takeoutStatus={takeoutStatus} />}

        {/* FloodWait Alert */}
        {floodWaitSeconds > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <Warning size={17} className="shrink-0 text-amber-400" />
            <span>Pausa de seguridad activa. Reanudando en <strong>{floodWaitSeconds}s</strong>...</span>
          </div>
        )}

        {/* Counter Card */}
        <div className="bg-tg-bg/60 border border-tg-border rounded-xl p-4 text-center space-y-1.5">
          <div className="text-3xl font-bold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-tg-accent to-emerald-400">
            {progressData.count.toLocaleString()}
          </div>
          <div className="text-[11px] text-tg-muted font-medium">
            {isWaitingTakeout ? "Esperando Desbloqueo" : "Mensajes Procesados"}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-tg-surface rounded-full h-1.5 mt-3 overflow-hidden border border-tg-border">
            <div className="bg-gradient-to-r from-tg-primary to-tg-accent h-full rounded-full animate-pulse w-full"></div>
          </div>
        </div>

        {/* Live Snippet Box */}
        {progressData.latestText && (
          <div className="bg-tg-surface/60 border border-tg-border rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-tg-muted flex items-center gap-1">
              <FileText size={12} className="text-tg-accent" />
              <span>Último mensaje:</span>
            </div>
            <p className="text-xs text-tg-text/90 italic truncate pl-4">
              "{progressData.latestText}"
            </p>
          </div>
        )}

        {/* Cancel */}
        <div className="text-center pt-1">
          <button
            onClick={onCancel}
            className="text-xs text-tg-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
