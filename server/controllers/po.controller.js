// server/controllers/po.controller.js
const db = require('../config/db');

exports.getPos = async (req, res) => {
  const id = req.params.id || req.query.id;
  try {
    if (id) {
      const [rows] = await db.query(
        'SELECT p.*, u.name as creator_name FROM purchase_orders p LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?',
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'PO tidak ditemukan.' });
      const po = rows[0];
      if (po.items && typeof po.items === 'string') po.items = JSON.parse(po.items);
      return res.json(po);
    }
    let where = [];
    let params = [];
    if (req.query.rab_id) { where.push('p.rab_id = ?'); params.push(req.query.rab_id); }
    if (req.query.date_from) { where.push('p.date >= ?'); params.push(req.query.date_from); }
    if (req.query.date_to) { where.push('p.date <= ?'); params.push(req.query.date_to); }
    if (req.query.month) { where.push('MONTH(p.date) = ?'); params.push(req.query.month); }
    if (req.query.year) { where.push('YEAR(p.date) = ?'); params.push(req.query.year); }
    if (req.query.status) { where.push('p.status = ?'); params.push(req.query.status); }
    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const [rows] = await db.query(
      `SELECT p.*, u.name as creator_name FROM purchase_orders p LEFT JOIN users u ON p.created_by = u.id ${whereClause} ORDER BY p.id DESC`,
      params
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil PO: ' + err.message });
  }
};

exports.createPo = async (req, res) => {
  const {
    po_number, to_supplier, date, phone, attn, rab_id,
    items, projects, material_ref, total, ppn, grand_total,
    in_words, note, deliver_by, deliver_to,
    ordered_by, purchasing, prepared_by, approved_by, term_of_payment, status
  } = req.body;

  if (!po_number) return res.status(400).json({ error: 'Nomor PO wajib diisi.' });

  try {
    await db.query(
      `INSERT INTO purchase_orders
        (po_number, to_supplier, date, phone, attn, rab_id, items, projects, material_ref,
         total, ppn, grand_total, in_words, note, deliver_by, deliver_to,
         ordered_by, purchasing, prepared_by, approved_by, term_of_payment, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        po_number, to_supplier || null, date || new Date(), phone || null, attn || null,
        rab_id || null, JSON.stringify(items || []), projects || null, material_ref || null,
        total || 0, ppn || 0, grand_total || 0, in_words || null, note || null,
        deliver_by || null, deliver_to || null,
        ordered_by || null, purchasing || null, prepared_by || null,
        approved_by || 'Anriko K, ST.', term_of_payment || 'Anriko K, ST.',
        status || 'draft',
        req.user ? req.user.id : null
      ]
    );
    return res.json({ success: true, message: 'PO berhasil disimpan.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan PO: ' + err.message });
  }
};

exports.updatePo = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'ID PO wajib diisi.' });
  const {
    po_number, to_supplier, date, phone, attn, rab_id,
    items, projects, material_ref, total, ppn, grand_total,
    in_words, note, deliver_by, deliver_to,
    ordered_by, purchasing, prepared_by, approved_by, term_of_payment, status
  } = req.body;
  if (!po_number) return res.status(400).json({ error: 'Nomor PO wajib diisi.' });
  try {
    await db.query(
      `UPDATE purchase_orders SET
        po_number=?, to_supplier=?, date=?, phone=?, attn=?, rab_id=?, items=?, projects=?,
        material_ref=?, total=?, ppn=?, grand_total=?, in_words=?, note=?,
        deliver_by=?, deliver_to=?, ordered_by=?, purchasing=?, prepared_by=?,
        approved_by=?, term_of_payment=?, status=?
       WHERE id=?`,
      [
        po_number, to_supplier || null, date || null, phone || null, attn || null,
        rab_id || null, JSON.stringify(items || []), projects || null, material_ref || null,
        total || 0, ppn || 0, grand_total || 0, in_words || null, note || null,
        deliver_by || null, deliver_to || null, ordered_by || null, purchasing || null,
        prepared_by || null, approved_by || 'Anriko K, ST.', term_of_payment || 'Anriko K, ST.',
        status || 'draft', id
      ]
    );
    return res.json({ success: true, message: 'PO berhasil diupdate.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengupdate PO: ' + err.message });
  }
};

exports.deletePo = async (req, res) => {
  const id = req.params.id || req.query.id || req.body.id;
  if (!id) return res.status(400).json({ error: 'ID PO wajib diisi.' });
  try {
    await db.query('DELETE FROM purchase_orders WHERE id = ?', [id]);
    return res.json({ success: true, message: 'PO berhasil dihapus.' });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menghapus PO: ' + err.message });
  }
};
