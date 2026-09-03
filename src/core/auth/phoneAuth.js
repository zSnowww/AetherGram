import { createEphemeralClient } from "../client";
import { setTwoFactorHandlers } from "./twoFactor";

let currentPhoneCodeResolver = null;
let currentPhoneCodeRejecter = null;

/**
 * Inicia el flujo de autenticación directa por código de app Telegram / SMS.
 * @param {Object} params
 * @param {number} params.apiId
 * @param {string} params.apiHash
 * @param {string} params.phoneNumber
 * @param {function} params.onNeedCode
 * @param {function} params.onNeed2FA
 * @param {function} params.onSuccess
 * @param {function} params.onError
 */
export async function authenticateWithPhone({
  apiId,
  apiHash,
  phoneNumber,
  onNeedCode,
  onNeed2FA,
  onSuccess,
  onError,
}) {
  try {
    const client = createEphemeralClient(apiId, apiHash);
    await client.connect();

    await client.signInUser(
      { apiId: Number(apiId), apiHash: String(apiHash).trim() },
      {
        phoneNumber: () => phoneNumber.trim(),
        phoneCode: async (isCodeViaApp) => {
          if (onNeedCode) {
            onNeedCode({ isCodeViaApp, phoneNumber });
          }
          return new Promise((resolve, reject) => {
            currentPhoneCodeResolver = resolve;
            currentPhoneCodeRejecter = reject;
          });
        },
        password: async (hint) => {
          if (onNeed2FA) onNeed2FA(hint || "");
          return new Promise((resolve, reject) => {
            setTwoFactorHandlers(resolve, reject);
          });
        },
        onError: (err) => {
          console.warn("[Phone Auth] Error durante inicio:", err);
          if (onError) onError(err);
          return true;
        },
      }
    );

    const me = await client.getMe();
    if (onSuccess) onSuccess(me, client);
  } catch (error) {
    console.error("[Phone Auth Error]", error);
    if (onError) onError(error);
  }
}

/**
 * Resuelve el código de verificación ingresado por el usuario.
 * @param {string} code 
 */
export function providePhoneCode(code) {
  if (currentPhoneCodeResolver) {
    currentPhoneCodeResolver(String(code).trim());
    currentPhoneCodeResolver = null;
    currentPhoneCodeRejecter = null;
  }
}

/**
 * Cancela el flujo de espera de código telefónico.
 */
export function cancelPhoneCode() {
  if (currentPhoneCodeRejecter) {
    currentPhoneCodeRejecter(new Error("AUTH_CODE_CANCELLED"));
    currentPhoneCodeResolver = null;
    currentPhoneCodeRejecter = null;
  }
}
