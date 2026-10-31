# Guía de defensa de mi web

Para explicar en clase qué hace cada parte de mi web, por qué la hice así y qué
cumple de la rúbrica. Datos actualizados a **31 de octubre de 2026**.

---

## 0. Datos del proyecto

| Dato | Valor |
|---|---|
| Autor | Iván Sáez (1º DAM, Valencia) |
| Web publicada | https://thebuf11.github.io/mi-web/ |
| Repositorio | https://github.com/thebuf11/mi-web (público) |
| Página de gracias | https://thebuf11.github.io/mi-web/gracias.html |
| Correo de contacto | isasan@eeartesanos.com |
| Tecnologías | HTML, CSS y JavaScript puros, sin frameworks. Fuente Geist. FormSubmit para el formulario |
| Publicación | GitHub Pages, automática con `.github/workflows/pages.yml` en cada push a `main` |
| Historial | 46 commits en `main` (37 de trabajo + 9 fusiones de ramas) |
| Versiones | Etiquetas `v2.0` (30/10/2026) y `v3.0` (31/10/2026) |
| Ramas | `modo-oscuro`, `reestructura-carpetas`, `respuesta-automatica`, `foto-propia`, `linea-tiempo`, `proyectos-reales`, `texto-sobre-mi`, `perfil-completo`, `sin-logistica` (fusionadas en `main`), más `posicionamiento-marketing-admin-informatica`, `rama-del-agente-AI` y `copia-2026-10-30` de antes |

**Antes se llamaba** `Versi-n-inicial-del-proyecto`. Lo renombré a `mi-web` porque
la sesión 2 pide ese nombre. La dirección antigua de la web ya no funciona.

### Tamaño de los archivos

| Archivo | Líneas / peso | Para qué |
|---|---|---|
| `index.html` | 604 líneas | La página principal |
| `gracias.html` | 97 líneas | Página a la que vuelve el visitante tras escribirme |
| `css/style.css` | ~1.630 líneas | Todo el aspecto, claro y oscuro |
| `js/script.js` | 595 líneas | Las interacciones |
| `js/chat.js` | 522 líneas | El asistente del CV |
| `img/ivan.webp` | 10 KB (480×480) | Mi foto, optimizada desde un JPEG de 80 KB |
| `img/favicon.svg` | 0,4 KB | Mi logo «Iv.» |
| `img/og-image.png` | 23 KB | Imagen al compartir el enlace |

---

## 1. Cómo cumple la rúbrica

### Requisitos mínimos (sin esto no se evalúa)

| Requisito | Estado | Prueba |
|---|---|---|
| Carga en GitHub Pages sin errores en consola (F12) | ✅ | Comprobado en la web publicada: consola vacía |
| Contacto que funciona de verdad | ✅ | El formulario me llega a isasan@eeartesanos.com (probado) |
| Se ve bien en el móvil | ✅ | Probado con DevTools en modo dispositivo (390 px) |
| Mínimo 10 commits con mensajes que cuentan el proceso | ✅ | 46 commits |

### Los 7 criterios

| Criterio (puntos) | Qué tengo | Nivel al que apunto |
|---|---|---|
| **Contacto** (15) | Formulario validado que envía, respuesta automática al visitante (probada: llega), página de gracias. Sé explicar el recorrido del dato (apartado 5) | Excelente |
| **Contenido** (15) | Sobre mí, proyectos, habilidades (cintillo y «Lo que aporto»), experiencia (cifras), me gusta, FAQ, contacto. Los 3 proyectos van como problema → solución → resultado con una cifra real | Competente |
| **Diseño** (15) | Paleta deliberada (papel cálido, tinta y un naranja), tipografía Geist, variables CSS, responsive, modo oscuro, favicon propio, microinteracciones, 2 páginas con el mismo estilo | Competente |
| **Medios** (10) | Foto propia optimizada (WebP 10 KB, alt, carga diferida), **dos SVG propios en archivo**: el logo (`favicon.svg`) y la línea de tiempo «Mi recorrido» (`recorrido.svg`, con versión para móvil), sobre SVG en `gracias.html`, iconos SVG, animaciones CSS/JS | Competente |
| **Interactividad** (15) | Modo oscuro con memoria, formulario validado, asistente del CV, copiar correo, contadores, pausar cintillo | Competente (hay más de 2 funciones reales) |
| **Arquitectura** (15) | HTML semántico, carpetas `css/` `js/` `img/`, variables CSS, JS por secciones, title/meta/OG en cada página, foco visible, alt. Lighthouse 100 en accesibilidad. README con 2 decisiones de arquitectura | Competente, con partes de Excelente |
| **Proceso** (15) | 46 commits atómicos, ramas para lo grande, etiquetas v2.0→v3.0, órdenes a la IA en `docs/prompts.md` | Competente, con partes de Excelente |

