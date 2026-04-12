const express = require('express');
const r = express.Router();
const { getPosts, getPostBySlug, createPost, updatePost, deletePost, likePost, getMyPosts, getRelatedPosts } = require('../controllers/post.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

r.get('/',             getPosts);
r.get('/author/my',    protect, getMyPosts);
r.get('/related/:slug', getRelatedPosts);
r.get('/:slug',        getPostBySlug);
r.post('/',            protect, authorize('author', 'admin'), createPost);
r.put('/:id',          protect, authorize('author', 'admin'), updatePost);
r.delete('/:id',       protect, authorize('author', 'admin'), deletePost);
r.post('/:id/like',    protect, likePost);

module.exports = r;
