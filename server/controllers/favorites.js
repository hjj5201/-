const pool = require('../config/db');

exports.addFavorite = async (favoriteData) => {
  try {
    const {
      userId,
      service_type,
      service_content,
      quantity,
      address,
      staff
    } = favoriteData;

    // 验证必填字段
    if (!service_content || !quantity || !address || !staff) {
      throw new Error('缺少必要的收藏信息');
    }

    // 检查是否已收藏
    const [result] = await pool.query(
      `INSERT INTO favorites 
       (user_id, service_type, service_content, quantity, address, staff)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, service_type, service_content, quantity, address, staff]
    );

    return {
      favoriteId: result.insertId,
      service_type,
      service_content,
      quantity,
      address,
      staff
    };
  } catch (error) {
    console.error('添加收藏错误:', error);
    throw error;
  }
};

exports.checkFavorite = async (userId, serviceType, staff) => {
  try {
    const [existing] = await pool.query(
      `SELECT id FROM favorites 
       WHERE user_id = ? AND service_type = ? AND staff = ?`,
      [userId, serviceType, staff]
    );

    return { exists: existing.length > 0 };
  } catch (error) {
    console.error('检查收藏错误:', error);
    throw error;
  }
};

exports.getFavoriteById = async (favoriteId, userId) => {
  try {
    const [favorites] = await pool.query(
      'SELECT * FROM favorites WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    );

    if (!favorites || favorites.length === 0) {
      return null;
    }

    return {
      id: favorites[0].id,
      user_id: favorites[0].user_id,
      service_type: favorites[0].service_type || '',
      service_content: favorites[0].service_content || '',
      quantity: favorites[0].quantity || 1,
      address: favorites[0].address || '',
      staff: favorites[0].staff || '',
      created_at: favorites[0].created_at
    };
  } catch (error) {
    console.error('获取收藏详情错误:', error);
    throw error;
  }
};


exports.getUserFavorites = async (userId) => {
  try {
    const [favorites] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return favorites;
  } catch (error) {
    console.error('获取用户收藏错误:', error);
    throw error;
  }
};

exports.getUserFavoritesByType = async (userId, type) => {
  try {
    const [favorites] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND service_type = ? ORDER BY created_at DESC',
      [userId, type]
    );
    return favorites;
  } catch (error) {
    console.error('按类型获取用户收藏错误:', error);
    throw error;
  }
};


exports.updateFavorite = async (favoriteId, userId, updateData) => {
  try {
    const { service_content, quantity, address, staff } = updateData;

    // 验证必填字段
    if (!service_content || !quantity || !address || !staff) {
      throw new Error('缺少必要的收藏信息');
    }

    const [result] = await pool.query(
      `UPDATE favorites SET 
       service_content = ?, 
       quantity = ?, 
       address = ?, 
       staff = ? 
       WHERE id = ? AND user_id = ?`,
      [service_content, quantity, address, staff, favoriteId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('收藏不存在或无权修改');
    }

    return { success: true };
  } catch (error) {
    console.error('更新收藏错误:', error);
    throw error;
  }
};


exports.deleteFavorite = async (favoriteId, userId) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM favorites WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('收藏不存在或无权删除');
    }
  } catch (error) {
    console.error('删除收藏错误:', error);
    throw error;
  }
};