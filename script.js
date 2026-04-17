const MENSAJES_INTELIGENTES = {
    suma: {
        intro: [
            "Observa cómo se combinan los términos 👀",
            "Este ejercicio es directo, fíjate bien en los signos.",
            "Vamos a trabajar con suma de polinomios 💪"
        ],
        pista: "Aquí no cambian los signos, solo elimina los paréntesis."
    },

    resta: {
        intro: [
            "Aquí viene algo importante ⚠️",
            "Mucho cuidado con este ejercicio 👀",
            "Atención: este tipo suele causar errores."
        ],
        pista: "Recuerda: el signo menos cambia TODO el segundo paréntesis."
    },

    general: {
        correcto: [
            "¡Excelente! 🌟",
            "¡Muy bien! 👏",
            "¡Vas súper bien! 🔥"
        ],
        error: [
            "Casi... revisa con calma 👀",
            "Vas bien, pero hay un detalle.",
            "Inténtalo otra vez, puedes hacerlo 💪"
        ]
    }
};

function getMensaje(ej, tipo, fallback) {
    return ej.mensajes?.[tipo] || fallback;
}

function mensajeAleatorio(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function detectarTipo(ej) {
    return ej.q.includes(") - (") ? "resta" : "suma";
}

const ejerciciosNuevo = [
{
    pregunta: "2x + 3x",
    opciones: ["5x", "6x", "2x"],
    correcta: "5x",
    tipo: "suma"
}
];

const avatars = {
    masculino: {
        explicando: "profesor_explicando.png",
        pensando: "profesor_pensando.png",
        saludando: "profesor_saludando.png"
    },
    femenino: {
        explicando: "profesora_explicando.png",
        pensando: "profesora_pensando.png",
        saludando: "profesora_saludando.png"
    }
};

function cambiarAvatar(genero, estado) {
    const img = document.getElementById("lesson-avatar");
    img.src = avatars[genero][estado];
} 

// 1. VARIABLES GLOBALES
let userData = { name: "", age: "", gender: "" };
let faseChat = "saludo"; 
let faseActual = "paso_parentesis";
let textoRespuesta = "";
let autoScrollActivo = false;
let pasoLeccion = 0;
let indiceEjercicio = 0; 
let ejerciciosSesion = []; 
const MAX_EJERCICIOS = 5;

const rutasAvatares = {
    femenino: { s: "profesora_saludo.png", e: "profesora_explicando.png", p: "profesora_pensando.png" },
    masculino: { s: "profesor_saludando.png", e: "profesor_explicando.png", p: "profesor_pensando.png" }
};

const leccionPolinomios = [
    { titulo: "Adición y Sustracción de Polinomios", texto: "¡Hola! Para sumar o restar polinomios, debemos agrupar los términos que tengan la misma letra y exponente.", cara: "s" },
    { titulo: "Sustracción", texto: "¡Atención! En la resta, el signo menos fuera del paréntesis cambia los signos de todo lo que esté adentro.", cara: "p" },
    { titulo: "¿Todo listo?", texto: "Vamos al chat para resolver un ejercicio juntos.", cara: "e" }
];

const baseDeDatos = [
    {
  q: "[(5x + 3y) + (2x + 4y)]",
  sinParentesis: "[5x + 3y + 2x + 4y]",
  pasoOrganizar: "[5x + 2x + 3y + 4y]",
  resultadoFinal: "[7x + 7y]",

  mensajes: {
    intro: "Para empezar con paso firme, observa bien los signos entre los paréntesis 👀",
    
    correctoOperacion: "¡Exacto! 🎯 El signo + indica que es una adición.",
    
    errorOperacion: "¡Casi! Fíjate bien en el signo entre paréntesis. Es una suma.",
    
    pistaParentesis: "Observa bien la secuencia... recuerda cómo cambian los signos 👀",
    
    correctoAgrupar: "¡Directo al clavo! 👏 Agrupar términos semejantes es la clave.",
    
    errorAgrupar: "¡Cuidado! Solo puedes agrupar términos con la misma letra.",
    
    correctoFinal: "¡Brillante! 🥳 Resultado correcto.",
    
    errorFinal: "¡Casi lo tienes! Inténtalo una vez más 💪"
  }
},
    { q: "[(8a + 5b) + (3a + b)]", sinParentesis: "[8a + 5b + 3a + b]", pasoOrganizar: "[8a + 3a + 5b + b]", resultadoFinal: "[11a + 6b]" },
    { q: "[(4x + 9y) + (7x + 2y)]", sinParentesis: "[4x + 9y + 7x + 2y]", pasoOrganizar: "[4x + 7x + 9y + 2y]", resultadoFinal: "[11x + 11y]" },
    { q: "[(6a + 2b) + (a + 10b)]", sinParentesis: "[6a + 2b + a + 10b]", pasoOrganizar: "[6a + a + 2b + 10b]", resultadoFinal: "[7a + 12b]" },
    { q: "[(12x + y) + (3x + 8y)]", sinParentesis: "[12x + y + 3x + 8y]", pasoOrganizar: "[12x + 3x + y + 8y]", resultadoFinal: "[15x + 9y]" },
    { q: "[(10x + 8y) - (4x + 2y)]", sinParentesis: "[10x + 8y - 4x - 2y]", pasoOrganizar: "[10x - 4x + 8y - 2y]", resultadoFinal: "[6x + 6y]" },
    { q: "[(15a + 12b) - (7a + 4b)]", sinParentesis: "[15a + 12b - 7a - 4b]", pasoOrganizar: "[15a - 7a + 12b - 4b]", resultadoFinal: "[8a + 8b]" },
    { q: "[(9x + 5y) - (3x + 8y)]", sinParentesis: "[9x + 5y - 3x - 8y]", pasoOrganizar: "[9x - 3x + 5y - 8y]", resultadoFinal: "[6x - 3y]" },
    { q: "[(20a + 10b) - (5a + 15b)]", sinParentesis: "[20a + 10b - 5a - 15b]", pasoOrganizar: "[20a - 5a + 10b - 15b]", resultadoFinal: "[15a - 5b]" },
    { q: "[(7x + 7y) - (2x + 7y)]", sinParentesis: "[7x + 7y - 2x - 7y]", pasoOrganizar: "[7x - 2x + 7y - 7y]", resultadoFinal: "[5x]" },
    { q: "[(12a - 5b) + (2a + 8b)]", sinParentesis: "[12a - 5b + 2a + 8b]", pasoOrganizar: "[12a + 2a - 5b + 8b]", resultadoFinal: "[14a + 3b]" },
    { q: "[(9x + 4y) - (9x - 2y)]", sinParentesis: "[9x + 4y - 9x + 2y]", pasoOrganizar: "[9x - 9x + 4y + 2y]", resultadoFinal: "[6y]" },
    { q: "[(20a - 10b) - (15a + 5b)]", sinParentesis: "[20a - 10b - 15a - 5b]", pasoOrganizar: "[20a - 15a - 10b - 5b]", resultadoFinal: "[5a - 15b]" },
    { q: "[(5x - 8y) + (3y - 2x)]", sinParentesis: "[5x - 8y + 3y - 2x]", pasoOrganizar: "[5x - 2x - 8y + 3y]", resultadoFinal: "[3x - 5y]" },
    { q: "[(-4a + 6b) - (2a - 4b)]", sinParentesis: "[-4a + 6b - 2a + 4b]", pasoOrganizar: "[-4a - 2a + 6b + 4b]", resultadoFinal: "[-6a + 10b]" }
];

// --- FUNCIONES DE UTILIDAD ---
function adj(masculino, femenino) {
    return userData.gender.toLowerCase() === "femenino" ? femenino : masculino;
}

function playSound(id) {
    const s = document.getElementById(id);
    if (!s) return;

    s.currentTime = 0;

    const playPromise = s.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // 🔥 Forzar desbloqueo con interacción previa
            document.body.addEventListener('touchstart', () => {
                s.play();
            }, { once: true });
        });
    }
}