---

## 2. La idea general (3 frases para empezar la defensa)
1. **`index.html`** dice **qué hay** en la página: los bloques y sus textos.
2. **`css/style.css`** dice **cómo se ve**: colores, tamaños, posiciones y animaciones.
3. **`js/script.js`** y **`js/chat.js`** dicen **qué hace** la página cuando el visitante actúa: clic, scroll, escribir.

GitHub guarda el historial y GitHub Pages lo publica. El workflow
`.github/workflows/pages.yml` lo hace solo cada vez que subo algo a `main`.

### Estructura de carpetas

```
mi-web/
├── index.html          página principal
├── gracias.html        página tras enviar el formulario
├── css/style.css       estilos (claro y oscuro)
├── js/script.js        interacciones
├── js/chat.js          asistente del CV
├── img/                ivan.webp, favicon.svg, og-image.png
├── docs/               guia-defensa.md (esta guía) y prompts.md
├── README.md           cómo está hecha y decisiones de arquitectura
├── notas.txt           ficha de contenidos de la sesión 1
├── robots.txt, sitemap.xml, llms.txt
└── .github/workflows/pages.yml
```

---

## 3. index.html: el esqueleto
Recorrido de arriba abajo:

1. **`<head>` (lo que no se ve):**
   - **Título y descripción:** salen en Google y en la pestaña del navegador.
   - **Open Graph (`og:`):** la tarjeta que aparece al compartir el enlace por WhatsApp o LinkedIn, con `img/og-image.png`.
   - **JSON-LD:** una ficha «para máquinas» que le dice a Google quién soy (nombre, estudios, GitHub).
   - **Favicon:** `img/favicon.svg`, mi logo.
   - **Script pequeño en línea:** se ejecuta *antes* de pintar la página.
     - Mira si desactivé las animaciones (`localStorage.motion`).
     - Mira qué tema elegí (`localStorage.theme`). Si no elegí ninguno, usa el del sistema y pone `data-theme="dark"` o `"light"` en la etiqueta `<html>`.
     - Se hace tan pronto para que no haya un destello blanco al cargar en modo oscuro.
   - **Fuente Geist** de Google Fonts y **`css/style.css`**. El `?v=20261031g` del final obliga al navegador a descargar la versión nueva y no usar una vieja guardada.
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
   - `#sobre-mi`: **mi foto** (`img/ivan.webp`), el texto (escrito por mí: quién soy, mi base en SMR, por qué vine a España a estudiar DAM y mi objetivo de especializarme en ciberseguridad), la **línea de tiempo** «Mi recorrido» (`img/recorrido.svg`), las cifras y la formación.
   - `#proyectos`: «Lo que he hecho», tres tarjetas contadas como **problema → solución → resultado**:
     1. **Campañas en redes sociales** (CUIDAMA, 2022-2024): Facebook e Instagram Ads y contenido propio → más de 30K visualizaciones al mes.
     2. **Esta web personal**: HTML, CSS y JS sin frameworks, contacto real, modo oscuro → 100 en accesibilidad en Lighthouse.
     3. **Primero de DAM**: de copiar y pegar a entender → tres prácticas entregadas.

     Cada paso va en una lista de definiciones (`<dl>`, con `<dt>` para «Problema» y `<dd>` para el texto). Es la etiqueta de HTML pensada para pares «nombre → valor», y en el móvil el CSS (`.card-steps`) pone la etiqueta encima del texto.
   - `#me-gusta`: aficiones con iconos.
   - `#faq`: preguntas frecuentes.
   - `#contacto`: tarjeta de correo, botón «Copiar correo» y **formulario**.
