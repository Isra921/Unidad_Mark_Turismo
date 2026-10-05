# Cómo editar una unidad, sus temas y sus actividades

Cada unidad tiene **un solo archivo de datos**: `assets/data/unidades/unidad-XX.json`.
La página `unidades/unidad-XX/index.html`, el índice lateral de los temas, la navegación
"Tema anterior / Siguiente" y la lista "Otras actividades" se generan solos a partir de ese archivo.

> Referencias, glosario, autores, menú, figuras, citas y colores se explican en la
> [guía general del proyecto](../../../LEEME.md).

## Campos del JSON de la unidad

| Campo | Qué es |
|---|---|
| `id` | Igual al nombre del archivo, sin `.json` (ej. `"unidad-01"`). |
| `numero` | Número de la unidad (1, 2, 3…). El numeral romano se calcula solo. También numera las figuras (Figura **1**.3). |
| `titulo` | Nombre de la unidad. |
| `descripcion` | Resumen breve de la unidad. Por ahora no aparece en pantalla; se queda para un catálogo de unidades. |
| `lema` | Línea bajo el título de la página de la unidad. |
| `duracion_horas` | Solo el número (ej. `10`). |
| `introduccion` | Lista de párrafos: `["Párrafo 1", "Párrafo 2"]`. |
| `recorrido` | Texto que explica el orden de los temas. |
| `temas` | Lista de temas; cada uno incluye su actividad (ver abajo). **Su orden es el de la numeración de figuras.** |
| `actividad_final` | `nombre`, `descripcion`, `url`. |
| `objetivo` | Objetivo de la unidad (panel derecho). |
| `competencias` | Lista de competencias (panel derecho). |
| `referencias` | Ruta del archivo de referencias de la unidad (ej. `"assets/data/unidad-1/referencias.json"`). Lo usan la página de Referencias, las notas de figura y las citas de los temas. |
| `video` | Opcional. `titulo` y `url` *embed* de YouTube (`https://www.youtube.com/embed/...`). Aparece en "Material de apoyo". |
| `material_apoyo` | Lista de enlaces: `nombre`, `url`. Las rutas internas van desde la raíz (ej. `"referencias.html?unidad=unidad-01"`). |

Cada tema (con su actividad de aprendizaje):

```json
{
  "numero": "1.2",
  "nombre": "Notas de la OMT",
  "sintesis": "Una línea que resume el tema.",
  "url": "unidades/unidad-01/temas/tema-01-02.html",
  "icono": "fa-globe",
  "actividad": {
    "nombre": "Actividad de aprendizaje 1.2",
    "url": "unidades/unidad-01/actividades/actividad-1-2.html"
  }
}
```

