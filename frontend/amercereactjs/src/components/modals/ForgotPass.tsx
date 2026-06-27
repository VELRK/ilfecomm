import ResetPasswordFlow from "@/components/auth/ResetPasswordFlow";

export default function ForgotPass({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log modal-log_forgot"
      id="modalForgot"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Forgot Password</h3>
            <p className="desc-pop cl-text-2">
              Verify your email, then set a new password.
            </p>
          </div>
          <div className="modal-main">
            <ResetPasswordFlow variant="modal" />
          </div>
        </div>
      </div>
    </div>
  );
}
