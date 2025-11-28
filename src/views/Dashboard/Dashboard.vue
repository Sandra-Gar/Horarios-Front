<style scoped src="./Dashboard.css"></style>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">◊</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div 
          class="nav-item" 
          :class="{ active: currentView === 'examenes' }" 
          @click="currentView = 'examenes'"
          title="Exámenes"
        >
          <i class="pi pi-home"></i>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: currentView === 'calendario' }" 
          @click="currentView = 'calendario'"
          title="Calendario"
        >
          <i class="pi pi-calendar"></i>
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: currentView === 'grupos' }" 
          @click="currentView = 'grupos'"
          title="Grupos"
        >
          <i class="pi pi-users"></i>
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: currentView === 'materias' }" 
          @click="currentView = 'materias'"
          title="Materias"
        >
          <i class="pi pi-book"></i>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: currentView === 'progreso' }"
          @click="currentView = 'progreso'"
          title="Progreso de Exámenes"
          >
          <i class="pi pi-chart-line"></i>
          </div>
          <!--div 
          class="nav-item" 
          @click="irAProgramarExamenes"
          title="Programar Exámenes"
        
          <i class="pi pi-calendar-plus"></i>
        </div>
        -->
        <div 
          class="nav-item" 
          :class="{ active: currentView === 'auditoria' }" 
          @click="currentView = 'auditoria'"
          title="Auditoría"
        >
          <i class="pi pi-history"></i>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout" @click="handleLogout" title="Cerrar Sesión">
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h2>Hola, {{ usuarioEmail.split('@')[0] }}</h2>
          <p class="header-subtitle">{{ tipoRol }}</p>
        </div>
        <div class="header-right">
          <button class="notification-btn" title="Notificaciones">
            <i class="pi pi-bell"></i>
          </button>
          <button class="help-btn" @click="contactarServiciosEscolares" title="Ayuda">
            <i class="pi pi-question-circle"></i>
          </button>
        </div>
      </div>


      <!-- Vista Exámenes -->
      <!-- Vista Exámenes -->
      <div v-show="currentView === 'examenes'" class="view-container">
        <div class="exams-layout">
          <!-- Panel Lateral Izquierdo: Calendario + Tasks -->
          <div class="sidebar-panel">
            <!-- Calendario Mini -->
            <div class="mini-calendar-card">
              <h4>{{ nombreMes(mesActual) }} {{ annoActual }}</h4>
              <div class="mini-calendar">
                <div class="mini-calendar-nav">
                  <button @click="mesAnterior" class="mini-btn">&lt;</button>
                  <button @click="mesSiguiente" class="mini-btn">&gt;</button>
                </div>
                <div class="mini-calendar-grid">
                  <div class="mini-day-label">Dom</div>
                  <div class="mini-day-label">Lun</div>
                  <div class="mini-day-label">Mar</div>
                  <div class="mini-day-label">Mié</div>
                  <div class="mini-day-label">Jue</div>
                  <div class="mini-day-label">Vie</div>
                  <div class="mini-day-label">Sab</div>
                  <div 
                    v-for="dia in diasDelMes" 
                    :key="dia" 
                    class="mini-day"
                    :class="{ 
                      'has-exam-mini': tienExamen(dia), 
                      'hoy-mini': esHoy(dia),
                      'exam-week': esSemanaExamenes(dia)
                    }"
                    @click="seleccionarDia(dia)"
                  >
                    {{ dia }}
                  </div>
                </div>
              </div>
              
              <!-- Leyenda -->
              <div class="calendar-legend">
                <div class="legend-item">
                  <span class="legend-dot exam-week-dot"></span>
                  <span>Semana de Exámenes</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot exam-dot"></span>
                  <span>Examen Programado</span>
                </div>
              </div>
            </div>

            <!-- Lista de Exámenes como Tasks -->
            <div class="tasks-card">
              <h4>Exámenes Programados</h4>
              <div v-if="examenesVisibles.length > 0" class="tasks-list">
                <div 
                  v-for="examen in examenesVisibles.slice(0, 5)" 
                  :key="examen.id" 
                  class="task-item"
                >
                  <div class="task-check">
                    <input type="checkbox" :id="'exam-' + examen.id" />
                  </div>
                  <div class="task-content">
                    <p class="task-title">{{ obtenerNombreMateria(examen.materia_id) }}</p>
                    <p class="task-date">{{ formatearFecha(examen.fecha) }}</p>
                    <p class="task-time">{{ examen.hora_inicio }}</p>
                  </div>
                  <span class="task-badge">{{ obtenerNombreTipoExamen(examen.tipo_examen_id) }}</span>
                </div>
              </div>
              <div v-else class="no-tasks">
                <p>No hay exámenes</p>
              </div>
              <button v-if="examenesVisibles.length > 5" class="see-more-btn" @click="verTodosExamenes">
                Ver más ({{ examenesVisibles.length - 5 }})
              </button>
            </div>
          </div>

          <!-- Panel Principal: Resumen y Estadísticas -->
          <div class="main-panel">
            <!-- Banner de Semana de Exámenes -->
            <div v-if="estamosEnSemanaExamenes" class="exam-week-banner">
              <div class="banner-icon">
                <i class="pi pi-calendar-times"></i>
              </div>
              <div class="banner-content">
                <h3>Semana de Exámenes en Curso</h3>
                <p>Segunda Evaluación Parcial • 01 - 08 de Diciembre 2025</p>
                <div class="banner-progress">
                  <div class="progress-info">
                    <span>Día {{ diaActualSemanaExamenes }} de 6</span>
                    <span>{{ examenesCompletadosHoy }} / {{ examenesProgramadosHoy }} exámenes completados hoy</span>
                  </div>
                  <div class="progress-bar-banner">
                    <div class="progress-fill-banner" :style="{ width: progresoSemana + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cards de Estadísticas -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <i class="pi pi-calendar"></i>
                </div>
                <div class="stat-content">
                  <h4>{{ totalExamenesCarrera }}</h4>
                  <p>Exámenes Programados</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                  <i class="pi pi-clock"></i>
                </div>
                <div class="stat-content">
                  <h4>{{ examenesPendientes }}</h4>
                  <p>Pendientes</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                  <i class="pi pi-users"></i>
                </div>
                <div class="stat-content">
                  <h4>{{ gruposActivos }}</h4>
                  <p>Grupos Activos</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                  <i class="pi pi-check-circle"></i>
                </div>
                <div class="stat-content">
                  <h4>{{ examenesCompletados }}</h4>
                  <p>Completados</p>
                </div>
              </div>
            </div>

            <!-- Próximos Exámenes -->
            <div class="upcoming-exams-card">
              <div class="card-header-custom">
                <h3>Próximos Exámenes</h3>
                <button class="btn-view-all" @click="currentView = 'calendario'">
                  Ver todos
                  <i class="pi pi-arrow-right"></i>
                </button>
              </div>
              
              <div v-if="proximosExamenes.length > 0" class="upcoming-list">
                <div 
                  v-for="examen in proximosExamenes" 
                  :key="examen.id"
                  class="upcoming-item"
                >
                  <div class="upcoming-date">
                    <span class="date-day">{{ obtenerDia(examen.fecha) }}</span>
                    <span class="date-month">{{ obtenerMesCorto(examen.fecha) }}</span>
                  </div>
                  <div class="upcoming-details">
                    <h4>{{ obtenerNombreMateria(examen.materia_id) }}</h4>
                    <div class="upcoming-meta">
                      <span><i class="pi pi-clock"></i> {{ examen.hora_inicio }}</span>
                      <span><i class="pi pi-map-marker"></i> {{ examen.aula_id }}</span>
                      <span><i class="pi pi-users"></i> {{ obtenerNombreGrupo(examen.grupo_id) }}</span>
                    </div>
                    <span class="upcoming-type">{{ obtenerNombreTipoExamen(examen.tipo_examen_id) }}</span>
                  </div>
                  <div class="upcoming-actions">
                    <button class="action-icon" @click="verDetallesExamen(examen)" title="Ver detalles">
                      <i class="pi pi-eye"></i>
                    </button>
                    <button class="action-icon" @click="editarExamen(examen)" title="Editar">
                      <i class="pi pi-pencil"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="empty-upcoming">
                <i class="pi pi-calendar-plus"></i>
                <p>No hay exámenes programados próximamente</p>
                <button class="btn-add-exam" @click="abrirNuevoExamen">
                  <i class="pi pi-plus"></i>
                  Programar Examen
                </button>
              </div>
            </div>

            <!-- Distribución por Tipo de Examen -->
            <div class="distribution-card">
              <h3>Distribución de Exámenes</h3>
              <div class="distribution-chart">
                <div 
                  v-for="tipo in distribucionExamenes" 
                  :key="tipo.id"
                  class="distribution-bar"
                >
                  <div class="bar-label">
                    <span>{{ tipo.nombre }}</span>
                    <span class="bar-count">{{ tipo.cantidad }}</span>
                  </div>
                  <div class="bar-container">
                    <div 
                      class="bar-fill" 
                      :style="{ 
                        width: (tipo.cantidad / totalExamenesCarrera * 100) + '%',
                        background: tipo.color 
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Calendario -->
      <div v-show="currentView === 'calendario'" class="view-container">
        <div class="section-header">
          <div class="section-title">
            <h3>Calendario de Exámenes</h3>
          </div>
          <button class="btn-new" @click="abrirNuevoExamen">
            <i class="pi pi-plus"></i> Nuevo Examen
          </button>
        </div>
        <!-- Calendario Grande -->
        <div class="calendar-large-card">
          <h4>Calendario</h4>
          <div class="calendar-large">
            <div class="calendar-month-large">
              <div class="calendar-header-large">
                <button @click="mesAnterior" class="nav-btn">&lt;</button>
                <span>{{ nombreMes(mesActual) }} {{ annoActual }}</span>
                <button @click="mesSiguiente" class="nav-btn">&gt;</button>
              </div>
              <div class="calendar-grid-large">
                <div class="day-label-large">Dom</div>
                <div class="day-label-large">Lun</div>
                <div class="day-label-large">Mar</div>
                <div class="day-label-large">Mié</div>
                <div class="day-label-large">Jue</div>
                <div class="day-label-large">Vie</div>
                <div class="day-label-large">Sab</div>
                <div 
                  v-for="dia in diasDelMes" 
                  :key="dia" 
                  class="day-large"
                  :class="{ 'has-exam-large': tienExamen(dia), 'hoy-large': esHoy(dia) }"
                  @click="seleccionarDia(dia)"
                >
                  {{ dia }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Grupos -->
      <div v-show="currentView === 'grupos'" class="view-container">
        <div class="section-header">
          <div class="section-title">
            <h3>Grupos Académicos</h3>
            <span class="count-badge">{{ gruposVisibles.length }}</span>
          </div>
        </div>

        <div v-if="gruposVisibles.length > 0" class="cards-grid">
          <div v-for="grupo in gruposVisibles" :key="grupo.id" class="card">
            <div class="card-header">
              <h4>{{ grupo.nombre }}</h4>
              <span class="semester-badge">{{ grupo.semestre }}º Semestre</span>
            </div>
            <div class="card-body">
              <div class="card-item">
                <span class="label">Carrera:</span>
                <span class="value">{{ obtenerNombreCarrera(grupo.carrera_id) }}</span>
              </div>
              <div class="card-item">
                <span class="label">Materia:</span>
                <span class="value">{{ obtenerNombreMateria(grupo.materia_id) }}</span>
              </div>
              <div class="card-item">
                <span class="label">Capacidad:</span>
                <span class="value">{{ grupo.capacidad_alumnos }} estudiantes</span>
              </div>
              <div class="card-item">
                <span class="label">Aula:</span>
                <span class="value">{{ grupo.aula_id }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>No hay grupos disponibles</p>
        </div>
      </div>

      <!-- Vista Materias -->
      <div v-show="currentView === 'materias'" class="view-container">
        <div class="section-header">
          <div class="section-title">
            <h3>Materias</h3>
            <span class="count-badge">{{ materiasData.length }}</span>
          </div>
        </div>

        <div v-if="materiasData.length > 0" class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Semestre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in materiasData" :key="materia.id" class="table-row">
                <td><span class="code-badge">{{ materia.clave }}</span></td>
                <td>{{ materia.nombre }}</td>
                <td>{{ obtenerNombreCarrera(materia.carrera_id) }}</td>
                <td>{{ materia.semestre }}º</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>No hay materias disponibles</p>
        </div>
      </div>
      <!-- Vista de programacion de exaenes -->
       <!-- Vista Progreso de Exámenes -->
      <div v-show="currentView === 'progreso'" class="view-container">
        <ExamProgress />
      </div>

      <!-- Vista Auditoría -->
      <div v-show="currentView === 'auditoria'" class="view-container">
        <div class="section-header">
          <div class="section-title">
            <h3>Registro de Auditoría</h3>
          </div>
        </div>
        <div class="audit-info">
          <div class="info-card">
            <i class="pi pi-info-circle"></i>
            <div class="info-content">
              <h4>Sistema de Auditoría</h4>
              <p>Todos los cambios realizados en exámenes, grupos y materias son registrados automáticamente para garantizar la integridad y seguridad del sistema.</p>
              <ul class="info-list">
                <li>Registro de creación de exámenes</li>
                <li>Seguimiento de modificaciones</li>
                <li>Historial de eliminaciones</li>
                <li>Trazabilidad de usuarios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as examService from '../../services/examService';
import ExamProgress from '../ExamProgress/ExamProgress.vue';


const router = useRouter();

// Estado del usuario
const usuarioEmail = ref('');
const usuarioRol = ref<'servicios_escolares' | 'jefe_carrera'>('servicios_escolares');
const usuarioCarrera = ref<number | null>(null);
const currentView = ref('examenes');

// Datos
const examenesData = ref<any[]>([]);
const gruposData = ref<any[]>([]);
const materiasData = ref<any[]>([]);
const carrerasData = ref<any[]>([]);
const carreraSeleccionada = ref<number | null>(null);

// Calendario
const mesActual = ref(new Date().getMonth());
const annoActual = ref(new Date().getFullYear());
const diSeleccionado = ref<number | null>(null);

// Propiedades computadas
const tipoRol = computed(() => {
  return usuarioRol.value === 'servicios_escolares' ? 'Servicios Escolares' : 'Jefe de Carrera';
});

const carrerasDisponibles = computed(() => {
  return carrerasData.value;
});

const examenesVisibles = computed(() => {
  if (usuarioRol.value === 'servicios_escolares') {
    return examenesData.value;
  }
  return examenesData.value.filter(exam => {
    const grupo = gruposData.value.find(g => g.id === exam.grupo_id);
    return grupo?.carrera_id === carreraSeleccionada.value;
  });
});

const gruposVisibles = computed(() => {
  if (usuarioRol.value === 'servicios_escolares') {
    return gruposData.value;
  }
  return gruposData.value.filter(g => g.carrera_id === carreraSeleccionada.value);
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

    if (userData.carrera_id) {
      carreraSeleccionada.value = userData.carrera_id;
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

// Funciones de servicio
const obtenerNombreMateria = (materiaId: number) => {
  return examService.obtenerNombreMateria(materiaId);
};

const obtenerNombreGrupo = (grupoId: number) => {
  return examService.obtenerNombreGrupo(grupoId);
};

const obtenerNombreTipoExamen = (tipoId: number) => {
  return examService.obtenerNombreTipoExamen(tipoId);
};

const obtenerNombreCarrera = (carreraId: number) => {
  return examService.obtenerNombreCarrera(carreraId);
};

const formatearFecha = (fecha: string) => {
  return examService.formatearFecha(fecha);
};

// Funciones de acción
const abrirNuevoExamen = () => {
  router.push('/new-exam');
};

const editarExamen = (examen: any) => {
  alert(`Editando examen: ${examen.id}`);
};

const eliminarExamen = (id: number) => {
  if (confirm('¿Estás seguro de eliminar este examen?')) {
    examService.eliminarExamen(id);
    examenesData.value = examService.obtenerExamenes();
    alert('Examen eliminado correctamente');
  }
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

// ===== FUNCIONES DE CALENDARIO =====
const diasDelMes = computed(() => {
  const primerDia = new Date(annoActual.value, mesActual.value, 1);
  const ultimoDia = new Date(annoActual.value, mesActual.value + 1, 0);
  const diaInicio = primerDia.getDay();
  const diasTotal = ultimoDia.getDate();
  
  let dias: (number | null)[] = [];
  
  // Agregar espacios en blanco para alinear el primer día
  for (let i = 0; i < diaInicio; i++) {
    dias.push(null);
  }
  
  // Agregar los días del mes
  for (let i = 1; i <= diasTotal; i++) {
    dias.push(i);
  }
  
  return dias;
});

const nombreMes = (mes: number) => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
};

const mesAnterior = () => {
  if (mesActual.value === 0) {
    mesActual.value = 11;
    annoActual.value--;
  } else {
    mesActual.value--;
  }
};

const mesSiguiente = () => {
  if (mesActual.value === 11) {
    mesActual.value = 0;
    annoActual.value++;
  } else {
    mesActual.value++;
  }
};

const tienExamen = (dia: number | null) => {
  if (!dia) return false;
  const fecha = `${annoActual.value}-${String(mesActual.value + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  return examenesVisibles.value.some(exam => exam.fecha === fecha);
};

const esHoy = (dia: number | null) => {
  if (!dia) return false;
  const hoy = new Date();
  return dia === hoy.getDate() && 
         mesActual.value === hoy.getMonth() && 
         annoActual.value === hoy.getFullYear();
};

const seleccionarDia = (dia: number | null) => {
  if (dia) {
    diSeleccionado.value = dia;
  }
};

const contarExamenesPorMateria = (materiaId: number) => {
  return examenesVisibles.value.filter(exam => exam.materia_id === materiaId).length;
};

const irAProgramarExamenes = () => {
  router.push('/schedule-exams');
};

// Agregar al script setup en Dashboard.vue

// Computed adicionales
const totalExamenesCarrera = computed(() => examenesVisibles.value.length);

const examenesPendientes = computed(() => {
  return examenesVisibles.value.filter(e => e.estado === 'pendiente').length;
});

const examenesCompletados = computed(() => {
  return examenesVisibles.value.filter(e => e.estado === 'aprobado').length;
});

const gruposActivos = computed(() => gruposVisibles.value.length);

const proximosExamenes = computed(() => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return examenesVisibles.value
    .filter(exam => {
      const fechaExamen = new Date(exam.fecha);
      return fechaExamen >= hoy;
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);
});

const distribucionExamenes = computed(() => {
  const distribucion = tiposExamenData.value.map(tipo => {
    const cantidad = examenesVisibles.value.filter(
      e => e.tipo_examen_id === tipo.id
    ).length;
    
    return {
      id: tipo.id,
      nombre: tipo.nombre,
      cantidad,
      color: obtenerColorTipo(tipo.id)
    };
  }).filter(d => d.cantidad > 0);
  
  return distribucion;
});

const estamosEnSemanaExamenes = computed(() => {
  const hoy = new Date();
  const inicioSemana = new Date('2025-12-01');
  const finSemana = new Date('2025-12-08');
  
  return hoy >= inicioSemana && hoy <= finSemana;
});

const diaActualSemanaExamenes = computed(() => {
  if (!estamosEnSemanaExamenes.value) return 0;
  
  const hoy = new Date();
  const inicioSemana = new Date('2025-12-01');
  const diasTranscurridos = Math.floor((hoy.getTime() - inicioSemana.getTime()) / (1000 * 60 * 60 * 24));
  
  // Contar solo días hábiles
  let diasHabiles = 0;
  for (let i = 0; i <= diasTranscurridos; i++) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(fecha.getDate() + i);
    const dia = fecha.getDay();
    if (dia !== 0 && dia !== 6) diasHabiles++;
  }
  
  return diasHabiles;
});

const progresoSemana = computed(() => {
  if (!estamosEnSemanaExamenes.value) return 0;
  return (diaActualSemanaExamenes.value / 6) * 100;
});

const examenesProgramadosHoy = computed(() => {
  const hoy = new Date().toISOString().split('T')[0];
  return examenesVisibles.value.filter(e => e.fecha === hoy).length;
});

const examenesCompletadosHoy = computed(() => {
  const hoy = new Date().toISOString().split('T')[0];
  return examenesVisibles.value.filter(
    e => e.fecha === hoy && e.estado === 'aprobado'
  ).length;
});

// Datos de tipos de examen
const tiposExamenData = ref([
  { id: 1, nombre: 'Parcial 1' },
  { id: 2, nombre: 'Parcial 2' },
  { id: 3, nombre: 'Parcial 3' },
  { id: 4, nombre: 'Ordinario' },
  { id: 5, nombre: 'Extraordinario' }
]);

// Funciones auxiliares
const esSemanaExamenes = (dia: number | null) => {
  if (!dia) return false;
  
  const fecha = new Date(annoActual.value, mesActual.value, dia);
  const inicioSemana = new Date('2025-12-01');
  const finSemana = new Date('2025-12-08');
  
  // Excluir fines de semana
  const diaSemana = fecha.getDay();
  if (diaSemana === 0 || diaSemana === 6) return false;
  
  return fecha >= inicioSemana && fecha <= finSemana;
};

const obtenerDia = (fecha: string) => {
  const [year, month, day] = fecha.split('-');
  return day;
};

const obtenerMesCorto = (fecha: string) => {
  const [year, month] = fecha.split('-');
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return meses[parseInt(month) - 1];
};

const obtenerColorTipo = (tipoId: number) => {
  const colores: any = {
    1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  };
  return colores[tipoId] || 'linear-gradient(135deg, #b19cd9 0%, #d4a5d9 100%)';
};

const verTodosExamenes = () => {
  currentView.value = 'calendario';
};

const verDetallesExamen = (examen: any) => {
  alert(`Detalles del examen:\n\nMateria: ${obtenerNombreMateria(examen.materia_id)}\nFecha: ${formatearFecha(examen.fecha)}\nHora: ${examen.hora_inicio}\nAula: ${examen.aula_id}`);
};
</script>
<style src="./Dashboard.css" scoped></style>