- Si la página del tema todavía no existe, deja `"url": ""`: el tema aparece como **Próximamente** y **su actividad también se bloquea**.
- Si un tema no tiene actividad, borra el bloque `"actividad"`.
- `"icono"` es opcional: cambia el ícono del tema en las tarjetas (nombres de <https://fontawesome.com/v6/icons>).
- Los enlaces se escriben **desde la raíz del sitio** (empiezan con `unidades/...`).
- Si agregas o quitas un tema o actividad, los contadores se actualizan solos (la ventana **Actividades** del inicio se edita aparte, en `assets/data/actividades.json`).

## Crear o editar la página de un tema

Los temas usan la plantilla de `unidades/unidad-01/temas/tema-01-01.html` (estilos en `assets/css/tema.css`).
El **contenido** se escribe en el HTML; el índice de la unidad, "En esta página", la barra de progreso,
los botones de navegación, los números de figura, las notas y las citas se generan solos.

1. Copia `tema-01-01.html` con el nombre del nuevo tema (ej. `tema-01-06.html`).
2. En `<body>` cambia `data-unidad="unidad-01"` y `data-tema="1.6"` (debe coincidir con `"numero"` del tema en el JSON).
3. Cambia el `<title>`, la línea `Unidad I · Tema 1.6`, el `<h1>` y la entradilla `<p class="t-lead">`.
4. Escribe el contenido dentro de `<div class="t-prose">`. Piezas disponibles:

   | Pieza | Para qué |
   |---|---|
   | `<p class="t-lead" id="idea-central" data-toc="Idea central">` | Entradilla (idea central del tema). |
   | `<section id="…" data-toc="1.6.1 Nombre">` + `<h2><span class="t-section__num">1.6.1</span>Nombre</h2>` | Subtema. |
   | `<figure class="t-figure" data-ampliable data-fuentes="id id">` | Figura con número, título y nota APA ([ver guía](../../../LEEME.md#10-figuras-y-citas-dentro-de-los-temas)). |
   | `<span class="t-cita" data-citas="id id"></span>` | Cita APA, antes del punto final ([ver guía](../../../LEEME.md#10-figuras-y-citas-dentro-de-los-temas)). |
   | `<aside class="t-callout t-callout--note">` / `t-callout--example` | Recuadro de "Punto clave" o de ejemplo. |
   | `<div class="t-table"><table>…</table></div>` | Tabla (con desplazamiento horizontal en celular). |
   | Botón con `data-video="https://www.youtube.com/embed/..."` | Abre un video en ventana; vacío = "Próximamente". |

5. Todo elemento con `id` y `data-toc="Texto"` aparece en **"En esta página"**.
6. Las imágenes del tema van en `unidades/unidad-XX/img/`, nombradas por subtema (ej. `1.6.2.jpeg`).
7. En el JSON de la unidad pon la `url` del tema para desbloquearlo.
8. Si el tema usa referencias, agrega su número al campo `temas` de cada una en `referencias.json`.

## Crear o editar una actividad de aprendizaje

Todas las actividades usan la misma plantilla (`unidades/unidad-01/actividades/actividad-1-1.html`,
estilos en `assets/css/actividad.css`). **Las preguntas viven en un JSON**; el ejercicio,
"Otras actividades" y la navegación se generan solos.

1. Copia una actividad existente con el nombre nuevo (ej. `actividad-1-6.html`).
2. En `<body>` cambia:
   - `data-unidad` y `data-tema` (el tema al que pertenece).
   - `data-preguntas`: banco de preguntas, desde la raíz (ej. `assets/data/unidad-1/preguntas_1.6.json`).
   - `data-cantidad`: cuántas preguntas se toman al azar en cada intento.
3. Cambia el `<title>`, la línea `Unidad I · 1.6`, el `<h1>`, el propósito y las instrucciones.

El banco es una lista de preguntas. El formato que usa la Unidad 1 (opción múltiple):

```json
{
  "pregunta": "¿Qué es un plan de marketing?",
  "opciones": [
    "Un documento escrito que organiza las decisiones y acciones para alcanzar objetivos comerciales.",
    "Un trámite exigido por las secretarías de turismo.",
    "Un catálogo de promociones de temporada baja."
  ],
  "respuesta_correcta": "Un documento escrito que organiza las decisiones y acciones para alcanzar objetivos comerciales.",
  "explicacion": "El plan de marketing es una herramienta viva que orienta recursos y permite evaluar resultados."
}
```

- `respuesta_correcta` debe ser **idéntica** a una de las `opciones`. Las opciones se mezclan solas.
- `explicacion` (opcional) se muestra en la retroalimentación.

Otros tipos admitidos (campo `"type"`; si falta, se toma como opción múltiple):

```json
{ "type": "verdadero_falso", "statement": "El excursionista pernocta al menos una noche en el destino.", "answer": false }
{ "type": "completar_oracion", "question": "El turista que no pernocta es un _____.", "wordBank": ["excursionista", "residente"], "answer": ["excursionista"] }
{ "type": "ordenar_oracion", "segments": ["El plan de marketing", "orienta los recursos", "de la empresa turística."], "answer": ["El plan de marketing", "orienta los recursos", "de la empresa turística."] }
```

- En "completar", cada `_____` es un espacio y `answer` lleva una palabra por espacio, en orden.
- En "ordenar", `answer` es el orden correcto; los fragmentos se mezclan solos.

**Actividad final:** usa su propia página y script (`actividad-final.html` y
`assets/js/paginas/unidades_unidad-01_actividades_actividad-final.js`). Por ahora sus preguntas
están escritas dentro de ese script, no en un JSON.

## Agregar una unidad nueva

1. **Datos:** copia `unidad-01.json` como `unidad-02.json` y cambia su contenido, incluidos `"id": "unidad-02"`, `"numero": 2` y las rutas.
2. **Catálogo:** agrega `"unidad-02"` a la lista `unidades` de `assets/data/unidades-data.json`.
3. **Página:** copia `unidades/unidad-01/index.html` a `unidades/unidad-02/index.html` y cambia **solo** `data-unidad="unidad-02"` (y el texto del pie).
4. **Temas y actividades:** crea `unidades/unidad-02/temas/`, `actividades/` e `img/` siguiendo las secciones anteriores.
5. **Preguntas y referencias:** crea `assets/data/unidad-2/` con los bancos de preguntas y `referencias.json`, y apunta a él desde el campo `"referencias"`.
6. **Glosario:** agrega el bloque de la unidad en `assets/data/glosario.json`.
7. **Menú y actividades:** si debe aparecer arriba, agrega su enlace en `assets/data/navegacion.json`, y sus actividades en `assets/data/actividades.json`.

## Si la página muestra "No se pudo cargar el contenido"

- Casi siempre es una **coma de más o de menos**, o una comilla sin cerrar. El mensaje indica el archivo; valídalo en <https://jsonlint.com>.
- La página debe abrirse con un servidor (Live Server o GitHub Pages), no con doble clic.
- Más casos en la [guía general](../../../LEEME.md#13-si-algo-no-funciona).
