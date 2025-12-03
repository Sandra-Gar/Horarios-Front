<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <button class="back-btn" @click="cancelar">
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h2>Programar Exámenes</h2>
          <p>Planifica múltiples exámenes por periodo y grupo</p>
        </div>
      </div>

      <div class="form-body">
        <!-- Pasos de Progreso -->
        <div class="progress-steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <span>Periodo y Grupo</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <span>Programación</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <div class="step-number">3</div>
            <span>Confirmar</span>
          </div>
        </div>

        <!-- Paso 1: Selección -->
        <div v-show="currentStep === 1" class="step-content">
          <h3>Selección de Grupo y Periodo</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Periodo *</label>
              <select v-model="periodoSeleccionado">
                <option disabled value="">Seleccione un periodo</option>
                <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Grupo *</label>
              <select v-model="grupoSeleccionado">
                <option disabled value="">Seleccione un grupo</option>
                <option v-for="g in grupos" :key="g.id" :value="g.id">{{ g.nombre }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Paso 2: Programación -->
        <div v-show="currentStep === 2" class="step-content">
          <h3>Programar Materias</h3>
          <div class="materias-list">
            <div v-for="(m, i) in materias" :key="m.id" class="materia-item-card">
              <div class="materia-header">
                <h4>{{ m.nombre }}</h4>
                <span class="status-badge" :class="{ 'scheduled': m.agendado }">
                  {{ m.agendado ? 'Agendado' : 'Pendiente' }}
                </span>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Fecha</label>
                  <input type="date" v-model="m.fecha" :disabled="m.agendado" />
                </div>
                <div class="form-group">
                  <label>Hora</label>
                  <input type="time" v-model="m.hora" :disabled="m.agendado" />
                </div>
                <div class="form-group full-width">
                  <label>Aula</label>
                  <select v-model="m.aula" :disabled="m.agendado">
                    <option disabled value="">Seleccione aula</option>
                    <option v-for="a in aulas" :key="a.id" :value="a.nombre">{{ a.nombre }}</option>
                  </select>
                </div>
              </div>
              <button 
                v-if="!m.agendado" 
                class="btn-secondary small-btn" 
                @click="agregarExamen(i)"
                :disabled="!m.fecha || !m.hora || !m.aula"
              >
                <i class="pi pi-plus"></i> Agregar a la lista
              </button>
              <button v-else class="btn-danger small-btn" @click="removerExamen(i)">
                <i class="pi pi-trash"></i> Remover
              </button>
            </div>
          </div>
        </div>

        <!-- Paso 3: Confirmación -->
        <div v-show="currentStep === 3" class="step-content">
          <h3>Confirmar Programación</h3>
          <div class="confirmation-card">
            <div class="confirmation-header">
              <i class="pi pi-calendar-plus"></i>
              <h4>Resumen de Exámenes a Crear</h4>
            </div>
            <div class="confirmation-details">
              <div v-if="examenesCreados.length === 0" class="empty-state">
                <p>No has programado ningún examen.</p>
              </div>
              <div v-else class="exams-summary-list">
                <div v-for="(ex, i) in examenesCreados" :key="i" class="summary-item">
                  <div class="summary-info">
                    <strong>{{ ex.materia }}</strong>
                    <span>{{ ex.fecha }} a las {{ ex.hora }} en {{ ex.aula }}</span>
                  </div>
                  <span class="group-badge">{{ ex.grupo_nombre }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de Accion -->
        <div class="form-footer">
          <button 
            v-if="currentStep > 1" 
            class="btn-secondary" 
            @click="anteriorPaso"
          >
            <i class="pi pi-arrow-left"></i> Anterior
          </button>
          
          <button 
            v-if="currentStep < 3" 
            class="btn-primary" 
            @click="siguientePaso"
          >
            Siguiente <i class="pi pi-arrow-right"></i>
          </button>

          <button 
            v-if="currentStep === 3" 
            class="btn-success" 
            @click="finalizarProgramacion"
            :disabled="examenesCreados.length === 0"
          >
            <i class="pi pi-check"></i> Finalizar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      v-if="mostrarModal"
      :titulo="modalTitulo"
      :mensaje="modalMensaje"
      @confirmar="confirmarModal"
      @cancelar="cerrarModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';

const router = useRouter();
const currentStep = ref(1);
const mostrarModal = ref(false);
const modalTitulo = ref('');
const modalMensaje = ref('');
const accionModal = ref<() => void>(() => {});

// Datos
const periodos = ref([
  { id: 1, nombre: "Enero - Abril" },
  { id: 2, nombre: "Mayo - Agosto" },
  { id: 3, nombre: "Septiembre - Diciembre" },
]);
const grupos = ref([
  { id: 1, nombre: "3A" },
  { id: 2, nombre: "3B" },
  { id: 3, nombre: "3C" },
]);
const aulas = ref([
  { id: 1, nombre: "A1" },
  { id: 2, nombre: "A2" },
  { id: 3, nombre: "Laboratorio" },
]);

const periodoSeleccionado = ref("");
const grupoSeleccionado = ref("");
const materias = ref<any[]>([]);
const examenesCreados = ref<any[]>([]);

// Metodos
const siguientePaso = () => {
  if (currentStep.value === 1) {
    if (!periodoSeleccionado.value || !grupoSeleccionado.value) {
      alert("Seleccione periodo y grupo");
      return;
    }
    cargarMaterias();
  }
  currentStep.value++;
};

const anteriorPaso = () => {
  currentStep.value--;
};

const cargarMaterias = () => {
  if (materias.value.length === 0) {
    materias.value = [
      { id: 1, nombre: "Matemáticas", fecha: "", hora: "", aula: "", agendado: false },
      { id: 2, nombre: "Física", fecha: "", hora: "", aula: "", agendado: false },
      { id: 3, nombre: "Programación", fecha: "", hora: "", aula: "", agendado: false },
    ];
  }
};

const agregarExamen = (index: number) => {
  const m = materias.value[index];
  const grupo = grupos.value.find(g => g.id === parseInt(grupoSeleccionado.value));
  const periodo = periodos.value.find(p => p.id === parseInt(periodoSeleccionado.value));

  examenesCreados.value.push({
    ...m,
    materia: m.nombre,
    grupo_id: grupoSeleccionado.value,
    grupo_nombre: grupo ? grupo.nombre : 'Unknown',
    periodo_id: periodoSeleccionado.value,
    periodo_nombre: periodo ? periodo.nombre : 'Unknown'
  });
  
  m.agendado = true;
};

const removerExamen = (index: number) => {
  const materia = materias.value[index];
  materia.agendado = false;
  materia.fecha = "";
  materia.hora = "";
  materia.aula = "";
  
  examenesCreados.value = examenesCreados.value.filter(e => e.id !== materia.id);
};

const finalizarProgramacion = () => {
  modalTitulo.value = "Confirmar Programación";
  modalMensaje.value = `¿Estás seguro de guardar ${examenesCreados.value.length} exámenes?`;
  accionModal.value = () => {
    console.log("Guardando...", examenesCreados.value);
    alert("Programación guardada exitosamente");
    router.push('/dashboard');
  };
  mostrarModal.value = true;
};

const cancelar = () => {
  modalTitulo.value = "Cancelar";
  modalMensaje.value = "¿Salir sin guardar?";
  accionModal.value = () => router.push('/dashboard');
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const confirmarModal = () => {
  accionModal.value();
  cerrarModal();
};
</script>

<style src="../NewExam/NewExam.css" scoped></style>

<style scoped>


.materias-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.materia-item-card {
  background: #f8f9fc;
  border: 1px solid #e8eef5;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.materia-item-card:hover {
  border-color: #b19cd9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.materia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.materia-header h4 {
  margin: 0;
  color: #1a202c;
  font-size: 16px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #e2e8f0;
  color: #718096;
  font-weight: 600;
}

.status-badge.scheduled {
  background: #c6f6d5;
  color: #2f855a;
}

.small-btn {
  padding: 8px 16px;
  font-size: 13px;
  margin-top: 15px;
  width: 100%;
  justify-content: center;
}

.btn-danger {
  background: #fff5f5;
  color: #e53e3e;
  border: 1px solid #feb2b2;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  width: 100%;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #e53e3e;
  color: white;
}

.exams-summary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.summary-info {
  display: flex;
  flex-direction: column;
}

.summary-info strong {
  color: #2d3748;
  font-size: 14px;
}

.summary-info span {
  color: #718096;
  font-size: 12px;
}

.group-badge {
  background: #ebf8ff;
  color: #3182ce;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
</style>
