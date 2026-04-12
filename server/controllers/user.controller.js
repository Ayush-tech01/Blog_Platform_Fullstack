const User = require('../models/User');
const Post = require('../models/Post');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -savedPosts');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const postCount = await Post.countDocuments({ author: user._id, status: 'published' });
    res.json({ ...user.toObject(), postCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;
    const saved = user.savedPosts.includes(postId);
    if (saved) user.savedPosts.pull(postId);
    else user.savedPosts.push(postId);
    await user.save();
    res.json({ saved: !saved, count: user.savedPosts.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'name avatar' },
      options: { sort: { createdAt: -1 } },
    });
    res.json(user.savedPosts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getProfile, savePost, getSavedPosts, getAllUsers };
