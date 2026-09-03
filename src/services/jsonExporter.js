/**
 * Genera y descarga directamente en el navegador un archivo JSON con los datos extraídos del chat.
 * @param {Object} data - Objeto con metadatos del chat y array de mensajes
 * @param {string} filename - Nombre del archivo sugerido
 */
export function exportChatToJson(data, filename = "telegram_chat_export.json") {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    generator: "Telegram Zero-Knowledge Banned Bot Exporter",
    chatInfo: {
      id: data.chatId || "unknown",
      name: data.chatName || "Chat Export",
      username: data.chatUsername || null,
      totalMessages: data.messages ? data.messages.length : 0,
    },
    messages: data.messages || [],
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Liberar el objeto URL de la memoria RAM del navegador
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
