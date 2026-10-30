/**
 * Com2IT - Banco de Diagnóstico Rápido de Autoservicio
 * Casos comunes para docentes y alumnos en las salas de informática del Colegio Comercio N°2.
 */

const DIAGNOSTICS = [
  {
    id: 'power',
    title: 'La PC no enciende',
    subtitle: 'El gabinete no emite luces, ventiladores ni ruidos al presionar el botón de encendido.',
    icon: '⚡',
    badge: 'Energía & Gabinete',
    recommendedIssue: 'La PC no enciende / Sin corriente eléctrica',
    steps: [
      {
        step: 1,
        title: 'Verificar la zapatilla o prolongador del banco',
        detail: 'Comprueba que la zapatilla bajo el banco tenga la luz roja encendida. En el aula suelen apagarse sin querer con los pies o tras un corte de luz.',
        actionCheck: '¿La tecla roja de la zapatilla está en "I" (Encendido)?'
      },
      {
        step: 2,
        title: 'Comprobar el cable de alimentación negro (Interlock)',
        detail: 'Revisa el cable negro grueso detrás del gabinete. Empújalo firmemente hacia adentro; suele aflojarse al mover las mesas o sillas.',
        actionCheck: '¿El cable de poder está bien encastrado en la fuente?'
      },
      {
        step: 3,
        title: 'Revisar la llave trasera de la fuente',
        detail: 'En la parte posterior de la CPU suele haber una teclita pequeña I/O. Debe estar presionada en "I".',
        actionCheck: '¿El interruptor trasero de la CPU está en "I"?'
      },
      {
        step: 4,
        title: 'Probar en otra toma de corriente',
        detail: 'Enchufa el cable en otra boca de la misma zapatilla o en el puesto vecino para descartar un tomacorriente falseado.',
        actionCheck: '¿Sigue sin encender en otra toma probada?'
      }
    ],
    resolutionTip: 'Si tras estos pasos no hay luces ni ventiladores, la fuente de poder puede estar dañada y el equipo del Piso Tecnológico la reemplazará.'
  },
  {
    id: 'video',
    title: 'No aparece imagen / Monitor en negro',
    subtitle: 'La PC hace ruido de encendida, pero la pantalla no muestra nada o dice "Sin Señal".',
    icon: '🖥️',
    badge: 'Pantalla & Monitor',
    recommendedIssue: 'No da imagen / Pantalla en negro o sin señal',
    steps: [
      {
        step: 1,
        title: 'Comprobar la luz del monitor',
        detail: 'Mira el borde inferior del monitor. Si la luz está apagada, presiona el botón Power. Si está titilando o en color ámbar, el monitor está prendido pero no recibe imagen.',
        actionCheck: '¿El monitor tiene la luz de encendido encendida?'
      },
      {
        step: 2,
        title: 'Ajustar el cable de video (azul VGA o negro HDMI)',
        detail: 'Es muy común que el cable de video se afloje. Aprieta suavemente los tornillitos plásticos con los dedos tanto en el monitor como en la PC.',
        actionCheck: '¿El cable de video está bien firme en ambos extremos?'
      },
      {
        step: 3,
        title: 'Revisar la salida de video correcta',
        detail: 'Si la PC tiene dos puertos de video (uno arriba y otro abajo), el cable siempre debe ir conectado en la placa gráfica inferior.',
        actionCheck: '¿Está enchufado en el conector inferior si tiene dos?'
      }
    ],
    resolutionTip: 'Si el monitor dice "Sin señal" con los cables bien firmes, es probable que la memoria RAM necesite limpieza de contactos en el taller técnico.'
  },
  {
    id: 'network',
    title: 'Sin Internet o Red escolar',
    subtitle: 'Aparece el icono del mundo o un cartel de "Sin conexión a Internet".',
    icon: '🌐',
    badge: 'Conectividad & Red',
    recommendedIssue: 'Sin conexión a Internet o Red escolar',
    steps: [
      {
        step: 1,
        title: 'Comprobar el cable de red (RJ45)',
        detail: 'Revisa el cable detrás de la CPU. Debe tener una o dos lucecitas verdes o amarillas parpadeando. Empuja la ficha hasta escuchar el "clic" de la traba plástica.',
        actionCheck: '¿Parpadean las luces del conector de red detrás de la PC?'
      },
      {
        step: 2,
        title: 'Revisar la boca de red en la pared o canaleta',
        detail: 'Sigue el cable hasta la roseta de la pared. Asegúrate de que no esté aplastado ni desconectado.',
        actionCheck: '¿El extremo conectado a la pared está firme?'
      },
      {
        step: 3,
        title: 'Consultar si las demás PCs tienen internet',
        detail: 'Pregunta a los puestos contiguos. Si ninguna máquina tiene internet, el inconveniente es del Switch de la sala o el enlace central del Piso Tecnológico.',
        actionCheck: '¿El problema afecta a una sola PC o a toda la sala?'
      }
    ],
    resolutionTip: 'Si solo esa PC no tiene red y las luces traseras están apagadas, la ficha del cable puede necesitar ser recrimpeada por los técnicos.'
  },
  {
    id: 'peripherals',
    title: 'Teclado o Mouse no responden / Faltantes',
    subtitle: 'El cursor no se mueve en pantalla o las teclas no escriben.',
    icon: '🖱️',
    badge: 'Teclado & Mouse',
    recommendedIssue: 'Falta o no anda Teclado / Mouse',
    steps: [
      {
        step: 1,
        title: 'Cambiar a un puerto USB trasero',
        detail: 'Los puertos USB del frente de la CPU suelen falsearse con el uso. Conecta el cable del teclado o mouse en los puertos USB soldados en la parte trasera del gabinete.',
        actionCheck: '¿Probaste conectando en los puertos USB traseros?'
      },
      {
        step: 2,
        title: 'Comprobar luces del teclado y mouse',
        detail: 'Levanta el mouse para ver si emite luz roja o azul. En el teclado, pulsa "Bloq Mayús" (Caps Lock) para comprobar si la lucecita verde responde.',
        actionCheck: '¿Alguna luz del periférico reacciona?'
      },
      {
        step: 3,
        title: 'Reportar faltante para reposición',
        detail: 'Si en el puesto falta el mouse, teclado o pad porque fueron trasladados, genera el reporte para que el pañol del Piso Tecnológico traiga el repuesto.',
        actionCheck: '¿El periférico no está en la sala?'
      }
    ],
    resolutionTip: 'No fuerces los conectores USB. Si una ficha está rota o torcida, repórtalo para evitar dañar la placa madre.'
  },
  {
    id: 'performance',
    title: 'PC congelada o muy lenta',
    subtitle: 'Windows no responde a clics, tarda minutos en abrir carpetas o el cursor gira sin parar.',
    icon: '⏳',
    badge: 'Rendimiento',
    recommendedIssue: 'La computadora se traba o anda muy lenta',
    steps: [
      {
        step: 1,
        title: 'Cerrar pestañas pesadas o programas en segundo plano',
        detail: 'Tener decenas de videos o pestañas abiertas en el navegador satura la memoria RAM. Cierra lo que no estés usando.',
        actionCheck: '¿Mejoró la velocidad al cerrar ventanas innecesarias?'
      },
      {
        step: 2,
        title: 'Reinicio limpio del equipo',
        detail: 'Ve a Inicio -> Apagar -> Reiniciar. Si la pantalla no responde en absoluto, mantén presionado el botón de encendido de la CPU durante 8 segundos hasta que se apague y vuelve a encender.',
        actionCheck: '¿El equipo respondió tras el reinicio?'
      }
    ],
    resolutionTip: 'Si tras reiniciar la máquina sigue demorando más de 10 minutos en responder, puede tratarse de un problema en el disco o perfil de usuario.'
  },
  {
    id: 'tv',
    title: 'Smart TV sin señal o pantalla apagada (Sala 1 y 3)',
    subtitle: 'La televisión de la sala no muestra la presentación o no recibe señal de la PC docente.',
    icon: '📺',
    badge: 'Smart TV & Pantalla',
    recommendedIssue: 'Falla o sin señal en Smart TV',
    steps: [
      {
        step: 1,
        title: 'Verificar la fuente de entrada (Input / Source)',
        detail: 'Con el control remoto o los botones laterales del TV, presiona "Source" o "Input" y selecciona HDMI 1 o HDMI 2 según donde esté conectado el cable.',
        actionCheck: '¿La entrada seleccionada en la TV coincide con el puerto del cable HDMI?'
      },
      {
        step: 2,
        title: 'Configurar duplicación en la computadora',
        detail: 'En el teclado de la PC docente presiona la tecla Windows + P y selecciona la opción "Duplicar" para clonar la pantalla en la TV.',
        actionCheck: '¿Pudiste activar la opción "Duplicar" en Windows?'
      },
      {
        step: 3,
        title: 'Ajustar el cable HDMI en la PC y en la TV',
        detail: 'Asegúrate de que el conector plano HDMI esté bien encajado en ambos extremos sin doblarse.',
        actionCheck: '¿El cable HDMI está bien insertado?'
      }
    ],
    resolutionTip: 'Si el control no responde o la TV no enciende, repórtalo para cambio de pilas o verificación del prolongador.'
  },
  {
    id: 'impresora3d',
    title: 'Impresora 3D atascada o sin calentar (Sala 1)',
    subtitle: 'La impresora 3D no inicia la impresión, la boquilla no calienta o el filamento patina.',
    icon: '🖨️',
    badge: 'Taller 3D (Sala 1)',
    recommendedIssue: 'Falla en Impresora 3D (atasco, filamento o calibración)',
    steps: [
      {
        step: 1,
        title: 'Comprobar temperatura de boquilla y cama',
        detail: 'En la pantalla de la impresora verifica si la boquilla alcanza los 200°C y la cama los 60°C para PLA.',
        actionCheck: '¿La temperatura en pantalla sube normalmente?'
      },
      {
        step: 2,
        title: 'Verificar el carrete de filamento',
        detail: 'Asegúrate de que el rollo gire libremente y el filamento no esté cruzado o estrangulado en el soporte.',
        actionCheck: '¿El filamento corre sin trabarse hacia el extrusor?'
      },
      {
        step: 3,
        title: 'No forzar la nivelación manual',
        detail: 'Si la primera capa raspa el vidrio o no se adhiere, detén la impresión desde la perilla (Stop/Pause) para no rayar la cama.',
        actionCheck: '¿Se detuvo la impresión a tiempo?'
      }
    ],
    resolutionTip: 'Para desatascos internos o cambios de boquilla (nozzle), solicita la asistencia directa de los técnicos del pañol.'
  }
];
