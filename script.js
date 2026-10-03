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
})();
