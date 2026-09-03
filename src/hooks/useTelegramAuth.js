import { useState, useCallback } from "react";
import {
  authenticateWithQr,
  authenticateWithPhone,
  providePhoneCode,
  cancelPhoneCode,
  provide2FAPassword,
  cancel2FA,
  destroySession,
} from "../core";

export function useTelegramAuth() {
  const [client, setClient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados de QR
  const [qrData, setQrData] = useState(null);
  const [isQrLoading, setIsQrLoading] = useState(false);

  // Estados de Teléfono / Código App
  const [isPhoneCodeModalOpen, setIsPhoneCodeModalOpen] = useState(false);
  const [phoneAuthInfo, setPhoneAuthInfo] = useState({ phoneNumber: "", isCodeViaApp: true });

  // Estados de 2FA
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFAHint, setTwoFAHint] = useState("");

  const [authError, setAuthError] = useState("");

  const startQrAuth = useCallback(async ({ apiId, apiHash }, onSuccessCallback) => {
    setAuthError("");
    setIsQrLoading(true);

    try {
      await authenticateWithQr({
        apiId,
        apiHash,
        onQrCode: (data) => {
          setIsQrLoading(false);
          setQrData(data);
        },
        onNeed2FA: (hint) => {
          setTwoFAHint(hint);
          setIs2FAModalOpen(true);
        },
        onSuccess: async (me, activeClientInstance) => {
          setIs2FAModalOpen(false);
          setClient(activeClientInstance);
          setCurrentUser(me);
          if (onSuccessCallback) onSuccessCallback(activeClientInstance, me);
        },
        onError: (err) => {
          setAuthError(err.message || "Error al conectar con Telegram MTProto.");
        },
      });
    } catch (err) {
      setAuthError(err.message || "Ocurrió un error inesperado.");
    }
  }, []);

  const startPhoneAuth = useCallback(async ({ apiId, apiHash, phoneNumber }, onSuccessCallback) => {
    setAuthError("");
    try {
      await authenticateWithPhone({
        apiId,
        apiHash,
        phoneNumber,
        onNeedCode: ({ isCodeViaApp, phoneNumber: num }) => {
          setPhoneAuthInfo({ phoneNumber: num, isCodeViaApp });
          setIsPhoneCodeModalOpen(true);
        },
        onNeed2FA: (hint) => {
          setIsPhoneCodeModalOpen(false);
          setTwoFAHint(hint);
          setIs2FAModalOpen(true);
        },
        onSuccess: async (me, activeClientInstance) => {
          setIsPhoneCodeModalOpen(false);
          setIs2FAModalOpen(false);
          setClient(activeClientInstance);
          setCurrentUser(me);
          if (onSuccessCallback) onSuccessCallback(activeClientInstance, me);
        },
        onError: (err) => {
          setAuthError(err.message || "Error al solicitar código a Telegram.");
          setIsPhoneCodeModalOpen(false);
        },
      });
    } catch (err) {
      setAuthError(err.message || "Error inesperado en inicio de sesión.");
    }
  }, []);

  const submitPhoneCode = useCallback((code) => {
    providePhoneCode(code);
  }, []);

  const cancelPhoneAuth = useCallback(() => {
    setIsPhoneCodeModalOpen(false);
    cancelPhoneCode();
  }, []);

  const submit2FA = useCallback((password) => {
    setIs2FAModalOpen(false);
    provide2FAPassword(password);
  }, []);

  const cancel2FAAuth = useCallback(() => {
    setIs2FAModalOpen(false);
    cancel2FA();
  }, []);

  const logout = useCallback(async () => {
    try {
      await destroySession(client);
    } catch (err) {
      console.warn("Error durante logout:", err);
    }
    setClient(null);
    setCurrentUser(null);
    setQrData(null);
    setIsPhoneCodeModalOpen(false);
    setIs2FAModalOpen(false);
    setAuthError("");
  }, [client]);

  return {
    client,
    currentUser,
    qrData,
    isQrLoading,
    isPhoneCodeModalOpen,
    phoneAuthInfo,
    is2FAModalOpen,
    twoFAHint,
    authError,
    setAuthError,
    startQrAuth,
    startPhoneAuth,
    submitPhoneCode,
    cancelPhoneAuth,
    submit2FA,
    cancel2FAAuth,
    logout,
  };
}
