import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { ordersAPI } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";
import { apiImageUrl } from "@/hooks/useApi";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  thumbnail?: string;
}

interface Order {
  id: number;
  order_number?: string;
  status: string;
  payment_status?: string;
  payment_method?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  promo_code?: string;
  tracking_number?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  shipping_name?: string;
  shipping_line1?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_phone?: string;
  items?: OrderItem[];
}

const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed",  icon: "📋" },
  { key: "confirmed",  label: "Confirmed",     icon: "✅" },
  { key: "processing", label: "Processing",    icon: "🔧" },
  { key: "shipped",    label: "Shipped",       icon: "🚚" },
  { key: "delivered",  label: "Delivered",     icon: "📦" },
];

const STATUS_META: Record<string, { bg: string; color: string; border: string; label: string }> = {
  pending:    { bg: "#fffbeb", color: "#b45309", border: "#fef3c7", label: "Pending"    },
  confirmed:  { bg: "#f0f9ff", color: "#0369a1", border: "#e0f2fe", label: "Confirmed"  },
  processing: { bg: "#faf5ff", color: "#6b21a8", border: "#f3e8ff", label: "Processing" },
  shipped:    { bg: "#e0f2fe", color: "#0284c7", border: "#bae6fd", label: "Shipped"    },
  delivered:  { bg: "#f0fdf4", color: "#15803d", border: "#dcfce7", label: "Delivered"  },
  cancelled:  { bg: "#fef2f2", color: "#dc2626", border: "#fee2e2", label: "Cancelled"  },
  returned:   { bg: "#fff7ed", color: "#c2410c", border: "#ffedd5", label: "Returned"   },
};

