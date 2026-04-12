const jwt = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' });
    const allowed = ['reader', 'author'];
    const user = await User.create({ name, email, password, role: allowed.includes(role) ? role : 'reader' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar, website } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, bio, avatar, website }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { register, login, getMe, updateProfile };
