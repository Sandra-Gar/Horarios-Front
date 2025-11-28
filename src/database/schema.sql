-- ============================================
-- SISTEMA DE GESTIÓN DE EXÁMENES
-- Universidad de la Sierra Sur
-- ============================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS sinodal CASCADE;
DROP TABLE IF EXISTS examen CASCADE;
DROP TABLE IF EXISTS profesor_materia CASCADE;
DROP TABLE IF EXISTS profesor CASCADE;
DROP TABLE IF EXISTS materia CASCADE;
DROP TABLE IF EXISTS tipo_examen CASCADE;
DROP TABLE IF EXISTS periodo_examen CASCADE;
DROP TABLE IF EXISTS horario CASCADE;
DROP TABLE IF EXISTS aula CASCADE;
DROP TABLE IF EXISTS grupo CASCADE;
DROP TABLE IF EXISTS carrera CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS rol CASCADE;

-- ============================================
-- TABLA: rol
-- ============================================
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- ============================================
-- TABLA: usuario
-- ============================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    id_rol INT REFERENCES rol(id_rol),
    id_carrera INT,
    activo BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLA: carrera
-- ============================================
CREATE TABLE carrera (
    id_carrera SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    clave VARCHAR(20) UNIQUE NOT NULL
);

-- ============================================
-- TABLA: aula
-- ============================================
CREATE TABLE aula (
    id_aula SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    capacidad INT NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Normal', 'Laboratorio', 'Sala de cómputo'))
);

-- ============================================
-- TABLA: horario
-- ============================================
CREATE TABLE horario (
    id_horario SERIAL PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CHECK (hora_inicio < hora_fin)
);

-- ============================================
-- TABLA: periodo_examen
-- ============================================
CREATE TABLE periodo_examen (
    id_periodo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_carrera INT REFERENCES carrera(id_carrera),
    activo BOOLEAN DEFAULT TRUE,
    CHECK (fecha_inicio < fecha_fin)
);

-- ============================================
-- TABLA: tipo_examen
-- ============================================
CREATE TABLE tipo_examen (
    id_tipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_minutos INT NOT NULL
);

