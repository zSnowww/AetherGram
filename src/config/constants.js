/**
 * Constantes y valores por defecto para la aplicación
 */
export const DEFAULT_API_CREDENTIALS = {
  apiId: 2040,
  apiHash: "b18441a1ff607e10a989891a5462e627",
};

export const TELEGRAM_DESKTOP_PROFILE = {
  deviceModel: "Desktop",
  systemVersion: "Windows 11",
  appVersion: "7.1.3 x64",
  langPack: "tdesktop",
  langCode: "en",
  systemLangCode: "en",
};

export const DEFAULT_TARGET = {
  username: "",
  id: "",
};

export const EXTRACTION_LIMIT_OPTIONS = [
  { value: 0, label: "Todo el historial (Recomendado)" },
  { value: 500, label: "Últimos 500 mensajes" },
  { value: 1000, label: "Últimos 1,000 mensajes" },
  { value: 5000, label: "Últimos 5,000 mensajes" },
];
