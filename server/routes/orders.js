const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const authMiddleware = require('../middlewares/auth');

// 创建订单
router.post('/', authMiddleware, async (req, res) => {
  try {
    const order = await ordersController.createOrder({
      userId: req.userId,
      ...req.body
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// 获取用户订单
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await ordersController.getUserOrders(req.userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 删除订单
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await ordersController.deleteOrder(req.params.id, req.userId);
    res.json({ success: true, message: '订单删除成功' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;