# Instalación del Sistema de Gestión de Exámenes

## Requisitos Previos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## Instalación Frontend

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

## Instalación Base de Datos

1. Crear base de datos:
```bash
createdb sistema_examenes
```

2. Ejecutar script SQL:
```bash
psql -d sistema_examenes -f database/schema.sql
```

3. Verificar instalación:
```bash
psql -d sistema_examenes -c "SELECT * FROM carrera;"
```

## Usuarios de Prueba

- **Servicios Escolares**: `servicios@unsis.edu` / `pass123`
- **Jefe Informática**: `jefe.informatica@unsis.edu` / `pass123`
- **Jefe Adm. Pública**: `jefe.admonpub@unsis.edu` / `pass123`

## Estructura de Carpetas
```
src/
├── views/
│   ├── Dashboard/
│   │   ├── Dashboard.vue
│   │   └── Dashboard.css
│   ├── ScheduleExams/
│   │   ├── ScheduleExams.vue
│   │   └── ScheduleExams.css
│   ├── ExamProgress/
│   │   ├── ExamProgress.vue
│   │   └── ExamProgress.css
│   └── Login/
│       ├── Login.vue
│       └── Login.css
├── services/
│   ├── apiService.ts
│   ├── databaseService.ts
│   └── examService.ts
├── config/
│   └── database.ts
└── router/
    └── index.js
```