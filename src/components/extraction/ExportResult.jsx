import React, { useState } from "react";
import { CheckCircle, Browsers, Code, DownloadSimple, SignOut, ArrowLeft, Spinner } from "@phosphor-icons/react";
import { exportChatToJson } from "../../services/jsonExporter";
import { exportChatToHtml } from "../../services/htmlExporter";

export default function ExportResult({
  exportData,
  onExportAnother,
  onLogoutAndDestroy,
}) {
  const [downloadedJson, setDownloadedJson] = useState(false);
  const [downloadedHtml, setDownloadedHtml] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const cleanName = (exportData.chatName || "chat")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_");

  const handleDownloadHtml = () => {
    const filename = `${cleanName}_telegram_history.html`;
    exportChatToHtml(exportData, filename);
    setDownloadedHtml(true);
  };

  const handleDownloadJson = () => {
    const filename = `${cleanName}_telegram_dump.json`;
    exportChatToJson(exportData, filename);
    setDownloadedJson(true);
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      await onLogoutAndDestroy();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const totalMessages = exportData.messages ? exportData.messages.length : 0;
  const firstDate = totalMessages > 0 ? new Date(exportData.messages[0].date).toLocaleDateString() : "-";
  const lastDate = totalMessages > 0 ? new Date(exportData.messages[totalMessages - 1].date).toLocaleDateString() : "-";

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up space-y-4">
      <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl border border-tg-border space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1 shadow-inner">
            <CheckCircle size={24} weight="fill" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Extracción Completada
          </h2>
          <p className="text-xs text-tg-muted truncate max-w-xs mx-auto">
            {exportData.chatName}
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-tg-bg/60 border border-tg-border rounded-xl text-center">
          <div className="p-2 rounded-lg bg-tg-surface/50">
            <div className="text-lg font-bold text-tg-accent font-mono">
              {totalMessages.toLocaleString()}
            </div>
            <div className="text-[10px] text-tg-muted">Mensajes</div>
          </div>

          <div className="p-2 rounded-lg bg-tg-surface/50">
            <div className="text-xs font-medium text-tg-text truncate">
              {firstDate} ➔ {lastDate}
            </div>
            <div className="text-[10px] text-tg-muted">Rango</div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownloadHtml}
            className="w-full p-3.5 rounded-xl bg-tg-surface hover:bg-tg-surfaceHover border border-tg-border hover:border-tg-accent/40 text-left transition-all flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-tg-primary/15 text-tg-accent flex items-center justify-center border border-tg-primary/20 shrink-0">
                <Browsers size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white group-hover:text-tg-accent transition-colors">
                  Visor HTML Interactivo
                </div>
                <div className="text-[10px] text-tg-muted">
                  Buscador en vivo, modo oscuro y multimedia
                </div>
              </div>
            </div>
            <DownloadSimple size={16} className={downloadedHtml ? "text-emerald-400" : "text-tg-muted group-hover:text-white"} />
          </button>

          <button
            onClick={handleDownloadJson}
            className="w-full p-3.5 rounded-xl bg-tg-surface hover:bg-tg-surfaceHover border border-tg-border hover:border-purple-500/40 text-left transition-all flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                <Code size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                  Dump de Datos (.JSON)
                </div>
                <div className="text-[10px] text-tg-muted">
                  Estructura completa de mensajes y metadatos
                </div>
              </div>
            </div>
            <DownloadSimple size={16} className={downloadedJson ? "text-emerald-400" : "text-tg-muted group-hover:text-white"} />
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoggingOut ? (
              <>
                <Spinner size={14} className="animate-spin" />
                <span>Cerrando sesión...</span>
              </>
            ) : (
              <>
                <SignOut size={15} />
                <span>Cerrar Sesión</span>
              </>
            )}
          </button>

          <button
            onClick={onExportAnother}
            disabled={isLoggingOut}
            className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-tg-surface/60 border border-tg-border text-tg-muted hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Exportar otro chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
