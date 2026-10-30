/**
 * Com2IT - Controlador Principal de la Aplicación PWA
 * Gestiona navegación por Landing Page, diagnóstico interactivo,
 * formulario simplificado para docentes hacia el Piso Tecnológico y eventos PWA.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Registro del Service Worker
  registerServiceWorker();

  // 2. Inicialización de la Interfaz
  initPWAInstallPrompt();
  initNavigation();
  initLandingPageActions();
  initDiagnosticsModule();
  initReportForm();
  initLiveBoard();
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
        statusText.textContent = 'Piso Tech Conectado';
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
 * 2. Navegación por Pestañas y Enlaces Directos
 * ----------------------------------------------------------- */
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');
  const brandLink = document.getElementById('brandHomeLink');

  function switchTab(targetId) {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));

    const activeTab = document.querySelector(`.nav-tab[data-tab="${targetId}"]`);
    const activePane = document.getElementById(targetId);

    if (activeTab) activeTab.classList.add('active');
    if (activePane) activePane.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

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

  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('tab-inicio');
    });
  }

  // Botones de "Volver al Inicio"
  document.querySelectorAll('.btn-back-home').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab('tab-inicio');
    });
  });

  // Escuchar enlaces hash
  if (window.location.hash === '#diagnostico') {
    switchTab('tab-diagnostico');
  } else if (window.location.hash === '#reportar') {
    switchTab('tab-reportar');
  } else if (window.location.hash === '#tablero') {
    switchTab('tab-piso-tecnologico');
  }

  window.com2itSwitchTab = switchTab;
}

/* -------------------------------------------------------------
 * 3. Acciones de la Landing Page Inicial
 * ----------------------------------------------------------- */
function initLandingPageActions() {
  const btnGoDiag = document.getElementById('btnActionDiagnostico');
  const btnGoReport = document.getElementById('btnActionReportar');

  if (btnGoDiag) {
    btnGoDiag.addEventListener('click', (e) => {
      e.preventDefault();
      window.com2itSwitchTab('tab-diagnostico');
    });
  }

  if (btnGoReport) {
    btnGoReport.addEventListener('click', (e) => {
      e.preventDefault();
      window.com2itSwitchTab('tab-reportar');
    });
  }

  // Botones directos desde las tarjetas de sala en la Landing
  document.querySelectorAll('[data-landing-sala]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSala = btn.getAttribute('data-landing-sala');
      const selectSala = document.getElementById('reportSala');
      if (selectSala && targetSala) {
        selectSala.value = targetSala;
        updateSalaEquipmentBanner(targetSala);
      }
      window.com2itSwitchTab('tab-reportar');
    });
  });
}

/* -------------------------------------------------------------
 * 4. Módulo 1: Diagnóstico Rápido de Autoservicio
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
        <span>Revisar pasos de solución</span> &rarr;
      </div>
    </div>
  `).join('');

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

    modalTip.innerHTML = `<strong>Consejo práctico:</strong> ${diag.resolutionTip}`;
    modal.classList.add('open');
  }

  function closeDiagModal() {
    modal.classList.remove('open');
    currentSelectedDiag = null;
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeDiagModal);
  if (btnDismissModal) btnDismissModal.addEventListener('click', closeDiagModal);

  // Botón directo a reporte si la falla persiste
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
    txtDesc.value = `Se realizaron los pasos de diagnóstico guiado para "${diag.title}". El inconveniente persiste y requiere intervención en el aula.`;
  }
}

/* -------------------------------------------------------------
 * 5. Módulo 2: Formulario de Reporte Simplificado
 * ----------------------------------------------------------- */