function cambiarCara(animo, elementoId) {
    const idFinal = (elementoId === 'teacher-avatar') ? 'teacher-avatar-header' : elementoId;
    const img = document.getElementById(idFinal);
    if(img && userData.gender) {
        img.src = rutasAvatares[userData.gender.toLowerCase()][animo];
    }
}

// --- FUNCIÓN DE FORMATO (CORREGIDA PARA DISEÑO DE LIBRO) ---
function format(texto) {
    if (!texto) return "";

    // Negritas
    let html = texto.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Procesar ecuaciones entre [ ]
    return html.replace(/\[(.*?)\]/g, (match, contenido) => {

        // SOLO estilo simple (sin romper HTML)
        let res = contenido;

        // Espacios bonitos
        res = res.replace(/\+/g, ' + ');
        res = res.replace(/\-/g, ' − ');

        return `<span class="contenedor-ecuacion">${res}</span>`;
    });
}

// --- LÓGICA DE INICIO ---
function prepararEjerciciosAleatorios() {
    let copiaBase = [...baseDeDatos];
    for (let i = copiaBase.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copiaBase[i], copiaBase[j]] = [copiaBase[j], copiaBase[i]];
    }
    ejerciciosSesion = copiaBase.slice(0, MAX_EJERCICIOS);
}

