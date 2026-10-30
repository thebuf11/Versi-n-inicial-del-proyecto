/* ============================================================
   Portfolio personal · Neumorfismo · interacciones
   ============================================================ */

(function () {
  "use strict";

  var systemReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionOn = document.documentElement.classList.contains("motion-on");
  var reduceMotion = systemReduce && !motionOn;

  /* ----------------------------------------------------------
     1 · Botón «Activar animaciones» (solo con movimiento reducido)
     ---------------------------------------------------------- */
  if (systemReduce) {
    var motionBtn = document.createElement("button");
    motionBtn.type = "button";
    motionBtn.className = "motion-toggle";
    motionBtn.textContent = motionOn ? "Desactivar animaciones" : "Activar animaciones";
    motionBtn.setAttribute("aria-pressed", motionOn ? "true" : "false");
    motionBtn.addEventListener("click", function () {
      try {
        if (motionOn) localStorage.removeItem("motion");
        else localStorage.setItem("motion", "on");
      } catch (e) {}
      // Los efectos se preparan al cargar, así que se recarga la página
      if (motionOn) document.documentElement.classList.remove("motion-on");
      else document.documentElement.classList.add("motion-on");
      window.location.reload();
    });
    document.body.appendChild(motionBtn);
  }

  /* ----------------------------------------------------------
     2 · Aparición de bloques al hacer scroll
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
     3 · Marcar el enlace de la sección visible en la navegación
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
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + id
            );
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
     4 · Formulario de contacto: envío con animación de carta
     ---------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var overlay = document.getElementById("send-overlay");
  var statusEl = document.getElementById("form-status");
  var MAIL = "isasan@eeartesanos.com";

  if (form && overlay) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var nombre = (data.get("nombre") || "").toString().trim();
      var correo = (data.get("correo") || "").toString().trim();
      var mensaje = (data.get("mensaje") || "").toString().trim();

      var errors = {
        nombre: nombre ? "" : "Escribe tu nombre.",
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
          ? ""
          : "Escribe un correo válido.",
        mensaje: mensaje ? "" : "Escribe tu mensaje."
      };
      var firstInvalid = null;

      Object.keys(errors).forEach(function (name) {
        var input = form.elements[name];
        var box = document.getElementById(name + "-error");
        if (!input) return;
        input.setAttribute("aria-invalid", errors[name] ? "true" : "false");
        if (box) box.textContent = errors[name];
        if (errors[name] && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        if (statusEl) statusEl.textContent = "Revisa los campos marcados.";
        firstInvalid.focus();
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
            "Si no se ha abierto tu aplicación de correo, escribe a " + MAIL + ".";
        }
      }, closeDelay);
    });
  }

  /* ----------------------------------------------------------
     5 · Año actual en el pie
     ---------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* El asistente del CV vive en chat.js */

  /* ----------------------------------------------------------
     7 · Barra de progreso de lectura
     ---------------------------------------------------------- */
  var progressEl = document.getElementById("progress-bar");
  var pillEl = document.getElementById("progress-pill");

  if (progressEl) {
    var updateProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      var clamped = Math.min(1, Math.max(0, pct));
      progressEl.style.transform = "scaleX(" + clamped.toFixed(4) + ")";
      if (pillEl) {
        var n = Math.round(clamped * 100);
        pillEl.textContent = n >= 98 ? "¡Fin!" : n + "%";
        pillEl.classList.toggle("show", n > 3);
        pillEl.classList.toggle("is-end", n >= 98);
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ----------------------------------------------------------
     8 · Pausar el cintillo de habilidades
     ---------------------------------------------------------- */
  var tickerBtn = document.getElementById("ticker-toggle");
  var tickerSection = document.querySelector(".ticker-section");

  if (tickerBtn && tickerSection) {
    tickerBtn.addEventListener("click", function () {
      var paused = tickerSection.classList.toggle("is-paused");
      tickerBtn.textContent = paused ? "Reanudar" : "Pausar";
    });
  }

  /* ----------------------------------------------------------
     10 · Contadores de las cifras al entrar en pantalla
     ---------------------------------------------------------- */
  var statNums = document.querySelectorAll(".stat strong");

  if (statNums.length && "IntersectionObserver" in window && !reduceMotion) {
    var countUp = function (el) {
      var m = /^(\D*)(\d+)(\D*)$/.exec(el.dataset.final);
      if (!m) return;
      var target = parseInt(m[2], 10);
      var start = null;
      var step = function (now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / 1400);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = m[1] + Math.round(target * eased) + m[3];
        if (t < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countObserver.unobserve(entry.target);
          countUp(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    statNums.forEach(function (el) {
      el.dataset.final = el.textContent.trim();
      // El lector de pantalla lee la cifra final, no la animación
      var label = document.createElement("span");
      label.className = "sr-only";
      label.textContent = el.dataset.final;
      el.parentNode.insertBefore(label, el);
      el.setAttribute("aria-hidden", "true");
      el.textContent = el.dataset.final.replace(/\d+/, "0");
      countObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------
     12 · Copiar el correo al portapapeles
     ---------------------------------------------------------- */
  var copyBtn = document.getElementById("mail-copy");
  var copyLabel = document.getElementById("mail-copy-label");

  if (copyBtn && copyLabel) {
    var copyTimer = null;

    var showCopied = function (ok) {
      copyLabel.textContent = ok ? "Copiado" : "No se pudo copiar";
      copyBtn.classList.toggle("is-copied", ok);
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(function () {
        copyLabel.textContent = "Copiar correo";
        copyBtn.classList.remove("is-copied");
      }, 2200);
    };

    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.dataset.mail;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(
          function () { showCopied(true); },
          function () { showCopied(false); }
        );
        return;
      }

      // Alternativa para páginas abiertas como archivo o sin HTTPS
      var tmp = document.createElement("textarea");
      tmp.value = mail;
      tmp.setAttribute("readonly", "");
      tmp.style.position = "fixed";
      tmp.style.opacity = "0";
      document.body.appendChild(tmp);
      tmp.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(tmp);
      showCopied(ok);
    });
  }

  /* ----------------------------------------------------------
     13 · Onda al pulsar botones (también en táctil)
     ---------------------------------------------------------- */
  var RIPPLE_SEL = ".btn, .mail-card, .social-btn, .mail-copy, .chip, .chat-send, .nav-github";

  if (!reduceMotion) {
    document.addEventListener("pointerdown", function (event) {
      var host = event.target.closest && event.target.closest(RIPPLE_SEL);
      if (!host) return;
      var rect = host.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var wave = document.createElement("span");
      wave.className = "ripple";
      wave.style.width = wave.style.height = size + "px";
      wave.style.left = event.clientX - rect.left - size / 2 + "px";
      wave.style.top = event.clientY - rect.top - size / 2 + "px";
      host.appendChild(wave);
      wave.addEventListener("animationend", function () {
        if (wave.parentNode) wave.parentNode.removeChild(wave);
      });
    });
  }

  /* ----------------------------------------------------------
     14 · Efectos del puntero: resplandor, estela, explosión,
          botones magnéticos y foco de luz (solo ratón)
     ---------------------------------------------------------- */
  var initPointerFx = function () {
    var FX_SEL = ".btn, .mail-card, .social-btn, .mail-copy, .chip, .nav-github, " +
      ".chat-send";
    var MAG_SEL = ".btn, .mail-card, .social-btn, .mail-copy, .nav-github, .chat-fab, .chat-send";
    var HOT_SEL = "a, button, input, textarea, .fx";

    document.querySelectorAll(FX_SEL).forEach(function (el) {
      el.classList.add("fx");
    });

    /* --- Resplandor que persigue al cursor --- */
    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    var gx = -400, gy = -400, gtx = -400, gty = -400, glowOn = false;
    var glowTick = function () {
      gx += (gtx - gx) * 0.14;
      gy += (gty - gy) * 0.14;
      glow.style.transform = "translate3d(" + (gx - 160) + "px," + (gy - 160) + "px,0)";
      if (Math.abs(gtx - gx) > 0.4 || Math.abs(gty - gy) > 0.4) {
        window.requestAnimationFrame(glowTick);
      } else {
        glowOn = false;
      }
    };

    /* --- Estela y explosión de partículas --- */
    var canvas = document.createElement("canvas");
    canvas.className = "fx-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = 0, ch = 0;

    var resizeCanvas = function () {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    var COLORS = ["#ff7a1a", "#ff9a4d", "#c2410c", "#ffd0a6"];
    var parts = [];
    var running = false;
    var lastT = 0;

    var frame = function (now) {
      var dt = Math.min(40, now - lastT);
      lastT = now;
      ctx.clearRect(0, 0, cw, ch);

      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life += dt;
        if (p.life >= p.max) {
          parts.splice(i, 1);
          continue;
        }
        var t = p.life / p.max;
        p.x += (p.vx * dt) / 16;
        p.y += (p.vy * dt) / 16;
        p.vy += (0.03 * dt) / 16;
        ctx.globalAlpha = (1 - t) * p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (parts.length) {
        window.requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    var spawn = function (x, y, speed, count, size, alpha) {
      for (var i = 0; i < count && parts.length < 240; i++) {
        parts.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed - speed * 0.15,
          life: 0,
          max: 300 + Math.random() * 300,
          a: alpha,
          r: size * (0.6 + Math.random() * 0.8),
          c: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
      if (!running) {
        running = true;
        lastT = performance.now();
        window.requestAnimationFrame(frame);
      }
    };

    /* --- Botones magnéticos (propiedad translate, sin chocar con transform) --- */
    var mags = new Set();
    var magRunning = false;

    var magLoop = function () {
      var active = false;
      mags.forEach(function (el) {
        el._cx += (el._tx - el._cx) * 0.2;
        el._cy += (el._ty - el._cy) * 0.2;
        var settled = Math.abs(el._tx - el._cx) < 0.05 && Math.abs(el._ty - el._cy) < 0.05;
        if (settled && el._tx === 0 && el._ty === 0) {
          el.style.translate = "";
          mags.delete(el);
        } else {
          el.style.translate = el._cx.toFixed(2) + "px " + el._cy.toFixed(2) + "px";
          active = true;
        }
      });
      if (active) {
        window.requestAnimationFrame(magLoop);
      } else {
        magRunning = false;
      }
    };

    var pull = function (el, tx, ty) {
      if (el._cx === undefined) { el._cx = 0; el._cy = 0; }
      el._tx = tx;
      el._ty = ty;
      mags.add(el);
      if (!magRunning) {
        magRunning = true;
        window.requestAnimationFrame(magLoop);
      }
    };

    /* --- Eventos --- */
    var lastX = -100, lastY = -100;

    document.addEventListener("pointermove", function (event) {
      var x = event.clientX, y = event.clientY;

      gtx = x;
      gty = y;
      if (!glowOn) {
        glowOn = true;
        window.requestAnimationFrame(glowTick);
      }
      glow.style.opacity = "1";

      var dx = x - lastX, dy = y - lastY;
      if (dx * dx + dy * dy > 324) {
        spawn(x, y, 0.6, 1, 1.8, 0.4);
        lastX = x;
        lastY = y;
      }

      var target = event.target;
      if (!target.closest) return;

      glow.classList.toggle("is-hot", !!target.closest(HOT_SEL));

      var fxEl = target.closest(".fx");
      if (fxEl) {
        var r = fxEl.getBoundingClientRect();
        fxEl.style.setProperty("--mx", x - r.left + "px");
        fxEl.style.setProperty("--my", y - r.top + "px");
      }

      var magEl = target.closest(MAG_SEL);
      if (magEl) {
        var mr = magEl.getBoundingClientRect();
        pull(
          magEl,
          (x - (mr.left + mr.width / 2)) * 0.18,
          (y - (mr.top + mr.height / 2)) * 0.28
        );
      }
    }, { passive: true });

    document.addEventListener("pointerout", function (event) {
      var magEl = event.target.closest && event.target.closest(MAG_SEL);
      if (magEl && !magEl.contains(event.relatedTarget)) pull(magEl, 0, 0);
    });

    document.addEventListener("pointerdown", function (event) {
      spawn(event.clientX, event.clientY, 5, 8, 2.2, 0.55);
    });

    document.documentElement.addEventListener("mouseleave", function () {
      glow.style.opacity = "0";
    });
  };

  /* Algunos PC con ratón se anuncian como táctiles (tabletas gráficas,
     monitores táctiles…), así que si (pointer: fine) falla se espera
     al primer movimiento real de un ratón */
  if (!reduceMotion) {
    if (window.matchMedia("(pointer: fine)").matches) {
      initPointerFx();
    } else {
      var onFirstMouse = function (event) {
        if (event.pointerType !== "mouse") return;
        document.removeEventListener("pointermove", onFirstMouse);
        initPointerFx();
      };
      document.addEventListener("pointermove", onFirstMouse, { passive: true });
    }
  }

  /* ----------------------------------------------------------
     9 · Esqueleto de carga: se retira cuando la página está lista
     ---------------------------------------------------------- */
  var skeleton = document.getElementById("skeleton");
  if (skeleton) {
    var hideSkeleton = function () {
      skeleton.classList.add("is-done");
      window.setTimeout(function () { skeleton.remove(); }, 500);
    };
    if (document.readyState === "complete") {
      window.setTimeout(hideSkeleton, 250);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(hideSkeleton, 250);
      });
      window.setTimeout(hideSkeleton, 3000); // red lenta: no bloquear la página
    }
  }

  /* ----------------------------------------------------------
     11 · Sombra en la barra al hacer scroll
     ---------------------------------------------------------- */
  var onScrollNav = function () {
    document.documentElement.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();
})();
