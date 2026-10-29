import { useMemo } from "react";
import PageShell from "../components/PageShell";
import FormField from "../components/FormField";
import { useForm } from "../hooks/useForm";
import { required } from "../utils/validators";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

const rules = { name: [required("Display name")] };

export default function Settings() {
  const { user, updateName } = useAuth();
  const { showMessage } = useUI();
  const initial = useMemo(() => ({ name: user?.name || "" }), [user?.email]);
  const form = useForm(initial, rules);
  const submit = form.handleSubmit(({ name }) => {
    updateName(name.trim());
    showMessage("Settings saved successfully", "success");
  });
  return (
    <PageShell title="Account Settings">
      <form className="cv-form" id="settingsForm" onSubmit={submit} noValidate>
        <FormField label="Display Name" name="name" id="settingName" value={form.values.name} error={form.errors.name} onChange={form.handleChange} onBlur={form.handleBlur} />
        <FormField label="Email" name="email" id="settingEmail" type="email" value={user?.email || ""} readOnly onChange={() => {}} />
        <button type="submit" className="cv-btn-primary">Save Changes</button>
      </form>
    </PageShell>
  );
}
