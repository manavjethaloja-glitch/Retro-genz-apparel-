import { useState, useEffect, useRef } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Solar Flare Tee",
    price: 34.99,
    originalPrice: 49.99,
    image: "Retro-genz-apparel-
/images/tshirt-1.png",
    tag: "Bestseller",
    category: "Graphic",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Vintage sun graphic, relaxed oversized fit.",
  },
  {
    id: 2,
    name: "Boom Static Tee",
    price: 38.99,
    originalPrice: 54.99,
    image: "/images/tshirt-2.png",
    tag: "New",
    category: "Y2K",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Retro boombox print, heavy-weight cotton.",
  },
  {
    id: 3,
    name: "Shroom Trip Tee",
    price: 32.99,
    originalPrice: 44.99,
    image: "/images/tshirt-3.png",
    tag: "Limited",
    category: "Psychedelic",
    sizes: ["XS", "S", "M", "L"],
    description: "Groovy mushroom print on washed fabric.",
  },
  {
    id: 4,
    name: "Butterfly Y2K Tee",
    price: 36.99,
    originalPrice: 52.99,
    image: "/images/tshirt-4.png",
    tag: "Hot",
    category: "Y2K",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Early-2000s butterfly motif, cropped fit.",
  },
  {
    id: 5,
    name: "Acid Wash Tee",
    price: 33.99,
    originalPrice: 47.99,
    image: "/images/tshirt-5.png",
    tag: "New",
    category: "Retro",
    sizes: ["S", "M", "L", "XL"],
    description: "Hand-done acid wash, every piece is unique.",
  },
  {
    id: 6,
    name: "Tie-Dye Cloud Tee",
    price: 35.99,
    originalPrice: 49.99,
    image: "/images/tshirt-6.png",
    tag: "Trending",
    category: "Tie-Dye",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Spiral tie-dye, 100% organic cotton.",
  },
];

const categories = ["All", "Graphic", "Y2K", "Psychedelic", "Retro", "Tie-Dye"];

