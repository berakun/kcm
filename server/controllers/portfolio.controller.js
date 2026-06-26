// server/controllers/portfolio.controller.js
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getPortfolios = async (req, res) => {
  const id = req.query.id;
  const category = req.query.category;
  const status = req.query.status;

  let query = 'SELECT * FROM portfolio WHERE 1=1';
  const params = [];

  if (id) {
    query += ' AND id = ?';
    params.push(id);
  } else {
    if (category && category !== 'all' && category !== 'Semua') {
      query += ' AND category = ?';
      params.push(category.toLowerCase());
    }
    // Only admins can see drafts, default public gets published
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    } else if (!req.user || !['admin', 'super_admin'].includes(req.user.role)) {
      query += " AND status = 'published'";
    }
    query += ' ORDER BY id DESC';
  }

  try {
    const [rows] = await db.query(query, params);
    
    if (id) {
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Portfolio tidak ditemukan.' });
      }
      const item = rows[0];
      item.images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images || [];
      return res.json(item);
    } else {
      const items = rows.map(r => {
        r.images = typeof r.images === 'string' ? JSON.parse(r.images) : r.images || [];
        return r;
      });
      return res.json(items);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil portfolio: ' + err.message });
  }
};

exports.createPortfolio = async (req, res) => {
  const { title, category, description, client_name, location, year, status } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Judul dan kategori wajib diisi.' });
  }

  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push('assets/images/portfolio/' + file.filename);
      });
    }

    if (images.length === 0) {
      images.push('assets/images/placeholder.jpg');
    }

    const [result] = await db.query(
      'INSERT INTO portfolio (title, category, description, client_name, location, year, images, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category.toLowerCase(), description || null, client_name || null, location || null, year || null, JSON.stringify(images), status || 'draft']
    );

    return res.json({
      success: true,
      message: 'Portfolio berhasil dibuat.',
      id: result.insertId
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal membuat portfolio: ' + err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  const { id, title, category, description, client_name, location, year, status, replace_images } = req.body;

  if (!id || !title || !category) {
    return res.status(400).json({ error: 'ID, judul, dan kategori wajib diisi.' });
  }

  try {
    const [existing] = await db.query('SELECT images FROM portfolio WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Portfolio tidak ditemukan.' });
    }

    let images = [];
    if (replace_images !== 'true') {
      images = typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images || [];
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push('assets/images/portfolio/' + file.filename);
      });
    }

    // Handle individual image deletion
    if (req.body.deleted_images) {
      const deletedPaths = req.body.deleted_images.split(',').filter(Boolean);
      images = images.filter(img => !deletedPaths.includes(img));
      deletedPaths.forEach(img => {
        if (img !== 'assets/images/placeholder.jpg') {
          const filePath = path.join(__dirname, '../../client/', img);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch(e) {}
          }
        }
      });
    }

    if (images.length === 0) {
      images.push('assets/images/placeholder.jpg');
    }

    await db.query(
      'UPDATE portfolio SET title = ?, category = ?, description = ?, client_name = ?, location = ?, year = ?, images = ?, status = ? WHERE id = ?',
      [title, category.toLowerCase(), description || null, client_name || null, location || null, year || null, JSON.stringify(images), status, id]
    );

    return res.json({
      success: true,
      message: 'Portfolio berhasil diperbarui.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memperbarui portfolio: ' + err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  const id = req.query.id || req.body.id;

  if (!id) {
    return res.status(400).json({ error: 'ID Portfolio wajib diisi.' });
  }

  try {
    const [existing] = await db.query('SELECT images FROM portfolio WHERE id = ?', [id]);
    if (existing.length > 0) {
      const images = typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images || [];
      // Clean files
      images.forEach(img => {
        if (img !== 'assets/images/placeholder.jpg') {
          const filePath = path.join(__dirname, '../../client/', img);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
        }
      });
    }

    await db.query('DELETE FROM portfolio WHERE id = ?', [id]);
    return res.json({
      success: true,
      message: 'Portfolio berhasil dihapus.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus portfolio: ' + err.message });
  }
};
