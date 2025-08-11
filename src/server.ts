import express, { Request, Response, NextFunction } from 'express';
import { connectDB } from './config/database';

// Import routes
import usersRouter from './routes/users';
import subjectsRouter from './routes/subjects';
import slidesRouter from './routes/slides';
import reportsRouter from './routes/reports';
import filesRouter from './routes/files';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to 7th Reports Server!',
    timestamp: new Date().toISOString(),
    status: 'running',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      subjects: '/api/subjects',
      slides: '/api/slides',
      reports: '/api/reports',
      files: '/api/files'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/slides', slidesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/files', filesRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler - using a more compatible approach
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   - Users: http://localhost:${PORT}/api/users`);
  console.log(`   - Subjects: http://localhost:${PORT}/api/subjects`);
  console.log(`   - Slides: http://localhost:${PORT}/api/slides`);
  console.log(`   - Reports: http://localhost:${PORT}/api/reports`);
  console.log(`   - Files: http://localhost:${PORT}/api/files`);
});

export default app; 