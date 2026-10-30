/**
 * Com2IT - Controlador Principal de la Aplicación PWA
 * Gestiona navegación de pestañas, diagnóstico interactivo,
 * formulario de incidencias hacia el Piso Tecnológico y eventos PWA.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Registro del Service Worker
  registerServiceWorker();

  // 2. Inicialización de la Interfaz
  initPWAInstallPrompt();
  initNavigation();
  initDiagnosticsModule();
  initReportForm();
  initLiveBoard();
  initSettingsModule();
  initNetworkStatus();
});

/* -------------------------------------------------------------
 * 1. Service Worker & PWA Install
 * ----------------------------------------------------------- */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then((reg) => {
        console.log('[Com2IT PWA] Service Worker registrado en scope:', reg.scope);
      })
      .catch((err) => {
        console.error('[Com2IT PWA] Error al registrar Service Worker:', err);
      });
  }
}

let deferredInstallPrompt = null;
function initPWAInstallPrompt() {
  const installBtn = document.getElementById('btnInstallApp');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log('[PWA Install] Resultado:', outcome);
        deferredInstallPrompt = null;
        installBtn.style.display = 'none';
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[Com2IT PWA] Aplicación instalada con éxito en el dispositivo.');
    if (installBtn) installBtn.style.display = 'none';
  });
}

function initNetworkStatus() {
  const statusPill = document.getElementById('networkStatusPill');
  const statusText = document.getElementById('networkStatusText');

  const updateStatus = () => {
    const isOnline = navigator.onLine;
    if (statusPill && statusText) {
      if (isOnline) {
        statusPill.className = 'status-pill online';
        statusText.textContent = CONFIG.isConfigured() ? 'Piso Tech Conectado' : 'Online (Local)';
      } else {
        statusPill.className = 'status-pill offline';
        statusText.textContent = 'Modo Offline';
      }
    }
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();
}

/* -------------------------------------------------------------
 * 2. Navegación por Pestañas
 * ----------------------------------------------------------- */
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  function switchTab(targetId) {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));

    const activeTab = document.querySelector(`.nav-tab[data-tab="${targetId}"]`);
    const activePane = document.getElementById(targetId);

    if (activeTab && activePane) {
      activeTab.classList.add('active');
      activePane.classList.add('active');
    }

    if (targetId === 'tab-piso-tecnologico') {
      loadBoardReports();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // Escuchar links o hash (#reportar, #diagnostico)
  if (window.location.hash === '#reportar') {
    switchTab('tab-reportar');
  } else if (window.location.hash === '#tablero') {
    switchTab('tab-piso-tecnologico');
  }

  window.com2itSwitchTab = switchTab;
}

/* -------------------------------------------------------------
 * 3. Módulo 1: Diagnóstico Interactivo de Autoservicio
 * ----------------------------------------------------------- */
function initDiagnosticsModule() {
  const grid = document.getElementById('diagnosticsGrid');
  const modal = document.getElementById('diagModal');
  const modalTitle = document.getElementById('diagModalTitle');
  const modalSubtitle = document.getElementById('diagModalSubtitle');
  const modalSteps = document.getElementById('diagModalSteps');
  const modalTip = document.getElementById('diagModalTip');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnDismissModal = document.getElementById('btnDismissModal');
  const btnModalReport = document.getElementById('btnModalReport');

  let currentSelectedDiag = null;

  if (!grid || typeof DIAGNOSTICS === 'undefined') return;

  // Renderizar tarjetas de diagnóstico
  grid.innerHTML = DIAGNOSTICS.map(item => `
    <div class="diag-card" data-diag-id="${item.id}">
      <div class="diag-header">
        <div class="diag-icon-wrapper">${item.icon}</div>
        <div class="diag-title-area">
          <span class="diag-badge">${item.badge}</span>
          <h3>${item.title}</h3>
        </div>
      </div>
      <p class="diag-desc">${item.subtitle}</p>
      <div class="diag-action-text">
        <span>Comenzar diagnóstico guiado</span> &rarr;
      </div>
    </div>
  `).join('');

  // Evento al pulsar una tarjeta
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.diag-card');
    if (!card) return;
    const diagId = card.getAttribute('data-diag-id');
    const diag = DIAGNOSTICS.find(d => d.id === diagId);
    if (diag) {
      openDiagModal(diag);
    }
  });

  function openDiagModal(diag) {
    currentSelectedDiag = diag;
    modalTitle.innerHTML = `${diag.icon} ${diag.title}`;
    modalSubtitle.textContent = diag.subtitle;

    modalSteps.innerHTML = diag.steps.map(s => `
      <div class="step-item">
        <div class="step-title">
          <span class="step-num">${s.step}</span>
          <span>${s.title}</span>
        </div>
        <div class="step-detail">${s.detail}</div>
        <div class="step-check">✓ Comprobación: ${s.actionCheck}</div>
      </div>
    `).join('');

    modalTip.innerHTML = `<strong>Consejo técnico:</strong> ${diag.resolutionTip}`;
    modal.classList.add('open');
  }

  function closeDiagModal() {
    modal.classList.remove('open');
    currentSelectedDiag = null;
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeDiagModal);
  if (btnDismissModal) btnDismissModal.addEventListener('click', closeDiagModal);

  // Botón directo a reporte si no se soluciona
  if (btnModalReport) {
    btnModalReport.addEventListener('click', () => {
      if (currentSelectedDiag) {
        prefillReportFromDiagnostic(currentSelectedDiag);
      }
      closeDiagModal();
      window.com2itSwitchTab('tab-reportar');
    });
  }
}

