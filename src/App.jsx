import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCatalog } from "./store/catalogSlice";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import StaticPage from "./pages/StaticPage";
import Rentals from "./pages/Rentals";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const GAME_FILTERS = [
  { cat: "action", label: "Action" },
  { cat: "adventure", label: "Adventure" },
  { cat: "rpg", label: "RPG" },
];

const guard = (el) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  const dispatch = useDispatch();
  // load the catalog once at startup (search overlay needs it on every page)
  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  return (
    <Routes>
      {/* login has its own page layout + stylesheet */}
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/cart" element={<Home />} />
        <Route
          path="/games"
          element={
            <ProductList
              categories={["game", "action", "adventure", "rpg"]}
              filters={GAME_FILTERS}
              names={{ all: "All Games", action: "Action Games", adventure: "Adventure Games", rpg: "RPG Games" }}
              subtitle="Explore our featured collection of new and pre-owned games."
            />
          }
        />
        <Route path="/consoles" element={<ProductList categories={["console"]} filters={[]} names={{ all: "All Consoles" }} subtitle="Explore our featured collection of new and pre-owned consoles." />} />
        <Route path="/accessories" element={<ProductList categories={["accessory"]} filters={[]} names={{ all: "All Accessories" }} subtitle="Explore our featured collection of new and pre-owned accessories." />} />
        <Route path="/pc-components" element={<ProductList categories={["pc"]} filters={[]} names={{ all: "All PC Components" }} subtitle="Explore our featured collection of new and pre-owned pc components." />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={guard(<Orders />)} />
        <Route path="/account" element={guard(<Account />)} />
        <Route path="/settings" element={guard(<Settings />)} />
        {["about", "terms", "refund", "shipping", "privacy", "tradein", "wallet", "team", "support"].map((n) => (
          <Route key={n} path={`/${n}`} element={<StaticPage name={n} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
