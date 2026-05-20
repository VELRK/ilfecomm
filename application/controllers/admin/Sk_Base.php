<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Base extends CI_Controller {

    protected $admin;

    public function __construct() {
        parent::__construct();
        $this->load->model(['Sk_Admin_model', 'Sk_Product_model', 'Sk_Order_model', 'Sk_User_model', 'Sk_Promo_model']);
        $this->load->library(['session', 'form_validation', 'upload', 'pagination']);
        $this->load->helper(['url', 'form', 'text', 'date']);

        // Auth check — Login controller skips this
        if (get_class($this) !== 'Login') {
            $this->_require_admin();
        }
    }

    protected function _require_admin() {
        $admin_id = $this->session->userdata('sk_admin_id');
        if (!$admin_id) {
            redirect('shopkart/login');
        }
        $this->admin = $this->Sk_Admin_model->get_by_id($admin_id);
        if (!$this->admin) {
            $this->session->sess_destroy();
            redirect('shopkart/login');
        }
    }

    protected function render($view, $data = []) {
        $data['admin']    = $this->admin;
        $data['settings'] = $this->Sk_Admin_model->get_settings();
        $this->load->view('admin/layout/header', $data);
        $this->load->view('admin/layout/sidebar', $data);
        $this->load->view('admin/' . $view, $data);
        $this->load->view('admin/layout/footer', $data);
    }

    protected function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    protected function upload_file($field, $dir = 'products') {
        $path = FCPATH . 'assets/uploads/' . $dir . '/';
        if (!is_dir($path)) mkdir($path, 0755, true);

        $config = [
            'upload_path'   => $path,
            'allowed_types' => 'jpg|jpeg|png|gif|webp',
            'max_size'      => 2048,
            'file_name'     => uniqid($dir . '_'),
        ];
        $this->load->library('upload', $config);
        $this->upload->initialize($config);

        if ($this->upload->do_upload($field)) {
            return 'assets/uploads/' . $dir . '/' . $this->upload->data('file_name');
        }
        return null;
    }
}
