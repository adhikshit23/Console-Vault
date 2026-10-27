// Reusable input component. Renders the SAME markup/classes as the original forms so the
// existing CSS applies untouched:
//   variant="auth" -> login.css style (<label class="text"> + <input>)
//   variant="cv"   -> shared-components.css style (.cv-form-group)
// It adds an error line (role="alert") under the control; styling lives in forms.css.
export default function FormField({
  variant = "cv",
  label,
  name,
  type = "text",
  as = "input",
  error,
  hint,
  hintId,
  value,
  onChange,
  onBlur,
  ...rest
}) {
  const id = rest.id || name;
  const Control = as;
  const control = (
    <Control
      id={id}
      name={name}
      type={as === "input" ? type : undefined}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? `${id}-error` : hintId}
      {...rest}
    />
  );
  const errorEl = error ? (
    <div className="field-error" id={`${id}-error`} role="alert">
      {error}
    </div>
  ) : null;

  if (variant === "auth") {
    return (
      <>
        <label className="text" htmlFor={id}>
          {label}
        </label>
        {control}
        {errorEl}
        {hint}
      </>
    );
  }
  return (
    <div className="cv-form-group">
      <label htmlFor={id}>{label}</label>
      {control}
      {errorEl}
    </div>
  );
}
