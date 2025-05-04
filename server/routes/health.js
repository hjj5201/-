const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health');
const authMiddleware = require('../middlewares/auth');

// 提交健康数据
router.post('/', authMiddleware, async (req, res) => {
  try {
    const result = await healthController.addHealthData({
      userId: req.userId,
      ...req.body
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// 获取健康数据
router.get('/', authMiddleware, async (req, res) => {
  try {
    const records = await healthController.getHealthData(req.userId);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;