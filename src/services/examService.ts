/**
 * Servicio de Exámenes
 * Simula la base de datos y puede ser reemplazado por consumo de APIs reales
 * 
 * Estructura basada en el diagrama de BD:
 * - usuarios (roles: servicios_escolares, jefe_carrera)
 * - exámenes
 * - estudiantes
 * - grupos
 * - materias
 * - profesores
 * - auditoría
 */

// ===== TIPOS DE DATOS =====
export interface Usuario {
  id: number;
  nombre_usuario: string;
  password_hash: string;
  rol_id: number;
  created_at: string;
}

export interface Rol {
  id: number;
  nombre: string;
  description: string;
  created_at: string;
}

export interface Estudiante {
  id: number;
  nombre_usuario: string;
  email: string;
  grupo_id: number;
  carrera_id: number;
  created_at: string;
}

export interface Materia {
  id: number;
  clave: string;
  nombre: string;
  semestre: number;
  es_inglesa: boolean;
  carrera_id: number;
  created_at: string;
  updated_at: string;
}

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario_id: number;
  created_at: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  semestre: number;
  carrera_id: number;
  profesor_id: number;
  materia_id: number;
  capacidad_alumnos: number;
  aula_id: number;
  tipo: string;
  created_at: string;
}

export interface Examen {
  id: number;
  grupo_id: number;
  materia_id: number;
  tipo_examen_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  numero_alumnos: number;
  calificaciones: number;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface TipoExamen {
  id: number;
  nombre: string;
  description: string;
  created_at: string;
}

export interface Auditoría {
  id: number;
  accion: string;
  tabla_afectada: string;
  registro_id: number;
  usuario_id: number;
  tipo_examen_id: number;
  datos_anteriores: string;
  datos_nuevos: string;
  fecha_cambio: string;
  created_at: string;
}

export interface ProfesorSinodales {
  id: number;
  profesor_id: number;
  sinodal_id: number;
  materia_id: number;
  created_at: string;
}

export interface Notificación {
  id: number;
  profesor_id: number;
  aula_id: number;
  grupo_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  numero_alumnos: number;
  calificaciones: number;
  motive: string;
  created_at: string;
}

// ===== DATOS SIMULADOS =====

// Base de datos simulada
const database = {
  roles: [
    { id: 1, nombre: 'Servicios Escolares', description: 'Administrador de servicios escolares' },
    { id: 2, nombre: 'Jefe de Carrera', description: 'Jefe de programa académico' },
    { id: 3, nombre: 'Profesor', description: 'Personal docente' },
    { id: 4, nombre: 'Estudiante', description: 'Estudiante (sin acceso a este sistema)' }
  ],

  usuarios: [
    { id: 1, nombre_usuario: 'servicios@unsis.edu', password_hash: 'hash123', rol_id: 1, created_at: '2025-01-15' },
    { id: 2, nombre_usuario: 'jefe.informatica@unsis.edu', password_hash: 'hash456', rol_id: 2, created_at: '2025-01-16' },
    { id: 3, nombre_usuario: 'jefe.medicina@unsis.edu', password_hash: 'hash789', rol_id: 2, created_at: '2025-01-16' }
  ],

  carreras: [
    { id: 1, nombre: 'Informática', codigo: 'INF', descripcion: 'Ingeniería en Informática', created_at: '2024-01-01' },
    { id: 2, nombre: 'Medicina', codigo: 'MED', descripcion: 'Licenciatura en Medicina', created_at: '2024-01-01' },
    { id: 3, nombre: 'Administración', codigo: 'ADM', descripcion: 'Administración Municipal', created_at: '2024-01-01' }
  ],

  materias: [
    { id: 1, clave: 'MAT101', nombre: 'Matemáticas I', semestre: 1, es_inglesa: false, carrera_id: 1, created_at: '2024-01-01', updated_at: '2025-01-01' },
    { id: 2, clave: 'FIS101', nombre: 'Física General', semestre: 1, es_inglesa: false, carrera_id: 1, created_at: '2024-01-01', updated_at: '2025-01-01' },
    { id: 3, clave: 'QUI102', nombre: 'Química Orgánica', semestre: 2, es_inglesa: false, carrera_id: 1, created_at: '2024-01-01', updated_at: '2025-01-01' },
    { id: 4, clave: 'ANA101', nombre: 'Anatomía Humana', semestre: 1, es_inglesa: false, carrera_id: 2, created_at: '2024-01-01', updated_at: '2025-01-01' }
  ],

  profesores: [
    { id: 1, nombre: 'Juan', apellido: 'García', email: 'juan.garcia@unsis.edu', usuario_id: 1, created_at: '2024-02-01' },
    { id: 2, nombre: 'María', apellido: 'López', email: 'maria.lopez@unsis.edu', usuario_id: 2, created_at: '2024-02-01' },
    { id: 3, nombre: 'Carlos', apellido: 'Martínez', email: 'carlos.martinez@unsis.edu', usuario_id: 3, created_at: '2024-02-01' }
  ],

  grupos: [
    { id: 1, nombre: 'INF-101A', semestre: 1, carrera_id: 1, profesor_id: 1, materia_id: 1, capacidad_alumnos: 30, aula_id: 1, tipo: 'teoría', created_at: '2025-01-20' },
    { id: 2, nombre: 'INF-102B', semestre: 1, carrera_id: 1, profesor_id: 2, materia_id: 2, capacidad_alumnos: 25, aula_id: 2, tipo: 'teoría', created_at: '2025-01-20' },
    { id: 3, nombre: 'MED-101A', semestre: 1, carrera_id: 2, profesor_id: 3, materia_id: 4, capacidad_alumnos: 20, aula_id: 3, tipo: 'teoría', created_at: '2025-01-20' }
  ],

  tipos_examen: [
    { id: 1, nombre: 'Parcial', description: 'Examen parcial', created_at: '2024-01-01' },
    { id: 2, nombre: 'Ordinario', description: 'Examen ordinario', created_at: '2024-01-01' },
    { id: 3, nombre: 'Extraordinario', description: 'Examen extraordinario', created_at: '2024-01-01' },
    { id: 4, nombre: 'Recursamiento', description: 'Examen de recursamiento', created_at: '2024-01-01' }
  ],

  examenes: [
    {
      id: 1,
      grupo_id: 1,
      materia_id: 1,
      tipo_examen_id: 1,
      fecha: '2025-03-15',
      hora_inicio: '09:00',
      hora_fin: '10:30',
      numero_alumnos: 28,
      calificaciones: 8.5,
      estado: 'programado',
      created_at: '2025-02-15',
      updated_at: '2025-02-15'
    },
    {
      id: 2,
      grupo_id: 2,
      materia_id: 2,
      tipo_examen_id: 1,
      fecha: '2025-03-16',
      hora_inicio: '10:00',
      hora_fin: '11:30',
      numero_alumnos: 24,
      calificaciones: 7.8,
      estado: 'programado',
      created_at: '2025-02-15',
      updated_at: '2025-02-15'
    },
    {
      id: 3,
      grupo_id: 3,
      materia_id: 4,
      tipo_examen_id: 2,
      fecha: '2025-03-17',
      hora_inicio: '14:00',
      hora_fin: '15:30',
      numero_alumnos: 19,
      calificaciones: 8.2,
      estado: 'programado',
      created_at: '2025-02-15',
      updated_at: '2025-02-15'
    }
  ],

  estudiantes: [
    { id: 1, nombre_usuario: 'est001@unsis.edu', email: 'est001@unsis.edu', grupo_id: 1, carrera_id: 1, created_at: '2025-01-10' },
    { id: 2, nombre_usuario: 'est002@unsis.edu', email: 'est002@unsis.edu', grupo_id: 1, carrera_id: 1, created_at: '2025-01-10' },
    { id: 3, nombre_usuario: 'est003@unsis.edu', email: 'est003@unsis.edu', grupo_id: 3, carrera_id: 2, created_at: '2025-01-10' }
  ],

  notificaciones: [
    { id: 1, profesor_id: 1, aula_id: 1, grupo_id: 1, fecha: '2025-03-15', hora_inicio: '09:00', hora_fin: '10:30', numero_alumnos: 28, calificaciones: 8.5, motive: 'Examen Parcial Matemáticas', created_at: '2025-02-15' }
  ],

  auditoria: [
    { id: 1, accion: 'CREATE', tabla_afectada: 'examenes', registro_id: 1, usuario_id: 1, tipo_examen_id: 1, datos_anteriores: 'null', datos_nuevos: '{"fecha":"2025-03-15"}', fecha_cambio: '2025-02-15', created_at: '2025-02-15' }
  ]
};

// ===== FUNCIONES DE SERVICIO (Simuladas) =====

/**
 * EXÁMENES - Obtener todos los exámenes
 * TODO: Reemplazar con: GET /api/examenes
 */
export const obtenerExamenes = (): Examen[] => {
  return database.examenes;
};

/**
 * EXÁMENES - Obtener exámenes por carrera
 * TODO: Reemplazar con: GET /api/examenes?carrera_id=:id
 */
export const obtenerExamenesPorCarrera = (carreraId: number): Examen[] => {
  return database.examenes.filter(exam => {
    const grupo = database.grupos.find(g => g.id === exam.grupo_id);
    return grupo?.carrera_id === carreraId;
  });
};

/**
 * EXÁMENES - Crear nuevo examen
 * TODO: Reemplazar con: POST /api/examenes
 */
export const crearExamen = (examen: Omit<Examen, 'id' | 'created_at' | 'updated_at'>): Examen => {
  const nuevoExamen: Examen = {
    ...examen,
    id: Math.max(...database.examenes.map(e => e.id), 0) + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  database.examenes.push(nuevoExamen);
  // TODO: Registrar en auditoría
  return nuevoExamen;
};

export const agregarExamen = (examen: any) => {
  crearExamen(examen);
}

/**
 * TIPOS DE EXAMEN - Obtener todos los tipos
 */
export const obtenerTiposExamen = (): TipoExamen[] => {
  return database.tipos_examen;
};


/**
 * EXÁMENES - Actualizar examen
 * TODO: Reemplazar con: PUT /api/examenes/:id
 */
export const actualizarExamen = (id: number, cambios: Partial<Examen>): Examen | null => {
  const examen = database.examenes.find(e => e.id === id);
  if (!examen) return null;
  
  const antiguo = { ...examen };
  Object.assign(examen, cambios, { updated_at: new Date().toISOString() });
  
  // TODO: Registrar en auditoría
  console.log('Auditoría:', { usuario_id: 1, accion: 'UPDATE', cambios: { antiguo, nuevo: examen } });
  
  return examen;
};

/**
 * EXÁMENES - Eliminar examen
 * TODO: Reemplazar con: DELETE /api/examenes/:id
 */
export const eliminarExamen = (id: number): boolean => {
  const index = database.examenes.findIndex(e => e.id === id);
  if (index === -1) return false;
  database.examenes.splice(index, 1);
  // TODO: Registrar en auditoría
  return true;
};

/**
 * GRUPOS - Obtener todos los grupos
 * TODO: Reemplazar con: GET /api/grupos
 */
export const obtenerGrupos = (): Grupo[] => {
  return database.grupos;
};

/**
 * GRUPOS - Obtener grupos por carrera
 * TODO: Reemplazar con: GET /api/grupos?carrera_id=:id
 */
export const obtenerGruposPorCarrera = (carreraId: number): Grupo[] => {
  return database.grupos.filter(g => g.carrera_id === carreraId);
};

/**
 * MATERIAS - Obtener todas las materias
 * TODO: Reemplazar con: GET /api/materias
 */
export const obtenerMaterias = (): Materia[] => {
  return database.materias;
};

/**
 * MATERIAS - Obtener materias por carrera
 * TODO: Reemplazar con: GET /api/materias?carrera_id=:id
 */
export const obtenerMateriasPorCarrera = (carreraId: number): Materia[] => {
  return database.materias.filter(m => m.carrera_id === carreraId);
};

/**
 * PROFESORES - Obtener todos los profesores
 * TODO: Reemplazar con: GET /api/profesores
 */
export const obtenerProfesores = (): Profesor[] => {
  return database.profesores;
};

/**
 * CARRERAS - Obtener todas las carreras
 * TODO: Reemplazar con: GET /api/carreras
 */
export const obtenerCarreras = () => {
  return database.carreras;
};

/**
 * NOTIFICACIONES - Obtener notificaciones por profesor
 * TODO: Reemplazar con: GET /api/notificaciones?profesor_id=:id
 */
export const obtenerNotificacionesPorProfesor = (profesorId: number): Notificación[] => {
  return database.notificaciones.filter(n => n.profesor_id === profesorId);
};

/**
 * AUDITORÍA - Registrar cambio
 * TODO: Reemplazar con: POST /api/auditoria
 */
export const registrarAuditoria = (accion: string, tablaAfectada: string, usuarioId: number, cambios: any): void => {
  // TODO: Enviar a POST /api/auditoria
  console.log('Auditoría registrada:', { accion, tablaAfectada, usuarioId, cambios });
};

// ===== FUNCIONES AUXILIARES =====

export const obtenerNombreMateria = (materiaId: number): string => {
  const materia = database.materias.find(m => m.id === materiaId);
  return materia?.nombre || 'Desconocida';
};

export const obtenerNombreGrupo = (grupoId: number): string => {
  const grupo = database.grupos.find(g => g.id === grupoId);
  return grupo?.nombre || 'Desconocido';
};

export const obtenerNombreTipoExamen = (tipoId: number): string => {
  const tipo = database.tipos_examen.find(t => t.id === tipoId);
  return tipo?.nombre || 'Desconocido';
};

export const obtenerNombreCarrera = (carreraId: number): string => {
  const carrera = database.carreras.find(c => c.id === carreraId);
  return carrera?.nombre || 'Desconocida';
};

/**
 * Formato de fecha para mostrar
 */
export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
};
