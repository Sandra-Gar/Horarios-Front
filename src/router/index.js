import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login/Login.vue';
import Dashboard from '../views/Dashboard/Dashboard.vue';
import Signup from '../views/Signup/Signup.vue';
import NewExam from '../views/NewExam/NewExam.vue';
import ExamProgress from '../views/ExamProgress/ExamProgress.vue';
import ScheduleExams from '../views/ScheduleExams/ScheduleExams.vue';

const routes = [
  { 
    path: '/', 
    component: Login,
    meta: { title: 'Iniciar Sesión - UNSIS' }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true, title: 'Dashboard - UNSIS' }
  },
  { 
    path: '/signup', 
    component: Signup,
    meta: { title: 'Registro - UNSIS' }
  },
  { 
    path: '/new-exam', 
    component: NewExam,
    meta: { requiresAuth: true, title: 'Nuevo Examen - UNSIS' }
  },
  { 
    path: '/exam-progress', 
    component: ExamProgress,
    meta: { requiresAuth: true, title: 'Progreso de Exámenes - UNSIS' }
  },
  { 
    path: '/schedule-exams', 
    component: ScheduleExams,
    meta: { requiresAuth: true, role: 'jefe_carrera', title: 'Programar Exámenes - UNSIS' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');
  
  // Actualizar título de la página
  document.title = to.meta.title || 'UNSIS';
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !user) {
    next('/');
    return;
  }
  
  // Verificar rol específico
  if (to.meta.role && user) {
    try {
      const userData = JSON.parse(user);
      if (userData.rol !== to.meta.role) {
        alert('No tienes permisos para acceder a esta página');
        next('/dashboard');
        return;
      }
    } catch (e) {
      next('/');
      return;
    }
  }
  
  next();
});

export default router;