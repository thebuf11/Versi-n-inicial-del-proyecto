/* ============================================================
   Asistente del CV de Iván
   - Funciona entero en el navegador: sin servidor, sin claves y
     sin coste, aunque la web tenga muchas visitas.
   - Solo responde con los datos del CV (fuente: CV ivan td.docx)
     y de esta web (DAM, proyectos y aficiones). Lo que no consta,
     lo reconoce en lugar de inventarlo.
   - No es un modelo de lenguaje: busca la pregunta entre temas
     del CV, por eso no puede salirse de ese terreno.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.documentElement.classList.contains("motion-on");

  var MAIL = "isasan@eeartesanos.com";

  /* ----------------------------------------------------------
     1 · Temas del CV
     q    pregunta que se muestra en los botones de sugerencia
     kw   palabras o frases que activan el tema
     pri  prioridad ante empates (más alto = más específico)
     next temas que se sugieren después
     ---------------------------------------------------------- */
  var TOPICS = [
    {
      id: "perfil", pri: 1, general: true,
      q: "¿Quién es Iván?",
      kw: ["perfil", "quien es", "quien eres", "sobre ivan", "sobre ti", "presentate", "presentacion", "resumen", "describe", "describeme", "cualidades", "fortalezas", "puntos fuertes", "personalidad", "iniciativa", "autodidacta", "responsabilidad", "acerca de"],
      a: "Iván Saez Santa Rosalia es un profesional versátil con experiencia en marketing digital, administración e informática.\n\nDestaca por su iniciativa, aprendizaje autodidacta, responsabilidad y capacidad de trabajo en equipo. Con formación en ventas e informática, combina competencias técnicas y creativas para adaptarse a distintos entornos laborales.",
      next: ["experiencia", "formacion", "contacto"]
    },
    {
      id: "experiencia", pri: 1, general: true,
      q: "¿Qué experiencia laboral tiene?",
      kw: ["experiencia", "trayectoria", "historial", "empleos", "empleo", "trabajos", "puestos", "trabajado", "laboral", "curriculum", "cv", "empresas", "profesional", "ha hecho"],
      a: "Su trayectoria, de más reciente a más antigua:\n\n• **AN GRUP SL** (Andorra, 2024): administrativo y mantenimiento de centro deportivo\n• **CUIDAMA SL** (Valencia, 2022–2024): marketing digital y comunicación visual\n• **Prácticas en informática** (2018): 380 horas como Técnico en Sistemas Informáticos y Redes en el Ajuntament de l'Alcúdia de Crespins",
      next: ["marketing", "administracion", "logros"]
    },
    {
      id: "formacion", pri: 1, general: true,
      q: "¿Qué formación tiene?",
      kw: ["formacion", "estudios", "estudiar", "estudiado", "titulo", "titulos", "titulacion", "academica", "grado", "colegio", "eso", "carrera", "cursado", "estudia"],
      a: "Tiene formación en ventas e informática, y ahora estudia programación:\n\n• Primero de DAM (Desarrollo de Aplicaciones Multiplataforma), curso 2025–2026\n• Grado Superior en Gestión de Ventas y Espacios Comerciales (Colegio Artesanos de Valencia)\n• Grado Medio en Sistemas Microinformáticos y Redes (Colegio Esclaves de María de Valencia)\n• ESO (Colegio Salesianos de Valencia)\n• Formación práctica como Técnica en Sistemas Informáticos y Redes: 380 horas en el Ajuntament de l'Alcúdia de Crespins (2018)",
      next: ["informatica", "ventas", "idiomas"]
    },
    {
      id: "marketing", pri: 2,
      q: "¿Qué experiencia tiene en marketing?",
      kw: ["marketing", "campana", "campanas", "publicidad", "publicitarias", "facebook", "instagram", "google ads", "ads", "redes sociales", "contenido", "contenidos", "video", "videos", "reels", "diseno grafico", "metricas", "comunicacion visual", "community", "visualizaciones"],
      a: "Dos años de experiencia directa: especialista en marketing digital y comunicación visual en CUIDAMA SL (2022–2024).\n\n• Gestión de campañas en Facebook e Instagram Ads: más de 30K visualizaciones al mes\n• Contenido visual: fotos, vídeos y reels\n• Estrategias en redes sociales y análisis de métricas\n• Edición con Canva, CapCut y Premiere Pro\n\nGoogle Ads figura también entre sus habilidades.",
      next: ["herramientas", "logros", "administracion"]
    },
    {
      id: "administracion", pri: 2,
      q: "¿Y en administración?",
      kw: ["administracion", "administrativo", "administrativa", "gestion administrativa", "oficina", "facturacion", "documentacion", "archivo", "sap", "mantenimiento", "centro deportivo"],
      a: "Su experiencia administrativa está en **AN GRUP SL** (Andorra, 2024), donde trabajó como administrativo y en el mantenimiento de un centro deportivo.\n\nEl CV no detalla más tareas de ese puesto. Además, la gestión administrativa y el SAP básico figuran entre sus habilidades.",
      next: ["angrup", "herramientas", "experiencia"]
    },
    {
      id: "informatica", pri: 2,
      q: "¿Qué sabe de informática?",
      kw: ["informatica", "informatico", "informaticos", "soporte", "hardware", "redes", "microinformaticos", "smr", "tecnico", "tecnica", "ordenador", "ordenadores", "software", "sistemas", "ajuntament", "practicas", "alcudia", "crespins"],
      a: "Es Técnico en Sistemas Microinformáticos y Redes (Grado Medio, Colegio Esclaves de María de Valencia) y realizó 380 horas de formación práctica como Técnica en Sistemas Informáticos y Redes en el Ajuntament de l'Alcúdia de Crespins (2018).\n\nEn el CV recoge soporte informático en hardware, redes y software.",
      next: ["herramientas", "formacion", "experiencia"]
    },
    {
      id: "ventas", pri: 2,
      q: "¿Tiene experiencia en ventas?",
      kw: ["ventas", "venta", "vender", "comercio", "comercial", "comerciales", "espacios comerciales", "gestion de ventas", "grado superior", "artesanos", "atencion al cliente", "clientes", "cliente"],
      a: "Tiene el Grado Superior en Gestión de Ventas y Espacios Comerciales (Colegio Artesanos de Valencia).\n\nEn el CV no aparece un puesto de ventas como tal. Lo más cercano: atención al cliente figura entre sus habilidades, y en AN GRUP realizó tareas administrativas y de mantenimiento.",
      next: ["formacion", "marketing", "experiencia"]
    },
    {
      id: "herramientas", pri: 2,
      q: "¿Qué habilidades y herramientas maneja?",
      kw: ["herramientas", "herramienta", "programas", "aplicaciones", "utiliza", "maneja", "manejas", "sabe usar", "canva", "capcut", "premiere", "ofimatica", "habilidades", "habilidad", "skills", "competencias", "sabe hacer", "que sabe", "capaz de"],
      a: "Habilidades que recoge el CV:\n\n• Campañas publicitarias (Facebook Ads, Google Ads)\n• Edición de vídeo y diseño gráfico básico (CapCut, Canva, Premiere)\n• Gestión de redes sociales y contenidos\n• Administración y gestión administrativa (SAP básico)\n• Soporte informático (hardware, redes, software)\n• Trabajo en equipo y atención al cliente",
      next: ["marketing", "informatica", "idiomas"]
    },
    {
      id: "idiomas", pri: 2,
      q: "¿Qué idiomas habla?",
      kw: ["idiomas", "idioma", "ingles", "valenciano", "catalan", "castellano", "espanol", "habla", "hablar", "lenguas", "nivel de ingles"],
      a: "Idiomas:\n\n• Español: nativo\n• Valenciano: nativo\n• Inglés: nivel básico (A2), en proceso de mejora",
      next: ["permisos", "formacion", "contacto"]
    },
    {
      id: "permisos", pri: 2,
      q: "¿Tiene carnet de conducir?",
      kw: ["carnet", "conducir", "primeros auxilios", "auxilios", "permiso", "permisos", "coche", "vehiculo", "informacion adicional"],
      a: "Información adicional del CV:\n\n• Permiso de conducir B\n• Formación en primeros auxilios",
      next: ["idiomas", "contacto", "experiencia"]
    },
    {
      id: "logros", pri: 2,
      q: "¿Qué logros destaca?",
      kw: ["logros", "logro", "resultados", "destacado", "destaca", "destacar", "metricas", "orgulloso", "mejor"],
      a: "Los resultados concretos que recoge el CV:\n\n• Campañas de Facebook e Instagram Ads con más de 30K visualizaciones al mes (CUIDAMA)\n• Gestión administrativa y mantenimiento de un centro deportivo (AN GRUP)\n• 380 horas de prácticas en Sistemas Informáticos y Redes (Ajuntament de l'Alcúdia de Crespins)",
      next: ["marketing", "administracion", "experiencia"]
    },
    {
      id: "anos", pri: 3,
      q: "¿Cuántos años de experiencia tiene?",
      kw: ["anos de experiencia", "cuanto tiempo lleva", "cuanto tiempo", "desde cuando", "antiguedad", "cuantos trabajos", "cuantas empresas"],
      a: "Su experiencia en marketing y administración va de 2022 a 2024: marketing digital en CUIDAMA (2022–2024) y administración y mantenimiento en AN GRUP (2024), además de 380 horas de prácticas en informática (2018).",
      next: ["experiencia", "logros", "contacto"]
    },
    {
      id: "contacto", pri: 2,
      q: "¿Cómo contacto con Iván?",
      kw: ["contacto", "contactar", "contactarle", "telefono", "correo", "email", "mail", "escribir", "escribirle", "llamar", "llamarle", "whatsapp", "movil", "numero"],
      a: "Para contactar con Iván:\n\n• Correo: " + MAIL + "\n\nEl teléfono no se publica: todas las consultas van por correo. También puedes usar el formulario de la sección Contacto de esta web.",
      next: ["disponibilidad", "experiencia", "formacion"]
    },
    {
      id: "disponibilidad", pri: 2,
      q: "¿Cuál es su disponibilidad?",
      kw: ["disponibilidad", "disponible", "jornada", "horario", "incorporacion", "incorporarse", "contratar", "contratarle", "contratacion", "vacante", "oferta", "entrevista", "fecha"],
      a: "El CV no indica disponibilidad, jornada ni fecha de incorporación, así que lo mejor es concretarlo directamente con Iván por correo:\n\n• " + MAIL,
      next: ["contacto", "permisos", "experiencia"]
    },

    /* --- Una entrada por empresa --- */
    {
      id: "cuidama", pri: 3,
      q: "¿Qué hizo en CUIDAMA?",
      kw: ["cuidama", "especialista en marketing digital"],
      a: "En **CUIDAMA SL** (Valencia, 2022–2024) fue especialista en marketing digital y comunicación visual:\n\n• Gestión de campañas en Facebook e Instagram Ads (+30K visualizaciones al mes)\n• Creación de contenido visual: fotos, vídeos y reels\n• Estrategias en redes sociales y análisis de métricas\n• Edición con Canva, CapCut y Premiere Pro",
      next: ["marketing", "administracion", "herramientas"]
    },
    {
      id: "angrup", pri: 3,
      q: "¿Y en AN GRUP, en Andorra?",
      kw: ["an grup", "angrup", "andorra", "centro deportivo", "deportivo", "administrativo", "mantenimiento"],
      a: "En **AN GRUP SL** (Andorra, 2024) trabajó como administrativo y en el mantenimiento de un centro deportivo. El CV no detalla más tareas de ese puesto.",
      next: ["administracion", "experiencia", "contacto"]
    },

    /* --- Datos de esta web (no están en el CV) --- */
    {
      id: "programacion", pri: 3,
      q: "¿Sabe programar?",
      kw: ["programacion", "programar", "programador", "desarrollo web", "desarrollador", "dam", "daw", "java", "python", "javascript", "html", "css", "codigo", "github"],
      a: "Está aprendiendo: cursa **Primero de DAM** (2025–2026), donde ha entregado tres prácticas con HTML, CSS y JavaScript, incluida esta misma web.\n\nSus proyectos están en GitHub: github.com/thebuf11",
      next: ["proyectos", "informatica", "formacion"]
    },
    {
      id: "proyectos", pri: 3,
      q: "¿Qué proyectos ha hecho?",
      kw: ["proyectos", "proyecto", "portfolio", "portafolio", "web", "pagina", "practicas de dam", "campanas"],
      a: "Los proyectos que muestra esta web, contados como problema → solución → resultado:\n\n• **Campañas en redes sociales** (CUIDAMA, 2022–2024): campañas de Facebook e Instagram Ads y contenido propio. Resultado: más de 30K visualizaciones al mes\n• **Esta web personal** (2026): HTML, CSS y JavaScript sin frameworks, formulario con respuesta automática y modo oscuro. Resultado: 100 en accesibilidad en Lighthouse\n• **Primero de DAM** (2025–2026): tres prácticas con HTML, CSS y JavaScript, incluida esta página",
      next: ["programacion", "marketing", "contacto"]
    },
    {
      id: "aficiones", pri: 3,
      q: "¿Qué aficiones tiene?",
      kw: ["aficiones", "aficion", "hobbies", "hobby", "gustos", "le gusta", "te gusta", "tiempo libre", "deportes", "gimnasio", "gym", "crossfit", "calistenia", "viajar", "viajes", "tecnologia", "linux", "blockchain", "videojuegos", "juegos"],
      a: "Según la sección «Me gusta» de esta web:\n\n• Viajar siempre que puede\n• Tecnología: montar y desmontar cosas y probar distros Linux\n• Blockchain: wallets y contratos inteligentes\n• Deporte: gimnasio, crossfit y calistenia\n• Videojuegos: roguelikes y estrategia",
      next: ["perfil", "proyectos", "contacto"]
    },

    /* --- Cosas que el CV NO dice --- */
    {
      id: "salario", pri: 3, nodata: true,
      q: "¿Qué pretensiones salariales tiene?",
      kw: ["salario", "sueldo", "cobrar", "cobra", "pretensiones", "euros", "tarifa", "remuneracion"],
      a: "El CV no incluye pretensiones salariales. Para hablar de condiciones, lo mejor es escribir a Iván:\n\n• " + MAIL,
      next: ["contacto", "disponibilidad", "experiencia"]
    },
    {
      id: "personal", pri: 3, nodata: true,
      q: "¿Dónde vive?",
      kw: ["edad", "que edad", "cuantos anos tiene", "nacimiento", "nacio", "cumpleanos", "vive", "direccion", "domicilio", "residencia", "donde vive", "casado", "hijos", "nacionalidad", "dni"],
      a: "Ese dato personal no aparece en el CV de Iván, así que no puedo dártelo. Lo que sí consta es que ha trabajado en Valencia y en Andorra.",
      next: ["experiencia", "contacto", "formacion"]
    },
    {
      id: "otros", pri: 3, nodata: true,
      q: "¿Tiene referencias o LinkedIn?",
      kw: ["referencias", "recomendacion", "recomendaciones", "linkedin", "foto", "fotografia"],
      a: "El CV no incluye referencias, perfiles de redes profesionales ni fotografía, así que no puedo hablar de eso. Puedes pedirlo directamente a Iván por correo:\n\n• " + MAIL,
      next: ["contacto", "experiencia", "formacion"]
    },
    {
      id: "identidad", pri: 3,
      q: "¿Eres una inteligencia artificial?",
      kw: ["eres una ia", "eres un bot", "eres un robot", "eres humano", "eres una persona", "eres chatgpt", "quien te creo", "como funcionas", "eres real", "que eres", "inteligencia artificial", "chatgpt"],
      a: "Soy un asistente automático de esta web. No es un modelo de IA generativa: busca en los datos del CV de Iván y de esta web y responde solo con ellos, por eso no puedo hablar de otros temas ni inventar datos.",
      next: ["perfil", "experiencia", "formacion"]
    }
  ];

  var BY_ID = {};
  TOPICS.forEach(function (t) { BY_ID[t.id] = t; });

  var START_IDS = ["formacion", "experiencia", "herramientas", "contacto"];

  var GREETING =
    "Hola. Soy el asistente del CV de Iván.\n\n" +
    "Respondo solo con lo que pone en su CV y en esta web: formación, experiencia en cada empresa, " +
    "habilidades, proyectos, aficiones, idiomas y contacto. Lo que no consta, te lo digo en lugar de inventarlo.";

  var OUT_OF_SCOPE =
    "Solo puedo responder con lo que aparece en el CV de Iván y en esta web, y eso no está.\n\n" +
    "Puedes preguntarme por su formación, experiencia laboral, habilidades, proyectos, idiomas o cómo contactarle.";

  var THANKS = "De nada. Si quieres saber algo más del CV, aquí sigo.";

  /* ----------------------------------------------------------
     2 · Búsqueda de la respuesta
     ---------------------------------------------------------- */
  var STOP = ("de la el en y a que es un una por con para los las del al se su sus tu tus " +
    "tiene tienes tengo ha has he me mi como cual cuales hay lo le les o u e si no mas muy " +
    "ya pero sobre entre este esta eso esa dime dame puedes puede quiero saber").split(" ");

  var norm = function (text) {
    return String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  var stem = function (w) {
    if (w.length > 4 && /es$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && /s$/.test(w)) w = w.slice(0, -1);
    // Singular en -e y plural en -es acaban igual: deporte/deportes -> deport
    if (w.length > 4 && /e$/.test(w)) w = w.slice(0, -1);
    return w;
  };

  var commonPrefix = function (a, b) {
    var i = 0;
    while (i < a.length && i < b.length && a.charAt(i) === b.charAt(i)) i++;
    return i;
  };

  var INJECTION = /(ignora|olvida|omite|salta).*(instruccion|regla|prompt|anterior)|system prompt|\bprompt\b|actua como|finge|jailbreak|modo desarrollador|haz de cuenta|\brol de\b/;
  var GREET_WORDS = ["hola", "buenas", "buenos", "hey", "saludos", "ey", "buen"];
  var THANK_WORDS = ["gracias", "grax", "adios", "chao", "perfecto", "genial", "vale", "ok", "hasta"];

  var scoreTopic = function (topic, qPadded, stems) {
    var score = 0;
    var fuzzy = false; // las coincidencias aproximadas suman como mucho 1 por tema
    topic.kw.forEach(function (word) {
      var k = norm(word);
      if (!k) return;
      if (k.indexOf(" ") >= 0) {
        if (qPadded.indexOf(" " + k + " ") >= 0) score += 3;
        return;
      }
      var ks = stem(k);
      for (var i = 0; i < stems.length; i++) {
        var s = stems[i];
        if (s === ks) { score += 2; return; }
        // Variantes de la misma palabra (informática/informático): casi todo el prefijo igual
        var cp = commonPrefix(ks, s);
        var shorter = Math.min(ks.length, s.length);
        if (!fuzzy && shorter >= 6 && cp >= shorter - 1) {
          score += 1;
          fuzzy = true;
          return;
        }
      }
    });
    return score;
  };

  /* Devuelve { text, next, kind } */
  var answer = function (question) {
    var qn = norm(question);
    if (!qn) return { text: OUT_OF_SCOPE, next: START_IDS, kind: "scope" };

    var tokens = qn.split(" ").filter(function (w) { return STOP.indexOf(w) < 0; });
    var stems = tokens.map(stem);
    var padded = " " + qn + " ";

    if (INJECTION.test(qn)) {
      return { text: OUT_OF_SCOPE, next: START_IDS, kind: "scope" };
    }

    var ranked = TOPICS.map(function (t) {
      var s = scoreTopic(t, padded, stems);
      return { topic: t, score: s, rank: s + t.pri * 0.25 };
    }).filter(function (r) { return r.score >= 2; })
      .sort(function (a, b) { return b.rank - a.rank; });

    if (!ranked.length) {
      if (tokens.length <= 2 && tokens.some(function (w) { return GREET_WORDS.indexOf(w) >= 0; })) {
        return { text: GREETING, next: START_IDS, kind: "greet" };
      }
      if (tokens.length <= 3 && tokens.some(function (w) { return THANK_WORDS.indexOf(w) >= 0; })) {
        return { text: THANKS, next: START_IDS, kind: "thanks" };
      }
      return {
        text: "No he encontrado eso en el CV de Iván ni en esta web, y solo puedo responder con lo que consta ahí.\n\n" +
          "Puedes preguntarme por su formación, experiencia laboral, habilidades, proyectos, idiomas o cómo contactarle.",
        next: START_IDS,
        kind: "scope"
      };
    }

    var top = ranked[0];
    var parts = [top.topic.a];
    var second = ranked[1];

    if (second &&
        second.score >= 2 &&
        second.score >= top.score * 0.7 &&
        !(second.topic.general && !top.topic.general) &&
        !top.topic.nodata && !second.topic.nodata) {
      parts.push(second.topic.a);
    }

    return { text: parts.join("\n\n"), next: top.topic.next || START_IDS, kind: "topic", id: top.topic.id };
  };

  /* Para pruebas automáticas */
  if (window.__CV_TEST__) {
    window.__cvChat = { answer: answer, topics: TOPICS, startIds: START_IDS };
  }

  /* ----------------------------------------------------------
     3 · Interfaz del pop-up
     ---------------------------------------------------------- */
  var fabEl = document.getElementById("chat-fab");
  var chatEl = document.getElementById("chat");
  var closeEl = document.getElementById("chat-close");
  var resetEl = document.getElementById("chat-reset");
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  var chatSend = document.getElementById("chat-send");
  var chatLog = document.getElementById("chat-log");
  var assistant = document.getElementById("assistant");

  if (!(fabEl && chatEl && chatLog && chatForm && chatInput && assistant)) return;

  var scrollLog = function () {
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  /* Texto con **negrita** y viñetas "• " sin usar innerHTML */
  var inline = function (el, text) {
    text.split(/(\*\*[^*]+\*\*)/).forEach(function (chunk) {
      if (!chunk) return;
      if (/^\*\*[^*]+\*\*$/.test(chunk)) {
        var b = document.createElement("strong");
        b.textContent = chunk.slice(2, -2);
        el.appendChild(b);
      } else {
        el.appendChild(document.createTextNode(chunk));
      }
    });
  };

  var richInto = function (el, text) {
    var list = null;
    text.split("\n").forEach(function (line) {
      if (!line.trim()) { list = null; return; }
      if (/^•\s/.test(line)) {
        if (!list) {
          list = document.createElement("ul");
          el.appendChild(list);
        }
        var li = document.createElement("li");
        inline(li, line.replace(/^•\s/, ""));
        list.appendChild(li);
      } else {
        list = null;
        var p = document.createElement("div");
        p.className = "msg-p";
        inline(p, line);
        el.appendChild(p);
      }
    });
  };

  var clearSuggest = function () {
    var old = chatLog.querySelectorAll(".chat-suggest");
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
  };

  var addMessage = function (text, who) {
    var bubble = document.createElement("div");
    bubble.className = "msg " + (who === "user" ? "msg-user" : "msg-bot");
    if (who === "user") bubble.textContent = text;
    else richInto(bubble, text);
    chatLog.appendChild(bubble);
    scrollLog();
    return bubble;
  };

  var addSuggest = function (ids) {
    clearSuggest();
    var box = document.createElement("div");
    box.className = "chat-suggest";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Preguntas sugeridas");
    ids.forEach(function (id) {
      var t = BY_ID[id];
      if (!t) return;
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = t.q;
      box.appendChild(chip);
    });
    if (box.childNodes.length) {
      chatLog.appendChild(box);
      scrollLog();
    }
  };

  var showTyping = function () {
    var typing = document.createElement("p");
    typing.className = "msg msg-bot msg-typing";
    typing.setAttribute("aria-hidden", "true");
    typing.innerHTML = "<i></i><i></i><i></i>";
    chatLog.appendChild(typing);
    scrollLog();
    return typing;
  };

  var busy = false;

  var send = function (text) {
    var clean = (text || "").trim().slice(0, 160);
    if (!clean || busy) return;

    clearSuggest();
    addMessage(clean, "user");

    var result = answer(clean);
    var typing = showTyping();
    var wait = reduceMotion ? 120 : Math.min(1100, 380 + result.text.length * 1.6);
    busy = true;

    window.setTimeout(function () {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      addMessage(result.text, "bot");
      addSuggest(result.next);
      busy = false;
    }, wait);
  };

  var greet = function () {
    window.setTimeout(function () {
      addMessage(GREETING, "bot");
      addSuggest(START_IDS);
    }, reduceMotion ? 80 : 300);
  };

  var greeted = false;

  var openChat = function () {
    chatEl.hidden = false;
    assistant.classList.add("is-open");
    fabEl.setAttribute("aria-expanded", "true");
    chatInput.focus();

    if (!greeted) {
      greeted = true;
      greet();
    } else {
      scrollLog();
    }
  };

  var closeChat = function () {
    chatEl.hidden = true;
    assistant.classList.remove("is-open");
    fabEl.setAttribute("aria-expanded", "false");
    fabEl.focus();
  };

  var resetChat = function () {
    chatLog.textContent = "";
    busy = false;
    greet();
    chatInput.focus();
  };

  fabEl.addEventListener("click", function () {
    if (chatEl.hidden) openChat();
    else closeChat();
  });

  closeEl.addEventListener("click", closeChat);
  if (resetEl) resetEl.addEventListener("click", resetChat);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !chatEl.hidden) closeChat();
  });

  /* Botón de enviar solo activo si hay texto */
  var syncSend = function () {
    if (chatSend) chatSend.disabled = !chatInput.value.trim();
  };
  chatInput.addEventListener("input", syncSend);
  syncSend();

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    send(chatInput.value);
    chatInput.value = "";
    syncSend();
    chatInput.focus();
  });

  /* Las sugerencias viven dentro del registro de mensajes */
  chatLog.addEventListener("click", function (event) {
    var chip = event.target.closest(".chip");
    if (!chip) return;
    send(chip.textContent);
    chatInput.focus();
  });
})();
