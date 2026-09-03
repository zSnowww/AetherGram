import { Api } from "telegram";

/**
 * Resuelve un input (ID numérico o @username) a su correspondiente objeto entidad MTProto.
 * @param {TelegramClient} client 
 * @param {string|number} input 
 * @returns {Promise<Object>}
 */
export async function resolveEntity(client, input) {
  if (!client) throw new Error("Cliente MTProto no inicializado");
  const cleanInput = String(input).trim();

  // 1. Intentar resolver mediante getEntity directo de GramJS
  try {
    const directEntity = await client.getEntity(cleanInput);
    if (directEntity) return directEntity;
  } catch {
    // Continuar con resolución por diálogo
  }

  // 2. Buscar en la lista de diálogos del usuario
  try {
    const dialogs = await client.getDialogs({ limit: 200 });
    const targetQuery = cleanInput.replace("@", "").toLowerCase();

    for (const d of dialogs) {
      const ent = d.entity;
      if (!ent) continue;
      if (ent.id?.toString() === cleanInput) return ent;
      if (ent.username?.toLowerCase() === targetQuery) return ent;
    }
  } catch (err) {
    console.warn("[PeerResolver] Error al buscar en diálogos:", err.message);
  }

  // 3. Fallback a InputPeerUser si es un ID numérico
  if (/^\d+$/.test(cleanInput)) {
    return new Api.InputPeerUser({
      userId: BigInt(cleanInput),
      accessHash: BigInt(0),
    });
  }

  throw new Error(`No se pudo encontrar el bot, usuario o canal: "${cleanInput}".`);
}

/**
 * Resuelve y construye un InputPeer tipado válido (InputPeerUser, InputPeerChannel, InputPeerChat).
 * Requerido para invocar GetHistory dentro de sesiones Takeout.
 * @param {TelegramClient} client 
 * @param {Object} entity 
 * @returns {Promise<Api.TypeInputPeer>}
 */
export async function resolveInputPeer(client, entity) {
  try {
    return await client.getInputEntity(entity);
  } catch (peerErr) {
    // Si GramJS falla al convertirlo en memoria, construimos manualmente el InputPeer correspondiente
    if (entity?.accessHash && entity?.id) {
      if (entity.className === "Channel" || entity.broadcast || entity.megagroup) {
        return new Api.InputPeerChannel({
          channelId: entity.id,
          accessHash: entity.accessHash,
        });
      } else if (entity.className === "Chat") {
        return new Api.InputPeerChat({
          chatId: entity.id,
        });
      } else {
        return new Api.InputPeerUser({
          userId: entity.id,
          accessHash: entity.accessHash,
        });
      }
    }

    // Si falta accessHash, buscar en caché de diálogos
    const dialogs = await client.getDialogs({ limit: 200 });
    const targetStr = String(entity?.id || entity || "").replace("@", "").toLowerCase();
    const match = dialogs.find(
      (d) =>
        d.entity?.id?.toString() === targetStr ||
        d.entity?.username?.toLowerCase() === targetStr
    );

    if (match?.entity?.accessHash) {
      if (match.entity.className === "Channel" || match.entity.broadcast) {
        return new Api.InputPeerChannel({
          channelId: match.entity.id,
          accessHash: match.entity.accessHash,
        });
      } else if (match.entity.className === "Chat") {
        return new Api.InputPeerChat({
          chatId: match.entity.id,
        });
      } else {
        return new Api.InputPeerUser({
          userId: match.entity.id,
          accessHash: match.entity.accessHash,
        });
      }
    }

    return await client.getInputEntity(entity);
  }
}