6. **`<footer>`:** nombre y año. El año lo escribe JavaScript.
7. **Capa de envío:** la animación de la carta volando, y el **asistente** (el botón redondo «Iv.» de abajo a la derecha).
8. Al final, **`js/script.js`** y **`js/chat.js`**. Van al final para que el HTML ya exista cuando el JS lo busque.

**Cómo decirlo:** «El HTML es semántico: uso `nav`, `main`, `section`, `footer` y
`h1`/`h2` en orden, y no solo `div`. Así un lector de pantalla y Google entienden la
estructura».

### La foto
```html
<img class="about-photo" src="img/ivan.webp" width="160" height="160"
     loading="lazy" decoding="async" alt="Retrato de Iván Sáez con americana…">
```
- **WebP** pesa mucho menos que JPEG con la misma calidad: pasé de 80 KB a 10 KB.
- La guardé a **480×480** aunque se ve a **160 px**, para que salga nítida en pantallas retina (que tienen 2-3 píxeles por punto).
- **`width`/`height`:** el navegador reserva el hueco antes de descargarla y la página no «salta».
- **`loading="lazy"`:** no se descarga hasta que te acercas a ella.
- **`alt`:** lo que lee un lector de pantalla si no puedes verla.
- El CSS (`.about-photo`) la recorta en círculo (`border-radius: 50%`, `object-fit: cover`) con un anillo naranja de la marca.

### La línea de tiempo «Mi recorrido»
```html
<picture>
  <source media="(max-width: 560px)" srcset="img/recorrido-movil.svg" …>
  <img class="about-timeline" src="img/recorrido.svg" width="640" height="260" alt="Mi recorrido: ESO…">
</picture>
```
- Es un **SVG propio**: círculos, una línea y textos escritos en código, sin píxeles. Por eso pesa muy poco y se ve nítido a cualquier tamaño.
- Cinco hitos: ESO → Grado Medio SMR con prácticas (2018) → Grado Superior en Ventas → empresas de marketing y administración (2022-2024) → **hoy, primero de DAM**, en naranja.
- **Dos versiones:** `recorrido.svg` es horizontal (640×260) y `recorrido-movil.svg` es vertical (320×460). `<picture>` con `<source media="(max-width: 560px)">` le dice al navegador: «si la pantalla es estrecha, usa la vertical». Así, en el móvil el texto no queda diminuto.
- Lleva su **propia tarjeta clara de fondo**, así que se lee igual en modo claro y en modo oscuro.
- El **`alt`** cuenta el recorrido completo para quien usa lector de pantalla.

### gracias.html
Segunda página con el mismo `<head>` (tema, favicon, fuentes, CSS), una barra de
navegación reducida, un SVG de un sobre con un check y botones para volver. Lleva
`noindex` porque no tiene sentido que salga en Google.

---

## 4. css/style.css: el aspecto
Está dividido en **17 bloques numerados y comentados**, en el mismo orden que la página,
y al final unos bloques añadidos después (gracias.html, foto y línea de tiempo):
1 · Variables · 2 · Base · 3 · Navegación · 4 · Estructura · 5 · Héroe · 6 · Botones ·
7 · Cintillo · 8 · Sobre mí · 9 · Proyectos · 10 · Me gusta · 11 · Contacto · 12 · Pie ·
13 · Aparición · 14 · Animación de envío · 15 · Asistente · 16 · Pantallas pequeñas ·
17 · Movimiento reducido.

Lo importante:

