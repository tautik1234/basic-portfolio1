import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create data directory for local fallback if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tautik_portfolio';
let isMongoConnected = false;

try {
  // Set lower connection timeout so it doesn't hang indefinitely if Mongo isn't running
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
  });
  console.log('Successfully connected to MongoDB.');
  isMongoConnected = true;
} catch (error) {
  console.warn('WARNING: Failed to connect to MongoDB. Falling back to local file storage.');
  console.log('MongoDB error message:', error.message);
}

// Share the connection status with routers
app.use((req, res, next) => {
  req.isMongoConnected = isMongoConnected;
  req.dataDir = dataDir;
  next();
});

// API Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'MongoDB' : 'File Fallback',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Fallback file storage path: ${path.join(dataDir, 'messages.json')}`);
});
