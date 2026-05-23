import { useState, useEffect } from "react";

interface Section {
  id: string;
  title: string;
  icon: string;
}

const sections: Section[] = [
  { id: "business-info", title: "1. Business Information", icon: "🏢" },
  { id: "customized-products", title: "2. Customized Products", icon: "✂️" },
  { id: "sarees-ready-made", title: "3. Sarees & Ready-Made", icon: "🛍️" },
  { id: "non-returnable", title: "4. Non-Returnable Items", icon: "🚫" },
  { id: "damaged-incorrect", title: "5. Damaged or Defective", icon: "⚠️" },
  { id: "refund-policy", title: "6. Refund Policy", icon: "💰" },
  { id: "cancellation-policy", title: "7. Cancellation Policy", icon: "🛑" },
  { id: "color-variation", title: "8. Color & Design", icon: "🎨" },
  { id: "shipping-charges", title: "9. Shipping Charges", icon: "🚚" },
  { id: "contact-us", title: "10. Contact Us", icon: "📞" },
];

function ReturnRefundContent() {
  const [activeSection, setActiveSection] = useState<string>("business-info");

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "-10% 0px -70% 0px",
      threshold: [0.1, 0.3, 0.5],
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // account for header sticky height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <section className="flat-spacing-1 bg-light-pink-subtle">
      {/* Premium Styling */}
      <style>{`
        .bg-light-pink-subtle {
          background-color: #fdfafb;
          padding: 60px 0;
          font-family: 'Outfit', sans-serif;
        }

        .policy-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        /* Sticky Navigation Sidebar */
        .policy-sidebar {
          position: sticky;
          top: 100px;
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 6px 20px rgba(193, 16, 105, 0.03);
          border: 1px solid rgba(193, 16, 105, 0.05);
          max-height: calc(100vh - 140px);
          overflow-y: auto;
        }

        .policy-sidebar-title {
          font-size: 16px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(193, 16, 105, 0.08);
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .policy-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .policy-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #555555;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-left: 3px solid transparent;
        }

        .policy-nav-link:hover {
          color: #c11069;
          background-color: #faf0f2;
          padding-left: 18px;
        }

        .policy-nav-link.active {
          color: #ffffff;
          background-color: #c11069;
          border-left-color: #920b4e;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(193, 16, 105, 0.15);
        }

        .policy-nav-icon {
          font-size: 16px;
        }

        /* Content Area Cards */
        .policy-content-col {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .policy-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          scroll-margin-top: 100px;
        }

        .policy-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(193, 16, 105, 0.05);
          border-color: rgba(193, 16, 105, 0.1);
        }

        .policy-card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
          padding-bottom: 14px;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
        }

        .policy-card-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #faf0f2;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #c11069;
          flex-shrink: 0;
        }

        .policy-card-title {
          font-size: 20px;
          font-weight: 600;
          color: #111111;
          margin: 0;
        }

        .policy-card-text {
          font-size: 15px;
          line-height: 1.7;
          color: #444444;
          margin-bottom: 0;
        }

        .policy-card-text p {
          margin-bottom: 14px;
        }

        .policy-card-text p:last-child {
          margin-bottom: 0;
        }

        /* Customized Highlight Block (Warning Accent) */
        .policy-card-alert {
          background-color: #fff9fa;
          border: 1px solid rgba(193, 16, 105, 0.15);
          border-left: 4px solid #c11069;
        }

        .policy-card-alert .policy-card-icon-wrapper {
          background: #ffeef2;
        }

        /* Bullet lists & checklist items */
        .policy-list {
          list-style: none;
          padding-left: 0;
          margin: 18px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .policy-list li {
          position: relative;
          padding-left: 24px;
          font-size: 15px;
          color: #444444;
          line-height: 1.5;
        }

        .policy-list li::before {
          content: "✦";
          position: absolute;
          left: 0;
          color: #c11069;
          font-weight: bold;
        }

        /* Non-returnable Badge styles */
        .badge-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 18px 0;
        }

        .badge-policy {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .badge-policy-danger {
          background: #ffeef2;
          color: #c11069;
          border: 1px solid rgba(193, 16, 105, 0.2);
        }

        .badge-policy-success {
          background: #e6f6ee;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        /* Info box for quick highlights */
        .info-highlight-box {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 16px;
          border-left: 4px solid #6c757d;
          font-size: 14px;
          color: #555555;
          margin-top: 16px;
          line-height: 1.5;
        }

        .info-highlight-box-accent {
          border-left-color: #c11069;
          background: #fdf8fa;
        }

        /* Contact Details Layout */
        .contact-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .contact-details-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-detail-card {
          background: #fdfafb;
          border: 1px solid rgba(193, 16, 105, 0.06);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.25s ease;
        }

        .contact-detail-card:hover {
          border-color: #c11069;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(193, 16, 105, 0.04);
        }

        .contact-detail-card-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .contact-detail-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contact-detail-card-text {
          font-size: 14px;
          color: #555555;
          line-height: 1.4;
        }

        .contact-link {
          color: #c11069;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .contact-link:hover {
          color: #920b4e;
          text-decoration: underline;
        }

        /* Mobile Scroll Navigation */
        @media (max-width: 991px) {
          .policy-sidebar {
            position: sticky;
            top: 60px;
            max-height: none;
            padding: 12px;
            margin-bottom: 24px;
            background: #ffffff;
            border-radius: 10px;
          }

          .policy-sidebar-title {
            display: none;
          }

          .policy-nav-list {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 4px;
            gap: 8px;
            -webkit-overflow-scrolling: touch;
          }

          .policy-nav-list::-webkit-scrollbar {
            height: 4px;
          }

          .policy-nav-list::-webkit-scrollbar-thumb {
            background-color: rgba(193, 16, 105, 0.15);
            border-radius: 4px;
          }

          .policy-nav-link {
            padding: 8px 14px;
            font-size: 13px;
            border-left: none;
            border-bottom: 2px solid transparent;
            border-radius: 6px;
          }

          .policy-nav-link:hover {
            padding-left: 14px;
            background-color: rgba(193, 16, 105, 0.05);
          }

          .policy-nav-link.active {
            border-left-color: transparent;
            border-bottom-color: #920b4e;
          }
        }
      `}</style>

      <div className="policy-container">
        <div className="row">
          {/* Table of Contents Column */}
          <div className="col-lg-3">
            <div className="policy-sidebar">
              <h4 className="policy-sidebar-title">Table of Contents</h4>
              <ul className="policy-nav-list">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      className={`policy-nav-link border-0 text-start w-100 ${
                        activeSection === sec.id ? "active" : ""
                      }`}
                      onClick={() => scrollToSection(sec.id)}
                    >
                      <span className="policy-nav-icon">{sec.icon}</span>
                      <span>{sec.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policy Text Content Column */}
          <div className="col-lg-9 policy-content-col">
            {/* 1. Business Information */}
            <div id="business-info" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🏢</div>
                <h4 className="policy-card-title">1. Business Information</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  Welcome to <strong>Indian Ladies Fashion</strong>. We strive to provide
                  premium-quality ethnic wear, customized tailoring, and handcrafted Aari
                  embroidery services with complete customer satisfaction.
                </p>
                <div className="info-highlight-box">
                  <strong>Indian Ladies Fashion</strong>
                  <br />
                  Opposite the SNS Tech Arch, Sathy Main Road,
                  <br />
                  Saravanampatti Post, Coimbatore – 641035, Tamil Nadu, India
                  <br />
                  <strong>Contact Phone:</strong>{" "}
                  <a href="tel:+919597220129" className="contact-link">
                    +91 95972 20129
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Customized & Tailored Products */}
            <div id="customized-products" className="policy-card policy-card-alert">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">✂️</div>
                <h4 className="policy-card-title">2. Customized &amp; Tailored Products</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  Since customized stitching, blouse tailoring, alterations, and Aari
                  embroidery work are specially made according to your specific size and style
                  requirements, these products are:
                </p>
                <div className="badge-grid">
                  <span className="badge-policy badge-policy-danger">
                    🚫 Non-Returnable
                  </span>
                  <span className="badge-policy badge-policy-danger">
                    🚫 Non-Exchangeable
                  </span>
                  <span className="badge-policy badge-policy-danger">
                    🚫 Non-Refundable
                  </span>
                </div>
                <p>This includes:</p>
                <ul className="policy-list">
                  <li>Customized blouses</li>
                  <li>Tailor-stitched salwars</li>
                  <li>Altered garments</li>
                  <li>Personalized embroidery work</li>
                  <li>Made-to-order ethnic wear</li>
                </ul>
                <div className="info-highlight-box info-highlight-box-accent">
                  💡 <strong>Note:</strong> Customers are requested to provide accurate measurements
                  and double-confirm design details before order processing begins.
                </div>
              </div>
            </div>

            {/* 3. Sarees & Ready-Made Products */}
            <div id="sarees-ready-made" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🛍️</div>
                <h4 className="policy-card-title">3. Sarees &amp; Ready-Made Products</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  Eligible ready-made products and sarees may be exchanged, provided that you
                  fulfill the following requirements:
                </p>
                <div className="badge-grid">
                  <span className="badge-policy badge-policy-success">
                    ⏳ Request within 3 Days
                  </span>
                  <span className="badge-policy badge-policy-success">
                    ✓ Tags &amp; Original Packaging
                  </span>
                </div>
                <p>The product must be:</p>
                <ul className="policy-list">
                  <li>Unused and unworn</li>
                  <li>Unwashed</li>
                  <li>Undamaged</li>
                  <li>In its original packaging with all tags intact</li>
                </ul>
                <div className="info-highlight-box">
                  ℹ️ <strong>Please note:</strong> Exchange approval is subject to product
                  inspection upon return.
                </div>
              </div>
            </div>

            {/* 4. Non-Returnable Items */}
            <div id="non-returnable" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🚫</div>
                <h4 className="policy-card-title">4. Non-Returnable Items</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  The following items are strictly non-eligible for return, exchange, or
                  refund:
                </p>
                <ul className="policy-list">
                  <li>Customized or stitched garments</li>
                  <li>Aari embroidery products</li>
                  <li>Discounted or clearance sale items</li>
                  <li>Gift cards or promotional products</li>
                  <li>Products damaged due to customer misuse</li>
                  <li>Products altered after delivery</li>
                </ul>
              </div>
            </div>

            {/* 5. Damaged or Incorrect Products */}
            <div id="damaged-incorrect" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">⚠️</div>
                <h4 className="policy-card-title">5. Damaged or Incorrect Products</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  If you receive a <strong>damaged item</strong>, <strong>wrong product</strong>,
                  or <strong>defective product</strong>, please contact us immediately:
                </p>
                <div className="badge-grid">
                  <span className="badge-policy badge-policy-danger">
                    🚨 Report within 24 Hours
                  </span>
                </div>
                <p>Please provide the following details in your contact request:</p>
                <ul className="policy-list">
                  <li>Order details (order number)</li>
                  <li>Clear photos of the product highlighting the damage/defect</li>
                  <li>Invoice or proof of purchase</li>
                </ul>
                <p>
                  After verification from our team, we will happily offer one of the
                  following solutions:
                </p>
                <ul className="policy-list">
                  <li>Product Replacement</li>
                  <li>Store Credit</li>
                  <li>Product Exchange (if applicable)</li>
                </ul>
              </div>
            </div>

            {/* 6. Refund Policy */}
            <div id="refund-policy" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">💰</div>
                <h4 className="policy-card-title">6. Refund Policy</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  Refunds are applicable only in approved cases where:
                </p>
                <ul className="policy-list">
                  <li>The ordered product is unavailable</li>
                  <li>Payment was deducted but the order failed on the system</li>
                  <li>Approved cancellation request before customization work begins</li>
                </ul>
                <div className="info-highlight-box info-highlight-box-accent">
                  ⌛ Refunds, once approved, will be processed back to the original payment
                  method within <strong>7–10 business days</strong>.
                </div>
              </div>
            </div>

            {/* 7. Cancellation Policy */}
            <div id="cancellation-policy" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🛑</div>
                <h4 className="policy-card-title">7. Cancellation Policy</h4>
              </div>
              <div className="policy-card-text">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="contact-detail-card h-100">
                      <div className="contact-detail-card-icon">✂️</div>
                      <div className="contact-detail-card-title">Customized Orders</div>
                      <div className="contact-detail-card-text">
                        Customized tailoring and embroidery orders <strong>cannot be cancelled</strong> once work has started.
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="contact-detail-card h-100">
                      <div className="contact-detail-card-icon">🛍️</div>
                      <div className="contact-detail-card-title">Ready-Made Products</div>
                      <div className="contact-detail-card-text">
                        Orders for standard items and sarees may be cancelled <strong>before dispatch</strong> confirmation.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Color & Design Variation */}
            <div id="color-variation" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🎨</div>
                <h4 className="policy-card-title">8. Color &amp; Design Variation</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  Slight color and design variations may occur. These are standard in handcrafted and ethnic products due to:
                </p>
                <ul className="policy-list">
                  <li>Screen display settings on different devices</li>
                  <li>Studio lighting during photography</li>
                  <li>Handcrafted nature of embroidery and dye processes</li>
                </ul>
                <p>
                  Please note that such minor variations are not considered manufacturing defects.
                </p>
              </div>
            </div>

            {/* 9. Shipping Charges */}
            <div id="shipping-charges" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">🚚</div>
                <h4 className="policy-card-title">9. Shipping Charges</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  Shipping and handling charges are non-refundable.
                </p>
                <p>
                  Customers may need to bear the return shipping costs for approved exchanges, unless the return is due to a mistake on our side (e.g. damaged or wrong product).
                </p>
              </div>
            </div>

            {/* 10. Contact Us */}
            <div id="contact-us" className="policy-card">
              <div className="policy-card-header">
                <div className="policy-card-icon-wrapper">📞</div>
                <h4 className="policy-card-title">10. Contact Us</h4>
              </div>
              <div className="policy-card-text">
                <p>
                  For any support, questions, or clarification regarding our Return, Exchange, or Refund policies, please reach out to us:
                </p>
                <div className="contact-details-grid">
                  <div className="contact-detail-card">
                    <div className="contact-detail-card-icon">📍</div>
                    <div className="contact-detail-card-title">Visit Our Store</div>
                    <div className="contact-detail-card-text">
                      <strong>Indian Ladies Fashion</strong>
                      <br />
                      Opposite the SNS Tech Arch, Sathy Main Road,
                      Saravanampatti Post, Coimbatore – 641035
                    </div>
                  </div>
                  <div className="contact-detail-card">
                    <div className="contact-detail-card-icon">📞</div>
                    <div className="contact-detail-card-title">Call Us</div>
                    <div className="contact-detail-card-text">
                      Feel free to speak to our support desk:
                      <br />
                      <a href="tel:+919597220129" className="contact-link">
                        +91 95972 20129
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReturnRefundContent;
