const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Post = require('./models/Post');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  await User.deleteMany({});
  await Post.deleteMany({});

  const adminPass  = await bcrypt.hash('admin123', 12);
  const authorPass = await bcrypt.hash('demo123', 12);
  const readerPass = await bcrypt.hash('demo123', 12);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@inkwell.com',
    password: adminPass, role: 'admin',
    bio: 'Platform administrator.',
  });

  const author = await User.create({
    name: 'Jane Doe', email: 'author@inkwell.com',
    password: authorPass, role: 'author',
    bio: 'Writer, thinker, and coffee enthusiast. Covering tech and culture.',
    website: 'https://janedoe.com',
  });

  await User.create({
    name: 'Reader User', email: 'reader@inkwell.com',
    password: readerPass, role: 'reader',
  });

  const posts = [
    {
      title: 'The Quiet Revolution of Async JavaScript',
      content: '<h2>From callbacks to async/await</h2><p>JavaScript\'s journey from callback hell to elegant async/await syntax is one of the most significant ergonomic improvements in the language\'s history. When Node.js first appeared, deeply nested callbacks were a rite of passage every developer had to endure.</p><p>Promises arrived as a breath of fresh air, flattening the pyramid of doom into a readable chain. Then async/await made asynchronous code look almost synchronous — dramatically reducing cognitive overhead.</p><blockquote>Writing asynchronous code should feel as natural as writing synchronous code.</blockquote><p>Today, with the proliferation of top-level await in ES modules, we\'re closer than ever to that ideal. The revolution was quiet, incremental, and entirely worth it.</p>',
      excerpt: 'How JavaScript evolved from callback hell to elegant async/await, reshaping the way we write asynchronous code.',
      author: author._id,
      category: 'Technology',
      tags: ['javascript', 'async', 'nodejs'],
      status: 'published', featured: true, views: 342,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    },
    {
      title: 'Design Tokens: The Language Your Design System Needs',
      content: '<h2>What are design tokens?</h2><p>Design tokens are the atomic values that constitute a design system — colors, typography, spacing, shadows. Instead of hardcoding <code>#6c63ff</code> across hundreds of components, you define a token <code>--color-brand-primary</code> once and reference it everywhere.</p><p>The real power emerges at scale. When your brand refreshes, you update one value. When you ship a dark mode, you swap token mappings. The components themselves remain untouched.</p><h2>Implementing tokens</h2><p>CSS custom properties are the natural home for tokens in the browser. For multi-platform products, tools like Style Dictionary can compile a single JSON source of truth into CSS variables, Swift constants, Android resources, and more.</p><p>Tokens aren\'t just a developer convenience — they\'re the shared vocabulary that keeps designers and engineers in sync.</p>',
      excerpt: 'Design tokens are the atomic values behind every great design system. Here\'s why they matter and how to implement them.',
      author: author._id,
      category: 'Design',
      tags: ['design', 'css', 'design-systems'],
      status: 'published', views: 218,
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
    },
    {
      title: 'MongoDB Aggregation Pipelines Demystified',
      content: '<h2>Beyond simple queries</h2><p>Most developers discover MongoDB through its document model and flexible schema. But the aggregation pipeline is where MongoDB truly shines for analytical workloads.</p><p>A pipeline is a sequence of stages. Each stage transforms the stream of documents. The output of one stage feeds the input of the next — much like Unix pipes.</p><h2>Essential stages</h2><p>The workhorse stages are <code>$match</code> (filter), <code>$group</code> (aggregate), <code>$project</code> (reshape), <code>$sort</code>, and <code>$lookup</code> (join). Combining them unlocks reporting, analytics, and data transformation directly in the database layer.</p><blockquote>Move the computation to where the data lives, not the data to where the computation lives.</blockquote><p>For most read-heavy analytics, a well-crafted aggregation pipeline with proper indexes will outperform any application-level processing.</p>',
      excerpt: 'A practical guide to MongoDB\'s aggregation pipeline — the feature that transforms MongoDB from a simple document store into a powerful analytics engine.',
      author: author._id,
      category: 'Technology',
      tags: ['mongodb', 'database', 'backend'],
      status: 'published', views: 189,
    },
    {
      title: 'The Case for Slower Mornings',
      content: '<h2>Against the optimised morning</h2><p>Somewhere between productivity Twitter and self-help bestsellers, the morning became a battleground. Wake at 5am. Cold shower. Meditate. Journal. Exercise. Read. All before 7am.</p><p>There\'s a certain violence to this. The day hasn\'t begun and you\'re already optimising, measuring, competing — with yourself, with some imagined high-performer.</p><p>What if the morning were simply allowed to be slow? Coffee before the phone. A window, not a screen. Thought that wanders rather than thought that produces.</p><blockquote>Not every hour needs to be an investment in something.</blockquote><p>The slow morning isn\'t laziness. It\'s a refusal to begin the day already in debt to productivity culture. It\'s a small, daily act of sovereignty over your own attention.</p>',
      excerpt: 'In an era of 5am routines and optimised mornings, there\'s a quiet case to be made for letting the first hours of the day simply be.',
      author: author._id,
      category: 'Culture',
      tags: ['productivity', 'mindfulness', 'culture'],
      status: 'published', views: 501,
      coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    },
    {
      title: 'Building REST APIs with Express and MongoDB',
      content: '<h2>The MERN stack backbone</h2><p>Express.js remains the most popular choice for building REST APIs in the Node.js ecosystem — and for good reason. Its minimalist, unopinionated design lets you structure applications exactly as your project demands.</p><p>Paired with Mongoose as an ODM for MongoDB, you get a powerful combination: expressive schema definitions, built-in validation, middleware hooks, and a clean query API.</p><h2>Key patterns</h2><p>Separate your concerns: routes define the URL shape, controllers contain the business logic, models define the data structure, and middleware handles cross-cutting concerns like authentication and error handling.</p><p>Always validate input, handle errors consistently, and use async/await with try-catch throughout your controllers. A centralised error handler middleware keeps error responses uniform across your entire API.</p>',
      excerpt: 'A practical walkthrough of building clean, maintainable REST APIs with Express.js and MongoDB using best practices.',
      author: admin._id,
      category: 'Technology',
      tags: ['express', 'mongodb', 'api', 'nodejs'],
      status: 'published', views: 276,
    },
    {
      title: 'Why Every Developer Should Learn Some Design',
      content: '<h2>The full-stack gap</h2><p>We talk a lot about full-stack development — the ability to work across frontend and backend. But there\'s a different kind of fullness that gets less attention: the gap between engineering and design.</p><p>A developer who understands visual hierarchy, spacing, and typography doesn\'t just write better UI code — they ask better questions, spot problems earlier, and collaborate more fluidly with designers.</p><p>You don\'t need to become a designer. But understanding why a button\'s padding matters, why line-height affects readability, why contrast isn\'t just about accessibility — these make you a fundamentally better engineer.</p><blockquote>The best engineers I\'ve worked with all had strong design intuition, even if they\'d never taken a design course.</blockquote>',
      excerpt: 'You don\'t need to become a designer — but understanding design fundamentals will make you a dramatically better developer.',
      author: author._id,
      category: 'Design',
      tags: ['design', 'career', 'frontend'],
      status: 'published', views: 143,
    },
  ];

  for (const postData of posts) {
    await Post.create(postData);
  }

  console.log('✅ Seed complete!');
  console.log('   Admin:    admin@inkwell.com  / admin123');
  console.log('   Author:   author@inkwell.com / demo123');
  console.log('   Reader:   reader@inkwell.com / demo123');
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
