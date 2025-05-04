const pool = require('../config/db');

exports.addHealthData = async (healthData) => {
  const { userId, height, weight, bloodSugar, bloodPressure,
    cholesterol, heartRate, vision, sleepDuration, sleepQuality } = healthData;

  const [result] = await pool.query(
    `INSERT INTO health_records 
         (user_id, height, weight, blood_sugar, blood_pressure, 
          cholesterol, heart_rate, vision, sleep_duration, sleep_quality)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, height, weight, bloodSugar, bloodPressure,
      cholesterol, heartRate, vision, sleepDuration, sleepQuality]
  );

  return { recordId: result.insertId };
};

exports.getHealthData = async (userId) => {
  const [records] = await pool.query(
    'SELECT * FROM health_records WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return records;
};