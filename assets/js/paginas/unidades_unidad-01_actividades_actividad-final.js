// ==========================================================================
// ACTIVIDAD FINAL · EVALUACIÓN INTEGRADORA DE MARKETING TURÍSTICO (EST - IPN)
// Simulador de toma de decisiones, retos diagnósticos y generador de informe PDF
// ==========================================================================

let currentSegment = 'cultural';
let isSimulating = false;
const evalState = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
};

// --------------------------------------------------------------------------
// MATRIZ DE ESCENARIOS Y MODELADO DE IMPACTO
// --------------------------------------------------------------------------

const ESCENARIOS = {
    cultural: {
        desestacionalizacion: {
            ocupacion: { val: "54%", delta: "+32 pp", deltaClass: "kpi-delta--up", bar: 54, sub: "Mitigación del valle de estacionalidad entre semana" },
            gasto: { val: "$2,340 MXN", delta: "+65%", deltaClass: "kpi-delta--up", bar: 78, sub: "Conversión de excursionistas en turistas con pernocta" },
            ventaDirecta: { val: "28%", delta: "+16 pp", deltaClass: "kpi-delta--up", bar: 28, sub: "Reducción de dependencia de comisiones OTAs" },
            estacionalidad: { val: "1.4", delta: "Equilibrado", deltaClass: "kpi-delta--ok", bar: 82, sub: "Flujo sostenible y protección de capacidad de carga" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 2 · Tema 1.2 OMT):",
            recText: "La simulación demuestra el principio metodológico de la OMT: no se debe prohibir el acceso a visitantes, sino convertir excursionistas en turistas con pernocta mediante rutas patrimoniales nocturnas y festivales gastronómicos entre semana (revisa el Reto 2 a continuación).",
            logs: [
                "[FASE 1] Analizando elasticidad de demanda cultural: alta disposición a pernoctar con agenda de museos.",
                "[FASE 2] Aplicando indicador OMT: Gasto medio pasa de $1,420 (excursionista) a $2,340 MXN (turista con pernocta).",
                "[RESULTADO] Ocupación de lunes a jueves sube al 54%. Índice de estacionalidad se reduce de 2.9 a 1.4.",
                "[CONSEJO EVALUACIÓN] La desestacionalización incrementa el factor de ocupación sin rebasar la capacidad física."
            ]
        },
        desintermediacion: {
            ocupacion: { val: "42%", delta: "+20 pp", deltaClass: "kpi-delta--up", bar: 42, sub: "Atracción sostenida mediante canales propios" },
            gasto: { val: "$2,180 MXN", delta: "+53%", deltaClass: "kpi-delta--up", bar: 72, sub: "Mayor gasto en gastronomía y artesanías locales" },
            ventaDirecta: { val: "46%", delta: "+34 pp", deltaClass: "kpi-delta--up", bar: 46, sub: "Ahorro del 25% en comisiones a OTAs foráneas" },
            estacionalidad: { val: "1.9", delta: "Moderado", deltaClass: "kpi-delta--ok", bar: 68, sub: "Mayor control sobre el calendario de reservas" },
            recTitle: "Hallazgo clave para tu evaluación (Retos 1 y 3 · Temas 1.1 y 1.3):",
            recText: "El motor de reserva propio y el club de fidelización permiten a hoteles boutique retener el 25% de comisión que cobran las OTAs, logrando una estrategia omnicanal sólida conforme a los objetivos SMART (aplica esto en los Retos 1 y 3).",
            logs: [
                "[FASE 1] Modelando canal de distribución: migración de reservas desde OTAs hacia plataforma web oficial.",
                "[FASE 2] Campaña de marketing relacional y club de beneficios para visitantes de centros históricos.",
                "[RESULTADO] Venta directa MiPyMEs escala al 46%. Margen neto de operación recupera 21 puntos porcentuales.",
                "[CONSEJO EVALUACIÓN] Un objetivo SMART debe ser cuantitativo y temporal: +25% de venta directa en 18 meses."
            ]
        },
        encadenamiento: {
            ocupacion: { val: "48%", delta: "+26 pp", deltaClass: "kpi-delta--up", bar: 48, sub: "Flujo impulsado por turismo gastronómico con identidad" },
            gasto: { val: "$2,520 MXN", delta: "+77%", deltaClass: "kpi-delta--up", bar: 84, sub: "Consumo de productos con denominación de origen" },
            ventaDirecta: { val: "38%", delta: "+26 pp", deltaClass: "kpi-delta--up", bar: 38, sub: "Venta combinada hotel + catas de productores" },
            estacionalidad: { val: "1.6", delta: "Equilibrado", deltaClass: "kpi-delta--ok", bar: 76, sub: "Eventos gastronómicos distribuidos en todo el año" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 5 · Tema 1.5 Enfoque Industrial):",
            recText: "El enfoque industrial del turismo postula que el valor debe irrigar a la economía local. El sello 'Kilómetro Cero' encadena a agricultores y queseros locales con los restaurantes turísticos, multiplicando el PIB regional (aplica esto en el Reto 5).",
            logs: [
                "[FASE 1] Articulando mesa del Clúster: integración de 38 productores agropecuarios locales.",
                "[FASE 2] Sello 'Kilómetro Cero': compras garantizadas de restaurantes reducen huella de carbono en 42%.",
                "[RESULTADO] Gasto diario alcanza $2,520 MXN. Efecto multiplicador local del turismo sube a 1.78.",
                "[CONSEJO EVALUACIÓN] Los encadenamientos hacia atrás reducen la fuga de divisas y fortalecen la identidad."
            ]
        },
        capacidad_carga: {
            ocupacion: { val: "46%", delta: "+24 pp", deltaClass: "kpi-delta--up", bar: 46, sub: "Distribución armónica sin congestión en el centro histórico" },
            gasto: { val: "$2,250 MXN", delta: "+58%", deltaClass: "kpi-delta--up", bar: 75, sub: "Satisfacción superior incentiva mayor estancia" },
            ventaDirecta: { val: "34%", delta: "+22 pp", deltaClass: "kpi-delta--up", bar: 34, sub: "Reservas con turnos asignados en plataforma oficial" },
            estacionalidad: { val: "1.3", delta: "Óptimo", deltaClass: "kpi-delta--ok", bar: 88, sub: "Presión máxima dominical desciende al 82%" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 4 · Tema 1.4 Oferta y Demanda):",
            recText: "La capacidad de carga no se resuelve con prohibiciones abruptas, sino mediante gestión inteligente de flujos: circuitos escalonados, reservas horarias y transporte perimetral para proteger el patrimonio (aplica esto en el Reto 4).",
            logs: [
                "[FASE 1] Cálculo de capacidad de carga física y psicológica en calles y templos virreinales.",
                "[FASE 2] Implementación de circuitos escalonados y estacionamientos disuasorios con transporte eléctrico.",
                "[RESULTADO] Índice de saturación dominical baja del 140% al 82%. Calificación del visitante sube a 9.3/10.",
                "[CONSEJO EVALUACIÓN] La oferta rígida debe responder con gestión inteligente de flujos temporales y espaciales."
            ]
        }
    },
    ecoturismo: {
        desestacionalizacion: {
            ocupacion: { val: "50%", delta: "+28 pp", deltaClass: "kpi-delta--up", bar: 50, sub: "Retiros de bienestar y senderismo de martes a jueves" },
            gasto: { val: "$2,150 MXN", delta: "+51%", deltaClass: "kpi-delta--up", bar: 71, sub: "Pernocta en cabañas y contratación de guías locales" },
            ventaDirecta: { val: "35%", delta: "+23 pp", deltaClass: "kpi-delta--up", bar: 35, sub: "Alianzas comunitarias y plataformas sostenibles" },
            estacionalidad: { val: "1.5", delta: "Equilibrado", deltaClass: "kpi-delta--ok", bar: 80, sub: "Distribución constante de grupos pequeños" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 2 · Tema 1.2 OMT):",
            recText: "El ecoturismo entre semana atrae practicantes de senderismo y retiros de bienestar, sustituyendo excursionistas dominicales masivos por estancias de 2 a 3 noches con guías comunitarios (revisa el Reto 2 a continuación).",
            logs: [
                "[FASE 1] Modelando demanda de bajo impacto: ecoturistas y practicantes de aventura suave.",
                "[FASE 2] Creación de paquetes entre semana: cabañas bioclimáticas + senderismo interpretativo.",
                "[RESULTADO] Ocupación semanal sube al 50%. Gasto promedio diario se sitúa en $2,150 MXN.",
                "[CONSEJO EVALUACIÓN] El turismo sostenible sustituye masificación por valor añadido y estancia prolongada."
            ]
        },
        desintermediacion: {
            ocupacion: { val: "40%", delta: "+18 pp", deltaClass: "kpi-delta--up", bar: 40, sub: "Canales cooperativos y marketing digital directo" },
            gasto: { val: "$2,080 MXN", delta: "+46%", deltaClass: "kpi-delta--up", bar: 69, sub: "Derrama directa en ejidos y cooperativas" },
            ventaDirecta: { val: "52%", delta: "+40 pp", deltaClass: "kpi-delta--up", bar: 52, sub: "Independencia de agencias mayoristas foráneas" },
            estacionalidad: { val: "1.8", delta: "Moderado", deltaClass: "kpi-delta--ok", bar: 70, sub: "Reservas confirmadas con pago de anticipo" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 3 · Tema 1.3 Empresa Turística):",
            recText: "Las cooperativas ecoturísticas MiPyME se benefician al máximo de canales directos y reservas comunitarias, reduciendo su vulnerabilidad ante intermediarios globales (revisa el Reto 3 a continuación).",
            logs: [
                "[FASE 1] Evaluación de canales: desintermediación mediante portal cooperativo de ecoturismo.",
                "[FASE 2] Adopción de pasarela de pago directa con confirmación vía mensajería instantánea.",
                "[RESULTADO] Venta directa ejidal alcanza el 52%. Cero fuga de comisiones abusivas.",
                "[CONSEJO EVALUACIÓN] La omnicanalidad permite a las MiPyMEs controlar su relación con el cliente."
            ]
        },
        encadenamiento: {
            ocupacion: { val: "45%", delta: "+23 pp", deltaClass: "kpi-delta--up", bar: 45, sub: "Turismo regenerativo con compras locales" },
            gasto: { val: "$2,400 MXN", delta: "+69%", bar: 80, sub: "Alimentación orgánica provista por huertos familiares" },
            ventaDirecta: { val: "42%", delta: "+30 pp", deltaClass: "kpi-delta--up", bar: 42, sub: "Experiencias de campo integradas al hospedaje" },
            estacionalidad: { val: "1.5", delta: "Equilibrado", deltaClass: "kpi-delta--ok", bar: 80, sub: "Circuitos agroecológicos sostenidos" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 5 · Tema 1.5 Enfoque Industrial):",
            recText: "El encadenamiento en áreas naturales involucra ejidos, artesanos de fibras vegetales y guías certificados por NOM-09-TUR, asegurando que la derrama beneficie directamente a los custodios de la reserva (revisa el Reto 5).",
            logs: [
                "[FASE 1] Mapeo de proveedores en la microcuenca: 24 familias rurales integradas a la cadena turística.",
                "[FASE 2] Menús de degustación silvestre con productos de recolección sustentable y miel orgánica.",
                "[RESULTADO] Gasto diario alcanza $2,400 MXN. Retención comunitaria del ingreso sube al 89%.",
                "[CONSEJO EVALUACIÓN] El clúster turístico rural activa sectores primarios tradicionalmente marginados."
            ]
        },
        capacidad_carga: {
            ocupacion: { val: "44%", delta: "+22 pp", deltaClass: "kpi-delta--up", bar: 44, sub: "Grupos reducidos con reservación obligatoria" },
            gasto: { val: "$2,200 MXN", delta: "+55%", deltaClass: "kpi-delta--up", bar: 73, sub: "Tarifa premium por exclusividad e interpretación" },
            ventaDirecta: { val: "38%", delta: "+26 pp", deltaClass: "kpi-delta--up", bar: 38, sub: "Cupos controlados en plataforma centralizada" },
            estacionalidad: { val: "1.2", delta: "Óptimo", deltaClass: "kpi-delta--ok", bar: 92, sub: "Cero impacto en ecosistemas frágiles" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 4 · Tema 1.4 Oferta y Demanda):",
            recText: "En ecoturismo, la capacidad de carga ecológica es inviolable: grupos reducidos de máximo 12 personas por sendero evitan la erosión y garantizan una experiencia de alto valor interpretativo (revisa el Reto 4).",
            logs: [
                "[FASE 1] Monitoreo de impacto biológico en senderos: umbral de 120 visitantes/día por cuenca.",
                "[FASE 2] Sistema de cupos digitales escalonados con registro previo y guías certificados.",
                "[RESULTADO] Cero erosión en lecho de río. Grado de conservación biológica mantenido al 100%.",
                "[CONSEJO EVALUACIÓN] La capacidad de carga ecológica debe primar sobre el volumen bruto de visitantes."
            ]
        }
    },
    bleisure: {
        desestacionalizacion: {
            ocupacion: { val: "62%", delta: "+40 pp", deltaClass: "kpi-delta--up", bar: 62, sub: "Profesionales remotos hospedados de lunes a viernes" },
            gasto: { val: "$2,650 MXN", delta: "+86%", deltaClass: "kpi-delta--up", bar: 88, sub: "Consumo continuo en cafeterías y coworking" },
            ventaDirecta: { val: "32%", delta: "+20 pp", deltaClass: "kpi-delta--up", bar: 32, sub: "Contratos de estancia media con empresas" },
            estacionalidad: { val: "1.2", delta: "Excelente", deltaClass: "kpi-delta--ok", bar: 92, sub: "Inversión positiva de la curva de ocupación" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 2 · Tema 1.2 OMT):",
            recText: "El segmento Bleisure (Business + Leisure) es la solución más potente para desestacionalizar: los profesionales remotos pernoctan de lunes a jueves en hoteles boutique con alta velocidad de conexión (revisa el Reto 2 a continuación).",
            logs: [
                "[FASE 1] Segmentando teletrabajadores y nómadas digitales de la Ciudad de México y Toluca.",
                "[FASE 2] Habilitación de infraestructura: internet simétrico de alta velocidad y estaciones de coworking.",
                "[RESULTADO] Ocupación de lunes a jueves alcanza el 62%. El valle estacional desaparece por completo.",
                "[CONSEJO EVALUACIÓN] La innovación de producto turístico transforma la temporalidad tradicional del destino."
            ]
        },
        desintermediacion: {
            ocupacion: { val: "48%", delta: "+26 pp", deltaClass: "kpi-delta--up", bar: 48, sub: "Reservas directas mediante planes corporativos" },
            gasto: { val: "$2,450 MXN", delta: "+72%", deltaClass: "kpi-delta--up", bar: 81, sub: "Facturación directa deducible y servicios extra" },
            ventaDirecta: { val: "48%", delta: "+36 pp", deltaClass: "kpi-delta--up", bar: 48, sub: "Lealtad a través de membresías mensuales" },
            estacionalidad: { val: "1.6", delta: "Equilibrado", deltaClass: "kpi-delta--ok", bar: 76, sub: "Garantía de flujo financiero predecible" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 1 y 3 · Temas 1.1 y 1.3):",
            recText: "Los trabajadores remotos valoran tarifas corporativas semanales y facturación directa, eludiendo comisiones de intermediarios y asegurando flujos estables de caja para las MiPyMEs (aplica esto en los Retos 1 y 3).",
            logs: [
                "[FASE 1] Lanzamiento de membresía 'Work & Serenity' para nómadas corporativos.",
                "[FASE 2] Convenios directos con empresas tecnológicas: deducibilidad fiscal y facturación unificada.",
                "[RESULTADO] Venta directa sube al 48%. Reducción drástica en costos de intermediación.",
                "[CONSEJO EVALUACIÓN] La segmentación B2B y B2C diferenciada fortalece la rentabilidad hotelera."
            ]
        },
        encadenamiento: {
            ocupacion: { val: "52%", delta: "+30 pp", deltaClass: "kpi-delta--up", bar: 52, sub: "Alianzas con negocios urbanos no hoteleros" },
            gasto: { val: "$2,720 MXN", delta: "+91%", deltaClass: "kpi-delta--up", bar: 90, sub: "Consumo diversificado en lavanderías, gimnasios y café" },
            ventaDirecta: { val: "36%", delta: "+24 pp", deltaClass: "kpi-delta--up", bar: 36, sub: "Pases integrados para toda la red de servicios" },
            estacionalidad: { val: "1.4", delta: "Equilibrado", deltaClass: "kpi-delta--ok", bar: 82, sub: "Demanda económica activa los 365 días del año" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 5 · Tema 1.5 Enfoque Industrial):",
            recText: "El gasto del nómada digital irriga a cafeterías de especialidad, espacios de coworking locales, lavanderías y transporte, logrando el mayor multiplicador económico del destino (revisa el Reto 5 a continuación).",
            logs: [
                "[FASE 1] Articulación multisectorial del Clúster: comercio minorista + cafeterías + hospedaje boutique.",
                "[FASE 2] Pase digital municipal con descuentos cruzados en gimnasios, talleres artesanales y gastronomía.",
                "[RESULTADO] Gasto diario marca récord de $2,720 MXN. Multiplicador local alcanza 1.92 sobre la economía de barrio.",
                "[CONSEJO EVALUACIÓN] El enfoque industrial demuestra que el turismo dinamiza sectores de servicios no tradicionales."
            ]
        },
        capacidad_carga: {
            ocupacion: { val: "50%", delta: "+28 pp", deltaClass: "kpi-delta--up", bar: 50, sub: "Uso de infraestructura urbana en horarios diurnos" },
            gasto: { val: "$2,500 MXN", delta: "+76%", deltaClass: "kpi-delta--up", bar: 83, sub: "Consumo respetuoso y sin presión sobre atractivos" },
            ventaDirecta: { val: "35%", delta: "+23 pp", deltaClass: "kpi-delta--up", bar: 35, sub: "Gestión de estancia media y baja rotación" },
            estacionalidad: { val: "1.3", delta: "Óptimo", deltaClass: "kpi-delta--ok", bar: 88, sub: "Aplanamiento total de la curva de saturación" },
            recTitle: "Hallazgo clave para tu evaluación (Reto 4 · Tema 1.4 Oferta y Demanda):",
            recText: "Los trabajadores remotos no saturan los atractivos en horas pico dominicales: utilizan la infraestructura urbana en horarios de baja concurrencia, maximizando el uso de la planta turística existente (revisa el Reto 4).",
            logs: [
                "[FASE 1] Evaluación del impacto urbano: uso de espacios públicos durante horas valle de lunes a jueves.",
                "[FASE 2] Integración armónica con residentes locales sin gentrificación ni desplazamiento vecinal.",
                "[RESULTADO] Grado de saturación de atractivos dominicales se mantiene por debajo del 80%.",
                "[CONSEJO EVALUACIÓN] Desconcentrar la demanda temporalmente es la estrategia más eficaz contra el 'overtourism'."
            ]
        }
    }
};

