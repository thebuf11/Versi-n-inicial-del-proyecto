/* ============================================================
   Portfolio personal · Liquid Glass · interacciones
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1 · Brillo que sigue al puntero sobre cada superficie de cristal
     ---------------------------------------------------------- */
  function trackGlow(event) {
    var el = event.currentTarget;
    var rect = el.getBoundingClientRect();
    var x = ((event.clientX - rect.left) / rect.width) * 100;
    var y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", x.toFixed(2) + "%");
    el.style.setProperty("--my", y.toFixed(2) + "%");
  }

  document.querySelectorAll(".glass").forEach(function (el) {
    el.addEventListener("pointermove", trackGlow);
  });

  /* ----------------------------------------------------------
     2 · Inclinación 3D de la tarjeta hero (solo escritorio)
     ---------------------------------------------------------- */
  var heroCard = document.querySelector("[data-tilt]");

  if (heroCard && !reduceMotion) {
    var isFine = window.matchMedia("(pointer: fine)").matches;

    if (isFine) {
      heroCard.addEventListener("pointermove", function (event) {
        var rect = heroCard.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        var rotateY = px * 7;   // grados máximos
        var rotateX = -py * 7;
        heroCard.style.transform =
          "perspective(1000px) rotateX(" +
          rotateX.toFixed(2) +
          "deg) rotateY(" +
          rotateY.toFixed(2) +
          "deg)";
      });

      heroCard.addEventListener("pointerleave", function () {
        heroCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });
    }
  }

  /* ----------------------------------------------------------
     3 · Aparición de bloques al hacer scroll
     ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     4 · Marcar el enlace de la sección visible en la navegación
     ---------------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + id;
            link.style.background = active ? "rgba(255,255,255,0.75)" : "";
            link.style.color = active ? "#0f172a" : "";
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ----------------------------------------------------------
     5 · Formulario de contacto: envío con animación de carta
     ---------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var overlay = document.getElementById("send-overlay");
  var statusEl = document.getElementById("form-status");
  var MAIL = "ivasaesan@alu.edu.gva.es";

  if (form && overlay) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var nombre = (data.get("nombre") || "").toString().trim();
      var correo = (data.get("correo") || "").toString().trim();
      var mensaje = (data.get("mensaje") || "").toString().trim();

      if (!nombre || !correo || !mensaje) {
        if (statusEl) {
          statusEl.textContent = "Completa todos los campos para poder responderte.";
        }
        return;
      }

      if (statusEl) statusEl.textContent = "Enviando…";
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");

      var subject = encodeURIComponent("Mensaje desde tu web — " + nombre);
      var body = encodeURIComponent(
        mensaje + "\n\n— " + nombre + "\nRespuesta a: " + correo
      );

      var mailDelay = reduceMotion ? 400 : 1900;
      var closeDelay = reduceMotion ? 1600 : 3400;

      window.setTimeout(function () {
        window.location.href =
          "mailto:" + MAIL + "?subject=" + subject + "&body=" + body;
      }, mailDelay);

      window.setTimeout(function () {
        overlay.classList.remove("show");
        overlay.setAttribute("aria-hidden", "true");
        form.reset();
        if (statusEl) {
          statusEl.textContent =
            "Se ha abierto tu aplicación de correo para terminar el envío.";
        }
      }, closeDelay);
    });
  }

  /* ----------------------------------------------------------
     6 · Año actual en el pie
     ---------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------
     7 · Asistente virtual: "mi versión IA" entrenada con el CV
     ---------------------------------------------------------- */
  var fabEl = document.getElementById("chat-fab");
  var chatEl = document.getElementById("chat");
  var closeEl = document.getElementById("chat-close");
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  var chatLog = document.getElementById("chat-log");
  var chipsBox = document.getElementById("chat-chips");
  var assistant = document.getElementById("assistant");

  if (fabEl && chatEl && chatLog && chatForm && chatInput) {

    /* --- Base de conocimiento: datos extraídos del CV --- */
    var KB = [
      {
        id: "saludo",
        kw: ["hola", "buenas", "buenos dias", "buenas tardes", "que tal", "hey", "saludos"],
        a: "¡Hola! Soy la versión IA de Iván ✦\n\nEstoy entrenado con su CV, así que pregúntame por su formación, experiencia, habilidades técnicas, proyectos o disponibilidad.\n\nEjemplo: «¿Qué experiencia tienes con marketing?»"
      },
      {
        id: "marketing",
        kw: ["marketing", "campana", "campanas", "publicidad", "publicitarias", "facebook", "instagram", "google ads", "meta ads", "redes sociales", "contenido", "contenidos", "video", "videos", "edicion", "diseno grafico", "reels", "community"],
        a: "Sí, tengo experiencia directa: 2 años en CUIDAMA SL (2022–2024) como Especialista en Marketing Digital y Comunicación Visual.\n\n• Campañas en Facebook e Instagram Ads: +30K visualizaciones al mes\n• Contenido visual: fotos, vídeos y reels\n• Estrategia en redes sociales y análisis de métricas\n• Edición con Canva, CapCut y Premiere Pro\n• Google Ads recogido en mis habilidades"
      },
      {
        id: "logistica",
        kw: ["logistica", "logístico", "stock", "almacen", "carretilla", "pedidos", "pedido", "inventario", "sap", "envasado", "comanda", "cadena de suministro", "transporte"],
        a: "La logística es donde más años acumulo:\n\n• FLORES EL CALE (2021–2022): envasado, carga/descarga y control de stock; optimicé el almacén reduciendo errores\n• FAMILYCASH (2020–2021): preparación de comandas para más de 15 tiendas, carretilla elevadora y sistemas de inventario\n• BENESOL (2019–2020): control de calidad, etiquetado, pedidos y coordinación interdepartamental\n\nAdemás: SAP básico y control de stock."
      },
      {
        id: "informatica",
        kw: ["informatico", "informatica", "soporte", "hardware", "redes", "microinformaticos", "sistemas microinformaticos", "tecnico", "tecnicos", "ordenador", "software", "reparacion", "asistencia tecnica"],
        a: "Sí. Soy Técnico en Sistemas Microinformáticos y Redes (Grado Medio, Colegio Esclaves de María de Valencia) con 380 horas de formación práctica en el Ajuntament de l'Alcúdia de Crespins (2018).\n\nEn el CV recogo el soporte informático en hardware, redes y software, y en ANGRUP SL (2024) hice mantenimiento de centro deportivo."
      },
      {
        id: "herramientas",
        kw: ["herramientas", "herramienta", "programas", "aplicaciones", "software", "utilizas", "manejas", "sabes usar", "ofimatica"],
        a: "Herramientas que manejo:\n\n• Marketing: Facebook Ads, Google Ads, Canva, CapCut, Premiere Pro\n• Gestión: SAP (básico) y sistemas de gestión de inventario\n• Soporte: hardware, redes y software\n• Producción: control de stock, etiquetado y preparación de pedidos"
      },
      {
        id: "proyectos",
        kw: ["proyectos", "proyecto", "portfolio", "portafolio", "logros", "has hecho", "realizado", "acabado", "obras"],
        a: "Proyectos y logros concretos:\n\n• Campañas con más de 30K visualizaciones al mes en Facebook/Instagram Ads (CUIDAMA)\n• Optimización del almacén con reducción de errores (FLORES EL CALE)\n• Preparación de pedidos para más de 15 tiendas (FAMILYCASH)\n• Esta misma web: HTML, CSS y JavaScript\n\nEl detalle está en la sección «Lo que he hecho»."
      },
      {
        id: "ventas",
        kw: ["ventas", "venta", "comercio", "comerciales", "atencion al cliente", "clientes", "tienda", "trabajo comercial"],
        a: "Tengo el Grado Superior en Gestión de Ventas y Espacios Comerciales (Colegio Artesanos de Valencia).\n\nEn cuanto a experiencia relacionada: preparaba comandas para más de 15 tiendas en FAMILYCASH, atendía y mantenía un centro deportivo en ANGRUP SL, y la atención al cliente figura entre mis habilidades."
      },
      {
        id: "idiomas",
        kw: ["idiomas", "idioma", "ingles", "valenciano", "catalan", "castellano", "espanol", "nivel de idiomas"],
        a: "Idiomas:\n\n• Español: nativo\n• Valenciano: nativo\n• Inglés: nivel básico (A2), en proceso de mejora"
      },
      {
        id: "permisos",
        kw: ["carnet", "conducir", "carretilla", "primeros auxilios", "auxilios", "permiso", "permisos", "carnet de conducir"],
        a: "Permisos y formación complementaria:\n\n• Permiso de conducir B\n• Permiso y experiencia con carretilla elevadora\n• Formación en primeros auxilios"
      },
      {
        id: "disponibilidad",
        kw: ["disponibilidad", "disponible", "jornada", "horario", "cuando", "incorporacion", "incorporarte", "empezar", "contratar", "contrato", "empleo", "vacante", "oferta", "candidatura", "disponible para"],
        a: "En el CV no fijo una disponibilidad concreta (jornada ni fecha de incorporación), así que lo mejor es concretarlo directamente: +34 635 152 586 o ivansaezsr@gmail.com.\n\nLo que sí puedo adelantar: permiso de conducir B, experiencia con carretilla elevadora y formación en primeros auxilios."
      },
      {
        id: "contacto",
        kw: ["contacto", "contactar", "telefono", "correo", "email", "escribir", "llamar", "whatsapp", "linkedin", "donde esta"],
        a: "Puedes contactar con Iván así:\n\n• Teléfono: +34 635 152 586\n• Correo: ivansaezsr@gmail.com\n• O desde el formulario de la sección Contacto de esta web: llega directo a su correo."
      },
      {
        id: "perfil",
        kw: ["perfil", "sobre ti", "sobre mi", "quien eres", "quien", "eres", "cualidades", "fortalezas", "puntos fuertes", "autodidacta", "iniciativa", "trabajo en equipo", "softskills", "personalidad"],
        a: "Perfil resumido: profesional versátil con experiencia en marketing digital, logística y soporte técnico.\n\nDestaca por iniciativa, aprendizaje autodidacta, responsabilidad y capacidad de trabajo en equipo, combinando competencias técnicas y creativas para adaptarse a distintos entornos laborales."
      },
      {
        id: "formacion",
        kw: ["formacion", "estudios", "estudiar", "estudiado", "grado", "titulo", "titulacion", "centro", "academica", "fp", "colegio", "certificado"],
        a: "Tengo formación en dos ramas, ventas y tecnología:\n\n• Grado Superior en Gestión de Ventas y Espacios Comerciales — Colegio Artesanos de Valencia\n• Grado Medio en Sistemas Microinformáticos y Redes — Colegio Esclaves de María de Valencia\n• ESO — Colegio Salesianos de Valencia\n• Formación práctica en Sistemas Informáticos y Redes — Ajuntament de l'Alcúdia de Crespins (2018, 380 horas)"
      },
      {
        id: "experiencia",
        kw: ["experiencia", "experiencias", "trayectoria", "historial", "empleos", "puestos", "has trabajado", "trabajado", "curriculum", "cv", "empresas", "nominas"],
        a: "Mi trayectoria, de más reciente a más antigua:\n\n• ANGRUP SL (Andorra, 2024) — Administrativo y mantenimiento de centro deportivo\n• CUIDAMA SL (Valencia, 2022–2024) — Marketing Digital y Comunicación Visual\n• FLORES EL CALE SL (Valencia, 2021–2022) — Auxiliar de Producción y Logística\n• FAMILYCASH SL (Valencia, 2020–2021) — Logística y Preparación de Pedidos\n• BENESOL SL (Valencia, 2019–2020) — Operario de Almacén y Logística Interna\n\nTrabajando de forma continuada desde 2019."
      },
      {
        id: "gracias",
        kw: ["gracias", "grax", "adios", "hasta luego", "perfecto", "genial"],
        a: "¡A ti! Si quieres seguir, pregúntame por formación, experiencia, proyectos, herramientas, idiomas o disponibilidad."
      }
    ];

    var FALLBACK =
      "Esa información no está en el CV, así que no quiero inventarte una respuesta.\n\n" +
      "Sí puedo ayudarte con: formación, experiencia laboral, habilidades técnicas, " +
      "proyectos, herramientas, idiomas, disponibilidad o contacto.\n\n" +
      "Prueba con: «¿Qué experiencia tienes con marketing?»";

    var norm = function (text) {
      return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    };

    var findAnswer = function (question) {
      var q = norm(question);
      if (!q) return null;

      var best = null;
      var bestScore = 0;

      KB.forEach(function (entry) {
        var score = 0;
        entry.kw.forEach(function (word) {
          var k = norm(word);
          if (!k) return;
          if (k.indexOf(" ") >= 0) {
            if (q.indexOf(k) >= 0) score += 2;
          } else {
            var re = new RegExp("\\b" + k + "s?\\b");
            if (re.test(q)) score += 1;
          }
        });
        if (score > bestScore) {
          bestScore = score;
          best = entry;
        }
      });

      return bestScore > 0 ? best : null;
    };

    /* --- Render de mensajes --- */
    var scrollLog = function () {
      chatLog.scrollTop = chatLog.scrollHeight;
    };

    var addMessage = function (text, who) {
      var bubble = document.createElement("p");
      bubble.className = "msg " + (who === "user" ? "msg-user" : "msg-bot");
      bubble.textContent = text;
      chatLog.appendChild(bubble);
      scrollLog();
      return bubble;
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

    var reply = function (question) {
      var entry = findAnswer(question);
      var answer = entry ? entry.a : FALLBACK;
      var typing = showTyping();
      var wait = reduceMotion ? 150 : 700;

      window.setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        addMessage(answer, "bot");
      }, wait);
    };

    var send = function (text) {
      var clean = (text || "").trim();
      if (!clean) return;
      addMessage(clean, "user");
      reply(clean);
    };

    /* --- Apertura y cierre --- */
    var greeted = false;

    var openChat = function () {
      chatEl.hidden = false;
      assistant.classList.add("is-open");
      fabEl.setAttribute("aria-expanded", "true");
      chatInput.focus();

      if (!greeted) {
        greeted = true;
        window.setTimeout(function () {
          addMessage(
            "Soy la versión IA de Iván ✦ Entrenado con su CV: formación, " +
              "experiencia, habilidades, proyectos y disponibilidad.\n\n" +
              "Pregúntame lo que quieras — por ejemplo: «¿Qué experiencia " +
              "tienes con marketing?»",
            "bot"
          );
        }, reduceMotion ? 100 : 350);
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

    fabEl.addEventListener("click", function () {
      if (chatEl.hidden) openChat();
      else closeChat();
    });

    closeEl.addEventListener("click", closeChat);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !chatEl.hidden) closeChat();
    });

    /* --- Envío --- */
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      send(chatInput.value);
      chatInput.value = "";
      chatInput.focus();
    });

    /* --- Preguntas sugeridas --- */
    if (chipsBox) {
      chipsBox.addEventListener("click", function (event) {
        var chip = event.target.closest(".chip");
        if (!chip) return;
        send(chip.textContent);
        chatInput.focus();
      });
    }
  }
})();
