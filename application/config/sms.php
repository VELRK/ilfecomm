<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| SMS / OTP Configuration (MSG91)
|--------------------------------------------------------------------------
*/

$config['sms']['provider']         = 'msg91';
$config['sms']['auth_key']         = '517702A4W9M823H6a5f6b66P1';
$config['sms']['template_id']      = '6a5db22e2209427ceb0fc032'; // MSG91 Template ID for ilf_otp_final (DLT: 1207178305383281647)
$config['sms']['template_name']    = 'ilf_otp_final';
$config['sms']['template_message'] = 'Indian Ladies Fashion: Your OTP is ##number##. Do not share this OTP with anyone. It is valid for 10 minutes.';
$config['sms']['sender_id']        = 'INDLAD';
$config['sms']['otp_length']       = 4;
$config['sms']['otp_expiry']       = 10;
$config['sms']['country_code']     = '91';
$config['sms']['development_mode'] = false;