1. **Variables (`:root`).** Todos los colores están en un sitio: `--bg` (fondo), `--ink` (texto), `--accent` (naranja)... El resto del CSS no escribe colores sueltos: escribe `var(--ink)`.
2. **El modo oscuro aprovecha eso.** El bloque `:root[data-theme="dark"]` vuelve a definir las mismas variables con otros valores: fondo casi negro (`#15120f`), texto crema (`#f4efe6`) y un naranja más claro (`#fb923c`) para que se lea. Como todo usa variables, cambia la web entera sin tocar nada más.
   - Hay variables para el texto que va encima de un fondo de color: `--on-ink`, `--on-accent` y `--on-orange`. Sin ellas, en oscuro el texto del cintillo naranja salía crema sobre naranja (contraste 2,27:1, el mínimo es 4,5:1). Lighthouse lo detectó y lo arreglé.
3. **Responsive.** Las *media queries* (`@media (min-width: 900px)`, `(max-width: 760px)`...) cambian la colocación: en ordenador el título va a la izquierda y el contenido a la derecha; en el móvil, todo en una columna. `clamp()` hace que tamaños y márgenes crezcan poco a poco con la pantalla.
4. **Animaciones.** Los `@keyframes` definen movimientos: el cintillo, la carta y el brillo de los botones. Las secciones aparecen al hacer scroll porque empiezan transparentes y desplazadas, y la clase `.in-view`, que pone JS, las lleva a su sitio.
5. **Accesibilidad.** `:focus-visible` dibuja un borde visible al navegar con teclado. El bloque 17 respeta a quien pide menos movimiento en su sistema.

---

## 5. js/script.js: la interacción
Todo va dentro de `(function () { ... })();`. Es una función que se ejecuta sola,
para que mis variables no choquen con las de otros scripts. Las secciones están numeradas:

| Nº | Qué hace | Cómo funciona (en mis palabras) |
|---|---|---|
| 1 | Botón de animaciones | Solo aparece si el sistema pide «movimiento reducido». Guarda la elección y recarga la página. |
| 2 | Aparición al hacer scroll | Un **IntersectionObserver** «vigila» los bloques. Cuando uno entra en pantalla, le pone la clase `in-view` y el CSS hace la animación. |
| 3 | Menú activo | Otro observer mira qué sección está en el centro de la pantalla y subraya su enlace en el menú. |
| 4 | **Formulario** | Explicado justo debajo. Es lo más importante. |
| 5 | Año del pie | `new Date().getFullYear()`, así nunca se queda desactualizado. |
| 7 | Barra de progreso | Cuánto he bajado ÷ cuánto se puede bajar = porcentaje. Estira la barra con `scaleX` y escribe el % (o «¡Fin!»). |
| 8 | Pausar cintillo | El botón añade o quita la clase `is-paused` y el CSS para la animación. |
| 10 | Contadores | Cuando las cifras (+30K, 380 h) entran en pantalla, cuentan desde 0 con `requestAnimationFrame`. El lector de pantalla lee directamente la cifra final. |
| 12 | Copiar correo | Usa `navigator.clipboard`. Si no se puede (sin HTTPS), crea un cuadro de texto oculto, lo selecciona y lo copia. |
| 13 | Onda al pulsar | Crea un círculo `span.ripple` donde pulsas, el CSS lo agranda y se borra al acabar. |
| 14 | **Efectos del ratón** | Resplandor que sigue al cursor, partículas en un `<canvas>` y botones «magnéticos». Solo con ratón, no en el móvil. Explicado abajo. |
| 9 | Esqueleto de carga | Cuando la página termina de cargar, quita las cajas grises (como máximo a los 3 s). |
| 11 | Sombra de la barra | Si he bajado más de 8 px, añade la clase `scrolled` y el menú gana sombra. |
| 15 | **Modo oscuro** | El botón lee el tema actual de `<html data-theme>`, lo cambia, lo guarda en `localStorage` y actualiza `aria-pressed` y el título. Al volver otro día, el script del `<head>` lo lee y lo aplica. |

Los números no van en orden en el archivo porque fui añadiendo secciones con el tiempo.

### Los efectos del ratón (sección 14), paso a paso
Todo está dentro de la función `initPointerFx`. Solo se pone en marcha si hay ratón:
primero pregunta al navegador `(pointer: fine)`. Si dice que no (hay portátiles con
pantalla táctil que lo dicen aunque tengan ratón), espera al primer movimiento de un
ratón de verdad (`pointerType === "mouse"`). En el móvil no se activa.

