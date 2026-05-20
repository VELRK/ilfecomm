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

        $data['title']   = 'Orders - ShopKart Admin';
        $data['orders']  = $this->Sk_Order_model->get_all_admin($limit, $offset, $filters);
        $data['total']   = $this->Sk_Order_model->count_admin($filters);
        $data['page']    = $page;
        $data['limit']   = $limit;
        $data['filters'] = $filters;
        $this->render('orders/list', $data);
    }

    public function view($id) {
        $data['title'] = 'Order Detail';
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

    public function invoice($id) {
        $data['order'] = $this->Sk_Order_model->get_by_id($id);
        $data['settings'] = $this->Sk_Admin_model->get_settings();
        if (!$data['order']) show_404();
        // Render invoice view without header/sidebar
        $this->load->view('admin/orders/invoice', $data);
    }
}
