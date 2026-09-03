/**
 * Normaliza un objeto mensaje de GramJS a un formato JSON limpio y estructurado.
 * @param {Object} msg 
 * @returns {Object}
 */
export function formatTelegramMessage(msg) {
  let mediaInfo = null;
  if (msg.media) {
    mediaInfo = {
      type: msg.media.className || "MessageMedia",
      hasDocument: Boolean(msg.document),
      hasPhoto: Boolean(msg.photo),
      mimeType: msg.document?.mimeType || null,
      fileName: msg.document?.attributes?.find((a) => a.fileName)?.fileName || null,
      sizeBytes: msg.document?.size ? Number(msg.document.size) : null,
    };
  }

  return {
    id: msg.id,
    date: msg.date ? new Date(msg.date * 1000).toISOString() : new Date().toISOString(),
    senderId: msg.senderId ? msg.senderId.toString() : (msg.fromId?.userId ? msg.fromId.userId.toString() : "unknown"),
    isOutgoing: Boolean(msg.out),
    text: msg.message || "",
    replyToMsgId: msg.replyTo?.replyToMsgId || null,
    media: mediaInfo,
    rawButtons: msg.replyMarkup?.rows ? extractInlineButtons(msg.replyMarkup.rows) : null,
  };
}

/**
 * Extrae texto y data de los botones inline
 * @param {Array} rows 
 * @returns {Array|null}
 */
export function extractInlineButtons(rows) {
  try {
    return rows.map((r) =>
      r.buttons.map((b) => ({
        text: b.text,
        url: b.url || null,
        data: b.data ? Buffer.from(b.data).toString("utf-8") : null,
      }))
    );
  } catch {
    return null;
  }
}
