<?php $currency = $settings['currency_symbol'] ?? '₹'; ?>

<div class="sk-page-header">
  <h5 class="sk-page-title"><i class="bi bi-bar-chart-line me-2 text-warning"></i>Reports</h5>
  <a href="<?= site_url('shopkart/reports/export?from=' . $from . '&to=' . $to) ?>" class="btn btn-sm btn-outline-success">
    <i class="bi bi-download me-1"></i> Export CSV
  </a>
</div>

<!-- Date filter -->
<div class="card sk-table-card shadow-sm mb-4">
  <div class="card-body py-2">
    <form method="GET" class="d-flex gap-2 align-items-center flex-wrap">
      <label class="form-label mb-0">From</label>
      <input type="date" name="from" class="form-control form-control-sm" style="max-width:160px;" value="<?= $from ?>">
      <label class="form-label mb-0">To</label>
      <input type="date" name="to" class="form-control form-control-sm" style="max-width:160px;" value="<?= $to ?>">
      <button class="btn btn-sm btn-warning px-3">Apply</button>
    </form>
  </div>
</div>

<!-- Summary cards -->
<div class="row g-3 mb-4">
  <div class="col-md-3">
    <div class="card sk-stat-card shadow-sm text-center py-3">
      <div class="fs-3 fw-bold text-success"><?= $currency . number_format($revenue,0) ?></div>
      <div class="text-muted small">Total Revenue</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card sk-stat-card shadow-sm text-center py-3">
      <div class="fs-3 fw-bold text-primary"><?= number_format($order_count) ?></div>
      <div class="text-muted small">Total Orders</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card sk-stat-card shadow-sm text-center py-3">
      <div class="fs-3 fw-bold text-warning">
        <?= $order_count > 0 ? $currency . number_format($revenue / $order_count, 0) : $currency.'0' ?>
      </div>
      <div class="text-muted small">Avg. Order Value</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card sk-stat-card shadow-sm text-center py-3">
      <?php
        $delivered = 0;
        foreach ($by_status as $bs) { if ($bs['status']==='delivered') $delivered = $bs['count']; }
      ?>
      <div class="fs-3 fw-bold text-info"><?= number_format($delivered) ?></div>
      <div class="text-muted small">Delivered Orders</div>
    </div>
  </div>
</div>

<!-- Revenue chart + By Status -->
<div class="row g-3 mb-4">
  <div class="col-lg-8">
    <div class="card sk-table-card shadow-sm h-100">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Revenue by Day</div>
      <div class="card-body"><canvas id="reportChart" height="110"></canvas></div>
    </div>
  </div>
  <div class="col-lg-4">
    <div class="card sk-table-card shadow-sm h-100">
      <div class="card-header bg-white border-0 py-3 fw-semibold">Orders by Status</div>
      <div class="card-body"><canvas id="statusChart"></canvas></div>
    </div>
  </div>
</div>

<!-- Top Products -->
<div class="card sk-table-card shadow-sm">
  <div class="card-header bg-white border-0 py-3 fw-semibold">Top Selling Products</div>
  <div class="card-body p-0">
    <table class="table mb-0">
      <thead><tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
      <tbody>
        <?php foreach ($top_products as $i => $tp): ?>
        <tr>
          <td><span class="badge bg-warning text-dark"><?= $i+1 ?></span></td>
          <td><?= htmlspecialchars($tp['product_name']) ?></td>
          <td><?= number_format($tp['qty_sold']) ?></td>
          <td><?= $currency . number_format($tp['revenue'],2) ?></td>
        </tr>
        <?php endforeach; ?>
        <?php if (empty($top_products)): ?>
        <tr><td colspan="4" class="text-center text-muted py-4">No data for this period.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php
$labels = array_column($by_day, 'date');
$revs   = array_column($by_day, 'revenue');
$st_labels = array_column($by_status, 'status');
$st_data   = array_column($by_status, 'count');
?>
<script>
new Chart(document.getElementById('reportChart').getContext('2d'), {
  type: 'bar',
  data: {
    labels: <?= json_encode($labels) ?>,
    datasets: [{ label: 'Revenue', data: <?= json_encode($revs) ?>, backgroundColor: 'rgba(245,158,11,0.7)' }]
  },
  options: { responsive: true, plugins: { legend: { display: false } } }
});
new Chart(document.getElementById('statusChart').getContext('2d'), {
  type: 'doughnut',
  data: {
    labels: <?= json_encode($st_labels) ?>,
    datasets: [{ data: <?= json_encode($st_data) ?>,
      backgroundColor: ['#fbbf24','#3b82f6','#8b5cf6','#10b981','#22d3ee','#ef4444','#6b7280']
    }]
  }
});
</script>
