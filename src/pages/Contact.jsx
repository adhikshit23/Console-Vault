import PageShell from "../components/PageShell";
import FormField from "../components/FormField";
import { useForm } from "../hooks/useForm";
import { email, required } from "../utils/validators";
import { useUI } from "../context/UIContext";

const initial = { name: "", email: "", message: "" };
const rules = {
  name: [required("Name")],
  email: [required("Email"), email()],
  message: [required("Message")],
};

export default function Contact() {
  const { showMessage } = useUI();
  const form = useForm(initial, rules);
  const submit = form.handleSubmit(() => {
    showMessage("Message sent successfully! We will get back to you soon.", "success");
    form.reset();
  });
  return (
    <PageShell title="Contact Us">
      <form className="cv-form" id="contactForm" onSubmit={submit} noValidate>
        <FormField label="Name" name="name" value={form.values.name} error={form.errors.name} onChange={form.handleChange} onBlur={form.handleBlur} />
        <FormField label="Email" name="email" type="email" value={form.values.email} error={form.errors.email} onChange={form.handleChange} onBlur={form.handleBlur} />
        <FormField label="Message" name="message" as="textarea" rows={5} value={form.values.message} error={form.errors.message} onChange={form.handleChange} onBlur={form.handleBlur} />
        <button type="submit" className="cv-btn-primary">Send Message</button>
      </form>
    </PageShell>
  );
}
