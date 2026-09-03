/**
 * Obtiene la lista de chats y canales del usuario autenticado.
 * @param {TelegramClient} client 
 * @param {number} [limit=100] 
 * @returns {Promise<Array>}
 */
export async function fetchUserDialogs(client, limit = 100) {
  if (!client) return [];

  const dialogs = await client.getDialogs({ limit });
  return dialogs.map((d) => {
    const entity = d.entity || {};
    const isBot = Boolean(entity.bot);
    const isChannel = Boolean(entity.broadcast || entity.megagroup || entity.className === "Channel");
    const isUser = Boolean(entity.className === "User" && !entity.bot);
    const isGroup = Boolean(entity.className === "Chat" || entity.megagroup);

    return {
      id: d.id ? d.id.toString() : (entity.id ? entity.id.toString() : ""),
      name: d.title || d.name || entity.firstName || entity.title || "Chat Sin Nombre",
      username: entity.username || null,
      unreadCount: d.unreadCount || 0,
      isBot,
      isChannel,
      isUser,
      isGroup,
      entity,
    };
  });
}
