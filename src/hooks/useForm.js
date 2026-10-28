import { useCallback, useState } from "react";

export function useForm(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (name, value, all) => {
      for (const check of rules[name] || []) {
        const message = check(value, all);
        if (message) return message;
      }
      return "";
    },
    [rules]
  );

  const validateAll = useCallback(
    (vals = values) => {
      const next = {};
      Object.keys(rules).forEach((name) => {
        const message = validateField(name, vals[name], vals);
        if (message) next[name] = message;
      });
      setErrors(next);
      setTouched(Object.fromEntries(Object.keys(rules).map((n) => [n, true])));
      return next;
    },
    [rules, validateField, values]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, next) }));
    }
    if (name === "password" && touched.confirm) {
      setErrors((prev) => ({ ...prev, confirm: validateField("confirm", next.confirm, next) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, values) }));
  };

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    const found = validateAll();
    if (Object.keys(found).length === 0) onValid(values);
  };

  return { values, errors, handleChange, handleBlur, handleSubmit, reset, setValues };
}