// --------------------------------------------------------------------------
// 1. CONTROL DEL SIMULADOR ESTRATÉGICO
// --------------------------------------------------------------------------

function setSegmento(seg) {
    if (isSimulating) return;
    currentSegment = seg;

    const btnCult = document.getElementById('btnSegCultural');
    const btnEco = document.getElementById('btnSegEco');
    const btnBleis = document.getElementById('btnSegBleisure');
    const nodeTitle = document.getElementById('segmentNodeTitle');
    const nodeSub = document.getElementById('segmentNodeSub');
    const channelBadge = document.getElementById('channelProtocolBadge');

    [btnCult, btnEco, btnBleis].forEach(btn => btn?.classList.remove('active'));

    if (seg === 'cultural') {
        btnCult?.classList.add('active');
        if (nodeTitle) nodeTitle.textContent = 'Turista Cultural';
        if (nodeSub) nodeSub.textContent = 'Patrimonio & Gastronomía';
        if (channelBadge) channelBadge.textContent = 'CANAL: Experiencias & Venta Directa';
        logToConsole('[CONFIG] Segmento activo: Turismo Cultural (Estancia media 2.4 noches, alto interés en gastronomía y artesanías).', 'info');
    } else if (seg === 'ecoturismo') {
        btnEco?.classList.add('active');
        if (nodeTitle) nodeTitle.textContent = 'Ecoturista / Aventura';
        if (nodeSub) nodeSub.textContent = 'Naturaleza & Bienestar';
        if (channelBadge) channelBadge.textContent = 'CANAL: Cooperativas & Plataformas Sostenibles';
        logToConsole('[CONFIG] Segmento activo: Ecoturismo & Bienestar (Grupos reducidos, bajo impacto ecológico, alta valoración de guías locales).', 'info');
    } else {
        btnBleis?.classList.add('active');
        if (nodeTitle) nodeTitle.textContent = 'Nómada / Bleisure';
        if (nodeSub) nodeSub.textContent = 'Trabajo Remoto & Ocio';
        if (channelBadge) channelBadge.textContent = 'CANAL: Reservas Flexibles & Co-working';
        logToConsole('[CONFIG] Segmento activo: Bleisure y Nómadas Digitales (Largas estancias entre semana, consumo recurrente en cafeterías y posadas).', 'info');
    }

    actualizarMetricas(false);
}

