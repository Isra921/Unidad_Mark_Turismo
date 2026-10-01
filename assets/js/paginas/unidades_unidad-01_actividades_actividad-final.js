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
        logToConsole('[CONFIG] Segmento activo: Turismo Cultural (Estancia media 2.4 noches, alto interés en gastronomía local y artesanías).', 'info');
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
}

function onStrategyChange() {
    const sel = document.getElementById('strategySelect');
    if (!sel) return;
    const desc = sel.options[sel.selectedIndex].text;
    logToConsole(`[ESTRATEGIA] Seleccionada: ${desc}`, 'info');
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

    line.innerHTML = `<span style="color:#64748b;">[${time}]</span> <span class="${colorClass}">${text}</span>`;
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
    const packetEl = document.getElementById('netPacketAnim');
    const statusBadge = document.getElementById('workbenchStatusBadge');
    const statusText = document.getElementById('workbenchStatusText');
    const simBtn = document.getElementById('btnSimulate');

    if (simBtn) simBtn.disabled = true;
    if (statusBadge) statusBadge.classList.add('transmitting');
    if (statusText) statusText.textContent = 'Modelando escenario...';

    logToConsole('\n>>> EJECUTANDO MODELADO DE IMPACTO ESTRATÉGICO', 'header');

    setTimeout(() => {
        logToConsole('[FASE 1] Analizando elasticidad de la demanda y capacidad de absorción hotelera...', 'info');
        if (packetEl) {
            packetEl.className = 'channel-packet active-right';
            packetEl.textContent = 'MKT';
        }
    }, 400);

    setTimeout(() => {
        logToConsole('[FASE 2] Cruzando datos con indicadores OMT: Gasto medio diario y tasa de ocupación proyectada...', 'warning');
        if (packetEl) {
            packetEl.className = 'channel-packet active-left';
            packetEl.textContent = 'OMT';
        }
    }, 1300);

    setTimeout(() => {
        if (stratKey === 'desestacionalizacion') {
            logToConsole('[RESULTADO OMT] Ocupación entre semana: se eleva del 22% al 54%.', 'success');
            logToConsole('[MÉTRICA] Índice de estacionalidad anual se reduce de 2.9 a 1.4 (demanda balanceada).', 'success');
            logToConsole('[VALOR] Gasto medio diario incrementa a $2,340 MXN gracias a paquetes de experiencias de 2 noches.', 'info');
        } else if (stratKey === 'desintermediacion') {
            logToConsole('[CANAL] Venta directa pasa del 12% al 44% en 12 meses mediante incentivos de club de fidelización.', 'success');
            logToConsole('[MARGEN] Retención de tarifa neta en MiPyMEs aumenta 21 puntos porcentuales (ahorro de comisiones OTAs).', 'success');
            logToConsole('[CLIENTE] Tasa de recompra y recomendación orgánica estimada en +35%.', 'info');
        } else if (stratKey === 'encadenamiento') {
            logToConsole('[CLÚSTER REGIONAL] Efecto multiplicador del gasto turístico sube a 1.78 sobre el PIB municipal.', 'success');
            logToConsole('[CADENA DE VALOR] 38 productores agropecuarios locales integrados con compras aseguradas a restaurantes y hoteles.', 'success');
            logToConsole('[SOSTENIBILIDAD] Reducción de huella de carbono logística en un 42% (Sello Kilómetro Cero).', 'info');
        } else {
            logToConsole('[CAPACIDAD DE CARGA] Presión máxima de domingos desciende del 140% al 85% del umbral crítico.', 'success');
            logToConsole('[EXPERIENCIA] Satisfacción del visitante se incrementa a 9.2/10 al eliminar saturación en senderos y monumentos.', 'success');
            logToConsole('[CONSERVACIÓN] Plan de manejo validado por autoridades ambientales y comité comunitario.', 'info');
        }

        logToConsole('[CONCLUSIÓN] Proyección completada exitosamente bajo los estándares metodológicos de la OMT y la EST-IPN.\n', 'header');
        finalizarSimulacion();
    }, 2400);
}

