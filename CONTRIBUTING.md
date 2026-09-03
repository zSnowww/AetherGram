# 🤝 Guía de Contribución (Contributing Guide)

¡Gracias por tu interés en contribuir a este proyecto! Este documento describe las pautas y el flujo de trabajo para colaborar.

---

## 🛠️ Entorno de Desarrollo Local

### Requisitos Previos
* Node.js v18 o superior
* npm, pnpm o yarn

### Pasos
1. Haz un fork del repositorio en GitHub.
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/zSnowww/AetherGram.git
   cd AetherGram
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Valida que el proyecto compila correctamente:
   ```bash
   npm run build
   ```

---

## 📋 Reglas y Buenas Prácticas de Código

1. **Privacidad Primero (Zero-Knowledge):**
   * Cualquier cambio o nueva funcionalidad **NUNCA** debe almacenar credenciales, números de teléfono, códigos o sesiones de Telegram en almacenamiento persistente (`localStorage`, cookies, etc.).
2. **Modularidad y Arquitectura:**
   * Respeta la separación en capas:
     * `src/core/`: Lógica pura de MTProto y Telegram sin dependencias de React.
     * `src/hooks/`: Gestión del ciclo de vida y estado reactivo.
     * `src/components/`: Componentes UI atómicos y visuales.
     * `src/services/`: Exportadores y serializadores de archivos.
3. **Estilos:**
   * Utiliza las clases de utilidad de TailwindCSS configuradas en el proyecto respetando el esquema de colores Dark Mode de Telegram (`bg-tg-*`, `text-tg-*`).

---

## 🚀 Envío de Cambios (Pull Requests)

1. Crea una rama descriptiva para tu cambio:
   ```bash
   git checkout -b feature/mi-mejora
   # o
   git checkout -b fix/mi-correccion
   ```
2. Realiza tus cambios asegurando commits claros.
3. Comprueba que `npm run build` pase sin errores.
4. Envía tu Pull Request describiendo con claridad el problema resuelto y la solución implementada.
