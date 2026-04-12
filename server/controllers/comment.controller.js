const Comment = require('../models/Comment');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parent: null })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    const withReplies = await Promise.all(comments.map(async (c) => {
      const replies = await Comment.find({ parent: c._id }).populate('author', 'name avatar').sort({ createdAt: 1 });
      return { ...c.toObject(), replies };
    }));
    res.json(withReplies);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    const comment = await Comment.create({ post: req.params.postId, author: req.user._id, content, parent: parent || null });
    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await comment.deleteOne();
    await Comment.deleteMany({ parent: comment._id });
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const liked = comment.likes.includes(req.user._id);
    if (liked) comment.likes.pull(req.user._id);
    else comment.likes.push(req.user._id);
    await comment.save();
    res.json({ likes: comment.likes.length, liked: !liked });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getComments, addComment, deleteComment, likeComment };
