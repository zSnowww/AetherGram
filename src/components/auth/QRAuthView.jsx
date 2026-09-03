import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Copy, Check, Spinner, X } from "@phosphor-icons/react";

export default function QRAuthView({ qrData, onCancel, isLoading }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (qrData?.qrUrl && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrData.qrUrl,
        {
          width: 240,
          margin: 1.5,
          color: {
            dark: "#0e1621",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        },
        (error) => {
          if (error) console.error("[QRCode Error]", error);
        }
      );
    }
  }, [qrData?.qrUrl]);

  useEffect(() => {
    if (!qrData?.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((qrData.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [qrData?.expiresAt]);

  const handleCopyLink = () => {
    if (qrData?.qrUrl) {
      navigator.clipboard.writeText(qrData.qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl border border-tg-border space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              Escanear Código QR
            </h2>
            <p className="text-xs text-tg-muted">
              Abre Telegram &gt; Ajustes &gt; Dispositivos &gt; Vincular dispositivo
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-tg-muted hover:text-white hover:bg-tg-surface transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* QR Canvas */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative p-3 bg-white rounded-2xl shadow-xl border-2 border-tg-border">
            {isLoading && !qrData ? (
              <div className="w-60 h-60 flex flex-col items-center justify-center gap-2 text-tg-bg">
                <Spinner size={24} className="animate-spin text-tg-primary" />
                <span className="text-xs text-tg-muted">Generando código...</span>
              </div>
            ) : (
              <canvas ref={canvasRef} className="rounded-lg block w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]" />
            )}

            {qrData && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-tg-surface text-tg-text border border-tg-border px-2.5 py-0.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-tg-accent animate-pulse"></span>
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>

          {qrData?.qrUrl && (
            <div className="mt-4">
              <button
                onClick={handleCopyLink}
                className="text-xs text-tg-accent hover:underline flex items-center gap-1.5 bg-tg-surface/60 px-3 py-1.5 rounded-lg border border-tg-border cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Enlace copiado" : "Copiar enlace directo (tg://)"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Cancel */}
        <div className="pt-2 text-center">
          <button
            onClick={onCancel}
            className="text-tg-muted hover:text-red-400 text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
