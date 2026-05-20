<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - <?= $order['order_number'] ?></title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <style>
    body { font-size: 13px; }
    .invoice-header { background: #1e293b; color: #fff; padding: 20px 30px; }
    .invoice-body { padding: 30px; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
<div class="no-print text-center py-2">
  <button onclick="window.print()" class="btn btn-sm btn-warning">Print / Save PDF</button>
  <button onclick="window.close()" class="btn btn-sm btn-secondary ms-2">Close</button>
</div>

<div class="invoice-header d-flex justify-content-between align-items-center">
  <div>
    <h4 class="mb-0 fw-bold">ShopKart</h4>
    <small><?= htmlspecialchars($settings['site_address'] ?? '') ?></small>
  </div>
  <div class="text-end">
    <h5 class="mb-0">INVOICE</h5>
    <small><?= $order['order_number'] ?></small>
  </div>
</div>

<div class="invoice-body">
  <div class="row mb-4">
    <div class="col-6">
      <strong>Bill To:</strong><br>
      <?= htmlspecialchars($order['shipping_name'] ?? '') ?><br>
      <?= htmlspecialchars($order['shipping_phone'] ?? '') ?><br>
      <?= htmlspecialchars($order['shipping_line1'] ?? '') ?><br>
      <?= htmlspecialchars($order['shipping_city'] ?? '') ?>,
      <?= htmlspecialchars($order['shipping_state'] ?? '') ?> - <?= htmlspecialchars($order['shipping_pincode'] ?? '') ?>
    </div>
    <div class="col-6 text-end">
      <strong>Invoice Date:</strong> <?= date('d M Y', strtotime($order['created_at'])) ?><br>
      <strong>Payment:</strong> <?= ucfirst($order['payment_status']) ?><br>
      <strong>Method:</strong> <?= ucfirst($order['payment_method']) ?>
    </div>
  </div>

  <table class="table table-bordered">
    <thead class="table-dark">
      <tr><th>#</th><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
    </thead>
    <tbody>
      <?php foreach ($order['items'] as $i => $item): ?>
      <tr>
        <td><?= $i+1 ?></td>
        <td><?= htmlspecialchars($item['product_name']) ?></td>
        <td>₹<?= number_format($item['price'],2) ?></td>
        <td><?= $item['quantity'] ?></td>
        <td>₹<?= number_format($item['subtotal'],2) ?></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
    <tfoot>
      <tr><td colspan="4" class="text-end">Subtotal</td><td>₹<?= number_format($order['subtotal'],2) ?></td></tr>
      <?php if ($order['discount'] > 0): ?>
      <tr><td colspan="4" class="text-end text-success">Discount</td><td class="text-success">-₹<?= number_format($order['discount'],2) ?></td></tr>
      <?php endif; ?>
      <tr><td colspan="4" class="text-end">Shipping</td><td>₹<?= number_format($order['shipping'],2) ?></td></tr>
      <tr><td colspan="4" class="text-end">Tax</td><td>₹<?= number_format($order['tax'],2) ?></td></tr>
      <tr class="fw-bold"><td colspan="4" class="text-end">Total</td><td>₹<?= number_format($order['total'],2) ?></td></tr>
    </tfoot>
  </table>

  <div class="text-center text-muted mt-4">
    <small>Thank you for shopping with ShopKart! • <?= $settings['site_email'] ?? '' ?></small>
  </div>
</div>
</body>
</html>
