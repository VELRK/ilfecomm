import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";



export default function Register({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef     = useRef<HTMLInputElement>(null);
  const phoneRef    = useRef<HTMLInputElement>(null);
  const emailRef    = useRef<HTMLInputElement>(null);
  const passRef     = useRef<HTMLInputElement>(null);
  const confirmRef  = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name    = nameRef.current?.value.trim() ?? "";
    const phone   = phoneRef.current?.value.trim() ?? "";
    const email   = emailRef.current?.value.trim() ?? "";
    const pass    = passRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";

    if (pass !== confirm) { setError("Passwords do not match."); return; }
    if (pass.length < 6)  { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, password: pass, phone });
      if ((res.data as { success?: boolean }).success) {
        const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
        login(token, user);

        import("bootstrap").then(({ Modal }) => {
          const el = document.getElementById("register");
          if (el) Modal.getInstance(el)?.hide();
        });
        navigate("/account-page");
      } else {
        setError((res.data as { message?: string }).message ?? "Registration failed.");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message ?? e?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Create Account</h3>
            <p className="desc-pop cl-text-2">Be part of our growing family!</p>
          </div>
          <div className="modal-main">
            <form className="form-log" onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-12 text-caption-01" role="alert">
                  {error}
                </div>
              )}
              <div className="form-content">
                {/* Name and Phone */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <fieldset className="tf-field">
                      <label className="tf-lable fw-medium">Full Name <span className="text-primary">*</span></label>
                      <input ref={nameRef} type="text" placeholder="Your full name" required />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <fieldset className="tf-field">
                      <label className="tf-lable fw-medium">Phone Number <span className="text-primary">*</span></label>
                      <input ref={phoneRef} type="tel" placeholder="+91 9876543210" required />
                    </fieldset>
                  </div>
                </div>

                {/* Email Address */}
                <fieldset className="tf-field mb-3">
                  <label className="tf-lable fw-medium">Email Address <span className="text-primary">*</span></label>
                  <input ref={emailRef} type="email" placeholder="your@email.com" required />
                </fieldset>

                {/* Password and Confirm */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <fieldset className="tf-field password-wrapper">
                      <label className="tf-lable fw-medium">Password <span className="text-primary">*</span></label>
                      <PasswordField inputRef={passRef} id="register-password" placeholder="Min. 6 characters" required />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <fieldset className="tf-field password-wrapper">
                      <label className="tf-lable fw-medium">Confirm Password <span className="text-primary">*</span></label>
                      <PasswordField inputRef={confirmRef} id="register-password-confirm" placeholder="Repeat password" required />
                    </fieldset>
                  </div>
                </div>
              </div>

              <div className="group-action mt-4">
                <button type="submit" className="action-create-account tf-btn animate-btn w-100" disabled={loading}>
                  {loading ? "Creating Account…" : "Create Account"}
                </button>
                <div className="text-center mt-3">
                  <span className="text-muted small">Already have an account? </span>
                  <a href="#sign" data-bs-toggle="modal" className="text-primary fw-semibold small text-decoration-underline">Login</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
