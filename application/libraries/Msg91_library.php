<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * MSG91 SMS OTP library
 * Uses application/config/sms.php for all send/verify settings.
 */
class Msg91_library {

    private $ci;
    private $provider;
    private $auth_key;
    private $send_mode;
    private $template_id;
    private $template_variable;
    private $dlt_template_id;
    private $template_name;
    private $template_message;
    private $sender_id;
    private $otp_length;
    private $otp_expiry;
    private $country_code;
    private $development_mode;

    public function __construct()
    {
        $this->ci =& get_instance();
        // sms.php uses $config['sms'][...] — load without sections so item('sms') returns that array
        $this->ci->config->load('sms', false);
        $sms = $this->ci->config->item('sms');
        if (!is_array($sms)) {
            $sms = [];
        }
        // Handle accidental double-nest if file was loaded with sections elsewhere
        if (isset($sms['sms']) && is_array($sms['sms'])) {
            $sms = $sms['sms'];
        }

        $this->provider          = trim((string) ($sms['provider'] ?? 'msg91'));
        $this->auth_key          = trim((string) ($sms['auth_key'] ?? ''));
        $this->send_mode         = strtolower(trim((string) ($sms['send_mode'] ?? 'flow')));
        $this->template_id       = trim((string) ($sms['template_id'] ?? ''));
        $this->template_variable = trim((string) ($sms['template_variable'] ?? 'number')) ?: 'number';
        $this->dlt_template_id   = trim((string) ($sms['dlt_template_id'] ?? ''));
        $this->template_name    = trim((string) ($sms['template_name'] ?? 'ilf_otp_final'));
        $this->template_message = trim((string) ($sms['template_message'] ?? ''));
        $this->sender_id        = trim((string) ($sms['sender_id'] ?? 'INDLAD'));
        $this->otp_length       = max(4, (int) ($sms['otp_length'] ?? 4));
        $this->otp_expiry       = max(1, (int) ($sms['otp_expiry'] ?? 10));
        $this->country_code     = preg_replace('/\D/', '', (string) ($sms['country_code'] ?? '91')) ?: '91';
        $this->development_mode = !empty($sms['development_mode']);

        // Fallbacks if config missing on server
        if ($this->auth_key === '') {
            $this->auth_key = '517702A4W9M823H6a5f6b66P1';
        }
        if ($this->dlt_template_id === '') {
            $this->dlt_template_id = '1207178305383281647';
        }
        if ($this->template_id === '' && $this->send_mode === 'flow') {
            $this->template_id = '6a5db22e2209427ceb0fc032';
        }
        if ($this->sender_id === '') {
            $this->sender_id = 'INDLAD';
        }
        if ($this->template_message === '') {
            $this->template_message = 'Indian Ladies Fashion: Your OTP is ##number##. Do not share this OTP with anyone. It is valid for 10 minutes.';
        }

        $this->ci->load->model('Sk_Otp_model');
    }

    /**
     * Normalize phone to international digits, e.g. 919876543210.
     */
    public function normalize_phone($phone)
    {
        $digits = preg_replace('/\D/', '', (string) $phone);
        if ($digits === '') {
            return '';
        }

        if (strlen($digits) === 10) {
            return $this->country_code . $digits;
        }

        if (strlen($digits) === 11 && $digits[0] === '0') {
            return $this->country_code . substr($digits, 1);
        }

        if (strpos($digits, $this->country_code) === 0) {
            return $digits;
        }

        return $this->country_code . $digits;
    }

