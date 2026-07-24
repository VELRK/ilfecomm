<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/** Admin panel display brand (labels only — routes/code unchanged). */
function sk_admin_brand() {
    return 'ILF';
}

/** Page title suffix for admin panel, e.g. "Dashboard - ILF Admin". */
function sk_admin_title($page) {
    return $page . ' - ' . sk_admin_brand() . ' Admin';
}