1. **Resplandor que persigue al cursor.**
   - Crea un `<div class="cursor-glow">`, un círculo naranja difuminado.
   - En cada movimiento del ratón (`pointermove`) guarda dónde está el cursor: el **destino** (`gtx`, `gty`).
   - En cada fotograma (`requestAnimationFrame`, unas 60 veces por segundo) el círculo avanza un **14 % de lo que le falta** para llegar: `gx += (gtx - gx) * 0.14`. Por eso no va pegado, sino que «persigue» al cursor con suavidad.
   - Cuando ya está a menos de medio píxel, deja de calcular para no gastar.
   - Al pasar por encima de un enlace o botón se pone la clase `is-hot` y el círculo crece.
2. **Estela y explosión de partículas.**
   - Crea un `<canvas>` del tamaño de la ventana, encima de todo y transparente a los clics.
   - Al moverte más de 18 px, lanza unas pocas partículas; al hacer clic, una «explosión» de más (función `spawn`).
   - Cada partícula tiene posición, velocidad, color (los 4 naranjas de la marca), tamaño y tiempo de vida.
   - En cada fotograma, la función `frame` borra el canvas, mueve cada partícula, le suma un poco de gravedad (`vy +=`), la hace más transparente y pequeña según envejece, y la borra de la lista cuando se acaba su vida.
   - Si no quedan partículas, se para el bucle.
3. **Botones magnéticos.**
   - Cuando el ratón está sobre un botón, calcula lo lejos que está del centro del botón y mueve el botón un poco hacia el cursor (18 % en horizontal, 28 % en vertical) con la propiedad CSS `translate`.
   - Usa el mismo truco de «avanzar una parte de lo que falta» (20 % por fotograma) para que el movimiento sea suave.
   - Al salir el ratón (`pointerout`), el destino vuelve a 0 y el botón regresa a su sitio.
4. **Foco de luz en los botones.** Guarda la posición del ratón dentro del botón en las variables CSS `--mx` y `--my`, y el CSS pinta un brillo justo ahí.

**Cómo decirlo:** «Todos los efectos usan la misma idea: guardo dónde quiero que
esté algo y, en cada fotograma, lo acerco un trozo del camino. Uso `requestAnimationFrame`
porque va sincronizado con la pantalla y el navegador lo pausa si la pestaña no se ve.
Solo funcionan con ratón y respetan a quien desactiva las animaciones».

### El recorrido del dato del formulario (te lo preguntarán seguro)
1. El visitante pulsa «Enviar». JS **frena el envío un momento** (`event.preventDefault()`) para revisar los datos.
2. **Valida:** nombre no vacío, correo con forma `algo@algo.algo` (una expresión regular) y mensaje no vacío. Si algo falla, escribe el error bajo el campo, lo marca con `aria-invalid` y pone el foco ahí.
3. **Campo trampa (`_honey`):** está oculto. Una persona no lo ve, un bot lo rellena. Si viene relleno, no se envía nada.
4. Enseña la **animación de la carta**, desactiva el botón para que no se envíe dos veces y pone el nombre del visitante en el asunto (`_subject`).
5. A los 1,5 s, **`form.submit()`** envía el formulario de forma normal (POST) a `https://formsubmit.co/isasan@eeartesanos.com`, que es el `action` del `<form>`.
6. **FormSubmit** (un servicio gratuito) enseña su casilla «no soy un robot» y después:
   - **me reenvía el mensaje** a mi correo, en forma de tabla (`_template=table`);
   - **responde automáticamente al visitante** con el texto del campo oculto `_autoresponse` y una copia de su mensaje. Usa el campo `name="email"`, por eso el correo del formulario se llama así.
7. Por último lleva al visitante a **`gracias.html`** (campo oculto `_next`).
8. Si el visitante vuelve atrás, el evento `pageshow` quita la carta para que la página no se quede bloqueada.
9. Sin JavaScript también funciona: el navegador envía el `<form>` igual, solo que sin validación ni carta.

**Por qué no AJAX (`fetch`):** al principio lo usaba para quedarme en la misma página,
pero FormSubmit no manda la respuesta automática si el envío es por AJAX. Lo comprobé
en su documentación y cambié a envío normal.

