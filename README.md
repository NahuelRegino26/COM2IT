# Com2IT - Asistente IT y Gestión de Piso Tecnológico

**Com2IT** es una Progressive Web App (PWA) diseñada para el soporte, diagnóstico y gestión de incidencias técnicas en las salas de informática y piso tecnológico del **Colegio Comercio 2**.

---

## 🚀 Características Principales

1. **Identidad Visual & PWA:**
   - Inspirada en los colores institucionales (Rojo `#991B1B` y Amarillo/Oro `#F59E0B`) con un diseño moderno de escudo, engranajes y monitores en estilo Dark Tech.
   - Totalmente instalable en Windows, Linux, Android e iOS en modo *Standalone*.
   - Funcionamiento sin conexión a red (Offline) con Service Worker y cola local de incidencias (`localStorage`).

2. **Módulo 1: Diagnóstico Guiado de Autoservicio:**
   - Asistente interactivo para alumnos y profesores con pasos prácticos para resolver fallas cotidianas:
     - *La PC no enciende / Problemas eléctricos y zapatillas.*
     - *No aparece imagen / Monitor en negro o sin señal.*
     - *Sin conexión a Internet / Conectores RJ45 y rosetas.*
     - *PC congelada o con lentitud extrema.*
     - *Periféricos faltantes o sin respuesta (Teclado / Mouse).*
     - *Fallas de Audio / Salida en jack verde.*
   - Botón directo de derivación hacia el Piso Tecnológico si el problema no se resuelve.

3. **Módulo 2: Reporte de Incidencias hacia el Piso Tecnológico:**
   - Formulario estructurado para reportar equipos afectados:
     - Selección de sala (**Sala 1**, **Sala 2**, **Sala 3**, **Piso Tecnológico**).
     - Identificador de equipo / inventario (ej. `PC-04`, `Puesto Docente`).
     - Tipo de problema o faltante.
     - Nivel de prioridad (Baja, Media, Alta, Urgente).
     - Datos de emisor y notas adicionales.

4. **Módulo 3: Tablero en Vivo & Conexión con Supabase:**
   - Almacenamiento centralizado en la nube mediante PostgreSQL en **Supabase** (`reportes_incidencias`).
   - Sincronización en tiempo real (*Realtime*) y fallback automático offline.
   - Filtros de consulta inmediata por sala.

---

## 📁 Estructura del Proyecto

```
App-Demo/
├── .gitignore                    # Reglas de exclusión para Git
├── AGENT.md                      # Directrices del agente en Antigravity
├── README.md                     # Documentación general del proyecto
├── index.html                    # Interfaz principal de la PWA
├── manifest.json                 # Web App Manifest (PWA)
├── service-worker.js             # Service Worker con caché offline
├── supabase_schema.sql           # Script SQL para crear las tablas en Supabase
├── icon-192.png                  # Icono PWA 192x192
├── icon-512.png                  # Icono PWA 512x512
├── assets/
│   └── icons/
│       ├── icon.svg              # Escudo institucional vectorial
│       ├── icon-192.png
│       └── icon-512.png
├── css/
│   └── styles.css                # Paleta institucional, variables y responsive design
└── js/
    ├── config.js                 # Constantes de configuración y credenciales Supabase
    ├── diagnostic-data.js        # Casos y pasos guiados de diagnóstico
    ├── supabase-service.js       # Capa de datos (Supabase + Cola offline)
    └── app.js                    # Controlador general de interfaz y eventos
```

---

## 🗄️ Configuración de la Base de Datos (Supabase)

1. Ingresa a tu panel en [supabase.com](https://supabase.com).
2. Ve a la sección **SQL Editor** y ejecuta el contenido del archivo `supabase_schema.sql`.
3. Obtén tu **Project URL** y tu **anon key** en *Project Settings* -> *API*.
4. Abre la PWA, ve a la pestaña **⚙️ Configuración** e introduce las credenciales (o edita directamente `js/config.js`).

---

## 💻 Ejecución Local

Para probar la PWA con soporte completo de Service Worker, sirve los archivos con cualquier servidor HTTP local:

```bash
# Con Node.js (npx)
npx serve .

# O con Python (si estuviera disponible)
python -m http.server 8080
```

---

## 🐙 Control de Versiones con Git y GitHub

Para subir el proyecto a un repositorio en GitHub:

```bash
# 1. Enlazar con tu repositorio remoto en GitHub
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# 2. Asegurar la rama principal
git branch -M main

# 3. Subir los cambios a GitHub
git push -u origin main
```

