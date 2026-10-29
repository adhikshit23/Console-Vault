import { useEffect, useMemo, useState } from "react";
import "../styles/sell.css";

const STORAGE_KEY = "consolevault_sell_listings";

const categories = [
  "Games",
  "Consoles",
  "Accessories",
  "PC Components",
  "Laptops",
  "Mobiles",
  "Tablets",
  "Headphones & Audio",
  "Smartwatches",
  "TVs & Monitors",
  "Cameras",
  "Other Electronics",
];

const marketPriceProducts = [
    {
  name: "PlayStation 5 Controller",
  category: "Accessories",
  brand: "Sony",
  price: 5990,
},
  {
    name: "PlayStation 5 Slim",
    category: "Consoles",
    brand: "Sony",
    price: 49990,
  },
  {
    name: "Xbox Series S",
    category: "Consoles",
    brand: "Microsoft",
    price: 34990,
  },
  {
    name: "Nintendo Switch OLED",
    category: "Consoles",
    brand: "Nintendo",
    price: 31990,
  },
  {
    name: "iPhone 15 128GB",
    category: "Mobiles",
    brand: "Apple",
    price: 59900,
  },
  {
    name: "Samsung Galaxy S24",
    category: "Mobiles",
    brand: "Samsung",
    price: 54999,
  },
  {
    name: "OnePlus Nord CE 4",
    category: "Mobiles",
    brand: "OnePlus",
    price: 24999,
  },
  {
    name: "HP Pavilion Laptop",
    category: "Laptops",
    brand: "HP",
    price: 65000,
  },
  {
    name: "MacBook Air M2",
    category: "Laptops",
    brand: "Apple",
    price: 89900,
  },
  {
    name: "Sony WH-1000XM5",
    category: "Headphones & Audio",
    brand: "Sony",
    price: 29990,
  },
  {
    name: "Apple AirPods Pro",
    category: "Headphones & Audio",
    brand: "Apple",
    price: 24900,
  },
  {
    name: "Samsung 43-inch Smart TV",
    category: "TVs & Monitors",
    brand: "Samsung",
    price: 32999,
  },
  {
    name: "LG 27-inch Monitor",
    category: "TVs & Monitors",
    brand: "LG",
    price: 15999,
  },
  {
    name: "Logitech G502 Mouse",
    category: "Accessories",
    brand: "Logitech",
    price: 7995,
  },
  {
    name: "Canon EOS 1500D",
    category: "Cameras",
    brand: "Canon",
    price: 39995,
  },
];

const initialProducts = [
{
id: "demo-1",
name: "PlayStation 5 Console",
category: "Consoles",
condition: "Good",
price: 32000,
image:
"https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=700&q=80",
description: "Pre-owned console in good working condition.",
status: "Demo Listing",
demo: true,
},
{
id: "demo-2",
name: "Gaming Controller",
category: "Accessories",
condition: "Like New",
price: 2500,
image:
"https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80",
description: "Controller in excellent condition.",
status: "Demo Listing",
demo: true,
},
];

const formatPrice = (price) =>
"₹" + Number(price).toLocaleString("en-IN");

const categoryBasePrices = {
  Games: 2500,
  Consoles: 30000,
  Accessories: 2000,
  "PC Components": 8000,
  Laptops: 40000,
};

const conditionMultipliers = {
  New: 1,
  "Like New": 0.85,
  Good: 0.7,
  Fair: 0.5,
};

function getSuggestedPrice(category, condition) {
  const basePrice = categoryBasePrices[category] ?? 2000;
  const multiplier = conditionMultipliers[condition] ?? 0.7;

  return Math.round((basePrice * multiplier) / 100) * 100;
}

function loadListings() {
try {
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
return Array.isArray(saved) ? saved : [];
} catch {
return [];
}
}

