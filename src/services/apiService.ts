const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ============================================
// UTILIDADES
// ============================================
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// ============================================
// AUTENTICACIÓN
// ============================================
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// CARRERAS
// ============================================
export const obtenerCarreras = async () => {
  const response = await fetch(`${API_URL}/carreras`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// PERÍODOS
// ============================================
export const obtenerPeriodos = async (idCarrera?: number) => {
  const url = idCarrera 
    ? `${API_URL}/periodos?id_carrera=${idCarrera}`
    : `${API_URL}/periodos`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const crearPeriodo = async (periodo: any) => {
  const response = await fetch(`${API_URL}/periodos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(periodo)
  });
  return handleResponse(response);
};

// ============================================
// GRUPOS
// ============================================
export const obtenerGrupos = async (idCarrera?: number) => {
  const url = idCarrera 
    ? `${API_URL}/grupos?id_carrera=${idCarrera}`
    : `${API_URL}/grupos`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// MATERIAS
// ============================================
export const obtenerMaterias = async (idCarrera?: number, semestre?: number) => {
  let url = `${API_URL}/materias?`;
  if (idCarrera) url += `id_carrera=${idCarrera}&`;
  if (semestre) url += `semestre=${semestre}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// PROFESORES
// ============================================
export const obtenerProfesores = async () => {
  const response = await fetch(`${API_URL}/profesores`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const obtenerProfesoresDisponibles = async (fecha: string, idHorario: number) => {
  const response = await fetch(
    `${API_URL}/profesores/disponibles?fecha=${fecha}&id_horario=${idHorario}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse(response);
};

// ============================================
// AULAS
// ============================================
export const obtenerAulas = async () => {
  const response = await fetch(`${API_URL}/aulas`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const obtenerAulasDisponibles = async (fecha: string, idHorario: number) => {
  const response = await fetch(
    `${API_URL}/aulas/disponibles?fecha=${fecha}&id_horario=${idHorario}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse(response);
};

// ============================================
// HORARIOS
// ============================================
export const obtenerHorarios = async () => {
  const response = await fetch(`${API_URL}/horarios`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// TIPOS DE EXAMEN
// ============================================
export const obtenerTiposExamen = async () => {
  const response = await fetch(`${API_URL}/tipos-examen`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// EXÁMENES
// ============================================
export const obtenerExamenes = async (idCarrera?: number, idPeriodo?: number) => {
  let url = `${API_URL}/examenes?`;
  if (idCarrera) url += `id_carrera=${idCarrera}&`;
  if (idPeriodo) url += `id_periodo=${idPeriodo}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const crearExamen = async (examen: any) => {
  const response = await fetch(`${API_URL}/examenes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(examen)
  });
  return handleResponse(response);
};

export const crearExamenesMasivo = async (examenes: any[]) => {
  const response = await fetch(`${API_URL}/examenes/masivo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ examenes })
  });
  return handleResponse(response);
};

export const actualizarExamen = async (idExamen: number, datos: any) => {
  const response = await fetch(`${API_URL}/examenes/${idExamen}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(datos)
  });
  return handleResponse(response);
};

export const eliminarExamen = async (idExamen: number) => {
  const response = await fetch(`${API_URL}/examenes/${idExamen}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// ============================================
// SINODALES
// ============================================
export const asignarSinodal = async (idExamen: number, idProfesor: number) => {
  const response = await fetch(`${API_URL}/sinodales`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ id_examen: idExamen, id_profesor: idProfesor })
  });
  return handleResponse(response);
};

export const obtenerSinodales = async (idExamen: number) => {
  const response = await fetch(`${API_URL}/sinodales/${idExamen}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const eliminarSinodal = async (idSinodal: number) => {
  const response = await fetch(`${API_URL}/sinodales/${idSinodal}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};