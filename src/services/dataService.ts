import pool from '../config/database';

// ============================================
// CARRERAS
// ============================================
export const obtenerCarreras = async () => {
  const result = await pool.query('SELECT * FROM carrera ORDER BY nombre');
  return result.rows;
};

// ============================================
// PERÍODOS
// ============================================
export const obtenerPeriodos = async (idCarrera?: number) => {
  const query = idCarrera
    ? 'SELECT * FROM periodo_examen WHERE id_carrera = $1 AND activo = TRUE ORDER BY fecha_inicio DESC'
    : 'SELECT * FROM periodo_examen WHERE activo = TRUE ORDER BY fecha_inicio DESC';
  
  const result = idCarrera
    ? await pool.query(query, [idCarrera])
    : await pool.query(query);
  
  return result.rows;
};

export const crearPeriodo = async (periodo: any) => {
  const result = await pool.query(
    `INSERT INTO periodo_examen (nombre, fecha_inicio, fecha_fin, id_carrera) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [periodo.nombre, periodo.fecha_inicio, periodo.fecha_fin, periodo.id_carrera]
  );
  return result.rows[0];
};

// ============================================
// GRUPOS
// ============================================
export const obtenerGrupos = async (idCarrera?: number) => {
  const query = idCarrera
    ? 'SELECT * FROM grupo WHERE id_carrera = $1 AND activo = TRUE ORDER BY semestre, nombre'
    : 'SELECT * FROM grupo WHERE activo = TRUE ORDER BY semestre, nombre';
  
  const result = idCarrera
    ? await pool.query(query, [idCarrera])
    : await pool.query(query);
  
  return result.rows;
};

// ============================================
// MATERIAS
// ============================================
export const obtenerMaterias = async (idCarrera?: number, semestre?: number) => {
  let query = 'SELECT * FROM materia WHERE 1=1';
  const params: any[] = [];
  
  if (idCarrera) {
    params.push(idCarrera);
    query += ` AND id_carrera = $${params.length}`;
  }
  
  if (semestre) {
    params.push(semestre);
    query += ` AND semestre = $${params.length}`;
  }
  
  query += ' ORDER BY semestre, nombre';
  
  const result = await pool.query(query, params);
  return result.rows;
};

// ============================================
// PROFESORES
// ============================================
export const obtenerProfesores = async () => {
  const result = await pool.query(
    'SELECT * FROM profesor WHERE status = TRUE ORDER BY nombre'
  );
  return result.rows;
};

export const obtenerProfesoresDisponibles = async (fecha: string, idHorario: number, excluirId?: number) => {
  const query = `
    SELECT p.* FROM profesor p
    WHERE p.status = TRUE
    AND p.id_profesor NOT IN (
      SELECT profesor_titular_id FROM examen
      WHERE fecha = $1 AND id_horario = $2
      ${excluirId ? 'AND profesor_titular_id != $3' : ''}
    )
    ORDER BY p.nombre
  `;
  
  const params = excluirId ? [fecha, idHorario, excluirId] : [fecha, idHorario];
  const result = await pool.query(query, params);
  return result.rows;
};

// ============================================
// AULAS
// ============================================
export const obtenerAulas = async () => {
  const result = await pool.query('SELECT * FROM aula ORDER BY nombre');
  return result.rows;
};

export const obtenerAulasDisponibles = async (fecha: string, idHorario: number) => {
  const result = await pool.query(
    `SELECT a.* FROM aula a
     WHERE a.id_aula NOT IN (
       SELECT id_aula FROM examen
       WHERE fecha = $1 AND id_horario = $2
     )
     ORDER BY a.nombre`,
    [fecha, idHorario]
  );
  return result.rows;
};

// ============================================
// HORARIOS
// ============================================
export const obtenerHorarios = async () => {
  const result = await pool.query('SELECT * FROM horario ORDER BY hora_inicio');
  return result.rows;
};

// ============================================
// TIPOS DE EXAMEN
// ============================================
export const obtenerTiposExamen = async () => {
  const result = await pool.query('SELECT * FROM tipo_examen ORDER BY nombre');
  return result.rows;
};

// ============================================
// EXÁMENES
// ============================================
export const obtenerExamenes = async (idCarrera?: number, idPeriodo?: number) => {
  let query = `
    SELECT e.*, 
           m.nombre as materia_nombre,
           g.nombre as grupo_nombre,
           a.nombre as aula_nombre,
           p.nombre as profesor_nombre,
           te.nombre as tipo_nombre
    FROM examen e
    JOIN materia m ON e.id_materia = m.id_materia
    JOIN grupo g ON e.id_grupo = g.id_grupo
    JOIN aula a ON e.id_aula = a.id_aula
    JOIN profesor p ON e.profesor_titular_id = p.id_profesor
    JOIN tipo_examen te ON e.id_tipo = te.id_tipo
    WHERE 1=1
  `;
  
  const params: any[] = [];
  
  if (idCarrera) {
    params.push(idCarrera);
    query += ` AND g.id_carrera = $${params.length}`;
  }
  
  if (idPeriodo) {
    params.push(idPeriodo);
    query += ` AND e.id_periodo = $${params.length}`;
  }
  
  query += ' ORDER BY e.fecha, e.id_horario';
  
  const result = await pool.query(query, params);
  return result.rows;
};

export const crearExamen = async (examen: any) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Crear examen
    const resultExamen = await client.query(
      `INSERT INTO examen (
        id_materia, id_grupo, id_aula, id_horario, id_tipo, 
        id_periodo, profesor_titular_id, fecha, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        examen.id_materia,
        examen.id_grupo,
        examen.id_aula,
        examen.id_horario,
        examen.id_tipo,
        examen.id_periodo,
        examen.profesor_titular_id,
        examen.fecha,
        'pendiente'
      ]
    );
    
    const examenCreado = resultExamen.rows[0];
    
    // Asignar sinodal si existe
    if (examen.id_sinodal) {
      await client.query(
        'INSERT INTO sinodal (id_examen, id_profesor) VALUES ($1, $2)',
        [examenCreado.id_examen, examen.id_sinodal]
      );
    }
    
    await client.query('COMMIT');
    return examenCreado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const actualizarExamen = async (idExamen: number, datos: any) => {
  const result = await pool.query(
    `UPDATE examen 
     SET id_materia = $1, id_grupo = $2, id_aula = $3, id_horario = $4,
         id_tipo = $5, fecha = $6, profesor_titular_id = $7, estado = $8,
         observaciones = $9
     WHERE id_examen = $10 RETURNING *`,
    [
      datos.id_materia,
      datos.id_grupo,
      datos.id_aula,
      datos.id_horario,
      datos.id_tipo,
      datos.fecha,
      datos.profesor_titular_id,
      datos.estado,
      datos.observaciones,
      idExamen
    ]
  );
  return result.rows[0];
};

export const eliminarExamen = async (idExamen: number) => {
  await pool.query('DELETE FROM examen WHERE id_examen = $1', [idExamen]);
};

// ============================================
// SINODALES
// ============================================
export const asignarSinodal = async (idExamen: number, idProfesor: number) => {
  const result = await pool.query(
    `INSERT INTO sinodal (id_examen, id_profesor) 
     VALUES ($1, $2) 
     ON CONFLICT (id_examen, id_profesor) DO NOTHING
     RETURNING *`,
    [idExamen, idProfesor]
  );
  return result.rows[0];
};

export const obtenerSinodales = async (idExamen: number) => {
  const result = await pool.query(
    `SELECT s.*, p.nombre, p.titulo 
     FROM sinodal s
     JOIN profesor p ON s.id_profesor = p.id_profesor
     WHERE s.id_examen = $1`,
    [idExamen]
  );
  return result.rows;
};

export const eliminarSinodal = async (idSinodal: number) => {
  await pool.query('DELETE FROM sinodal WHERE id_sinodal = $1', [idSinodal]);
};

// ============================================
// VALIDACIONES
// ============================================
export const validarDisponibilidadAula = async (
  fecha: string,
  idHorario: number,
  idAula: number,
  idExamenExcluir?: number
) => {
  const query = `
    SELECT COUNT(*) as conflictos
    FROM examen
    WHERE fecha = $1 AND id_horario = $2 AND id_aula = $3
    ${idExamenExcluir ? 'AND id_examen != $4' : ''}
  `;
  
  const params = idExamenExcluir
    ? [fecha, idHorario, idAula, idExamenExcluir]
    : [fecha, idHorario, idAula];
  
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].conflictos) === 0;
};

export const validarDisponibilidadProfesor = async (
  fecha: string,
  idHorario: number,
  idProfesor: number,
  idExamenExcluir?: number
) => {
  const query = `
    SELECT COUNT(*) as conflictos
    FROM examen
    WHERE fecha = $1 AND id_horario = $2 AND profesor_titular_id = $3
    ${idExamenExcluir ? 'AND id_examen != $4' : ''}
`;
const params = idExamenExcluir
? [fecha, idHorario, idProfesor, idExamenExcluir]
: [fecha, idHorario, idProfesor];
const result = await pool.query(query, params);
return parseInt(result.rows[0].conflictos) === 0;
};