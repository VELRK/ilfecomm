<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| SMS / OTP Configuration (MSG91)
|--------------------------------------------------------------------------
*/

$config['sms']['provider']          = 'msg91';
$config['sms']['auth_key']          = '517702A4W9M823H6a5f6b66P1';
$config['sms']['send_mode']         = 'flow'; // flow (v5/flow API) | legacy | otp_v5
$config['sms']['template_id']       = '6a5db22e2209427ceb0fc032'; // MSG91 Flow template ID (ilf_otp_final) — DLT mapped in panel
$config['sms']['template_variable'] = 'number'; // Variable for ##number## in ilf_otp_final
$config['sms']['dlt_template_id']   = '1207178305383281647'; // DLT ID (mapped in MSG91 panel, not sent in flow API)
$config['sms']['template_name']    = 'ilf_otp_final';
$config['sms']['template_message'] = 'Indian Ladies Fashion: Your OTP is ##number##. Do not share this OTP with anyone. It is valid for 10 minutes.';
$config['sms']['sender_id']        = 'INDLAD';
$config['sms']['otp_length']       = 4;
$config['sms']['otp_expiry']       = 10;
$config['sms']['country_code']     = '91';
$config['sms']['development_mode'] = false;