-- ============================================
-- TABLA: grupo
-- ============================================
CREATE TABLE grupo (
    id_grupo SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    semestre INT NOT NULL,
    id_carrera INT REFERENCES carrera(id_carrera),
    capacidad_alumnos INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLA: materia
-- ============================================
CREATE TABLE materia (
    id_materia SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    clave VARCHAR(20) UNIQUE NOT NULL,
    academia VARCHAR(100),
    semestre INT NOT NULL,
    id_carrera INT REFERENCES carrera(id_carrera)
);

-- ============================================
-- TABLA: profesor
-- ============================================
CREATE TABLE profesor (
    id_profesor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    titulo VARCHAR(50),
    status BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABLA: profesor_materia
-- ============================================
CREATE TABLE profesor_materia (
    id_profesor INT REFERENCES profesor(id_profesor),
    id_materia INT REFERENCES materia(id_materia),
    id_grupo INT REFERENCES grupo(id_grupo),
    PRIMARY KEY (id_profesor, id_materia, id_grupo)
);

-- ============================================
-- TABLA: examen
-- ============================================
CREATE TABLE examen (
    id_examen SERIAL PRIMARY KEY,
    id_materia INT REFERENCES materia(id_materia) NOT NULL,
    id_grupo INT REFERENCES grupo(id_grupo) NOT NULL,
    id_aula INT REFERENCES aula(id_aula) NOT NULL,
    id_horario INT REFERENCES horario(id_horario) NOT NULL,
    id_tipo INT REFERENCES tipo_examen(id_tipo) NOT NULL,
    id_periodo INT REFERENCES periodo_examen(id_periodo) NOT NULL,
    profesor_titular_id INT REFERENCES profesor(id_profesor) NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: sinodal
-- ============================================
CREATE TABLE sinodal (
    id_sinodal SERIAL PRIMARY KEY,
    id_examen INT REFERENCES examen(id_examen) ON DELETE CASCADE,
    id_profesor INT REFERENCES profesor(id_profesor),
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_examen, id_profesor)
);

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================
CREATE INDEX idx_examen_fecha ON examen(fecha);
CREATE INDEX idx_examen_grupo ON examen(id_grupo);
CREATE INDEX idx_examen_periodo ON examen(id_periodo);
CREATE INDEX idx_examen_estado ON examen(estado);
CREATE INDEX idx_profesor_materia_grupo ON profesor_materia(id_grupo);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Roles
INSERT INTO rol (nombre) VALUES 
    ('Administrador'),
    ('Jefe de Carrera'),
    ('Personal Administrativo');

-- Carreras
INSERT INTO carrera (nombre, clave) VALUES 
    ('Licenciatura en Informática', 'LI'),
    ('Licenciatura en Administración Pública', 'LAP'),
    ('Maestría en Gobierno Electrónico', 'MGE');

-- Usuarios
INSERT INTO usuario (nombre, email, username, password, id_rol, id_carrera) VALUES 
    ('Servicios Escolares', 'servicios@unsis.edu', 'servicios', 'pass123', 1, NULL),
    ('Jefe Informática', 'jefe.informatica@unsis.edu', 'jefe_info', 'pass123', 2, 1),
    ('Jefe Administración Pública', 'jefe.admonpub@unsis.edu', 'jefe_admon', 'pass123', 2, 2);

-- Tipos de Examen
INSERT INTO tipo_examen (nombre, duracion_minutos) VALUES 
    ('Parcial 1', 60),
    ('Parcial 2', 60),
    ('Parcial 3', 60),
    ('Ordinario', 120),
    ('Extraordinario', 120);

-- Aulas
INSERT INTO aula (nombre, capacidad, tipo) VALUES 
    ('CETI-S.O', 30, 'Laboratorio'),
    ('CETI-DES SW', 30, 'Laboratorio'),
    ('CETI-ING SW', 30, 'Laboratorio'),
    ('CETI-TEC WEB', 30, 'Laboratorio'),
    ('CETI-REDES', 30, 'Laboratorio'),
    ('D3', 40, 'Normal'),
    ('D4', 40, 'Normal'),
    ('SC 8', 35, 'Normal'),
    ('SC 9', 35, 'Normal'),
    ('B1', 40, 'Normal'),
    ('B2', 40, 'Normal'),
    ('CEDGE-DO', 25, 'Normal'),
    ('CEDGE-SIG', 25, 'Normal'),
    ('DEP8', 20, 'Normal'),
    ('DEP9', 20, 'Normal'),
    ('LGE', 25, 'Normal');

-- Horarios comunes
INSERT INTO horario (hora_inicio, hora_fin) VALUES 
    ('08:00', '10:00'),
    ('09:00', '11:00'),
    ('10:00', '12:00'),
    ('11:00', '13:00'),
    ('12:00', '14:00'),
    ('13:00', '15:00'),
    ('16:00', '18:00'),
    ('17:00', '19:00');

-- Grupos de Informática
INSERT INTO grupo (nombre, semestre, id_carrera, capacidad_alumnos) VALUES 
    ('106-A', 1, 1, 30),
    ('106-B', 1, 1, 30),
    ('306-A', 3, 1, 30),
    ('306-B', 3, 1, 30),
    ('506', 5, 1, 30),
    ('706', 7, 1, 30),
    ('906', 9, 1, 30);

-- Grupos de Administración Pública
INSERT INTO grupo (nombre, semestre, id_carrera, capacidad_alumnos) VALUES 
    ('105', 1, 2, 35),
    ('305', 3, 2, 35);

-- Materias de Informática - Semestre 1
INSERT INTO materia (nombre, clave, academia, semestre, id_carrera) VALUES 
    ('Diseño Estructurado de Algoritmos', 'INF-101', 'Programación', 1, 1),
    ('Administración', 'INF-102', 'Administración', 1, 1),
    ('Historia del Pensamiento Filosófico', 'INF-103', 'Humanidades', 1, 1),
    ('Lógica Matemática', 'INF-104', 'Matemáticas', 1, 1),
    ('Cálculo I', 'INF-105', 'Matemáticas', 1, 1);

-- Materias de Informática - Semestre 3
INSERT INTO materia (nombre, clave, academia, semestre, id_carrera) VALUES 
    ('Estructuras de Datos', 'INF-301', 'Programación', 3, 1),
    ('Electrónica Digital', 'INF-302', 'Hardware', 3, 1),
    ('Contabilidad y Finanzas', 'INF-303', 'Administración', 3, 1),
    ('Teoría de Autómatas', 'INF-304', 'Matemáticas', 3, 1),
    ('Álgebra Lineal', 'INF-305', 'Matemáticas', 3, 1);

-- Materias de Informática - Semestre 5
INSERT INTO materia (nombre, clave, academia, semestre, id_carrera) VALUES 
    ('Paradigmas de Programación II', 'INF-501', 'Programación', 5, 1),
    ('Redes I', 'INF-502', 'Redes', 5, 1),
    ('Bases de Datos II', 'INF-503', 'Bases de Datos', 5, 1),
    ('Fundamentos de Sistemas Operativos', 'INF-504', 'Sistemas', 5, 1),
    ('Diseño Web', 'INF-505', 'Web', 5, 1);

-- Materias de Informática - Semestre 7
INSERT INTO materia (nombre, clave, academia, semestre, id_carrera) VALUES 
    ('Tecnologías Web II', 'INF-701', 'Web', 7, 1),
    ('Bases de Datos Avanzadas', 'INF-702', 'Bases de Datos', 7, 1),
    ('Ingeniería de Software II', 'INF-703', 'Ingeniería', 7, 1),
    ('Probabilidad y Estadística', 'INF-704', 'Matemáticas', 7, 1),
    ('Derecho y Legislación en Informática', 'INF-705', 'Derecho', 7, 1);

-- Materias de Informática - Semestre 9
INSERT INTO materia (nombre, clave, academia, semestre, id_carrera) VALUES 
    ('Metodología de la Investigación', 'INF-901', 'Investigación', 9, 1),
    ('Seguridad de Centros de Informática', 'INF-902', 'Seguridad', 9, 1),
    ('Teoría de Algoritmos', 'INF-903', 'Matemáticas', 9, 1),
    ('Tecnologías de Información I', 'INF-904', 'TI', 9, 1),
    ('Inteligencia Artificial 1', 'INF-905', 'IA', 9, 1);

-- Profesores
INSERT INTO profesor (nombre, email, titulo) VALUES 
    ('Irving Ulises Hernández Miguel', 'irving.hernandez@unsis.edu', 'Mtro.'),
    ('Fabiola Crespo Barrios', 'fabiola.crespo@unsis.edu', 'M.I.S.'),
    ('Oswaldo Rey Ávila Barrón', 'oswaldo.avila@unsis.edu', 'M.I.T.I.'),
    ('Jesús Pacheco Mendoza', 'jesus.pacheco@unsis.edu', 'M.C.M.'),
    ('Enrique García Reyes', 'enrique.garcia@unsis.edu', 'M.C.'),
    ('Everardo de Jesús Pacheco Antonio', 'everardo.pacheco@unsis.edu', 'M.T.E.'),
    ('Eliezer Alcazar Silva', 'eliezer.alcazar@unsis.edu', 'M.C.C.'),
    ('Amando Alejandro Ruiz Figueroa', 'amando.ruiz@unsis.edu', 'Dr.'),
    ('Hadya Concepción Díaz Ortíz', 'hadya.diaz@unsis.edu', 'M.I.A.'),
    ('Mónica Pérez Meza', 'monica.perez@unsis.edu', 'M.C.'),
    ('Arisaí Darío Barragán López', 'arisai.barragan@unsis.edu', 'Dr.'),
    ('Silviana Juárez Chalini', 'silviana.juarez@unsis.edu', 'M.C.C.'),
    ('Eric Melecio Castro Leal', 'eric.castro@unsis.edu', 'Dr.'),
    ('Alejandro Jarillo Silva', 'alejandro.jarillo@unsis.edu', 'Dr.'),
    ('Gerardo Roberto Aragón González', 'gerardo.aragon@unsis.edu', 'M.J.O.S.A.');

-- Período de Exámenes - Segunda Evaluación Parcial
INSERT INTO periodo_examen (nombre, fecha_inicio, fecha_fin, id_carrera, activo) VALUES 
    ('Segunda Evaluación Parcial 2025-2026A', '2025-12-01', '2025-12-08', 1, TRUE),
    ('Segunda Evaluación Parcial 2025-2026A', '2025-12-01', '2025-12-08', 2, TRUE);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar fecha de modificación
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para examen
CREATE TRIGGER trigger_actualizar_examen
BEFORE UPDATE ON examen
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Función para validar disponibilidad de aula
CREATE OR REPLACE FUNCTION validar_disponibilidad_aula()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM examen 
        WHERE id_aula = NEW.id_aula 
        AND fecha = NEW.fecha 
        AND id_horario = NEW.id_horario
        AND id_examen != COALESCE(NEW.id_examen, -1)
    ) THEN
        RAISE EXCEPTION 'El aula ya está ocupada en ese horario';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_aula
BEFORE INSERT OR UPDATE ON examen
FOR EACH ROW
EXECUTE FUNCTION validar_disponibilidad_aula();

-- Función para validar disponibilidad de profesor
CREATE OR REPLACE FUNCTION validar_disponibilidad_profesor()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM examen 
        WHERE profesor_titular_id = NEW.profesor_titular_id 
        AND fecha = NEW.fecha 
        AND id_horario = NEW.id_horario
        AND id_examen != COALESCE(NEW.id_examen, -1)
    ) THEN
        RAISE EXCEPTION 'El profesor ya tiene un examen programado en ese horario';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_profesor