function onStrategyChange() {
    if (isSimulating) return;
    const sel = document.getElementById('strategySelect');
    if (!sel) return;
    const desc = sel.options[sel.selectedIndex].text;
    logToConsole(`[ESTRATEGIA] Seleccionada: ${desc}`, 'info');
    actualizarMetricas(false);
}

function actualizarMetricas(animate = false) {
    const sel = document.getElementById('strategySelect');
    const stratKey = sel ? sel.value : 'desestacionalizacion';
    const data = ESCENARIOS[currentSegment]?.[stratKey] || ESCENARIOS.cultural.desestacionalizacion;

    // Actualizar Ocupación
    const valOcupacion = document.getElementById('valOcupacion');
    const deltaOcupacion = document.getElementById('deltaOcupacion');
    const barOcupacion = document.getElementById('barOcupacion');
    const subOcupacion = document.getElementById('subOcupacion');
    if (valOcupacion) valOcupacion.textContent = data.ocupacion.val;
    if (deltaOcupacion) {
        deltaOcupacion.textContent = data.ocupacion.delta;
        deltaOcupacion.className = `kpi-delta ${data.ocupacion.deltaClass}`;
    }
    if (barOcupacion) barOcupacion.style.width = `${data.ocupacion.bar}%`;
    if (subOcupacion) subOcupacion.textContent = data.ocupacion.sub;

    // Actualizar Gasto
    const valGasto = document.getElementById('valGasto');
    const deltaGasto = document.getElementById('deltaGasto');
    const barGasto = document.getElementById('barGasto');
    const subGasto = document.getElementById('subGasto');
    if (valGasto) valGasto.textContent = data.gasto.val;
    if (deltaGasto) {
        deltaGasto.textContent = data.gasto.delta;
        deltaGasto.className = `kpi-delta ${data.gasto.deltaClass}`;
    }
    if (barGasto) barGasto.style.width = `${data.gasto.bar}%`;
    if (subGasto) subGasto.textContent = data.gasto.sub;

    // Actualizar Venta Directa
    const valVentaDirecta = document.getElementById('valVentaDirecta');
    const deltaVentaDirecta = document.getElementById('deltaVentaDirecta');
    const barVentaDirecta = document.getElementById('barVentaDirecta');
    const subVentaDirecta = document.getElementById('subVentaDirecta');
    if (valVentaDirecta) valVentaDirecta.textContent = data.ventaDirecta.val;
    if (deltaVentaDirecta) {
        deltaVentaDirecta.textContent = data.ventaDirecta.delta;
        deltaVentaDirecta.className = `kpi-delta ${data.ventaDirecta.deltaClass}`;
    }
    if (barVentaDirecta) barVentaDirecta.style.width = `${data.ventaDirecta.bar}%`;
    if (subVentaDirecta) subVentaDirecta.textContent = data.ventaDirecta.sub;

    // Actualizar Estacionalidad
    const valEstacionalidad = document.getElementById('valEstacionalidad');
    const deltaEstacionalidad = document.getElementById('deltaEstacionalidad');
    const barEstacionalidad = document.getElementById('barEstacionalidad');
    const subEstacionalidad = document.getElementById('subEstacionalidad');
    if (valEstacionalidad) valEstacionalidad.textContent = data.estacionalidad.val;
    if (deltaEstacionalidad) {
        deltaEstacionalidad.textContent = data.estacionalidad.delta;
        deltaEstacionalidad.className = `kpi-delta ${data.estacionalidad.deltaClass}`;
    }
    if (barEstacionalidad) barEstacionalidad.style.width = `${data.estacionalidad.bar}%`;
    if (subEstacionalidad) subEstacionalidad.textContent = data.estacionalidad.sub;

    // Actualizar Caja de Recomendación Didáctica
    const recTitle = document.getElementById('recTitle');
    const recText = document.getElementById('recText');
    const recBox = document.getElementById('simRecommendationBox');
    if (recTitle) recTitle.textContent = data.recTitle;
    if (recText) recText.innerHTML = data.recText;

    if (animate && recBox) {
        recBox.style.transform = 'scale(1.01)';
        recBox.style.borderColor = 'var(--accent)';
        setTimeout(() => {
            recBox.style.transform = '';
            recBox.style.borderColor = '';
        }, 600);
    }
}