const reviews = [
  { name: "Mia K.", rating: 5, text: "Exactly what I wanted — soft, true to size, great print quality.", location: "London, UK" },
  { name: "Jake T.", rating: 5, text: "Shipping was faster than expected. The fabric is really premium.", location: "NYC, USA" },
  { name: "Sara L.", rating: 4, text: "Love the aesthetic. Runs slightly large, which I actually prefer.", location: "Berlin, DE" },
  { name: "Priya M.", rating: 5, text: "Wore it to a vintage fair and got so many compliments. Perfect.", location: "Mumbai, IN" },
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconMinus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

const IconStar = ({ filled }: { filled: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (product: typeof products[0]) => {
    const size = selectedSizes[product.id] || product.sizes[1];
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) return prev.map((i) => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, size, qty: 1 }];
    });
    showToast(`${product.name} added to bag`);
  };

  const updateQty = (id: number, size: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const removeFromCart = (id: number, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  const navLinks = ["Shop", "About", "Reviews", "Contact"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F6F2", color: "#1a1a1a" }}>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#1a1a1a] text-[#F8F6F2] text-sm px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {/* ── Cart Overlay ── */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/20 z-[90] backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
      )}

      {/* ── Cart Drawer ── */}
      <div className={`cart-drawer fixed top-0 right-0 h-full w-full max-w-sm z-[100] bg-[#F8F6F2] border-l border-[#e0ddd8] flex flex-col ${cartOpen ? "open" : "closed"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e0ddd8]">
          <span className="text-sm font-medium tracking-widest uppercase">Your Bag ({totalItems})</span>
          <button onClick={() => setCartOpen(false)} className="text-[#1a1a1a] hover:opacity-50 transition-opacity"><IconX /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <span className="text-4xl">🛍</span>
            <p className="text-sm text-[#6b6864]">Your bag is empty.</p>
            <button onClick={() => setCartOpen(false)} className="mt-2 text-sm underline underline-offset-4 text-[#1a1a1a]">Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#edeae4] flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.name}</p>
                    <p className="text-xs text-[#6b6864] mt-0.5">Size: {item.size}</p>
                    <p className="text-sm font-medium mt-1">${(item.price * item.qty).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 border border-[#d8d5d0] rounded-full px-3 py-1">
                        <button onClick={() => updateQty(item.id, item.size, -1)} className="hover:opacity-50 transition-opacity"><IconMinus /></button>
                        <span className="text-xs w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.size, 1)} className="hover:opacity-50 transition-opacity"><IconPlus /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-[#6b6864] underline underline-offset-2 hover:text-[#1a1a1a] transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-[#e0ddd8] space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6864]">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#6b6864]">Shipping & taxes calculated at checkout.</p>
              <button className="w-full bg-[#1a1a1a] text-[#F8F6F2] py-4 text-sm tracking-widest uppercase rounded-full hover:bg-[#333] transition-colors">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#e0ddd8]" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-playfair text-xl font-medium tracking-tight">Blank Page</a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="underline-anim text-sm text-[#6b6864] hover:text-[#1a1a1a] transition-colors">
                {link}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative hover:opacity-60 transition-opacity">
              <IconCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#1a1a1a] text-[#F8F6F2] text-[9px] font-semibold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden hover:opacity-60 transition-opacity" onClick={() => setMenuOpen(!menuOpen)}>
              <IconMenu />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#F8F6F2] border-t border-[#e0ddd8] px-6 py-5 space-y-4">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="block text-sm text-[#6b6864] hover:text-[#1a1a1a]" onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 w-full py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="space-y-8">
              <div className="inline-block text-xs tracking-[0.2em] uppercase text-[#6b6864] border border-[#d8d5d0] rounded-full px-4 py-1.5">
                Retro · Gen Z · Vintage
              </div>
              <h1 className="font-playfair text-6xl md:text-7xl leading-[1.05] font-medium">
                Wear what <br />
                <em>used to be</em><br />
                cool.
              </h1>
              <p className="text-[#6b6864] text-base leading-relaxed max-w-sm">
                Limited-run graphic tees drawing from 90s and Y2K archives. Slow fashion, fast delivery.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#shop" className="bg-[#1a1a1a] text-[#F8F6F2] px-7 py-3.5 rounded-full text-sm tracking-wide hover:bg-[#333] transition-colors inline-flex items-center gap-2">
                  Shop Now <IconArrow />
                </a>
                <a href="#about" className="text-sm text-[#6b6864] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors">
                  Our story
                </a>
              </div>
              {/* Social proof */}
              <div className="flex items-center gap-6 pt-4 border-t border-[#e0ddd8]">
                <div>
                  <p className="text-lg font-semibold">4.9/5</p>
                  <p className="text-xs text-[#6b6864]">Avg. rating</p>
                </div>
                <div className="w-px h-8 bg-[#e0ddd8]" />
                <div>
                  <p className="text-lg font-semibold">2,400+</p>
                  <p className="text-xs text-[#6b6864]">Happy customers</p>
                </div>
                <div className="w-px h-8 bg-[#e0ddd8]" />
                <div>
                  <p className="text-lg font-semibold">Free</p>
                  <p className="text-xs text-[#6b6864]">Returns always</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#edeae4]">
                <img src="/images/hero-tshirt.png" alt="Hero T-shirt" className="w-full h-full object-cover" />
              </div>
              {/* Floating label */}
              <div className="absolute -left-6 bottom-12 bg-[#F8F6F2] border border-[#e0ddd8] rounded-xl px-4 py-3 shadow-sm">
                <p className="text-xs text-[#6b6864]">Latest drop</p>
                <p className="text-sm font-medium mt-0.5">Boom Static Tee</p>
                <p className="text-xs text-[#6b6864] mt-0.5">$38.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="border-y border-[#e0ddd8] overflow-hidden py-3.5 bg-[#F8F6F2]">
        <div className="marquee-track">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12 pr-12">
              {["Free returns on all orders", "100% organic cotton", "Ships in 3–5 days", "Designed in New York", "Limited quantities", "Retro since 2024"].map((t) => (
                <span key={t} className="flex items-center gap-4 text-xs tracking-[0.18em] uppercase text-[#6b6864] whitespace-nowrap">
                  <span className="w-1 h-1 rounded-full bg-[#c0bdb8] inline-block" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Shop ── */}
      <section id="shop" className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6b6864] mb-3">Collection</p>
            <h2 className="font-playfair text-4xl font-medium">Current Drop</h2>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                  activeCategory === cat
                    ? "bg-[#1a1a1a] text-[#F8F6F2] border-[#1a1a1a]"
                    : "bg-transparent text-[#6b6864] border-[#d8d5d0] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((product) => (
            <div key={product.id} className="product-card group">
              {/* Image */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#edeae4] mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img w-full h-full object-cover"
                />
                {/* Tag */}
                <span className="absolute top-3 left-3 text-[10px] tracking-[0.15em] uppercase bg-[#F8F6F2] text-[#1a1a1a] px-2.5 py-1 rounded-full">
                  {product.tag}
                </span>
                {/* Overlay */}
                <div className="product-overlay absolute inset-0 bg-[#1a1a1a]/5 opacity-0 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 gap-3 px-4">
                  {/* Size row */}
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))}
                        className={`w-8 h-8 rounded-full text-[10px] border transition-all ${
                          selectedSizes[product.id] === s
                            ? "bg-[#1a1a1a] text-[#F8F6F2] border-[#1a1a1a]"
                            : "bg-[#F8F6F2] text-[#1a1a1a] border-[#d8d5d0] hover:border-[#1a1a1a]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#1a1a1a] text-[#F8F6F2] py-2.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#333] transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-xs text-[#6b6864] mt-0.5">{product.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">${product.price}</span>
                  <span className="text-xs text-[#a8a5a0] line-through">${product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="border-t border-[#e0ddd8]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#edeae4]">
              <img src="/images/tshirt-2.png" alt="About" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <p className="text-xs tracking-[0.2em] uppercase text-[#6b6864]">About</p>
              <h2 className="font-playfair text-4xl font-medium leading-snug">
                Fashion that<br />remembers.
              </h2>
              <p className="text-[#6b6864] leading-relaxed">
                Blank Page started with one idea — the best graphic tees are the ones buried in thrift store racks, forgotten by time. We bring those designs back, printed on heavyweight 100% organic cotton, in small batches that actually sell out.
              </p>
              <p className="text-[#6b6864] leading-relaxed">
                Every piece ships within 5 business days. Every return is free. And every design is retired once the run is done — no restocks, ever.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { label: "Organic Cotton", desc: "All fabrics GOTS certified" },
                  { label: "Carbon Neutral", desc: "Fully offset shipping" },
                  { label: "Small Batches", desc: "Max 200 units per design" },
                  { label: "Free Returns", desc: "No questions asked" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[#6b6864] mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="border-t border-[#e0ddd8]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#6b6864] mb-3">Reviews</p>
            <h2 className="font-playfair text-4xl font-medium">What people say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="bg-[#F0EDE7] rounded-2xl p-6 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} filled={i < r.rating} />)}
                </div>
                <p className="text-sm leading-relaxed text-[#3a3835]">"{r.text}"</p>
                <div>
                  <p className="text-xs font-medium">{r.name}</p>
                  <p className="text-xs text-[#6b6864]">{r.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="border-t border-[#e0ddd8]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="bg-[#1a1a1a] rounded-2xl px-8 md:px-16 py-16 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-[#6b6864] mb-4">Newsletter</p>
            <h2 className="font-playfair text-4xl font-medium text-[#F8F6F2] mb-3">
              Get early access.
            </h2>
            <p className="text-[#a8a5a0] text-sm mb-10 max-w-md mx-auto">
              New drops sell out in days. Join the list to shop before anyone else — plus 10% off your first order.
            </p>
            {subscribed ? (
              <p className="text-[#F8F6F2] text-sm">You're in. Watch your inbox ✦</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] text-[#F8F6F2] placeholder-[#6b6864] text-sm px-5 py-3 rounded-full outline-none focus:border-[#6b6864] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F8F6F2] text-[#1a1a1a] text-sm font-medium px-6 py-3 rounded-full hover:bg-[#edeae4] transition-colors whitespace-nowrap"
                >
                  Join the list
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t border-[#e0ddd8]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-3">
              <p className="font-playfair text-xl font-medium">Blank Page</p>
              <p className="text-sm text-[#6b6864] max-w-xs leading-relaxed">
                Retro graphic tees for people who know that the best ideas are old ones.
              </p>
              <div className="flex gap-4 pt-2">
                {["Instagram", "TikTok", "Pinterest"].map((s) => (
                  <a key={s} href="#" className="text-xs text-[#6b6864] underline-anim hover:text-[#1a1a1a] transition-colors">{s}</a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs tracking-[0.15em] uppercase font-medium">Shop</p>
              <ul className="space-y-2">
                {["New Arrivals", "Bestsellers", "Y2K", "Graphic", "Sale"].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-[#6b6864] underline-anim hover:text-[#1a1a1a] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-xs tracking-[0.15em] uppercase font-medium">Help</p>
              <ul className="space-y-2">
                {["Sizing Guide", "Shipping Info", "Returns", "FAQ", "Contact Us"].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-[#6b6864] underline-anim hover:text-[#1a1a1a] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-[#e0ddd8]">
            <p className="text-xs text-[#a8a5a0]">© 2025 Blank Page. All rights reserved.</p>
            <p className="text-xs text-[#a8a5a0]">Privacy · Terms · Cookies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
