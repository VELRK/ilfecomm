import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils/formatPrice";

interface DashStats {
  total_orders: number;
  pending: number;
  delivered: number;
  total_spent: number;
  addresses: number;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  subtotal: number;
  thumbnail?: string;
}

interface RecentOrder {
  id: number;
  order_number?: string;
  status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

const STAT_CARDS = [
  { key: "total_orders", label: "Total Orders",   icon: "📦", bg: "#fdfafb", text: "#c11069", border: "rgba(193, 16, 105, 0.12)" },
  { key: "pending",      label: "Pending Orders",  icon: "⏳", bg: "#fffbeb", text: "#b45309", border: "#fef3c7" },
  { key: "delivered",    label: "Delivered",       icon: "✅", bg: "#f0fdf4", text: "#15803d", border: "#dcfce7" },
  { key: "addresses",    label: "Saved Addresses", icon: "📍", bg: "#faf5ff", text: "#6b21a8", border: "#f3e8ff" },
];

export default function AccountDashboard() {
  useAuthStore();
  const [stats, setStats]   = useState<DashStats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.dashboard()
      .then((res) => {
        const d = (res.data as { data?: { stats: DashStats; recent_orders: RecentOrder[] } }).data;
        if (d) { setStats(d.stats); setRecent(d.recent_orders); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AccountSection title="Dashboard">
      <div className="dashboard-container-custom">
        <style>{`
          .dashboard-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .stat-card-custom {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(193, 16, 105, 0.05);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            transition: all 0.3s ease;
          }

          .stat-card-custom:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 24px rgba(193, 16, 105, 0.05);
            border-color: rgba(193, 16, 105, 0.12);
          }

          .stat-info-custom .stat-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666666;
            margin-bottom: 6px;
          }

          .stat-info-custom .stat-value {
            font-size: 26px;
            font-weight: 700;
            color: #111111;
            margin: 0;
            line-height: 1;
          }

          .stat-icon-custom {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            transition: all 0.3s ease;
          }

          .stat-card-custom:hover .stat-icon-custom {
            transform: scale(1.1);
          }

          .recent-orders-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.01);
            border: 1px solid rgba(0,0,0,0.03);
          }

          .recent-orders-title-wrap {
            border-bottom: 1px solid rgba(193, 16, 105, 0.06);
            padding-bottom: 16px;
          }

          .recent-orders-title {
            font-size: 18px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 0;
          }

          .table-custom {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px;
          }

          .table-custom th {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #888888;
            padding: 10px 16px;
            border: none;
          }

          .table-custom tbody tr {
            background: #ffffff;
            transition: all 0.2s ease;
          }

          .table-custom tbody tr:hover {
            background: #fdfafb;
          }

          .table-custom td {
            padding: 14px 16px;
            vertical-align: middle;
            border-top: 1px solid #f5f5f5;
            border-bottom: 1px solid #f5f5f5;
            font-size: 14px;
            color: #444444;
          }

          .table-custom td:first-child {
            border-left: 1px solid #f5f5f5;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            font-weight: 600;
            color: #111111;
          }

          .table-custom td:last-child {
            border-right: 1px solid #f5f5f5;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
          }

          .status-badge-custom {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
          }

          .status-badge-custom.delivered {
            background: #eafaf1;
            color: #15803d;
            border: 1px solid #bbf7d0;
          }

          .status-badge-custom.pending {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fef3c7;
          }

          .status-badge-custom.shipped {
            background: #f0f9ff;
            color: #0369a1;
            border: 1px solid #e0f2fe;
          }

          .status-badge-custom.cancelled {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fee2e2;
          }

          .btn-view-custom {
            color: #c11069 !important;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .btn-view-custom:hover {
            color: #920b4e !important;
            text-decoration: underline !important;
          }
        `}</style>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-dark" role="status" /></div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              {STAT_CARDS.map((c) => (
                <div className="col-6 col-md-3" key={c.key}>
                  <div className="stat-card-custom">
                    <div className="stat-info-custom">
                      <div className="stat-label">{c.label}</div>
                      <h4 className="stat-value">
                        {c.key === "total_orders" ? stats?.total_orders ?? 0
                          : c.key === "pending"   ? stats?.pending ?? 0
                          : c.key === "delivered" ? stats?.delivered ?? 0
                          : stats?.addresses ?? 0}
                      </h4>
                    </div>
                    <div className="stat-icon-custom" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                      <span>{c.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="recent-orders-card mt-5">
              <div className="recent-orders-title-wrap mb-3 d-flex justify-content-between align-items-center">
                <h5 className="recent-orders-title">Recent Orders</h5>
                <Link to="/account-orders" className="btn-view-custom">View All</Link>
              </div>
              {recent.length === 0 ? (
                <div className="text-center py-5 rounded-3" style={{ background: "#fdfafb", border: "1px dashed rgba(193, 16, 105, 0.15)" }}>
                  <p className="mb-0 text-muted">No recent orders found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table-custom">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((order) => {
                        const stClass = order.status === "delivered" ? "delivered"
                                      : order.status === "cancelled" ? "cancelled"
                                      : order.status === "shipped"   ? "shipped"
                                      : "pending";
                        const stLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                        return (
                          <tr key={order.id}>
                            <td>#{order.order_number ?? order.id}</td>
                            <td>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td>
                              <span className={`status-badge-custom ${stClass}`}>
                                {stLabel}
                              </span>
                            </td>
                            <td className="fw-bold">{formatPrice(order.total)}</td>
                            <td>
                              <Link to="/account-orders" className="btn-view-custom">View</Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AccountSection>
  );
}
