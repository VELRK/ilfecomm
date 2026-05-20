import { useState } from "react";
import { contactAPI } from "@/services/api";

function Contact() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
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
      const res = await contactAPI.send({ name: name.trim(), email: email.trim(), message: `${phone ? 'Phone: ' + phone + '\n\n' : ''}${message.trim()}` });
      setResult({ type: "success", text: res.data.message ?? "Message sent! We'll get back to you soon." });
      setName(""); setEmail(""); setPhone(""); setMessage("");
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

            {/* Left — Info */}
            <div className="col-md-6">
              <div className="col-left">
                <div className="heading d-grid gap-8 mb-24">
                  <h4>Contact Information</h4>
                  <p className="cl-text-2">
                    Have a question or need help? Reach us through any of the channels below.
                  </p>
                </div>

                <div className="grid-info tf-grid-layout sm-col-2">
                  <div className="d-grid gap-8">
                    <h6>Phone:</h6>
                    <p>
                      <a href="tel:+919597220129" className="cl-text-2 link">
                        +91 95972 20129
                      </a>
                    </p>
                  </div>
                  <div className="d-grid gap-8">
                    <h6>Email:</h6>
                    <p>
                      <a href="mailto:info@indianladiesfashion.in" className="cl-text-2 link">
                        info@indianladiesfashion.in
                      </a>
                    </p>
                  </div>
                  <div className="wd-full d-grid gap-8">
                    <h6>Address:</h6>
                    <p className="cl-text-2">
                      Indian Ladies Fashion,<br />
                      Opp to SNS Tech Arch, Sathy Main Road,<br />
                      Saravanampatti Post,<br />
                      Coimbatore – 641035, Tamil Nadu
                    </p>
                  </div>
                  <div className="wd-full d-grid gap-8">
                    <h6>Business Hours:</h6>
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

                {/* Google Map */}
                <div className="mt-24" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <iframe
                    title="Indian Ladies Fashion Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.265!2d77.0155!3d11.0678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba857d3b2d01a55%3A0x5c!2sSaravanampatti%2C%20Coimbatore%2C%20Tamil%20Nadu%20641035!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="col-md-6">
              <h4 className="mb-8">Get In Touch</h4>
              <p className="mb-24 cl-text-2">Fill out the form and we'll respond within 24 hours.</p>

              {result && (
                <div className={`alert alert-${result.type === "success" ? "success" : "danger"} mb-20 py-10 px-16`}>
                  {result.type === "success"
                    ? <><i className="bi bi-check-circle me-2" />{result.text}</>
                    : <><i className="bi bi-exclamation-triangle me-2" />{result.text}</>
                  }
                </div>
              )}

              <form className="form-get" onSubmit={handleSubmit} noValidate>
                <div className="form-content">
                  <div className="tf-grid-layout sm-col-2">
                    <fieldset className="tf-field">
                      <label htmlFor="contact-name" className="tf-lable fw-medium">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </fieldset>
                    <fieldset className="tf-field">
                      <label htmlFor="contact-email" className="tf-lable fw-medium">
                        Your Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        placeholder="e.g. priya@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="tf-field">
                    <label htmlFor="contact-phone" className="tf-lable fw-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="tf-field">
                    <label htmlFor="contact-message" className="tf-lable fw-medium">
                      Your Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      rows={5}
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
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm me-2" />Sending…</>
                    : "Send Message"
                  }
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
