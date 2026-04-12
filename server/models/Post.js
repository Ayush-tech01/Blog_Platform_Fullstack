const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  content:     { type: String, required: true },
  excerpt:     { type: String, default: '' },
  coverImage:  { type: String, default: '' },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customAuthorName: { type: String, default: '' },
  customAuthorBio: { type: String, default: '' },
  customAuthorWebsite: { type: String, default: '' },
  tags:        [{ type: String }],
  category:    { type: String, default: 'General' },
  status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
  featured:    { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readTime:    { type: Number, default: 1 },
}, { timestamps: true });

postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.isModified('content')) {
    const words = this.content.split(' ').length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
    if (!this.excerpt) {
      this.excerpt = this.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
    }
  }
  next();
});

postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
