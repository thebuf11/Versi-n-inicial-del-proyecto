# Guía de mi web, archivo por archivo

Para explicar en la defensa qué hace cada parte y por qué.

## La idea general (3 frases para empezar la defensa)
1. **`index.html`** dice **qué hay** en la página: los bloques y sus textos.
2. **`css/style.css`** dice **cómo se ve**: colores, tamaños, posiciones y animaciones.
3. **`js/script.js`** y **`js/chat.js`** dicen **qué hace** la página cuando el visitante actúa: clic, scroll, escribir.

GitHub guarda el historial y GitHub Pages lo publica. El workflow `.github/workflows/pages.yml` hace la publicación automáticamente cada vez que subo algo a `main`.

---

## 1. index.html: el esqueleto
Recorrido de arriba abajo:

1. **`<head>` (lo que no se ve):**
   - **título y descripción:** salen en Google y en la pestaña del navegador.
   - **Open Graph (`og:`):** la tarjeta que aparece al compartir el enlace por WhatsApp o LinkedIn, con `img/og-image.png`.
   - **JSON-LD:** una ficha «para máquinas» que le dice a Google quién soy (nombre, estudios, GitHub).
   - **script pequeño en línea:** se ejecuta *antes* de pintar la página.
     - Mira si desactivé las animaciones (`localStorage.motion`).
     - Mira qué tema elegí (`localStorage.theme`). Si no elegí ninguno, usa el del sistema y pone `data-theme="dark"` o `"light"` en la etiqueta `<html>`.
     - Se hace tan pronto para que no haya un destello blanco al cargar en modo oscuro.
   - **fuente Geist** de Google Fonts y **`css/style.css`**.
2. **Barra de progreso y esqueleto de carga:** la línea naranja de arriba, y unas cajas grises que se ven mientras carga la página.
3. **«Saltar al contenido»:** un enlace invisible para quien navega con teclado o lector de pantalla.
4. **`<nav>`:**
   - el logo «Iv.» y los enlaces a cada sección
   - el porcentaje leído
   - el **botón de modo oscuro** (luna/sol)
   - GitHub e Instagram
5. **`<main>`, con las secciones de la web.** Cada una es un `<section id="...">`, y ese `id` es el destino de los enlaces del menú.
   - `#inicio`: el héroe, con el nombre, la frase y dos botones.
   - El cintillo de habilidades que se desplaza, con su botón «Pausar».
   - `#sobre-mi`: texto, la **ilustración SVG** `img/tres-frentes.svg`, las cifras y la formación.
   - `#proyectos`: «Lo que he hecho».
   - `#me-gusta`: aficiones con iconos.
   - `#faq`: preguntas frecuentes.
   - `#contacto`: tarjeta de correo, botón «Copiar correo» y **formulario**.
6. **`<footer>`:** nombre y año. El año lo escribe JavaScript.
7. **Capa de envío:** la animación de la carta volando, y el **asistente** (el botón redondo «Iv.» de abajo a la derecha).
8. Al final, **`js/script.js`** y **`js/chat.js`**. Van al final para que el HTML ya exista cuando el JS lo busque.

**Cómo decirlo:** «El HTML es semántico: uso `nav`, `main`, `section`, `footer` y `h1`/`h2` en orden, y no solo `div`. Así un lector de pantalla y Google entienden la estructura».

---

## 2. css/style.css: el aspecto
Está dividido en **17 bloques numerados y comentados**, en el mismo orden que la página:
- 1 · Variables
- 2 · Base
- 3 · Navegación
- 4 · Estructura
- 5 · Héroe
- 6 · Botones
- 7 · Cintillo
- 8 · Sobre mí
- 9 · Proyectos
- 10 · Me gusta
- 11 · Contacto
- 12 · Pie
- 13 · Aparición
- 14 · Animación de envío
- 15 · Asistente
- 16 · Pantallas pequeñas
- 17 · Movimiento reducido

Lo importante:

