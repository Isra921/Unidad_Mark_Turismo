# Guía del equipo · Marketing, Unidad 1 (EST - IPN)

Esta guía explica **cómo está armado el sitio y cómo agregar o cambiar contenido**
(referencias, glosario, autores, actividades, menú, figuras, citas, colores…).
Para todo lo que tiene que ver con **unidades, temas y actividades** está la guía
[`assets/data/unidades/LEEME.md`](assets/data/unidades/LEEME.md).

> El `README.md` es la presentación del proyecto. Esta guía es para quien lo mantiene.

## Índice

1. [Antes de empezar](#1-antes-de-empezar)
2. [Mapa de carpetas](#2-mapa-de-carpetas)
3. [Cómo se arma cada página](#3-cómo-se-arma-cada-página)
4. [Menú superior](#4-menú-superior)
5. [Página de inicio](#5-página-de-inicio)
6. [Autores](#6-autores)
7. [Glosario](#7-glosario)
8. [Actividades (ventana emergente)](#8-actividades-ventana-emergente)
9. [Referencias](#9-referencias)
10. [Figuras y citas dentro de los temas](#10-figuras-y-citas-dentro-de-los-temas)
11. [Colores](#11-colores)
12. [Crear una ventana emergente nueva](#12-crear-una-ventana-emergente-nueva)
13. [Si algo no funciona](#13-si-algo-no-funciona)

---

## 1. Antes de empezar

- **Abre el sitio con un servidor local** (por ejemplo, la extensión *Live Server* de VS Code).
  Con doble clic sobre el HTML el navegador bloquea la lectura de los JSON y las páginas
  se quedan en "Cargando…".
- Reglas del proyecto:
  - **Los textos van en JSON**, no dentro del código JavaScript.
  - **Sin números fijos en el código**: los totales se calculan (ej. `preguntas.length`).
  - **Los colores solo se definen en `variables.css`**; en los demás CSS se usan sus variables.
  - Las rutas dentro de los JSON se escriben **desde la raíz del sitio**
    (ej. `assets/img/autores/foto.jpeg`, `unidades/unidad-01/temas/tema-01-02.html`).

## 2. Mapa de carpetas

```
/
├── index.html              Página de inicio (bienvenida y secciones del material)
├── referencias.html        Página de referencias (una sola para todas las unidades)
├── 404.html
├── README.md               Presentación del proyecto
├── LEEME.md                Esta guía
├── assets/
│   ├── css/
│   │   ├── comun.css           Lo cargan TODAS las páginas (importa los de abajo)
│   │   ├── variables.css       Paleta de colores, radios y sombras
│   │   ├── global.css          Reseteo, tipografía y menú superior
│   │   ├── ventana-modal.css   Base de las ventanas emergentes
│   │   ├── autores-modal.css   Contenido de la ventana Autores
│   │   ├── glosario-modal.css  Contenido de la ventana Glosario
│   │   ├── actividades-modal.css  Contenido de la ventana Actividades
│   │   ├── inicio.css          Página de inicio
│   │   ├── unidades-base.css   Piezas compartidas por unidad, tema y actividad
│   │   └── unidad.css · tema.css · actividad.css · actividad-final.css · referencias.css
│   ├── js/
│   │   ├── data-manager.js     Lee los JSON y resuelve rutas (lo usan todas las páginas)
│   │   ├── componentes.js      Inserta los componentes globales (lista de abajo)
│   │   ├── nav-global.js       Menú superior
│   │   ├── ventana-modal.js    Base de las ventanas emergentes
│   │   ├── autores-modal.js    Ventana Autores
│   │   ├── glosario-modal.js   Ventana Glosario
│   │   ├── actividades-modal.js  Ventana Actividades
│   │   ├── unidades-ui.js      Utilidades de unidad, tema y actividad
│   │   ├── visor-figuras.js    Zoom de las figuras de los temas
│   │   └── paginas/            Un script por tipo de página (inicio, unidad, tema, actividad, referencias, actividad final)
│   ├── data/
│   │   ├── navegacion.json       Menú superior
│   │   ├── autores.json          Ventana Autores
│   │   ├── glosario.json         Ventana Glosario
│   │   ├── actividades.json      Ventana Actividades
│   │   ├── referencias-config.json  Textos de Referencias, categorías, notas de figura y citas
│   │   ├── unidades-data.json    Catálogo: qué unidades existen y en qué orden
│   │   ├── unidades/             Un JSON por unidad + su LEEME
│   │   └── unidad-1/             Preguntas de actividades, caso y referencias de la unidad 1
│   └── img/                    Logos (IPNb.png, EST.jpeg) y fotos de autores (assets/img/autores/)
└── unidades/
    └── unidad-01/
        ├── index.html          Página de la unidad (se llena desde su JSON)
        ├── temas/              Un HTML por tema
        ├── actividades/        Un HTML por actividad + actividad final
        └── img/                Figuras de los temas (1.1.1.jpeg = tema 1.1, subtema 1.1.1)
```

## 3. Cómo se arma cada página

Todas las páginas cargan **lo común** y luego **lo de su tipo**:

```html
<head>
  <link rel="stylesheet" href="…/assets/css/comun.css">          <!-- común -->
  <link rel="stylesheet" href="…/assets/css/unidades-base.css">  <!-- unidad, tema y actividad -->
  <link rel="stylesheet" href="…/assets/css/tema.css">           <!-- su tipo -->
</head>
<body data-root="../../../" data-unidad="unidad-01" data-tema="1.1">
  <header class="site-nav" data-componente="navegacion"></header>  <!-- el menú se dibuja solo -->
  …
  <script src="…/assets/js/data-manager.js"></script>   <!-- siempre primero -->
  <script src="…/assets/js/componentes.js"></script>    <!-- menú y ventanas emergentes -->
  <script src="…/assets/js/paginas/tema-plantilla.js"></script>  <!-- su tipo -->
</body>
```

- **`data-root`** indica cuántas carpetas hay que subir para llegar a la raíz:
  `""` en la raíz, `"../../"` en `unidades/unidad-01/`, `"../../../"` en `temas/` y `actividades/`.
  Con eso los JSON pueden escribir sus rutas desde la raíz.
- **`data-unidad`** y **`data-tema`** dicen a qué unidad y tema pertenece la página.

**Agregar un componente global** (algo que deba aparecer en todas las páginas):

1. Crea su JS en `assets/js/` y agrégalo a la lista `COMPONENTES` de `componentes.js`.
2. Crea su CSS en `assets/css/` y agrega su `@import` al final de `comun.css`.

No hay que tocar ningún HTML.

## 4. Menú superior

Archivo: `assets/data/navegacion.json`.

```json
{
  "marca": {
    "titulo": "EST · Marketing",
    "subtitulo": "Unidad 1: Encuadre empresarial",
    "url": "index.html",
    "logo_izq": { "src": "assets/img/IPNb.png",  "alt": "Instituto Politécnico Nacional", "clase": "brand-logo--ipn" },
    "logo_der": { "src": "assets/img/EST.jpeg", "alt": "Escuela Superior de Turismo",     "clase": "brand-logo--est" }
  },
  "boton_menu": "Abrir navegación",
  "enlaces": [
    { "texto": "Inicio",      "icono": "fa-home",     "url": "index.html" },
    { "texto": "Unidad 1",    "icono": "fa-book",     "url": "unidades/unidad-01/index.html" },
    { "texto": "Referencias", "icono": "fa-bookmark", "url": "referencias.html", "con_unidad": true },
    { "texto": "Glosario",    "icono": "fa-book-open", "modal": "glosario" },
    { "texto": "Autores",     "icono": "fa-users",     "modal": "autores" }
  ]
}
```

| Campo | Qué hace |
|---|---|
| `marca` | Título, subtítulo y enlace del bloque izquierdo. `logo_izq` y `logo_der` son opcionales; `clase` fija su tamaño (`global.css`). En la página de `marca.url` (el inicio) los logos se ocultan porque la portada ya los muestra grandes. |
| `url` | Página a la que lleva (desde la raíz). El enlace de la página actual se marca solo. |
| `icono` | Ícono de [Font Awesome 6](https://fontawesome.com/v6/icons) (solo el nombre, ej. `fa-book`). |
| `modal` | En lugar de navegar, abre la ventana emergente con ese id (`glosario`, `autores`). |
| `con_unidad` | Si la página pertenece a una unidad, agrega `?unidad=unidad-01` al enlace. Así "Referencias" abre ya filtrada. |

## 5. Página de inicio

`index.html` (estilos en `inicio.css`, script en `assets/js/paginas/index.js`) muestra la bienvenida
y el panel **Secciones del material**. Cada botón del panel lleva `data-modal="…"`:

- `actividades`, `glosario` y `autores` abren las ventanas emergentes de los JSON (secciones 6 a 8).
- `introduccion`, `programa`, `metodologia`, `examen` y `licencia` abren secciones escritas
  dentro de `index.html` (`<div class="modal-section" id="modal-…">`). Para cambiar esos textos,
  por ahora se edita el HTML.

## 6. Autores

Archivo: `assets/data/autores.json`. Cada sección es una pestaña de la ventana
(si solo hay una sección, no se muestran pestañas).

```json
{
  "id": "docentes",
  "pestana": "Autores",
  "titulo": "Autores",
  "descripcion": "",
  "tipo": "docente",
  "personas": [
    {
      "grado": "Dr.",
      "nombre": "Nombre Apellido Apellido",
      "correo": "correo@ipn.mx",
      "foto": "assets/img/autores/apellido_apellido_nombre.jpeg",
      "semblanza": ["Primer párrafo.", "Segundo párrafo."],
      "areas": ["Área 1", "Área 2"]
    }
  ]
}
```

- **`tipo`**: `"docente"` muestra la tarjeta grande (foto, semblanza y áreas de interés);
  `"colaborador"` muestra una tarjeta compacta (foto, nombre y correo).
- **Foto**: guárdala en `assets/img/autores/`. Si `"foto": ""`, se muestra un ícono en su lugar.
  `"grado"`, `"correo"`, `"semblanza"` y `"areas"` son opcionales.
- **`pendientes_confirmar`** (al final del archivo): personas cuya participación falta
  confirmar. **No se muestran.** Para publicar a alguien, mueve su bloque a `personas`
  de la sección que indica su campo `"seccion"` y borra ese campo.
- Las etiquetas fijas ("Semblanza", "Áreas de interés", "Sin fotografía") están en `etiquetas`.

## 7. Glosario

Archivo: `assets/data/glosario.json`. Hay un bloque por unidad; con más de una unidad,
cada una aparece como pestaña.

**Agregar un término** a la unidad 1: copia un objeto dentro de su lista `terminos`.

```json
{ "termino": "Clúster turístico", "definicion": "Concentración geográfica de empresas e instituciones que compiten y colaboran." }
```

- **No importa el orden**: los términos se ordenan alfabéticamente y se agrupan por letra solos.
- El buscador no distingue mayúsculas ni acentos y busca también dentro de la definición.

**Agregar el glosario de otra unidad**: copia el bloque completo de la unidad 1 dentro de
`unidades` y cambia `id` (ej. `"unidad-02"`), `pestana` y `titulo`.

## 8. Actividades (ventana emergente)

Archivo: `assets/data/actividades.json`. Cada sección es una pestaña ("Actividades por tema",
"Evaluación Integradora") con su lista `items`:

```json
{
  "tag": "Tema 1.1",
  "titulo": "Actividad 1.1: Fundamentos de Plan de Marketing",
  "descripcion": "Estructura, justificación y aplicación estratégica de las 7P en servicios turísticos.",
  "icono": "fa-gamepad",
  "reactivos": "10 reactivos",
  "tiempo": "10 min",
  "url": "unidades/unidad-01/actividades/actividad-1-1.html"
}
```

- `"destacada": true` resalta la tarjeta (se usa para la evaluación integradora).
- `reactivos` y `tiempo` son texto libre y opcionales. Si cambias `data-cantidad` en una actividad,
  actualiza también aquí el número de reactivos.
- Cada sección acepta `descripcion` y `nota` (aviso al final de la pestaña).

## 9. Referencias

Hay **una sola página** (`referencias.html`) para todas las unidades. Toma:

- Sus textos, las **categorías** y los textos de **notas y citas** de `assets/data/referencias-config.json`.
- Las referencias de cada unidad del archivo que indica el campo `"referencias"` del JSON de la unidad
  (Unidad 1: `assets/data/unidad-1/referencias.json`).

Se puede abrir ya filtrada: `referencias.html?unidad=unidad-01&tema=1.2`.
Los temas y el menú usan esa forma.

### Agregar una referencia

Copia un objeto dentro de `"referencias"`:

```json
{
  "id": "naciones-unidas-2010",
  "categoria": "organismo",
  "temas": ["1.2", "1.3", "1.4", "1.5"],
  "referencia": "Naciones Unidas. (2010). *Recomendaciones internacionales para estadísticas de turismo 2008*. https://unstats.un.org/unsd/publication/Seriesm/SeriesM_83rev1s.pdf",
  "cita": "Naciones Unidas (2010)",
  "descripcion": "Marco internacional para la medición del turismo…",
  "etiquetas": ["Estadísticas de turismo", "Conceptos básicos"],
  "enlace": { "texto": "Documento ONU", "url": "https://unstats.un.org/…" }
}
```

| Campo | Obligatorio | Qué es |
|---|---|---|
| `id` | Sí | Nombre corto y único, sin espacios: `apellido-año` (ej. `kotler-2017`). Las figuras y citas lo usan. |
| `categoria` | Sí | Grupo en el que aparece: uno de los `id` de `categorias` en `referencias-config.json` (`basica`, `consulta`, `organismo`). |
| `temas` | Sí | Temas en los que se usa. Sirve para el filtro "Tema". |
| `referencia` | Sí | La referencia **completa en APA 7**, tal como debe leerse. Las *cursivas* se marcan con `*asteriscos*`. |
| `cita` | Sí | Forma **narrativa** `Autor (año)`. Con ella se arman las notas de figura y las citas del texto. |
| `cita_corta` | No | Abreviatura para la segunda mención en adelante (ej. `"OMT (2019)"` cuando `cita` es `"Organización Mundial del Turismo [OMT] (2019)"`). |
| `descripcion` | Sí | Para qué sirve la obra. |
| `etiquetas` | No | Palabras clave (aparecen como píldoras y cuentan para el buscador). |
| `enlace` | No | Botón a la obra en línea: `texto` y `url`. |

**Reglas APA que hay que cuidar a mano:**

- Entre autores se usa **"y"**, no "&" (ej. `Fisher, L., y Espejo, J. (2011).`).
- Libro en otro idioma: título original en cursiva + traducción entre corchetes, sin cursiva:
  `*Marketing for hospitality and tourism* [Marketing para la hospitalidad y el turismo]`.
- Sin ISBN.
- En `cita`: 1 o 2 autores → todos (`Fisher y Espejo (2011)`); 3 o más → `Primer autor et al. (año)`.
  **Excepción:** si dos obras se abreviarían igual (mismo primer autor y año), se escriben los
  apellidos necesarios para distinguirlas: `Kotler, Kartajaya y Setiawan (2022)` y `Kotler, Bowen y Baloglu (2022)`.
- Organismos con abreviatura: la primera vez se presenta entre corchetes (`cita`) y después se usa sola (`cita_corta`).

### Agregar una categoría

En `referencias-config.json`, dentro de `categorias`, agrega `{ "id": "audiovisual", "nombre": "Material audiovisual", "icono": "fa-circle-play" }`.
El orden de la lista es el orden en que aparecen los grupos en la página. Una categoría sin referencias no se muestra.

### Unidad nueva

1. Crea `assets/data/unidad-2/referencias.json` con `{ "referencias": [ … ] }`.
2. En `assets/data/unidades/unidad-02.json` agrega `"referencias": "assets/data/unidad-2/referencias.json"`.

## 10. Figuras y citas dentro de los temas

Las dos se escriben en el HTML del tema **solo con los `id` de las referencias**. El número,
la nota y el texto de la cita se arman solos (`tema-plantilla.js`) a partir de `referencias.json`.
Si cambia un año o un autor, se corrige **solo en el JSON**.

### Figura (APA 7: número y título arriba, nota abajo)

```html
<figure class="t-figure" data-ampliable data-fuentes="kotler-2017 middleton-2009">
  <figcaption>Estructura general de un plan de marketing turístico</figcaption>
  <div class="t-figure__media">
    <img src="../img/1.1.1.jpeg" alt="Descripción de lo que muestra la imagen" loading="lazy">
  </div>
  <template class="t-figure__info">
    <p>Texto que aparece en el panel al ampliar la figura (opcional).</p>
  </template>
</figure>
```

Se ve así:

> **Figura 1.1**
> *Estructura general de un plan de marketing turístico*
> [imagen]
> *Nota.* Elaboración propia con base en Kotler et al. (2017) y Middleton et al. (2009).

- `figcaption` lleva **solo el título**; "Figura 1.1" se agrega solo.
- **Numeración continua por unidad**: se cuentan las figuras de los temas anteriores
  (en el orden de `temas` del JSON de la unidad). Si agregas una figura en el tema 1.1,
  todas las siguientes se renumeran solas.
- `data-fuentes`: `id` de las referencias separados por espacio.
- `data-ampliable` permite abrirla con zoom (`visor-figuras.js`).
- Los textos "Figura", "Nota." y "Elaboración propia con base en" están en `notas` de `referencias-config.json`.

### Cita en el texto (APA 7, forma entre paréntesis)

Marca el lugar **antes del punto o de los dos puntos** finales:

```html
<p>… con fines de ocio, negocios u otros motivos <span class="t-cita" data-citas="naciones-unidas-2010 omt-2019"></span>.</p>
```

Se ve así: … u otros motivos (Naciones Unidas, 2010; Organización Mundial del Turismo [OMT], 2019).

- Cada cita es un enlace a Referencias filtrada por la unidad y el tema. Al pasar el cursor
  se ve la referencia completa.
- Si la referencia tiene `cita_corta`, se usa desde la segunda vez que aparece en la página.
- Paréntesis, separador `"; "` y texto del cursor están en `citas` de `referencias-config.json`.
- Verifica que el tema esté en el campo `temas` de esa referencia; si no, el enlace abre
  una lista donde la obra no aparece.

## 11. Colores

Todos los colores viven en `assets/css/variables.css`. **En los demás CSS no se escribe
ningún color directo** (`#34D399`, `rgb(…)`): se usa una variable. Así un cambio de paleta
se hace en un solo archivo.

**Regla de legibilidad:** los textos son blancos o blanco grisáceo. Los verdes y el turquesa
se reservan para **bordes, íconos, fondos suaves y botones**, nunca para texto.

| Para… | Usa |
|---|---|
| Títulos, encabezados de tabla | `--text-heading` |
| Etiquetas pequeñas en mayúsculas | `--text-label` |
| Numeración (1.1, 1.1.1) | `--text-number` |
| Párrafos | `--text-soft` · secundario: `--text-muted` |
| Enlaces en el contenido | `--text-link` + subrayado `--link-underline` / `--link-underline-hover` |
| Etiquetas tipo píldora | `--tag-bg`, `--tag-border`, `--tag-text` |
| Fondos | `--bg-deep`, `--bg-main`, `--surface`, `--surface-hover` |
| Botones principales (texto blanco) | `--btn-bg`, `--btn-bg-hover`, `--btn-text`; variante turquesa `--btn-alt-bg` / `--btn-alt-bg-hover` |
| Barras y bordes decorativos | `--cta-bg` |
| Acentos (bordes, íconos, botones) | `--primary`, `--accent`, `--primary-soft`, `--accent-soft` |
| Estados | `--success`, `--warning`, `--danger` y sus versiones `-strong` (bordes) / `--danger-light` (texto de error) |
| Consola de la actividad final | `--console-*` |

**Contraste:** el texto debe tener un contraste mínimo de 4.5:1 con su fondo (puedes medirlo en
<https://webaim.org/resources/contrastchecker/>). Por eso los botones con texto blanco usan verdes oscuros.

Si necesitas un color nuevo, agrégalo en `variables.css` con un nombre según **su uso**
(ej. `--text-error`), no según cómo se ve (`--rojo-claro`), y con un comentario.

## 12. Crear una ventana emergente nueva

Autores, Glosario y Actividades comparten la misma base (`ventana-modal.js` + `ventana-modal.css`): fondo,
caja, pestañas, botón de cerrar, tecla Esc y foco accesible. Una ventana nueva solo arma su contenido:

1. Crea su JSON en `assets/data/` (títulos y textos).
2. Crea `assets/js/mi-ventana-modal.js`:

   ```js
   (function () {
       const { el } = VentanaModal;
       VentanaModal.registrar('mi-ventana', async () => {
           const datos = await DataManager.getArchivo('assets/data/mi-ventana.json');
           return {
               titulo: datos.titulo,
               botonCerrar: datos.boton_cerrar,
               secciones: [{ id: 'unica', pestana: datos.titulo, contenido: el('p', '', datos.texto) }]
           };
       });
   })();
   ```

3. Agrégalo a `COMPONENTES` en `componentes.js` (**después** de `ventana-modal.js`) y, si tiene estilos,
   su `@import` en `comun.css`.
4. Ábrela desde el menú con `"modal": "mi-ventana"` en `navegacion.json`, o desde cualquier
   botón con `data-modal="mi-ventana"`.

Con una sola sección no se muestran pestañas. La ventana se construye la primera vez que se abre.

## 13. Si algo no funciona

- **La página se queda en "Cargando…"** o dice *No se pudo cargar el contenido*: casi siempre
  es una coma de más o de menos, o una comilla sin cerrar en un JSON. El mensaje dice qué archivo;
  valídalo en <https://jsonlint.com>. También pasa si se abrió con doble clic (usa Live Server).
- **Abre la consola** del navegador (F12 → *Console*). Los avisos del sitio empiezan con su origen:
  - `[Figura] La referencia "x" no existe…` / `[Cita] …`: el `id` de `data-fuentes` o `data-citas` está mal escrito.
  - `[Referencias] unidad-0X.json no tiene el campo "referencias"`.
- **Una figura no tiene número**: no se pudo leer algún tema anterior de la unidad (revisa su `url` en el JSON de la unidad).
- **El menú o una ventana no aparece**: revisa que la página cargue `data-manager.js` y luego `componentes.js`,
  y que tenga `<header class="site-nav" data-componente="navegacion"></header>`.
