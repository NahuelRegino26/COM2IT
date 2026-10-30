/**
 * Com2IT - Servicio de Conexión con Supabase y Soporte Offline
 * Gestiona el envío de incidencias hacia el Piso Tecnológico con cola local de respaldo.
 */

class SupabaseService {
  constructor() {
    this.client = null;
    this.realtimeChannel = null;
    this.isOnline = navigator.onLine;
    this.init();
    this.setupNetworkListeners();
  }

  init() {
    if (CONFIG.isConfigured() && window.supabase) {
      try {
        this.client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        console.log('[SupabaseService] Cliente Supabase inicializado correctamente hacia Piso Tecnológico.');
      } catch (err) {
        console.warn('[SupabaseService] Error al inicializar cliente Supabase:', err);
        this.client = null;
      }
    } else {
      console.log('[SupabaseService] Operando con respaldo local.');
      this.client = null;
    }
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[SupabaseService] Conexión a Internet restablecida.');
      this.syncOfflineReports();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.warn('[SupabaseService] Modo Offline activado.');
    });
  }

  /**
   * Obtiene la cola de reportes locales en localStorage
   */
  getOfflineReports() {
    try {
      const data = localStorage.getItem('com2it_offline_reports');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer reportes offline:', e);
      return [];
    }
  }

  /**
   * Guarda un reporte en la cola local
   */
  saveOfflineReport(report) {
    const list = this.getOfflineReports();
    const localReport = {
      ...report,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      estado: 'Pendiente (En cola local)',
      _offline: true
    };
    list.unshift(localReport);
    localStorage.setItem('com2it_offline_reports', JSON.stringify(list));
    return localReport;
  }

  /**
   * Registra un nuevo reporte hacia Supabase (o a cola offline)
   */
  async createReport(reportData) {
    const equipo = reportData.equipo_o_periferico || reportData.numero_equipo || 'Equipo sin especificar';

    // Si no hay cliente Supabase o estamos offline, guardar localmente
    if (!this.client || !navigator.onLine) {
      const local = this.saveOfflineReport({ ...reportData, numero_equipo: equipo });
      return {
        success: true,
        offline: true,
        data: local,
        message: 'El reporte se guardó en el dispositivo. Se enviará al Piso Tecnológico en cuanto se recupere la conexión.'
      };
    }

    try {
      const { data, error } = await this.client
        .from('reportes_incidencias')
        .insert([
          {
            sala: reportData.sala,
            numero_equipo: equipo,
            tipo_problema: reportData.tipo_problema,
            prioridad: reportData.prioridad || 'Media',
            reportado_por: reportData.reportado_por || 'Docente a cargo',
            descripcion: reportData.descripcion || '',
            estado: 'Pendiente'
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        offline: false,
        data: data,
        message: '¡El reporte fue recibido por el Piso Tecnológico! Un técnico revisará la incidencia.'
      };
    } catch (err) {
      console.error('[SupabaseService] Error al enviar reporte a Supabase:', err);
      // Fallback a cola offline
      const local = this.saveOfflineReport({ ...reportData, numero_equipo: equipo });
      return {
        success: true,
        offline: true,
        fallback: true,
        data: local,
        message: 'No hubo respuesta inmediata del servidor. El reporte quedó guardado y se sincronizará automáticamente.'
      };
    }
  }

  /**
   * Obtiene la lista de reportes recientes de Supabase y locales
   */
  async getRecentReports(filterSala = 'Todas') {
    let cloudReports = [];
    const localReports = this.getOfflineReports();

    if (this.client && navigator.onLine) {
      try {
        let query = this.client
          .from('reportes_incidencias')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(25);

        if (filterSala && filterSala !== 'Todas') {
          query = query.eq('sala', filterSala);
        }

        const { data, error } = await query;
        if (!error && data) {
          cloudReports = data;
        }
      } catch (e) {
        console.warn('[SupabaseService] No se pudieron cargar reportes en la nube:', e);
      }
    }

    // Filtrar reportes locales si corresponde
    let filteredLocals = localReports;
    if (filterSala && filterSala !== 'Todas') {
      filteredLocals = localReports.filter(r => r.sala === filterSala);
    }

    return [...filteredLocals, ...cloudReports];
  }

  /**
   * Sincroniza reportes offline pendientes con Supabase
   */
  async syncOfflineReports() {
    if (!this.client || !navigator.onLine) return;

    const locals = this.getOfflineReports();
    if (locals.length === 0) return;

    console.log(`[SupabaseService] Sincronizando ${locals.length} reportes offline...`);
    const successfulIds = [];

    for (const report of locals) {
      try {
        const { error } = await this.client
          .from('reportes_incidencias')
          .insert([
            {
              sala: report.sala,
              numero_equipo: report.equipo_o_periferico || report.numero_equipo,
              tipo_problema: report.tipo_problema,
              prioridad: report.prioridad || 'Media',
              reportado_por: report.reportado_por || 'Docente a cargo',
              descripcion: report.descripcion || '',
              estado: 'Pendiente'
            }
          ]);

        if (!error) {
          successfulIds.push(report.id);
        }
      } catch (err) {
        console.error('Error sincronizando reporte individual:', err);
      }
    }

    if (successfulIds.length > 0) {
      const remaining = locals.filter(r => !successfulIds.includes(r.id));
      localStorage.setItem('com2it_offline_reports', JSON.stringify(remaining));
      console.log(`[SupabaseService] Sincronizados ${successfulIds.length} reportes.`);
      window.dispatchEvent(new CustomEvent('com2it:synced', { detail: { count: successfulIds.length } }));
    }
  }

  /**
   * Suscribe en tiempo real a los cambios de la tabla reportes_incidencias
   */
  subscribeToRealtime(callback) {
    if (!this.client) return null;

    try {
      this.realtimeChannel = this.client
        .channel('public:reportes_incidencias')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reportes_incidencias' }, payload => {
          if (typeof callback === 'function') {
            callback(payload);
          }
        })
        .subscribe();
      return this.realtimeChannel;
    } catch (e) {
      console.warn('Realtime no soportado:', e);
      return null;
    }
  }
}

// Instancia global
window.com2itService = new SupabaseService();