1. **Variables (`:root`).** Todos los colores están en un sitio: `--bg` (fondo), `--ink` (texto), `--accent` (naranja)... El resto del CSS nunca escribe un color directamente: escribe `var(--ink)`.
2. **El modo oscuro aprovecha eso.** El bloque `:root[data-theme="dark"]` vuelve a definir las mismas variables con otros valores: fondo casi negro, texto crema y un naranja más claro. Como todo usa variables, cambia la web entera sin tocar nada más.
   - Hay variables especiales para el texto que va encima de un fondo de color: `--on-ink`, `--on-accent` y `--on-orange`. Sin ellas, en oscuro el texto del cintillo naranja salía crema sobre naranja y no se leía. Lighthouse lo detectó y lo arreglé.
3. **Responsive.** Las *media queries* (`@media (max-width: 760px)`...) cambian la colocación en el móvil: una columna, letra más pequeña y el menú debajo. `clamp()` hace que tamaños y márgenes crezcan poco a poco con la pantalla.
4. **Animaciones.** Los `@keyframes` definen movimientos: el cintillo, la carta y el brillo de los botones. Las secciones aparecen al hacer scroll porque empiezan transparentes y desplazadas, y la clase `.in-view`, que pone JS, las lleva a su sitio.
5. **Accesibilidad.** `:focus-visible` dibuja un borde visible al navegar con teclado. El bloque 17 respeta a quien pide menos movimiento en su sistema.

---

## 3. js/script.js: la interacción
Todo va dentro de `(function () { ... })();`. Es una función que se ejecuta sola, para que mis variables no choquen con las de otros scripts. Las secciones están numeradas:

| Nº | Qué hace | Cómo funciona (en mis palabras) |
|---|---|---|
| 1 | Botón de animaciones | Solo aparece si el sistema pide «movimiento reducido». Guarda la elección y recarga la página. |
| 2 | Aparición al hacer scroll | Un **IntersectionObserver** «vigila» los bloques. Cuando uno entra en pantalla, le pone la clase `in-view` y el CSS hace la animación. |
| 3 | Menú activo | Otro observer mira qué sección está en el centro de la pantalla y subraya su enlace en el menú. |
| 4 | **Formulario** | Explicado abajo, es lo más importante. |
| 5 | Año del pie | `new Date().getFullYear()`, así nunca se queda desactualizado. |
| 7 | Barra de progreso | Cuánto he bajado ÷ cuánto se puede bajar = porcentaje. Estira la barra con `scaleX` y escribe el % (o «¡Fin!»). |
| 8 | Pausar cintillo | El botón añade o quita la clase `is-paused` y el CSS para la animación. |
| 10 | Contadores | Cuando las cifras (+30K, 380 h) entran en pantalla, cuentan desde 0 con `requestAnimationFrame`. El lector de pantalla lee directamente la cifra final. |
| 12 | Copiar correo | Usa `navigator.clipboard`. Si no se puede (sin HTTPS), crea un cuadro de texto oculto, lo selecciona y lo copia. |
| 13 | Onda al pulsar | Crea un círculo `span.ripple` donde pulsas, el CSS lo agranda y se borra al acabar. |
| 14 | Efectos del ratón | Resplandor que sigue al cursor, partículas en un `<canvas>` y botones «magnéticos». Solo con ratón, no en el móvil. **Es lo más difícil de explicar. Si no lo dominas, conviene quitarlo.** |
| 9 | Esqueleto de carga | Cuando la página termina de cargar, quita las cajas grises (como máximo a los 3 s). |
| 11 | Sombra de la barra | Si he bajado más de 8 px, añade la clase `scrolled` y el menú gana sombra. |
| 15 | **Modo oscuro** | El botón lee el tema actual de `<html data-theme>`, lo cambia, lo guarda en `localStorage` y actualiza `aria-pressed` y el título. Al volver otro día, el script del `<head>` lo lee y lo aplica. |

### El recorrido del dato del formulario (te lo preguntarán seguro)
1. El visitante pulsa «Enviar». JS **frena el envío normal** (`event.preventDefault()`).
2. **Valida:** nombre no vacío, correo con forma `algo@algo.algo` (una expresión regular) y mensaje no vacío. Si algo falla, escribe el error bajo el campo, lo marca con `aria-invalid` y pone el foco ahí.
3. **Campo trampa (`_honey`):** está oculto. Una persona no lo ve, un bot lo rellena. Si viene relleno, no se envía nada.
4. Enseña la **animación de la carta** y desactiva el botón para que no se envíe dos veces.
5. **`fetch`** manda los datos en JSON a `https://formsubmit.co/ajax/isasan@eeartesanos.com`.
6. **FormSubmit** (un servicio gratuito) me reenvía el mensaje por correo.
7. Si responde `success: true`: «¡Mensaje enviado!» y se vacía el formulario. Si no: un mensaje de error con mi correo como alternativa.
8. Sin JavaScript también funciona: el `<form action="https://formsubmit.co/...">` hace el mismo envío de forma normal.