function prefillReportFromDiagnostic(diag) {
  const selectProblema = document.getElementById('reportTipoProblema');
  const txtDesc = document.getElementById('reportDescripcion');

  if (selectProblema && diag.recommendedIssue) {
    for (let opt of selectProblema.options) {
      if (opt.value === diag.recommendedIssue || opt.text.includes(diag.title)) {
        selectProblema.value = opt.value;
        break;
      }
    }
  }

  if (txtDesc) {
    txtDesc.value = `Se completaron los pasos guiados de diagnóstico para "${diag.title}". La falla persiste y requiere intervención técnica en el puesto.`;
  }
}

/* -------------------------------------------------------------
 * 4. Módulo 2: Registro y Envío de Reportes
 * ----------------------------------------------------------- */
function initReportForm() {
  const form = document.getElementById('incidentForm');
  const alertBox = document.getElementById('formAlert');
  const btnSubmit = document.getElementById('btnSubmitReport');
  const selectSala = document.getElementById('reportSala');
  const selectProblema = document.getElementById('reportTipoProblema');

  // Llenar opciones de salas desde CONFIG
  if (selectSala && CONFIG.SALAS) {
    selectSala.innerHTML = CONFIG.SALAS.map(s => `<option value="${s}">${s}</option>`).join('');
  }

  // Llenar categorías de problemas desde CONFIG
  if (selectProblema && CONFIG.CATEGORIAS_PROBLEMAS) {
    selectProblema.innerHTML = CONFIG.CATEGORIAS_PROBLEMAS.map(c => `<option value="${c.label}">${c.label}</option>`).join('');
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sala = document.getElementById('reportSala').value;
    const numero_equipo = document.getElementById('reportNumeroEquipo').value.trim();
    const tipo_problema = document.getElementById('reportTipoProblema').value;
    const prioridad = document.getElementById('reportPrioridad').value;
    const reportado_por = document.getElementById('reportDocente').value.trim() || 'Docente / Alumno';
    const descripcion = document.getElementById('reportDescripcion').value.trim();

    if (!sala || !numero_equipo || !tipo_problema) {
      showAlert(alertBox, 'error', 'Por favor completa los campos obligatorios: Sala, Número de Equipo y Tipo de Problema.');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = 'Enviando al Piso Tecnológico...';

    try {
      const payload = {
        sala,
        numero_equipo,
        tipo_problema,
        prioridad,
        reportado_por,
        descripcion
      };

      const result = await window.com2itService.createReport(payload);

      if (result.success) {
        form.reset();
        showAlert(alertBox, result.offline ? 'warning' : 'success', result.message);
        // Actualizar el contador de la pestaña tablero
        loadBoardReports();
      } else {
        showAlert(alertBox, 'error', 'No se pudo registrar la incidencia. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error al registrar incidencia:', err);
      showAlert(alertBox, 'error', 'Error al procesar el reporte: ' + err.message);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '📤 Enviar Reporte al Piso Tecnológico';
    }
  });

  function showAlert(element, type, text) {
    if (!element) return;
    element.className = `alert-box show ${type}`;
    element.innerHTML = `<span>${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : '✕'}</span> <div>${text}</div>`;
    setTimeout(() => {
      element.classList.remove('show');
    }, 8000);
  }
}

/* -------------------------------------------------------------
 * 5. Módulo 3: Tablero en Vivo del Piso Tecnológico
 * ----------------------------------------------------------- */
let currentSalaFilter = 'Todas';

function initLiveBoard() {
  const filterContainer = document.getElementById('boardFilters');
  const btnRefresh = document.getElementById('btnRefreshBoard');

  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSalaFilter = btn.getAttribute('data-sala');
      loadBoardReports();
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      loadBoardReports();
    });
  }

  // Escuchar evento de sincronización offline
  window.addEventListener('com2it:synced', () => {
    loadBoardReports();
  });

  // Suscribir a Realtime de Supabase
  if (window.com2itService) {
    window.com2itService.subscribeToRealtime(() => {
      loadBoardReports();
    });
  }
}

