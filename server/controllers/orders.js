const pool = require('../config/db');

exports.createOrder = async (orderData) => {
  try {
    const {
      userId,
      service_type,
      service_content,
      quantity,
      address,
      staff,
      status
    } = orderData;

    // 添加输入验证
    if (!service_type || !service_content || !quantity || !address || !staff) {
      throw new Error('缺少必要的订单信息');
    }

    const [result] = await pool.query(
      `INSERT INTO orders 
       (user_id, service_type, service_content, quantity, address, staff, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, service_type, service_content, quantity, address, staff, status]
    );

    return { orderId: result.insertId };
  } catch (error) {
    console.error('创建订单错误:', error);
    throw error;
  }
};

exports.getUserOrders = async (userId) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return orders;
  } catch (error) {
    console.error('获取用户订单错误:', error);
    throw error;
  }
};

exports.deleteOrder = async (orderId, userId) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('订单不存在或无权删除');
    }
  } catch (error) {
    console.error('删除订单错误:', error);
    throw error;
  }
};