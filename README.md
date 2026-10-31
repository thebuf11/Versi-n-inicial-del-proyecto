# mi-web · Iván Sáez

Mi web personal de marca: quién soy, qué he hecho, qué me gusta y cómo contactarme.
Proyecto del curso de Programación con IA (1º DAM).

**Web publicada:** https://thebuf11.github.io/mi-web/

## Cómo verla en local

No necesita instalar nada: abre `index.html` en el navegador. Para probar el
formulario y el modo oscuro igual que en producción, sírvela con un servidor
estático, por ejemplo `npx http-server` desde esta carpeta.

## Estructura

```
mi-web/
├── index.html        estructura: cabecera, sobre mí, proyectos, me gusta, FAQ, contacto
├── gracias.html      página a la que vuelve el visitante tras enviar el formulario
├── css/style.css     estilo: variables de color (claro y oscuro), secciones numeradas y comentadas
├── js/script.js      interacción: modo oscuro, formulario, animaciones, contadores…
├── js/chat.js        asistente del CV (responde preguntas sobre mí)
├── img/              ivan.webp (mi foto), favicon.svg (mi logo), recorrido.svg + recorrido-movil.svg (mi línea de tiempo), og-image.png
├── docs/prompts.md   órdenes clave que le di a la IA y por qué
├── notas.txt         ficha de contenidos de la sesión 1
├── robots.txt, sitemap.xml, llms.txt   para buscadores y asistentes de IA
└── .github/workflows/pages.yml         publica la web en GitHub Pages en cada push a main
```

## Tecnologías

HTML, CSS y JavaScript puros, sin frameworks ni librerías. Fuente Geist de
Google Fonts. El formulario envía con [FormSubmit](https://formsubmit.co/).

## Funciones

- **Modo oscuro** con botón en la barra; recuerda la elección (`localStorage`) y,
  si no hay elección, sigue la preferencia del sistema.
- **Formulario de contacto** con validación, envío real al correo, respuesta
  automática al visitante y página de confirmación.
- **Asistente del CV**: un chat que responde preguntas sobre mi formación y experiencia.
- Menú adaptado al móvil, barra de progreso de lectura, contadores animados y copiar el correo con un clic.

## Decisiones de arquitectura

### 1. Formulario con FormSubmit en lugar de `mailto:`

**Problema:** un enlace `mailto:` depende de que el visitante tenga un programa de
correo configurado; en muchos móviles y ordenadores de clase no pasa nada al pulsarlo,
y la rúbrica considera un botón muerto como suspenso.

**Decisión:** el formulario se envía a FormSubmit, que me reenvía el mensaje por
correo y además **responde automáticamente al visitante** (`_autoresponse`) con
una copia de lo que escribió. Un campo trampa oculto (`_honey`) frena a los bots.

Al principio usaba `fetch` (AJAX) para no salir de la página, pero FormSubmit no
manda la respuesta automática con AJAX. Por eso el formulario se envía de forma
normal y vuelve a mi página `gracias.html` (`_next`).

**Coste:** depende de un servicio externo gratuito, el primer envío obliga a
confirmar un correo de activación y el visitante pasa un momento por la casilla
«no soy un robot» de FormSubmit.

**Recorrido del dato:** el visitante escribe → `js/script.js` valida los campos y
enseña la animación de la carta → `form.submit()` hace un POST a
`formsubmit.co/isasan@eeartesanos.com` → FormSubmit me envía el mensaje a mí y la
respuesta automática al campo `email` del visitante → redirige a `gracias.html`.

### 2. Asistente del CV basado en reglas, sin API de IA

**Problema:** quería que un visitante pudiera preguntar por mi experiencia sin leer
toda la página, pero una web estática en GitHub Pages no puede guardar una clave de
API en secreto: cualquiera la vería en el código.

**Decisión:** `js/chat.js` guarda los temas del CV como datos y busca por palabras
clave (normalizando plurales y tildes). Responde al instante, funciona sin conexión a
ningún servicio y no expone ninguna clave.

**Coste:** solo entiende preguntas sobre los temas que he escrito; no conversa libremente.

### Otras decisiones

- **Colores como variables CSS:** todo el color sale de variables en `:root`, así que
  el modo oscuro es un único bloque `[data-theme="dark"]` que las redefine.
- **El tema se aplica en el `<head>`** antes de pintar la página, para evitar un
  destello claro al cargar en modo oscuro.
- **Carpetas `css/`, `js/` e `img/`** para separar estructura, estilo e interacción.

## Historial

El historial de commits cuenta cómo ha crecido la web. Las funciones grandes se
hicieron en ramas propias (`modo-oscuro`, `reestructura-carpetas`) y se fusionaron
en `main`. Las versiones importantes llevan etiqueta (`v2.0`, `v3.0` y `v4.0`, la versión de entrega).
