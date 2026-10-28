import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import Html from "../components/Html";
import { useForm } from "../hooks/useForm";
import useStyles from "../hooks/useStyles";
import useReveal from "../hooks/useReveal";
import { useAuth } from "../context/AuthContext";
import { email, matches, minLength, required } from "../utils/validators";
import loginCss from "../styles/login.css?inline";
import loginInlineCss from "../styles/login-inline.css?inline";
import introHtml from "../content/login-intro.html?raw";
import footerHtml from "../content/login-footer.html?raw";

const REDIRECT_DELAY_MS = 800;

const loginRules = { email: [required("Email"), email()], password: [required("Password")] };
const signupRules = {
  name: [required("Full name")],
  email: [required("Email"), email()],
  password: [required("Password"), minLength(8, "Password")],
  confirm: [required("Please confirm your password"), matches("password", "Passwords do not match. Try again.")],
};
const loginInitial = { email: "", password: "" };
const signupInitial = { name: "", email: "", password: "", confirm: "" };

export default function Login() {
  useStyles(loginCss + "\n" + loginInlineCss);
  useReveal([]);
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMsg, setLoginMsg] = useState({ text: "", type: "" });
  const [signupMsg, setSignupMsg] = useState({ text: "", type: "" });
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (user) {
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    const btn = document.getElementById("getStartedBtn");
    if (!btn) return undefined;
    const scrollDown = () => {
      document.getElementById("authSection")?.scrollIntoView({ behavior: "smooth" });
    };
    btn.addEventListener("click", scrollDown);
    return () => btn.removeEventListener("click", scrollDown);
  }, []);

  const loginForm = useForm(loginInitial, loginRules);
  const signupForm = useForm(signupInitial, signupRules);

  const clear = () => {
    setLoginMsg({ text: "", type: "" });
    setSignupMsg({ text: "", type: "" });
  };

  const redirect = () => {
    const destination = location.state?.from?.pathname || "/";
    timer.current = setTimeout(() => navigate(destination, { replace: true }), REDIRECT_DELAY_MS);
  };

  const onLogin = loginForm.handleSubmit(({ email: e, password }) => {
    clear();
    const res = login(e.trim(), password);
    if (!res.ok) return setLoginMsg({ text: res.error, type: "error" });
    setLoginMsg({ text: "Welcome back! Redirecting...", type: "success" });
    redirect();
  });

  const onSignup = signupForm.handleSubmit(({ name, email: e, password }) => {
    clear();
    const res = signup(name.trim(), e.trim(), password);
    if (!res.ok) return setSignupMsg({ text: res.error, type: "error" });
    setSignupMsg({ text: "Account created! Taking you to the store...", type: "success" });
    redirect();
  });

  return (
    <>
      <img id="bgPhoto" src="Video_Project_3.gif" alt="" aria-hidden="true" />
      <Html html={introHtml} style={{ display: "contents" }} />
      <section className="auth-section" id="authSection">
        <div className="auth-box">
          <div className="auth-back-link">
            <Link to="/">← Back to Store</Link>
          </div>
          <div className="logo">
            <Link to="/" title="Return to Home">
              <img src="logo.png" alt="ConsoleVault Logo" />
            </Link>
          </div>

          <input type="radio" name="tab" id="login" defaultChecked onChange={clear} />
          <input type="radio" name="tab" id="signup" onChange={clear} />
          <div className="tabs">
            <label htmlFor="login">Login</label>
            <label htmlFor="signup">Sign Up</label>
          </div>

          <form className="login-form" id="login-form" onSubmit={onLogin} noValidate>
            <FormField variant="auth" label="Email" name="email" id="login-email" type="email" placeholder="you@example.com" autoComplete="email" value={loginForm.values.email} error={loginForm.errors.email} onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} />
            <FormField variant="auth" label="Password" name="password" id="login-password" type="password" placeholder="••••••••" autoComplete="current-password" value={loginForm.values.password} error={loginForm.errors.password} onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} />
            <button type="submit">Login</button>
            <div className="note">Sign in to buy, sell, or rent your gear</div>
            <p className={`message ${loginMsg.type}`} id="login-message" role="status" aria-live="polite">{loginMsg.text}</p>
          </form>

          <form className="signup-form" id="signup-form" onSubmit={onSignup} noValidate>
            <FormField variant="auth" label="Full Name" name="name" id="signup-name" placeholder="John Doe" autoComplete="name" value={signupForm.values.name} error={signupForm.errors.name} onChange={signupForm.handleChange} onBlur={signupForm.handleBlur} />
            <FormField variant="auth" label="Email" name="email" id="signup-email" type="email" placeholder="you@example.com" autoComplete="email" value={signupForm.values.email} error={signupForm.errors.email} onChange={signupForm.handleChange} onBlur={signupForm.handleBlur} />
            <FormField variant="auth" label="Password" name="password" id="signup-password" type="password" placeholder="Create password" autoComplete="new-password" hintId="password-hint" value={signupForm.values.password} error={signupForm.errors.password} onChange={signupForm.handleChange} onBlur={signupForm.handleBlur} hint={<div className="hint" id="password-hint">Minimum 8 characters.</div>} />
            <FormField variant="auth" label="Confirm Password" name="confirm" id="signup-confirm" type="password" placeholder="Repeat password" autoComplete="new-password" value={signupForm.values.confirm} error={signupForm.errors.confirm} onChange={signupForm.handleChange} onBlur={signupForm.handleBlur} />
            <button type="submit">Create Account</button>
            <div className="note">Join ConsoleVault &amp; start trading</div>
            <p className={`message ${signupMsg.type}`} id="signup-message" role="status" aria-live="polite">{signupMsg.text}</p>
          </form>
        </div>
      </section>
      <Html as="footer" className="login-footer reveal" html={footerHtml.replace(/^\s*<footer[^>]*>/, "").replace(/<\/footer>\s*$/, "")} />
    </>
  );
}
