const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('接收到的Token:', token); // 调试

  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('解码后的用户:', decoded); // 调试
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token验证失败:', error.message); // 调试
    res.status(401).json({ message: '无效的认证令牌' });
  }
};