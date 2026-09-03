import React, { useState } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ErrorBanner from "./components/common/ErrorBanner";

import CredentialsSetup from "./components/auth/CredentialsSetup";
import QRAuthView from "./components/auth/QRAuthView";
import PhoneCodeModal from "./components/auth/PhoneCodeModal";
import TwoFactorModal from "./components/auth/TwoFactorModal";

import ChatSelector from "./components/chat/ChatSelector";
import ExtractionProgress from "./components/extraction/ExtractionProgress";
import ExportResult from "./components/extraction/ExportResult";

import { useTelegramAuth } from "./hooks/useTelegramAuth";
import { useDialogs } from "./hooks/useDialogs";
import { useChatExtractor } from "./hooks/useChatExtractor";

export default function App() {
  // 'SETUP' | 'QR_AUTH' | 'CHAT_SELECTION' | 'EXTRACTING' | 'EXPORT_READY'
  const [step, setStep] = useState("SETUP");

  // Hooks de lógica desacoplada
  const auth = useTelegramAuth();
  const dialogs = useDialogs();
  const extractor = useChatExtractor();

  // Handlers de autenticación
  const handleStartQr = ({ apiId, apiHash }) => {
    setStep("QR_AUTH");
    auth.startQrAuth({ apiId, apiHash }, (activeClient) => {
      setStep("CHAT_SELECTION");
      dialogs.loadDialogs(activeClient);
    });
  };

  const handleStartPhone = ({ apiId, apiHash, phoneNumber }) => {
    auth.startPhoneAuth({ apiId, apiHash, phoneNumber }, (activeClient) => {
      setStep("CHAT_SELECTION");
      dialogs.loadDialogs(activeClient);
    });
  };

  const handleLogout = async () => {
    await auth.logout();
    dialogs.clearDialogs();
    extractor.resetExtractor();
    setStep("SETUP");
  };

  // Handlers de extracción
  const handleStartExtraction = async (targetInfo) => {
    setStep("EXTRACTING");
    try {
      await extractor.startExtraction(auth.client, targetInfo);
      setStep("EXPORT_READY");
    } catch {
      setStep("CHAT_SELECTION");
    }
  };

  const currentError = auth.authError || extractor.extractionError;

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text flex flex-col justify-between selection:bg-tg-primary selection:text-white">
      <Header user={auth.currentUser} onLogout={handleLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <ErrorBanner
          message={currentError}
          onClose={() => {
            auth.setAuthError("");
            extractor.setExtractionError("");
          }}
        />

        {/* Step 1: Configuración / Autenticación Inicial */}
        {step === "SETUP" && (
          <CredentialsSetup
            onStartQrAuth={handleStartQr}
            onStartPhoneAuth={handleStartPhone}
          />
        )}

        {/* Step 2: Flujo QR */}
        {step === "QR_AUTH" && (
          <QRAuthView
            qrData={auth.qrData}
            isLoading={auth.isQrLoading}
            onCancel={handleLogout}
          />
        )}

        {/* Step 3: Selección de Diálogo */}
        {step === "CHAT_SELECTION" && (
          <ChatSelector
            dialogs={dialogs.dialogs}
            filteredDialogs={dialogs.filteredDialogs}
            isLoadingDialogs={dialogs.isLoading}
            searchQuery={dialogs.searchQuery}
            onSearchChange={dialogs.setSearchQuery}
            activeFilter={dialogs.activeFilter}
            onFilterChange={dialogs.setActiveFilter}
            onRefreshDialogs={() => dialogs.loadDialogs(auth.client)}
            onSelectChat={handleStartExtraction}
          />
        )}

        {/* Step 4: Progreso de Extracción */}
        {step === "EXTRACTING" && (
          <ExtractionProgress
            progressData={extractor.progressData}
            floodWaitSeconds={extractor.floodWaitSeconds}
            takeoutStatus={extractor.takeoutStatus}
            targetName={extractor.selectedTarget?.name || "Chat"}
            onCancel={() => setStep("CHAT_SELECTION")}
          />
        )}

        {/* Step 5: Resultados de Descarga */}
        {step === "EXPORT_READY" && extractor.exportData && (
          <ExportResult
            exportData={extractor.exportData}
            onExportAnother={() => setStep("CHAT_SELECTION")}
            onLogoutAndDestroy={handleLogout}
          />
        )}

        {/* Modales de verificación */}
        {auth.isPhoneCodeModalOpen && (
          <PhoneCodeModal
            phoneNumber={auth.phoneAuthInfo.phoneNumber}
            isCodeViaApp={auth.phoneAuthInfo.isCodeViaApp}
            onSubmit={auth.submitPhoneCode}
            onCancel={() => {
              auth.cancelPhoneAuth();
              handleLogout();
            }}
          />
        )}

        {auth.is2FAModalOpen && (
          <TwoFactorModal
            hint={auth.twoFAHint}
            onSubmit={auth.submit2FA}
            onCancel={() => {
              auth.cancel2FAAuth();
              handleLogout();
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
