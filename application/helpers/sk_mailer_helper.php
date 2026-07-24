<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/** Last sk_send_mail failure reason (for admin/API feedback). */
function sk_mail_last_error() {
    return sk_mail_error_store();
}

function &sk_mail_error_store() {
    static $error = '';
    return $error;
}

function sk_mail_set_error($message) {
    sk_mail_error_store() = (string) $message;
    if ($message !== '') {
        log_message('error', 'sk_mailer: ' . $message);
    }
}

/** Return list of SMTP configuration problems (empty array = OK). */
function sk_mail_config_issues($settings) {
    $issues = [];
    if (trim($settings['smtp_host'] ?? '') === '') {
        $issues[] = 'SMTP host is not set.';
    }
    if (trim($settings['smtp_user'] ?? '') === '') {
        $issues[] = 'SMTP username is not set.';
    }
    if ((string) ($settings['smtp_pass'] ?? '') === '') {
        $issues[] = 'SMTP password is not saved. Re-enter it on Settings → Email and click Save.';
    }
    $from = trim($settings['site_email'] ?? '');
    if ($from === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        $from = trim($settings['smtp_user'] ?? '');
    }
    if ($from === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        $issues[] = 'Site Email (General tab) must be a valid email and usually match SMTP username.';
    }
    return $issues;
}

