const express = require('express');
const router = express.Router({ mergeParams: true });
const pool = require('../config/db');
const authMiddleware = require('../middlewares/auth');

//调试
router.use((req, res, next) => {
  console.log(`Medications route accessed: ${req.method} ${req.path}`);
  next();
});


// 获取单个药品详情
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const medicationId = req.params.id;

    // 验证用户是否拥有该药品
    const [owned] = await pool.query(
      'SELECT id FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, req.userId]
    );
    if (!owned.length) {
      return res.status(404).json({ message: '药品不存在或无权访问' });
    }

    // 获取药品详情
    const [medication] = await pool.query(
      'SELECT m.*, mr.reminder_type, mr.advance_minutes FROM medications m LEFT JOIN medication_reminders mr ON m.id = mr.medication_id WHERE m.id = ?',
      [medicationId]
    );

    if (!medication.length) {
      return res.status(404).json({ message: '药品未找到' });
    }

    res.json(medication[0]);
  } catch (error) {
    console.error('获取药品详情错误:', error);
    res.status(500).json({ message: '获取药品详情失败' });
  }
});



// 获取用户所有药品
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [medications] = await pool.query(
      'SELECT * FROM medications WHERE user_id = ?',
      [req.userId]
    );
    res.json(medications);
  } catch (error) {
    console.error('获取药品列表错误:', error);
    res.status(500).json({ message: '获取药品列表失败' });
  }
});