export default function Sell() {
const [listings, setListings] = useState(loadListings);
const [query, setQuery] = useState("");
const [category, setCategory] = useState("All");
const [editingId, setEditingId] = useState(null);
const [message, setMessage] = useState("");
const [marketResults, setMarketResults] = useState([]);
const [marketMessage, setMarketMessage] = useState("");


const emptyForm = {
name: "",
category: "Games",
condition: "Good",
price: "",
image: "",
description: "",
};

const [form, setForm] = useState(emptyForm);
const suggestedPrice = getSuggestedPrice(
form.category,
form.condition
);

useEffect(() => {
localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}, [listings]);

const allListings = useMemo(
() => [...listings, ...initialProducts],
[listings]
);

const filteredListings = allListings.filter((product) => {
const matchesQuery =
product.name.toLowerCase().includes(query.toLowerCase()) ||
product.category.toLowerCase().includes(query.toLowerCase());


const matchesCategory =
  category === "All" || product.category === category;

return matchesQuery && matchesCategory;


});

function updateField(event) {
const { name, value } = event.target;
setForm((previous) => ({ ...previous, [name]: value }));
}
function checkMarketPrice() {
  const searchTerm = form.name.trim().toLowerCase();

  if (!searchTerm) {
    setMarketResults([]);
    setMarketMessage("Please enter a product name first.");
    return;
  }

  const matches = marketPriceProducts.filter((product) => {
    const matchesName =
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm);

    return matchesName;
  });

  setMarketResults(matches);

  if (matches.length === 0) {
    setMarketMessage(
      "No exact match found in the demo database. Try a product name such as iPhone 15, PlayStation 5 Slim, or MacBook Air M2."
    );
  } else {
    setMarketMessage(
      "Demo reference prices found. These are sample prices, not live market prices."
    );
  }
}
function handleSubmit(event) {
event.preventDefault();


const product = {
  ...form,
  id: editingId || `listing-${Date.now()}`,
  price: Number(form.price),
  status: "Active",
  demo: false,
};

if (editingId) {
  setListings((previous) =>
    previous.map((item) =>
      item.id === editingId ? product : item
    )
  );
  setMessage("Your listing has been updated!");
} else {
  setListings((previous) => [product, ...previous]);
  setMessage("Your product has been listed successfully!");
}

setForm(emptyForm);
setEditingId(null);

document.getElementById("sell-marketplace")?.scrollIntoView({
  behavior: "smooth",
});


}

function editListing(product) {
setEditingId(product.id);
setForm({
name: product.name,
category: product.category,
condition: product.condition,
price: String(product.price),
image: product.image,
description: product.description,
});


document.getElementById("sell-form")?.scrollIntoView({
  behavior: "smooth",
});

}

function deleteListing(id) {
if (!window.confirm("Are you sure you want to delete this listing?")) {
return;
}


setListings((previous) =>
  previous.filter((item) => item.id !== id)
);
setMessage("Listing deleted successfully!");


}

function markSold(id) {
setListings((previous) =>
previous.map((item) =>
item.id === id ? { ...item, status: "Sold" } : item
)
);
setMessage("Listing marked as sold!");
}

