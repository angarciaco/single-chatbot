# 🤖 AGENTS.md - Contexto y Guía del Proyecto: Calzados Elite

Este documento proporciona el contexto completo, arquitectura, convenciones de desarrollo y roadmap del proyecto **Calzados Elite** para agentes de IA y desarrolladores que interactúen con el repositorio.

---

## 📌 1. Visión General del Proyecto

* **Nombre**: Calzados Elite
* **Tipo**: Landing Page comercial con Asistente Virtual / Chatbot flotante interactivo.
* **Propósito**: Canalizar clientes potenciales (B2B mayoristas y B2C al detal) hacia el catálogo de productos y el cierre de ventas o cotizaciones personalizadas mediante un bot conversacional y redirección a WhatsApp.
* **Paradigma**: Aplicación web ligera, sin herramientas de compilación complejas (Zero-build / Vanilla Stack).

---

## 🛠️ 2. Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Estructura** | HTML5 semántico | Marcado limpio para SEO y accesibilidad. |
| **Estilos** | CSS3 Vanilla | Estilos puros, flexbox, grid, animaciones nativas sin Tailwind ni frameworks CSS. |
| **Lógica** | JavaScript Vanilla (ES6+) | Manipulación del DOM, lógica conversacional basada en estados y WebSocket ready. |
| **Iconografía** | Lucide Icons (`unpkg.com/lucide@latest`) | Íconos vectoriales SVG limpios cargados vía CDN. |

---

## 📂 3. Estructura del Repositorio

```text
calzado/
├── index.html       # Estructura principal de la landing y contenedor del widget de chat
├── styles.css       # Estilos globales, componentes de la landing y ventana del chatbot
├── app.js           # Lógica del chatbot, flujo de árbol de decisiones, keywords y WS
└── AGENTS.md        # Documentación de contexto y directrices para agentes
```

---

## 🧩 4. Arquitectura de Archivos y Componentes

### 1. `index.html`
* **Navbar** (`.navbar`): Encabezado con logo (`data-lucide="footprints"`) y anclas de navegación (`#catalogo`, `#nosotros`, `#contacto`).
* **Hero Section** (`.hero`): Llamado a la acción principal con botón para desplegar el chatbot (`toggleChat()`).
* **Catálogo Rápido** (`#catalogo`): Grid responsivo con 3 categorías de calzado (Tenis Urbanos, Mocasines y Botas Industriales).
* **Widget Flotante** (`#chatWidget`):
  * Botón disparador (`#chatTrigger`).
  * Ventana de chat (`#chatWindow`) con cabecera de estado, cuerpo scrolleable (`#chatBody`) e input para texto libre (`#userInput`).

### 2. `styles.css`
* **Variables y Reseteo**: Sistema base de tipografías del sistema (`-apple-system`, BlinkMacSystemFont, Roboto, etc.).
* **Paleta de Colores**:
  * Primario / Interactivo: `#2563eb` (Azul), Hover: `#1d4ed8`.
  * Fondo Dark (Hero): `#1e293b` a `#0f172a`.
  * Fondo Claro: `#f8fafc`, Bordes: `#cbd5e1`, Texto: `#1e293b` / `#64748b`.
  * Estado Activo: `#4ade80` (Verde online).
* **Componentes de Chat**:
  * Ventana flotante fija (`position: fixed; bottom: 20px; right: 20px; z-index: 1000`).
  * Burbujas de diálogo (`.message.bot`, `.message.user`).
  * Botones de respuesta rápida (`.options-container`, `.option-btn`).

### 3. `app.js`
* **Árbol de Conocimiento** (`botKnowledge`):
  * Grafo de diálogo guiado por estados (`welcome`, `catalogo`, `mayoreo`, `ubicacion`, `whatsapp`).
  * Respuestas automáticas con botones interactivos que invocan `triggerOption(stepKey)`.
* **Respuestas por Palabras Clave** (`keywordResponses`):
  * Motor de coincidencia simple para texto libre (envíos, métodos de pago, garantías).
* **Modo Dual (WebSocket vs. Simulado)**:
  * Bandera: `USE_REAL_WEBSOCKET` (por defecto `false`).
  * Conexión a WebSocket en `initWebSocket()` (`ws://localhost:8080/chat`).
  * Simulación de latencia humana con `setTimeout` (400–500ms) en modo local.
* **Integración Comercial**:
  * Redirección a WhatsApp mediante `window.open` con mensaje URL-encoded predefinido.

---

## ⚙️ 5. Parámetros de Configuración y Variables Clave

Al realizar cambios o desplegar a producción, verificar estas variables en `app.js`:

* `USE_REAL_WEBSOCKET`: `true` para backend en vivo, `false` para modo demostración/offline.
* `WS_URL`: Endpoint WebSocket del servidor (por defecto `ws://localhost:8080/chat`).
* **Teléfono de WhatsApp**: Actualmente `573000000000` en la acción `whatsapp` (línea 97 aprox.).

---

## 📏 6. Reglas y Convenciones para Agentes y Desarrolladores

1. **Mantener la filosofía Vanilla**:
   * No introducir frameworks (React, Vue, Tailwind) salvo petición explícita del usuario.
   * Mantener el código ejecutable abriendo directamente `index.html` en el navegador.
2. **Seguridad en Renderizado (XSS)**:
   * Al manipular mensajes de usuario o entradas externas, usar `innerText` o `textContent`. **Nunca** inyectar texto libre de usuario directamente con `innerHTML`.
3. **Manejo de Lucide Icons**:
   * Si se insertan elementos dinámicos que utilicen atributos `data-lucide`, se debe ejecutar `lucide.createIcons()` después de añadirlos al DOM.
4. **Diseño Responsivo**:
   * Cualquier ajuste en `.chat-window` o en el catálogo debe contemplar pantallas pequeñas (evitar anchos fijos que desborden en pantallas móviles `< 400px`).
5. **Preservar Comentarios y Estructura Existente**:
   * Mantener la legibilidad y estructura modular entre datos, eventos y renderizado.

---

## 🚀 7. Roadmap y Tareas Pendientes (Backlog)

- [ ] **Imágenes de Catálogo**: Reemplazar emojis (`👟`, `👞`, `🥾`) por imágenes reales u optimizadas de productos con etiquetas de precio.
- [ ] **Secciones Incompletas**: Implementar las secciones `#nosotros` y `#contacto` enlazadas en el navbar.
- [ ] **Optimización Móvil del Chat**: Ajustar `.chat-window` con media queries para que en pantallas pequeñas ocupe el 100% de la pantalla o un tamaño adaptable (`width: 90vw; max-width: 360px`).
- [ ] **Persistencia de Conversación**: Guardar historial del chat en `sessionStorage` para no perder la conversación al recargar.
- [ ] **Integración Backend / IA**:
  * Conectar a un servidor WebSocket real con agente LLM o servicio de mensajería (ej. Node.js, Python FastAPI o webhook WhatsApp).
