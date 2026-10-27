import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { clearCart, decrease, increase, removeItem, selectCartCount, selectCartItems, selectCartTotal } from "../store/cartSlice";
import { selectCatalog } from "../store/catalogSlice";
import { CATEGORY_ROUTE, rupees } from "../utils/product";
import useReveal from "../hooks/useReveal";
import Html from "./Html";
import useStyles from "../hooks/useStyles";
import mainCss from "../styles/mainpage.css?inline";
import sharedCss from "../styles/shared-components.css?inline";
import pageCss from "../styles/page-inline.css?inline";
import footerHtml from "../content/footer.html?raw";

const footerInner = footerHtml.replace(/^\s*<footer[^>]*>/, "").replace(/<\/footer>\s*$/, "");

function Header() {
  const { overlay, toggle, close, showMessage } = useUI();
  const { user, logout } = useAuth();
  const count = useSelector(selectCartCount);
  const [hidden, setHidden] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [accountMenuOpen]);

  // Close dropdown whenever an overlay opens
  useEffect(() => {
    if (overlay) setAccountMenuOpen(false);
  }, [overlay]);

  // navbar hides while scrolling down (site.js behaviour)
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = useCallback(() => {
    if (!user) return;
    logout();
    setAccountMenuOpen(false);
    showMessage("Logged out successfully", "success");
    const currentHash = window.location.hash.replace("#", "").split("?")[0];
    if (["/account", "/orders", "/settings"].includes(currentHash)) {
      navigate("/login", { replace: true });
    }
  }, [user, logout, showMessage, navigate]);

  const go = useCallback(
    (path) => {
      setAccountMenuOpen(false);
      navigate(path);
    },
    [navigate]
  );

  return (
    <header className={hidden ? "nav-hidden" : undefined}>
      {/* LEFT CLUSTER: Hamburger → Search */}
      <div className="header-left-cluster">
        <button
          type="button"
          className="menu-btn header-island-btn"
          id="menuToggleBtn"
          aria-haspopup="dialog"
          aria-label="Open menu"
          aria-expanded={overlay === "account"}
          aria-controls="accountOverlay"
          onClick={() => {
            setAccountMenuOpen(false);
            toggle("account");
          }}
        >
          <svg className="menu-icon" width="18" height="16" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="skewX(-14)">
              <line x1="3" y1="2" x2="19" y2="2"></line>
              <line x1="3" y1="9" x2="19" y2="9"></line>
              <line x1="3" y1="16" x2="19" y2="16"></line>
            </g>
          </svg>
        </button>

        <button
          type="button"
          className="nav-search-btn header-island-btn"
          id="searchToggleBtn"
          aria-haspopup="dialog"
          aria-expanded={overlay === "search"}
          aria-controls="searchOverlay"
          aria-label="Search catalog"
          onClick={() => {
            setAccountMenuOpen(false);
            toggle("search");
          }}
        >
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="search-label">Search</span>
        </button>
      </div>

      {/* CENTER: Nav island */}
      <nav>
        <div className="logo">
          <Link to="/"><img src="logo.png" alt="ConsoleVault Logo" /></Link>
        </div>
        <ul className="nav-links">
          <li className="nav-item dropdown">
            <Link to="/games">Games ▼</Link>
            <ul className="dropdown-menu">
              <li><Link to="/games?category=action">Action</Link></li>
              <li><Link to="/games?category=adventure">Adventure</Link></li>
              <li><Link to="/games?category=rpg">RPG</Link></li>
            </ul>
          </li>
          <li className="nav-item"><Link to="/consoles">Consoles</Link></li>
          <li className="nav-item"><Link to="/accessories">Accessories</Link></li>
          <li className="nav-item"><Link to="/pc-components">PC Components</Link></li>
          <li className="nav-item"><Link to="/rentals">Rentals</Link></li>
          <li className="nav-item"><Link to="/contact">Contact-Us</Link></li>
        </ul>
      </nav>

      {/* RIGHT CLUSTER: Cart → Account */}
      <div className="header-right-cluster">
        <button
          type="button"
          className="cart-nav-btn header-island-btn"
          id="cartToggleBtn"
          aria-haspopup="dialog"
          aria-expanded={overlay === "cart"}
          aria-controls="cartOverlay"
          aria-label="Open cart"
          onClick={() => {
            setAccountMenuOpen(false);
            toggle("cart");
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1"></circle><circle cx="20" cy="20" r="1"></circle><path d="m1 1 4 4 2.7 10.4a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L22 8H6"></path></svg>
          <span className="cart-count" id="cartCount">{count}</span>
        </button>

        {/* Account Icon Button & Dropdown */}
        <div className="account-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`account-nav-btn header-island-btn${accountMenuOpen ? " active" : ""}`}
            id="accountNavBtn"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            aria-label={user ? `Account (${user.name})` : "Account login menu"}
            onClick={() => {
              close();
              setAccountMenuOpen((v) => !v);
            }}
          >
            <svg className="account-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="account-label">
              {user ? (user.name ? user.name.split(" ")[0] : "Account") : "Sign In"}
            </span>
          </button>

          {accountMenuOpen && (
            <div className="account-dropdown-popover" role="menu" aria-label="Account options">
              {user ? (
                <>
                  <div className="account-popover-header">
                    <div className="account-avatar-circle">
                      {(user.name || "U")[0].toUpperCase()}
                    </div>
                    <div className="account-popover-userinfo">
                      <span className="account-popover-name">{user.name}</span>
                      <span className="account-popover-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="account-popover-divider" />
                  <button type="button" className="account-popover-item" onClick={() => go("/account")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Your Account</span>
                  </button>
                  <button type="button" className="account-popover-item" onClick={() => go("/orders")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <span>My Orders</span>
                  </button>
                  <button type="button" className="account-popover-item" onClick={() => go("/settings")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    <span>Settings</span>
                  </button>
                  <button type="button" className="account-popover-item" onClick={() => go("/support")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>Help &amp; Support</span>
                  </button>
                  <div className="account-popover-divider" />
                  <button type="button" className="account-popover-item account-logout-item" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="account-popover-guest">
                    <span className="account-popover-welcome">Welcome to ConsoleVault!</span>
                    <p className="account-popover-hint">Sign in to track orders, manage your profile, and more.</p>
                  </div>
                  <button type="button" className="account-popover-login-btn" onClick={() => go("/login")}>
                    Login / Sign Up
                  </button>
                  <div className="account-popover-divider" />
                  <button type="button" className="account-popover-item" onClick={() => go("/support")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>Help &amp; Support</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>{/* end header-right-cluster */}
    </header>
  );
}

function SearchResult({ product, index, onPick }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <button type="button" className={`search-result-item${visible ? " is-visible" : ""}`} style={{ transitionDelay: `${Math.min(index, 6) * 40}ms` }} onClick={() => onPick(product)}>
      <img src={product.image} alt={product.title} />
      <span className="search-result-info">
        <span className="search-result-title">{product.title}</span>
        <span className="search-result-price">{product.price}</span>
      </span>
    </button>
  );
}

function SearchOverlay() {
  const { overlay, close } = useUI();
  const navigate = useNavigate();
  const { items } = useSelector(selectCatalog);
  const [query, setQuery] = useState("");
  const active = overlay === "search";

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => document.getElementById("searchInput")?.focus(), 300);
      return () => clearTimeout(t);
    }
    setQuery("");
    return undefined;
  }, [active]);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => (q ? items.filter((g) => g.title.toLowerCase().includes(q)) : items), [items, q]);

  const pick = (product) => {
    close();
    navigate(`${CATEGORY_ROUTE[product.category] || "/"}?highlight=${encodeURIComponent(product.title)}`);
  };

  return (
    <div className={`search-overlay${active ? " active" : ""}`} id="searchOverlay" role="dialog" aria-modal="true" aria-label="Search" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="search-panel">
        <div className="search-panel-header">
          <input type="text" id="searchInput" className="search-input" placeholder="Search for products..." autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className="search-close-btn" id="searchCloseBtn" aria-label="Close search" onClick={close}>×</button>
        </div>
        <div className="search-results" id="searchResults">
          {matches.length === 0 ? (
            <p className="search-empty">{items.length === 0 ? "Loading products..." : `No results found for "${query}"`}</p>
          ) : (
            active && matches.map((g, i) => <SearchResult key={g.title + g.price} product={g} index={i} onPick={pick} />)
          )}
        </div>
      </div>
    </div>
  );
}

function AccountOverlay() {
  const { overlay, close, open, showMessage } = useUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const go = (path) => { close(); navigate(path); };

  const handleLogout = () => {
    if (!user) return;
    logout();
    close();
    showMessage("Logged out successfully", "success");
    const currentHash = window.location.hash.replace("#", "").split("?")[0];
    if (["/account", "/orders", "/settings"].includes(currentHash)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={`account-overlay${overlay === "account" ? " active" : ""}`} id="accountOverlay" role="dialog" aria-modal="true" aria-label="Account menu" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="account-panel">
        <div className="account-panel-header">
          <span className="account-panel-title">Menu</span>
          <button type="button" className="search-close-btn" id="accountCloseBtn" aria-label="Close menu" onClick={close}>×</button>
        </div>
        <button type="button" className="account-main-btn" id="accountMainBtn" onClick={() => go(user ? "/account" : "/login")}>
          <span className="account-main-label">{user ? "Your Account" : "Sign In / Register"}</span>
          <span className="account-main-username" id="accountUsername">{user?.name || "Sign in to access your account"}</span>
        </button>
        <div className="account-sub-actions">
          <button type="button" className="account-sub-btn" onClick={() => go(user ? "/orders" : "/login")}>My Orders</button>
          <button type="button" className="account-sub-btn" onClick={() => open("cart")}>Cart</button>
          <button type="button" className="account-sub-btn" onClick={() => go(user ? "/settings" : "/login")}>Settings</button>
          <button type="button" className="account-sub-btn" onClick={() => go("/support")}>Help &amp; Support</button>
          {user ? (
            <button type="button" className="account-sub-btn" id="accountLogoutBtn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button type="button" className="account-sub-btn" id="accountLoginBtn" onClick={() => go("/login")}>
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartOverlay() {
  const { overlay, close, showMessage } = useUI();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const active = overlay === "cart";
  const style = active
    ? { opacity: 1, visibility: "visible", pointerEvents: "auto" }
    : { opacity: 0, visibility: "hidden", pointerEvents: "none" };

  return (
    <div className={`cart-overlay${active ? " active" : ""}`} id="cartOverlay" role="dialog" aria-modal="true" aria-label="Shopping cart" style={style} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="cart-panel">
        <div className="cart-panel-header">
          <div>
            <span className="cart-panel-title">Your Cart</span>
            <span className="cart-panel-subtitle" id="cartSubtitle">{count} {count === 1 ? "item" : "items"}</span>
          </div>
          <button type="button" className="search-close-btn" id="cartCloseBtn" aria-label="Close cart" onClick={close}>×</button>
        </div>
        <div className="cart-items" id="cartItems">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.<br />Add a game and it will appear here.</p>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{rupees(item.price)}</div>
                  <div className="cart-qty-controls">
                    <button type="button" className="cart-qty-btn decrease" onClick={() => dispatch(decrease(item.id))}>-</button>
                    <span className="cart-qty">{item.qty || 1}</span>
                    <button type="button" className="cart-qty-btn increase" onClick={() => dispatch(increase(item.id))}>+</button>
                  </div>
                </div>
                <button type="button" className="cart-remove" aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeItem(item.id))}>×</button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total-row"><span>Total</span><strong id="cartTotal">{rupees(total)}</strong></div>
          <button type="button" className="cart-checkout-btn" id="cartCheckoutBtn" onClick={() => {
            if (items.length) { close(); navigate("/checkout"); } else showMessage("Your cart is empty", "error");
          }}>Proceed to Checkout</button>
          <button type="button" className="cart-clear-btn" id="cartClearBtn" onClick={() => { dispatch(clearCart()); showMessage("Cart cleared", "success"); }}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { toast, open, close } = useUI();
  useStyles(mainCss + "\n" + sharedCss + "\n" + pageCss);

  // new page: scroll to top, close overlays, re-run reveal animations
  useEffect(() => {
    window.scrollTo(0, 0);
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useReveal([pathname]);

  // /cart opens the cart panel (replaces addtocart.html?open=1)
  useEffect(() => {
    if (pathname === "/cart") open("cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <img id="bgPhoto" src="consolePh.jpg" alt="" aria-hidden="true" />
      <Header />
      <SearchOverlay />
      <AccountOverlay />
      <CartOverlay />
      <Outlet />
      <Html as="footer" className="site-footer" html={footerInner} />
      <p className={`cv-toast ${toast.type}`} role="status" aria-live="polite">{toast.text}</p>
    </>
  );
}
