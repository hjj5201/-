const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (userData) => {
  try {
    console.log('接收到的注册数据:', userData); // 调试日志

    // 解构并验证数据
    const { userName, phone, password } = userData;

    if (!userName || !phone || !password) {
      throw new Error('用户名、手机号和密码不能为空');
    }

    // 确保密码是字符串
    if (typeof password !== 'string') {
      throw new Error('密码格式不正确');
    }
    if (password.length < 6) {
      throw new Error('密码长度不能少于6位');
    }

    // 检查用户是否存在
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existing.length > 0) {
      throw new Error('手机号已注册');
    }

    // 哈希密码 
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');


    // 插入新用户到数据库
    const [result] = await pool.query(
      'INSERT INTO users (userName, phone, password) VALUES (?, ?, ?)',
      [userName, phone, hashedPassword]
    )

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      success: true,
      user: {
        id: result.insertId,
        userName: userName,
        phone: phone
      },
      token: token
    };

  } catch (error) {
    console.error('注册过程中出错:', error.stack);
    throw error; // 向上抛出错误
  }
};



exports.login = async (phone, password) => {
  // 输入验证
  if (!phone || !password) {
    throw new Error('请提供手机号和密码');
  }

  // 查询用户
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE phone = ? LIMIT 1',
    [phone]
  );

  if (rows.length === 0) {
    throw new Error('用户不存在');
  }

  const user = rows[0];

  // 验证密码
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('密码错误');
  }

  // 移除密码字段
  const { password: _, ...userData } = user;

  // 生成JWT token - 修复变量名错误
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // token有效期1小时
  );

  // 返回用户数据和token - 使用正确的token变量
  return {
    token: token,
    user: {
      id: user.id,
      userName: user.userName,
      phone: user.phone
    }
  };
};