/**
 * Com2IT - Configuración Global y Conexión Supabase
 * Permite definir credenciales por defecto o guardarlas dinámicamente en localStorage.
 */

const CONFIG = {
  // Claves por defecto (reemplazables desde el panel de Ajustes en la PWA o directamente aquí)
  SUPABASE_URL: window.localStorage.getItem('COM2IT_SUPABASE_URL') || 'https://tu-proyecto.supabase.co',
  SUPABASE_ANON_KEY: window.localStorage.getItem('COM2IT_SUPABASE_ANON_KEY') || 'TU_SUPABASE_ANON_KEY',
  
  // Salas de informática centralizadas por el Piso Tecnológico
  SALAS: ['Sala 1', 'Sala 2', 'Sala 3', 'Piso Tecnológico'],
  
  // Tipos de problemas catalogados
  CATEGORIAS_PROBLEMAS: [
    { id: 'power', label: 'La PC no enciende / Sin energía', icon: 'zap-off' },
    { id: 'video', label: 'No aparece imagen / Monitor en negro', icon: 'monitor-off' },
    { id: 'network', label: 'Sin conexión a Internet / Red escolar', icon: 'wifi-off' },
    { id: 'peripherals', label: 'Periférico faltante o dañado (Teclado/Mouse)', icon: 'mouse' },
    { id: 'performance', label: 'PC congelada / Lentitud extrema', icon: 'clock' },
    { id: 'software', label: 'Error de Software / Sistema Operativo', icon: 'terminal' },
    { id: 'audio', label: 'Sin Audio / Parlantes o Jack dañado', icon: 'volume-x' },
    { id: 'other', label: 'Otro desperfecto / Daño físico', icon: 'alert-triangle' }
  ],

  // Prioridades
  NIVELES_PRIORIDAD: [
    { id: 'Baja', label: 'Baja (No urgente, equipo utilizable)' },
    { id: 'Media', label: 'Media (Afecta parcialmente la clase)' },
    { id: 'Alta', label: 'Alta (Equipo inutilizado en sala llena)' },
    { id: 'Urgente', label: 'Urgente (Afecta al puesto docente / switch / proyector)' }
  ],

  // Guardar credenciales actualizadas
  saveCredentials: (url, anonKey) => {
    if (url) localStorage.setItem('COM2IT_SUPABASE_URL', url.trim());
    if (anonKey) localStorage.setItem('COM2IT_SUPABASE_ANON_KEY', anonKey.trim());
    CONFIG.SUPABASE_URL = url.trim();
    CONFIG.SUPABASE_ANON_KEY = anonKey.trim();
  },

  isConfigured: () => {
    return CONFIG.SUPABASE_URL && 
           CONFIG.SUPABASE_URL.startsWith('https://') && 
           !CONFIG.SUPABASE_URL.includes('tu-proyecto') &&
           CONFIG.SUPABASE_ANON_KEY && 
           !CONFIG.SUPABASE_ANON_KEY.includes('TU_SUPABASE_ANON_KEY');
  }
};

