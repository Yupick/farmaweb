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
import contentRoutes from './routes/content.js';
import chatRoutes from './routes/chat.js';
import instagramRoutes from './routes/instagram.js';
import emailRoutes from './routes/email.js';
import reservationRoutes from './routes/reservations.js';
import searchRoutes from './routes/search.js';

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
app.use('/api/content', contentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/search', searchRoutes);

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
║   👤 Admin: admin@fciacientifica.com.ar / cientifica123 ║
╚════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
