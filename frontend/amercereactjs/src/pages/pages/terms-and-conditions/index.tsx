import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageMeta
        title="Terms & Conditions | Indian Ladies Fashion"
        description="Read the terms and conditions for using Indian Ladies Fashion's website and services."
      />

      <style>{`
        .policy-hero {
          background: linear-gradient(135deg, #fdf0f5 0%, #fce4ef 100%);
          padding: 60px 0 50px;
          text-align: center;
          border-bottom: 1px solid rgba(193,16,105,0.08);
        }
        .policy-breadcrumb {
          font-size: 13px;
          color: #888;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .policy-breadcrumb a {
          color: #c11069;
          text-decoration: none;
        }
        .policy-breadcrumb a:hover { text-decoration: underline; }
        .policy-breadcrumb span { color: #bbb; }
        .policy-hero-title {
          font-size: 36px;
          font-weight: 700;
          color: #111;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
        }
        .policy-hero-sub {
          font-size: 15px;
          color: #666;
          margin: 0;
        }
        .policy-wrap {
          padding: 60px 0 80px;
          background: #fff;
        }
        .policy-sidebar {
          position: sticky;
          top: 90px;
        }
        .policy-toc {
          background: #faf0f4;
          border-left: 3px solid #c11069;
          border-radius: 8px;
          padding: 24px 20px;
        }
        .policy-toc-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #c11069;
          margin: 0 0 14px;
        }
        .policy-toc ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .policy-toc ul li a {
          font-size: 13px;
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
          line-height: 1.4;
          display: block;
        }
        .policy-toc ul li a:hover { color: #c11069; }
        .policy-content h2 {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin: 48px 0 14px;
          padding-top: 8px;
          border-top: 1px solid #f0e0e8;
          scroll-margin-top: 100px;
        }
        .policy-content h2:first-child { margin-top: 0; border-top: none; }
        .policy-content h3 {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin: 22px 0 8px;
        }
        .policy-content p {
          font-size: 14.5px;
          color: #555;
          line-height: 1.8;
          margin: 0 0 14px;
        }
        .policy-content ul {
          padding-left: 20px;
          margin: 0 0 14px;
        }
        .policy-content ul li {
          font-size: 14.5px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 4px;
        }
        .policy-info-card {
          background: #fdf0f5;
          border: 1px solid rgba(193,16,105,0.12);
          border-radius: 10px;
          padding: 20px 22px;
          margin-bottom: 36px;
        }
        .policy-info-card p { margin: 0; color: #444; }
        .policy-info-card strong { color: #c11069; }
        .policy-highlight-box {
          background: #fff8fb;
          border: 1px solid rgba(193,16,105,0.1);
          border-left: 4px solid #c11069;
          border-radius: 6px;
          padding: 16px 20px;
          margin: 16px 0 20px;
        }
        .policy-highlight-box p { margin: 0; font-size: 14px; color: #444; }
        .policy-contact-box {
          background: linear-gradient(135deg, #c11069 0%, #920b4e 100%);
          border-radius: 12px;
          padding: 30px;
          color: #fff;
          text-align: center;
          margin-top: 48px;
        }
        .policy-contact-box h3 { color: #fff; font-size: 18px; margin: 0 0 10px; }
        .policy-contact-box p { color: rgba(255,255,255,0.88); font-size: 14px; margin: 0 0 16px; }
        .policy-contact-box a {
          display: inline-block;
          background: #fff;
          color: #c11069;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .policy-contact-box a:hover { transform: translateY(-2px); }
        @media (max-width: 767px) {
          .policy-hero { padding: 40px 0 36px; }
          .policy-hero-title { font-size: 26px; }
          .policy-wrap { padding: 40px 0 60px; }
          .policy-sidebar { display: none; }
        }
      `}</style>

      {/* Hero */}
      <div className="policy-hero">
        <div className="container">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Terms &amp; Conditions</span>
          </div>
          <h1 className="policy-hero-title">Terms &amp; Conditions</h1>
          <p className="policy-hero-sub">Last updated: May 2025 &nbsp;·&nbsp; Indian Ladies Fashion</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="policy-wrap">
        <div className="container">
          <div className="row">

            {/* Sidebar TOC */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="policy-sidebar">
                <div className="policy-toc">
                  <p className="policy-toc-title">Contents</p>
                  <ul>
                    <li><a href="#products">1. Products &amp; Services</a></li>
                    <li><a href="#pricing">2. Pricing</a></li>
                    <li><a href="#orders">3. Orders &amp; Payments</a></li>
                    <li><a href="#tailoring">4. Custom Tailoring Policy</a></li>
                    <li><a href="#returns">5. Returns &amp; Exchanges</a></li>
                    <li><a href="#delivery">6. Delivery &amp; Timelines</a></li>
                    <li><a href="#ip">7. Intellectual Property</a></li>
                    <li><a href="#usage">8. Website Usage</a></li>
                    <li><a href="#liability">9. Limitation of Liability</a></li>
                    <li><a href="#privacy">10. Privacy</a></li>
                    <li><a href="#changes">11. Changes to Terms</a></li>
                    <li><a href="#contact">12. Contact Information</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">
              <div className="policy-content">

                <div className="policy-info-card">
                  <p>Welcome to the official website of <strong>Indian Ladies Fashion</strong>. By accessing or using our website, services, or placing an order with us, you agree to the following Terms &amp; Conditions. Please read them carefully before using our services.</p>
                </div>

                <p><strong>Indian Ladies Fashion</strong><br />
                  Opposite the SNS Tech Arch, Sathy Main Road,<br />
                  Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India<br />
                  <strong>Contact:</strong> +91 95972 20129</p>
                <p>We specialize in customized tailoring, premium saree collections, designer blouses, ethnic wear, and bespoke Aari embroidery with traditional craftsmanship and modern styling.</p>

                <h2 id="products">1. Products &amp; Services</h2>
                <p>We offer:</p>
                <ul>
                  <li>Customized tailoring services</li>
                  <li>Premium saree collections</li>
                  <li>Designer blouses</li>
                  <li>Aari embroidery work</li>
                  <li>Ethnic and festive wear</li>
                  <li>Alteration and fitting services</li>
                </ul>
                <p>All products and services are subject to availability. Customized orders are tailored according to customer-provided measurements and design preferences.</p>

                <h2 id="pricing">2. Pricing</h2>
                <ul>
                  <li>All prices listed on the website are in Indian Rupees (INR).</li>
                  <li>Prices are subject to change without prior notice.</li>
                  <li>Launch offers, festive discounts, and promotional pricing are available for a limited period only.</li>
                  <li>Additional charges may apply for urgent stitching, premium fabrics, handwork, or special customization requests.</li>
                </ul>

                <h2 id="orders">3. Orders &amp; Payments</h2>
                <ul>
                  <li>Orders are confirmed only after successful payment or advance confirmation.</li>
                  <li>Customized stitching orders may require advance payment before processing.</li>
                  <li>We reserve the right to refuse or cancel any order due to incorrect pricing, unavailable materials, or unforeseen circumstances.</li>
                </ul>
                <p>Accepted payment methods may include:</p>
                <ul>
                  <li>UPI</li>
                  <li>Bank Transfer</li>
                  <li>Credit/Debit Cards</li>
                  <li>Cash (for in-store purchases)</li>
                </ul>

                <h2 id="tailoring">4. Custom Tailoring Policy</h2>
                <ul>
                  <li>Customers are responsible for providing accurate body measurements.</li>
                  <li>Minor variations may occur due to fabric type, embroidery work, or handcrafting processes.</li>
                  <li>Trial fittings may be required for certain custom designs.</li>
                  <li>Once stitching or embroidery work has started, major design changes may not be possible.</li>
                </ul>

                <h2 id="returns">5. Returns &amp; Exchanges</h2>
                <h3>Customized Products</h3>
                <div className="policy-highlight-box">
                  <p>Customized stitched products, personalized embroidery, and made-to-order items are <strong>non-returnable and non-refundable</strong>.</p>
                </div>
                <h3>Ready-Made Products</h3>
                <p>Exchange requests for eligible ready-made products must be made within 3 days of purchase or delivery.</p>
                <p>Products eligible for exchange must:</p>
                <ul>
                  <li>Be unused and unwashed</li>
                  <li>Have original tags and packaging</li>
                  <li>Be in original condition</li>
                </ul>

                <h2 id="delivery">6. Delivery &amp; Timelines</h2>
                <ul>
                  <li>Delivery timelines may vary depending on customization and embroidery work.</li>
                  <li>Delays caused by courier partners, festivals, weather conditions, or material availability are beyond our control.</li>
                  <li>Customers will be informed about estimated completion and dispatch timelines.</li>
                </ul>

                <h2 id="ip">7. Intellectual Property</h2>
                <p>All website content including images, logos, designs, product photos, embroidery patterns, and text content are the property of Indian Ladies Fashion and may not be copied, reproduced, or used without written permission.</p>

                <h2 id="usage">8. Website Usage</h2>
                <p>Users agree not to:</p>
                <ul>
                  <li>Use the website for unlawful purposes</li>
                  <li>Attempt unauthorized access to the website</li>
                  <li>Copy or misuse website content</li>
                  <li>Submit false or misleading information</li>
                </ul>

                <h2 id="liability">9. Limitation of Liability</h2>
                <p>Indian Ladies Fashion shall not be liable for:</p>
                <ul>
                  <li>Minor color variations due to screen settings</li>
                  <li>Delays beyond reasonable control</li>
                  <li>Incorrect measurements provided by customers</li>
                  <li>Indirect or incidental damages arising from product use</li>
                </ul>

                <h2 id="privacy">10. Privacy</h2>
                <p>Customer information shared with us is used only for order processing, customer support, delivery communication, and promotional updates (with consent). We do not sell or share customer information with unauthorized third parties.</p>
                <p>
                  <Link to="/privacy-policy" style={{ color: "#c11069", fontWeight: 600 }}>
                    View our full Privacy Policy →
                  </Link>
                </p>

                <h2 id="changes">11. Changes to Terms</h2>
                <p>We reserve the right to update or modify these Terms &amp; Conditions at any time without prior notice.</p>

                <h2 id="contact">12. Contact Information</h2>
                <div className="policy-contact-box">
                  <h3>Questions or Support?</h3>
                  <p>
                    Indian Ladies Fashion<br />
                    Opposite the SNS Tech Arch, Sathy Main Road,<br />
                    Saravanampatti Post, Coimbatore – 641035<br />
                    Phone: +91 95972 20129
                  </p>
                  <Link to="/contact">Contact Us</Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