document.getElementById('start-btn').onclick = () => {
    userData.name = document.getElementById('user-name').value;
    userData.age = document.getElementById('user-age').value;
    userData.gender = document.getElementById('user-gender').value;

    if (userData.name === "" || userData.gender === "" || userData.age === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }
    
    if (userData.gender.toLowerCase() === "masculino") {
        document.body.classList.add('tema-masculino');
    }
    
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('lesson-screen').classList.remove('hidden');
    mostrarPasoLeccion();
}; 

document.getElementById('next-lesson-btn').onclick = () => {
    if (pasoLeccion < leccionPolinomios.length - 1) {
        pasoLeccion++;
        mostrarPasoLeccion();
    } else {
        document.getElementById('lesson-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        iniciarChat();
    }
};

function mostrarPasoLeccion() {
    const data = leccionPolinomios[pasoLeccion];
    document.getElementById('lesson-title').innerText = data.titulo;
    document.getElementById('lesson-text').innerHTML = format(data.texto);
    cambiarCara(data.cara, 'lesson-avatar');
    document.getElementById('next-lesson-btn').innerText = (pasoLeccion === leccionPolinomios.length - 1) ? "Iniciar Chat" : "Siguiente";
}

// --- LÓGICA DEL CHAT ---
async function iniciarChat() {
    prepararEjerciciosAleatorios(); 
    indiceEjercicio = 0;           
    faseChat = "interaccion_inicial";
    cambiarCara("s", "teacher-avatar-header");

    await msgTutor([
        `¡Hola, ${userData.name}! 😊 Qué alegría saludarte nuevamente.`,
        `¡Hoy tenemos un reto fascinante! Vamos a dominar la adición y sustracción de polinomios para que los manejes como ${adj("todo un experto", "toda una experta")}.`,
        `Antes de entrar en acción, cuéntame: ¿cómo te sientes hoy para empezar este desafío?`
    ], "s");
    
    mostrarOpciones(
        `Estoy ${adj("listo", "lista")}, este tema me gusta mucho.`, 
        `Un poco ${adj("nervioso", "nerviosa")}, los polinomios me confunden a veces.`, 
        "Con ganas de aprender"
    );
}

document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = async function() {
        const respuesta = this.innerText;
        if (!respuesta) return;
        msgUser(respuesta);
        document.getElementById('options-area').classList.add('hidden');

        if (faseChat === "interaccion_inicial") {
            if (respuesta.includes("listo") || respuesta.includes("lista")) {
                await msgTutor(`¡Esa es la actitud! Vamos a subir un poco el nivel entonces para que saques ${adj("ese experto que llevas dentro", "esa experta que llevas dentro")}. ¡Aquí va el primero!`, "s");
                setTimeout(lanzarEjercicio, 1000);
            } 
            else if (respuesta.includes("nervioso") || respuesta.includes("nerviosa")) {
                await msgTutor(`No te preocupes, ${userData.name}. Vamos a desglosarlos paso a paso; verás que los términos semejantes son más amigables de lo que parecen.`, "p");
                await msgTutor("¿Empezamos con uno sencillo?", "s");
                faseChat = "confirmar_inicio";
                mostrarOpciones("¡Sí!", "No del todo");
            }
            else {
                await msgTutor([
                    "Entiendo perfectamente.",
                    "Vamos a hacer una sesión dinámica y directa al punto para que aprovechemos al máximo tu energía. ¡Tú puedes!"
                ], "s");
                setTimeout(lanzarEjercicio, 1000);
            }
        } 
        else if (faseChat === "confirmar_inicio") {
            await msgTutor("¡Excelente! Vamos a poner manos a la obra.", "s");
            setTimeout(lanzarEjercicio, 1000);
        }
        else if (faseChat === "pregunta_operacion") {

    const ejActual = ejerciciosSesion[indiceEjercicio];
    const tipo = detectarTipo(ejActual);

    const respuestaCorrecta = tipo === "resta" ? "Sustracción" : "Adición";

    if (respuesta === respuestaCorrecta) {

        await msgTutor([
            mensajeAleatorio([
                "¡Exacto! 🎯",
                "¡Muy bien visto! 👀",
                "¡Correcto! Vas afinando el ojo matemático 💪"
            ]),
            getMensaje(ejActual, "correctoOperacion", "")
        ], "s");

        faseActual = "paso_parentesis";
        faseChat = "";

        pedirTeclado("Ahora elimina los paréntesis. ¿Cómo quedaría?");

    } else {

        const pista = tipo === "resta"
            ? "Fíjate en el signo − entre los paréntesis. Ese signo cambia todo lo que sigue 👀"
            : "Observa el signo + que une ambos grupos. Eso indica que sumamos términos.";

        await msgTutor([
            getMensaje(ejActual, "errorOperacion", pista),
            "Vamos a verlo otra vez 👇",
            `**${ejActual.q}**`,
            "¿Qué operación debemos realizar principalmente?"
        ], "p");

        mostrarOpciones("Adición", "Sustracción");
    }
}
        else if (faseChat === "ayuda_opciones_parentesis") {
            const ejActual = ejerciciosSesion[indiceEjercicio];
            if (respuesta === ejActual.sinParentesis) {
                await msgTutor("¡Eso es! Al quitar paréntesis y aplicar signos, queda así. Continuemos.", "s");
            } else {
                await msgTutor(`¡Cuidado! La respuesta correcta es **${ejActual.sinParentesis}**. Recuerda que el signo menos cambia todo lo del segundo paréntesis.`, "p");
            }
            faseChat = "siguiente_movimiento";
            mostrarOpciones("Sumar todos los números directamente.", "Identificar y agrupar los términos semejantes.");
        }
       else if (faseChat === "siguiente_movimiento") {

    const ejActual = ejerciciosSesion[indiceEjercicio];

    if (respuesta.includes("agrupar") || respuesta.includes("Identificar")) {

        await msgTutor(
            ejActual.mensajes?.correctoAgrupar 
            || "¡Exacto! Agrupar términos semejantes es la clave.",
        "s");

        faseActual = "paso_agrupar";
        pedirTeclado("Ahora agrupa los términos semejantes:");

    } else {

        await msgTutor(
            ejActual.mensajes?.errorAgrupar
            || "Recuerda, primero debemos agrupar antes de sumar.",
        "p");

        mostrarOpciones(
            "Sumar todos los números directamente.", 
            "Identificar y agrupar los términos semejantes."
        );
    }
}
        else if (faseChat === "ayuda_opciones_agrupar") {
            const ejActual = ejerciciosSesion[indiceEjercicio];
            if (respuesta === ejActual.pasoOrganizar) {
                await msgTutor("¡Correcto! Agrupar términos semejantes es la clave.", "s");
            } else {
                await msgTutor(`La forma correcta de agrupar era: **${ejActual.pasoOrganizar}**.`, "p");
            }
            faseActual = "resultado_final";
            pedirTeclado("Ahora, resuelve las sumas finales:");
        }
    }; 
}); 

