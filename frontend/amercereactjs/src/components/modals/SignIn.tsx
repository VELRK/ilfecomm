import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";

const OTP_LENGTH = 4;

export default function SignIn({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [tab, setTab] = useState<"email" | "otp">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const otpEmailRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function closeModal() {
    import("bootstrap").then(({ Modal }) => {
      const el = document.getElementById("sign");
      if (el) Modal.getInstance(el)?.hide();
    });
  }

  function switchTab(t: "email" | "otp") {
    setTab(t);
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setError("");
  }

  /* ── OTP digit input handling ── */
  const handleOtpDigit = useCallback((idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }, [otpDigits]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[lastFilled]?.focus();
  }, []);

  const otpValue = otpDigits.join("");

  /* ── Email login ── */
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const email = emailRef.current?.value.trim() ?? "";
    const password = passRef.current?.value ?? "";
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      closeModal();
      navigate("/account-page");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP request ── */
  async function handleOtpRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const emailVal = otpEmailRef.current?.value.trim() ?? "";
    if (!emailVal) return;
    setLoading(true);
    try {
      await authAPI.otpRequest({ phone: emailVal });
      setLoginEmail(emailVal);
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP verify ── */
  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!loginEmail || otpValue.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.otpVerify({ phone: loginEmail, otp: otpValue });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      closeModal();
      const hasRealEmail = user.email && !user.email.startsWith("ph_");
      navigate(hasRealEmail ? "/account-page" : "/account-setting");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="sign"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>

          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Login</h3>
            <p className="desc-pop cl-text-2">
              Welcome back. Sign in to access your account.
            </p>
          </div>

          <div className="modal-main">
            {/* Tab switcher using standard theme style */}
            <div className="d-flex mb-24 pb-2" style={{ borderBottom: "1px solid #eee" }}>
              <button
                type="button"
                className={`flex-grow-1 border-0 bg-transparent fw-semibold pb-10 transition ${tab === "email" ? "text-primary border-bottom border-primary border-2" : "text-muted"}`}
                onClick={() => switchTab("email")}
                style={{ fontSize: "15px" }}
              >
                Sign in with Password
              </button>
              <button
                type="button"
                className={`flex-grow-1 border-0 bg-transparent fw-semibold pb-10 transition ${tab === "otp" ? "text-primary border-bottom border-primary border-2" : "text-muted"}`}
                onClick={() => switchTab("otp")}
                style={{ fontSize: "15px" }}
              >
                Sign in with OTP
              </button>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-16 text-caption-01" role="alert">
                {error}
              </div>
            )}

            {/* ── Email form ── */}
            {tab === "email" && (
              <form className="form-log" onSubmit={handleEmailSubmit} noValidate>
                <div className="form-content">
                  <fieldset className="tf-field">
                    <label className="tf-lable fw-medium" htmlFor="si-email">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      id="si-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </fieldset>

                  <fieldset className="tf-field password-wrapper">
                    <label className="tf-lable fw-medium" htmlFor="si-pass">
                      Password <span className="text-primary">*</span>
                    </label>
                    <PasswordField
                      inputRef={passRef}
                      id="si-pass"
                      placeholder="Enter your password"
                      required
                    />
                  </fieldset>

                  <fieldset className="field-bottom mb-20">
                    <div className="checkbox-wrap">
                      <input className="tf-check style-2" type="checkbox" id="si-remember" />
                      <label htmlFor="si-remember"> Remember me </label>
                    </div>
                    <a href="#modalForgot" data-bs-toggle="modal" className="link text-decoration-underline">
                      <span className="text-caption-01 fw-semibold">Forgot Password?</span>
                    </a>
                  </fieldset>
                </div>

                <div className="group-action">
                  <button
                    type="submit"
                    className="action-create-account tf-btn animate-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                  <a href="#register" data-bs-toggle="modal" className="tf-btn btn-stroke w-100 mt-12">
                    Create New Account
                  </a>
                </div>
              </form>
            )}

            {/* ── OTP: email entry ── */}
            {tab === "otp" && !otpSent && (
              <form className="form-log" onSubmit={handleOtpRequest} noValidate>
                <div className="form-content">
                  <fieldset className="tf-field">
                    <label className="tf-lable fw-medium" htmlFor="si-otp-email">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      ref={otpEmailRef}
                      id="si-otp-email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </fieldset>
                </div>

                <div className="group-action">
                  <button
                    type="submit"
                    className="action-create-account tf-btn animate-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP…" : "Send OTP"}
                  </button>
                  <a href="#register" data-bs-toggle="modal" className="tf-btn btn-stroke w-100 mt-12">
                    Create New Account
                  </a>
                </div>
              </form>
            )}

            {/* ── OTP: digit entry ── */}
            {tab === "otp" && otpSent && (
              <form className="form-log" onSubmit={handleOtpVerify} noValidate>
                <div className="text-center mb-24">
                  <p className="mb-4">OTP sent to <strong>{loginEmail}</strong></p>
                  <p className="text-muted small">Enter the 4-digit code (e.g. 1234)</p>
                </div>

                <div className="d-flex justify-content-center gap-2 mb-24" onPaste={handleOtpPaste}>
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      style={{
                        width: "48px",
                        height: "54px",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: d ? "#f8f9fa" : "#fff"
                      }}
                      onChange={(e) => handleOtpDigit(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>

                <div className="group-action">
                  <button
                    type="submit"
                    className="action-create-account tf-btn animate-btn w-100"
                    disabled={loading || otpValue.length < OTP_LENGTH}
                  >
                    {loading ? "Verifying…" : "Verify & Sign In"}
                  </button>

                  <div className="d-flex justify-content-between align-items-center mt-16">
                    <button
                      type="button"
                      className="bg-transparent border-0 text-primary small text-decoration-underline"
                      onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); }}
                    >
                      ← Change email
                    </button>

                    <button
                      type="button"
                      className="bg-transparent border-0 text-muted small"
                      onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); }}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
