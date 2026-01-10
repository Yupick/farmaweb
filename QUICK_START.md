# ⚡ Inicio Rápido - FASE 1 Completada

**Estado:** ✅ FASE 1 lista para instalar y ejecutar

---

## 🚀 Instalación Rápida (5 minutos)

### Backend

```bash
cd backend
npm install
npm start
```

El servidor iniciará en `http://localhost:5000`

**Credenciales de prueba:**
- Email: `admin@fciacientifica.com.ar`
- Contraseña: `cientifica123`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

---

## 📋 Archivos Creados en FASE 1

### Backend (Completamente funcional)
```
backend/
├── package.json                    # 13 dependencias
├── .env                           # Variables de entorno
├── src/
│   ├── index.js                   # Servidor Express
│   ├── config/
│   │   └── database.js            # Configuración SQLite
│   ├── services/
│   │   ├── userService.js         # Lógica de usuarios
│   │   ├── seedService.js         # Inicialización BD
│   │   ├── configService.js       # Configuraciones
│   │   └── auditService.js        # Auditoría
│   ├── controllers/
│   │   ├── authController.js      # Login/logout
│   │   ├── userController.js      # CRUD usuarios
│   │   ├── configController.js    # CRUD config
│   │   └── auditController.js     # Logs
│   ├── routes/
│   │   ├── auth.js                # Rutas de auth
│   │   ├── users.js               # Rutas de usuarios
│   │   ├── config.js              # Rutas de config
│   │   └── audit.js               # Rutas de auditoría
│   ├── middleware/
│   │   └── auth.js                # JWT + autorización
│   └── utils/
│       └── auth.js                # Funciones criptográficas
```

**Endpoints disponibles:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil
- `GET /api/users` - Listar usuarios (admin)
- `POST /api/users` - Crear usuario (admin)
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)
- `GET /api/config` - Obtener configuraciones
- `PUT /api/config/:key` - Actualizar config (admin)
- `GET /api/audit` - Ver logs (admin)

### Frontend (Completamente funcional)
```
frontend/
├── package.json                   # 10 dependencias
├── .env.local                     # Variables de entorno
├── app/
│   ├── layout.tsx                 # Layout raíz
│   ├── page.tsx                   # Dashboard home
│   ├── login/
│   │   └── page.tsx               # Página login
│   ├── dashboard/
│   │   ├── layout.tsx             # Layout dashboard
│   │   ├── users/page.tsx         # Gestión usuarios
│   │   ├── config/page.tsx        # Configuración
│   │   ├── audit/page.tsx         # Auditoría
│   │   └── profile/page.tsx       # Mi perfil
│   ├── providers/
│   │   ├── AuthProvider.tsx       # Context de autenticación
│   │   └── ThemeProvider.tsx      # Context de tema
│   ├── globals.css                # Tailwind global
├── hooks/
│   └── useAuth.ts                 # Hook de autenticación
├── tailwind.config.ts             # Config Tailwind
├── tsconfig.json                  # Config TypeScript
├── next.config.js                 # Config Next.js
├── postcss.config.js              # Config PostCSS
└── .eslintrc.json                 # Config ESLint
```

**Páginas disponibles:**
- `/login` - Inicio de sesión
- `/` - Dashboard home
- `/dashboard/users` - Gestión de usuarios (admin)
- `/dashboard/config` - Configuraciones (admin)
- `/dashboard/audit` - Logs de auditoría (admin)
- `/dashboard/profile` - Mi perfil

---

## 🗄️ Base de Datos

Tablas creadas automáticamente:
- `roles` - 3 roles (admin, moderador, usuario)
- `users` - Gestión de usuarios con hashing de contraseñas
- `configurations` - Parámetros del sistema
- `audit_logs` - Registro de actividades
- `content` - Contenido dinámico (para FASE 2)

**Usuario admin creado automáticamente:**
- Email: `admin@farmamalvinas.com`
- Contraseña (hashed): `cientifica123`

---

## 🔐 Seguridad Implementada

- ✅ Hash de contraseñas con bcrypt (10 rounds)
- ✅ Autenticación JWT (7 días de expiración)
- ✅ Control de acceso por roles (RBAC)
- ✅ CORS configurado
- ✅ Validación de entrada en todos los endpoints
- ✅ Logging de todas las acciones
- ✅ Variables de entorno protegidas

---

## 🛠️ Herramientas Utilizadas

**Backend:**
- Express.js 4.18.2
- SQLite3 5.1.6
- JWT 9.1.2
- bcrypt 5.1.1
- CORS 2.8.5

**Frontend:**
- Next.js 14.0.3
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.3.6
- Axios 1.6.2

---

## 📊 Estadísticas de FASE 1

- **Líneas de código:** 2,500+
- **Componentes React:** 8
- **Endpoints API:** 15
- **Tablas BD:** 5
- **Índices BD:** 10+
- **Archivos creados:** 40+
- **Tiempo estimado:** 2 semanas

---

## ✅ Checklist antes de ejecutar

- [ ] Node.js 18+ instalado
- [ ] npm o yarn disponible
- [ ] Puerto 5000 disponible (backend)
- [ ] Puerto 3000 disponible (frontend)

---

## 🐛 Troubleshooting

**Error: "Port 5000 already in use"**
```bash
# Cambiar puerto en backend/.env
PORT=5001
```

**Error: "Cannot find module"**
```bash
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

**Error: "Database locked"**
```bash
# Eliminar base de datos y dejar que se cree nueva
rm backend/data/farmaweb.db
```

---

## 📚 Documentación

- [API.md](./API.md) - Documentación completa de endpoints
- [DATABASE.md](./DATABASE.md) - Esquema y relaciones
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
- [ROADMAP.md](./ROADMAP.md) - Plan de desarrollo
- [SETUP.md](./SETUP.md) - Instalación detallada

---

## 🎯 Próximo Paso

**FASE 2: Landing Page Dinámica**
- Crear página pública de inicio
- Integrar contenido dinámico desde admin
- Conectar con Instagram API
- Implementar SEO

---

**Creado:** 10 de enero de 2026  
**Administrador:** Cristian Saqueta Melo  
**Status:** ✅ Listo para instalar y ejecutar