function finalizarSimulacion() {
    const packetEl = document.getElementById('netPacketAnim');
    const statusBadge = document.getElementById('workbenchStatusBadge');
    const statusText = document.getElementById('workbenchStatusText');
    const simBtn = document.getElementById('btnSimulate');

    if (packetEl) {
        packetEl.className = 'channel-packet';
        packetEl.textContent = 'VALOR';
    }
    if (statusBadge) statusBadge.classList.remove('transmitting');
    if (statusText) statusText.textContent = 'Listo / Simulación finalizada';
    if (simBtn) simBtn.disabled = false;
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
    doc.rect(0, 0, anchoPagina, 26, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('INSTITUTO POLITÉCNICO NACIONAL', margen, 11);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Escuela Superior de Turismo (EST) · Unidad Politécnica', margen, 17);

    doc.setFontSize(8);
    doc.text(
        `Fecha de emisión: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        anchoPagina - margen,
        17,
        { align: 'right' }
    );

    y = 38;

    // Título del documento
    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('Dictamen de Evaluación Integradora: Caso Valle Sereno', margen, y);
    y += 4;
    doc.setDrawColor(52, 211, 153);
    doc.setLineWidth(0.8);
    doc.line(margen, y, anchoPagina - margen, y);
    y += 8;

    // Resumen institucional
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const descText = 'El presente documento certifica el desempeño del estudiante en el diagnóstico estratégico, formulación del plan de marketing turístico, interpretación de indicadores de la OMT, análisis de oferta y demanda y gobernanza del clúster regional de la Unidad 1: Encuadre empresarial.';
    const splitDesc = doc.splitTextToSize(descText, anchoContenido);
    doc.text(splitDesc, margen, y);
    y += (splitDesc.length * 5) + 6;

    // Tarjeta de Calificación
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(52, 211, 153);
    doc.roundedRect(margen, y, anchoContenido, 28, 2, 2, 'FD');

    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('DESEMPEÑO GLOBAL DE LA UNIDAD 1', anchoPagina / 2, y + 7, { align: 'center' });

    doc.setFontSize(20);
    doc.text(`${calificacion} / 100`, anchoPagina / 2, y + 17, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const mensajeResultado = calificacion >= 80 ? 'Acreditación Sobresaliente en Competencias de Marketing Turístico' : (calificacion >= 60 ? 'Acreditación Suficiente · Se sugiere repasar fundamentos' : 'Evaluación Pendiente o en Desarrollo');
    doc.text(mensajeResultado, anchoPagina / 2, y + 23, { align: 'center' });

    y += 36;

    // Desglose de retos por tema
    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Desglose de Retos Diagnósticos Evaluados', margen, y);
    y += 5;

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
        doc.roundedRect(margen, y, anchoContenido, 13, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(item.tema, margen + 4, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(item.desc, margen + 4, y + 9.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(rColor[0], rColor[1], rColor[2]);
        doc.text(estadoStr, anchoPagina - margen - 4, y + 7.5, { align: 'right' });

        y += 16;
    });

    y += 4;

    // Conclusiones y recomendaciones formativas
    doc.setTextColor(6, 35, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('Observaciones y Recomendaciones Metodológicas', margen, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const conclusion = 'La estructuración del plan de marketing en el sector turístico demanda un entendimiento sistémico: no es suficiente incentivar la demanda, sino que debe asegurarse la capacidad de carga del destino, la retención de valor en la economía local mediante clústeres productivos y la profesionalización operativa de las MiPyMEs conforme a los lineamientos de la Organización Mundial del Turismo (OMT).';
    const splitConc = doc.splitTextToSize(conclusion, anchoContenido);
    doc.text(splitConc, margen, y);

    // Pie de página
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
        'Polilibro Digital de Marketing · Escuela Superior de Turismo · Instituto Politécnico Nacional © 2026',
        anchoPagina / 2,
        altoPagina - 10,
        { align: 'center' }
    );

    doc.save('Evaluacion_Integradora_Unidad1_Marketing.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
    logToConsole('[ECOSISTEMA LISTO] Plataforma de simulación de marketing y clúster inicializada para Valle Sereno.', 'success');
});
