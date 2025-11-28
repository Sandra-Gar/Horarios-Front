<template>
  <div class="admin-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo-container">
        <div class="logo-icon">◊</div>
      </div>
      <nav class="sidebar-nav">
        <div :class="['nav-item', { active: currentView === 'examenes' }]" @click="currentView = 'examenes'" title="Exámenes">
          <i class="pi pi-calendar"></i>
        </div>
        <div :class="['nav-item', { active: currentView === 'grupos' }]" @click="currentView = 'grupos'" title="Grupos">
          <i class="pi pi-book"></i>
        </div>
        <div :class="['nav-item', { active: currentView === 'materias' }]" @click="currentView = 'materias'" title="Materias">
          <i class="pi pi-chart-bar"></i>
        </div>
        <div :class="['nav-item', { active: currentView === 'auditoria' }]" @click="currentView = 'auditoria'" title="Auditoría">
          <i class="pi pi-history"></i>
        </div>
      </nav>
      <div class="sidebar-bottom">
        <div class="nav-item logout" @click="handleLogout" title="Cerrar Sesión">
          <i class="pi pi-sign-out"></i>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h2>{{ tipoRol }}</h2>
          <h1>Gestión de Exámenes</h1>
        </div>
        <div class="header-right">
          <div class="user-info">
            <span class="user-email">{{ usuarioEmail }}</span>
            <span class="user-role">{{ usuarioRol === 'servicios_escolares' ? 'Servicios Escolares' : 'Jefe de Carrera' }}</span>
          </div>
          <button class="help-btn" @click="contactarServiciosEscolares" title="Ayuda">
            <i class="pi pi-question-circle"></i>
          </button>
        </div>
      </div>

      <!-- Filtros para Jefe de Carrera -->
      <div class="filters-section" v-if="usuarioRol === 'jefe_carrera'">
        <div class="filter-group">
          <label>Carrera:</label>
          <select v-model.number="carreraSeleccionada" class="filter-select">
            <option v-for="carrera in carrerasData" :key="carrera.id" :value="carrera.id">
              {{ carrera.nombre }}
            </option>
          </select>
        </div>
      </div>

      <!-- Vista Exámenes -->
      <div v-if="currentView === 'examenes'" class="view-section">
        <div class="section-header">
          <h3>{{ usuarioRol === 'servicios_escolares' ? 'Todos los Exámenes' : 'Exámenes de mi Carrera' }}</h3>
          <button class="btn-primary" @click="abrirNuevoExamen">
            <i class="pi pi-plus"></i> Nuevo Examen
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estudiantes</th>
                <th>Calif.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="examen in examenesVisibles" :key="examen.id">
                <td>#{{ examen.id }}</td>
                <td>{{ obtenerNombreMateria(examen.materia_id) }}</td>
                <td>{{ obtenerNombreGrupo(examen.grupo_id) }}</td>
                <td><span class="badge">{{ obtenerNombreTipoExamen(examen.tipo_examen_id) }}</span></td>
                <td>{{ formatearFecha(examen.fecha) }}</td>
                <td>{{ examen.hora_inicio }}</td>
                <td>{{ examen.numero_alumnos }}</td>
                <td>{{ examen.calificaciones }}</td>
                <td><span :class="['status', examen.estado]">{{ examen.estado }}</span></td>
                <td class="actions">
                  <button class="btn-icon edit" @click="editarExamen(examen)" title="Editar"><i class="pi pi-pencil"></i></button>
                  <button class="btn-icon delete" @click="eliminarExamen(examen.id)" title="Eliminar"><i class="pi pi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vista Grupos -->
      <div v-if="currentView === 'grupos'" class="view-section">
        <div class="section-header">
          <h3>Grupos Académicos</h3>
        </div>
        <div class="cards-grid">
          <div v-for="grupo in gruposVisibles" :key="grupo.id" class="card-item">
            <div class="card-header">
              <h4>{{ grupo.nombre }}</h4>
            </div>
            <div class="card-body">
              <p><strong>Carrera:</strong> {{ obtenerNombreCarrera(grupo.carrera_id) }}</p>
              <p><strong>Materia:</strong> {{ obtenerNombreMateria(grupo.materia_id) }}</p>
              <p><strong>Capacidad:</strong> {{ grupo.capacidad_alumnos }} estudiantes</p>
              <p><strong>Aula:</strong> {{ grupo.aula_id }}</p>
              <p><strong>Semestre:</strong> {{ grupo.semestre }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Materias -->
      <div v-if="currentView === 'materias'" class="view-section">
        <div class="section-header">
          <h3>Materias Disponibles</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Semestre</th>
                <th>En Inglés</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in materiasVisibles" :key="materia.id">
                <td><code>{{ materia.clave }}</code></td>
                <td>{{ materia.nombre }}</td>
                <td>{{ obtenerNombreCarrera(materia.carrera_id) }}</td>
                <td>{{ materia.semestre }}</td>
                <td>{{ materia.es_inglesa ? 'Sí' : 'No' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vista Auditoría -->
      <div v-if="currentView === 'auditoria'" class="view-section">
        <div class="section-header">
          <h3>Registro de Auditoría</h3>
        </div>
        <div class="info-box">
          <p><strong>Sistema de auditoría</strong></p>
          <p>Se registra cada cambio realizado en exámenes, grupos y materias</p>
          <p>Usuarios autorizados: Servicios Escolares y Jefes de Carreras</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as examService from '../services/examService';

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

// Propiedades computadas
const tipoRol = computed(() => {
  return usuarioRol.value === 'servicios_escolares' ? 'Servicios Escolares' : 'Jefe de Carrera';
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

const materiasVisibles = computed(() => {
  if (usuarioRol.value === 'servicios_escolares') {
    return materiasData.value;
  }
  return materiasData.value.filter(m => m.carrera_id === carreraSeleccionada.value);
});

// Inicialización
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
const obtenerNombreMateria = (materiaId: number) => examService.obtenerNombreMateria(materiaId);
const obtenerNombreGrupo = (grupoId: number) => examService.obtenerNombreGrupo(grupoId);
const obtenerNombreTipoExamen = (tipoId: number) => examService.obtenerNombreTipoExamen(tipoId);
const obtenerNombreCarrera = (carreraId: number) => examService.obtenerNombreCarrera(carreraId);
const formatearFecha = (fecha: string) => examService.formatearFecha(fecha);

// Funciones de acción
const abrirNuevoExamen = () => alert('Formulario para crear nuevo examen (a implementar)');
const editarExamen = (examen: any) => alert(`Editando examen: ${examen.id}`);

const eliminarExamen = (id: number) => {
  if (confirm('¿Estás seguro de eliminar este examen?')) {
    examService.eliminarExamen(id);
    examenesData.value = examService.obtenerExamenes();
  }
};

const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  router.push('/login');
};

const contactarServiciosEscolares = () => {
  alert('Contactando a Servicios Escolares...\n\nEmail: servicios@universidad.edu\nTeléfono: (555) 123-4567\nHorario: Lunes a Viernes 8:00 AM - 5:00 PM');
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-container {
  display: flex;
  background: linear-gradient(135deg, #93b5d1 0%, #c5b8e3 50%, #d4a5d9 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  width: 90px;
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.logo-container {
  margin-bottom: 40px;
  padding: 12px;
  background: linear-gradient(135deg, #b19cd9 0%, #d4a5d9 100%);
  border-radius: 12px;
}

.logo-icon {
  font-size: 28px;
  color: white;
  font-weight: bold;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.nav-item {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 12px;
  color: #8b5fb5;
  font-size: 20px;
  transition: all 0.3s ease;
}

.nav-item:hover, .nav-item.active {
  background: linear-gradient(135deg, #b19cd9 0%, #d4a5d9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(177, 156, 217, 0.3);
}

.sidebar-bottom {
  margin-top: auto;
}

.nav-item.logout:hover {
  background: #fde8e4;
  color: #d9756f;
}

.content {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-left h2 {
  color: #8b5fb5;
  font-size: 14px;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.header-left h1 {
  color: #2d1b4e;
  font-size: 28px;
  margin: 0;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  text-align: right;
}

.user-email {
  display: block;
  color: #2d1b4e;
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  display: block;
  color: #8b5fb5;
  font-size: 12px;
  margin-top: 4px;
}

.help-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #b19cd9 0%, #d4a5d9 100%);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.help-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(177, 156, 217, 0.3);
}

.filters-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  color: #2d1b4e;
  font-weight: 600;
  font-size: 14px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e8d5f2;
  border-radius: 6px;
  background: white;
  color: #2d1b4e;
  cursor: pointer;
  font-size: 13px;
}

.view-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  color: #2d1b4e;
  font-size: 20px;
  margin: 0;
  font-weight: 700;
}

.btn-primary {
  background: linear-gradient(135deg, #b19cd9 0%, #d4a5d9 100%);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(177, 156, 217, 0.3);
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  background: #f0e6f6;
}

.data-table th {
  color: #2d1b4e;
  padding: 12px;
  text-align: left;
  font-weight: 700;
  border-bottom: 2px solid #e8d5f2;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0e6f6;
  color: #3d2f5c;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.badge {
  background: #b19cd9;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
}

.status.programado {
  background: #d4b8e8;
  color: #2d1b4e;
}

.status.completado {
  background: #a8d4a8;
  color: #2d1b4e;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-icon.edit {
  background: #b8d9e8;
  color: #2d5ba8;
}

.btn-icon.delete {
  background: #e8b4d9;
  color: #b21e4f;
}

.btn-icon:hover {
  transform: scale(1.05);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card-item {
  background: #f8f6fa;
  border: 1px solid #e8d5f2;
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #b19cd9 0%, #d4a5d9 100%);
  padding: 15px;
}

.card-header h4 {
  color: white;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.card-body {
  padding: 15px;
  font-size: 13px;
}

.card-body p {
  margin: 8px 0;
  color: #3d2f5c;
}

.info-box {
  background: #f0e6f6;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #b19cd9;
}

.info-box p {
  margin: 8px 0;
  color: #2d1b4e;
}

.info-box p:first-child {
  font-weight: 700;
  font-size: 15px;
}

code {
  background: #f0e6f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #6b3d95;
}

@media (max-width: 1200px) {
  .content {
    padding: 20px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    padding: 15px;
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 10px;
  }

  .header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .data-table {
    font-size: 11px;
  }

  .data-table th, .data-table td {
    padding: 8px;
  }
}
</style>
