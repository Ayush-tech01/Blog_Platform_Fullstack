const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/posts',    require('./routes/post.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/users',    require('./routes/user.routes'));
app.use('/api/tags',     require('./routes/tag.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/', (req, res) => res.json({ message: 'Blog API is running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
