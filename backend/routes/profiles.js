const express = require('express');
const router = express.Router();
const path = require('path');

// Add this line near the top of your file
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const { auth, isAdmin } = require('../middleware/auth');
const pool = require('../config/database');
const axios = require('axios');

// Get all profiles (accessible by authenticated users)
router.get('/profiles', auth, async (req, res) => {
    try {
        const [profiles] = await pool.query('SELECT * FROM instagram_profiles ORDER BY created_at DESC');
        // Log profile image URLs for debugging
        console.log('Profile image URLs:', profiles.map(p => p.profile_image));
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Image proxy route for handling Instagram images
router.get('/image-proxy/:imageUrl', auth, async (req, res) => {
    try {
        const imageUrl = decodeURIComponent(req.params.imageUrl);
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.instagram.com/'
            }
        });
        
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        console.error('Image proxy error:', error);
        res.status(404).send('Image not found');
    }
});

// Get single profile
router.get('/:id', auth, async (req, res) => {
    try {
        const [profile] = await pool.query('SELECT * FROM instagram_profiles WHERE id = ?', [req.params.id]);
        if (profile.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { name, category, introduction } = req.body;
        await pool.query(
            'UPDATE instagram_profiles SET name = ?, category = ?, introduction = ? WHERE id = ?',
            [name, category, introduction, req.params.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete profile (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM instagram_profiles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
  try {
    const [profiles] = await pool.query('SELECT * FROM instagram_profiles');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;