/** True when the address cannot receive mail (empty / phone-login placeholder). */
function sk_mail_is_placeholder_email($email) {
    $email = trim((string) $email);
    if ($email === '') {
        return true;
    }
    if (stripos($email, '@shopkart.app') !== false) {
        return true;
    }
    if (preg_match('/^ph_\d+@/i', $email)) {
        return true;
    }
    return !filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Send an email using SMTP settings stored in the settings table.
 * Returns true on success, false on failure.
 */
function sk_send_mail($to_email, $to_name, $subject, $html_body, $settings = null) {
    sk_mail_set_error('');

    $to_email = trim((string) $to_email);
    if (sk_mail_is_placeholder_email($to_email)) {
        sk_mail_set_error('Customer has no valid email address. Phone-login accounts need a real email in their profile.');
        return false;
    }

    $CI =& get_instance();
    if ($settings === null) {
        if (!isset($CI->Sk_Admin_model)) {
            $CI->load->model('Sk_Admin_model');
        }
        $settings = $CI->Sk_Admin_model->get_settings();
    }

    $issues = sk_mail_config_issues($settings);
    if ($issues) {
        sk_mail_set_error(implode(' ', $issues));
        return false;
    }

    $CI->load->library('email');

    $smtp_host = trim($settings['smtp_host'] ?? '');
    $smtp_user = trim($settings['smtp_user'] ?? '');
    $smtp_pass = (string) ($settings['smtp_pass'] ?? '');
    $smtp_port = (int) ($settings['smtp_port'] ?? 587);
    $from_email = trim($settings['site_email'] ?? '');
    if ($from_email === '' || !filter_var($from_email, FILTER_VALIDATE_EMAIL)) {
        $from_email = $smtp_user;
    }
    $from_name  = trim($settings['smtp_from_name'] ?? ($settings['site_name'] ?? 'ILF'));

    $attempts = [];
    if ($smtp_port === 465) {
        $attempts[] = ['port' => 465, 'crypto' => 'ssl'];
    } elseif ($smtp_port === 587) {
        $attempts[] = ['port' => 587, 'crypto' => 'tls'];
    } else {
        $attempts[] = ['port' => $smtp_port, 'crypto' => ''];
    }
    // Retry common alternate port if primary fails
    if ($smtp_port === 587) {
        $attempts[] = ['port' => 465, 'crypto' => 'ssl'];
    } elseif ($smtp_port === 465) {
        $attempts[] = ['port' => 587, 'crypto' => 'tls'];
    }

    $last_debug = '';
    foreach ($attempts as $attempt) {
        $CI->email->clear(true);
        $CI->email->initialize([
            'useragent'    => 'ILF Mailer',
            'protocol'     => 'smtp',
            'smtp_host'    => $smtp_host,
            'smtp_port'    => $attempt['port'],
            'smtp_user'    => $smtp_user,
            'smtp_pass'    => $smtp_pass,
            'smtp_crypto'  => $attempt['crypto'],
            'smtp_timeout' => 20,
            'mailtype'     => 'html',
            'charset'      => 'utf-8',
            'newline'      => "\r\n",
            'crlf'         => "\r\n",
            'wordwrap'     => true,
        ]);

        $CI->email->from($from_email, $from_name);
        $CI->email->to($to_email, $to_name);
        $CI->email->subject($subject);
        $CI->email->message($html_body);

        if ($CI->email->send(false)) {
            return true;
        }

        $last_debug = trim(preg_replace('/\s+/', ' ', strip_tags($CI->email->print_debugger(['headers', 'subject']))));
    }

    sk_mail_set_error($last_debug !== ''
        ? $last_debug
        : 'SMTP connection failed. For Hostinger use smtp.hostinger.com, port 465 (SSL) or 587 (TLS), and full email as username.');
    return false;
}

/** Build and send an order confirmation email to the customer. */
function sk_mail_order_confirmation($order, $settings = []) {
    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name']  ?? 'Customer';
    $subject  = 'Order Confirmed – #' . ($order['order_number'] ?? $order['id']);

    $currency = $settings['currency_symbol'] ?? '₹';

    // Build items HTML
    $items_html = '';
    foreach (($order['items'] ?? []) as $item) {
        $line_total = number_format($item['subtotal'] ?? ($item['price'] * $item['quantity']), 2);
        $items_html .= "
        <tr>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;'>
            <strong>{$item['product_name']}</strong>
          </td>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:center;'>{$item['quantity']}</td>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;'>{$currency}" . number_format($item['price'], 2) . "</td>
          <td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;'>{$currency}{$line_total}</td>
        </tr>";
    }

    // Address block
    $addr_parts = array_filter([
        $order['shipping_name'] ?? '',
        $order['shipping_line1'] ?? '',
        $order['shipping_line2'] ?? '',
        ($order['shipping_city'] ?? '') . (isset($order['shipping_state']) ? ', ' . $order['shipping_state'] : ''),
        ($order['shipping_pincode'] ?? '') . ' – ' . ($order['shipping_country'] ?? 'India'),
        'Phone: ' . ($order['shipping_phone'] ?? ''),
    ]);
    $addr_html = implode('<br>', $addr_parts);

    // Coupon row
    $coupon_html = '';
    if (!empty($order['promo_code']) && $order['discount'] > 0) {
        $coupon_html = "<tr>
          <td colspan='2' style='padding:6px 0;color:#16a34a;'>Coupon ({$order['promo_code']})</td>
          <td style='padding:6px 0;text-align:right;color:#16a34a;'>-{$currency}" . number_format($order['discount'], 2) . "</td>
        </tr>";
    }

    $payment_label = strtoupper($order['payment_method'] ?? 'COD');
    $site_name = $settings['site_name'] ?? 'ShopKart';

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <!-- Header -->
  <div style='background:#0f172a;padding:32px 40px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:24px;letter-spacing:1px;'>{$site_name}</h1>
    <p style='color:#94a3b8;margin:8px 0 0;font-size:14px;'>Order Confirmation</p>
  </div>

  <!-- Body -->
  <div style='padding:40px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$to_name}</strong>,</p>
    <p style='color:#334155;'>Thank you for your order! We have received it and will process it shortly.</p>

    <div style='background:#f1f5f9;border-radius:10px;padding:20px;margin:24px 0;'>
      <div style='display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;'>
        <div>
          <p style='margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;'>Order Number</p>
          <p style='margin:4px 0 0;font-size:18px;font-weight:700;color:#0f172a;'>#{$order['order_number']}</p>
        </div>
        <div>
          <p style='margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;'>Order Date</p>
          <p style='margin:4px 0 0;font-size:15px;color:#334155;'>" . date('d M Y', strtotime($order['created_at'] ?? 'now')) . "</p>
        </div>
        <div>
          <p style='margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;'>Payment</p>
          <p style='margin:4px 0 0;font-size:15px;color:#334155;'>{$payment_label}</p>
        </div>
      </div>
    </div>

    <!-- Items -->
    <h3 style='color:#0f172a;margin-bottom:12px;'>Order Items</h3>
    <table width='100%' style='border-collapse:collapse;'>
      <thead>
        <tr style='background:#f8fafc;'>
          <th style='padding:10px;text-align:left;font-size:13px;color:#64748b;'>Product</th>
          <th style='padding:10px;text-align:center;font-size:13px;color:#64748b;'>Qty</th>
          <th style='padding:10px;text-align:right;font-size:13px;color:#64748b;'>Price</th>
          <th style='padding:10px;text-align:right;font-size:13px;color:#64748b;'>Total</th>
        </tr>
      </thead>
      <tbody>{$items_html}</tbody>
    </table>

    <!-- Totals -->
    <table width='100%' style='margin-top:16px;'>
      <tr>
        <td colspan='2' style='padding:6px 0;color:#64748b;'>Subtotal</td>
        <td style='padding:6px 0;text-align:right;'>{$currency}" . number_format($order['subtotal'] ?? 0, 2) . "</td>
      </tr>
      {$coupon_html}
      <tr>
        <td colspan='2' style='padding:6px 0;color:#64748b;'>Shipping</td>
        <td style='padding:6px 0;text-align:right;'>" . (($order['shipping'] ?? 0) == 0 ? '<span style="color:#16a34a;">Free</span>' : $currency . number_format($order['shipping'] ?? 0, 2)) . "</td>
      </tr>
      <tr>
        <td colspan='2' style='padding:6px 0;color:#64748b;'>GST</td>
        <td style='padding:6px 0;text-align:right;'>{$currency}" . number_format($order['tax'] ?? 0, 2) . "</td>
      </tr>
      <tr>
        <td colspan='2' style='padding:12px 0 6px;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #f1f5f9;'>Total</td>
        <td style='padding:12px 0 6px;text-align:right;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #f1f5f9;'>{$currency}" . number_format($order['total'] ?? 0, 2) . "</td>
      </tr>
    </table>

    <!-- Delivery Address -->
    <div style='margin-top:32px;padding:20px;border:1px solid #e2e8f0;border-radius:10px;'>
      <h4 style='margin:0 0 12px;color:#0f172a;'>📍 Delivery Address</h4>
      <p style='margin:0;color:#334155;line-height:1.7;font-size:14px;'>{$addr_html}</p>
    </div>

    <p style='margin-top:32px;color:#334155;'>We'll send you another email when your order is shipped. If you have any questions, reply to this email.</p>
    <p style='color:#334155;'>Thank you for shopping with us! 🛍️</p>
  </div>

  <!-- Footer -->
  <div style='background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Build invoice HTML (email-safe inline styles). */
function sk_build_invoice_html($order, $settings = [], $for_email = true) {
    $currency   = htmlspecialchars($settings['currency_symbol'] ?? '₹', ENT_QUOTES, 'UTF-8');
    $site_name  = htmlspecialchars($settings['site_name'] ?? 'ShopKart', ENT_QUOTES, 'UTF-8');
    $site_email = htmlspecialchars($settings['site_email'] ?? '', ENT_QUOTES, 'UTF-8');
    $site_addr  = htmlspecialchars($settings['site_address'] ?? '', ENT_QUOTES, 'UTF-8');
    $tax_rate   = (float)($settings['tax_rate'] ?? 0);

    $items_html = '';
    foreach (($order['items'] ?? []) as $i => $item) {
        $name = htmlspecialchars($item['product_name'] ?? 'Product', ENT_QUOTES, 'UTF-8');
        $sku  = !empty($item['product_sku'])
            ? '<br><small style="color:#64748b;">SKU: ' . htmlspecialchars($item['product_sku'], ENT_QUOTES, 'UTF-8') . '</small>'
            : '';
        $items_html .= "
        <tr>
          <td style='padding:10px;border-bottom:1px solid #e2e8f0;'>" . ($i + 1) . "</td>
          <td style='padding:10px;border-bottom:1px solid #e2e8f0;'><strong>{$name}</strong>{$sku}</td>
          <td style='padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;'>{$currency}" . number_format((float)$item['price'], 2) . "</td>
          <td style='padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;'>" . (int)$item['quantity'] . "</td>
          <td style='padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;'>{$currency}" . number_format((float)$item['subtotal'], 2) . "</td>
        </tr>";
    }

    $discount_html = '';
    if (!empty($order['discount']) && (float)$order['discount'] > 0) {
        $promo = htmlspecialchars($order['promo_code'] ?? 'Promo', ENT_QUOTES, 'UTF-8');
        $discount_html = "
        <tr>
          <td colspan='4' style='padding:8px 10px;text-align:right;color:#16a34a;'>Discount ({$promo})</td>
          <td style='padding:8px 10px;text-align:right;color:#16a34a;font-weight:600;'>-{$currency}" . number_format((float)$order['discount'], 2) . "</td>
        </tr>";
    }

    $shipping_val = (float)($order['shipping'] ?? 0);
    $shipping_cell = $shipping_val == 0
        ? "<span style='color:#16a34a;font-weight:600;'>Free</span>"
        : "{$currency}" . number_format($shipping_val, 2);

    $bill_name  = htmlspecialchars($order['shipping_name'] ?? '', ENT_QUOTES, 'UTF-8');
    $bill_phone = htmlspecialchars($order['shipping_phone'] ?? '', ENT_QUOTES, 'UTF-8');
    $bill_line1 = htmlspecialchars($order['shipping_line1'] ?? '', ENT_QUOTES, 'UTF-8');
    $bill_line2 = !empty($order['shipping_line2'])
        ? htmlspecialchars($order['shipping_line2'], ENT_QUOTES, 'UTF-8') . '<br>'
        : '';
    $bill_city  = htmlspecialchars($order['shipping_city'] ?? '', ENT_QUOTES, 'UTF-8');
    $bill_state = htmlspecialchars($order['shipping_state'] ?? '', ENT_QUOTES, 'UTF-8');
    $bill_pin   = htmlspecialchars($order['shipping_pincode'] ?? '', ENT_QUOTES, 'UTF-8');
    $bill_country = htmlspecialchars($order['shipping_country'] ?? 'India', ENT_QUOTES, 'UTF-8');

    $order_number = htmlspecialchars($order['order_number'] ?? ('#' . ($order['id'] ?? '')), ENT_QUOTES, 'UTF-8');
    $invoice_date = date('d M Y', strtotime($order['created_at'] ?? 'now'));
    $payment_status = ucfirst(htmlspecialchars($order['payment_status'] ?? 'pending', ENT_QUOTES, 'UTF-8'));
    $payment_method = strtoupper(htmlspecialchars($order['payment_method'] ?? 'COD', ENT_QUOTES, 'UTF-8'));
    $order_status   = ucfirst(htmlspecialchars($order['status'] ?? 'pending', ENT_QUOTES, 'UTF-8'));

    $wrapper_style = $for_email
        ? "max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);"
        : "max-width:900px;margin:0 auto;background:#fff;";

    return "
<div style='{$wrapper_style}'>
  <div style='background:#0f172a;color:#fff;padding:24px 32px;display:flex;justify-content:space-between;align-items:flex-start;'>
    <div>
      <h1 style='margin:0;font-size:22px;color:#fff;'>{$site_name}</h1>
      " . ($site_addr ? "<p style='margin:6px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;'>{$site_addr}</p>" : '') . "
      " . ($site_email ? "<p style='margin:4px 0 0;font-size:12px;color:#94a3b8;'>{$site_email}</p>" : '') . "
    </div>
    <div style='text-align:right;'>
      <p style='margin:0;font-size:20px;font-weight:700;color:#fff;'>TAX INVOICE</p>
      <p style='margin:6px 0 0;font-size:13px;color:#cbd5e1;'>{$order_number}</p>
    </div>
  </div>
  <div style='padding:32px;'>
    <table width='100%' style='margin-bottom:24px;border-collapse:collapse;'>
      <tr>
        <td style='vertical-align:top;width:50%;padding-right:16px;'>
          <p style='margin:0 0 8px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;font-weight:700;'>Bill To</p>
          <p style='margin:0;color:#334155;line-height:1.7;font-size:14px;'>
            <strong>{$bill_name}</strong><br>
            {$bill_phone}<br>
            {$bill_line1}<br>
            {$bill_line2}
            {$bill_city}, {$bill_state} - {$bill_pin}<br>
            {$bill_country}
          </p>
        </td>
        <td style='vertical-align:top;width:50%;text-align:right;'>
          <p style='margin:0 0 6px;color:#334155;font-size:14px;'><strong>Invoice Date:</strong> {$invoice_date}</p>
          <p style='margin:0 0 6px;color:#334155;font-size:14px;'><strong>Order Status:</strong> {$order_status}</p>
          <p style='margin:0 0 6px;color:#334155;font-size:14px;'><strong>Payment:</strong> {$payment_status}</p>
          <p style='margin:0;color:#334155;font-size:14px;'><strong>Method:</strong> {$payment_method}</p>
        </td>
      </tr>
    </table>

    <table width='100%' style='border-collapse:collapse;border:1px solid #e2e8f0;'>
      <thead>
        <tr style='background:#f8fafc;'>
          <th style='padding:10px;text-align:left;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;'>#</th>
          <th style='padding:10px;text-align:left;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;'>Product</th>
          <th style='padding:10px;text-align:right;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;'>Price</th>
          <th style='padding:10px;text-align:center;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;'>Qty</th>
          <th style='padding:10px;text-align:right;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;'>Amount</th>
        </tr>
      </thead>
      <tbody>{$items_html}</tbody>
      <tfoot>
        <tr>
          <td colspan='4' style='padding:8px 10px;text-align:right;color:#64748b;'>Subtotal</td>
          <td style='padding:8px 10px;text-align:right;font-weight:600;'>{$currency}" . number_format((float)($order['subtotal'] ?? 0), 2) . "</td>
        </tr>
        {$discount_html}
        <tr>
          <td colspan='4' style='padding:8px 10px;text-align:right;color:#64748b;'>Shipping</td>
          <td style='padding:8px 10px;text-align:right;'>{$shipping_cell}</td>
        </tr>
        <tr>
          <td colspan='4' style='padding:8px 10px;text-align:right;color:#64748b;'>GST" . ($tax_rate > 0 ? " ({$tax_rate}%)" : '') . "</td>
          <td style='padding:8px 10px;text-align:right;'>{$currency}" . number_format((float)($order['tax'] ?? 0), 2) . "</td>
        </tr>
        <tr>
          <td colspan='4' style='padding:12px 10px;text-align:right;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #e2e8f0;'>Grand Total</td>
          <td style='padding:12px 10px;text-align:right;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #e2e8f0;'>{$currency}" . number_format((float)($order['total'] ?? 0), 2) . "</td>
        </tr>
      </tfoot>
    </table>

    <p style='margin:28px 0 0;text-align:center;color:#94a3b8;font-size:13px;'>Thank you for shopping with {$site_name}!</p>
  </div>
</div>";
}

/** Send invoice email to customer. */
function sk_mail_order_invoice($order, $settings = []) {
    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name']  ?? 'Customer';
    $subject  = 'Invoice – Order #' . ($order['order_number'] ?? $order['id']);
    $site_name = $settings['site_name'] ?? 'ShopKart';

    $invoice_html = sk_build_invoice_html($order, $settings, true);

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;'>
  <p style='max-width:640px;margin:0 auto 16px;color:#334155;font-size:15px;'>Hi <strong>" . htmlspecialchars($to_name, ENT_QUOTES, 'UTF-8') . "</strong>,</p>
  <p style='max-width:640px;margin:0 auto 20px;color:#334155;font-size:15px;'>Please find your invoice for order <strong>#" . htmlspecialchars($order['order_number'] ?? $order['id'], ENT_QUOTES, 'UTF-8') . "</strong> below.</p>
  {$invoice_html}
  <p style='max-width:640px;margin:20px auto 0;text-align:center;color:#94a3b8;font-size:12px;'>{$site_name} &copy; " . date('Y') . "</p>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Send order confirmation + invoice together after a successful order. */
function sk_mail_order_placed($order, $settings = []) {
    $confirmation = sk_mail_order_confirmation($order, $settings);
    $invoice      = sk_mail_order_invoice($order, $settings);
    return $confirmation || $invoice;
}

/** Send order status update email to customer. */
function sk_mail_order_status($order, $new_status, $settings = []) {
    $to_email = $order['customer_email'] ?? '';
    $to_name  = $order['customer_name']  ?? 'Customer';

    $status_labels = [
        'pending'    => ['label' => 'Order Received',     'color' => '#f59e0b', 'icon' => '⏳'],
        'confirmed'  => ['label' => 'Order Confirmed',    'color' => '#3b82f6', 'icon' => '✅'],
        'processing' => ['label' => 'Processing',         'color' => '#8b5cf6', 'icon' => '🔧'],
        'shipped'    => ['label' => 'Shipped',            'color' => '#06b6d4', 'icon' => '🚚'],
        'delivered'  => ['label' => 'Delivered',          'color' => '#16a34a', 'icon' => '📦'],
        'cancelled'  => ['label' => 'Cancelled',          'color' => '#dc2626', 'icon' => '❌'],
        'returned'   => ['label' => 'Return Requested',   'color' => '#ea580c', 'icon' => '↩️'],
    ];

    $s = $status_labels[$new_status] ?? ['label' => ucfirst($new_status), 'color' => '#64748b', 'icon' => '📋'];
    $subject  = "{$s['icon']} Order #{$order['order_number']} – {$s['label']}";
    $site_name = $settings['site_name'] ?? 'ShopKart';
    $currency  = $settings['currency_symbol'] ?? '₹';

    $tracking_html = '';
    if (!empty($order['tracking_number'])) {
        $tracking_html = "<p style='margin-top:16px;padding:12px 16px;background:#f1f5f9;border-radius:8px;font-size:14px;'>
          🔍 Tracking Number: <strong>{$order['tracking_number']}</strong>
        </p>";
    }

    $summary_html = "
    <div style='margin-top:20px;padding:16px;background:#f8fafc;border-radius:10px;font-size:14px;color:#334155;'>
      <p style='margin:0 0 8px;'><strong>Order Total:</strong> {$currency}" . number_format((float)($order['total'] ?? 0), 2) . "</p>
      <p style='margin:0;'><strong>Payment:</strong> " . ucfirst($order['payment_status'] ?? 'pending') . " · " . strtoupper($order['payment_method'] ?? 'COD') . "</p>
    </div>";

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#0f172a;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#94a3b8;margin:6px 0 0;font-size:13px;'>Order Update</p>
  </div>
  <div style='padding:36px 32px;'>
    <div style='text-align:center;margin-bottom:28px;'>
      <div style='display:inline-block;background:{$s['color']}1a;border:2px solid {$s['color']};border-radius:50px;padding:10px 28px;'>
        <span style='font-size:18px;font-weight:700;color:{$s['color']};'>{$s['icon']} {$s['label']}</span>
      </div>
    </div>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$to_name}</strong>,</p>
    <p style='color:#334155;'>Your order <strong>#{$order['order_number']}</strong> status has been updated to <strong style='color:{$s['color']};'>{$s['label']}</strong>.</p>
    {$summary_html}
    {$tracking_html}
    <p style='color:#334155;margin-top:24px;'>If you have any questions about your order, please contact our support team.</p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}

/** Send password reset verification code to the user's email. */
function sk_mail_password_reset_code($user, $code, $settings = []) {
    $to_email = $user['email'] ?? '';
    $to_name  = $user['name'] ?? 'Customer';
    $site_name = $settings['site_name'] ?? 'ShopKart';
    $subject = 'Password Reset Verification Code – ' . $site_name;

    $body = "
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body style='margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;'>
<div style='max-width:520px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);'>
  <div style='background:#0f172a;padding:28px 32px;text-align:center;'>
    <h1 style='color:#fff;margin:0;font-size:22px;'>{$site_name}</h1>
    <p style='color:#94a3b8;margin:6px 0 0;font-size:13px;'>Password Reset</p>
  </div>
  <div style='padding:36px 32px;'>
    <p style='color:#334155;font-size:16px;'>Hi <strong>{$to_name}</strong>,</p>
    <p style='color:#334155;'>Use the verification code below to reset your password. This code expires in <strong>15 minutes</strong>.</p>
    <div style='text-align:center;margin:28px 0;'>
      <div style='display:inline-block;background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:12px;padding:18px 36px;'>
        <span style='font-size:32px;font-weight:700;letter-spacing:8px;color:#0f172a;'>{$code}</span>
      </div>
    </div>
    <p style='color:#64748b;font-size:14px;'>If you did not request a password reset, you can safely ignore this email.</p>
  </div>
  <div style='background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;'>
    <p style='margin:0;color:#94a3b8;font-size:13px;'>{$site_name} &copy; " . date('Y') . "</p>
  </div>
</div>
</body>
</html>";

    return sk_send_mail($to_email, $to_name, $subject, $body);
}
