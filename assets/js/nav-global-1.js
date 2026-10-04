// ==========================================================================
// COMPONENTE GLOBAL DE NAVEGACIÓN (.site-nav)
// --------------------------------------------------------------------------
// - El contenido del menú vive en assets/data/navegacion.json.
// - Cada página solo declara un contenedor vacío:
//     <header class="site-nav" data-componente="navegacion"></header>
// - Requiere data-manager.js (cargado antes) y <body data-root="...">.
// - Comportamiento: contracción al hacer scroll, reaparición al acercar el
//   cursor al borde superior y menú desplegable en pantallas pequeñas.
// - Los enlaces con "modal" no navegan: emiten [data-modal="<id>"] para que
//   el componente correspondiente (ej. autores-modal.js) abra su ventana.
// ==========================================================================
(function () {
    const RUTA_DATOS = 'assets/data/navegacion.json';
    const ID_MENU = 'main-navigation';
    const SELECTOR_CONTENEDOR = '[data-componente="navegacion"]';
    const ARCHIVO_INDICE = 'index.html';

    // Umbrales de comportamiento (en píxeles) y punto de quiebre móvil
    const CONFIG = {
        consultaMovil: '(max-width: 768px)',
        scrollSuperior: 15,
        zonaCursorSuperior: 50,
        margenCursorBarra: 15,
        margenCursorLateral: 20
    };

    /** Normaliza una ruta para comparar páginas (".../" equivale a ".../index.html"). */
    function normalizarRuta(href) {
        const ruta = new URL(href, window.location.href).pathname;
        return ruta.endsWith('/') ? `${ruta}${ARCHIVO_INDICE}` : ruta;
    }

    function crearIcono(clase) {
        const icono = document.createElement('i');
        icono.className = `fas ${clase}`;
        icono.setAttribute('aria-hidden', 'true');
        return icono;
    }

    /** Construye el contenido del header a partir del JSON. */
    function renderizar(contenedor, datos) {
        const rutaActual = normalizarRuta(window.location.href);

        const marca = document.createElement('a');
        marca.className = 'brand';
        marca.href = DataManager.ruta(datos.marca.url);
        marca.textContent = datos.marca.titulo;
        const subtitulo = document.createElement('small');
        subtitulo.textContent = datos.marca.subtitulo;
        marca.append(subtitulo);

        const botonMenu = document.createElement('button');
        botonMenu.className = 'nav-toggle';
        botonMenu.type = 'button';
        botonMenu.setAttribute('aria-expanded', 'false');
        botonMenu.setAttribute('aria-controls', ID_MENU);
        botonMenu.setAttribute('aria-label', datos.boton_menu);
        botonMenu.append(crearIcono('fa-bars'));

        const menu = document.createElement('nav');
        menu.id = ID_MENU;
        menu.setAttribute('aria-label', 'Navegación principal');

        datos.enlaces.forEach(enlace => {
            const a = document.createElement('a');
            a.append(crearIcono(enlace.icono), ` ${enlace.texto}`);

            if (enlace.modal) {
                a.href = `#${enlace.modal}`;
                a.dataset.modal = enlace.modal;
                a.setAttribute('aria-haspopup', 'dialog');
            } else {
                a.href = DataManager.ruta(enlace.url);
                if (normalizarRuta(a.href) === rutaActual) {
                    a.classList.add('active');
                    a.setAttribute('aria-current', 'page');
                }
            }
            menu.append(a);
        });

        contenedor.replaceChildren(marca, botonMenu, menu);
    }

    /** Comportamiento de la barra (visibilidad y menú móvil). */
    function activarComportamiento(siteNav) {
        const navToggle = siteNav.querySelector('.nav-toggle');
        const mainNavigation = siteNav.querySelector(`#${ID_MENU}`);
        const consultaMovil = window.matchMedia(CONFIG.consultaMovil);
        let pointerAtTop = false;

        function updateNavigation() {
            const atTop = window.scrollY <= CONFIG.scrollSuperior;
            const isFocused = siteNav.contains(document.activeElement);
            const isOpen = mainNavigation.classList.contains('is-open');

            const visible = consultaMovil.matches || atTop || pointerAtTop || isFocused || isOpen;
            siteNav.classList.toggle('is-hidden', !visible);
            siteNav.classList.toggle('is-at-top', atTop);
        }

        document.addEventListener('mousemove', e => {
            const rect = siteNav.getBoundingClientRect();
            pointerAtTop = (e.clientY <= CONFIG.zonaCursorSuperior) ||
                (e.clientY <= rect.bottom + CONFIG.margenCursorBarra &&
                 e.clientX >= rect.left - CONFIG.margenCursorLateral &&
                 e.clientX <= rect.right + CONFIG.margenCursorLateral);
            updateNavigation();
        }, { passive: true });

        document.documentElement.addEventListener('mouseleave', () => {
            pointerAtTop = false;
            updateNavigation();
        });

        window.addEventListener('scroll', () => {
            pointerAtTop = false;
            updateNavigation();
        }, { passive: true });

        window.addEventListener('resize', updateNavigation);
        siteNav.addEventListener('focusin', updateNavigation);
        siteNav.addEventListener('focusout', () => requestAnimationFrame(updateNavigation));

        navToggle.addEventListener('click', e => {
            e.stopPropagation();
            const open = mainNavigation.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
            updateNavigation();
        });

        mainNavigation.addEventListener('click', () => {
            mainNavigation.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            updateNavigation();
        });

        updateNavigation();
    }

    async function initNav() {
        const contenedor = document.querySelector(SELECTOR_CONTENEDOR);
        if (!contenedor) return;

        try {
            const datos = await DataManager.getArchivo(RUTA_DATOS);
            renderizar(contenedor, datos);
            activarComportamiento(contenedor);
        } catch (error) {
            console.error(`[Navegación] ${error.archivo || RUTA_DATOS}: ${error.message}`);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNav);
    } else {
        initNav();
    }
})();
