import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy | Indian Ladies Fashion"
        description="Learn how Indian Ladies Fashion collects, uses, and protects your personal information."
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
            <span>Privacy Policy</span>
          </div>
          <h1 className="policy-hero-title">Privacy Policy</h1>
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
                    <li><a href="#business-info">1. Business Information</a></li>
                    <li><a href="#info-collect">2. Information We Collect</a></li>
                    <li><a href="#how-we-use">3. How We Use Your Information</a></li>
                    <li><a href="#tailoring">4. Tailoring & Measurement</a></li>
                    <li><a href="#payment">5. Payment Security</a></li>
                    <li><a href="#cookies">6. Cookies & Analytics</a></li>
                    <li><a href="#sharing">7. Sharing of Information</a></li>
                    <li><a href="#data-protection">8. Data Protection</a></li>
                    <li><a href="#promo">9. Promotional Communication</a></li>
                    <li><a href="#third-party">10. Third-Party Links</a></li>
                    <li><a href="#children">11. Children's Privacy</a></li>
                    <li><a href="#updates">12. Policy Updates</a></li>
                    <li><a href="#contact">13. Contact Us</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">
              <div className="policy-content">

                <div className="policy-info-card">
                  <p>Welcome to the official website of <strong>Indian Ladies Fashion</strong>. Your privacy is important to us, and we are committed to protecting your personal information and ensuring a safe shopping experience.</p>
                </div>

                <h2 id="business-info">1. Business Information</h2>
                <p><strong>Indian Ladies Fashion</strong><br />
                  Opposite the SNS Tech Arch, Sathy Main Road,<br />
                  Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India</p>
                <p><strong>Contact:</strong> +91 95972 20129</p>
                <p>We specialize in customized tailoring, premium saree collections, designer ethnic wear, and bespoke Aari embroidery.</p>

                <h2 id="info-collect">2. Information We Collect</h2>
                <p>We may collect the following information from customers:</p>
                <h3>Personal Information</h3>
                <ul>
                  <li>Name</li>
                  <li>Mobile number</li>
                  <li>Email address</li>
                  <li>Billing and shipping address</li>
                  <li>Payment details (processed securely through payment providers)</li>
                </ul>
                <h3>Order Information</h3>
                <ul>
                  <li>Product selections</li>
                  <li>Tailoring measurements</li>
                  <li>Customization preferences</li>
                  <li>Purchase history</li>
                </ul>
                <h3>Technical Information</h3>
                <ul>
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Website usage data through cookies and analytics tools</li>
                </ul>

                <h2 id="how-we-use">3. How We Use Your Information</h2>
                <p>Your information may be used to:</p>
                <ul>
                  <li>Process and deliver orders</li>
                  <li>Provide tailoring and customization services</li>
                  <li>Contact you regarding orders or inquiries</li>
                  <li>Improve customer service and website experience</li>
                  <li>Send promotional offers, festive deals, or launch-special updates</li>
                  <li>Prevent fraud and maintain website security</li>
                </ul>

                <h2 id="tailoring">4. Tailoring &amp; Measurement Information</h2>
                <p>Measurement details shared for customized stitching are used only for:</p>
                <ul>
                  <li>Designing and tailoring garments</li>
                  <li>Maintaining customer fitting records for future orders</li>
                </ul>
                <p>We do not share customer measurement information with unauthorized parties.</p>

                <h2 id="payment">5. Payment Security</h2>
                <p>We use secure payment gateways and trusted payment processing services. We do not store complete debit/credit card information on our servers.</p>
                <p>All online transactions are processed through secure and encrypted systems.</p>

                <h2 id="cookies">6. Cookies &amp; Analytics</h2>
                <p>Our website may use cookies and analytics tools to:</p>
                <ul>
                  <li>Improve website functionality</li>
                  <li>Understand customer preferences</li>
                  <li>Enhance shopping experience</li>
                  <li>Analyze website traffic</li>
                </ul>
                <p>Users may disable cookies through browser settings if preferred.</p>

                <h2 id="sharing">7. Sharing of Information</h2>
                <p>We do not sell, rent, or trade customer personal information.</p>
                <p>Information may only be shared with:</p>
                <ul>
                  <li>Delivery and courier partners</li>
                  <li>Payment processing providers</li>
                  <li>Legal authorities when required by law</li>
                </ul>

                <h2 id="data-protection">8. Data Protection</h2>
                <p>We take appropriate security measures to protect customer data against:</p>
                <ul>
                  <li>Unauthorized access</li>
                  <li>Misuse</li>
                  <li>Data loss</li>
                  <li>Alteration or disclosure</li>
                </ul>
                <p>However, no online system can guarantee complete security.</p>

                <h2 id="promo">9. Promotional Communication</h2>
                <p>Customers may receive:</p>
                <ul>
                  <li>Order updates</li>
                  <li>Delivery notifications</li>
                  <li>Offer announcements</li>
                  <li>Festival sale information</li>
                </ul>
                <p>Customers can opt out of promotional messages at any time.</p>

                <h2 id="third-party">10. Third-Party Links</h2>
                <p>Our website may contain links to social media pages or third-party websites. We are not responsible for the privacy practices of external websites.</p>

                <h2 id="children">11. Children's Privacy</h2>
                <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from minors.</p>

                <h2 id="updates">12. Policy Updates</h2>
                <p>Indian Ladies Fashion reserves the right to update or modify this Privacy Policy at any time. Changes will be updated on this page.</p>

                <h2 id="contact">13. Contact Us</h2>
                <div className="policy-contact-box">
                  <h3>Questions about your privacy?</h3>
                  <p>
                    Indian Ladies Fashion<br />
                    Opposite the SNS Tech Arch, Sathy Main Road,<br />
                    Saravanampatti Post, Coimbatore – 641035<br />
                    Phone: +91 95972 20129
                  </p>
                  <Link to="/contact">Get in Touch</Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
