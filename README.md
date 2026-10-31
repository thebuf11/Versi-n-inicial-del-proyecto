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
├── css/style.css     estilo: variables de color (claro y oscuro), secciones numeradas y comentadas
├── js/script.js      interacción: modo oscuro, formulario, animaciones, contadores…
├── js/chat.js        asistente del CV (responde preguntas sobre mí)
├── img/              favicon.svg, tres-frentes.svg (ilustración propia), og-image.png
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
- **Formulario de contacto** con validación, mensaje de éxito o error y envío real al correo.
- **Asistente del CV**: un chat que responde preguntas sobre mi formación y experiencia.
- Menú adaptado al móvil, barra de progreso de lectura, contadores animados y copiar el correo con un clic.

## Decisiones de arquitectura

### 1. Formulario con FormSubmit en lugar de `mailto:`

**Problema:** un enlace `mailto:` depende de que el visitante tenga un programa de
correo configurado; en muchos móviles y ordenadores de clase no pasa nada al pulsarlo,
y la rúbrica considera un botón muerto como suspenso.

**Decisión:** el formulario envía los datos con `fetch` a FormSubmit, que me los
reenvía por correo. Sin JavaScript, el `action` del formulario hace el mismo envío.
Un campo trampa oculto (`_honey`) frena a los bots.

**Coste:** depende de un servicio externo gratuito, y el primer envío obliga a
confirmar un correo de activación.

**Recorrido del dato:** el visitante escribe → `js/script.js` valida los campos →
`fetch` POST a `formsubmit.co/ajax/…` → FormSubmit me envía el correo → la web
muestra «mensaje enviado» o el error.

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
en `main`. Las versiones importantes llevan etiqueta (`v2.0`, `v3.0`).
