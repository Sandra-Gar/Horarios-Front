<template>
  <div class="import-modal">
    <div class="import-header">
      <h3>Importar Programación de Exámenes</h3>
      <button @click="$emit('close')" class="close-btn">
        <i class="pi pi-times"></i>
      </button>
    </div>
    
    <div class="import-body">
      <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
        <i class="pi pi-cloud-upload"></i>
        <p>Arrastra un archivo PDF o haz clic para seleccionar</p>
        <input type="file" accept=".pdf,.xlsx,.csv" @change="handleFileSelect" ref="fileInput" />
        <button @click="$refs.fileInput.click()" class="btn-upload">
          Seleccionar Archivo
        </button>
      </div>

      <div v-if="archivoSeleccionado" class="file-info">
        <i class="pi pi-file"></i>
        <span>{{ archivoSeleccionado.name }}</span>
        <button @click="procesarArchivo" class="btn-process">
          Procesar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['close', 'imported']);

const archivoSeleccionado = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    archivoSeleccionado.value = target.files[0];
  }
};

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    archivoSeleccionado.value = event.dataTransfer.files[0];
  }
};

const procesarArchivo = async () => {
  if (!archivoSeleccionado.value) return;
  
  // Aquí procesarías el archivo
  alert('Procesando archivo... (funcionalidad en desarrollo)');
  emit('imported');
};
</script>
