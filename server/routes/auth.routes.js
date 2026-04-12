const express = require('express');
const r = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

r.post('/register', register);
r.post('/login', login);
r.get('/me', protect, getMe);
r.put('/profile', protect, updateProfile);

module.exports = r;
