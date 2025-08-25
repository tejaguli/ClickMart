require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./models/db'); // ✅ MongoDB connection

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 4000;

// ========== Middleware ==========
app.use(express.json()); // Parse JSON body
app.use(logger);         // Custom logger

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 Handler (for unknown routes)
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// ========== Start Server ==========
(async () => {
  try {
    await connectDB(); // ✅ Connect to DB first
    app.listen(PORT, () => {
      console.log(`🚀 Mini Blog API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit process if DB connection fails
  }
})();
