import { useState, useCallback } from "react";
import { extractChatMessages, resolveEntity } from "../core";

export function useChatExtractor() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [progressData, setProgressData] = useState({ count: 0, latestDate: null, latestText: "" });
  const [floodWaitSeconds, setFloodWaitSeconds] = useState(0);
  const [takeoutStatus, setTakeoutStatus] = useState({ isWaiting: false, attempt: 1, message: "" });
  const [exportData, setExportData] = useState(null);
  const [extractionError, setExtractionError] = useState("");

  const startExtraction = useCallback(async (client, targetInfo) => {
    setSelectedTarget(targetInfo);
    setExtractionError("");
    setIsExtracting(true);
    setProgressData({ count: 0, latestDate: null, latestText: "" });
    setFloodWaitSeconds(0);
    setTakeoutStatus({ isWaiting: false, attempt: 1, message: "" });

    try {
      let entity = targetInfo.entity;
      if (!entity) {
        entity = await resolveEntity(client, targetInfo.targetInput);
      }

      const messages = await extractChatMessages({
        client,
        entity,
        maxMessages: targetInfo.maxMessages || 0,
        onProgress: (prog) => {
          setProgressData(prog);
        },
        onWaitingConfirmation: (status) => {
          setTakeoutStatus(status);
        },
        onFloodWait: (seconds) => {
          setFloodWaitSeconds(seconds);
          const interval = setInterval(() => {
            setFloodWaitSeconds((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        },
      });

      const data = {
        chatId: targetInfo.id || entity.id?.toString() || targetInfo.targetInput,
        chatName: targetInfo.name || "Telegram Chat",
        chatUsername: targetInfo.username || null,
        messages,
      };

      setExportData(data);
      setIsExtracting(false);
      return data;
    } catch (err) {
      console.error("[useChatExtractor] Error:", err);
      setExtractionError(err.message || "Error al extraer los mensajes.");
      setIsExtracting(false);
      throw err;
    }
  }, []);

  const resetExtractor = useCallback(() => {
    setIsExtracting(false);
    setSelectedTarget(null);
    setProgressData({ count: 0, latestDate: null, latestText: "" });
    setFloodWaitSeconds(0);
    setTakeoutStatus({ isWaiting: false, attempt: 1, message: "" });
    setExportData(null);
    setExtractionError("");
  }, []);

  return {
    isExtracting,
    selectedTarget,
    progressData,
    floodWaitSeconds,
    takeoutStatus,
    exportData,
    extractionError,
    setExtractionError,
    startExtraction,
    resetExtractor,
  };
}
