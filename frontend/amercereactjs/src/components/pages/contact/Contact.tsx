import { useState } from "react";
import { contactAPI } from "@/services/api";

function Contact() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]   = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setResult({ type: "error", text: "Please fill in all required fields." });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await contactAPI.send({ name: name.trim(), email: email.trim(), message: message.trim() });
      setResult({ type: "success", text: res.data.message ?? "Message sent!" });
      setName(""); setEmail(""); setMessage("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setResult({ type: "error", text: msg ?? "Failed to send message. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="section-contact flat-spacing">
        <div className="container">
          <div className="row gy-5 flex-wrap-reverse">
            <div className="col-md-6">
              <div className="col-left">
                <div className="heading d-grid gap-8">
                  <h4>Information</h4>
                  <p className="cl-text-2">
                    Have a question? Please contact us using the customer
                    support channels below.
                  </p>
                </div>
                <div className="grid-info tf-grid-layout sm-col-2">
                  <div className="d-grid gap-8">
                    <h6>Phone:</h6>
                    <p>
                      <a href="tel:+916666666666" className="cl-text-2 link">
                        +91 666 666 6666
                      </a>
                    </p>
                  </div>
                  <div className="d-grid gap-8">
                    <h6>Email:</h6>
                    <p>
                      <a href="mailto:info@shopkart.in" className="cl-text-2 link">
                        info@shopkart.in
                      </a>
                    </p>
                  </div>
                  <div className="wd-full d-grid gap-8">
                    <h6>Address:</h6>
                    <p className="cl-text-2">
                      ShopKart, India
                    </p>
                  </div>
                  <div className="wd-full d-grid gap-8">
                    <h6>Open Time:</h6>
                    <ul className="open-text">
                      <li className="d-flex gap-4 mb-4">
                        <span className="cl-text-2">Mon – Sat:</span>9:00am – 6:00pm IST
                      </li>
                      <li className="d-flex gap-4">
                        <span className="cl-text-2">Sunday:</span>Closed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h4 className="mb-8">Get In Touch</h4>
              <p className="mb-24 cl-text-2">Use the form below to send us a message.</p>

              {result && (
                <div className={`alert alert-${result.type === "success" ? "success" : "danger"} mb-20 py-10 px-16`}>
                  {result.text}
                </div>
              )}

              <form className="form-get" onSubmit={handleSubmit} noValidate>
                <div className="form-content">
                  <div className="tf-grid-layout sm-col-2">
                    <fieldset className="tf-field">
                      <label htmlFor="contact-name" className="tf-lable fw-medium">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        placeholder="Your Name*"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </fieldset>
                    <fieldset className="tf-field">
                      <label htmlFor="contact-email" className="tf-lable fw-medium">
                        Your Email <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        placeholder="Your Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="tf-field">
                    <label htmlFor="contact-message" className="tf-lable fw-medium">
                      Your Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      placeholder="Your Message*"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </fieldset>
                </div>
                <button
                  type="submit"
                  className="tf-btn animate-btn"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
