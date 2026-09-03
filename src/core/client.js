import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { TELEGRAM_DESKTOP_PROFILE } from "../config/constants";

let activeClient = null;

/**
 * Crea una nueva instancia de TelegramClient en memoria RAM (Zero-Knowledge).
 * Emula la identidad de Telegram Desktop para evitar filtros de censura web.
 * @param {number} apiId 
 * @param {string} apiHash 
 * @returns {TelegramClient}
 */
export function createEphemeralClient(apiId, apiHash) {
  if (activeClient) {
    try {
      activeClient.disconnect();
    } catch {
      // Ignorar desconexión previa
    }
  }

  // StringSession vacío: nunca se persiste en LocalStorage o Cookies
  const session = new StringSession("");

  activeClient = new TelegramClient(session, Number(apiId), String(apiHash).trim(), {
    connectionRetries: 5,
    useWSS: true,
    deviceModel: TELEGRAM_DESKTOP_PROFILE.deviceModel,
    systemVersion: TELEGRAM_DESKTOP_PROFILE.systemVersion,
    appVersion: TELEGRAM_DESKTOP_PROFILE.appVersion,
    langCode: TELEGRAM_DESKTOP_PROFILE.langCode,
    systemLangCode: TELEGRAM_DESKTOP_PROFILE.systemLangCode,
  });

  // Parcheamos la inicialización de MTProto para forzar identidad Desktop
  if (activeClient._initRequest) {
    activeClient._initRequest.langPack = TELEGRAM_DESKTOP_PROFILE.langPack;
    activeClient._initRequest.deviceModel = TELEGRAM_DESKTOP_PROFILE.deviceModel;
    activeClient._initRequest.appVersion = TELEGRAM_DESKTOP_PROFILE.appVersion;
    activeClient._initRequest.systemVersion = TELEGRAM_DESKTOP_PROFILE.systemVersion;
  }

  return activeClient;
}

/**
 * Obtiene el cliente activo en memoria
 * @returns {TelegramClient|null}
 */
export function getActiveClient() {
  return activeClient;
}

/**
 * Cierra la sesión en Telegram (auth.LogOut) y desconecta el socket.
 * @param {TelegramClient} [client] 
 */
export async function destroySession(client) {
  const target = client || activeClient;
  if (!target) return;

  try {
    if (target.disconnected) {
      await target.connect();
    }
    await target.invoke(new Api.auth.LogOut());
  } catch (err) {
    console.warn("[MTProto Client] Error en auth.LogOut:", err.message);
  } finally {
    try {
      await target.disconnect();
    } catch {
      // Ignorar
    }
    if (activeClient === target) {
      activeClient = null;
    }
  }
}