function actualizarTeclado(ejercicio) {
    const letrasEncontradas = [...new Set(ejercicio.q.match(/[a-z]/g))];
    const botonesLetras = document.querySelectorAll('.key-variable');
    
    botonesLetras.forEach((btn, i) => {
        if (letrasEncontradas[i]) {
            btn.innerText = letrasEncontradas[i];
            btn.style.display = "inline-block";
            btn.style.visibility = "visible"; 
        } else {
            btn.style.display = "none"; 
        }
    });
}

async function lanzarEjercicio() {
    faseChat = "pregunta_operacion";
    const ej = ejerciciosSesion[indiceEjercicio]; 
    actualizarTeclado(ej); 

    const tipo = detectarTipo(ej); // ✅ AQUÍ afuera

    await msgTutor([
        indiceEjercicio === 0 
            ? "Vamos a poner manos a la obra con nuestro primer reto. 😉" 
            : "¡Siguiente reto! 💪",

        mensajeAleatorio(MENSAJES_INTELIGENTES[tipo].intro), // ✅ ahora sí

        `**${ej.q}**`,

        "¿Qué operación debemos realizar principalmente?"
    ], "e");

    mostrarOpciones("Adición", "Sustracción");
}

async function msgTutor(mensajes, animo = "s") {
    const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
    cambiarCara(animo, 'teacher-avatar-header'); 
    for (const t of lista) {
        playSound('sound-receive');
        const box = document.getElementById('chat-box');
        const div = document.createElement('div');
        div.className = 'msg tutor-msg';
        div.innerHTML = format(t); 
        
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        if (lista.length > 1) await new Promise(r => setTimeout(r, 1200));
    }
}

