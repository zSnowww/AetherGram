import { Api } from "telegram";

/**
 * Inicializa la sesión Takeout y espera de forma reactiva la confirmación del usuario en su app oficial de Telegram.
 * @param {TelegramClient} client 
 * @param {function} [onWaitingConfirmation] - Callback con el estado de espera
 * @param {number} [maxAttempts=120] - Intentos máximos de sondeo (120 * 3s = 6 minutos)
 * @returns {Promise<bigint>} takeoutId
 */
export async function initializeTakeoutSession(client, onWaitingConfirmation, maxAttempts = 120) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const takeoutResult = await client.invoke(
        new Api.account.InitTakeoutSession({
          messageUsers: true,
          messageChats: true,
          messageMegagroups: true,
          messageChannels: true,
        })
      );

      if (takeoutResult?.id) {
        if (onWaitingConfirmation) {
          onWaitingConfirmation({ isWaiting: false, approved: true });
        }
        return takeoutResult.id;
      }
    } catch (err) {
      const errorStr = (err.errorMessage || err.message || "").toUpperCase();

      if (
        errorStr.includes("TAKEOUT_INIT_DELAY") ||
        errorStr.includes("TAKEOUT_REQUIRED") ||
        errorStr.includes("TAKEOUT") ||
        err.code === 420 ||
        err.code === 400
      ) {
        if (onWaitingConfirmation) {
          onWaitingConfirmation({
            isWaiting: true,
            attempt,
            message: "Telegram envió un mensaje de seguridad a tu app. Abre Telegram y pulsa 'Allow' (Permitir).",
          });
        }

        // Intervalo de 3 segundos antes de volver a verificar
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        throw err;
      }
    }
  }

  throw new Error("Tiempo de espera para la confirmación de Takeout en Telegram agotado.");
}

/**
 * Finaliza la sesión Takeout en Telegram.
 * @param {TelegramClient} client 
 * @param {bigint} takeoutId 
 */
export async function finishTakeoutSession(client, takeoutId) {
  if (!client || !takeoutId) return;
  try {
    await client.invoke(
      new Api.InvokeWithTakeout({
        takeoutId,
        query: new Api.account.FinishTakeoutSession({ success: true }),
      })
    );
  } catch {
    // Ignorar cierre de Takeout
  }
}
