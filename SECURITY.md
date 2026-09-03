# 🛡️ Política de Seguridad (Security Policy)

## Modelo de Seguridad Zero-Knowledge

Este proyecto ha sido diseñado desde cero bajo el principio de **Zero-Knowledge** y ejecución puramente client-side:

1. **Memoria RAM Volátil:**
   - La sesión criptográfica (`StringSession("")`) se genera y reside exclusivamente en la memoria de ejecución del navegador.
   - En ningún momento se persiste la sesión en `localStorage`, `sessionStorage`, `IndexedDB`, WebSQL o Cookies.
2. **Sin Servidores Intermediarios:**
   - Todo el tráfico de red viaja mediante WebSockets directos desde el navegador del usuario hacia los Data Centers oficiales de Telegram (`wss://*.web.telegram.org/apiws`).
   - No existe ningún backend intermedio que recolecte métricas, tokens o información de chats.
3. **Revocación Activa:**
   - Al pulsar "Cerrar Sesión", la aplicación invoca el método RPC `auth.LogOut` de Telegram para invalidar la `auth_key` en los servidores de Telegram y destruye la instancia del cliente en RAM.

---

## Reportar una Vulnerabilidad

Nos tomamos la seguridad muy en serio. Si descubres una vulnerabilidad de seguridad o un posible fallo de fuga de datos en esta aplicación, por favor repórtala de forma responsable:

* **No abras un Issue público** para problemas de seguridad críticos.
* Crea un informe privado a través de **GitHub Security Advisories** en la pestaña de Seguridad del repositorio, o contacta al mantenedor directamente por Telegram: [@zsnow_7](https://t.me/zsnow_7).
* Proporciona los pasos detallados para reproducir el fallo, capturas o pruebas de concepto (PoC).

Nos comprometemos a acusar recibo en menos de 48 horas y a trabajar en una corrección prioritaria.