async function loadBoardReports() {
  const container = document.getElementById('reportsListContainer');
  const counterBadge = document.getElementById('boardCountBadge');
  if (!container) return;

  container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Cargando incidencias del Piso Tecnológico...</div>';

  try {
    const reports = await window.com2itService.getRecentReports(currentSalaFilter);

    if (counterBadge) {
      counterBadge.textContent = reports.length;
    }

    if (!reports || reports.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 2.5rem; background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h4 style="color: var(--text-muted); margin-bottom: 0.25rem;">No hay incidencias pendientes</h4>
          <p style="font-size: 0.85rem;">Todos los equipos de la sala seleccionada están operativos.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = reports.map(r => {
      const dateFormatted = new Date(r.created_at).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      const isOfflineItem = r._offline;
      const estadoClass = r.estado.replace(/\s+/g, '_');

      return `
        <div class="report-item">
          <div class="report-top">
            <div class="report-meta">
              <span class="badge-sala">${r.sala}</span>
              <span class="badge-equipo">${r.numero_equipo}</span>
              <span class="badge-prioridad ${r.prioridad || 'Media'}">${r.prioridad || 'Media'}</span>
              ${isOfflineItem ? '<span style="font-size:0.7rem; background:#451A03; color:#FCD34D; padding:0.15rem 0.4rem; border-radius:4px;">En cola offline</span>' : ''}
            </div>
            <span class="badge-estado ${estadoClass}" data-state="${r.estado}">${r.estado}</span>
          </div>
          <div class="report-problem-title">${r.tipo_problema}</div>
          ${r.descripcion ? `<div class="report-desc-text">${escapeHtml(r.descripcion)}</div>` : ''}
          <div class="report-footer">
            <span>Reportado por: <strong>${escapeHtml(r.reportado_por || 'Docente')}</strong></span>
            <span>Fecha: ${dateFormatted}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error al cargar reportes:', err);
    container.innerHTML = `
      <div style="color: var(--danger); text-align: center; padding: 1.5rem;">
        No se pudieron cargar los reportes en este momento. Revisa la conexión o las claves de Supabase.
      </div>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* -------------------------------------------------------------
 * 6. Módulo 4: Ajustes y Conexión Supabase
 * ----------------------------------------------------------- */
function initSettingsModule() {
  const formSettings = document.getElementById('settingsForm');
  const inputUrl = document.getElementById('cfgSupabaseUrl');
  const inputKey = document.getElementById('cfgSupabaseKey');
  const alertSettings = document.getElementById('settingsAlert');

  if (inputUrl) inputUrl.value = CONFIG.SUPABASE_URL || '';
  if (inputKey) inputKey.value = CONFIG.SUPABASE_ANON_KEY || '';

  if (formSettings) {
    formSettings.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = inputUrl.value.trim();
      const key = inputKey.value.trim();

      CONFIG.saveCredentials(url, key);
      window.com2itService.init();

      if (alertSettings) {
        alertSettings.className = 'alert-box show success';
        alertSettings.innerHTML = '<span>✓</span> Configuración guardada correctamente en el dispositivo.';
        setTimeout(() => alertSettings.classList.remove('show'), 4000);
      }

      initNetworkStatus();
      loadBoardReports();
    });
  }
}