// 添加新药品
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name, image_url, purpose, dosage, frequency, times, method,
      start_date, end_date, notes, reminder_type, advance_minutes
    } = req.body;

    // 验证必要字段
    if (!name || !dosage || !frequency || !times || !method || !start_date) {
      return res.status(400).json({ message: '缺少必要字段' });
    }

    // 开始事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 插入药品信息
      const [result] = await connection.query(
        `INSERT INTO medications 
        (user_id, name, image_url, purpose, dosage, frequency, times, method, start_date, end_date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.userId, name, image_url, purpose, dosage, frequency, times, method, start_date, end_date, notes]
      );

      // 插入提醒设置
      if (reminder_type) {
        await connection.query(
          `INSERT INTO medication_reminders 
          (medication_id, reminder_type, advance_minutes)
          VALUES (?, ?, ?)`,
          [result.insertId, reminder_type, advance_minutes || 5]
        );
      }

      await connection.commit();

      // 获取完整的药品信息返回
      const [newMedication] = await pool.query(
        'SELECT m.*, mr.reminder_type, mr.advance_minutes FROM medications m LEFT JOIN medication_reminders mr ON m.id = mr.medication_id WHERE m.id = ?',
        [result.insertId]
      );

      res.status(201).json(newMedication[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('添加药品错误:', error);
    res.status(500).json({ message: '添加药品失败' });
  }
});

// 更新药品信息
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const medicationId = req.params.id;
    const {
      name, image_url, purpose, dosage, frequency, times, method,
      start_date, end_date, notes, reminder_type, advance_minutes
    } = req.body;

    // 验证用户是否拥有该药品
    const [owned] = await pool.query(
      'SELECT id FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, req.userId]
    );
    if (!owned.length) {
      return res.status(404).json({ message: '药品不存在或无权访问' });
    }

    // 开始事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 更新药品信息
      await connection.query(
        `UPDATE medications SET 
        name = ?, image_url = ?, purpose = ?, dosage = ?, frequency = ?, 
        times = ?, method = ?, start_date = ?, end_date = ?, notes = ?
        WHERE id = ?`,
        [name, image_url, purpose, dosage, frequency, times, method,
          start_date, end_date, notes, medicationId]
      );

      // 更新或创建提醒设置
      if (reminder_type) {
        const [existing] = await connection.query(
          'SELECT id FROM medication_reminders WHERE medication_id = ?',
          [medicationId]
        );

        if (existing.length) {
          await connection.query(
            `UPDATE medication_reminders SET 
            reminder_type = ?, advance_minutes = ?
            WHERE medication_id = ?`,
            [reminder_type, advance_minutes || 5, medicationId]
          );
        } else {
          await connection.query(
            `INSERT INTO medication_reminders 
            (medication_id, reminder_type, advance_minutes)
            VALUES (?, ?, ?)`,
            [medicationId, reminder_type, advance_minutes || 5]
          );
        }
      }

      await connection.commit();

      // 获取更新后的药品信息返回
      const [updatedMedication] = await pool.query(
        'SELECT m.*, mr.reminder_type, mr.advance_minutes FROM medications m LEFT JOIN medication_reminders mr ON m.id = mr.medication_id WHERE m.id = ?',
        [medicationId]
      );

      res.json(updatedMedication[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('更新药品错误:', error);
    res.status(500).json({ message: '更新药品失败' });
  }
});

// 删除药品
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const medicationId = req.params.id;

    // 验证用户是否拥有该药品
    const [owned] = await pool.query(
      'SELECT id FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, req.userId]
    );
    if (!owned.length) {
      return res.status(404).json({ message: '药品不存在或无权访问' });
    }

    // 删除药品(外键约束会自动删除关联的提醒和记录)
    await pool.query('DELETE FROM medications WHERE id = ?', [medicationId]);

    res.json({ message: '药品删除成功' });
  } catch (error) {
    console.error('删除药品错误:', error);
    res.status(500).json({ message: '删除药品失败' });
  }
});

// 获取药品的用药记录
router.get('/:id/logs', authMiddleware, async (req, res) => {
  try {
    const medicationId = req.params.id;

    // 验证用户是否拥有该药品
    const [owned] = await pool.query(
      'SELECT id FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, req.userId]
    );
    if (!owned.length) {
      return res.status(404).json({ message: '药品不存在或无权访问' });
    }

    const [logs] = await pool.query(
      'SELECT * FROM medication_logs WHERE medication_id = ? ORDER BY scheduled_time DESC',
      [medicationId]
    );

    res.json(logs);
  } catch (error) {
    console.error('获取用药记录错误:', error);
    res.status(500).json({ message: '获取用药记录失败' });
  }
});

// 记录用药情况
router.post('/:id/logs', authMiddleware, async (req, res) => {
  try {
    const medicationId = req.params.id;
    const { scheduled_time, status, notes } = req.body;

    // 验证用户是否拥有该药品
    const [owned] = await pool.query(
      'SELECT id FROM medications WHERE id = ? AND user_id = ?',
      [medicationId, req.userId]
    );
    if (!owned.length) {
      return res.status(404).json({ message: '药品不存在或无权访问' });
    }

    // 验证必要字段
    if (!scheduled_time || !status) {
      return res.status(400).json({ message: '缺少必要字段' });
    }

    // 确保scheduled_time是有效的日期格式
    let scheduledTime = new Date(scheduled_time);
    if (isNaN(scheduledTime.getTime())) {
      return res.status(400).json({ message: '无效的时间格式' });
    }

    const [result] = await pool.query(
      `INSERT INTO medication_logs 
      (medication_id, scheduled_time, actual_time, status, notes)
      VALUES (?, ?, ?, ?, ?)`,
      [
        medicationId,
        scheduled_time,
        status === '已服' ? new Date() : null,
        status,
        notes || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: '用药记录添加成功'
    });
  } catch (error) {
    console.error('记录用药情况错误:', error);
    res.status(500).json({
      message: '记录用药情况失败',
      error: error.message // 返回具体错误信息
    });
  }
});


// 获取待提醒药品
router.get('/upcoming', authMiddleware, async (req, res) => {
  console.log('✅ 到达/upcoming路由');
  console.log('用户ID:', req.userId);
  try {
    const now = new Date();
    console.log('Current time:', now);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    console.log('Executing SQL query with params:', [req.userId, todayStart, todayEnd]);

    const [medications] = await pool.query(
      `SELECT m.id, m.name, m.dosage, m.method, m.times, 
          mr.reminder_type, mr.advance_minutes
      FROM medications m
      LEFT JOIN medication_reminders mr ON m.id = mr.medication_id
      WHERE m.user_id = ? 
      AND (m.end_date IS NULL OR m.end_date >= ?)
      AND m.start_date <= ?`,
      [req.userId, todayStart, todayEnd]
    );
    console.log('Found medications:', medications);

    if (!medications || medications.length === 0) {
      console.log('No medications found for user');
      return res.json([]); // 返回空数组而不是404
    }

    const upcomingReminders = [];

    medications.forEach(med => {
      try {

        const times = med.times.split(/[,，\s]+/).map(t => t.trim()).filter(t => t);
        console.log('Parsed times:', times);

        times.forEach(time => {

          const normalizedTime = time
            .replace(/：/g, ':')
            .replace(/\./g, ':')
            .replace(/\s/g, '');

          const [hoursStr, minutesStr] = normalizedTime.split(':');
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr || '0', 10);

          if (isNaN(hours) || isNaN(minutes)) {
            console.error(`Invalid time format: ${time}`);
            return;
          }

          if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.error(`Invalid time value: ${time}`);
            return;
          }

          const reminderTime = new Date(
            now.getFullYear(), now.getMonth(), now.getDate(),
            hours, minutes, 0, 0
          );

          const advanceMs = (med.advance_minutes || 5) * 60 * 1000;
          const reminderWithAdvance = new Date(reminderTime.getTime() - advanceMs);


          if (reminderWithAdvance > now && reminderWithAdvance < todayEnd) {
            upcomingReminders.push({
              medication_id: med.id,
              name: med.name,
              dosage: med.dosage,
              method: med.method,
              scheduled_time: reminderTime.toISOString(),
              reminder_time: reminderWithAdvance.toISOString(),
              reminder_type: med.reminder_type || '声音'
            });
          }
        });
      } catch (error) {
        console.error('❌ 获取提醒出错:', error);
        res.status(500).json({ message: '获取提醒失败', error: error.message });
      }
    });


    upcomingReminders.sort((a, b) => new Date(a.reminder_time) - new Date(b.reminder_time));

    console.log('Sending upcoming reminders:', upcomingReminders);
    res.json(upcomingReminders);
  } catch (error) {
    console.error('Error getting upcoming reminders:', error);
    res.json([]);
  }
});

module.exports = router;