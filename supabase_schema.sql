-- ==============================================================================
-- Script de Base de Datos para Com2IT (Piso Tecnológico - Colegio Comercio 2)
-- Motor: Supabase / PostgreSQL
-- Tabla: reportes_incidencias
-- ==============================================================================

-- 1. Crear extensión para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear la tabla principal de reportes de incidencias
CREATE TABLE IF NOT EXISTS public.reportes_incidencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sala TEXT NOT NULL CHECK (sala IN ('Sala 1', 'Sala 2', 'Sala 3', 'Piso Tecnológico', 'Otra')),
    numero_equipo TEXT NOT NULL,
    tipo_problema TEXT NOT NULL,
    prioridad TEXT NOT NULL DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
    reportado_por TEXT NOT NULL DEFAULT 'Docente / Alumno',
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En revisión', 'Resuelto', 'Descartado')),
    tecnico_asignado TEXT,
    notas_resolucion TEXT
);

-- 3. Índices para agilizar búsquedas en el Piso Tecnológico
CREATE INDEX IF NOT EXISTS idx_reportes_sala ON public.reportes_incidencias (sala);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON public.reportes_incidencias (estado);
CREATE INDEX IF NOT EXISTS idx_reportes_created_at ON public.reportes_incidencias (created_at DESC);

-- 4. Habilitar Seguridad por Fila (Row Level Security - RLS)
ALTER TABLE public.reportes_incidencias ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de acceso (Políticas públicas para la clave pública 'anon' de la PWA)
-- Permitir a la PWA registrar incidencias (Insertar)
CREATE POLICY "Permitir registro de incidencias publico"
    ON public.reportes_incidencias
    FOR INSERT
    WITH CHECK (true);

-- Permitir a los usuarios y piso tecnológico consultar los reportes
CREATE POLICY "Permitir lectura de incidencias"
    ON public.reportes_incidencias
    FOR SELECT
    USING (true);

-- Permitir actualizar estado de incidencias desde el panel del piso tecnológico
CREATE POLICY "Permitir actualizacion de incidencias"
    ON public.reportes_incidencias
    FOR UPDATE
    USING (true);

-- 6. Trigger automático para actualizar 'updated_at' en cada modificación
CREATE OR REPLACE FUNCTION public.actualizar_timestamp_reporte()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_timestamp ON public.reportes_incidencias;
CREATE TRIGGER trigger_actualizar_timestamp
    BEFORE UPDATE ON public.reportes_incidencias
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp_reporte();

-- 7. Datos de prueba iniciales (Semilla de demostración para el Piso Tecnológico)
INSERT INTO public.reportes_incidencias 
    (sala, numero_equipo, tipo_problema, prioridad, reportado_por, descripcion, estado)
VALUES
    ('Sala 1', 'PC-03', 'No aparece imagen / Monitor en negro', 'Alta', 'Prof. Martín (Informática)', 'El monitor tiene la luz naranja titilando y no responde a la señal del cable VGA.', 'Pendiente'),
    ('Sala 2', 'PC-08', 'Periférico faltante o dañado', 'Media', 'Prof. Laura (Redes)', 'Falta el mouse USB. Se movió para un examen ayer y no regresó al puesto.', 'En revisión'),
    ('Sala 3', 'PC-15', 'Sin conexión a Internet / Red', 'Alta', 'Ayudante Técnico', 'El conector RJ45 de la roseta tiene la traba rota y se desconecta solo.', 'Resuelto')
ON CONFLICT DO NOTHING;

-- 8. Habilitar Supabase Realtime (para que el piso tecnológico reciba alertas en vivo)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.reportes_incidencias;
    END IF;
END $$;

