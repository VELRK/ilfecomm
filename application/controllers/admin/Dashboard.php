<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Dashboard extends Sk_Base {

    public function index() {
        $data['title']           = 'Dashboard - ShopKart Admin';
        $data['total_orders']    = $this->Sk_Order_model->total_orders();
        $data['pending_orders']  = $this->Sk_Order_model->pending_orders();
        $data['total_revenue']   = $this->Sk_Order_model->total_revenue();
        $data['monthly_revenue'] = $this->Sk_Order_model->monthly_revenue();
        $data['total_products']  = $this->Sk_Product_model->total_products();
        $data['total_customers'] = $this->Sk_User_model->total_users();
        $data['recent_orders']   = $this->Sk_Order_model->recent_orders(8);
        $data['top_products']    = $this->Sk_Order_model->top_products(5);
        $data['revenue_chart']   = $this->Sk_Order_model->revenue_by_day(30);
        $this->render('dashboard', $data);
    }
}
