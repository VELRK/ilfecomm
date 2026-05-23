import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_NAV_ITEMS } from "./accountNav";
import { useAuthStore } from "@/store/authStore";

export default function AccountSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="sidebar-account-custom">
      <style>{`
        .sidebar-account-custom {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(193, 16, 105, 0.06);
          box-shadow: 0 8px 30px rgba(193, 16, 105, 0.03);
          padding: 16px 12px;
          margin-bottom: 30px;
          position: sticky;
          top: 100px;
        }

        .my-account-nav-custom {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .link-account-custom {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          color: #555555;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 500;
          border-radius: 10px;
          border-left: 3px solid transparent;
          background: transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none !important;
          width: 100%;
          text-align: left;
          border-top: none;
          border-right: none;
          border-bottom: none;
        }

        .link-account-custom .icon {
          font-size: 20px;
          color: #777777;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .link-account-custom:hover {
          color: #c11069;
          background: #fdfafb;
          border-left-color: rgba(193, 16, 105, 0.3);
        }

        .link-account-custom:hover .icon {
          color: #c11069;
          transform: translateX(2px);
        }

        .link-account-custom.active {
          color: #c11069;
          background: #faf0f2;
          font-weight: 600;
          border-left-color: #c11069;
        }

        .link-account-custom.active .icon {
          color: #c11069;
        }

        .logout-btn-custom {
          border-top: 1px dashed rgba(193, 16, 105, 0.1) !important;
          border-radius: 0 !important;
          margin-top: 12px;
          padding-top: 18px;
        }
      `}</style>
      <div className="my-account-nav-custom">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`link-account-custom ${active ? "active" : ""}`}
            >
              <i className={`icon ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="link-account-custom logout-btn-custom"
        >
          <i className="icon icon-SignOut" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