**Por qué no `mailto:`:** depende de que el visitante tenga un programa de correo
configurado. En muchos equipos no pasa nada al pulsarlo, y un botón que no hace nada
es suspenso directo.

---

## 6. js/chat.js: el asistente del CV
**Idea clave:** no es una IA. Es un **buscador de palabras clave** sobre una lista de
temas que escribí yo. Por eso no inventa nada y no necesita ninguna clave secreta.

1. **Temas (`TOPICS`).** Cada tema tiene:
   - `q`: la pregunta que sale en los botones
   - `kw`: las palabras que lo activan
   - `a`: la respuesta
   - `pri`: la prioridad
   - `next`: qué preguntas sugerir después

   Por ejemplo, el tema «marketing» se activa con «facebook», «campañas», «reels»...
   El tema «objetivo» («¿Qué busca y hacia dónde va?») se activa con «ciberseguridad»,
   «futuro», «España», «por qué DAM»... Lo añadí para que el chat cuente lo mismo que mi
   texto de «Sobre mí».
2. **Normalizar (`norm`).** Pasa la pregunta a minúsculas, quita tildes y quita signos. Así «Informática» y «informatica» son lo mismo.
3. **Raíz de la palabra (`stem`).** Le quita la «s» o la «es» final: «deportes» y «deporte» quedan iguales.
4. **Puntuar (`scoreTopic`).** Por cada tema cuenta cuántas palabras clave aparecen. Una frase exacta suma 3, una palabra suma 2 y una palabra parecida suma 1. Gana el tema con más puntos. Si el segundo está casi empatado, añade también su respuesta.
5. **Casos especiales:**
   - si saludas, responde con un saludo
   - si das las gracias, contesta «de nada»
   - si intentas «ignora tus instrucciones» (manipularlo), no entra al trapo
   - si no encuentra nada, dice que eso no está en el CV, en vez de inventarlo
6. **Interfaz.** Abre y cierra la ventana, pinta los mensajes y las sugerencias, y escribe el texto **sin `innerHTML`**, para que nadie pueda colar código en el chat.

**Por qué sin API:** una web en GitHub Pages es pública. Si pongo una clave de API en
el JS, cualquiera la ve con F12 y la puede gastar.

---

## 7. Archivos de apoyo
- **`img/`:**
  - `ivan.webp`: mi foto (ver apartado 3).
  - `recorrido.svg` y `recorrido-movil.svg`: mi línea de tiempo en horizontal y en vertical (ver apartado 3).
  - `favicon.svg`: el icono de la pestaña, un logo hecho en SVG, es decir, en código: figuras y texto, no píxeles.
  - `og-image.png`: la imagen al compartir el enlace.
- **`robots.txt` / `sitemap.xml`:** le dicen a Google qué puede leer y dónde está la página.
- **`llms.txt`:** un resumen para asistentes de IA tipo ChatGPT.
- **`.github/workflows/pages.yml`:** la «receta» que GitHub ejecuta en cada push a `main`. Descarga el repo, copia solo los archivos de la web (`index.html gracias.html css js img robots.txt sitemap.xml llms.txt`) en `_site/` y los publica.
- **`.gitignore`:** lo que Git no debe subir: herramientas locales, copias de diseño, el JPEG original de la foto y archivos de Windows.
- **`README.md`, `notas.txt`, `docs/prompts.md`:** cómo está hecha la web, mi ficha de contenidos y las órdenes que le di a la IA.

---

## 8. La historia en Git (para «cuéntame tus commits»)