function logToConsole(text, type = 'normal') {
    const consoleBody = document.getElementById('netConsoleBody');
    if (!consoleBody) return;

    const time = new Date().toLocaleTimeString('es-MX', { hour12: false });
    const line = document.createElement('div');

    let colorClass = '';
    if (type === 'info') colorClass = 'log-info';
    else if (type === 'success') colorClass = 'log-success';
    else if (type === 'warning') colorClass = 'log-warning';
    else if (type === 'header') colorClass = 'log-header';

    line.innerHTML = `<span class="log-time">[${time}]</span> <span class="${colorClass}">${text}</span>`;
    consoleBody.appendChild(line);
    consoleBody.scrollTop = consoleBody.scrollHeight;
}

function clearConsole() {
    const consoleBody = document.getElementById('netConsoleBody');
    if (consoleBody) {
        consoleBody.innerHTML = '<div><span class="log-info">[INIT]</span> Consola limpia. Configura los parámetros y haz clic en "Proyectar impacto estratégico".</div>';
    }
}

function simularEstrategia() {
    if (isSimulating) return;
    isSimulating = true;

    const strategySelect = document.getElementById('strategySelect');
    const stratKey = strategySelect ? strategySelect.value : 'desestacionalizacion';
    const stratData = ESCENARIOS[currentSegment]?.[stratKey] || ESCENARIOS.cultural.desestacionalizacion;

    const packetEl = document.getElementById('netPacketAnim');
    const statusBadge = document.getElementById('workbenchStatusBadge');
    const statusText = document.getElementById('workbenchStatusText');
    const simBtn = document.getElementById('btnSimulate');
    const kpiCards = document.querySelectorAll('.kpi-card');

    if (simBtn) {
        simBtn.disabled = true;
        simBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Modelando escenario...';
    }
    if (statusBadge) statusBadge.classList.add('transmitting');
    if (statusText) statusText.textContent = 'Modelando escenario...';

    // Efecto de pulso en las tarjetas KPI mientras se procesa
    kpiCards.forEach(card => card.classList.add('simulating'));

    logToConsole('\n>>> EJECUTANDO MODELADO DE IMPACTO ESTRATÉGICO', 'header');

    setTimeout(() => {
        logToConsole(stratData.logs[0] || '[FASE 1] Analizando elasticidad de la demanda y capacidad de absorción...', 'info');
        if (packetEl) {
            packetEl.className = 'channel-packet active-right';
            packetEl.textContent = 'MKT';
        }
    }, 400);

    setTimeout(() => {
        logToConsole(stratData.logs[1] || '[FASE 2] Cruzando datos con indicadores OMT: Gasto medio y tasa de ocupación...', 'warning');
        if (packetEl) {
            packetEl.className = 'channel-packet active-left';
            packetEl.textContent = 'OMT';
        }
    }, 1300);

    setTimeout(() => {
        logToConsole(stratData.logs[2] || '[RESULTADO] Proyección calculada con éxito.', 'success');
        logToConsole(stratData.logs[3] || '[CONCLUSIÓN] Parámetros listos para contrastar con los retos.', 'info');
        logToConsole('[FINALIZADO] Impacto estratégico proyectado en el tablero de KPIs y recomendaciones formativas.\n', 'header');
        
        actualizarMetricas(true);
        finalizarSimulacion();
    }, 2300);
}

