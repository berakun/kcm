// server/controllers/financial.controller.js — dynamic from RAB + PO + Rembes + Ongkos Tukang
const db = require('../config/db');

exports.getReport = async (req, res) => {
  try {
    // 1. Revenue = SUM RAB total_budget (non-draft)
    const [rev] = await db.query("SELECT COALESCE(SUM(total_budget), 0) as total FROM rab WHERE status != 'draft'");
    const totalRevenue = parseFloat(rev[0].total) || 0;

    // 2. Expenses = PO Belanja + Rembes + Ongkos Tukang (cashbon excluded — cash flow, bukan cost)
    const [poTotal] = await db.query("SELECT COALESCE(SUM(grand_total), 0) as total FROM purchase_orders WHERE status IN ('approved', 'paid', 'completed')");
    const poSum = parseFloat(poTotal[0].total) || 0;

    const [rembesTotal] = await db.query("SELECT COALESCE(SUM(actual_amount), 0) as total FROM rembes");
    const rembesSum = parseFloat(rembesTotal[0].total) || 0;

    const [ongkosTotal] = await db.query("SELECT COALESCE(SUM(amount), 0) as total FROM ongkos_tukang");
    const ongkosSum = parseFloat(ongkosTotal[0].total) || 0;

    const totalExpenses = poSum + rembesSum + ongkosSum;
    const totalProfit = totalRevenue - totalExpenses;
    const utilizationRate = totalRevenue > 0 ? (totalExpenses / totalRevenue * 100) : 0;

    // 3. Chart bulanan: revenue dari RAB, expenses dari PO + Rembes
    const [monthlyRevenue] = await db.query(`
      SELECT DATE_FORMAT(date_created, '%Y-%m') as period,
             COALESCE(SUM(total_budget), 0) as revenue
      FROM rab WHERE status != 'draft'
      GROUP BY period ORDER BY period ASC
    `);

    const [monthlyPO] = await db.query(`
      SELECT DATE_FORMAT(date, '%Y-%m') as period,
             COALESCE(SUM(grand_total), 0) as expenses
      FROM purchase_orders WHERE status IN ('approved', 'paid', 'completed')
      GROUP BY period ORDER BY period ASC
    `);

    const [monthlyRembes] = await db.query(`
      SELECT DATE_FORMAT(date, '%Y-%m') as period,
             COALESCE(SUM(actual_amount), 0) as expenses
      FROM rembes
      GROUP BY period ORDER BY period ASC
    `);

    const periodMap = {};
    monthlyRevenue.forEach(r => {
      periodMap[r.period] = { period: r.period, revenue: r.revenue, expenses: 0 };
    });
    monthlyPO.forEach(p => {
      if (!periodMap[p.period]) periodMap[p.period] = { period: p.period, revenue: 0, expenses: 0 };
      periodMap[p.period].expenses += p.expenses;
    });
    monthlyRembes.forEach(r => {
      if (!periodMap[r.period]) periodMap[r.period] = { period: r.period, revenue: 0, expenses: 0 };
      periodMap[r.period].expenses += r.expenses;
    });
    const chartData = Object.values(periodMap).sort((a, b) => a.period.localeCompare(b.period));

    // 4. Leakages = rembes actual > rab_amount
    const [leakages] = await db.query(`
      SELECT r.project_name, rem.description, rem.rab_amount, rem.actual_amount, rem.difference, rem.date 
      FROM rembes rem 
      JOIN rab r ON rem.rab_id = r.id 
      WHERE rem.actual_amount > rem.rab_amount 
      ORDER BY rem.date DESC
    `);

    // 5. Project comparisons = RAB vs actual (PO + rembes linked to RAB)
    const [projectComparisons] = await db.query(`
      SELECT r.id, r.project_name, r.total_budget, 
             (
               COALESCE((SELECT SUM(rem.actual_amount) FROM rembes rem WHERE rem.rab_id = r.id), 0) +
               COALESCE((SELECT SUM(po.grand_total) FROM purchase_orders po WHERE po.rab_id = r.id AND po.status IN ('approved','paid','completed')), 0)
             ) as total_actual 
      FROM rab r 
      ORDER BY r.id DESC 
      LIMIT 10
    `);

    return res.json({
      summary: {
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        total_profit: totalProfit,
        utilization_rate: utilizationRate,
        breakdown: { po: poSum, rembes: rembesSum, ongkos: ongkosSum }
      },
      chart_data: chartData,
      leakages,
      project_comparisons: projectComparisons
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal memuat laporan keuangan: ' + err.message });
  }
};
