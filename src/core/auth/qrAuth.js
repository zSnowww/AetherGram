import { createEphemeralClient } from "../client";
import { setTwoFactorHandlers } from "./twoFactor";

/**
 * Inicia el handshake de autenticación por código QR nativo de Telegram.
 * @param {Object} params
 * @param {number} params.apiId
 * @param {string} params.apiHash
 * @param {function} params.onQrCode - Recibe { token, qrUrl, expiresAt }
 * @param {function} params.onNeed2FA - Recibe el hint de 2FA
 * @param {function} params.onSuccess - Recibe (me, client)
 * @param {function} params.onError - Recibe error
 */
export async function authenticateWithQr({
  apiId,
  apiHash,
  onQrCode,
  onNeed2FA,
  onSuccess,
  onError,
}) {
  try {
    const client = createEphemeralClient(apiId, apiHash);
    await client.connect();

    await client.signInUserWithQrCode(
      { apiId: Number(apiId), apiHash: String(apiHash).trim() },
      {
        qrCode: async (code) => {
          let tokenStr = "";
          if (Buffer.isBuffer(code.token)) {
            tokenStr = code.token
              .toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "");
          } else if (typeof code.token === "string") {
            tokenStr = code.token;
          }

          const qrUrl = `tg://login?token=${tokenStr}`;
          const expiresAt = code.expires ? code.expires * 1000 : Date.now() + 30000;

          if (onQrCode) {
            onQrCode({ token: tokenStr, qrUrl, expiresAt });
          }
        },
        password: async (hint) => {
          if (onNeed2FA) onNeed2FA(hint || "");
          return new Promise((resolve, reject) => {
            setTwoFactorHandlers(resolve, reject);
          });
        },
        onError: (err) => {
          console.warn("[QR Auth] Error de handshake:", err);
          if (onError) onError(err);
        },
      }
    );

    const me = await client.getMe();
    if (onSuccess) onSuccess(me, client);
  } catch (error) {
    console.error("[QR Auth Error]", error);
    if (onError) onError(error);
  }
}
