// server/controllers/menuAccess.controller.js
const db = require('../config/db');

// GET /api/menu-access — returns { "role:menu_id": true/false }
exports.getMenuAccess = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT menu_id, role, enabled FROM menu_access');
    const map = {}
    for (const r of rows) {
      map[`${r.role}:${r.menu_id}`] = !!r.enabled
    }
    res.json(map)
  } catch (err) {
    console.error('getMenuAccess error:', err)
    res.status(500).json({ error: 'Gagal memuat akses menu.' })
  }
}

// PUT /api/menu-access — body: { menu_id, role, enabled }
exports.updateMenuAccess = async (req, res) => {
  try {
    const { menu_id, role, enabled } = req.body
    if (!menu_id || !role) return res.status(400).json({ error: 'menu_id dan role wajib.' })

    await db.query(
      'INSERT INTO menu_access (menu_id, role, enabled) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE enabled = ?',
      [menu_id, role, enabled ? 1 : 0, enabled ? 1 : 0]
    )
    res.json({ message: 'Akses menu diperbarui.' })
  } catch (err) {
    console.error('updateMenuAccess error:', err)
    res.status(500).json({ error: 'Gagal update akses menu.' })
  }
}

// PUT /api/menu-access/bulk — body: { overrides: [{ menu_id, role, enabled }] }
exports.bulkUpdateMenuAccess = async (req, res) => {
  try {
    const { overrides } = req.body
    if (!Array.isArray(overrides)) return res.status(400).json({ error: 'overrides wajib array.' })

    for (const item of overrides) {
      const { menu_id, role, enabled } = item
      if (!menu_id || !role) continue
      await db.query(
        'INSERT INTO menu_access (menu_id, role, enabled) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE enabled = ?',
        [menu_id, role, enabled ? 1 : 0, enabled ? 1 : 0]
      )
    }
    res.json({ message: 'Akses menu diperbarui.' })
  } catch (err) {
    console.error('bulkUpdateMenuAccess error:', err)
    res.status(500).json({ error: 'Gagal update akses menu.' })
  }
}
