<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Settings extends Sk_Base {

    public function index() {
        $data['title']    = sk_admin_title('Settings');
        $settings         = $this->Sk_Admin_model->get_settings();
        // Fix invalid stored numbers that break browser form validation
        $settings['tax_rate']            = (string) max(0, min(100, (float) ($settings['tax_rate'] ?? 18)));
        $settings['shipping_charge']     = (string) max(0, (float) ($settings['shipping_charge'] ?? 50));
        $settings['free_shipping_above'] = (string) max(0, (float) ($settings['free_shipping_above'] ?? 999));
        $data['settings'] = $settings;
        $this->render('settings/index', $data);
    }

    public function update() {
        $fields = [
            'site_name', 'site_email', 'site_phone', 'site_address',
            'currency', 'currency_symbol', 'tax_rate', 'shipping_charge',
            'free_shipping_above', 'razorpay_key_id', 'razorpay_key_secret',
            'razorpay_mode', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass',
            'smtp_from_name', 'meta_title', 'meta_desc', 'top_bar_text',
            'whatsapp_number'
        ];

        $data = [];
        foreach ($fields as $f) {
            // Secrets must not pass through XSS filter (can corrupt passwords/keys)
            if (in_array($f, ['smtp_pass', 'razorpay_key_secret'], true)) {
                continue;
            }
            $val = $this->input->post($f, TRUE);
            if ($val !== null) {
                $data[$f] = is_string($val) ? trim($val) : $val;
            }
        }

        $existing = $this->Sk_Admin_model->get_settings();

        $smtp_pass = $this->input->post('smtp_pass', FALSE);
        if ($smtp_pass !== null && $smtp_pass !== '') {
            $data['smtp_pass'] = $smtp_pass;
        }

        $razorpay_secret = $this->input->post('razorpay_key_secret', FALSE);
        if ($razorpay_secret !== null && $razorpay_secret !== '') {
            $data['razorpay_key_secret'] = $razorpay_secret;
        }

        // Clamp numeric settings so stored values stay valid for HTML min/max inputs
        if (isset($data['tax_rate'])) {
            $data['tax_rate'] = (string) max(0, min(100, (float) $data['tax_rate']));
        }
        if (isset($data['shipping_charge'])) {
            $data['shipping_charge'] = (string) max(0, (float) $data['shipping_charge']);
        }
        if (isset($data['free_shipping_above'])) {
            $data['free_shipping_above'] = (string) max(0, (float) $data['free_shipping_above']);
        }
        if (isset($data['smtp_port'])) {
            $data['smtp_port'] = (string) max(1, min(65535, (int) $data['smtp_port']));
        }

        // Checkbox: absent when unchecked, present with value "1" when checked
        $data['newsletter_popup_enabled'] = $this->input->post('newsletter_popup_enabled') ? '1' : '0';
        $data['top_bar_enabled'] = $this->input->post('top_bar_enabled') ? '1' : '0';
        $data['whatsapp_enabled'] = $this->input->post('whatsapp_enabled') ? '1' : '0';

        // Persist corrected numeric settings if they were invalid in DB
        if (!isset($data['tax_rate']) && isset($existing['tax_rate'])) {
            $data['tax_rate'] = (string) max(0, min(100, (float) $existing['tax_rate']));
        }

        // logo upload
        $logo = $this->upload_file('site_logo', 'settings');
        if ($logo) $data['site_logo'] = $logo;

        $this->Sk_Admin_model->save_settings($data);
        $this->session->set_flashdata('success', 'Settings saved successfully.');
        redirect('admin/settings');
    }

    /** POST — send test email using saved settings (+ optional posted SMTP fields). */
    public function test_email() {
        $this->load->helper('sk_mailer');
        $settings = $this->Sk_Admin_model->get_settings();

        foreach (['smtp_host', 'smtp_port', 'smtp_user', 'smtp_from_name', 'site_email'] as $key) {
            $val = $this->input->post($key, TRUE);
            if ($val !== null && trim($val) !== '') {
                $settings[$key] = trim($val);
            }
        }
        $pass = $this->input->post('smtp_pass', FALSE);
        if ($pass !== null && $pass !== '') {
            $settings['smtp_pass'] = $pass;
        }

        $to = trim($settings['site_email'] ?? $settings['smtp_user'] ?? '');
        if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['success' => false, 'message' => 'Set a valid Site Email on the General tab first.']);
        }

        $issues = sk_mail_config_issues($settings);
        if ($issues) {
            return $this->json(['success' => false, 'message' => implode(' ', $issues)]);
        }

        $site = $settings['site_name'] ?? sk_admin_brand();
        $ok = sk_send_mail(
            $to,
            'Admin',
            $site . ' — SMTP Test',
            '<p>If you received this, SMTP is working correctly.</p>',
            $settings
        );

        if ($ok) {
            return $this->json(['success' => true, 'message' => 'Test email sent to ' . $to . '. Check inbox/spam.']);
        }

        return $this->json(['success' => false, 'message' => sk_mail_last_error() ?: 'Test email failed.']);
    }
}