**Por qué no `mailto:`:** depende de que el visitante tenga un programa de correo configurado. En muchos equipos no pasa nada al pulsarlo, y un botón que no hace nada es suspenso directo.

---

## 4. js/chat.js: el asistente del CV
**Idea clave:** no es una IA. Es un **buscador de palabras clave** sobre una lista de temas que escribí yo. Por eso no inventa nada y no necesita ninguna clave secreta.

1. **Temas (`TOPICS`).** Cada tema tiene:
   - `q`: la pregunta que sale en los botones
   - `kw`: las palabras que lo activan
   - `a`: la respuesta
   - `pri`: la prioridad
   - `next`: qué preguntas sugerir después

   Por ejemplo, el tema «marketing» se activa con «facebook», «campañas», «reels»...
2. **Normalizar (`norm`).** Pasa la pregunta a minúsculas, quita tildes y quita signos. Así «Informática» y «informatica» son lo mismo.
3. **Raíz de la palabra (`stem`).** Le quita la «s» o la «es» final: «deportes» y «deporte» quedan iguales.
4. **Puntuar (`scoreTopic`).** Por cada tema cuenta cuántas palabras clave aparecen. Una frase exacta suma 3, una palabra suma 2 y una palabra parecida suma 1. Gana el tema con más puntos. Si el segundo está casi empatado, añade también su respuesta.
5. **Casos especiales:**
   - si saludas, responde con un saludo
   - si das las gracias, contesta «de nada»
   - si intentas «ignora tus instrucciones» (manipularlo), no entra al trapo
   - si no encuentra nada, dice que eso no está en el CV, en vez de inventarlo
6. **Interfaz.** Abre y cierra la ventana, pinta los mensajes y las sugerencias, y escribe el texto **sin `innerHTML`**, para que nadie pueda colar código en el chat.

**Por qué sin API:** una web en GitHub Pages es pública. Si pongo una clave de API en el JS, cualquiera la ve con F12 y la puede gastar.

---

## 5. Archivos de apoyo
- **`img/`:**
  - `favicon.svg`: el icono de la pestaña, un logo hecho en SVG, es decir, en código: figuras y texto, no píxeles.
  - `tres-frentes.svg`: mis tres áreas como tres círculos que se cruzan, con «yo» en el centro.
  - `og-image.png`: la imagen al compartir el enlace.
- **`robots.txt` / `sitemap.xml`:** le dicen a Google qué puede leer y dónde está la página.
- **`llms.txt`:** un resumen para asistentes de IA tipo ChatGPT.
- **`.github/workflows/pages.yml`:** la «receta» que GitHub ejecuta en cada push a `main`. Descarga el repo, copia solo los archivos de la web en `_site/` y los publica.
- **`.gitignore`:** lo que Git no debe subir (herramientas locales, copias, informes).
- **`README.md`, `notas.txt`, `docs/prompts.md`:** cómo está hecha la web, mi ficha de contenidos y las órdenes que le di a la IA.

## 6. La historia en Git (para «cuéntame tus commits»)
1. **Versión inicial:** primer commit, luego el chat.
2. **Reposicionamiento:** marketing, administración e informática.
3. **Arreglos para móvil y caché:** scroll lateral y versiones `?v=` para que el navegador no use archivos viejos.
4. **Accesibilidad de animaciones:** respetar la preferencia de movimiento reducido del sistema y el botón para activar o desactivar las animaciones.
5. **Contacto real con FormSubmit.**
6. **Limpieza y carpetas.**
7. **Modo oscuro:** en su propia rama y fusionado con `merge`.
8. **SVG propios.**
9. **Documentación:** README, notas y prompts.
10. **Cambio de URL a `mi-web`.**
11. **Arreglo de contraste detectado con Lighthouse.**

