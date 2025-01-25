const express = require('express');
const app = express();
const path = require('path');
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const pool = require('./config/database');
require('dotenv').config();

// Custom CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = ['https://ig.punketech.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// Then other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplify static file configuration (remove manual CORS headers)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a root route handler
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Add a debug route to verify file serving
app.get('/debug-image', (req, res) => {
    // Verify file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Image not found' });
    }
    
    res.sendFile(filePath);
});

// Update SSL configuration with explicit settings
const sslOptions = {
    key: fs.readFileSync('/www/server/panel/vhost/cert/backend/privkey.pem'),
    cert: fs.readFileSync('/www/server/panel/vhost/cert/backend/fullchain.pem'),
    ciphers: [
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'DHE-RSA-AES256-GCM-SHA384'
    ].join(':'),
    honorCipherOrder: true,
    secureProtocol: 'TLSv1_2_method',
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3'
};

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocket.Server({ port: 4002 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
        // Handle messages
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Apply auth middleware only to protected routes
app.use('/api/profiles', (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Please authenticate' });
    }
    
    try {
        // Verify token here
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// Move your login route BEFORE the auth middleware
app.post('/api/users/login', async (req, res) => {
    try {
        // Add your actual login logic
        const { username, password } = req.body;
        
        // 1. Validate credentials
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 2. Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 3. Respond with token
        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
        
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Import profile routes
const profileRoutes = require('./routes/profiles');

// Mount under /api
app.use('/api', profileRoutes);

// Ensure user routes are mounted
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Mount under /profiles
app.use('/profiles', profileRoutes);

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});