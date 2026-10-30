/**
 * Com2IT - Configuración Global Integrada (Piso Tecnológico)
 * Credenciales fijas de Supabase integradas de forma transparente para los docentes.
 */

const CONFIG = {
  // Credenciales fijas para Supabase (transparentes e invisibles para el usuario final)
  SUPABASE_URL: 'https://kzajazriprbrvlvbykfi.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6YWphenJpcHJicnZsdmJ5a2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzOTU0NDIsImV4cCI6MjEwODk3MTQ0Mn0.QyeIMBkcpj027YUtdlGqJ29rUun8YvfeL4f6HoYEipY',

  // Salas oficiales del Colegio Comercio N°2
  SALAS: ['Sala 1', 'Sala 2', 'Sala 3'],

  // Especificación interna del equipamiento por sala
  INFO_SALAS: {
    'Sala 1': {
      nombre: 'Sala 1',
      descripcion: 'Equipada con computadoras de escritorio, conexión de red escolar, Impresoras 3D y Smart TV.',
      equiposDisponibles: ['PC de escritorio', 'Teclado', 'Mouse', 'Monitor', 'Impresora 3D', 'Smart TV', 'Cable de red', 'Cable de poder', 'Otro'],
      tiene3D: true,
      tieneTV: true
    },
    'Sala 2': {
      nombre: 'Sala 2',
      descripcion: 'Equipada con computadoras de escritorio y conexión de red escolar por cable.',
      equiposDisponibles: ['PC de escritorio', 'Teclado', 'Mouse', 'Monitor', 'Cable de red', 'Cable de poder', 'Otro'],
      tiene3D: false,
      tieneTV: false
    },
    'Sala 3': {
      nombre: 'Sala 3',
      descripcion: 'Equipada con computadoras de escritorio, conexión de red escolar y Smart TV.',
      equiposDisponibles: ['PC de escritorio', 'Teclado', 'Mouse', 'Monitor', 'Smart TV', 'Cable de red', 'Cable de poder', 'Otro'],
      tiene3D: false,
      tieneTV: true
    }
  },

  // Catálogo simplificado y comprensible para docentes de cualquier área
  CATEGORIAS_PROBLEMAS: [
    { id: 'power', label: 'La PC no enciende / Sin corriente eléctrica' },
    { id: 'video', label: 'No da imagen / Pantalla en negro o sin señal' },
    { id: 'network', label: 'Sin conexión a Internet o Red escolar' },
    { id: 'peripherals', label: 'Falta o no anda Teclado / Mouse' },
    { id: 'performance', label: 'La computadora se traba o anda muy lenta' },
    { id: 'audio', label: 'Sin sonido / Auriculares o parlantes mudos' },
    { id: 'impresora3d', label: 'Falla en Impresora 3D (atasco, filamento o calibración)' },
    { id: 'tv', label: 'Falla o sin señal en Smart TV' },
    { id: 'cable', label: 'Falta cable de poder o cable de red' },
    { id: 'otro', label: 'Otro inconveniente o rotura' }
  ],

  isConfigured: () => true
};
