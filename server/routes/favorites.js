const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites');
const authMiddleware = require('../middlewares/auth');

// 添加收藏
router.post('/', authMiddleware, async (req, res) => {
  try {
    const favorite = await favoritesController.addFavorite({
      userId: req.userId,
      ...req.body
    });
    res.json({ success: true, data: favorite });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// 获取用户收藏
router.get('/', authMiddleware, async (req, res) => {
  try {
    const favorites = await favoritesController.getUserFavorites(req.userId);
    res.json({
      success: true,
      data: favorites || [] // 确保返回数组
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// 按类型获取用户收藏
router.get('/:type', authMiddleware, async (req, res) => {
  try {
    const favorites = await favoritesController.getUserFavoritesByType(
      req.userId,
      req.params.type
    );
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 获取单个收藏详情
router.get('/detail/:id', authMiddleware, async (req, res) => {
  try {
    const favorite = await favoritesController.getFavoriteById(req.params.id, req.userId);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: '收藏不存在'
      });
    }

    res.json({
      success: true,
      data: favorite
    });
  } catch (error) {
    console.error('获取收藏详情错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await favoritesController.updateFavorite(
      req.params.id,
      req.userId,
      req.body
    );
    res.json({ success: true, message: '收藏更新成功' });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/check', authMiddleware, async (req, res) => {
  try {
    const result = await favoritesController.checkFavorite(
      req.userId,
      req.body.service_content,
      req.body.staff
    );
    res.json({ success: true, exists: result.exists });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// 删除收藏
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await favoritesController.deleteFavorite(req.params.id, req.userId);
    res.json({ success: true, message: '收藏删除成功' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;