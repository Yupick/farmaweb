import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { runSchema, seedDatabase } from './config/database.js';
import { errorHandler } from './middleware/auth.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import configRoutes from './routes/config.js';
import auditRoutes from './routes/audit.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/config', configRoutes);
app.use('/api/audit', auditRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Farmacia Científica Malvinas API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      config: '/api/config',
      audit: '/api/audit'
    }
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicializar base de datos y servidor
async function startServer() {
  try {
    console.log('⏳ Inicializando base de datos...');
    await runSchema();
    console.log('✅ Esquema de base de datos creado');

    console.log('⏳ Cargando datos iniciales...');
    await seedDatabase();
    console.log('✅ Base de datos inicializada con datos iniciales');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║   🚀 Servidor iniciado correctamente                ║
║   📍 http://localhost:${PORT}                        
║   🔐 Base de datos: SQLite                          ║
║   🔑 Auth: JWT                                      ║
║   👤 Admin: admin@farmamalvinas.com / cientifica123 ║
╚════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
