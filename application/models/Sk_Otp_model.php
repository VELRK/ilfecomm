<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Otp_model extends CI_Model {

    private $table = 'phone_otps';
    private $table_ready = false;

    private function ensure_table()
    {
        if ($this->table_ready) {
            return;
        }

        $this->db->query(
            "CREATE TABLE IF NOT EXISTS `{$this->table}` (
              `id` INT(11) NOT NULL AUTO_INCREMENT,
              `phone` VARCHAR(20) NOT NULL,
              `otp_hash` VARCHAR(255) NOT NULL,
              `expires_at` DATETIME NOT NULL,
              `verified_at` DATETIME DEFAULT NULL,
              `created_at` DATETIME NOT NULL,
              PRIMARY KEY (`id`),
              KEY `idx_phone_otps_phone` (`phone`),
              KEY `idx_phone_otps_expires` (`expires_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        );

        $this->table_ready = true;
    }

    /**
     * Save a new OTP for the phone; replaces any pending OTPs for the same number.
     */
    public function store($phone, $otp, $expiryMinutes = 10)
    {
        $this->ensure_table();
        $phone   = $this->_normalize_phone_key($phone);
        $now     = date('Y-m-d H:i:s');
        $expires = date('Y-m-d H:i:s', strtotime('+' . (int) $expiryMinutes . ' minutes'));

        $this->db->where('phone', $phone)
            ->where('verified_at IS NULL', null, false)
            ->delete($this->table);

        $this->db->insert($this->table, [
            'phone'      => $phone,
            'otp_hash'   => password_hash((string) $otp, PASSWORD_BCRYPT),
            'expires_at' => $expires,
            'created_at' => $now,
        ]);

        return (int) $this->db->insert_id();
    }

    /**
     * Verify OTP against the latest pending record for the phone.
     */
    public function verify($phone, $otp)
    {
        $this->ensure_table();
        $phone = $this->_normalize_phone_key($phone);
        $otp   = preg_replace('/\D/', '', (string) $otp);
        if ($phone === '' || $otp === '') {
            return false;
        }

        $row = $this->db->where('phone', $phone)
            ->where('verified_at IS NULL', null, false)
            ->where('expires_at >', date('Y-m-d H:i:s'))
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get($this->table)
            ->row_array();

        if (!$row || !password_verify($otp, $row['otp_hash'])) {
            return false;
        }

        $this->db->where('id', (int) $row['id'])->update($this->table, [
            'verified_at' => date('Y-m-d H:i:s'),
        ]);

        return true;
    }

    /**
     * Rate limit: true if another OTP request is allowed.
     */
    public function can_request($phone, $windowMinutes = 15, $maxAttempts = 5)
    {
        $this->ensure_table();
        $phone = $this->_normalize_phone_key($phone);
        if ($phone === '') {
            return false;
        }

        $since = date('Y-m-d H:i:s', strtotime('-' . (int) $windowMinutes . ' minutes'));
        $count = (int) $this->db->where('phone', $phone)
            ->where('created_at >=', $since)
            ->count_all_results($this->table);

        return $count < $maxAttempts;
    }

    public function has_pending($phone)
    {
        $this->ensure_table();
        $phone = $this->_normalize_phone_key($phone);
        if ($phone === '') {
            return false;
        }

        return (bool) $this->db->where('phone', $phone)
            ->where('verified_at IS NULL', null, false)
            ->where('expires_at >', date('Y-m-d H:i:s'))
            ->limit(1)
            ->count_all_results($this->table);
    }

    private function _normalize_phone_key($phone)
    {
        return preg_replace('/\D/', '', (string) $phone);
    }
}