    /**
     * Send OTP to the given mobile number.
     */
    public function send_otp($phone)
    {
        $mobile = $this->normalize_phone($phone);
        if (strlen($mobile) < 12) {
            return ['success' => false, 'message' => 'Valid phone number required.'];
        }

        if (!$this->_check_rate_limit($mobile)) {
            return ['success' => false, 'message' => 'Too many OTP requests. Please try again later.'];
        }

        if ($this->development_mode) {
            return $this->_send_dev_otp($mobile);
        }

        if (!$this->auth_key) {
            return ['success' => false, 'message' => 'SMS service is not configured.'];
        }

        if ($this->provider !== 'msg91') {
            return ['success' => false, 'message' => 'Unsupported SMS provider.'];
        }

        // MSG91 v5 Flow API — DLT template mapped in panel; OTP generated and verified locally
        if ($this->send_mode === 'flow' && $this->template_id !== '') {
            return $this->_send_flow($mobile);
        }

        if ($this->send_mode === 'otp_v5' && $this->template_id !== '') {
            return $this->_send_v5($mobile);
        }

        // India DLT fallback: legacy sendotp.php
        if ($this->dlt_template_id !== '') {
            return $this->_send_legacy($mobile);
        }

        if ($this->template_id) {
            return $this->_send_v5($mobile);
        }

        return $this->_send_legacy($mobile);
    }

    /**
     * Verify OTP for the given mobile number.
     */
    public function verify_otp($phone, $otp)
    {
        $mobile = $this->normalize_phone($phone);
        $otp    = preg_replace('/\D/', '', (string) $otp);

        if (!$mobile || !$otp) {
            return ['success' => false, 'message' => 'Phone and OTP required.'];
        }

        if ($this->development_mode) {
            return $this->_verify_dev_otp($mobile, $otp);
        }

        if (!$this->auth_key) {
            return ['success' => false, 'message' => 'SMS service is not configured.'];
        }

        if ($this->send_mode === 'flow' && $this->template_id !== '') {
            return $this->_verify_stored_otp($mobile, $otp);
        }

        if ($this->send_mode === 'otp_v5' && $this->template_id !== '') {
            return $this->_verify_v5($mobile, $otp);
        }

        if ($this->template_id) {
            return $this->_verify_v5($mobile, $otp);
        }

        return $this->_verify_legacy($mobile, $otp);
    }

    /**
     * Send OTP via MSG91 v5 Flow API (POST /api/v5/flow).
     * DLT template must be mapped to template_id in MSG91 panel.
     */
    private function _send_flow($mobile)
    {
        $otp     = $this->_generate_otp();
        $varName = $this->template_variable;

        $payload = [
            'template_id' => $this->template_id,
            'short_url'   => '0',
            'recipients'  => [
                [
                    'mobiles' => $mobile,
                    $varName  => $otp,
                ],
            ],
        ];

        log_message(
            'debug',
            'Msg91 send OTP flow — template=' . $this->template_name
            . ' id=' . $this->template_id
            . ' var=' . $varName
            . ' mobile=' . $mobile
        );

        $response = $this->_request(
            'POST',
            'https://control.msg91.com/api/v5/flow',
            json_encode($payload),
            [
                'authkey: ' . $this->auth_key,
                'accept: application/json',
                'Content-Type: application/json',
            ]
        );

        log_message(
            'error',
            'Msg91 send flow response — mobile=' . $mobile
            . ' curl_error=' . ($response['error'] ?: 'none')
            . ' body=' . $response['body']
        );

        $parsed = $this->_parse_send_response($response);
        if (!empty($parsed['success'])) {
            $this->_store_otp($mobile, $otp);
        }

        return $this->_attach_msg91_debug($parsed, $response);
    }

    private function _verify_stored_otp($mobile, $otp)
    {
        if ($this->Sk_Otp_model->verify($mobile, $otp)) {
            return ['success' => true, 'message' => 'OTP verified.'];
        }

        if (!$this->Sk_Otp_model->has_pending($mobile)) {
            return ['success' => false, 'message' => 'OTP expired or not found. Please request a new OTP.'];
        }

        return ['success' => false, 'message' => 'Invalid OTP. Please try again.'];
    }

