<template>
  <div class="login-container">
    <!-- Fondo decorativo con elementos animados -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <!-- Contenido principal -->
    <div class="login-content">
      <!-- Lado izquierdo: Bienvenida -->
      <div class="welcome-section">
        <h1 class="welcome-title">Bienvenido</h1>
        <p class="welcome-subtitle">Inicia tu gestión de exámenes...</p>
      </div>

      <!-- Lado derecho: Formulario -->
      <div class="form-section">
        <div class="form-header">
          <div class="logo">
            <span class="logo-icon">◊</span>
            <span class="logo-text">UNSIS</span>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Usuario</label>
            <div class="input-wrapper">
              <input 
                v-model="email" 
                type="email" 
                id="email" 
                placeholder="usuario@unsis.edu"
                required
              />
              <i class="pi pi-user"></i>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <input 
                v-model="password" 
                type="password" 
                id="password" 
                placeholder="••••••••"
                required
              />
              <i class="pi pi-lock"></i>
            </div>
          </div>

          <div class="remember-forgot">
            <label class="remember-checkbox">
              <input type="checkbox" />
              <span>Recuérdame</span>
            </label>
            <a href="#" class="forgot-password">Olvidé mi contraseña</a>
          </div>

          <button type="submit" class="login-btn">INICIAR SESIÓN</button>

          <div v-if="error" class="error-message">{{ error }}</div>
        </form>

        <div class="login-footer">
          <p>¿No tienes cuenta? <a href="#">Contacta a Servicios Escolares</a></p>
        </div>
      </div>
    </div>

    <!-- Demo Users Info -->
    <div class="demo-info">
      <div class="demo-header">📋 Usuarios de Demostración</div>
      <div class="demo-users">
        <div class="demo-item">
          <span class="demo-role">Servicios Escolares</span>
          <span class="demo-email">servicios@unsis.edu</span>
        </div>
        <div class="demo-item">
          <span class="demo-role">Jefe de Carrera (Informática)</span>
          <span class="demo-email">jefe.informatica@unsis.edu</span>
        </div>
        <div class="demo-item">
          <span class="demo-role">Jefe de Carrera (Medicina)</span>
          <span class="demo-email">jefe.medicina@unsis.edu</span>
        </div>
      </div>
      <p class="demo-password">Contraseña para todos: <strong>pass123</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

// Usuarios válidos (simulado - en BD real)
const validUsers = [
  { email: 'servicios@unsis.edu', rol: 'servicios_escolares', password: 'pass123' },
  { email: 'jefe.informatica@unsis.edu', rol: 'jefe_carrera', carrera_id: 1, password: 'pass123' },
  { email: 'jefe.medicina@unsis.edu', rol: 'jefe_carrera', carrera_id: 2, password: 'pass123' }
];

const handleLogin = async () => {
  error.value = '';

  // Validar usuario
  const user = validUsers.find(u => u.email === email.value && u.password === password.value);

  if (!user) {
    error.value = 'Correo o contraseña incorrectos';
    return;
  }

  // Guardar sesión en localStorage
  const userData = {
    email: user.email,
    rol: user.rol,
    carrera_id: (user as any).carrera_id || null,
    logged_at: new Date().toISOString()
  };

  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', 'demo-token-' + Date.now());

  // Redirigir al Dashboard
  router.push('/dashboard');
};
</script>

<style src="./Login.css" scoped></style>