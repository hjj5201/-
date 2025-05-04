require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const favoriteRoutes = require('./routes/favorites');
const authMiddleware = require('./middlewares/auth');
const app = express();
const medicationRoutes = require('./routes/medications');


// 中间件
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:3001',
      'null'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// 调试
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/health', authMiddleware, healthRoutes);
app.use('/api/services', authMiddleware, serviceRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/favorites', authMiddleware, favoriteRoutes);

app.use('/api/auth/medications', authMiddleware, medicationRoutes);


// 静态页面路由
const pages = [
  { path: '/', file: '1.首页.html' },
  { path: '/register', file: '2.注册页面.html' },
  { path: '/login', file: '3.登录页面.html' },

];

pages.forEach(page => {
  app.get(page.path, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', page.file));
  });
});
// 添加新路由
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

app.post('/api/logout', authMiddleware, (req, res) => {
  res.json({ message: '注销成功' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ?
      err.message : '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`数据库连接: ${process.env.DB_USER}@${process.env.DB_HOST}/${process.env.DB_NAME}`);
});