    private function _send_v5($mobile)
    {
        // MSG91 OTP v5: template_id = MSG91 panel ID; DLT_TE_ID = DLT-approved ID (both required for India)
        $params = [
            'authkey'     => $this->auth_key,
            'template_id' => $this->template_id,
            'mobile'      => $mobile,
            'otp_length'  => $this->otp_length,
            'otp_expiry'  => $this->otp_expiry,
        ];
        if ($this->dlt_template_id !== '') {
            $params['DLT_TE_ID'] = $this->dlt_template_id;
        }
        $query = http_build_query($params);

        $body = '{}';
        if ($this->dlt_template_id !== '') {
            $body = json_encode(['DLT_TE_ID' => $this->dlt_template_id]);
        }

        log_message(
            'debug',
            'Msg91 send OTP v5 — template=' . $this->template_name
            . ' id=' . $this->template_id
            . ' dlt=' . $this->dlt_template_id
            . ' sender=' . $this->sender_id
            . ' mobile=' . $mobile
            . ' len=' . $this->otp_length
            . ' exp=' . $this->otp_expiry
        );

        $response = $this->_request(
            'POST',
            'https://control.msg91.com/api/v5/otp?' . $query,
            $body,
            ['authkey: ' . $this->auth_key, 'Content-Type: application/json']
        );

        log_message(
            'error',
            'Msg91 send v5 response — mobile=' . $mobile
            . ' curl_error=' . ($response['error'] ?: 'none')
            . ' body=' . $response['body']
        );

        return $this->_attach_msg91_debug($this->_parse_send_response($response), $response);
    }

    private function _verify_v5($mobile, $otp)
    {
        $query = http_build_query([
            'authkey' => $this->auth_key,
            'mobile'  => $mobile,
            'otp'     => $otp,
        ]);

        $url = 'https://control.msg91.com/api/v5/otp/verify?' . $query;

        log_message('debug', 'Msg91 verify OTP v5 — mobile=' . $mobile . ' otp_len=' . strlen($otp));

        $response = $this->_request(
            'GET',
            $url,
            null,
            ['authkey: ' . $this->auth_key]
        );

        log_message(
            'error',
            'Msg91 verify v5 response — mobile=' . $mobile
            . ' curl_error=' . ($response['error'] ?: 'none')
            . ' body=' . $response['body']
        );

        $parsed = $this->_parse_verify_response($response);
        return $this->_attach_msg91_debug($parsed, $response);
    }

    private function _send_legacy($mobile)
    {
        // Legacy API requires ##OTP## placeholder; DLT_TE_ID required for India delivery
        $message = $this->template_message;
        $message = str_replace('##number##', '##OTP##', $message);
        if (strpos($message, '##OTP##') === false) {
            $message = 'Indian Ladies Fashion: Your OTP is ##OTP##. Do not share this OTP with anyone. It is valid for ' . $this->otp_expiry . ' minutes.';
        }

        $legacyParams = [
            'authkey'    => $this->auth_key,
            'mobile'     => $mobile,
            'sender'     => $this->sender_id,
            'otp_length' => $this->otp_length,
            'otp_expiry' => $this->otp_expiry,
            'message'    => $message,
        ];
        if ($this->dlt_template_id !== '') {
            $legacyParams['DLT_TE_ID'] = $this->dlt_template_id;
        }
        $query = http_build_query($legacyParams);

        log_message(
            'debug',
            'Msg91 send OTP legacy — template=' . $this->template_name
            . ' dlt=' . $this->dlt_template_id
            . ' sender=' . $this->sender_id
            . ' mobile=' . $mobile
        );

        $response = $this->_request('GET', 'http://api.msg91.com/api/sendotp.php?' . $query);

        log_message(
            'error',
            'Msg91 send legacy response — mobile=' . $mobile
            . ' curl_error=' . ($response['error'] ?: 'none')
            . ' body=' . $response['body']
        );

        return $this->_attach_msg91_debug($this->_parse_send_response($response), $response);
    }

    private function _verify_legacy($mobile, $otp)
    {
        $query = http_build_query([
            'authkey' => $this->auth_key,
            'mobile'  => $mobile,
            'otp'     => $otp,
        ]);

        $response = $this->_request('GET', 'http://api.msg91.com/api/verifyRequestOTP.php?' . $query);

        return $this->_parse_verify_response($response);
    }

    private function _send_dev_otp($mobile)
    {
        $otp = $this->_generate_otp();
        $this->_store_otp($mobile, $otp);

        log_message('debug', 'Msg91_library dev OTP for ' . $mobile . ': ' . $otp);

        return [
            'success' => true,
            'message' => 'OTP sent (development mode).',
            'dev_otp' => $otp,
        ];
    }

