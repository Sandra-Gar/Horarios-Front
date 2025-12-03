<template>
  <div class="modal-overlay" @click="$emit('cancelar')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ titulo }}</h3>
        <button class="close-btn" @click="$emit('cancelar')">&times;</button>
      </div>
      <div class="modal-body">
        <p>{{ mensaje }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('cancelar')">Cancelar</button>
        <button class="btn-confirm" @click="$emit('confirmar')">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    default: 'Confirmación'
  },
  mensaje: {
    type: String,
    default: '¿Estás seguro?'
  }
});

defineEmits(['confirmar', 'cancelar']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel, .btn-confirm {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-confirm {
  background: #3b82f6;
  color: white;
}
</style>
