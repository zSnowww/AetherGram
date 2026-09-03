import { useState, useCallback, useMemo } from "react";
import { fetchUserDialogs } from "../core";

export function useDialogs() {
  const [dialogs, setDialogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'bots' | 'channels' | 'users'

  const loadDialogs = useCallback(async (client) => {
    if (!client) return;
    setIsLoading(true);
    try {
      const list = await fetchUserDialogs(client, 100);
      setDialogs(list);
    } catch (err) {
      console.warn("[useDialogs] Error al cargar:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDialogs = useCallback(() => {
    setDialogs([]);
    setSearchQuery("");
    setActiveFilter("all");
  }, []);

  const filteredDialogs = useMemo(() => {
    return dialogs.filter((d) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query) ||
        (d.username && d.username.toLowerCase().includes(query)) ||
        d.id.includes(query);

      if (!matchesQuery) return false;

      if (activeFilter === "bots") return d.isBot;
      if (activeFilter === "channels") return d.isChannel;
      if (activeFilter === "users") return d.isUser;
      return true;
    });
  }, [dialogs, searchQuery, activeFilter]);

  return {
    dialogs,
    filteredDialogs,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    loadDialogs,
    clearDialogs,
  };
}
