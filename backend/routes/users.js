const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, isAdmin } = require('../middleware/auth');
const pool = require('../config/database');

// Register new user (admin only)
router.post('/register', auth, isAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'user']
        );
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt details:', {
            username,
            passwordLength: password?.length,
            passwordChars: password?.split('').map(c => c.charCodeAt(0))
        });
        
        console.log('Login request received:', { 
            username, 
            passwordProvided: !!password,
            requestBody: req.body 
        });
        
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log('Database query result:', { 
            usersFound: users.length,
            userDetails: users.length ? {
                id: users[0].id,
                username: users[0].username,
                role: users[0].role,
                hashLength: users[0].password?.length
            } : null
        });
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Authentication details:', {
            passwordLength: password?.length,
            storedHashLength: user.password?.length,
            isMatch: isMatch
        });
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        console.log('Creating token with JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                domain: '.punketech.com'
            })
            .json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        console.log('Login successful for user:', username);
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;