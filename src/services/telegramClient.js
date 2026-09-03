/**
 * Re-export para retrocompatibilidad con la arquitectura modular src/core/
 */
export * from "../core";
export { destroySession as destroySessionAndLogout } from "../core";
export { fetchUserDialogs as getUserDialogs } from "../core";
export { resolveEntity as resolveTargetEntity } from "../core";
export { authenticateWithQr as startQrLogin } from "../core";
export { authenticateWithPhone as startPhoneLogin } from "../core";
