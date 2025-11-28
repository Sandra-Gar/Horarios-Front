# Sistema de Gestión de Exámenes - UNSIS

## Descripción General

Sistema de gestión de exámenes **solo para Servicios Escolares y Jefes de Carreras**. Los estudiantes no tienen acceso a esta aplicación.

## Control de Acceso

### Roles Autorizados:
- **Servicios Escolares** - Acceso completo a todos los exámenes de todas las carreras
- **Jefe de Carrera** - Acceso limitado a exámenes y materias de su carrera asignada

### Usuarios de Demostración:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Servicios Escolares | `servicios@unsis.edu` | `pass123` |
| Jefe (Informática) | `jefe.informatica@unsis.edu` | `pass123` |
| Jefe (Medicina) | `jefe.medicina@unsis.edu` | `pass123` |

## Estructura de Archivos

```
src/
├── views/
│   ├── Login.vue              # Página de autenticación
│   └── DashboardAdmin.vue     # Panel principal (Servicios/Jefes)
├── services/
│   └── examService.ts         # Servicio de datos (simula BD)
└── router/
    └── index.js               # Rutas de la aplicación
```

## Base de Datos Simulada

El archivo `src/services/examService.ts` contiene una simulación completa de la base de datos con las siguientes tablas:

### Tablas Principales

```typescript
// Usuarios y Roles
roles[]              // id, nombre, description
usuarios[]           // id, nombre_usuario, password_hash, rol_id
carreras[]           // id, nombre, codigo, descripcion

// Académico
materias[]           // id, clave, nombre, semestre, es_inglesa, carrera_id
grupos[]             // id, nombre, semestre, carrera_id, profesor_id, materia_id, aula_id
estudiantes[]        // id, nombre_usuario, email, grupo_id, carrera_id

// Exámenes
tipos_examen[]       // id, nombre, description
examenes[]           // id, grupo_id, materia_id, tipo_examen_id, fecha, hora_inicio, hora_fin, estado
notificaciones[]     // Avisos para profesores

// Auditoría
auditoria[]          // id, accion, tabla_afectada, registro_id, usuario_id, datos_anteriores, datos_nuevos

// Profesores
profesores[]         // id, nombre, apellido, email, usuario_id
profesor_sinodales[] // Relación many-to-many
```

##  Cómo Reemplazar con APIs Reales

Cada función en `examService.ts` tiene comentarios `TODO` indicando dónde conectar APIs:

### Ejemplo:
```typescript
// ANTES (Simulado):
export const obtenerExamenes = (): Examen[] => {
  return database.examenes;
};

// DESPUÉS (Con API):
export const obtenerExamenes = async (): Examen[] => {
  const response = await fetch('/api/examenes');
  return response.json();
};
```

### Endpoints API Necesarios:

```
GET    /api/examenes                    # Obtener todos los exámenes
GET    /api/examenes?carrera_id=:id    # Exámenes por carrera
POST   /api/examenes                    # Crear examen
PUT    /api/examenes/:id               # Actualizar examen
DELETE /api/examenes/:id               # Eliminar examen

GET    /api/grupos                      # Obtener grupos
GET    /api/grupos?carrera_id=:id      # Grupos por carrera

GET    /api/materias                    # Obtener materias
GET    /api/materias?carrera_id=:id    # Materias por carrera

GET    /api/carreras                    # Obtener carreras
GET    /api/auditoria                   # Registro de auditoría
POST   /api/auditoria                   # Registrar cambio
```

## Funcionalidades Principales

### Para Servicios Escolares:
- Ver todos los exámenes de todas las carreras
- Crear, editar y eliminar exámenes
- Ver todos los grupos y materias
- Acceso completo a auditoría
- Gestión de notificaciones

### Para Jefes de Carrera:
- Ver solo exámenes de su carrera
- Ver solo grupos de su carrera
- Ver solo materias de su carrera
- Crear exámenes en su carrera
- Acceso limitado a auditoría (solo su carrera)

##  Autenticación

```typescript
// Se guarda en localStorage
localStorage.setItem('user', JSON.stringify({
  email: 'usuario@unsis.edu',
  rol: 'servicios_escolares' | 'jefe_carrera',
  carrera_id: null | number,
  logged_at: '2025-02-17T10:30:00Z'
}));

localStorage.setItem('token', 'demo-token-' + timestamp);
```

##  Vistas Disponibles

1. **Exámenes** - Tabla de todos los exámenes programados
2. **Grupos** - Cards de grupos académicos
3. **Materias** - Tabla de materias disponibles
4. **Auditoría** - Registro de cambios (solo información)

##  Pasos para Migrar a BD Real

### Paso 1: Crear Backend
```typescript
// backend/routes/examenes.ts
app.get('/api/examenes', async (req, res) => {
  const exams = await db.query('SELECT * FROM examenes');
  res.json(exams);
});
```

### Paso 2: Actualizar Service
```typescript
// services/examService.ts
export const obtenerExamenes = async (): Examen[] => {
  const response = await fetch(`${API_URL}/api/examenes`);
  if (!response.ok) throw new Error('Error fetching exams');
  return response.json();
};
```

### Paso 3: Actualizar Componentes
```typescript
// views/DashboardAdmin.vue
onMounted(async () => {
  verificarAutenticacion();
  await cargarDatos(); // Ya es async-ready
});

const cargarDatos = async () => {
  examenesData.value = await examService.obtenerExamenes();
  gruposData.value = await examService.obtenerGrupos();
  // ...
};
```

##  Ejemplo: Crear Nuevo Examen

```typescript
const crearExamen = async () => {
  const nuevoExamen = {
    grupo_id: 1,
    materia_id: 1,
    tipo_examen_id: 1,
    fecha: '2025-03-15',
    hora_inicio: '09:00',
    hora_fin: '10:30',
    numero_alumnos: 28,
    calificaciones: 0,
    estado: 'programado'
  };

  // Con API real:
  // const response = await fetch('/api/examenes', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(nuevoExamen)
  // });

  const examen = examService.crearExamen(nuevoExamen);
  
  // Registrar en auditoría
  examService.registrarAuditoria('CREATE', 'examenes', 1, nuevoExamen);
  
  // Recargar datos
  examenesData.value = await examService.obtenerExamenes();
};
```

##  Configuración de Variables de Entorno

```env
# .env.local
VITE_API_URL=http://localhost:3000
VITE_API_BASE=/api/v1

# .env.production
VITE_API_URL=https://api.unsis.edu
VITE_API_BASE=/api/v1
```

## Contacto y Soporte

**Servicios Escolares:**
- Email: servicios@universidad.edu
- Teléfono: (555) 123-4567
- Horario: Lunes a Viernes 8:00 AM - 5:00 PM

## Notas de Seguridad

1. Las contraseñas en demo son solo para prueba
2. En producción, usar autenticación JWT o similar
3. Validar permisos en backend (no confiar en frontend)
4. Usar HTTPS siempre
5. Implementar rate limiting en APIs
6. Encriptar datos sensibles
7. Auditar todos los cambios en BD
