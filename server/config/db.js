const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'elderly_app',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'e_care',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 添加连接测试
pool.getConnection()
  .then(conn => {
    console.log('数据库连接成功');
    conn.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err.message);
  });

module.exports = pool;