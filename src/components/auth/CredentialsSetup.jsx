import React, { useState } from "react";
import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { DEFAULT_API_CREDENTIALS } from "../../config/constants";
import AuthSelector from "./AuthSelector";
import CredentialsDrawer from "./CredentialsDrawer";

export default function CredentialsSetup({ onStartQrAuth, onStartPhoneAuth }) {
  const [authMethod, setAuthMethod] = useState("phone"); // 'phone' | 'qr'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [apiId, setApiId] = useState(String(DEFAULT_API_CREDENTIALS.apiId));
  const [apiHash, setApiHash] = useState(DEFAULT_API_CREDENTIALS.apiHash);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const targetApiId = useCustom ? apiId : DEFAULT_API_CREDENTIALS.apiId;
    const targetApiHash = useCustom ? apiHash : DEFAULT_API_CREDENTIALS.apiHash;

    if (!targetApiId || !targetApiHash) {
      setError("Ingresa un API ID y API Hash válidos.");
      return;
    }

    if (authMethod === "phone") {
      if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
        setError("Ingresa tu número con código de país (Ej. +51 987654321).");
        return;
      }
      onStartPhoneAuth({
        apiId: Number(targetApiId),
        apiHash: String(targetApiHash).trim(),
        phoneNumber: phoneNumber.trim(),
      });
    } else {
      onStartQrAuth({
        apiId: Number(targetApiId),
        apiHash: String(targetApiHash).trim(),
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl border border-tg-border space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Telegram Exporter
          </h2>
          <p className="text-xs text-tg-muted mt-1">
            Exporta el historial de bots, canales y chats directamente desde tu cuenta.
          </p>
        </div>

        {/* Method Selector */}
        <AuthSelector
          authMethod={authMethod}
          onSelectMethod={(m) => {
            setAuthMethod(m);
            setError("");
          }}
        />

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Phone Input */}
          {authMethod === "phone" ? (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-xs font-medium text-tg-text">
                Número de teléfono:
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+51 987654321"
                className="w-full px-3.5 py-2.5 rounded-xl bg-tg-bg border border-tg-border text-white text-sm focus:outline-none focus:border-tg-accent transition-colors font-mono"
              />
              <span className="text-[10px] text-tg-muted block pl-0.5">
                Recibirás un código en tu app oficial de Telegram.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-tg-bg/40 border border-tg-border text-xs text-tg-muted leading-relaxed">
              Genera un código QR para escanear con la cámara de tu teléfono móvil desde <span className="text-tg-text font-medium">Ajustes &gt; Dispositivos</span>.
            </div>
          )}

          {/* Desktop Preset Indicator */}
          <div className="p-2.5 rounded-xl bg-tg-surface/60 border border-tg-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tg-accent"></span>
              <span className="text-xs text-white font-medium">
                Telegram Desktop Oficial
              </span>
            </div>
            <span className="text-[10px] font-mono text-tg-muted">
              v7.1.3 x64
            </span>
          </div>

          {/* Custom Credentials Drawer */}
          <CredentialsDrawer
            useCustom={useCustom}
            onToggleCustom={(val) => {
              setUseCustom(val);
              if (!val) {
                setApiId(String(DEFAULT_API_CREDENTIALS.apiId));
                setApiHash(DEFAULT_API_CREDENTIALS.apiHash);
              }
            }}
            apiId={apiId}
            setApiId={setApiId}
            apiHash={apiHash}
            setApiHash={setApiHash}
          />

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <WarningCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-tg-primary hover:bg-tg-primaryHover text-white font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{authMethod === "phone" ? "Continuar" : "Generar Código QR"}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