function finalizarSimulacion() {
    const packetEl = document.getElementById('netPacketAnim');
    const statusBadge = document.getElementById('workbenchStatusBadge');
    const statusText = document.getElementById('workbenchStatusText');
    const simBtn = document.getElementById('btnSimulate');
    const kpiCards = document.querySelectorAll('.kpi-card');

    if (packetEl) {
        packetEl.className = 'channel-packet';
        packetEl.textContent = 'VALOR';
    }
    if (statusBadge) statusBadge.classList.remove('transmitting');
    if (statusText) statusText.textContent = 'Listo / Simulación finalizada';
    if (simBtn) {
        simBtn.disabled = false;
        simBtn.innerHTML = '<i class="fas fa-chart-pie"></i> Proyectar impacto estratégico';
    }
    kpiCards.forEach(card => card.classList.remove('simulating'));
    isSimulating = false;
}

// --------------------------------------------------------------------------
// 2. GESTIÓN DE RETOS DIAGNÓSTICOS
// --------------------------------------------------------------------------

function responderReto(btn, challengeId, esCorrecta, feedbackText) {
    const parentContainer = btn.closest('.challenge-item');
    if (!parentContainer) return;

    evalState[challengeId] = esCorrecta;

    parentContainer.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('correct', 'incorrect');
    });

    if (esCorrecta) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('incorrect');
    }

    const feedbackBanner = parentContainer.querySelector('.feedback-banner');
    if (feedbackBanner) {
        feedbackBanner.className = 'feedback-banner show ' + (esCorrecta ? 'success' : 'error');
        feedbackBanner.innerHTML = `
            <i class="fas ${esCorrecta ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}"></i>
            <div>
                <strong>${esCorrecta ? '¡Decisión estratégica correcta!' : 'Decisión estratégica subóptima:'}</strong> 
                ${feedbackText}
            </div>
        `;
    }
}