| Fecha | Qué pasó | Commits clave |
|---|---|---|
| 03/10 | **Versión inicial** de la web | Primer commit |
| 13/10 | Primer **asistente** del CV | chat AI |
| 24-25/10 | **Reposiciono** el portfolio a marketing, administración e informática; esqueleto de carga, % en la barra | Publica el portfolio reposicionado… |
| 30/10 | **Arreglos para móvil y caché**: scroll lateral, menú partido, versiones `?v=` | Corrige el scroll lateral… |
| 30/10 | **Animaciones accesibles**: botón para activarlas/desactivarlas, efectos del cursor | Añade el botón «Activar animaciones»… |
| 30/10 | **Contacto real** con FormSubmit en vez de `mailto:` · etiqueta **v2.0** | Envía el formulario… con FormSubmit |
| 31/10 | **Comparo la web con la rúbrica** y empiezo a corregir: limpieza del repo y carpetas | Saca del repositorio… / Ordena la web… |
| 31/10 | **Modo oscuro** en su rama `modo-oscuro` y fusión | Añade modo oscuro… |
| 31/10 | **SVG propios** (favicon e ilustración) | Añade dos SVG propios… |
| 31/10 | **Documentación**: notas, README, prompts y esta guía | Añade README técnico… |
| 31/10 | **Repo renombrado a `mi-web`** y URLs cambiadas · etiqueta **v3.0** | Cambia las URLs del sitio… |
| 31/10 | **Lighthouse**: arreglo de contraste y consola limpia | Mantiene oscuro el texto del cintillo… |
| 31/10 | **Respuesta automática** y `gracias.html`, en la rama `respuesta-automatica` | Responde automáticamente… |
| 31/10 | **Mi foto** optimizada, en la rama `foto-propia` | Añade mi foto en «Sobre mí»… |
| 31/10 | **Quito la ilustración** de los tres círculos: la cambiaré por otra imagen | Quita la ilustración de los tres frentes… |
| 31/10 | **Línea de tiempo «Mi recorrido»** (SVG propio, con versión para móvil), en la rama `linea-tiempo` | Añade mi recorrido en una línea de tiempo SVG… |
| 31/10 | **Proyectos reales** como problema → solución → resultado; quito la «web para un negocio local», que no era real | Cuenta los proyectos como problema → solución → resultado… |
| 31/10 | **Texto nuevo de «Sobre mí»**, escrito por mí | Pone mi texto en «Sobre mí»… |

---

## 9. Preguntas que me pueden hacer

**¿Qué pasa cuando alguien rellena el formulario?**
Ver el recorrido del dato en el apartado 5: valido con JS, envío a FormSubmit, me llega
el mensaje, al visitante le llega una respuesta automática y vuelve a `gracias.html`.

**¿Cómo funciona el modo oscuro?**
Un botón cambia `data-theme` en `<html>` y lo guarda en `localStorage`. El CSS tiene
un bloque que redefine los colores cuando `data-theme="dark"`. Al volver, un script en
el `<head>` lo aplica antes de pintar.

**¿Por qué el chat no usa ChatGPT o la API del centro?**
Porque una web estática es pública y la clave quedaría a la vista. Mi chat busca
palabras clave en temas que escribí yo, así que tampoco inventa nada.

**¿Por qué la foto es WebP y no JPEG?**
Porque pesa 8 veces menos con la misma calidad, y la página carga más rápido.

**¿Qué hiciste tú y qué la IA?**
La IA escribió mucho código, pero yo decidí qué pedir, qué datos poner, probé cada
cambio en el navegador y elegí entre opciones (por ejemplo, envío normal en vez de AJAX
para tener respuesta automática). Las órdenes están en `docs/prompts.md`.

**¿Cómo funcionan los efectos del ratón?**
Ver el apartado 5: guardo dónde quiero que esté cada cosa (el resplandor, el botón) y
en cada fotograma la acerco un trozo del camino. Las partículas se dibujan en un
`<canvas>`. Solo se activan con ratón.

**¿Qué mejorarías?**
Añadir capturas de mis campañas y de las prácticas de DAM a las tarjetas de proyectos.

---

## 10. Pendiente
- [x] Comprobar que la **respuesta automática** llega. Probado el 31/10/2026: funciona.
- [x] Decidir sobre los **efectos del ratón**: se quedan (explicados en el apartado 5).
- [x] Poner una **imagen nueva** en «Sobre mí»: la línea de tiempo «Mi recorrido» (31/10/2026).
- [x] Reescribir **«Lo que he hecho»** con problema → solución → resultado y cifras reales: 3 tarjetas (31/10/2026).
