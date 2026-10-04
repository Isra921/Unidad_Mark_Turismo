// ==========================================================================
// COMPONENTE GLOBAL · VENTANA EMERGENTE DE AUTORES
// --------------------------------------------------------------------------
// - Los datos viven en assets/data/autores.json (docentes y equipo).
// - Se abre con cualquier elemento [data-modal="autores"] (el menú global
//   lo genera a partir de navegacion.json). Usa delegación de eventos, así
//   que funciona aunque el menú se dibuje después de cargar este archivo.
// - La ventana se construye la primera vez que se abre (carga diferida).
// - Requiere data-manager.js y <body data-root="...">.
// ==========================================================================
(function () {
    const RUTA_DATOS = 'assets/data/autores.json';
    const ID_MODAL = 'autores';
    const ID_TITULO = 'au-modal-titulo';
    const SELECTOR_DISPARADOR = `[data-modal="${ID_MODAL}"]`;
    const SELECTOR_ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const PREFIJO_PANEL = 'au-panel-';
    const PREFIJO_PESTANA = 'au-tab-';
    const CLASE_ABIERTO = 'is-open';
    const CLASE_BODY_BLOQUEADO = 'au-modal-abierto';

    let overlay = null;      // Contenedor de la ventana (se crea una sola vez)
    let disparador = null;   // Elemento que abrió la ventana (para devolverle el foco)

    // ---------- Utilidades de construcción ----------
    function el(etiqueta, clase, texto) {
        const nodo = document.createElement(etiqueta);
        if (clase) nodo.className = clase;
        if (texto) nodo.textContent = texto;
        return nodo;
    }

    function icono(clase) {
        const i = el('i', `fas ${clase}`);
        i.setAttribute('aria-hidden', 'true');
        return i;
    }

    function nombreCompleto(persona) {
        return [persona.grado, persona.nombre].filter(Boolean).join(' ');
    }

    /** Foto de la persona o, si no hay, un marcador con ícono. */
    function crearFoto(persona, clase, etiquetas) {
        if (persona.foto) {
            const img = el('img', clase);
            img.src = DataManager.ruta(persona.foto);
            img.alt = nombreCompleto(persona);
            img.loading = 'lazy';
            return img;
        }
        const marcador = el('div', `${clase} au-foto--vacia`);
        marcador.setAttribute('role', 'img');
        marcador.setAttribute('aria-label', etiquetas.sin_foto);
        marcador.append(icono('fa-user'));
        return marcador;
    }

    function crearCorreo(correo) {
        if (!correo) return null;
        const enlace = el('a', 'au-correo', correo);
        enlace.href = `mailto:${correo}`;
        return enlace;
    }

    // ---------- Tarjetas ----------
    function tarjetaDocente(persona, etiquetas) {
        const tarjeta = el('article', 'au-docente');
        const info = el('div', 'au-docente__info');

        info.append(el('h3', 'au-nombre', nombreCompleto(persona)));
        const correo = crearCorreo(persona.correo);
        if (correo) info.append(correo);

        (persona.semblanza || []).forEach((parrafo, indice) => {
            const p = el('p', 'au-texto');
            if (indice === 0) p.append(el('strong', '', `${etiquetas.semblanza}: `));
            p.append(parrafo);
            info.append(p);
        });

        if (persona.areas && persona.areas.length) {
            const bloque = el('div', 'au-areas');
            bloque.append(el('strong', 'au-areas__titulo', `${etiquetas.areas}:`));
            const lista = el('ul', 'au-areas__lista');
            persona.areas.forEach(area => lista.append(el('li', 'au-chip', area)));
            bloque.append(lista);
            info.append(bloque);
        }

        tarjeta.append(crearFoto(persona, 'au-docente__foto', etiquetas), info);
        return tarjeta;
    }

    function tarjetaColaborador(persona, etiquetas) {
        const tarjeta = el('article', 'au-colaborador');
        const info = el('div', 'au-colaborador__info');
        info.append(el('h3', 'au-nombre', nombreCompleto(persona)));
        const correo = crearCorreo(persona.correo);
        if (correo) info.append(correo);
        tarjeta.append(crearFoto(persona, 'au-colaborador__foto', etiquetas), info);
        return tarjeta;
    }

    const CONSTRUCTORES = {
        docente: { contenedor: 'au-lista-docentes', tarjeta: tarjetaDocente },
        colaborador: { contenedor: 'au-lista-colaboradores', tarjeta: tarjetaColaborador }
    };

    // ---------- Estructura de la ventana ----------
    function crearPanel(seccion, etiquetas, conPestanas) {
        const panel = el('section', 'au-panel');
        panel.id = `${PREFIJO_PANEL}${seccion.id}`;
        if (conPestanas) {
            // La pestaña ya nombra la sección: se omite el subtítulo para no repetirlo
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', `${PREFIJO_PESTANA}${seccion.id}`);
        } else {
            panel.append(el('h3', 'au-panel__titulo', seccion.titulo));
        }
        if (seccion.descripcion) panel.append(el('p', 'au-panel__descripcion', seccion.descripcion));

        const constructor = CONSTRUCTORES[seccion.tipo] || CONSTRUCTORES.colaborador;
        const lista = el('div', constructor.contenedor);
        seccion.personas.forEach(persona => lista.append(constructor.tarjeta(persona, etiquetas)));
        panel.append(lista);
        return panel;
    }

    function seleccionarPestana(idSeccion) {
        overlay.querySelectorAll('[role="tab"]').forEach(tab => {
            const activa = tab.dataset.seccion === idSeccion;
            tab.setAttribute('aria-selected', String(activa));
            tab.tabIndex = activa ? 0 : -1;
        });
        overlay.querySelectorAll('.au-panel').forEach(panel => {
            panel.hidden = panel.id !== `${PREFIJO_PANEL}${idSeccion}`;
        });
        overlay.querySelector('.au-modal__body').scrollTop = 0;
    }

    function construir(datos) {
        const conPestanas = datos.secciones.length > 1;

        overlay = el('div', 'au-modal');
        overlay.hidden = true;

        const dialogo = el('div', 'au-modal__dialog');
        dialogo.setAttribute('role', 'dialog');
        dialogo.setAttribute('aria-modal', 'true');
        dialogo.setAttribute('aria-labelledby', ID_TITULO);

        const encabezado = el('header', 'au-modal__header');
        const titulo = el('h2', 'au-modal__title', datos.titulo);
        titulo.id = ID_TITULO;
        const cerrar = el('button', 'au-modal__close');
        cerrar.type = 'button';
        cerrar.setAttribute('aria-label', datos.boton_cerrar);
        cerrar.append(icono('fa-times'));
        cerrar.addEventListener('click', cerrarModal);
        encabezado.append(titulo, cerrar);
        dialogo.append(encabezado);

        if (conPestanas) {
            const pestanas = el('div', 'au-modal__tabs');
            pestanas.setAttribute('role', 'tablist');
            datos.secciones.forEach(seccion => {
                const tab = el('button', 'au-tab', seccion.pestana);
                tab.type = 'button';
                tab.id = `${PREFIJO_PESTANA}${seccion.id}`;
                tab.dataset.seccion = seccion.id;
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-controls', `${PREFIJO_PANEL}${seccion.id}`);
                tab.addEventListener('click', () => seleccionarPestana(seccion.id));
                pestanas.append(tab);
            });
            dialogo.append(pestanas);
        }

        const cuerpo = el('div', 'au-modal__body');
        datos.secciones.forEach(seccion => cuerpo.append(crearPanel(seccion, datos.etiquetas, conPestanas)));
        dialogo.append(cuerpo);

        overlay.append(dialogo);
        overlay.addEventListener('click', e => { if (e.target === overlay) cerrarModal(); });
        overlay.addEventListener('keydown', manejarTeclado);
        document.body.append(overlay);

        seleccionarPestana(datos.secciones[0].id);
    }

    // ---------- Abrir / cerrar ----------
    async function abrirModal(origen) {
        disparador = origen;
        if (!overlay) {
            try {
                construir(await DataManager.getArchivo(RUTA_DATOS));
            } catch (error) {
                console.error(`[Autores] ${error.archivo || RUTA_DATOS}: ${error.message}`);
                return;
            }
        }
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add(CLASE_ABIERTO));
        document.body.classList.add(CLASE_BODY_BLOQUEADO);
        overlay.querySelector('.au-modal__close').focus();
    }

    function cerrarModal() {
        if (!overlay || overlay.hidden) return;
        overlay.classList.remove(CLASE_ABIERTO);
        overlay.hidden = true;
        document.body.classList.remove(CLASE_BODY_BLOQUEADO);
        if (disparador instanceof HTMLElement) disparador.focus();
        disparador = null;
    }

    /** Esc cierra; Tab mantiene el foco dentro; flechas cambian de pestaña. */
    function manejarTeclado(e) {
        if (e.key === 'Escape') {
            cerrarModal();
            return;
        }

        if (e.key === 'Tab') {
            const enfocables = [...overlay.querySelectorAll(SELECTOR_ENFOCABLES)]
                .filter(nodo => !nodo.closest('[hidden]'));
            if (!enfocables.length) return;
            const primero = enfocables[0];
            const ultimo = enfocables[enfocables.length - 1];
            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primero.focus();
            }
            return;
        }

        const tabActual = e.target.closest('[role="tab"]');
        if (tabActual && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            const tabs = [...overlay.querySelectorAll('[role="tab"]')];
            const paso = e.key === 'ArrowRight' ? 1 : -1;
            const siguiente = tabs[(tabs.indexOf(tabActual) + paso + tabs.length) % tabs.length];
            seleccionarPestana(siguiente.dataset.seccion);
            siguiente.focus();
        }
    }

    // Delegación: funciona con enlaces que se agregan después (menú dinámico)
    document.addEventListener('click', e => {
        const origen = e.target.closest(SELECTOR_DISPARADOR);
        if (!origen) return;
        e.preventDefault();
        abrirModal(origen);
    });
})();