// --------------------------------------------------------------------------
// 3. GENERADOR DE INFORME TÉCNICO EN PDF (EST - IPN)
// --------------------------------------------------------------------------

function generarPDFFinal() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('Cargando la librería de generación de PDF. Por favor reintenta en un momento.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const margen = 18;
    const anchoPagina = doc.internal.pageSize.getWidth();
    const altoPagina = doc.internal.pageSize.getHeight();
    const anchoContenido = anchoPagina - (margen * 2);
    let y = 0;

    // Calcular puntaje
    const retosRespondidos = Object.values(evalState).filter(val => val !== null).length;
    const retosCorrectos = Object.values(evalState).filter(val => val === true).length;
    const calificacion = retosRespondidos > 0 ? Math.round((retosCorrectos / 5) * 100) : 0;

    // Encabezado institucional
    doc.setFillColor(6, 35, 25); // Verde botella institucional
    doc.rect(0, 0, anchoPagina, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('INSTITUTO POLITÉCNICO NACIONAL', margen, 10);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Escuela Superior de Turismo (EST) · Plan de Marketing · Unidad 1: Encuadre empresarial', margen, 16);

    doc.setFontSize(8);
    doc.text(
        `Fecha de emisión: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        anchoPagina - margen,
        16,
        { align: 'right' }
    );

    y = 33;

    // Título del documento
    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Dictamen de Evaluación Integradora y Simulación: Caso Valle Sereno', margen, y);
    y += 3.5;
    doc.setDrawColor(52, 211, 153);
    doc.setLineWidth(0.8);
    doc.line(margen, y, anchoPagina - margen, y);
    y += 6.5;

    // Resumen institucional
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const descText = 'El presente dictamen certifica el desempeño del estudiante en el modelado de estrategias de marketing, interpretación de indicadores de la OMT, análisis de oferta y demanda, omnicanalidad y gobernanza del clúster regional de la Unidad 1.';
    const splitDesc = doc.splitTextToSize(descText, anchoContenido);
    doc.text(splitDesc, margen, y);
    y += (splitDesc.length * 4.2) + 4;

    // Tarjeta de Calificación y Escenario Simulado en 2 columnas
    const colWidth = (anchoContenido - 6) / 2;

    // Columna 1: Tarjeta de Calificación
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(52, 211, 153);
    doc.roundedRect(margen, y, colWidth, 26, 2, 2, 'FD');

    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CALIFICACIÓN DE RETOS DIAGNÓSTICOS', margen + (colWidth / 2), y + 6, { align: 'center' });

    doc.setFontSize(18);
    doc.text(`${calificacion} / 100`, margen + (colWidth / 2), y + 15, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const mensajeResultado = calificacion >= 80 ? 'Acreditación Sobresaliente' : (calificacion >= 60 ? 'Acreditación Suficiente' : 'Evaluación en Progreso');
    doc.text(mensajeResultado, margen + (colWidth / 2), y + 21, { align: 'center' });

    // Columna 2: Tarjeta del Escenario Simulado
    const selStrategy = document.getElementById('strategySelect');
    const stratKey = selStrategy ? selStrategy.value : 'desestacionalizacion';
    const stratObj = ESCENARIOS[currentSegment]?.[stratKey] || ESCENARIOS.cultural.desestacionalizacion;
    const segNombre = currentSegment === 'cultural' ? 'Turismo Cultural' : (currentSegment === 'ecoturismo' ? 'Ecoturismo' : 'Bleisure');

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margen + colWidth + 6, y, colWidth, 26, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('ESCENARIO MODELADO EN SIMULADOR', margen + colWidth + 10, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Segmento analizado: ${segNombre}`, margen + colWidth + 10, y + 10.5);
    doc.text(`Ocupación proyectada: ${stratObj.ocupacion.val} (${stratObj.ocupacion.delta})`, margen + colWidth + 10, y + 14.5);
    doc.text(`Gasto medio diario: ${stratObj.gasto.val} · Venta Directa: ${stratObj.ventaDirecta.val}`, margen + colWidth + 10, y + 18.5);
    doc.text(`Índice de estacionalidad resultante: ${stratObj.estacionalidad.val} (${stratObj.estacionalidad.delta})`, margen + colWidth + 10, y + 22.5);

    y += 32;

    // Desglose de retos por tema
    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('Desglose de Retos Diagnósticos Evaluados', margen, y);
    y += 4.5;

    const temasRetos = [
        { id: 1, tema: 'Tema 1.1: Fundamentos de Plan de Marketing', desc: 'Objetivos SMART y estrategia de diferenciación para hotel boutique.' },
        { id: 2, tema: 'Tema 1.2: Notas de la OMT', desc: 'Diferenciación de turistas vs excursionistas y desestacionalización.' },
        { id: 3, tema: 'Tema 1.3: Empresa Turística', desc: 'Estrategia omnicanal y desintermediación de OTAs para MiPyMEs.' },
        { id: 4, tema: 'Tema 1.4: Análisis de la Oferta y la Demanda', desc: 'Gestión de flujos y control de capacidad de carga en Pueblo Mágico.' },
        { id: 5, tema: 'Tema 1.5: El Enfoque Industrial del Turismo', desc: 'Gobernanza del clúster regional y efecto multiplicador local.' }
    ];

    temasRetos.forEach(item => {
        const estado = evalState[item.id];
        let estadoStr = 'Sin responder';
        let rColor = [148, 163, 184];

        if (estado === true) {
            estadoStr = 'Correcto (100%)';
            rColor = [16, 185, 129];
        } else if (estado === false) {
            estadoStr = 'Incorrecto (0%)';
            rColor = [239, 68, 68];
        }

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margen, y, anchoContenido, 12.5, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(item.tema, margen + 4, y + 4.8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(100, 116, 139);
        doc.text(item.desc, margen + 4, y + 9);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(rColor[0], rColor[1], rColor[2]);
        doc.text(estadoStr, anchoPagina - margen - 4, y + 7, { align: 'right' });

        y += 15;
    });

    y += 2;

    // Conclusiones y recomendaciones formativas
    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('Observaciones y Recomendaciones Metodológicas', margen, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const conclusion = 'La estructuración del plan de marketing turístico demanda un enfoque sistémico: el simulador demuestra cómo la oferta rígida debe responder mediante estrategias de desestacionalización, preservando la capacidad de carga del destino y reteniendo el valor económico a través del encadenamiento del clúster local conforme a las directrices de la OMT (ONU Turismo).';
    const splitConc = doc.splitTextToSize(conclusion, anchoContenido);
    doc.text(splitConc, margen, y);

    // Pie de página
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
        'Polilibro Digital de Marketing Turístico · Escuela Superior de Turismo · Instituto Politécnico Nacional © 2026',
        anchoPagina / 2,
        altoPagina - 8,
        { align: 'center' }
    );

    doc.save('Evaluacion_Integradora_Unidad1_Marketing.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarMetricas(false);
    logToConsole('[ECOSISTEMA LISTO] Plataforma de simulación de marketing y clúster inicializada para Valle Sereno.', 'success');
});