    private function _verify_dev_otp($mobile, $otp)
    {
        if ($this->Sk_Otp_model->verify($mobile, $otp)) {
            return ['success' => true, 'message' => 'OTP verified.'];
        }

        $pending = $this->Sk_Otp_model->has_pending($mobile);
        if (!$pending) {
            return ['success' => false, 'message' => 'OTP expired or not found. Please request a new OTP.'];
        }

        return ['success' => false, 'message' => 'Invalid OTP. Please try again.'];
    }

    private function _parse_send_response($response)
    {
        if ($response['error']) {
            log_message('error', 'Msg91 send OTP failed: ' . $response['error']);
            return [
                'success' => false,
                'message' => 'MSG91 request failed: ' . $response['error'],
            ];
        }

        $body = json_decode($response['body'], true);
        if (!is_array($body)) {
            log_message('error', 'Msg91 send OTP invalid response: ' . $response['body']);
            return [
                'success' => false,
                'message' => 'MSG91 invalid response: ' . trim($response['body']),
            ];
        }

        $type    = strtolower((string) ($body['type'] ?? ''));
        $message = trim((string) ($body['message'] ?? ''));

        if ($type === 'success') {
            return [
                'success' => true,
                'message' => $message !== '' ? $message : 'OTP sent successfully.',
            ];
        }

        $failMsg = $message !== '' ? $message : 'Failed to send OTP.';
        log_message('error', 'Msg91 send OTP rejected: ' . $failMsg);
        return ['success' => false, 'message' => $failMsg];
    }

    private function _parse_verify_response($response)
    {
        if ($response['error']) {
            log_message('error', 'Msg91 verify OTP failed: ' . $response['error']);
            return ['success' => false, 'message' => 'OTP verification failed. Please try again.'];
        }

        $body = json_decode($response['body'], true);
        if (!is_array($body)) {
            log_message('error', 'Msg91 verify OTP invalid response: ' . $response['body']);
            return ['success' => false, 'message' => 'OTP verification failed. Please try again.'];
        }

        $type    = strtolower((string) ($body['type'] ?? ''));
        $message = strtolower((string) ($body['message'] ?? ''));

        if ($type === 'success' || strpos($message, 'verified') !== false || strpos($message, 'success') !== false) {
            return ['success' => true, 'message' => 'OTP verified.'];
        }

        log_message('error', 'Msg91 verify OTP rejected: ' . ($body['message'] ?? $response['body']));
        return ['success' => false, 'message' => 'Invalid OTP. Please try again.'];
    }

    private function _attach_msg91_debug(array $parsed, array $response)
    {
        $parsed['msg91_response'] = $response['body'];
        if ($response['error']) {
            $parsed['msg91_curl_error'] = $response['error'];
        }
        return $parsed;
    }

    private function _friendly_error($message)
    {
        $msg = strtolower((string) $message);
        if (strpos($msg, 'template') !== false) {
            return 'SMS template not configured correctly. Contact support.';
        }
        if (strpos($msg, 'auth') !== false) {
            return 'SMS service authentication failed. Contact support.';
        }
        return 'Failed to send OTP. Please try again.';
    }

    private function _request($method, $url, $body = null, $headers = [])
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_CUSTOMREQUEST  => strtoupper($method),
            CURLOPT_HTTPHEADER     => $headers,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($body) ? $body : json_encode($body));
        }

        $response_body = curl_exec($ch);
        $error         = curl_error($ch);
        curl_close($ch);

        return [
            'body'  => $response_body === false ? '' : $response_body,
            'error' => $error ?: null,
        ];
    }

    private function _generate_otp()
    {
        $min = (int) pow(10, $this->otp_length - 1);
        $max = (int) pow(10, $this->otp_length) - 1;
        return (string) random_int($min, $max);
    }

    private function _store_otp($mobile, $otp)
    {
        $this->Sk_Otp_model->store($mobile, $otp, $this->otp_expiry);
    }

    private function _check_rate_limit($mobile)
    {
        return $this->Sk_Otp_model->can_request($mobile, 15, 5);
    }
}
