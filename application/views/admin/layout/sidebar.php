<?php
$uri = $this->uri->segment(2); // e.g. 'dashboard', 'products'
function sk_active($seg, $match) { return $seg === $match ? 'active' : ''; }
?>
<!-- Sidebar -->
<nav id="sk-sidebar" class="sk-sidebar bg-dark text-white">
  <div class="sk-sidebar-inner pt-3 pb-5">

    <div class="px-3 mb-3">
      <small class="text-uppercase text-white-50 fw-bold" style="font-size:.65rem;letter-spacing:.08em;">Main Menu</small>
    </div>

    <ul class="nav flex-column gap-1 px-2">

      <li class="nav-item">
        <a href="<?= site_url('shopkart/dashboard') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'dashboard') ?>">
          <i class="bi bi-speedometer2 me-2"></i> Dashboard
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/products') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'products') ?>">
          <i class="bi bi-box-seam me-2"></i> Products
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/categories') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'categories') ?>">
          <i class="bi bi-diagram-3 me-2"></i> Categories
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/brands') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'brands') ?>">
          <i class="bi bi-shop me-2"></i> Brands
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/banners') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'banners') ?>">
          <i class="bi bi-images me-2"></i> Banners
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/wishlists') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'wishlists') ?>">
          <i class="bi bi-heart me-2"></i> Wishlists
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/reviews') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'reviews') ?>">
          <i class="bi bi-star-half me-2"></i> Reviews
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/testimonials') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'testimonials') ?>">
          <i class="bi bi-chat-quote me-2"></i> Testimonials
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/blogs') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'blogs') ?>">
          <i class="bi bi-journal-richtext me-2"></i> Blogs
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/orders') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'orders') ?>">
          <i class="bi bi-cart-check me-2"></i> Orders
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/customers') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'customers') ?>">
          <i class="bi bi-people me-2"></i> Customers
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/promo') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'promo') ?>">
          <i class="bi bi-ticket-perforated me-2"></i> Promo Codes
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/reports') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'reports') ?>">
          <i class="bi bi-bar-chart-line me-2"></i> Reports
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/coupon-report') ?>"
           class="nav-link sk-nav-link <?= $uri==='coupon-report'?'active':'' ?>">
          <i class="bi bi-ticket-perforated me-2"></i> Coupon Report
        </a>
      </li>

      <li class="nav-item mt-3">
        <small class="text-uppercase text-white-50 fw-bold px-2" style="font-size:.65rem;letter-spacing:.08em;">System</small>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/settings') ?>"
           class="nav-link sk-nav-link <?= sk_active($uri,'settings') ?>">
          <i class="bi bi-gear me-2"></i> Settings
        </a>
      </li>

      <li class="nav-item">
        <a href="<?= site_url('shopkart/logout') ?>" class="nav-link sk-nav-link text-danger">
          <i class="bi bi-box-arrow-left me-2"></i> Logout
        </a>
      </li>

    </ul>
  </div>
</nav>

<!-- Main Content Area -->
<main class="sk-main flex-grow-1 p-4">
