import { Api } from "telegram";
import { initializeTakeoutSession, finishTakeoutSession } from "./takeoutService";
import { resolveInputPeer } from "../dialogs/peerResolver";
import { formatTelegramMessage } from "./messageFormatter";

/**
 * Extrae los mensajes de un chat, canal o bot con bypass del filtro de censura mediante Takeout API.
 * @param {Object} params
 * @param {TelegramClient} params.client
 * @param {Object} params.entity - Entidad del objetivo
 * @param {number} [params.maxMessages=0] - Límite de mensajes (0 = todos)
 * @param {function} [params.onProgress] - Progreso en vivo
 * @param {function} [params.onWaitingConfirmation] - Estado de espera de Takeout
 * @param {function} [params.onFloodWait] - Pausa de seguridad
 * @returns {Promise<Array>} Lista ordenada cronológicamente de mensajes normalizados
 */
export async function extractChatMessages({
  client,
  entity,
  maxMessages = 0,
  onProgress,
  onWaitingConfirmation,
  onFloodWait,
}) {
  if (!client) throw new Error("Cliente MTProto no inicializado.");

  // 1. Activar contenido sensible a nivel de cuenta
  try {
    await client.invoke(new Api.account.SetContentSettings({ sensitiveEnabled: true }));
  } catch (e) {
    console.warn("[MTProto] SetContentSettings warning:", e.message);
  }

  // 2. Iniciar sesión Takeout obligatoria para evitar filtros de censura
  const takeoutId = await initializeTakeoutSession(client, onWaitingConfirmation);
  if (!takeoutId) {
    throw new Error("No se pudo iniciar la sesión Takeout para exportación sin censura.");
  }

  // 3. Resolver InputPeer tipado estricto para MTProto
  const inputPeer = await resolveInputPeer(client, entity);

  const extracted = [];
  let totalProcessed = 0;
  const limit = maxMessages > 0 ? maxMessages : undefined;
  let offsetId = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      if (limit && totalProcessed >= limit) break;
      const batchLimit = limit ? Math.min(100, limit - totalProcessed) : 100;

      const history = await client.invoke(
        new Api.InvokeWithTakeout({
          takeoutId,
          query: new Api.messages.GetHistory({
            peer: inputPeer,
            offsetId,
            offsetDate: 0,
            addOffset: 0,
            limit: batchLimit,
            maxId: 0,
            minId: 0,
            hash: BigInt(0),
          }),
        })
      );

      const msgs = history.messages || [];
      if (msgs.length === 0) {
        hasMore = false;
        break;
      }

      for (const msg of msgs) {
        if (msg.className === "MessageEmpty") continue;
        const normalizedMsg = formatTelegramMessage(msg);
        extracted.push(normalizedMsg);
        totalProcessed++;

        if (onProgress) {
          onProgress({
            count: totalProcessed,
            latestDate: normalizedMsg.date,
            latestText: normalizedMsg.text?.slice(0, 60) || "[Multimedia]",
          });
        }
      }

      offsetId = msgs[msgs.length - 1].id;
      if (msgs.length < batchLimit) {
        hasMore = false;
      }
    }

    // Finalizar sesión Takeout
    await finishTakeoutSession(client, takeoutId);
  } catch (err) {
    if (err.errorMessage?.startsWith("FLOOD_WAIT_") || err.seconds) {
      const waitSeconds = err.seconds || parseInt(err.errorMessage?.split("_")[2], 10) || 5;
      if (onFloodWait) onFloodWait(waitSeconds);
      await new Promise((r) => setTimeout(r, (waitSeconds + 1) * 1000));
    } else {
      throw err;
    }
  }

  // Ordenar cronológicamente (mensajes más antiguos primero)
  extracted.reverse();
  return extracted;
}
