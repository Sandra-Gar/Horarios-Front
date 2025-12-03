<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <button class="back-btn" @click="cancelar">
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h2>Crear Nuevo Examen</h2>
          <p>Rellena todos los detalles para programar un nuevo examen</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="form-body">
        <!-- Progress Steps -->
        <div class="progress-steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <span>Información Básica</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <span>Profesor Sinodal</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <div class="step-number">3</div>
            <span>Confirmar</span>
          </div>
        </div>

        <!-- Step 1: Información Básica -->
        <div v-show="currentStep === 1" class="step-content">
          <h3>Información del Examen</h3>
          <div class="form-grid">
            
            <!-- Tipo de Examen -->
            <div class="form-group">
              <label for="tipoExamen">Tipo de Examen *</label>
              <select id="tipoExamen" v-model="form.tipo_examen_id" required @change="manejarCambioTipoExamen">
                <option disabled value="">Selecciona el tipo</option>
                <option v-for="tipo in tiposExamen" :key="tipo.id" :value="tipo.id">
                  {{ tipo.nombre }}
                </option>
              </select>
            </div>
            <!-- Grupo -->
            <div class="form-group">
              <label for="grupo">Grupo *</label>
              <select id="grupo" v-model="form.grupo_id" required>
                <option disabled value="">Selecciona un grupo</option>
                <option v-for="grupo in gruposFiltrados" :key="grupo.id" :value="grupo.id">
                  {{ grupo.nombre }} - {{ grupo.semestre }}º Semestre
                </option>
              </select>
              <p v-if="gruposFiltrados.length === 0" class="error-text">No hay grupos asignados a tu carrera.</p>
            </div>
            <!-- Materia -->
            <div class="form-group full-width">
              <label for="materia">Materia *</label>
              <select id="materia" v-model="form.materia_id" required>
                <option disabled value="">Selecciona una materia</option>
                <option v-for="materia in materiasFiltradas" :key="materia.id" :value="materia.id">
                  {{ materia.nombre }} ({{ materia.clave }})
                </option>
              </select>
              <p v-if="materiasFiltradas.length === 0" class="error-text">No hay materias asignadas a tu carrera.</p>
            </div>
            <!-- Fecha -->
            <div class="form-group">
              <label for="fecha">Fecha *</label>
              <input 
                type="date" 
                id="fecha" 
                v-model="form.fecha" 
                required 
                :min="fechaMinima"
                :max="fechaMaxima"
                @change="validarFecha"
              />
              <span v-if="errorFecha" class="error-text">{{ errorFecha }}</span>
              <span v-if="esParcial && form.fecha" class="info-text">
                <i class="pi pi-info-circle"></i>
                Los parciales deben programarse del 01 al 08 de diciembre (días hábiles)
              </span>
            </div>

            <!-- Hora de Inicio (automática para parciales) -->
            <div class="form-group">
              <label for="horaInicio">Hora de Inicio *</label>
              <input 
                type="time" 
                id="horaInicio" 
                v-model="form.hora_inicio" 
                required 
                :readonly="esParcial && horarioAutomatico"
              />
              <span v-if="esParcial && horarioAutomatico" class="info-text">
                <i class="pi pi-check-circle"></i>
                Horario de clase asignado automáticamente
              </span>
            </div>

            <!-- Aula -->
            <div class="form-group">
              <label for="aula">Aula *</label>
              <select id="aula" v-model="form.aula_id" required>
                <option disabled value="">Selecciona un aula</option>
                <option v-for="aula in aulas" :key="aula.id" :value="aula.id">
                  {{ aula.nombre }} (Capacidad: {{ aula.capacidad }})
                </option>
              </select>
            </div>

            <!-- Profesor Titular -->
            <div class="form-group full-width">
              <label for="profesorTitular">Profesor Titular *</label>
              <select id="profesorTitular" v-model="form.profesor_titular_id" required>
                <option disabled value="">Selecciona el profesor titular</option>
                <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
                  {{ profesor.titulo }} {{ profesor.nombre }}
                </option>
              </select>
            </div>

            <!-- Número de Alumnos -->
            <div class="form-group">
              <label for="numAlumnos">Número de Alumnos *</label>
              <input 
                type="number" 
                id="numAlumnos" 
                v-model="form.numero_alumnos" 
                placeholder="Ej: 30"
                min="1"
                required 
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Profesor Sinodal -->
        <div v-show="currentStep === 2" class="step-content">
          <h3>Asignar Profesor Sinodal</h3>
          <div class="sinodal-info">
            <i class="pi pi-info-circle"></i>
            <p>El profesor sinodal debe ser diferente al profesor titular y estará presente durante la aplicación del examen.</p>
          </div>

          <div class="form-group">
            <label for="profesorSinodal">Profesor Sinodal *</label>
            <select id="profesorSinodal" v-model="form.profesor_sinodal_id" required>
              <option disabled value="">Selecciona el profesor sinodal</option>
              <option 
                v-for="profesor in profesoresSinodales" 
                :key="profesor.id" 
                :value="profesor.id"
              >
                {{ profesor.titulo }} {{ profesor.nombre }}
              </option>
            </select>
          </div>

          <div v-if="form.profesor_sinodal_id" class="sinodal-preview">
            <h4>Profesor Sinodal Seleccionado</h4>
            <div class="profesor-card">
              <i class="pi pi-user"></i>
              <div>
                <strong>{{ obtenerNombreProfesor(form.profesor_sinodal_id) }}</strong>
                <p>{{ obtenerEmailProfesor(form.profesor_sinodal_id) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Confirmación -->
        <div v-show="currentStep === 3" class="step-content">
          <h3>Confirmar Examen</h3>
          <div class="confirmation-card">
            <div class="confirmation-header">
              <i class="pi pi-check-circle"></i>
              <h4>Revisa los detalles del examen</h4>
            </div>

            <div class="confirmation-details">
              <div class="detail-row">
                <span class="label">Materia:</span>
                <span class="value">{{ obtenerNombreMateria(form.materia_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Grupo:</span>
                <span class="value">{{ obtenerNombreGrupo(form.grupo_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tipo:</span>
                <span class="value">{{ obtenerNombreTipoExamen(form.tipo_examen_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Fecha y Hora:</span>
                <span class="value">{{ formatearFechaCompleta(form.fecha) }} a las {{ form.hora_inicio }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Aula:</span>
                <span class="value">{{ obtenerNombreAula(form.aula_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Profesor Titular:</span>
                <span class="value">{{ obtenerNombreProfesor(form.profesor_titular_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Profesor Sinodal:</span>
                <span class="value">{{ obtenerNombreProfesor(form.profesor_sinodal_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Número de Alumnos:</span>
                <span class="value">{{ form.numero_alumnos }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="form-footer">
          <button 
            v-if="currentStep > 1" 
            type="button" 
            class="btn-secondary" 
            @click="anteriorPaso"
          >
            <i class="pi pi-arrow-left"></i>
            Anterior
          </button>
          <button 
            v-if="currentStep < 3" 
            type="button" 
            class="btn-primary" 
            @click="siguientePaso"
            :disabled="!validarPasoActual()"
          >
            Siguiente
            <i class="pi pi-arrow-right"></i>
          </button>
          <button 
            v-if="currentStep === 3" 
            type="submit" 
            class="btn-success"
          >
            <i class="pi pi-check"></i>
            Crear Examen
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de Éxito -->
    <div v-if="mostrarExito" class="modal-overlay" @click="cerrarModal">
      <div class="modal-success" @click.stop>
        <div class="success-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <h3>¡Examen Creado Exitosamente!</h3>
        <p>El examen ha sido programado correctamente.</p>
        <div class="exam-details-modal">
          <p><strong>Materia:</strong> {{ obtenerNombreMateria(form.materia_id) }}</p>
          <p><strong>Fecha:</strong> {{ formatearFechaCompleta(form.fecha) }}</p>
          <p><strong>Hora:</strong> {{ form.hora_inicio }}</p>
        </div>
        <button class="btn-primary" @click="irADashboard">
          Ir al Dashboard
        </button>
      </div>
    </div>
  </div>
  <Modal
  v-if="mostrarModal"
  :titulo="modalTitulo"
  :mensaje="modalMensaje"
  @confirmar="() => { accionModal(); mostrarModal = false; }"
  @cancelar="() => { mostrarModal = false; }"
/>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as examService from '../../services/examService';
import Modal from '../../components/Modal.vue';

const router = useRouter();

const currentStep = ref(1);
const mostrarExito = ref(false);
const errorFecha = ref('');
const mostrarModal = ref(false);
const modalTitulo = ref('');
const modalMensaje = ref('');
const accionModal = ref<() => void>(() => {});

const form = ref({
  materia_id: '',
  tipo_examen_id: '',
  fecha: '',
  hora_inicio: '',
  grupo_id: '',
  aula_id: '',
  profesor_titular_id: '',
  profesor_sinodal_id: '',
  numero_alumnos: '',
  calificaciones: 'pendiente',
  estado: 'pendiente'
});
const esParcial = ref(false);
const horarioAutomatico = ref(false);
const horariosMaterias = ref<any>({
  // Mock de horarios de clase por materia
  1: '17:00', // Diseño Estructurado de Algoritmos
  2: '13:00', // Administración
  3: '16:00', // Historia del Pensamiento Filosófico
  4: '11:00', // Lógica Matemática
  5: '09:00', // Cálculo I
  6: '13:00', // Estructuras de Datos
  7: '17:00', // Electrónica Digital
  8: '11:00', // Contabilidad y Finanzas
  9: '09:00', // Teoría de Autómatas
  10: '08:00', // Álgebra Lineal
});
const materias = ref<any[]>([]);
const tiposExamen = ref<any[]>([]);
const grupos = ref<any[]>([]);
const aulas = ref<any[]>([]);
const profesores = ref<any[]>([]);
const usuarioCarrera = ref<number | null>(null);

onMounted(() => {
  cargarDatos();
  verificarUsuario();
});

const verificarUsuario = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    usuarioCarrera.value = userData.carrera_id;
  }
};

const cargarDatos = () => {
  materias.value = examService.obtenerMaterias();
  tiposExamen.value = examService.obtenerTiposExamen();
  grupos.value = examService.obtenerGrupos();
  aulas.value = examService.obtenerAulas();
  profesores.value = examService.obtenerProfesores();
};

const fechaMaxima = computed(() => {
  if (esParcial.value) {
    return '2025-12-08'; // Último día de parciales
  }
  return '';
});
const manejarCambioTipoExamen = () => {
  const tipoSeleccionado = tiposExamen.value.find((t: any) => t.id == form.value.tipo_examen_id);
  if (tipoSeleccionado && tipoSeleccionado.nombre.toLowerCase().includes('parcial')) {
    esParcial.value = true;
  } else {
    esParcial.value = false;
  }

  // Ajustar hora automáticamente si está habilitado
  if (horarioAutomatico.value && form.value.materia_id) {
    const horaClase = horariosMaterias.value[form.value.materia_id];
    if (horaClase) {
      form.value.hora_inicio = horaClase;
    }
  }
};

const cargarHorarioMateria = () => {
  if (esParcial.value && form.value.materia_id) {
    const horario = horariosMaterias.value[form.value.materia_id];
    if (horario) {
      form.value.hora_inicio = horario;
      horarioAutomatico.value = true;
    }
  }
};

const cargarHorarioGrupo = () => {
  // Si hay materia seleccionada, actualizar horario
  if (form.value.materia_id) {
    cargarHorarioMateria();
  }
};

const validarFecha = () => {
  errorFecha.value = '';
  if (!form.value.fecha) return true;
  
  const fecha = new Date(form.value.fecha + 'T00:00:00');
  const dia = fecha.getDay();
  
  // Validar que no sea fin de semana
  if (dia === 0 || dia === 6) {
    errorFecha.value = 'No se pueden programar exámenes en fin de semana';
    form.value.fecha = '';
    return false;
  }
  
  // Validar período de parciales
  if (esParcial.value) {
    const fechaInicio = new Date('2025-12-01');
    const fechaFin = new Date('2025-12-08');
    
    if (fecha < fechaInicio || fecha > fechaFin) {
      errorFecha.value = 'Los parciales deben programarse entre el 01 y 08 de diciembre';
      form.value.fecha = '';
      return false;
    }
  }
  
  return true;
};
// Computed
const fechaMinima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const materiasFiltradas = computed(() => {
  if (!usuarioCarrera.value) return materias.value;
  return materias.value.filter((m: any) => m.carrera_id === usuarioCarrera.value);
});

const gruposFiltrados = computed(() => {
  if (!usuarioCarrera.value) return grupos.value;
  return grupos.value.filter((g: any) => g.carrera_id === usuarioCarrera.value);
});

const profesoresSinodales = computed(() => {
  if (!form.value.profesor_titular_id) return profesores.value;
  return profesores.value.filter((p: any) => p.id !== parseInt(form.value.profesor_titular_id));
});


const validarPasoActual = () => {
  if (currentStep.value === 1) {
    return form.value.materia_id &&
           form.value.grupo_id &&
           form.value.tipo_examen_id &&
           form.value.fecha &&
           form.value.hora_inicio &&
           form.value.aula_id &&
           form.value.profesor_titular_id &&
           form.value.numero_alumnos;
  }
  if (currentStep.value === 2) {
    return form.value.profesor_sinodal_id;
  }
  return true;
};

// Navegación entre pasos
const siguientePaso = () => {
  if (validarPasoActual()) {
    currentStep.value++;
  } else {
    alert('Por favor completa todos los campos requeridos');
  }
};

const anteriorPaso = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Funciones de obtención de nombres
const obtenerNombreMateria = (id: string | number) => {
  const materia = materias.value.find((m: any) => m.id == id);
  return materia ? materia.nombre : '';
};

const obtenerNombreGrupo = (id: string | number) => {
  const grupo = grupos.value.find((g: any) => g.id == id);
  return grupo ? grupo.nombre : '';
};

const obtenerNombreTipoExamen = (id: string | number) => {
  const tipo = tiposExamen.value.find((t: any) => t.id == id);
  return tipo ? tipo.nombre : '';
};

const obtenerNombreAula = (id: string | number) => {
  const aula = aulas.value.find((a: any) => a.id == id);
  return aula ? aula.nombre : '';
};

const obtenerNombreProfesor = (id: string | number) => {
  const profesor = profesores.value.find((p: any) => p.id == id);
  return profesor ? `${profesor.titulo} ${profesor.nombre}` : '';
};

const obtenerEmailProfesor = (id: string | number) => {
  const profesor = profesores.value.find((p: any) => p.id == id);
  return profesor ? profesor.email : '';
};

const formatearFechaCompleta = (fecha: string) => {
  if (!fecha) return '';
  const [year, month, day] = fecha.split('-');
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthIndex = month ? parseInt(month) - 1 : 0;
  return `${day} de ${meses[monthIndex] || ''} de ${year}`;
};

// Submit
const handleSubmit = () => {
  const newExam = {
    id: Date.now(),
    materia_id: parseInt(form.value.materia_id),
    tipo_examen_id: parseInt(form.value.tipo_examen_id),
    fecha: form.value.fecha,
    hora_inicio: form.value.hora_inicio,
    grupo_id: parseInt(form.value.grupo_id),
    aula_id: form.value.aula_id,
    profesor_titular_id: parseInt(form.value.profesor_titular_id),
    profesor_sinodal_id: parseInt(form.value.profesor_sinodal_id),
    numero_alumnos: parseInt(form.value.numero_alumnos),
    calificaciones: form.value.calificaciones,
    estado: 'pendiente'
  };
  
  examService.agregarExamen(newExam);
  mostrarExito.value = true;
};

const cerrarModal = () => {
  mostrarExito.value = false;
  router.push('/dashboard');
};

const irADashboard = () => {
  cerrarModal();
};

const cancelar = () => {
  modalTitulo.value = 'Cancelar creación';
  modalMensaje.value = '¿Estás seguro de cancelar? Se perderán los datos ingresados.';
  accionModal.value = () => {
    router.push('/dashboard'); // Redirige cuando el usuario confirme
  };
  mostrarModal.value = true; // Abre el modal
};

</script>

<style src="./NewExam.css" scoped></style>  