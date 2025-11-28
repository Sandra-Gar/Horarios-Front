<template>
  <div class="container">
    <div class="form">
      <h2>Registro</h2>
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <InputText v-model="username" placeholder="Usuario" />
        </div>
        <div class="form-group">
          <label>Correo Electrónico</label>
          <InputText v-model="email" placeholder="example@unsis.edu.mx" type="email" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <Password v-model="password" placeholder="••••••••" :feedback="false" />
        </div>
        <Button type="submit" label="REGISTRARSE" class="p-button-raised p-button-rounded p-button-purple" />
      </form>
      <div class="links">
        <p>¿Ya tienes cuenta? <router-link to="/">Inicia Sesión</router-link></p>
      </div>
    </div>
    <svg class="illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path fill="#ab47bc" d="M100 30 Q130 60 170 70 Q140 110 160 160 Q100 140 40 160 Q60 110 30 70 Q70 60 100 30" filter="url(#glow)" />
      <circle cx="100" cy="180" r="20" fill="#7b1fa2" />
      <path fill="#ce93d8" d="M90 50 L110 50 L100 20 Z" />
    </svg>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const username = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const handleSignup = () => {
  console.log('Signup simulado');
  router.push('/');
};
</script>

<style src="./Signup.css" scoped></style>