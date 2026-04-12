const express = require('express');
const r = express.Router();
const Post = require('../models/Post');

// GET /api/tags — get all tags with counts
r.get('/', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json(tags);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = r;
