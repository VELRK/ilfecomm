<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Orders extends Sk_Base {

    public function index() {
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 15;
        $offset = ($page - 1) * $limit;
        $filters = [
            'status'         => $this->input->get('status', TRUE),
            'payment_status' => $this->input->get('payment_status', TRUE),
            'search'         => $this->input->get('search', TRUE),
        ];

        $data['title']   = sk_admin_title('Orders');
        $data['orders']  = $this->Sk_Order_model->get_all_admin($limit, $offset, $filters);
        $data['total']   = $this->Sk_Order_model->count_admin($filters);
        $data['page']    = $page;
        $data['limit']   = $limit;
        $data['filters'] = $filters;
        $this->render('orders/list', $data);
    }

    public function view($id) {
        $data['title'] = sk_admin_title('Order Detail');
        $data['order'] = $this->Sk_Order_model->get_by_id($id);
        if (!$data['order']) show_404();
        $this->render('orders/view', $data);
    }

    public function update_status($id) {
        $allowed = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
        $status  = $this->input->post('status', TRUE);
        if (!in_array($status, $allowed)) return $this->json(['success' => false, 'message' => 'Invalid status.']);

        $tracking = $this->input->post('tracking_number', TRUE);
        $this->Sk_Order_model->update_status($id, $status);
        if ($tracking) {
            $this->db->where('id', $id)->update('orders', ['tracking_number' => $tracking]);
        }
        // Send status update email to customer
        $order = $this->Sk_Order_model->get_by_id($id);
        if ($order) {
            $this->load->helper('sk_mailer');
            if ($tracking) $order['tracking_number'] = $tracking;
            sk_mail_order_status($order, $status, $this->Sk_Admin_model->get_settings());
        }
        $this->json(['success' => true, 'message' => 'Order status updated.']);
    }

    public function send_invoice($id) {
        $order = $this->Sk_Order_model->get_by_id($id);
        if (!$order) return $this->json(['success' => false, 'message' => 'Order not found.']);

        $this->load->helper('sk_mailer');
        $settings = $this->Sk_Admin_model->get_settings();
        $email    = trim($order['customer_email'] ?? '');

        if (sk_mail_is_placeholder_email($email)) {
            return $this->json([
                'success' => false,
                'message' => 'Customer email is invalid (' . ($email ?: 'empty') . '). Phone-login customers need a real email in Admin → Customers.',
            ]);
        }

        $configIssues = sk_mail_config_issues($settings);
        if ($configIssues) {
            return $this->json(['success' => false, 'message' => implode(' ', $configIssues)]);
        }

        $sent = sk_mail_order_invoice($order, $settings);
        if ($sent) {
            return $this->json(['success' => true, 'message' => 'Invoice email sent to ' . $email . '.']);
        }

        return $this->json([
            'success' => false,
            'message' => sk_mail_last_error() ?: 'SMTP send failed. Open Settings → Email and use Send Test Email.',
        ]);
    }

    public function invoice($id) {
        $data['order'] = $this->Sk_Order_model->get_by_id($id);
        $data['settings'] = $this->Sk_Admin_model->get_settings();
        if (!$data['order']) show_404();

        $this->load->helper('sk_mailer');
        $invoice_html = sk_build_invoice_html($data['order'], $data['settings'], false);
        $site_name = htmlspecialchars($data['settings']['site_name'] ?? sk_admin_brand(), ENT_QUOTES, 'UTF-8');

        $page = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Invoice - {$data['order']['order_number']}</title>
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'>
<style>body{font-size:13px;background:#f8fafc;} @media print{.no-print{display:none!important;} body{background:#fff;}}</style>
</head><body>
<div class='no-print text-center py-3'>
  <button onclick='window.print()' class='btn btn-sm btn-warning me-2'>Print / Save PDF</button>
  <button onclick='window.close()' class='btn btn-sm btn-secondary'>Close</button>
</div>
<div class='container py-3'>{$invoice_html}</div>
<p class='text-center text-muted pb-4'><small>{$site_name}</small></p>
</body></html>";

        $this->output->set_content_type('text/html', 'utf-8')->set_output($page);
    }
}
