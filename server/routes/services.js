const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');
const authMiddleware = require('../middlewares/auth');

// 获取所有服务
router.get('/', authMiddleware, async (req, res) => {
  try {
    const services = await servicesController.getServices();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 获取特定类型的服务
router.get('/:type', authMiddleware, async (req, res) => {
  try {
    const services = await servicesController.getServicesByType(req.params.type);
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;