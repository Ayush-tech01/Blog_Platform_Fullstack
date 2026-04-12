const express = require('express');
const r = express.Router();
const { getProfile, savePost, getSavedPosts, getAllUsers } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

r.get('/',                        protect, authorize('admin'), getAllUsers);
r.get('/saved',                   protect, getSavedPosts);
r.post('/save/:postId',           protect, savePost);
r.get('/:id',                     getProfile);

module.exports = r;
