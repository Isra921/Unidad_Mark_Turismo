// ==========================================================================
// PÁGINA DE REFERENCIAS (referencias.html, en la raíz del sitio)
// --------------------------------------------------------------------------
// - Una sola página para todas las unidades.
//   · Textos de la página, categorías y textos de las notas: <body data-config="…">
//     (referencias-config.json; las notas las usan los temas para figuras y videos).
//   · Lista de unidades: unidades-data.json (DataManager.getUnidades()).
//   · Referencias de cada unidad: el campo "referencias" de su JSON de unidad
//     (ej. assets/data/unidad-1/referencias.json → { "referencias": [ … ] }).
// - Filtros: Unidad y Tema (listas desplegables) + buscador sin acentos.
//   La URL guarda la selección (?unidad=unidad-01&tema=1.2), así un tema puede
//   enlazar directo a sus referencias.
// - Cada referencia se escribe ya armada en APA 7 (campo "referencia"); las
//   cursivas se marcan con *asteriscos* y aquí se convierten en <em>.
// - Las figuras NO se listan aquí: su nota va dentro del tema. Los videos sí son
//   referencias (categoría propia) y además llevan su nota en el tema.
// - Requiere data-manager.js (cargado antes) y <body data-root="…">.
// ==========================================================================
(function () {
    const SELECTOR_APP = '#referencias-app';
    const PARAM_UNIDAD = 'unidad';
    const PARAM_TEMA = 'tema';
    const TODOS = '';
    const CLASE_TEMA_FILTRADO = 'is-tema-filtrado';
    const DURACION_COPIADO_MS = 2000;

    // ---------- Utilidades ----------
    function esc(texto) {
        return String(texto ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function normalizar(texto) {
        return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    /** Sustituye {marcadores} de las plantillas de texto del JSON. */
    function plantilla(texto, valores) {
        return texto.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? '');
    }

    function etiquetaTemas(temas, textos) {
        const prefijo = temas.length > 1 ? textos.temas_plural : textos.temas_singular;
        return `${prefijo} ${temas.join(', ')}`;
    }

    /**
     * Prepara la referencia escrita en el JSON.
     * Devuelve { html, texto }: html con *cursivas* convertidas en <em> para mostrar,
     * texto plano (sin asteriscos) para copiar.
     */
    function formatoReferencia(ref) {
        return {
            html: esc(ref.referencia).replace(/\*(.+?)\*/g, '<em>$1</em>'),
            texto: ref.referencia.replace(/\*/g, '')
        };
    }

    async function copiar(texto) {
        try {
            await navigator.clipboard.writeText(texto);
        } catch (error) {
            // Respaldo para navegadores sin acceso al portapapeles
            const area = document.createElement('textarea');
            area.value = texto;
            document.body.append(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
    }

    function leerURL() {
        const params = new URLSearchParams(window.location.search);
        return { unidad: params.get(PARAM_UNIDAD) || TODOS, tema: params.get(PARAM_TEMA) || TODOS };
    }

    function guardarURL(unidad, tema) {
        const params = new URLSearchParams();
        if (unidad) params.set(PARAM_UNIDAD, unidad);
        if (tema) params.set(PARAM_TEMA, tema);
        const consulta = params.toString();
        history.replaceState(null, '', `${window.location.pathname}${consulta ? `?${consulta}` : ''}`);
    }

    // ---------- Estructura fija de la página ----------
    function encabezado(config) {
        const e = config.pagina.encabezado;
        return `
            <section class="r-hero">
                <div class="r-hero__header">
                    <span class="u-eyebrow"><i class="fas fa-graduation-cap" aria-hidden="true"></i> ${esc(e.eyebrow)}</span>
                    <span class="u-chip u-chip--accent"><i class="fas fa-layer-group" aria-hidden="true"></i> ${esc(e.etiqueta)}</span>
                </div>
                <h1 class="r-hero__title">${esc(e.titulo)}</h1>
                <p class="r-hero__lead">${esc(e.descripcion)}</p>
            </section>`;
    }

    function barra(config, unidades) {
        const t = config.pagina.textos;
        const opcionesUnidad = unidades.map(u =>
            `<option value="${esc(u.id)}">${esc(plantilla(t.opcion_unidad, { numero: u.numero, titulo: u.titulo }))}</option>`).join('');
        return `
            <div class="r-toolbar">
                <div class="r-search-box">
                    <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" id="searchRef" placeholder="${esc(t.buscador_placeholder)}" aria-label="${esc(t.buscador_etiqueta)}">
                </div>
                <div class="r-toolbar__row">
                    <label class="r-field">
                        <span class="r-field__label">${esc(t.filtro_unidad)}</span>
                        <select class="r-select" id="filtroUnidad">${opcionesUnidad}</select>
                    </label>
                    <label class="r-field">
                        <span class="r-field__label">${esc(t.filtro_tema)}</span>
                        <select class="r-select" id="filtroTema"></select>
                    </label>
                    <p class="r-toolbar__count" id="contadorRef" aria-live="polite"></p>
                </div>
            </div>
            <div class="r-listado" id="listadoRef"></div>
            <div class="r-empty" id="rEmpty" hidden>
                <i class="fas fa-book-open-reader" aria-hidden="true"></i>
                <p id="rEmptyTexto"></p>
            </div>`;
    }

    // ---------- Contenido de una unidad ----------
    function tarjeta(ref, t) {
        const apa = formatoReferencia(ref);
        const etiquetas = ref.etiquetas.map(e => `<span class="r-meta-tag"><i class="fas fa-tag" aria-hidden="true"></i> ${esc(e)}</span>`).join('');
        const enlace = ref.enlace
            ? `<a class="r-btn-link" href="${esc(ref.enlace.url)}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> ${esc(ref.enlace.texto)}</a>` : '';
        const busqueda = normalizar(`${apa.texto} ${ref.descripcion} ${ref.etiquetas.join(' ')}`);

        return `
            <article class="r-card" data-temas="${esc(ref.temas.join(' '))}" data-busqueda="${esc(busqueda)}">
                <div class="r-card__top">
                    <span class="r-card__unit-tag">${esc(etiquetaTemas(ref.temas, t))}</span>
                </div>
                <div class="r-card__body">
                    <p class="r-card__citation" data-apa="${esc(apa.texto)}">${apa.html}</p>
                    <p class="r-card__desc">${esc(ref.descripcion)}</p>
                    <div class="r-card__meta">${etiquetas}</div>
                </div>
                <div class="r-card__actions">
                    <button type="button" class="r-btn-copy" aria-label="${esc(t.copiar_aria)}"><i class="fas fa-copy" aria-hidden="true"></i> ${esc(t.copiar)}</button>
                    ${enlace}
                </div>
            </article>`;
    }

    /** Tarjetas agrupadas por categoría (Bibliografía básica, Libros de consulta…). */
    function grupos(referencias, config) {
        return config.categorias.map(c => {
            const refs = referencias.filter(r => r.categoria === c.id);
            if (!refs.length) return '';
            return `
                <section class="r-group" aria-labelledby="r-g-${esc(c.id)}">
                    <h2 class="r-group__title" id="r-g-${esc(c.id)}">
                        <i class="fas ${esc(c.icono)}" aria-hidden="true"></i> ${esc(c.nombre)}
                        <span class="r-group__count">${refs.length}</span>
                    </h2>
                    <div class="r-grid">${refs.map(r => tarjeta(r, config.pagina.textos)).join('')}</div>
                </section>`;
        }).join('');
    }

    function opcionesTema(unidad, t) {
        return [
            `<option value="${TODOS}">${esc(t.opcion_todos_temas)}</option>`,
            ...(unidad.temas || []).map(tema =>
                `<option value="${esc(tema.numero)}">${esc(plantilla(t.opcion_tema, tema))}</option>`)
        ].join('');
    }

    // ---------- Filtrado ----------
    function filtrar(app, config, total) {
        const t = config.pagina.textos;
        const consulta = normalizar(app.querySelector('#searchRef').value);
        const tema = app.querySelector('#filtroTema').value;
        const listado = app.querySelector('#listadoRef');
        let visibles = 0;

        // Con un tema elegido, la etiqueta "Temas 1.1, 1.2…" de cada tarjeta sobra
        listado.classList.toggle(CLASE_TEMA_FILTRADO, tema !== TODOS);
        listado.querySelectorAll('.r-group').forEach(grupo => {
            let enGrupo = 0;
            grupo.querySelectorAll('.r-card').forEach(tarjeta => {
                const coincide = (tema === TODOS || tarjeta.dataset.temas.split(' ').includes(tema))
                    && (!consulta || tarjeta.dataset.busqueda.includes(consulta));
                tarjeta.hidden = !coincide;
                if (coincide) enGrupo += 1;
            });
            grupo.hidden = enGrupo === 0;
            grupo.querySelector('.r-group__count').textContent = enGrupo;
            visibles += enGrupo;
        });

        app.querySelector('#contadorRef').textContent = visibles === total
            ? plantilla(t.contador_total, { total })
            : plantilla(t.contador_filtrado, { visibles, total });
        app.querySelector('#rEmptyTexto').textContent = total ? t.sin_resultados : t.sin_referencias;
        app.querySelector('#rEmpty').hidden = visibles > 0;
    }

    // ---------- Arranque ----------
    async function init() {
        const app = document.querySelector(SELECTOR_APP);
        if (!app) return;
        const rutaConfig = document.body.dataset.config;

        try {
            const [config, unidades] = await Promise.all([
                DataManager.getArchivo(rutaConfig),
                DataManager.getUnidades()
            ]);
            const t = config.pagina.textos;
            app.innerHTML = encabezado(config) + barra(config, unidades);

            const selectUnidad = app.querySelector('#filtroUnidad');
            const selectTema = app.querySelector('#filtroTema');
            const buscador = app.querySelector('#searchRef');
            const listado = app.querySelector('#listadoRef');
            let total = 0;

            async function cargarUnidad(idUnidad, tema) {
                const unidad = unidades.find(u => u.id === idUnidad) || unidades[0];
                selectUnidad.value = unidad.id;
                selectTema.innerHTML = opcionesTema(unidad, t);
                selectTema.value = (unidad.temas || []).some(x => x.numero === tema) ? tema : TODOS;

                const datos = unidad.referencias
                    ? await DataManager.getArchivo(unidad.referencias)
                    : { referencias: [] };
                total = datos.referencias.length;
                listado.innerHTML = grupos(datos.referencias, config);
                guardarURL(unidad.id, selectTema.value);
                filtrar(app, config, total);
            }

            selectUnidad.addEventListener('change', () => cargarUnidad(selectUnidad.value, TODOS));
            selectTema.addEventListener('change', () => {
                guardarURL(selectUnidad.value, selectTema.value);
                filtrar(app, config, total);
            });
            buscador.addEventListener('input', () => filtrar(app, config, total));

            app.addEventListener('click', async e => {
                const boton = e.target.closest('.r-btn-copy');
                if (!boton) return;
                await copiar(boton.closest('.r-card').querySelector('[data-apa]').dataset.apa);
                const original = boton.innerHTML;
                boton.classList.add('is-copied');
                boton.innerHTML = `<i class="fas fa-check" aria-hidden="true"></i> ${esc(t.copiado)}`;
                setTimeout(() => {
                    boton.classList.remove('is-copied');
                    boton.innerHTML = original;
                }, DURACION_COPIADO_MS);
            });

            const inicial = leerURL();
            await cargarUnidad(inicial.unidad, inicial.tema);
        } catch (error) {
            app.innerHTML = `<p class="r-empty">No se pudo cargar el contenido (${esc(error.archivo || rutaConfig)}): ${esc(error.message)}</p>`;
            console.error(error);
        } finally {
            app.setAttribute('aria-busy', 'false');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
