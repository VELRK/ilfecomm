import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import type { ApiAddress } from "@/services/api";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

const EMPTY_FORM = {
  full_name: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "", country: "India",
  label: "Home", is_default: 0,
};

export default function AccountAddresses() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const redirectPath   = searchParams.get("redirect");

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(!!redirectPath); // Auto-show form if redirecting from checkout
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<number | null>(null);

  useEffect(() => {
    userAPI.getAddresses()
      .then((res) => setAddresses(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function field(key: keyof typeof form, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.full_name.trim()) return setError("Full name is required.");
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim()))
      return setError("Enter a valid 10-digit phone number.");
    if (!form.line1.trim()) return setError("Address line 1 is required.");
    if (!form.city.trim()) return setError("City is required.");
    if (!form.state) return setError("State is required.");
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim()))
      return setError("Enter a valid 6-digit PIN code.");

    setSaving(true);
    try {
      const res = await userAPI.saveAddress(form);
      const result = (res.data as { success: boolean; data?: { addresses: ApiAddress[] } });
      
      if (result.success && result.data?.addresses) {
        setAddresses(result.data.addresses);
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
        
        // If we have a redirect path, go back!
        if (redirectPath) {
          navigate(redirectPath);
        }
      }
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      const res = await userAPI.deleteAddress(id);
      const d = (res.data as { data?: { addresses: ApiAddress[] } }).data;
      if (d?.addresses) setAddresses(d.addresses);
      else setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch { /* silent */ }
    finally { setDeleting(null); }
  }

  return (
    <AccountSection title="My Address">
      <div className="address-container-custom">
        <style>{`
          .address-container-custom {
            font-family: 'Outfit', sans-serif;
            color: #111111;
          }

          .address-card-custom {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(193, 16, 105, 0.06);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.01);
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            transition: all 0.3s ease;
          }

          .address-card-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(193, 16, 105, 0.04);
          }

          .address-card-custom.default-active {
            border-color: #c11069;
            background: #fdfafb;
          }

          .badge-default-custom {
            background: #c11069;
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .address-label-badge {
            font-weight: 700;
            font-size: 11px;
            color: #c11069;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #faf0f2;
            padding: 4px 10px;
            border-radius: 6px;
            display: inline-block;
          }

          .address-name-custom {
            font-weight: 700;
            font-size: 16px;
            color: #111111;
            margin-top: 14px;
            margin-bottom: 8px;
          }

          .address-details-custom {
            color: #555555;
            font-size: 14px;
            line-height: 1.7;
            flex: 1;
          }

          .address-actions-custom {
            margin-top: 20px;
            display: flex;
            gap: 12px;
          }

          .btn-remove-custom {
            background: transparent;
            border: none;
            color: #dc2626;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s ease;
            outline: none;
          }

          .btn-remove-custom:hover {
            color: #991b1b;
            text-decoration: underline;
          }

          /* Form inputs styling */
          .form-card-custom {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(193, 16, 105, 0.08);
            padding: 24px;
            box-shadow: 0 4px 20px rgba(193, 16, 105, 0.02);
            margin-bottom: 30px;
          }

          .form-label-custom {
            font-weight: 600;
            font-size: 13px;
            color: #333333;
            margin-bottom: 6px;
            display: block;
          }

          .form-input-custom {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(193, 16, 105, 0.15);
            border-radius: 10px;
            font-size: 14px;
            color: #111111;
            background: #ffffff;
            outline: none;
            transition: all 0.25s ease;
          }

          .form-input-custom:focus {
            border-color: #c11069;
            box-shadow: 0 0 0 3px rgba(193, 16, 105, 0.1);
          }

          .form-input-custom::placeholder {
            color: #999999;
          }

          .btn-primary-custom {
            background: #c11069;
            color: #ffffff;
            border: 1px solid #c11069;
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-primary-custom:hover {
            background: #920b4e;
            border-color: #920b4e;
          }

          .btn-secondary-custom {
            background: transparent;
            border: 1px solid #e2e8f0;
            color: #64748b;
            border-radius: 10px;
            padding: 12px 24px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-secondary-custom:hover {
            background: #f8fafc;
            color: #334155;
            border-color: #cbd5e1;
          }

          .btn-add-address-custom {
            background: #ffffff;
            border: 1px solid #c11069;
            color: #c11069;
            border-radius: 30px;
            padding: 8px 20px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }

          .btn-add-address-custom:hover {
            background: #c11069;
            color: #ffffff;
          }

          .form-select-custom {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23c11069' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 36px;
          }
        `}</style>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-semibold mb-0" style={{ fontSize: 18 }}>My Addresses</h5>
          {!showForm && (
            <button
              type="button"
              className="btn-add-address-custom"
              onClick={() => { setShowForm(true); setError(null); setForm({ ...EMPTY_FORM }); }}
            >
              + Add New Address
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card-custom">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-bold m-0" style={{ color: "#c11069", fontSize: 15 }}>New Delivery Address</h6>
              <button type="button" className="btn-close" onClick={() => setShowForm(false)} />
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 fs-14" style={{ borderRadius: 10, marginBottom: 20 }}>
                ✕ {error}
              </div>
            )}

            <form onSubmit={handleSave} noValidate>
              {/* Label */}
              <div className="mb-3">
                <label className="form-label-custom">Address Label (e.g. Home, Office) <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  className="form-input-custom"
                  value={form.label}
                  onChange={(e) => field("label", e.target.value)}
                  placeholder="e.g. Home, Office, Work"
                  required
                />
              </div>

              {/* Name + Phone */}
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label-custom">Recipient Name <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.full_name}
                    onChange={(e) => field("full_name", e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Phone Number <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => field("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="mb-3">
                <label className="form-label-custom">Address Line 1 <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  className="form-input-custom"
                  value={form.line1}
                  onChange={(e) => field("line1", e.target.value)}
                  placeholder="House / Flat / Block, Street Name"
                  required
                />
              </div>

              {/* Address Line 2 */}
              <div className="mb-3">
                <label className="form-label-custom">Address Line 2 <span style={{ color: "#888888", fontWeight: 400 }}>(Optional)</span></label>
                <input
                  className="form-input-custom"
                  value={form.line2}
                  onChange={(e) => field("line2", e.target.value)}
                  placeholder="Colony / Sector / Landmark"
                />
              </div>

              {/* City + State + PIN */}
              <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label-custom">City <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.city}
                    onChange={(e) => field("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label-custom">State <span style={{ color: "#dc2626" }}>*</span></label>
                  <select
                    className="form-input-custom form-select-custom"
                    value={form.state}
                    onChange={(e) => field("state", e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">PIN Code <span style={{ color: "#dc2626" }}>*</span></label>
                  <input
                    className="form-input-custom"
                    value={form.pincode}
                    maxLength={6}
                    onChange={(e) => field("pincode", e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN"
                    required
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <div className="mb-4">
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#444444" }}>
                  <input
                    type="checkbox"
                    checked={form.is_default === 1}
                    onChange={(e) => field("is_default", e.target.checked ? 1 : 0)}
                    style={{ width: 18, height: 18, accentColor: "#c11069" }}
                  />
                  Set as my primary delivery address
                </label>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn-primary-custom" disabled={saving}>
                  {saving ? "Saving Address..." : "Save Address"}
                </button>
                <button
                  type="button"
                  className="btn-secondary-custom"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-dark" role="status" /></div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: "#fdfafb", border: "1px dashed rgba(193, 16, 105, 0.15)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📍</div>
            <p className="fw-bold mb-1">No Saved Addresses</p>
            <p className="text-muted mb-4 fs-14">Add delivery details to speed up your checkout process.</p>
            {!showForm && (
              <button type="button" className="btn-primary-custom" onClick={() => setShowForm(true)}>
                Add First Address
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {addresses.map((addr) => {
              const isDefault = Number(addr.is_default) === 1;
              return (
                <div key={addr.id} className="col-md-6">
                  <div className={`address-card-custom ${isDefault ? "default-active" : ""}`}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="address-label-badge">
                        📍 {addr.label}
                      </span>
                      {isDefault && (
                        <span className="badge-default-custom">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="address-name-custom">{addr.full_name}</div>
                    <div className="address-details-custom">
                      <div>{addr.line1}</div>
                      {addr.line2 && <div>{addr.line2}</div>}
                      <div>{addr.city}, {addr.state} – {addr.pincode}</div>
                      <div style={{ marginTop: 8, fontWeight: 500, color: "#111" }}>📞 {addr.phone}</div>
                    </div>
                    <div className="address-actions-custom">
                      <button
                        type="button"
                        className="btn-remove-custom"
                        onClick={() => handleDelete(addr.id)}
                        disabled={deleting === addr.id}
                      >
                        {deleting === addr.id ? "Removing…" : "Remove Address"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountSection>
  );
}
