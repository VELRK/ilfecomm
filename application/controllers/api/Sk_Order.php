<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Order extends Sk_Base_Api {

    public function checkout() {
        $this->auth_required();
        $data = $this->body();

        // Validate address
        $addr = $data['address'] ?? null;
        if (!$addr || empty($addr['full_name']) || empty($addr['line1'])) {
            return $this->error('Shipping address is required.');
        }

        // Build cart
        $user_id = $this->user['user_id'];
        $items   = $this->db->where('user_id', $user_id)->get('cart')->result_array();
        if (empty($items)) return $this->error('Cart is empty.');

        $settings = $this->get_settings();
        $subtotal = 0;
        $order_items = [];

        foreach ($items as $item) {
            $p = $this->Sk_Product_model->get_by_id($item['product_id']);
            if (!$p || $p['status'] !== 'active') return $this->error("Product '{$p['name']}' is no longer available.");
            if ($p['stock'] < $item['quantity']) return $this->error("Insufficient stock for '{$p['name']}'.");
            $price    = $p['effective_price'] ?? $p['sale_price'] ?? $p['price'];
            $sub      = round($price * $item['quantity'], 2);
            $subtotal += $sub;
            $order_items[] = [
                'product_id'   => $p['id'],
                'product_name' => $p['name'],
                'product_sku'  => $p['sku'],
                'thumbnail'    => $p['thumbnail'],
                'price'        => $price,
                'quantity'     => $item['quantity'],
                'subtotal'     => $sub,
            ];
        }

        // Promo
        $discount = 0;
        $promo_code = null;
        if (!empty($data['promo_code'])) {
            $check = $this->Sk_Promo_model->validate($data['promo_code'], $user_id, $subtotal);
            if ($check['valid']) {
                $discount   = $check['discount'];
                $promo_code = $data['promo_code'];
            }
        }

        $shipping = $subtotal >= ($settings['free_shipping_above'] ?? 999) ? 0 : ($settings['shipping_charge'] ?? 50);
        $taxable_amount = max(0, $subtotal - $discount);
        $tax      = round($taxable_amount * ($settings['tax_rate'] ?? 18) / 100, 2);
        $total    = round($taxable_amount + $shipping + $tax, 2);

        $order_data = [
            'user_id'          => $user_id,
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'tax'              => $tax,
            'discount'         => $discount,
            'promo_code'       => $promo_code,
            'total'            => $total,
            'payment_method'   => $data['payment_method'] ?? 'razorpay',
            'payment_status'   => 'pending',
            'status'           => 'pending',
            'notes'            => $data['note'] ?? $data['notes'] ?? null,
            'shipping_name'    => $addr['full_name'],
            'shipping_phone'   => $addr['phone'] ?? '',
            'shipping_line1'   => $addr['line1'],
            'shipping_line2'   => $addr['line2'] ?? '',
            'shipping_city'    => $addr['city'],
            'shipping_state'   => $addr['state'],
            'shipping_pincode' => $addr['pincode'],
            'shipping_country' => $addr['country'] ?? 'India',
        ];

        $order_id = $this->Sk_Order_model->create($order_data, $order_items);

        // Record promo usage
        if ($promo_code && !empty($check['promo'])) {
            $this->Sk_Promo_model->record_usage($check['promo']['id'], $user_id, $order_id);
        }

        // Clear cart
        $this->db->where('user_id', $user_id)->delete('cart');

        $order = $this->Sk_Order_model->get_by_id($order_id, $user_id);

        // Email customer for COD immediately; Razorpay emails sent after payment verify
        $this->load->helper('sk_mailer');
        $settings = $this->get_settings();
        $payment_method = strtolower($data['payment_method'] ?? 'razorpay');
        if ($payment_method === 'cod') {
            sk_mail_order_placed($order, $settings);
        }

        $this->success(['order' => $order], 'Order placed successfully.', 201);
    }

    public function index() {
        $this->auth_required();
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $limit  = 10;
        $offset = ($page - 1) * $limit;
        $orders = $this->Sk_Order_model->get_user_orders($this->user['user_id'], $limit, $offset);
        // Attach items to each order for frontend display
        foreach ($orders as &$o) {
            $o['items'] = $this->Sk_Order_model->get_items($o['id']);
        }
        unset($o);
        $this->success($orders);
    }

    public function show($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id($id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        $this->success($order);
    }

    /** GET /shopkart-api/order/:id/invoice — customer invoice HTML */
    public function invoice($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);

        $this->load->helper('sk_mailer');
        $settings = $this->get_settings();
        $html = sk_build_invoice_html($order, $settings, false);

        $site_name = htmlspecialchars($settings['site_name'] ?? 'ShopKart', ENT_QUOTES, 'UTF-8');
        $page = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Invoice - {$order['order_number']}</title>
<style>body{margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;} @media print{body{background:#fff;padding:0;}.no-print{display:none!important;}}</style>
</head><body>
<div class='no-print' style='text-align:center;margin-bottom:16px;'>
  <button onclick='window.print()' style='padding:8px 18px;border:none;border-radius:8px;background:#c11069;color:#fff;font-weight:600;cursor:pointer;'>Print / Save PDF</button>
</div>
{$html}
<p style='text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;'>{$site_name}</p>
</body></html>";

        $this->output
            ->set_content_type('text/html', 'utf-8')
            ->set_output($page);
    }

    public function cancel($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        if ($order['status'] !== 'pending') {
            return $this->error('Only pending orders can be cancelled.');
        }
        $this->Sk_Order_model->update_status((int)$id, 'cancelled');
        $this->Sk_Order_model->update_payment_status((int)$id, 'failed');

        $order['status'] = 'cancelled';
        $this->load->helper('sk_mailer');
        sk_mail_order_status($order, 'cancelled', $this->get_settings());

        $this->success([], 'Order cancelled.');
    }
}