const TABS = [
  { id: "all",       label: "All Orders" },
  { id: "pending",   label: "Pending"   },
  { id: "shipped",   label: "Shipped"   },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

function StatusTimeline({ status }: { status: string }) {
  if (status === "cancelled" || status === "returned") {
    const meta = STATUS_META[status] ?? STATUS_META.cancelled;
    return (
      <div style={{
        padding: "12px 16px",
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        borderRadius: 12,
        color: meta.color,
        fontWeight: 600,
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }}>
        {status === "cancelled" ? "❌ Order Cancelled" : "↩️ Return Requested"}
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 12, overflowX: "auto", paddingBottom: 6 }}>
      {STATUS_STEPS.map((step, idx) => {
        const completed = idx < currentIdx;   // past steps
        const active    = idx === currentIdx;  // current step
        const isPastOrActive = completed || active;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: isPastOrActive ? "#c11069" : "#f1f5f9",
                color: isPastOrActive ? "#fff" : "#94a3b8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: active ? 16 : 13,
                border: active ? "3px solid #c11069" : "2px solid " + (completed ? "#c11069" : "#e2e8f0"),
                transition: "all 0.2s",
                boxShadow: active ? "0 0 0 4px rgba(193, 16, 105, 0.15)" : "none",
              }}>
                {completed ? "✓" : step.icon}
              </div>
              <span style={{
                fontSize: 11,
                color: isPastOrActive ? "#c11069" : "#94a3b8",
                fontWeight: isPastOrActive ? 600 : 400,
                whiteSpace: "nowrap"
              }}>
                {step.label}
              </span>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div style={{
                height: 2,
                width: 40,
                background: completed ? "#c11069" : "#e2e8f0",
                marginBottom: 22,
                flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AccountOrders() {
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expanded,  setExpanded]  = useState<number | null>(null);

  useEffect(() => {
    ordersAPI.getAll()
      .then((res) => setOrders((res.data as { data?: Order[] }).data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const countOf = (id: string) =>
    id === "all" ? orders.length : orders.filter((o) => o.status === id).length;

  return (
    <AccountSection title="My Orders">
      <div className="orders-container-custom">
        <style>{`
          .orders-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .orders-tabs-custom {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            list-style: none;
            padding: 0;
            margin: 0 0 28px 0;
            border-bottom: 1px solid rgba(193, 16, 105, 0.08);
          }

          .orders-tab-item-custom {
            margin-bottom: -1px;
          }

          .orders-tab-btn-custom {
            display: inline-block;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            transition: all 0.25s ease;
            text-decoration: none !important;
          }

          .orders-tab-btn-custom:hover {
            color: #c11069;
          }

          .orders-tab-btn-custom.active {
            color: #c11069;
            font-weight: 600;
            border-bottom-color: #c11069;
          }

          .orders-tab-count {
            margin-left: 6px;
            font-size: 11px;
            opacity: 0.65;
            background: rgba(193, 16, 105, 0.06);
            padding: 2px 6px;
            border-radius: 10px;
            color: #c11069;
          }

          .order-card-custom {
            background: #ffffff;
            border: 1px solid rgba(193, 16, 105, 0.06);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
            margin-bottom: 24px;
            transition: box-shadow 0.3s ease;
          }

          .order-card-custom:hover {
            box-shadow: 0 8px 24px rgba(193, 16, 105, 0.04);
          }

          .order-header-custom {
            padding: 18px 24px;
            background: #fdfafb;
            border-bottom: 1px solid rgba(193, 16, 105, 0.06);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }

          .order-header-info {
            display: flex;
            flex-wrap: wrap;
            gap: 28px;
          }

          .order-header-col .col-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #888888;
            margin-bottom: 4px;
          }

          .order-header-col .col-value {
            font-size: 14px;
            font-weight: 600;
            color: #111111;
          }

          .order-header-col .col-value.total {
            color: #c11069;
            font-weight: 700;
          }

          .status-badge-timeline {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
            border: 1px solid transparent;
          }

          .btn-details-custom {
            background: #ffffff;
            border: 1px solid rgba(193, 16, 105, 0.18);
            color: #c11069;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 16px;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-details-custom:hover {
            background: #c11069;
            color: #ffffff;
            border-color: #c11069;
          }

          .timeline-container-custom {
            padding: 18px 24px;
            border-bottom: 1px solid #fdfafb;
            background: #ffffff;
          }

          .items-preview-custom {
            padding: 20px 24px;
            background: #ffffff;
          }

          .items-scroll-custom {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding-bottom: 6px;
          }

          .item-thumb-card {
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid #f3f3f3;
            padding: 10px 14px;
            border-radius: 12px;
            background: #ffffff;
            flex-shrink: 0;
            transition: border-color 0.2s ease;
          }

          .item-thumb-card:hover {
            border-color: rgba(193, 16, 105, 0.15);
          }

          .item-thumb-img {
            width: 48px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            background: #fafafa;
          }

          .item-thumb-details {
            font-size: 13px;
          }

          .item-thumb-title {
            font-weight: 600;
            color: #111111;
            max-width: 140px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-thumb-qty {
            color: #777777;
            font-size: 12px;
            margin-bottom: 2px;
          }

          .item-thumb-price {
            font-weight: 700;
            color: #111111;
          }

          .order-expanded-custom {
            padding: 0 24px 24px 24px;
            border-top: 1px dashed rgba(193, 16, 105, 0.12);
            background: #ffffff;
          }

          .expanded-grid-custom {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }

          @media (max-width: 768px) {
            .expanded-grid-custom {
              grid-template-columns: 1fr;
            }
          }

          .expanded-panel-custom {
            background: #fdfafb;
            border: 1px solid rgba(193, 16, 105, 0.05);
            border-radius: 12px;
            padding: 20px;
          }

          .panel-title-custom {
            font-size: 13px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 14px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            border-bottom: 1px dashed rgba(193, 16, 105, 0.1);
            padding-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .row-summary-custom {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: #555555;
            margin-bottom: 8px;
          }

          .row-summary-custom.total {
            font-weight: 700;
            font-size: 15px;
            color: #c11069;
            border-top: 1px solid rgba(193, 16, 105, 0.1);
            padding-top: 10px;
            margin-top: 6px;
          }

          .address-info-custom {
            font-size: 13.5px;
            line-height: 1.7;
            color: #444444;
          }
        `}</style>

        {/* Tabs */}
        <ul className="orders-tabs-custom">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const count  = countOf(tab.id);
            return (
              <li key={tab.id} className="orders-tab-item-custom">
                <button
                  type="button"
                  className={`orders-tab-btn-custom ${active ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {count > 0 && <span className="orders-tab-count">{count}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Content */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-dark" role="status" /></div>
        ) : visible.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: "#fdfafb", border: "1px dashed rgba(193, 16, 105, 0.15)" }}>
            <p className="mb-3 text-muted">No orders found in this filter.</p>
            <Link to="/shop-default" className="tf-btn btn-sm animate-btn" style={{ background: "#c11069", borderColor: "#c11069" }}>Shop Now</Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {visible.map((order) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.pending;
              const isExpanded = expanded === order.id;

              return (
                <div key={order.id} className="order-card-custom">
                  {/* Order header */}
                  <div className="order-header-custom">
                    <div className="order-header-info">
                      <div className="order-header-col">
                        <div className="col-label">Order ID</div>
                        <div className="col-value">#{order.order_number ?? order.id}</div>
                      </div>
                      <div className="order-header-col">
                        <div className="col-label">Placed On</div>
                        <div className="col-value">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                      <div className="order-header-col">
                        <div className="col-label">Total Amount</div>
                        <div className="col-value total">{formatPrice(order.total)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="status-badge-timeline" style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
                        {meta.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                        className="btn-details-custom"
                      >
                        {isExpanded ? "Hide Details" : "Details"}
                      </button>
                    </div>
                  </div>

                  {/* Status timeline */}
                  <div className="timeline-container-custom">
                    <StatusTimeline status={order.status} />
                    {order.tracking_number && (
                      <div style={{ marginTop: 12, fontSize: 13, color: "#c11069", fontWeight: 600 }}>
                        🚚 Tracking Code: <span style={{ background: "#faf0f2", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.5px" }}>{order.tracking_number}</span>
                      </div>
                    )}
                  </div>

                  {/* Items preview */}
                  <div className="items-preview-custom">
                    <div className="items-scroll-custom">
                      {(order.items ?? []).slice(0, 4).map((item, i) => (
                        <div key={i} className="item-thumb-card">
                          <img
                            src={apiImageUrl(item.thumbnail)}
                            alt={item.product_name}
                            className="item-thumb-img"
                          />
                          <div className="item-thumb-details">
                            <div className="item-thumb-title" title={item.product_name}>
                              {item.product_name}
                            </div>
                            <div className="item-thumb-qty">Qty: {item.quantity}</div>
                            <div className="item-thumb-price">{formatPrice(item.subtotal)}</div>
                          </div>
                        </div>
                      ))}
                      {(order.items?.length ?? 0) > 4 && (
                        <div style={{ display: "flex", alignItems: "center", color: "#c11069", fontSize: 13, fontWeight: 600, paddingLeft: 10 }}>
                          +{(order.items?.length ?? 0) - 4} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="order-expanded-custom">
                      <div className="expanded-grid-custom">
                        {/* Order totals */}
                        <div className="expanded-panel-custom">
                          <div className="panel-title-custom">🧾 Billing Details</div>
                          <div className="row-summary-custom">
                            <span>Subtotal</span><span>{formatPrice(order.subtotal ?? order.total)}</span>
                          </div>
                          {(order.discount ?? 0) > 0 && (
                            <div className="row-summary-custom" style={{ color: "#15803d", fontWeight: 500 }}>
                              <span>Promo Discount ({order.promo_code})</span>
                              <span>-{formatPrice(order.discount!)}</span>
                            </div>
                          )}
                          <div className="row-summary-custom">
                            <span>Shipping Costs</span>
                            <span>{(order.shipping ?? 0) === 0 ? <span style={{ color: "#15803d", fontWeight: 600 }}>Free</span> : formatPrice(order.shipping!)}</span>
                          </div>
                          <div className="row-summary-custom total">
                            <span>Grand Total</span><span>{formatPrice(order.total)}</span>
                          </div>
                          <div style={{ marginTop: 12, fontSize: 12, color: "#666666", display: "flex", gap: 10 }}>
                            <span>Method: <strong style={{ color: "#333" }}>{order.payment_method?.toUpperCase()}</strong></span>
                            <span>·</span>
                            <span>Status: <strong style={{ color: "#333" }}>{order.payment_status}</strong></span>
                          </div>
                        </div>

                        {/* Delivery address */}
                        <div className="expanded-panel-custom">
                          <div className="panel-title-custom">📍 Delivery Address</div>
                          <div className="address-info-custom">
                            <div style={{ fontWeight: 700, color: "#111", marginBottom: 4 }}>{order.shipping_name}</div>
                            <div>{order.shipping_line1}</div>
                            <div>{order.shipping_city}{order.shipping_state ? ", " + order.shipping_state : ""} – {order.shipping_pincode}</div>
                            {order.shipping_phone && <div style={{ marginTop: 8, fontWeight: 500 }}>📞 Phone: {order.shipping_phone}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountSection>
  );
}
