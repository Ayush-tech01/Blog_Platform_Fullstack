const Post = require('../models/Post');

// GET /api/posts
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, tag, search, author, featured } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (author) filter.author = author;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .select('-content')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ posts, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/posts/:slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar bio website');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/posts
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, category, status, featured, customAuthorName } = req.body;
    const post = await Post.create({ title, content, excerpt, coverImage, tags, category, status, featured, customAuthorName, author: req.user._id });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/posts/:id/like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const liked = post.likes.includes(req.user._id);
    if (liked) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/posts/author/my
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/posts/related/:slug
const getRelatedPosts = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.json([]);
    const related = await Post.find({
      _id: { $ne: post._id }, status: 'published',
      $or: [{ tags: { $in: post.tags } }, { category: post.category }],
    }).populate('author', 'name avatar').select('-content').limit(3);
    res.json(related);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost, likePost, getMyPosts, getRelatedPosts };