function initReportForm() {
  const form = document.getElementById('incidentForm');
  const alertBox = document.getElementById('formAlert');
  const btnSubmit = document.getElementById('btnSubmitReport');
  const selectSala = document.getElementById('reportSala');
  const selectProblema = document.getElementById('reportTipoProblema');
  const inputEquipo = document.getElementById('reportNumeroEquipo');
  const quickPillsContainer = document.getElementById('quickPillsContainer');

  // Llenar opciones de salas (Sala 1, Sala 2, Sala 3)
  if (selectSala && CONFIG.SALAS) {
    selectSala.innerHTML = CONFIG.SALAS.map(s => `<option value="${s}">${s}</option>`).join('');
    updateSalaEquipmentBanner(selectSala.value);

    selectSala.addEventListener('change', (e) => {
      updateSalaEquipmentBanner(e.target.value);
    });
  }

  // Llenar categorías de problemas
  if (selectProblema && CONFIG.CATEGORIAS_PROBLEMAS) {
    selectProblema.innerHTML = CONFIG.CATEGORIAS_PROBLEMAS.map(c => `<option value="${c.label}">${c.label}</option>`).join('');
  }

  // Píldoras rápidas para autocompletar el equipo afectado
  if (quickPillsContainer && inputEquipo) {
    quickPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.quick-pick-pill');
      if (!pill) return;
      inputEquipo.value = pill.getAttribute('data-val');
      inputEquipo.focus();
    });
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sala = selectSala ? selectSala.value : 'Sala 1';
    const equipo_o_periferico = inputEquipo ? inputEquipo.value.trim() : '';
    const tipo_problema = selectProblema ? selectProblema.value : '';
    const reportado_por = (document.getElementById('reportDocente')?.value || '').trim() || 'Docente a cargo';
    const descripcion = (document.getElementById('reportDescripcion')?.value || '').trim();

    if (!sala || !equipo_o_periferico || !tipo_problema) {
      showAlert(alertBox, 'error', 'Por favor selecciona la Sala e indica qué equipo o periférico presenta la falla.');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = 'Enviando al Piso Tecnológico...';

    try {
      const payload = {
        sala,
        equipo_o_periferico,
        tipo_problema,
        prioridad: 'Media',
        reportado_por,
        descripcion
      };

      const result = await window.com2itService.createReport(payload);

      if (result.success) {
        form.reset();
        // Restaurar sala por defecto y banner
        if (selectSala) {
          selectSala.value = 'Sala 1';
          updateSalaEquipmentBanner('Sala 1');
        }
        showAlert(alertBox, result.offline ? 'warning' : 'success', result.message);
        loadBoardReports();
      } else {
        showAlert(alertBox, 'error', 'No se pudo enviar el reporte. Por favor intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error al registrar reporte:', err);
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
    }, 7000);
  }
}

/**
 * Actualiza el banner contextual de la sala seleccionada
 */
function updateSalaEquipmentBanner(salaKey) {
  const banner = document.getElementById('salaEquipBanner');
  const info = CONFIG.INFO_SALAS ? CONFIG.INFO_SALAS[salaKey] : null;

  if (banner && info) {
    let iconExtra = '';
    if (info.tiene3D && info.tieneTV) {
      iconExtra = '🖨️ Impresoras 3D y 📺 Smart TV';
    } else if (info.tieneTV) {
      iconExtra = '📺 Smart TV para presentaciones';
    } else {
      iconExtra = '🖥️ Computadoras de escritorio y red por cable';
    }

    banner.innerHTML = `
      <div style="font-size: 1.3rem;">ℹ️</div>
      <div>
        <strong>${info.nombre}:</strong> ${info.descripcion}
      </div>
    `;
  }
}

/* -------------------------------------------------------------
 * 6. Módulo 3: Tablero en Vivo de Incidencias
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

  window.addEventListener('com2it:synced', () => {
    loadBoardReports();
  });

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

  container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Consultando estado de incidencias...</div>';

  try {
    const reports = await window.com2itService.getRecentReports(currentSalaFilter);

    if (counterBadge) {
      counterBadge.textContent = reports.length;
    }

    if (!reports || reports.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 2.5rem; background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h4 style="color: var(--text-muted); margin-bottom: 0.25rem;">Sin incidencias pendientes</h4>
          <p style="font-size: 0.85rem;">Todos los equipos de la sala seleccionada están en orden.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = reports.map(r => {
      const dateFormatted = new Date(r.created_at || r.fecha_creacion).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      const isOfflineItem = r._offline;
      const equipoNombre = r.equipo_o_periferico || r.numero_equipo || 'Equipo';
      const estadoClass = (r.estado || 'Pendiente').replace(/\s+/g, '_');

      return `
        <div class="report-item">
          <div class="report-top">
            <div class="report-meta">
              <span class="badge-sala">${r.sala}</span>
              <span class="badge-equipo">${escapeHtml(equipoNombre)}</span>
              ${isOfflineItem ? '<span style="font-size:0.7rem; background:#451A03; color:#FCD34D; padding:0.15rem 0.4rem; border-radius:4px;">Guardado local</span>' : ''}
            </div>
            <span class="badge-estado ${estadoClass}" data-state="${r.estado}">${r.estado || 'Pendiente'}</span>
          </div>
          <div class="report-problem-title">${escapeHtml(r.tipo_problema)}</div>
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
        No se pudieron consultar las incidencias en este momento.
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
