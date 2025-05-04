const pool = require('../config/db');

exports.getServices = async () => {
  try {
    const [services] = await pool.query('SELECT * FROM services');
    return services;
  } catch (error) {
    console.error('获取服务列表错误:', error);
    throw error;
  }
};

exports.getServicesByType = async (type) => {
  try {
    const [services] = await pool.query(
      'SELECT * FROM services WHERE service_type = ?',
      [type]
    );
    return services;
  } catch (error) {
    console.error('按类型获取服务错误:', error);
    throw error;
  }
};