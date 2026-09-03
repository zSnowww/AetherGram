let currentPasswordResolver = null;
let currentPasswordRejecter = null;

/**
 * Registra una promesa pendiente para resolución de contraseña 2FA.
 * @param {function} resolve 
 * @param {function} reject 
 */
export function setTwoFactorHandlers(resolve, reject) {
  currentPasswordResolver = resolve;
  currentPasswordRejecter = reject;
}

/**
 * Resuelve la contraseña 2FA enviada por el usuario.
 * @param {string} password 
 */
export function provide2FAPassword(password) {
  if (currentPasswordResolver) {
    currentPasswordResolver(password);
    currentPasswordResolver = null;
    currentPasswordRejecter = null;
  }
}

/**
 * Cancela el flujo 2FA.
 */
export function cancel2FA() {
  if (currentPasswordRejecter) {
    currentPasswordRejecter(new Error("AUTH_2FA_CANCELLED"));
    currentPasswordResolver = null;
    currentPasswordRejecter = null;
  }
}
