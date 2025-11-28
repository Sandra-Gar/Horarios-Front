<template>
  <div class="progress-container">

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h2>Progreso de Exámenes</h2>
          <p class="header-subtitle">{{ tipoRol }}</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Carrera:</label>
          <select v-model="carreraSeleccionada" @change="cargarGrupos" class="filter-select">
            <option value="">Seleccionar carrera...</option>
            <option v-for="carrera in carrerasDisponibles" :key="carrera.id" :value="carrera.id">
              {{ carrera.nombre }}
            </option>
          </select>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="content-section">
        <!-- Si no hay carrera seleccionada -->
        <div v-if="!carreraSeleccionada" class="empty-state">
          <i class="pi pi-info-circle"></i>
          <p>Selecciona una carrera para ver el progreso de los grupos</p>
        </div>

        <!-- Lista de Grupos -->
        <div v-else-if="gruposFiltrados.length > 0" class="grupos-grid">
          <div v-for="grupo in gruposFiltrados" :key="grupo.id" class="grupo-card">
            <div class="grupo-header">
              <h3>{{ grupo.nombre }}</h3>
              <span class="semester-badge">{{ grupo.semestre }}º Semestre</span>
            </div>
            
            <div class="grupo-info">
              <p><strong>Materia:</strong> {{ obtenerNombreMateria(grupo.materia_id) }}</p>
              <p><strong>Capacidad:</strong> {{ grupo.capacidad_alumnos }} estudiantes</p>
              <p><strong>Aula:</strong> {{ grupo.aula_id }}</p>
            </div>

            <div class="grupo-exams">
              <h4>Exámenes del Grupo</h4>
              <div v-if="obtenerExamenesGrupo(grupo.id).length > 0" class="exams-list">
                <div 
                  v-for="examen in obtenerExamenesGrupo(grupo.id)" 
                  :key="examen.id" 
                  class="exam-item"
                >
                  <div class="exam-info">
                    <span class="exam-tipo">{{ obtenerNombreTipoExamen(examen.tipo_examen_id) }}</span>
                    <span class="exam-fecha">{{ formatearFecha(examen.fecha) }}</span>
                  </div>
                  
                  <div class="exam-actions">
                    <button 
                      class="status-btn aprobado"
                      :class="{ active: examen.estado === 'aprobado' }"
                      @click="cambiarEstado(examen.id, 'aprobado')"
                      title="Aprobar"
                    >
                      <i class="pi pi-check"></i>
                    </button>
                    <button 
                      class="status-btn pendiente"
                      :class="{ active: examen.estado === 'pendiente' }"
                      @click="cambiarEstado(examen.id, 'pendiente')"
                      title="Pendiente"
                    >
                      <i class="pi pi-clock"></i>
                    </button>
                    <button 
                      class="status-btn rechazado"
                      :class="{ active: examen.estado === 'rechazado' }"
                      @click="cambiarEstado(examen.id, 'rechazado')"
                      title="Rechazar"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-exams">
                <p>No hay exámenes programados</p>
              </div>
            </div>

            <!-- Resumen de Estado -->
            <div class="grupo-summary">
              <div class="summary-item aprobado">
                <i class="pi pi-check-circle"></i>
                <span>{{ contarEstado(grupo.id, 'aprobado') }} Aprobados</span>
              </div>
              <div class="summary-item pendiente">
                <i class="pi pi-clock"></i>
                <span>{{ contarEstado(grupo.id, 'pendiente') }} Pendientes</span>
              </div>
              <div class="summary-item rechazado">
                <i class="pi pi-times-circle"></i>
                <span>{{ contarEstado(grupo.id, 'rechazado') }} Rechazados</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin grupos -->
        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>No hay grupos para esta carrera</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as examService from '../../services/examService';

const router = useRouter();

// Estado del usuario
const usuarioEmail = ref('');
const usuarioRol = ref<'servicios_escolares' | 'jefe_carrera'>('servicios_escolares');
const usuarioCarrera = ref<number | null>(null);

// Datos
const examenesData = ref<any[]>([]);
const gruposData = ref<any[]>([]);
const materiasData = ref<any[]>([]);
const carrerasData = ref<any[]>([]);
const carreraSeleccionada = ref<string>('');

// Propiedades computadas
const tipoRol = computed(() => {
  return usuarioRol.value === 'servicios_escolares' ? 'Servicios Escolares' : 'Jefe de Carrera';
});

const carrerasDisponibles = computed(() => {
  if (usuarioRol.value === 'servicios_escolares') {
    return carrerasData.value;
  }
  // Para jefe de carrera, solo su carrera
  return carrerasData.value.filter(c => c.id === usuarioCarrera.value);
});

const gruposFiltrados = computed(() => {
  if (!carreraSeleccionada.value) return [];
  return gruposData.value.filter(g => g.carrera_id === parseInt(carreraSeleccionada.value));
});

// Ciclo de vida
onMounted(() => {
  verificarAutenticacion();
  cargarDatos();
});

const verificarAutenticacion = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    router.push('/login');
    return;
  }

  try {
    const userData = JSON.parse(user);
    usuarioEmail.value = userData.email;
    usuarioRol.value = userData.rol;
    usuarioCarrera.value = userData.carrera_id;

    // Si es jefe de carrera, preseleccionar su carrera
    if (userData.carrera_id) {
      carreraSeleccionada.value = userData.carrera_id.toString();
    }
  } catch (e) {
    router.push('/login');
  }
};

const cargarDatos = () => {
  examenesData.value = examService.obtenerExamenes();
  gruposData.value = examService.obtenerGrupos();
  materiasData.value = examService.obtenerMaterias();
  carrerasData.value = examService.obtenerCarreras();
};

const cargarGrupos = () => {
  // Actualizar vista cuando cambia la carrera
};

// Funciones de servicio
const obtenerNombreMateria = (materiaId: number) => {
  return examService.obtenerNombreMateria(materiaId);
};

const obtenerNombreTipoExamen = (tipoId: number) => {
  return examService.obtenerNombreTipoExamen(tipoId);
};

const formatearFecha = (fecha: string) => {
  return examService.formatearFecha(fecha);
};

// Funciones de lógica
const obtenerExamenesGrupo = (grupoId: number) => {
  return examenesData.value.filter(exam => exam.grupo_id === grupoId);
};

const cambiarEstado = (examenId: number, nuevoEstado: string) => {
  const examen = examenesData.value.find(e => e.id === examenId);
  if (examen) {
    examen.estado = nuevoEstado;
    // Guardar en localStorage
    localStorage.setItem('examenes', JSON.stringify(examenesData.value));
  }
};

const contarEstado = (grupoId: number, estado: string) => {
  const examenesGrupo = obtenerExamenesGrupo(grupoId);
  return examenesGrupo.filter(e => e.estado === estado).length;
};

const volverDashboard = () => {
  router.push('/dashboard');
};

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  router.push('/').then(() => {
    window.location.reload();
  });
};

const contactarServiciosEscolares = () => {
  alert('Contactando a Servicios Escolares...\n\nEmail: servicios@universidad.edu\nTeléfono: (555) 123-4567\nHorario: Lunes a Viernes 8:00 AM - 5:00 PM');
};
</script>


<style src="./ExamProgress.css" scoped></style>