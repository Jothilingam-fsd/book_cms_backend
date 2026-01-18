import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module equivalents for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import bookRoutes from './routes/bookRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import pageRoutes from './routes/pageRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - MUST be before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure required directories exist
const requiredDirs = [
  path.join(__dirname, 'data'),
  path.join(__dirname, 'storage/versions')
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Book CMS API is running',
    timestamp: new Date().toISOString()
  });
});

// Register API routes
app.use('/api/books', bookRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/pages', pageRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Book CMS Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      books: '/api/books',
      chapters: '/api/chapters',
      pages: '/api/pages'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('Server running on port', PORT);
  console.log('Book CMS API ready at http://localhost:' + PORT + '/api');
  console.log('');
  console.log('Available endpoints:');
  console.log(' GET  http://localhost:' + PORT + '/api/health');
  console.log(' GET  http://localhost:' + PORT + '/api/books');
  console.log(' POST http://localhost:' + PORT + '/api/books');
  console.log('');
});