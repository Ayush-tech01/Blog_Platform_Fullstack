const express = require('express');
const r = express.Router();
const { getComments, addComment, deleteComment, likeComment } = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth.middleware');

r.get('/:postId',        getComments);
r.post('/:postId',       protect, addComment);
r.delete('/:id',         protect, deleteComment);
r.post('/:id/like',      protect, likeComment);

module.exports = r;