function msgUser(t) {
    const div = document.createElement('div');
    div.className = 'msg user-msg';
    
    // 👇 AQUÍ ESTÁ LA CLAVE
    div.innerHTML = format("[" + t + "]"); 
    
    const chat = document.getElementById('chat-box');
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function pedirTeclado(instruccion) {
    msgTutor(instruccion, "e");

    setTimeout(() => {
        const input = document.getElementById('input-section');
        input.classList.remove('hidden');

        autoScrollActivo = true; // 👈 AQUÍ
    }, 300);
}

// --- TECLADO VIRTUAL ---
document.querySelectorAll('.key').forEach(boton => {
boton.onclick = () => {
    const visual = document.getElementById('visual-input');

    if (boton.classList.contains('delete-key')) {
        textoRespuesta = textoRespuesta.slice(0, -1);
    } 
    else if (boton.classList.contains('clear-key')) {
        textoRespuesta = "";
    }
    else if (boton.classList.contains('space-key')) {
        textoRespuesta += " ";
    }
    else if (boton.classList.contains('send-key')) {
        document.getElementById('send-btn').click();
        return;
    }
    else {
        textoRespuesta += boton.innerText;
    }

    visual.innerHTML = textoRespuesta 
    ? format("[" + textoRespuesta + "]") 
    : "Respuesta...";
    visual.classList.toggle('placeholder', textoRespuesta === "");

    playSound('sound-send');
};
});

// --- LÓGICA DE ENVÍO Y COMPARACIÓN ---
let puntajeAcumulado = 100; 
let erroresReglaOro = 0;    

document.getElementById('send-btn').onclick = async () => {
    if (!textoRespuesta) return;
    const entrada = textoRespuesta
    .replace(/\s+/g, '') 
    .replace(/−/g, '-')  
    .toLowerCase();

    const ej = ejerciciosSesion[indiceEjercicio];

    msgUser(textoRespuesta);
    textoRespuesta = ""; 
    const visual = document.getElementById('visual-input');
    visual.innerText = "Respuesta...";
    visual.style.color = "#aaa"; 
    visual.classList.add('placeholder');
    document.getElementById('input-section').classList.add('hidden');

if (faseActual === "paso_parentesis") {

    const correcto = ej.sinParentesis.replace(/\s+/g, '').replace(/\[|\]/g, '').toLowerCase();

    if (entrada === correcto) {

        await msgTutor([
    mensajeAleatorio(MENSAJES_INTELIGENTES.general.correcto),
    "Paso completado correctamente 👏"
], "s");

        faseChat = "siguiente_movimiento";

        mostrarOpciones(
            "Sumar directamente",
            "Identificar y agrupar términos semejantes"
        );

    } else {

        if (!ej.intentosP) ej.intentosP = 1; else ej.intentosP++;

        puntajeAcumulado -= 3;
        erroresReglaOro++;

        const tipo = detectarTipo(ej);

        await msgTutor([
            mensajeAleatorio(MENSAJES_INTELIGENTES.general.error),
            MENSAJES_INTELIGENTES[tipo].pista
        ], "p");

        if (ej.intentosP < 2) {

            document.getElementById('input-section').classList.remove('hidden');

        } else {

            await msgTutor([
                "Te doy una pista más clara 👇",
                `Resultado correcto: **${ej.sinParentesis}**`,
                "Observa cómo cambiaron los signos."
            ], "e");

            faseChat = "siguiente_movimiento";

            mostrarOpciones(
                "Sumar todos los números directamente.",
                "Identificar y agrupar los términos semejantes."
            );
        }
    }
}
   else if (faseActual === "paso_agrupar") {

    const correcto = ej.pasoOrganizar.replace(/\s+/g, '').replace(/\[|\]/g, '').toLowerCase();

    if (entrada === correcto) {

        await msgTutor([
            mensajeAleatorio([
                "¡Excelente! 🌟",
                "¡Perfecto! 👏",
                "¡Muy bien agrupado! 🔥"
            ]),
            getMensaje(ej, "correctoAgrupar", "")
        ], "s");

        faseActual = "resultado_final";
        pedirTeclado("Ahora realiza las operaciones finales:");

    } else {

        if (!ej.intentosA) ej.intentosA = 1; else ej.intentosA++;

        await msgTutor(
            getMensaje(ej, "errorAgrupar", "Recuerda: solo se agrupan términos con la misma letra."),
        "p");

        document.getElementById('input-section').classList.remove('hidden');
    }
}
    else if (faseActual === "resultado_final") {
        const correcto = ej.resultadoFinal.replace(/\s+/g, '').replace(/\[|\]/g, '').toLowerCase();
        if (entrada === correcto) {
await msgTutor([
    mensajeAleatorio(MENSAJES_INTELIGENTES.general.correcto),
    `**${ej.resultadoFinal}** es el resultado correcto.`,
    getMensaje(ej, "correctoFinal", "Has aplicado todos los pasos perfectamente 👏")
], "s");

avanzarSiguienteEjercicio();
        } else {
            if (!ej.intentosF) ej.intentosF = 1; else ej.intentosF++;
            puntajeAcumulado -= 1; 
            if (ej.intentosF < 2) {
                await msgTutor(
    ej.mensajes?.errorFinal 
    || "¡Casi! Revisa bien las sumas finales.",
"p");
                document.getElementById('input-section').classList.remove('hidden');
            } else {
                await msgTutor(`La respuesta era **${ej.resultadoFinal}**. ¡Sigamos!`, "e");
                avanzarSiguienteEjercicio();
            }
        }
    }
};

function avanzarSiguienteEjercicio() {
    indiceEjercicio++;
    if (indiceEjercicio < ejerciciosSesion.length) { 
        setTimeout(lanzarEjercicio, 2000); 
    } else {
        setTimeout(mostrarBoletaFinal, 1500);
    }
}

function mostrarBoletaFinal() {
    document.getElementById('chat-box').classList.add('hidden');
    document.getElementById('input-section').classList.add('hidden');
    autoScrollActivo = false;
    document.getElementById('options-area').classList.add('hidden');
    
    const esM = userData.gender.toLowerCase() === "masculino";
    const cFondo = esM ? "#F5F5DC" : "#E6E6FA"; 
    const cBorde = esM ? "#D2B48C" : "#D8BFD8"; 
    const cTexto = esM ? "#8B4513" : "#6A5ACD"; 

    let nivel = puntajeAcumulado >= 90 ? "Excelente" : (puntajeAcumulado >= 70 ? "Bueno" : "Necesita Refuerzo");
    let mensajeFinal = puntajeAcumulado >= 90 ? "¡Eres imparable!" : "¡Buen trabajo, sigue practicando!";

    const boleta = document.createElement('div');
    boleta.style.cssText = `background:${cFondo}; border-radius:20px; padding:25px; text-align:center; margin:20px; border:3px solid ${cBorde}; color:${cTexto}; font-family:sans-serif;`;

    boleta.innerHTML = `
        <h2>📊 Resumen Estadístico</h2>
        <div style="font-size: 3em; font-weight: bold;">${Math.max(0, puntajeAcumulado).toFixed(0)}%</div>
        <p><strong>Nivel:</strong> ${nivel}</p>
        <p>${mensajeFinal}</p> <hr style="border: 0.5px solid ${cBorde}">
        <p>✅ Ejercicios: ${MAX_EJERCICIOS}/${MAX_EJERCICIOS} | ⚠️ Errores: ${erroresReglaOro}</p>
        <button onclick="location.reload()" style="background:${cTexto}; color:white; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;">🔄 Reintentar</button>
    `;
    document.getElementById('app-container').appendChild(boleta);
}

function mostrarOpciones(a, b, c = null) {
    const area = document.getElementById('options-area');
    area.classList.remove('hidden');

    document.getElementById('opt-a').innerHTML = format(a);
    document.getElementById('opt-b').innerHTML = format(b);

    const btnC = document.getElementById('opt-c');

    if (c) { 
        btnC.innerHTML = format(c); 
        btnC.classList.remove('hidden'); 
    } else { 
        btnC.classList.add('hidden'); 
    }
}

function scrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

setInterval(() => {
    if (!autoScrollActivo) return;

    const chatBox = document.getElementById("chat-box");

    const cercaDelFinal = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 100;

    if (cercaDelFinal) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}, 200);

const chatBox = document.getElementById("chat-box");

chatBox.addEventListener("scroll", () => {
    const cercaDelFinal = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 50;

    if (!cercaDelFinal) {
        autoScrollActivo = false; // 👈 usuario está explorando arriba
    }
});