BEFORE INSERT OR UPDATE ON examen
FOR EACH ROW
EXECUTE FUNCTION validar_disponibilidad_profesor();

-- Vista para consultar exámenes completos
CREATE OR REPLACE VIEW vista_examenes_completos AS
SELECT 
    e.id_examen,
    e.fecha,
    e.estado,
    e.observaciones,
    m.nombre AS materia,
    m.clave AS clave_materia,
    g.nombre AS grupo,
    g.semestre,
    c.nombre AS carrera,
    a.nombre AS aula,
    h.hora_inicio,
    h.hora_fin,
    te.nombre AS tipo_examen,
    p.nombre AS profesor_titular,
    p.titulo AS titulo_profesor,
    pe.nombre AS periodo,
    (SELECT string_agg(ps.nombre, ', ') 
     FROM sinodal s 
     JOIN profesor ps ON s.id_profesor = ps.id_profesor 
     WHERE s.id_examen = e.id_examen) AS sinodales
FROM examen e
JOIN materia m ON e.id_materia = m.id_materia
JOIN grupo g ON e.id_grupo = g.id_grupo
JOIN carrera c ON g.id_carrera = c.id_carrera
JOIN aula a ON e.id_aula = a.id_aula
JOIN horario h ON e.id_horario = h.id_horario
JOIN tipo_examen te ON e.id_tipo = te.id_tipo
JOIN profesor p ON e.profesor_titular_id = p.id_profesor
JOIN periodo_examen pe ON e.id_periodo = pe.id_periodo;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================