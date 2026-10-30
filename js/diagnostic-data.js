/**
 * Com2IT - Banco de Diagnóstico Interactivo de Autoservicio
 * Casos comunes de soporte en las salas de informática y piso tecnológico.
 */

const DIAGNOSTICS = [
  {
    id: 'power',
    title: 'La PC no enciende',
    subtitle: 'El gabinete no emite luces, ventiladores ni ruidos al presionar el botón de encendido.',
    icon: '⚡',
    badge: 'Hardware Eléctrico',
    recommendedIssue: 'La PC no enciende / Sin energía',
    steps: [
      {
        step: 1,
        title: 'Verificar la zapatilla o prolongador',
        detail: 'Comprueba si la zapatilla bajo el banco tiene la luz roja encendida. En muchas aulas, las zapatillas se apagan accidentalmente con los pies de los estudiantes o tras una bajada de tensión.',
        actionCheck: '¿La tecla de la zapatilla está en posición "I" (Encendido)?'
      },
      {
        step: 2,
        title: 'Comprobar el cable de poder (Interlock)',
        detail: 'Revisa el cable negro grueso conectado detrás de la fuente de poder del gabinete. Empújalo firmemente hacia adentro; suele aflojarse al correr las mesas.',
        actionCheck: '¿El cable de poder está firmemente calzado en la fuente?'
      },
      {
        step: 3,
        title: 'Verificar la llave trasera de la fuente',
        detail: 'Muchos gabinetes tienen un interruptor I/O en la parte trasera de la fuente de poder. Asegúrate de que esté en "I" y no en "O".',
        actionCheck: '¿El interruptor trasero de la fuente está en posición "I"?'
      },
      {
        step: 4,
        title: 'Probar en otra toma del banco',
        detail: 'Conecta el cable en otra boca de la misma zapatilla o en el enchufe del puesto contiguo para descartar una toma falseada.',
        actionCheck: '¿Sigue sin encender en otra toma probada?'
      }
    ],
    resolutionTip: 'Si tras estos pasos no hay ninguna luz ni sonido de ventilador, es probable que la fuente de poder esté averiada o el botón frontal esté desconectado.'
  },
  {
    id: 'video',
    title: 'No aparece imagen / Monitor en negro',
    subtitle: 'La PC enciende (hace ruido y luces), pero la pantalla no muestra nada o dice "Sin Señal".',
    icon: '🖥️',
    badge: 'Video & Pantalla',
    recommendedIssue: 'No aparece imagen / Monitor en negro',
    steps: [
      {
        step: 1,
        title: 'Comprobar el LED del monitor',
        detail: 'Fíjate en el botón del monitor. Si la luz está apagada, presiona el botón Power del monitor. Si está naranja o parpadea en azul, el monitor recibe corriente pero no detecta señal de video.',
        actionCheck: '¿El monitor tiene su LED de encendido activo?'
      },
      {
        step: 2,
        title: 'Ajustar el cable de video (VGA / HDMI)',
        detail: 'En las salas escolares el cable azul (VGA) o negro (HDMI) suele tirarse. Desenróscalo suavemente, vuelve a insertarlo derecho y aprieta las dos tuercas plásticas laterales con la mano.',
        actionCheck: '¿El cable está ajustado tanto en la PC como en la pantalla?'
      },
      {
        step: 3,
        title: 'Verificar si la PC tiene placa de video dedicada',
        detail: 'Si la PC tiene conectores de video abajo (placa PCIe) y también arriba (en la placa madre), el cable DEBE conectarse en la placa de abajo.',
        actionCheck: '¿Está enchufado en la salida gráfica correcta?'
      },
      {
        step: 4,
        title: 'Atención a los pitidos (Beeps) del gabinete',
        detail: 'Si al encender escuchas 3 o más pitidos largos/cortos seguidos, la memoria RAM o el procesador perdieron contacto debido al polvo o vibración.',
        actionCheck: '¿Se escuchan pitidos al encender el equipo?'
      }
    ],
    resolutionTip: 'Si el monitor indica "Sin señal" y el cable está bien firme, se requiere que el Piso Tecnológico abra el gabinete para limpiar los contactos de la memoria RAM con goma de borrar.'
  },
  {
    id: 'network',
    title: 'Sin conexión a Internet o Red',
    subtitle: 'Aparece el icono del planeta/mundo con cruz o el aviso "Sin acceso a Internet".',
    icon: '🌐',
    badge: 'Conectividad & Red',
    recommendedIssue: 'Sin conexión a Internet / Red escolar',
    steps: [
      {
        step: 1,
        title: 'Inspeccionar el cable de red (RJ45)',
        detail: 'Revisa el conector de red detrás del gabinete. Debe tener dos lucecitas (verde/ámbar). Una debe estar fija y la otra titilar. Si están apagadas, empuja la ficha hasta escuchar el "clic" de la traba plástica.',
        actionCheck: '¿Parpadean las luces de red detrás de la computadora?'
      },
      {
        step: 2,
        title: 'Revisar la roseta de red en la pared/piso',
        detail: 'Sigue el cable hasta la boca de pared (roseta) o el canalizador. Comprueba que el cable no esté doblado en 90 grados o desconectado de la pared.',
        actionCheck: '¿El extremo de la pared está firme?'
      },
      {
        step: 3,
        title: 'Comprobar si otras PCs de la misma sala tienen Internet',
        detail: 'Pregúntale a los puestos vecinos. Si ninguna PC tiene internet, el problema está en el Switch del rack de la sala o en el enlace principal del Piso Tecnológico.',
        actionCheck: '¿Es un problema solo de esta máquina o de toda la sala?'
      },
      {
        step: 4,
        title: 'Reiniciar la interfaz de red en Windows',
        detail: 'Haz clic derecho en el icono de red de la barra de tareas y selecciona "Solucionar problemas" o desconecta el cable por 10 segundos y vuelve a conectarlo para renovar la IP por DHCP.',
        actionCheck: '¿Se resolvió tras renovar la conexión?'
      }
    ],
    resolutionTip: 'Si solo esa máquina no tiene red y las luces traseras están apagadas, probablemente la ficha RJ45 tenga un hilo cortado y requiera un re-crimpeado por el piso técnico.'
  },
  {
    id: 'peripherals',
    title: 'Teclado o Mouse no responden / Faltantes',
    subtitle: 'El cursor no se mueve o el teclado no escribe en las aplicaciones.',
    icon: '🖱️',
    badge: 'Periféricos',
    recommendedIssue: 'Periférico faltante o dañado (Teclado/Mouse)',
    steps: [
      {
        step: 1,
        title: 'Cambiar de puerto USB (Preferir puertos traseros)',
        detail: 'Los puertos USB delanteros del gabinete suelen desgastarse o desconectarse internamente. Conecta el cable del mouse o teclado en los puertos USB soldados en la parte trasera del gabinete (directo al motherboard).',
        actionCheck: '¿Probaste en los puertos USB posteriores?'
      },
      {
        step: 2,
        title: 'Comprobar luces ópticas y de teclado',
        detail: 'Levanta el mouse: ¿tiene luz roja/azul en la base? En el teclado, presiona la tecla "Bloq Mayús" (Caps Lock): ¿enciende el LED indicador verde?',
        actionCheck: '¿Los indicadores lumínicos reaccionan?'
      },
      {
        step: 3,
        title: 'Detectar faltantes en la sala',
        detail: 'Si el equipo no tiene teclado, mouse o cable de corriente porque fue trasladado para una actividad, notifícalo con el formulario para reposición inmediata desde el pañol del Piso Tecnológico.',
        actionCheck: '¿El periférico está físicamente ausente del puesto?'
      }
    ],
    resolutionTip: 'En caso de periféricos con cables pelados o fichas USB deformadas, reporta de inmediato para evitar cortocircuitos en la placa madre.'
  },
  {
    id: 'performance',
    title: 'PC congelada / Lentitud extrema',
    subtitle: 'Windows no responde a clics, se queda cargando o el disco está al 100%.',
    icon: '⏳',
    badge: 'Rendimiento & SO',
    recommendedIssue: 'PC congelada / Lentitud extrema',
    steps: [
      {
        step: 1,
        title: 'Combinación de teclas para Administrador de Tareas',
        detail: 'Presiona Ctrl + Shift + Esc (o Ctrl + Alt + Supr). Si se abre la ventana, revisa qué programa está consumiendo 100% de CPU o Disco y finalízalo.',
        actionCheck: '¿Pudiste abrir el Administrador de Tareas?'
      },
      {
        step: 2,
        title: 'Cerrar pestañas pesadas del navegador',
        detail: 'Plataformas interactivas, emuladores y múltiples videos abiertos simultáneamente consumen toda la memoria RAM en equipos de 4GB u 8GB.',
        actionCheck: '¿Se normalizó al cerrar el navegador?'
      },
      {
        step: 3,
        title: 'Reinicio limpio del sistema',
        detail: 'Si el mouse aún responde, ve al menú Inicio -> Apagar -> Reiniciar. Si está completamente congelada, mantén presionado el botón de encendido del gabinete por 8 segundos hasta que se apague y vuelve a encender.',
        actionCheck: '¿La PC recuperó velocidad luego del reinicio?'
      }
    ],
    resolutionTip: 'Si tras reiniciar el equipo sigue demorando más de 10 minutos en arrancar, el disco duro puede tener sectores defectuosos o el perfil de usuario estar corrupto.'
  },
  {
    id: 'audio',
    title: 'Sin Audio / Parlantes o Auriculares',
    subtitle: 'No se escucha sonido en videos, llamadas o software educativo.',
    icon: '🎧',
    badge: 'Multimedia',
    recommendedIssue: 'Sin Audio / Parlantes o Jack dañado',
    steps: [
      {
        step: 1,
        title: 'Verificar el conector Jack de 3.5mm (Verde)',
        detail: 'En las PC de escritorio escolares, el auricular o parlante debe conectarse en el conector circular de color VERDE (salida de audio), no en el rosa (micrófono) ni azul (línea).',
        actionCheck: '¿La ficha está colocada en el jack verde?'
      },
      {
        step: 2,
        title: 'Seleccionar el dispositivo de salida correcto en Windows',
        detail: 'Haz clic en el parlantito junto a la hora. Pulsa sobre el nombre del dispositivo y asegúrate de elegir "Altavoces / Realtek Audio" en lugar de la salida del monitor si este no posee parlantes.',
        actionCheck: '¿El dispositivo predeterminado coincide con tu auricular?'
      },
      {
        step: 3,
        title: 'Comprobar la perilla o rueda del propio auricular',
        detail: 'Muchos auriculares para clase tienen una ruedita o switch de silencio (Mute) en el mismo cable que suele estar al mínimo sin notarlo.',
        actionCheck: '¿El potenciómetro del cable está al máximo?'
      }
    ],
    resolutionTip: 'Si el jack de audio frontal está flojo o roto, prueba conectar directamente en el panel trasero.'
  }
];

