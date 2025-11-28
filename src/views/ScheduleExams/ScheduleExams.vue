<template>
  <!-- Optimized and refactored UI -->
  <div class="schedule-container">
    <h2>Programar Exámenes</h2>

    <section>
      <h3>1. Selección de Periodo</h3>
      <select v-model="periodoSeleccionado">
        <option disabled value="">Seleccione un periodo</option>
        <option v-for="p in periodos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
      </select>
      <button @click="guardarPeriodo">Continuar</button>
    </section>

    <section v-if="periodoGuardado">
      <h3>2. Selección de Grupo</h3>
      <select v-model="grupoSeleccionado">
        <option disabled value="">Seleccione un grupo</option>
        <option v-for="g in grupos" :key="g.id" :value="g.id">{{ g.nombre }}</option>
      </select>
      <button @click="guardarGrupo">Cargar Materias</button>
    </section>

    <section v-if="materias.length">
      <h3>3. Programación de Exámenes</h3>
      <div v-for="(m, i) in materias" :key="m.id" class="materia-card">
        <h4>{{ m.nombre }}</h4>
        <input type="date" v-model="m.fecha" />
        <input type="time" v-model="m.hora" />
        <select v-model="m.aula">
          <option disabled value="">Seleccione aula</option>
          <option v-for="a in aulas" :key="a.id" :value="a.nombre">{{ a.nombre }}</option>
        </select>
        <button @click="agregarExamen(i)">Agregar</button>
      </div>
    </section>

    <section v-if="examenesCreados.length">
      <h3>4. Exámenes Creados</h3>
      <ul>
        <li v-for="(ex, i) in examenesCreados" :key="i">
          {{ ex.materia }} – {{ ex.fecha }} {{ ex.hora }} – {{ ex.aula }}
          <button @click="eliminarExamen(i)">X</button>
        </li>
      </ul>
      <button @click="finalizarProgramacion">Guardar y Finalizar</button>
    </section>

    <dialog ref="modal">
      <h3>{{ modalTitulo }}</h3>
      <p>{{ modalMensaje }}</p>
      <button @click="confirmarModal">Aceptar</button>
      <button @click="cerrarModal">Cancelar</button>
    </dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      periodos: [
        { id: 1, nombre: "Enero - Abril" },
        { id: 2, nombre: "Mayo - Agosto" },
        { id: 3, nombre: "Septiembre - Diciembre" },
      ],
      grupos: [
        { id: 1, nombre: "3A" },
        { id: 2, nombre: "3B" },
        { id: 3, nombre: "3C" },
      ],
      aulas: [
        { id: 1, nombre: "A1" },
        { id: 2, nombre: "A2" },
        { id: 3, nombre: "Laboratorio" },
      ],

      periodoSeleccionado: "",
      grupoSeleccionado: "",

      periodoGuardado: false,
      materias: [],
      examenesCreados: [],

      modalTitulo: "",
      modalMensaje: "",
      accionModal: null,
    };
  },

  methods: {
    // Utilidad para evitar repetición de modales
    mostrarModal(titulo, mensaje, accion) {
      this.modalTitulo = titulo;
      this.modalMensaje = mensaje;
      this.accionModal = accion;
      this.$refs.modal.showModal();
    },

    cerrarModal() {
      this.$refs.modal.close();
    },

    confirmarModal() {
      if (this.accionModal) this.accionModal();
      this.cerrarModal();
    },

    guardarPeriodo() {
      if (!this.periodoSeleccionado) return alert("Seleccione un periodo");
      this.periodoGuardado = true;
    },

    guardarGrupo() {
      if (!this.grupoSeleccionado) return alert("Seleccione un grupo");
      // Cargar materias simuladas
      this.materias = [
        { id: 1, nombre: "Matemáticas", fecha: "", hora: "", aula: "" },
        { id: 2, nombre: "Física", fecha: "", hora: "", aula: "" },
        { id: 3, nombre: "Programación", fecha: "", hora: "", aula: "" },
      ];
    },

    agregarExamen(index) {
      const m = this.materias[index];
      if (!m.fecha || !m.hora || !m.aula)
        return alert("Complete todos los campos");

      this.examenesCreados.push({ ...m, materia: m.nombre });
      this.materias[index] = { ...m, fecha: "", hora: "", aula: "" };
    },

    eliminarExamen(i) {
      this.examenesCreados.splice(i, 1);
    },

    finalizarProgramacion() {
      this.mostrarModal(
        "Confirmar Programación",
        `¿Estás seguro de guardar la programación de ${this.examenesCreados.length} exámenes? Esta acción no se puede deshacer.`,
        () => this.guardarProgramacion()
      );
    },

    guardarProgramacion() {
      console.log("Guardando en base de datos...", this.examenesCreados);
      alert("Programación guardada exitosamente");
      this.resetearTodo();
    },

    resetearTodo() {
      this.periodoSeleccionado = "";
      this.grupoSeleccionado = "";
      this.periodoGuardado = false;
      this.materias = [];
      this.examenesCreados = [];
    },
  },
};
</script>

<style scoped>
.schedule-container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}

.materia-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}

button {
  margin-top: 10px;
  padding: 6px 12px;
}
</style>
