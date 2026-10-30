# Com2IT - Asistente IT y Piso Tecnológico (Colegio Comercio N°2)

**Com2IT** es una Progressive Web App (PWA) de soporte, diagnóstico y gestión de incidencias técnicas en las salas de informática, vinculada en tiempo real al **Piso Tecnológico** del **Colegio Comercio N°2 (La Rioja)**.

---

## 🌟 Nueva Arquitectura y Flujo de Usuario (Landing Page)

La aplicación cuenta con una **Landing Page inicial** limpia, moderna e intuitiva:

1. **Pantalla de Inicio (Landing Page):**
   - Presentación institucional amigable para docentes de todas las áreas (historia, matemática, lengua, etc.) y alumnos.
   - **Botón de Acceso Directo 1: 🛠️ Diagnóstico Rápido de PC:** Pasos claros y sencillos de autoservicio para resolver problemas frecuentes en el aula (la PC no enciende, no da imagen, no conecta a Internet, o está congelada).
   - **Botón de Acceso Directo 2: 📝 Reportar Falla o Faltante:** Notificación rápida hacia el Piso Tecnológico.
   - **Tarjetas de Salas de Informática:**
     - **Sala 1:** PCs de escritorio, red escolar, Impresoras 3D y Smart TV.
     - **Sala 2:** PCs de escritorio y red escolar.
     - **Sala 3:** PCs de escritorio, red escolar y Smart TV.

2. **Formulario de Reporte Simplificado:**
   - Selección de sala (**Sala 1**, **Sala 2**, **Sala 3**).
   - Banner contextual dinámico que indica qué equipamiento posee la sala seleccionada.
   - Selector / píldoras rápidas para equipo o periférico (PC, Teclado, Mouse, Monitor, Smart TV, Impresora 3D, Cable de red).
   - Integración invisible con Supabase (el docente no debe configurar URLs ni API Keys).

3. **PWA Standalone & Offline First:**
   - Instalable en Windows, Android o iOS (`manifest.json`).
   - `service-worker.js` garantiza funcionamiento sin conexión a red y almacenamiento de reportes en cola local (`localStorage`) que se sincronizan solos al reconectar.

4. **Monitoreo en Tiempo Real (Piso Tecnológico):**
   - Base de datos en PostgreSQL mediante **Supabase** (`reportes_incidencias`).
   - Tablero en vivo con filtros por sala y estado de atención (Pendiente, En revisión, Resuelto).

---

## 📁 Estructura del Proyecto

```text
App-Demo/
├── index.html                    # Landing Page institucional y vistas SPA
├── manifest.json                 # Web App Manifest PWA (modo standalone)
├── service-worker.js             # Service Worker con caché offline
├── supabase_schema.sql           # Script SQL para tablas, RLS e índices en Supabase
├── README.md                     # Documentación general
├── assets/
│   └── icons/
│       ├── icon.svg              # Escudo institucional vectorial Comercio N°2
│       ├── icon-192.png          # Icono PWA 192x192
│       ├── icon-512.png          # Icono PWA 512x512
│       └── logo-original.jpg     # Logo original institucional
├── css/
│   └── styles.css                # Estilos Landing Page, componentes y responsive
└── js/
    ├── config.js                 # Salas, catálogo de fallas y credenciales fijas
    ├── diagnostic-data.js        # Casos guiados de diagnóstico rápido
    ├── supabase-service.js       # Conexión Supabase y cola offline
    └── app.js                    # Controlador de vistas, eventos y navegación
```

---

## 🗄️ Esquema de Base de Datos (Supabase)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.reportes_incidencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sala TEXT NOT NULL CHECK (sala IN ('Sala 1', 'Sala 2', 'Sala 3', 'Piso Tecnológico', 'Otra')),
    numero_equipo TEXT NOT NULL,
    tipo_problema TEXT NOT NULL,
    prioridad TEXT NOT NULL DEFAULT 'Media',
    reportado_por TEXT NOT NULL DEFAULT 'Docente a cargo',
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En revisión', 'Resuelto', 'Descartado')),
    tecnico_asignado TEXT,
    notas_resolucion TEXT
);

ALTER TABLE public.reportes_incidencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir registro de incidencias publico" ON public.reportes_incidencias FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura de incidencias" ON public.reportes_incidencias FOR SELECT USING (true);
CREATE POLICY "Permitir actualizacion de incidencias" ON public.reportes_incidencias FOR UPDATE USING (true);
```

---

## 🐙 Repositorio Oficial en GitHub

- **URL:** [https://github.com/NahuelRegino26/COM2IT](https://github.com/NahuelRegino26/COM2IT)
- **Rama:** `main`
