/**
 * Genera y descarga un visor HTML interactivo standalone (estilo Telegram Desktop/Mobile Dark Mode)
 * con todos los mensajes, barra de búsqueda en tiempo real, metadatos y botones embebidos.
 * 
 * @param {Object} data 
 * @param {string} filename 
 */
export function exportChatToHtml(data, filename = "telegram_chat_history.html") {
  const chatName = escapeHtml(data.chatName || "Chat Exportado");
  const chatId = escapeHtml(String(data.chatId || ""));
  const chatUsername = data.chatUsername ? `@${escapeHtml(data.chatUsername)}` : "";
  const messages = data.messages || [];
  const exportDate = new Date().toLocaleString("es-ES", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const messagesHtml = renderMessagesList(messages);

  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>${chatName} - Historial de Telegram</title>
  <style>
    :root {
      --bg-color: #0e1621;
      --header-bg: #17212b;
      --card-bg: #182533;
      --bubble-in: #182533;
      --bubble-out: #2b5278;
      --text-main: #f5f5f5;
      --text-muted: #7e8c99;
      --accent: #2ba6fb;
      --border: #242f3d;
      --code-bg: #0b1118;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    header {
      background-color: var(--header-bg);
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      z-index: 10;
      flex-wrap: wrap;
    }
    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2481cc, #2ba6fb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      color: #fff;
      text-transform: uppercase;
    }
    .header-details h1 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .header-details .meta {
      font-size: 12px;
      color: var(--text-muted);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-box {
      background: #0e1621;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 6px 14px;
      color: #fff;
      font-size: 13px;
      outline: none;
      width: 220px;
      transition: all 0.2s;
    }
    .search-box:focus {
      border-color: var(--accent);
      width: 260px;
    }
    .btn {
      background: rgba(43, 166, 251, 0.15);
      color: var(--accent);
      border: 1px solid rgba(43, 166, 251, 0.3);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn:hover {
      background: rgba(43, 166, 251, 0.25);
    }
    #chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .date-separator {
      text-align: center;
      margin: 14px 0 8px;
    }
    .date-badge {
      background: rgba(23, 33, 43, 0.85);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 11px;
      padding: 4px 12px;
      border-radius: 12px;
      display: inline-block;
      font-weight: 500;
    }
    .msg-row {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .msg-row.out {
      align-items: flex-end;
    }
    .msg-row.in {
      align-items: flex-start;
    }
    .msg-bubble {
      max-width: 82%;
      padding: 8px 12px 6px;
      border-radius: 12px;
      position: relative;
      word-break: break-word;
      line-height: 1.45;
      font-size: 14px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    .msg-row.in .msg-bubble {
      background-color: var(--bubble-in);
      border-bottom-left-radius: 2px;
      border: 1px solid rgba(255,255,255,0.04);
    }
    .msg-row.out .msg-bubble {
      background-color: var(--bubble-out);
      border-bottom-right-radius: 2px;
    }
    .reply-quote {
      border-left: 3px solid var(--accent);
      background: rgba(0, 0, 0, 0.2);
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .media-card {
      background: rgba(0, 0, 0, 0.25);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      padding: 8px 10px;
      border-radius: 8px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }
    .media-icon {
      font-size: 16px;
    }
    .msg-text {
      white-space: pre-wrap;
    }
    .msg-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      margin-top: 4px;
    }
    .keyboard-grid {
      display: grid;
      gap: 4px;
      margin-top: 8px;
      width: 100%;
    }
    .keyboard-btn {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 6px;
      border-radius: 6px;
      font-size: 11px;
      text-align: center;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    pre {
      background: var(--code-bg);
      border-radius: 6px;
      padding: 8px;
      margin: 6px 0;
      overflow-x: auto;
      font-family: monospace;
      font-size: 12px;
    }
    code {
      background: var(--code-bg);
      padding: 2px 4px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }
    a {
      color: var(--accent);
      text-decoration: underline;
    }
    .empty-state {
      text-align: center;
      color: var(--text-muted);
      margin-top: 60px;
    }
    @media print {
      body { height: auto; overflow: visible; background: #fff; color: #000; }
      header { position: static; border-bottom: 2px solid #ccc; background: #fff; color: #000; }
      .search-box, .btn { display: none; }
      .msg-row.in .msg-bubble { background: #f0f0f0; color: #000; border: 1px solid #ddd; }
      .msg-row.out .msg-bubble { background: #d0e4ff; color: #000; }
      .msg-footer { color: #555; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-info">
      <div class="avatar">${chatName.slice(0, 2)}</div>
      <div class="header-details">
        <h1>${chatName}</h1>
        <div class="meta">
          <span>ID: ${chatId}</span>
          ${chatUsername ? `<span> · ${chatUsername}</span>` : ""}
          <span> · ${messages.length} mensajes</span>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <input type="text" id="search-input" class="search-box" placeholder="Buscar en mensajes..." oninput="filterMessages()">
      <button class="btn" onclick="window.print()">🖨️ Imprimir / PDF</button>
      <button class="btn" onclick="scrollToBottom()">⬇️ Ir al final</button>
    </div>
  </header>

  <main id="chat-container">
    ${messagesHtml}
  </main>

  <script>
    function scrollToBottom() {
      const container = document.getElementById('chat-container');
      container.scrollTop = container.scrollHeight;
    }

    function filterMessages() {
      const query = document.getElementById('search-input').value.toLowerCase().trim();
      const rows = document.querySelectorAll('.msg-row');
      let visibleCount = 0;

      rows.forEach(row => {
        const text = row.getAttribute('data-text') || '';
        if (!query || text.includes(query)) {
          row.style.display = 'flex';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });
    }

    // Scroll al final al cargar la vista
    window.addEventListener('DOMContentLoaded', () => {
      scrollToBottom();
    });
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function renderMessagesList(messages) {
  if (!messages || messages.length === 0) {
    return `<div class="empty-state">No hay mensajes registrados en este chat.</div>`;
  }

  let html = "";
  let lastDateGroup = "";

  for (const msg of messages) {
    const msgDate = new Date(msg.date);
    const dateGroup = msgDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (dateGroup !== lastDateGroup) {
      lastDateGroup = dateGroup;
      html += `
        <div class="date-separator">
          <span class="date-badge">${dateGroup}</span>
        </div>
      `;
    }

    const timeStr = msgDate.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isOut = msg.isOutgoing;
    const cleanText = escapeHtml(msg.text || "");
    const formattedBody = formatMessageText(cleanText);

    let mediaBadge = "";
    if (msg.media) {
      const fileName = msg.media.fileName ? ` - ${escapeHtml(msg.media.fileName)}` : "";
      const sizeStr = msg.media.sizeBytes ? ` (${(msg.media.sizeBytes / 1024 / 1024).toFixed(2)} MB)` : "";
      mediaBadge = `
        <div class="media-card">
          <span class="media-icon">📎</span>
          <span><strong>${escapeHtml(msg.media.type)}</strong>${fileName}${sizeStr}</span>
        </div>
      `;
    }

    let replyBlock = "";
    if (msg.replyToMsgId) {
      replyBlock = `
        <div class="reply-quote">
          Respuesta al mensaje #${msg.replyToMsgId}
        </div>
      `;
    }

    let keyboardBlock = "";
    if (msg.rawButtons && msg.rawButtons.length > 0) {
      keyboardBlock = `<div class="keyboard-grid">`;
      for (const row of msg.rawButtons) {
        for (const btn of row) {
          keyboardBlock += `<div class="keyboard-btn">${escapeHtml(btn.text)}</div>`;
        }
      }
      keyboardBlock += `</div>`;
    }

    const searchData = cleanText.toLowerCase();

    html += `
      <div class="msg-row ${isOut ? "out" : "in"}" id="msg-${msg.id}" data-text="${searchData}">
        <div class="msg-bubble">
          ${replyBlock}
          ${mediaBadge}
          ${formattedBody ? `<div class="msg-text">${formattedBody}</div>` : ""}
          ${keyboardBlock}
          <div class="msg-footer">
            <span>${timeStr}</span>
            ${isOut ? "<span>✓✓</span>" : ""}
          </div>
        </div>
      </div>
    `;
  }

  return html;
}

function formatMessageText(text) {
  if (!text) return "";
  // Detecta URLs y las transforma en hipervínculos seguros
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let formatted = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  return formatted;
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
