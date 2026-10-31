# Órdenes clave a la IA

Registro de las peticiones importantes que hice a la IA mientras construía la web,
qué buscaba con cada una y qué decidí yo después. Está ordenado como el historial
de commits.

| # | Lo que pedí | Por qué | Qué decidí yo | Commit |
|---|---|---|---|---|
| 1 | «Crea mi web personal con HTML, CSS y JS puros: cabecera con nombre y frase, Sobre mí, Lo que he hecho, Me gusta y pie con contacto. HTML semántico y comentado.» | Tener la base de la sesión 1 | Cambié los textos genéricos por mis datos reales | Primer commit |
| 2 | «Añade un asistente que responda preguntas sobre mi CV.» | Que un visitante encuentre rápido mi experiencia | Sin API de IA: no se puede esconder una clave en una web estática | chat AI |
| 3 | «Reposiciona el portfolio hacia marketing, administración e informática.» | Mi perfil real son esos tres frentes, no solo programación | Elegí qué experiencia destacar y qué cifras poner | Publica el portfolio reposicionado… |
| 4 | «En el móvil hay scroll lateral y el menú se parte en dos líneas.» | Requisito mínimo: verse bien en el móvil | Lo probé con DevTools en modo dispositivo | Corrige el scroll lateral… |
| 5 | «El formulario abre el programa de correo; quiero que envíe de verdad.» | Contacto real (15 puntos y requisito mínimo) | FormSubmit en vez de `mailto:` (ver README) | Envía el formulario… con FormSubmit |
| 6 | «Mira las reglas de la web del curso (sesiones 1, 2 y 3) y dime qué me falta para aprobar.» | Comparar mi web con la rúbrica | Objetivo: nivel Competente en todos los criterios | — |
| 7 | «Quita del repo lo que no es la web y ordénala en carpetas css/, js/ e img/.» | Arquitectura: «sin carpetas» es Insuficiente | Mantener las herramientas en mi disco pero fuera del repo | Saca del repositorio… / Ordena la web… |
| 8 | «Añade modo oscuro que recuerde la elección.» | Diseño e interactividad con estado | Mantener el naranja de la marca, aclarado para el contraste | Añade modo oscuro… |
| 9 | «Haz dos SVG propios: el logo como favicon y una ilustración de mis tres frentes.» | Medios: ≥2 SVG propios | La idea de los tres círculos que se cruzan | Añade dos SVG propios… |

## Lo que aprendí dirigiendo a la IA

- Las peticiones concretas («en el móvil el menú se parte») funcionan mejor que «arréglalo todo».
- Siempre pruebo el resultado en el navegador antes de hacer commit.
- Si no sé explicar un trozo de código, lo pregunto o lo quito.
