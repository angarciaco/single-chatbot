// Configuración y Estado
let ws = null;
const USE_REAL_WEBSOCKET = false; // Cambiar a true si tienes un servidor WS activo (ej: ws://localhost:8080)
const WS_URL = "ws://localhost:8080/chat";

// Base de Conocimiento y Flujo del Bot
const botKnowledge = {
    welcome: {
        text: "¡Hola! 👋 Bienvenido a Calzados Elite. ¿En qué puedo ayudarte hoy?",
        options: [
            { label: "📦 Ver catálogo de precios", trigger: "catalogo" },
            { label: "🏭 Ventas al por mayor", trigger: "mayoreo" },
            { label: "📍 Ubicación y Horarios", trigger: "ubicacion" },
            { label: "💬 Hablar con un asesor (WhatsApp)", trigger: "whatsapp" }
        ]
    },
    catalogo: {
        text: "Manejamos 3 líneas principales:\n- Tenis Urbanos: desde $25 USD / par\n- Mocasines Cuero: desde $40 USD / par\n- Botas Industriales: desde $45 USD / par",
        options: [
            { label: "🏭 Descuento por mayor", trigger: "mayoreo" },
            { label: "💬 Contactar ventas", trigger: "whatsapp" },
            { label: "↩️ Menú principal", trigger: "welcome" }
        ]
    },
    mayoreo: {
        text: "Fabricamos sobre pedido a partir de 12 pares por referencia. Ofrecemos marcación personalizada para tu marca.",
        options: [
            { label: "💬 Solicitar cotización vía WhatsApp", trigger: "whatsapp" },
            { label: "↩️ Menú principal", trigger: "welcome" }
        ]
    },
    ubicacion: {
        text: "📍 Estamos ubicados en la Zona Industrial de Calzado.\n⏰ Atención: Lunes a Viernes de 8:00 AM a 5:00 PM.",
        options: [
            { label: "↩️ Menú principal", trigger: "welcome" }
        ]
    },
    whatsapp: {
        text: "Serás redirigido con uno de nuestros ejecutivos comerciales a WhatsApp.",
        action: "redirect_whatsapp",
        options: [
            { label: "↩️ Menú principal", trigger: "welcome" }
        ]
    }
};

// Respuestas a texto libre (fallback de coincidencias sencillas)
const keywordResponses = [
    { keywords: ["envio", "despacho", "flete"], response: "Realizamos envíos a todo el país mediante transportadoras nacionales. El tiempo de entrega es de 2 a 4 días hábiles." },
    { keywords: ["pago", "nequi", "tarjeta", "transferencia"], response: "Aceptamos transferencias bancarias, Nequi, Daviplata y tarjetas de crédito/débito." },
    { keywords: ["garantia", "cambio"], response: "Todos nuestros productos tienen 60 días de garantía por defectos de fabricación." }
];

// Inicialización del Chatbot
document.addEventListener("DOMContentLoaded", () => {
    initWebSocket();
    // Cargar saludo inicial
    renderBotStep("welcome");
});

function toggleChat() {
    const windowEl = document.getElementById("chatWindow");
    windowEl.classList.toggle("hidden");
}

// Inicialización / Simulación de WebSocket
function initWebSocket() {
    if (USE_REAL_WEBSOCKET) {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => console.log("Conectado al WebSocket del servidor");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            appendMessage("bot", data.text, data.options);
        };
        ws.onerror = (err) => console.error("Error en WebSocket:", err);
    }
}

// Enviar mensaje o interactuar
function triggerOption(stepKey) {
    const step = botKnowledge[stepKey];
    if (!step) return;

    // Renderizar interacción del usuario si aplica
    const selectedOption = Object.values(botKnowledge)
        .flatMap(s => s.options || [])
        .find(o => o.trigger === stepKey);

    if (selectedOption) {
        appendMessage("user", selectedOption.label);
    }

    setTimeout(() => {
        appendMessage("bot", step.text, step.options);
        if (step.action === "redirect_whatsapp") {
            window.open("https://wa.me/573177533148?text=Hola,%20vengo%20de%20su%20sitio%20web%20y%20deseo%20más%20información", "_blank");
        }
    }, 400);
}

function sendFreeText() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";

    if (USE_REAL_WEBSOCKET && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: text }));
    } else {
        // Respuesta simulated basada en palabras clave
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            const match = keywordResponses.find(k => k.keywords.some(kw => lowerText.includes(kw)));

            if (match) {
                appendMessage("bot", match.response, [{ label: "↩️ Menú principal", trigger: "welcome" }]);
            } else {
                appendMessage(
                    "bot",
                    "No comprendo del todo tu pregunta, pero puedo ayudarte con estas opciones:",
                    botKnowledge.welcome.options
                );
            }
        }, 500);
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") sendFreeText();
}

function renderBotStep(stepKey) {
    const step = botKnowledge[stepKey];
    if (step) {
        appendMessage("bot", step.text, step.options);
    }
}

// Renderizar Mensaje en el DOM
function appendMessage(sender, text, options = []) {
    const chatBody = document.getElementById("chatBody");

    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;

    chatBody.appendChild(msgDiv);

    // Si el bot incluye opciones de respuesta rápida
    if (sender === "bot" && options.length > 0) {
        const optionsDiv = document.createElement("div");
        optionsDiv.className = "options-container";

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt.label;
            btn.onclick = () => triggerOption(opt.trigger);
            optionsDiv.appendChild(btn);
        });

        chatBody.appendChild(optionsDiv);
    }

    // Auto-scroll al final
    chatBody.scrollTop = chatBody.scrollHeight;
}