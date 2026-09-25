const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

/**
 * GET /api/health
 * Returns server + DB status — used by the setup verification script.
 */
router.get('/', (req, res) => {
  const dbState = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStatus = dbState[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    success:    true,
    message:    'MediRoute API is healthy 🩺',
    timestamp:  new Date().toISOString(),
    server:     'online',
    database:   dbStatus,
    dbName:     mongoose.connection.name || 'N/A',
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;