return ( <main className="sell-page"> <section className="sell-hero"> <span className="sell-eyebrow">CONSOLEVAULT MARKETPLACE</span>


    <h1>
      Your Gear. <span>Your Price.</span>
    </h1>

    <p>
      Give your old games and gaming gear a new home.
      List your products and manage your listings in one place.
    </p>

    <button
  type="button"
  className="sell-primary-btn"
  onClick={() => {
    document.getElementById("sell-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
>
  + List Your Product
</button>

    <div className="sell-stats">
      <div>
        <strong>{allListings.length}</strong>
        <span>Products to explore</span>
      </div>
      <div>
        <strong>{listings.length}</strong>
        <span>Your listings</span>
      </div>
      <div>
        <strong>Free</strong>
        <span>To create a listing</span>
      </div>
    </div>
  </section>

  <section className="sell-form-section" id="sell-form">
    <div className="sell-section-heading">
      <span>START SELLING</span>
      <h2>{editingId ? "Edit Your Listing" : "List Your Product"}</h2>
      <p>Enter your product details to create a marketplace listing.</p>
    </div>

    <form className="sell-form" onSubmit={handleSubmit}>
      <label>
        Product Name *
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="e.g. PlayStation 5 Controller"
          required
          maxLength={100}
        />
      </label>

      <div className="sell-form-row">
        <label>
          Category *
          <select
            name="category"
            value={form.category}
            onChange={updateField}
            required
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Product Condition *
          <select
            name="condition"
            value={form.condition}
            onChange={updateField}
            required
          >
            <option>New</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </label>
      </div>

      <div className="sell-form-row">
        <label>
          Expected Price (₹) *
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={updateField}
            placeholder="Enter your selling price"
            min="1"
            max="10000000"
            step="1"
            required
          />
          
        </label>
<div className="sell-price-estimate market-price-checker">
  <span className="market-price-label">
    MARKET PRICE CHECKER
  </span>

  <h3>Check Brand-New Price</h3>

  <p>
    Enter the product name above and check its demo market
    price before deciding your listing price.
  </p>

  <button
    type="button"
    className="sell-primary-btn"
    onClick={checkMarketPrice}
  >
    Check Market Price
  </button>

  {marketMessage && (
    <p className="market-price-message" role="status">
      {marketMessage}
    </p>
  )}

  {marketResults.length > 0 && (
    <div className="market-price-results">
      {marketResults.map((product) => (
        <div
          className="market-price-result"
          key={product.name}
        >
          <div>
            <span>{product.brand} · {product.category}</span>

            <h4>{product.name}</h4>

            <strong>{formatPrice(product.price)}</strong>

            <small>Sample brand-new reference price</small>
          </div>

          <button
            type="button"
            onClick={() => {
              setForm((previous) => ({
                ...previous,
                price: String(product.price),
              }));

              setMessage(
                "Reference price copied. You can edit your listing price before publishing."
              );
            }}
          >
            Use as Reference
          </button>
        </div>
      ))}
    </div>
  )}

  <small className="market-price-disclaimer">
    Demo data only · Not live retailer pricing
  </small>
</div>
        <label>
          Product Image URL
          <input
            name="image"
            type="url"
            value={form.image}
            onChange={updateField}
            placeholder="https://example.com/product.jpg"
          />
        </label>
      </div>

      <label>
        Product Description *
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Describe the condition, usage and included accessories..."
          rows="4"
          maxLength={1000}
          required
        />
      </label>

      <div className="sell-form-actions">
        <button type="submit" className="sell-primary-btn">
          {editingId ? "Save Changes" : "Publish Listing"}
        </button>

        {editingId && (
          <button
            type="button"
            className="sell-cancel-btn"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </section>

  <section className="sell-marketplace" id="sell-marketplace">
    <div className="sell-section-heading">
      <span>EXPLORE THE MARKETPLACE</span>
      <h2>Gaming Gear for Sale</h2>
      <p>Find a product or explore the available listings.</p>
    </div>

    <div className="sell-filters">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search games, consoles, accessories..."
        aria-label="Search products"
      />

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        aria-label="Filter by category"
      >
        <option value="All">All Categories</option>
        {categories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>

    {message && (
      <div className="sell-message" role="status">
        <span>{message}</span>
        <button
          type="button"
          onClick={() => setMessage("")}
          aria-label="Dismiss message"
        >
          ×
        </button>
      </div>
    )}

    {filteredListings.length === 0 ? (
      <div className="sell-empty">
        <span>🎮</span>
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    ) : (
      <div className="sell-product-grid">
        {filteredListings.map((product) => (
          <article className="sell-product-card" key={product.id}>
            <div className="sell-product-image">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="sell-image-placeholder">🎮</div>
              )}

              <span className="sell-condition">
                {product.condition}
              </span>
            </div>

            <div className="sell-product-info">
              <span className="sell-category">{product.category}</span>
              <h3>{product.name}</h3>
              <strong className="sell-price">
                {formatPrice(product.price)}
              </strong>
              <p>{product.description}</p>

              <div className="sell-card-footer">
                <span
                  className={`sell-status ${
                    product.status === "Sold" ? "is-sold" : ""
                  }`}
                >
                  {product.status}
                </span>

                {!product.demo && (
                  <div className="sell-card-actions">
                    {product.status !== "Sold" && (
                      <button
                        type="button"
                        onClick={() => editListing(product)}
                      >
                        Edit
                      </button>
                    )}

                    {product.status !== "Sold" && (
                      <button
                        type="button"
                        onClick={() => markSold(product.id)}
                      >
                        Mark Sold
                      </button>
                    )}

                    <button
                      type="button"
                      className="sell-delete-btn"
                      onClick={() => deleteListing(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>

  <p className="sell-demo-note">
    College demo: listings are saved in this browser only.
    No real sale, shipping or payment is processed.
  </p>
</main>


);
}
