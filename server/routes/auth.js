const express = require('express');
const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// 注册路由
router.post('/register', async (req, res, next) => {
  try {
    // 验证请求体
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: '无效的请求数据'
      });
    }

    const result = await authController.register(req.body);
    res.status(201).json(result);

  } catch (error) {
    console.error('注册路由错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '服务器注册错误'
    });
  }
});

// 登录路由
router.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: '手机号和密码不能为空'
      });
    }

    const result = await authController.login(phone, password);

    res.json({
      success: true,
      token: result.token,
      user: result.user
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(401).json({
      success: false,
      message: error.message || '登录失败'
    });
  }
});


//发送验证码路由
router.post('/send-code', async (req, res, next) => {
  try {
    const { phone } = req.body;

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: '手机号格式不正确' });
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`手机号 ${phone} 的验证码是: ${code}`);


    // 这里简单返回成功
    res.json({
      success: true,
      message: '验证码已发送',
      code: code
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '验证码发送失败'
    });
  }
});

// 获取用户信息路由
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (!users.length) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const user = users[0];
    res.json({
      id: user.id,
      userName: user.userName || user.phone, // 确保有用户名
      phone: user.phone,
      fullName: user.fullName,
      gender: user.gender,
      age: user.age,
      hobbies: user.hobbies
      // 不要返回密码
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// 更新用户信息路由

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { userName, phone, password, fullName, gender, age, hobbies } = req.body;

    // 确保至少有一个字段要更新
    if (!userName && !phone && !password && !fullName && !gender && !age && !hobbies) {
      return res.status(400).json({ message: '没有提供更新数据' });
    }

    let updateQuery = 'UPDATE users SET ';
    const updateParams = [];
    let updates = [];

    if (userName) {
      updates.push('userName = ?');
      updateParams.push(userName);
    }
    if (phone) {
      updates.push('phone = ?');
      updateParams.push(phone);
    }
    if (fullName) {
      updates.push('fullName = ?');
      updateParams.push(fullName);
    }
    if (gender) {
      updates.push('gender = ?');
      updateParams.push(gender);
    }
    if (age) {
      updates.push('age = ?');
      updateParams.push(age);
    }
    if (hobbies) {
      updates.push('hobbies = ?');
      updateParams.push(hobbies);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      updateParams.push(hashedPassword);
    }

    updateQuery += updates.join(', ');
    updateQuery += ' WHERE id = ?';
    updateParams.push(req.userId);

    await pool.query(updateQuery, updateParams);

    // 返回更新后的用户信息
    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    const { password: _, ...userData } = updatedUser[0];
    res.json({
      success: true,
      message: '用户信息更新成功',
      user: userData
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '更新用户信息失败'
    });
  }
});


// 注销账号路由
router.delete('/profile', authMiddleware, async (req, res) => {
  let connection
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    // 先验证用户是否存在
    const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    // 删除所有关联数据
    await connection.query('DELETE FROM favorites WHERE id = ?', [req.userId]);
    await connection.query('DELETE FROM orders WHERE user_id = ?', [req.userId]);
    await connection.query('DELETE FROM health_records WHERE user_id = ?', [req.userId]);
    await connection.query('DELETE FROM services WHERE id = ?', [req.userId]);
    // 删除用户
    await connection.query('DELETE FROM users WHERE id = ?', [req.userId]);
    await connection.commit();
    res.json({
      success: true,
      message: '账号已成功注销'
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('注销账号错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '注销账号失败'
    });
  } finally {
    if (connection) connection.release();
  }
});


router.post('/logout', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: '已退出登录' });
  } catch (error) {
    res.status(500).json({ message: '退出登录失败' });
  }
});


router.options('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.status(200).send()
})

module.exports = router;