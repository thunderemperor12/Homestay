
// ============================================================
// Vrinda Vas Homestay – Complete React App (Single-File)
// Run with: Paste into claude.ai artifact runner or
// copy to src/App.jsx in a Vite + Tailwind + Framer Motion project
// ============================================================

import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";

// ── Inline Tailwind config via CDN is assumed. For local dev add:
// tailwind.config.js extend with these custom colors.

// ── CONTEXT ──────────────────────────────────────────────────
const ThemeContext = createContext();
const BookingContext = createContext();

// ── CONSTANTS ─────────────────────────────────────────────────
const COLORS = {
  terracotta: "#E2725B",
  green: "#A8D5BA",
  cream: "#F5F5DC",
  darkBrown: "#3B2A1A",
  warmGray: "#8C7B6B",
  lightCream: "#FDF8F0",
};

const ROOMS = [
  {
    id: 1,
    name: "Cozy Double Room",
    price: 2500,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    description: "A warm, sunlit double room with handcrafted furnishings and garden glimpses.",
    amenities: ["AC", "Private Bathroom", "Free WiFi", "Clean Linen", "Flat-Screen TV"],
    capacity: 2,
    badge: "Most Popular",
  },
  {
    id: 2,
    name: "Family Suite",
    price: 4200,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    description: "Spacious suite perfect for families, with a sitting area and extra beds.",
    amenities: ["AC", "Private Bathroom", "Free WiFi", "Balcony", "Home-Cooked Breakfast", "Flat-Screen TV"],
    capacity: 4,
    badge: "Family Pick",
  },
  {
    id: 3,
    name: "Garden View Room",
    price: 3000,
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80",
    description: "Wake up to lush garden views with fresh morning air and birdsong.",
    amenities: ["AC", "Private Bathroom", "Free WiFi", "Terrace", "Morning Tea"],
    capacity: 2,
    badge: "Garden Escape",
  },
  {
    id: 4,
    name: "Budget Single Room",
    price: 1600,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    description: "Clean and comfortable single room ideal for solo travelers on a budget.",
    amenities: ["Fan/AC", "Shared Bathroom", "Free WiFi", "Clean Linen"],
    capacity: 1,
    badge: "Budget Friendly",
  },
];

const REVIEWS = [
  { id: 1, name: "Priya S.", city: "Pune", rating: 5, text: "Felt like staying at a relative's home! Clean rooms, delicious breakfast, and the host family was incredibly warm.", avatar: "PS", date: "March 2025" },
  { id: 2, name: "Rahul & Meena", city: "Mumbai", rating: 5, text: "The garden view room was breathtaking. Woke up to birds chirping. Perfect getaway from city life!", avatar: "RM", date: "February 2025" },
  { id: 3, name: "Amit K.", city: "Bangalore", rating: 4, text: "Great location, 5 min from Rankala Lake. Host helped us plan our Kolhapur sightseeing. Highly recommend!", avatar: "AK", date: "January 2025" },
  { id: 4, name: "Sunita P.", city: "Nashik", rating: 5, text: "The home-cooked meals were the highlight! Authentic Kolhapuri flavors. Will definitely return.", avatar: "SP", date: "December 2024" },
  { id: 5, name: "Dev & Family", city: "Hyderabad", rating: 5, text: "Perfect for a family trip. Kids loved the garden. Peaceful, clean, and affordable. 10/10!", avatar: "DF", date: "November 2024" },
];

const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80", caption: "Lush Garden Courtyard" },
  { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", caption: "Cozy Double Room" },
  { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", caption: "Family Suite" },
  { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", caption: "Home-Cooked Breakfast" },
  { url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80", caption: "Garden View Room" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", caption: "Kolhapur Landscape" },
];

const AMENITIES = [
  { icon: "🚗", label: "Free Parking" },
  { icon: "🏠", label: "24/7 Host Assistance" },
  { icon: "🌿", label: "Garden & Patio" },
  { icon: "🍽️", label: "Home-Cooked Meals" },
  { icon: "🐾", label: "Pet-Friendly Rooms" },
  { icon: "🧹", label: "Daily Housekeeping" },
  { icon: "⏰", label: "Wake-up Service" },
  { icon: "📺", label: "Flat-Screen TV" },
  { icon: "🚭", label: "Non-Smoking Areas" },
  { icon: "📶", label: "Free WiFi" },
  { icon: "☕", label: "Morning Tea/Coffee" },
  { icon: "🔒", label: "24/7 Security" },
];

// ── UTILS ──────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const today = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

// ── COMPONENTS ─────────────────────────────────────────────────

// NavBar
function NavBar({ activeSection, setActiveSection }) {
  const { darkMode, toggleDark } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Home", "Rooms", "Gallery", "About", "Contact"];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled
          ? darkMode ? "rgba(30,20,10,0.97)" : "rgba(253,248,240,0.97)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.terracotta}33` : "none",
        transition: "all 0.4s ease",
        padding: "0.75rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}
        onClick={() => setActiveSection("Home")}>
        <span style={{ fontSize: "1.8rem" }}>🏡</span>
        <div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: scrolled ? (darkMode ? COLORS.cream : COLORS.darkBrown) : COLORS.cream,
            lineHeight: 1,
          }}>Vrinda Vas</div>
          <div style={{ fontSize: "0.65rem", color: COLORS.terracotta, letterSpacing: "0.12em", fontFamily: "'Poppins', sans-serif" }}>HOMESTAY · KOLHAPUR</div>
        </div>
      </div>

      {/* Desktop Links */}
      <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}
        className="desktop-nav">
        {navLinks.map(link => (
          <button key={link}
            aria-label={`Navigate to ${link}`}
            onClick={() => setActiveSection(link)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "0.88rem",
              color: activeSection === link
                ? COLORS.terracotta
                : scrolled ? (darkMode ? COLORS.cream : COLORS.darkBrown) : COLORS.cream,
              borderBottom: activeSection === link ? `2px solid ${COLORS.terracotta}` : "2px solid transparent",
              paddingBottom: "2px", transition: "all 0.2s",
            }}>{link}</button>
        ))}
        <button
          aria-label="Book Now"
          onClick={() => setActiveSection("Rooms")}
          style={{
            background: COLORS.terracotta, color: "#fff",
            border: "none", borderRadius: "25px",
            padding: "0.45rem 1.2rem",
            fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.82rem",
            cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 14px #E2725B44",
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px #E2725B66"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 14px #E2725B44"; }}
        >Book Now</button>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDark}
          style={{
            background: "none", border: `1px solid ${darkMode ? COLORS.cream : scrolled ? COLORS.darkBrown : COLORS.cream}44`,
            borderRadius: "50%", width: "34px", height: "34px",
            cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >{darkMode ? "☀️" : "🌙"}</button>
      </div>

      {/* Mobile menu button */}
      <button
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="mobile-nav-btn"
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "1.5rem", color: scrolled ? (darkMode ? COLORS.cream : COLORS.darkBrown) : COLORS.cream,
        }}
      >{menuOpen ? "✕" : "☰"}</button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: darkMode ? "#1e140a" : COLORS.lightCream,
          borderTop: `2px solid ${COLORS.terracotta}`,
          padding: "1rem",
          display: "flex", flexDirection: "column", gap: "0.75rem",
        }}>
          {navLinks.map(link => (
            <button key={link} onClick={() => { setActiveSection(link); setMenuOpen(false); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Poppins', sans-serif", fontWeight: 500,
                color: darkMode ? COLORS.cream : COLORS.darkBrown,
                textAlign: "left", padding: "0.4rem 0",
                borderBottom: `1px solid ${COLORS.terracotta}22`,
              }}>{link}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

// Hero Section
function HeroSection({ setActiveSection }) {
  const [imgIndex, setImgIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1600&q=85",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=85",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85",
  ];

  useEffect(() => {
    const t = setInterval(() => setImgIndex(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section aria-label="Hero" style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {heroImages.map((img, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === imgIndex ? 1 : 0,
          transition: "opacity 1.2s ease",
        }} />
      ))}
      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(30,15,5,0.55) 0%, rgba(30,15,5,0.75) 60%, rgba(30,15,5,0.92) 100%)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 1.5rem",
        paddingTop: "5rem",
      }}>
        {/* Badge */}
        <div style={{
          background: `${COLORS.terracotta}22`, border: `1px solid ${COLORS.terracotta}88`,
          borderRadius: "25px", padding: "0.3rem 1rem",
          color: COLORS.green, fontSize: "0.78rem",
          fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1em",
          marginBottom: "1.2rem",
          animation: "fadeInDown 0.8s ease",
        }}>
          ✦ Certified Homestay · Kolhapur, Maharashtra ✦
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
          color: COLORS.cream,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "0.8rem",
          animation: "fadeInDown 0.8s ease 0.1s both",
          textShadow: "0 4px 30px rgba(0,0,0,0.4)",
        }}>
          Vrinda Vas<br />
          <span style={{ color: COLORS.terracotta }}>Homestay</span>
        </h1>

        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
          color: "#e8ddd0",
          marginBottom: "1.5rem",
          maxWidth: "560px",
          lineHeight: 1.7,
          animation: "fadeInDown 0.8s ease 0.2s both",
        }}>
          Your cozy home away from home<br />in vibrant Kolhapur
        </p>

        {/* Star Rating */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          marginBottom: "2rem",
          animation: "fadeInDown 0.8s ease 0.3s both",
        }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {"★★★★★".split("").map((s, i) => (
              <span key={i} style={{ color: "#FFD700", fontSize: "1.2rem" }}>{s}</span>
            ))}
          </div>
          <span style={{ color: COLORS.cream, fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem" }}>
            <strong>4.8</strong>/5 from guest reviews
          </span>
        </div>

        {/* Highlights */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.75rem",
          justifyContent: "center", marginBottom: "2.5rem",
          animation: "fadeInDown 0.8s ease 0.4s both",
        }}>
          {["📍 5km from Rankala Lake", "🚂 3km from Railway Station", "🌿 Garden & Home-Cooked Meals"].map(h => (
            <span key={h} style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "20px",
              padding: "0.35rem 0.9rem",
              color: COLORS.cream,
              fontSize: "0.8rem",
              fontFamily: "'Poppins', sans-serif",
            }}>{h}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center",
          animation: "fadeInDown 0.8s ease 0.5s both" }}>
          <button
            aria-label="Check availability"
            onClick={() => setActiveSection("Home")}
            style={{
              background: COLORS.terracotta,
              color: "#fff", border: "none",
              borderRadius: "30px", padding: "0.85rem 2rem",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700,
              fontSize: "1rem", cursor: "pointer",
              boxShadow: "0 8px 30px #E2725B55",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px #E2725B88"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 30px #E2725B55"; }}
          >🏠 Check Availability</button>
          <button
            aria-label="View rooms"
            onClick={() => setActiveSection("Rooms")}
            style={{
              background: "transparent",
              color: COLORS.cream, border: `2px solid ${COLORS.cream}88`,
              borderRadius: "30px", padding: "0.85rem 2rem",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600,
              fontSize: "1rem", cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}
          >🛏 View Rooms</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        color: COLORS.cream, opacity: 0.7, fontSize: "0.72rem",
        fontFamily: "'Poppins', sans-serif", animation: "bounce 2s infinite",
        letterSpacing: "0.1em",
      }}>
        <span>SCROLL</span>
        <span style={{ fontSize: "1.2rem" }}>↓</span>
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: "5rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "0.5rem",
      }}>
        {heroImages.map((_, i) => (
          <button key={i}
            aria-label={`Hero image ${i + 1}`}
            onClick={() => setImgIndex(i)}
            style={{
              width: i === imgIndex ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === imgIndex ? COLORS.terracotta : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
      `}</style>
    </section>
  );
}

// Booking Form
function BookingForm({ onSearch }) {
  const { darkMode } = useContext(ThemeContext);
  const [form, setForm] = useState({
    checkin: today(), checkout: tomorrow(),
    adults: 2, children: 0, rooms: 1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const bg = darkMode ? "#2a1a0d" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;
  const border = darkMode ? "#5a4030" : "#e8ddd0";

  const handleSearch = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const available = Math.random() > 0.2;
      const nights = Math.max(1, Math.ceil((new Date(form.checkout) - new Date(form.checkin)) / 86400000));
      setResult({
        available,
        nights,
        rooms: ROOMS.filter(r => r.capacity >= form.adults / form.rooms).slice(0, 3),
        message: available
          ? `🎉 Great news! ${nights} night(s) available for ${form.adults} adult(s).`
          : "😔 No availability for selected dates. Please try different dates.",
      });
      setLoading(false);
      if (onSearch) onSearch(form);
    }, 1200);
  };

  const inputStyle = {
    background: darkMode ? "#1e1008" : COLORS.lightCream,
    border: `1px solid ${border}`,
    borderRadius: "10px",
    padding: "0.6rem 0.8rem",
    color: text,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: COLORS.warmGray,
    letterSpacing: "0.08em",
    marginBottom: "0.35rem",
    textTransform: "uppercase",
  };

  return (
    <section aria-label="Search booking" style={{
      background: darkMode ? "#1e1008" : COLORS.lightCream,
      padding: "2rem 1.5rem",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          background: bg,
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: darkMode ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(226,114,91,0.12)",
          border: `1px solid ${border}`,
        }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            color: text, fontSize: "1.4rem", marginBottom: "1.5rem",
            textAlign: "center",
          }}>🔍 Find Your Perfect Stay</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}>
            <div>
              <label style={labelStyle} htmlFor="checkin">Check-In</label>
              <input id="checkin" type="date" value={form.checkin} min={today()}
                onChange={e => setForm({ ...form, checkin: e.target.value })}
                style={inputStyle} aria-label="Check-in date" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="checkout">Check-Out</label>
              <input id="checkout" type="date" value={form.checkout} min={form.checkin}
                onChange={e => setForm({ ...form, checkout: e.target.value })}
                style={inputStyle} aria-label="Check-out date" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="adults">Adults</label>
              <select id="adults" value={form.adults}
                onChange={e => setForm({ ...form, adults: +e.target.value })}
                style={inputStyle} aria-label="Number of adults">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle} htmlFor="children">Children</label>
              <select id="children" value={form.children}
                onChange={e => setForm({ ...form, children: +e.target.value })}
                style={inputStyle} aria-label="Number of children">
                {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Child{n !== 1 ? "ren" : ""}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle} htmlFor="rooms">Rooms</label>
              <select id="rooms" value={form.rooms}
                onChange={e => setForm({ ...form, rooms: +e.target.value })}
                style={inputStyle} aria-label="Number of rooms">
                {[1,2,3].map(n => <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              aria-label="Search available stays"
              onClick={handleSearch}
              disabled={loading}
              style={{
                background: loading ? COLORS.warmGray : COLORS.terracotta,
                color: "#fff", border: "none",
                borderRadius: "30px", padding: "0.85rem 2.5rem",
                fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                fontSize: "1rem", cursor: loading ? "wait" : "pointer",
                boxShadow: "0 6px 24px #E2725B44",
                transition: "all 0.2s",
              }}
            >{loading ? "⏳ Checking..." : "🔍 Search Stays"}</button>
          </div>

          {result && (
            <div style={{
              marginTop: "1.5rem",
              padding: "1.2rem",
              borderRadius: "12px",
              background: result.available
                ? `${COLORS.green}22`
                : "rgba(220,80,80,0.1)",
              border: `1px solid ${result.available ? COLORS.green : "#e05555"}44`,
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                color: result.available ? "#2d6a4f" : "#b33",
                fontWeight: 600, fontSize: "1rem",
                marginBottom: result.available ? "1rem" : 0,
              }}>{result.message}</p>
              {result.available && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                  {result.rooms.map(r => (
                    <div key={r.id} style={{
                      background: bg, borderRadius: "10px",
                      padding: "0.6rem 1rem",
                      border: `1px solid ${border}`,
                      fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem",
                      color: text,
                    }}>
                      <strong>{r.name}</strong><br />
                      <span style={{ color: COLORS.terracotta, fontWeight: 700 }}>
                        ₹{(r.price * result.nights).toLocaleString("en-IN")}
                      </span>
                      <span style={{ color: COLORS.warmGray }}> / {result.nights} night{result.nights > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Rooms Section
function RoomsSection() {
  const { darkMode } = useContext(ThemeContext);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [bookedRoom, setBookedRoom] = useState(null);
  const bg = darkMode ? "#1e1008" : COLORS.lightCream;
  const cardBg = darkMode ? "#2a1a0d" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;

  return (
    <section aria-label="Our rooms" id="rooms" style={{ background: bg, padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: COLORS.terracotta, fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Where You'll Rest</span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: text, margin: "0.5rem 0" }}>Our Cozy Rooms</h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.warmGray, maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            Each room lovingly prepared to feel like your own peaceful corner.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.8rem",
        }}>
          {ROOMS.map(room => (
            <div key={room.id}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              style={{
                background: cardBg,
                borderRadius: "18px",
                overflow: "hidden",
                border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}`,
                boxShadow: hoveredRoom === room.id
                  ? "0 20px 60px rgba(226,114,91,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.06)",
                transform: hoveredRoom === room.id ? "translateY(-6px)" : "translateY(0)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}>
              {/* Image */}
              <div style={{ position: "relative", overflow: "hidden", height: "200px" }}>
                <img src={room.image} alt={room.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: hoveredRoom === room.id ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.5s ease",
                  }} />
                <div style={{
                  position: "absolute", top: "0.75rem", left: "0.75rem",
                  background: COLORS.terracotta, color: "#fff",
                  borderRadius: "15px", padding: "0.2rem 0.7rem",
                  fontSize: "0.72rem", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                }}>{room.badge}</div>
                <div style={{
                  position: "absolute", bottom: "0.75rem", right: "0.75rem",
                  background: "rgba(30,10,0,0.75)", backdropFilter: "blur(6px)",
                  color: COLORS.cream, borderRadius: "10px",
                  padding: "0.25rem 0.7rem",
                  fontSize: "0.78rem", fontFamily: "'Poppins', sans-serif",
                }}>👤 Up to {room.capacity} guests</div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.1rem", color: text, marginBottom: "0.4rem" }}>{room.name}</h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: COLORS.warmGray, lineHeight: 1.6, marginBottom: "1rem" }}>{room.description}</p>

                {/* Amenities */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.2rem" }}>
                  {room.amenities.map(a => (
                    <span key={a} style={{
                      background: darkMode ? "#3a2a1a" : `${COLORS.green}33`,
                      color: darkMode ? COLORS.green : "#2d6a4f",
                      borderRadius: "20px", padding: "0.2rem 0.6rem",
                      fontSize: "0.7rem", fontFamily: "'Poppins', sans-serif", fontWeight: 500,
                    }}>{a}</span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", color: COLORS.terracotta, fontWeight: 700 }}>
                      ₹{room.price.toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.warmGray, fontSize: "0.78rem" }}>/night</span>
                  </div>
                  <button
                    aria-label={`Book ${room.name}`}
                    onClick={() => setBookedRoom(room)}
                    style={{
                      background: COLORS.terracotta, color: "#fff",
                      border: "none", borderRadius: "20px",
                      padding: "0.5rem 1.1rem",
                      fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                      fontSize: "0.82rem", cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.background = "#c85a45"}
                    onMouseLeave={e => e.target.style.background = COLORS.terracotta}
                  >Book Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookedRoom && (
        <BookingModal room={bookedRoom} onClose={() => setBookedRoom(null)} />
      )}
    </section>
  );
}

// Booking Modal
function BookingModal({ room, onClose }) {
  const { darkMode } = useContext(ThemeContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    checkin: today(), checkout: tomorrow(),
    specialReq: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const bg = darkMode ? "#1e1008" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;
  const inputStyle = {
    width: "100%", padding: "0.65rem 0.9rem",
    background: darkMode ? "#2a1a0d" : COLORS.lightCream,
    border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}`,
    borderRadius: "10px", color: text,
    fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem",
    outline: "none", boxSizing: "border-box",
  };

  const nights = Math.max(1, Math.ceil((new Date(formData.checkout) - new Date(formData.checkin)) / 86400000));

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(onClose, 3500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(20,10,5,0.8)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }} onClick={onClose}>
      <div style={{
        background: bg, borderRadius: "20px",
        width: "100%", maxWidth: "480px",
        padding: "2rem",
        boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
        border: `1px solid ${COLORS.terracotta}44`,
      }} onClick={e => e.stopPropagation()}>

        {confirmed ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: COLORS.terracotta, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Booking Confirmed!</h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: text, lineHeight: 1.7 }}>
              Thank you, <strong>{formData.name || "Guest"}</strong>! Your booking for <strong>{room.name}</strong> has been received. A confirmation will be sent to your contact.
            </p>
            <p style={{ color: COLORS.warmGray, fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", marginTop: "0.5rem" }}>Closing in 3 seconds…</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: text, fontSize: "1.2rem" }}>Book {room.name}</h3>
              <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.warmGray, cursor: "pointer", fontSize: "1.3rem" }}>✕</button>
            </div>

            {/* Price summary */}
            <div style={{
              background: darkMode ? "#2a1a0d" : `${COLORS.terracotta}11`,
              borderRadius: "12px", padding: "0.9rem 1rem", marginBottom: "1.5rem",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: COLORS.warmGray }}>Total Estimate</div>
                <div style={{ fontFamily: "'Cinzel', serif", color: COLORS.terracotta, fontSize: "1.4rem", fontWeight: 700 }}>
                  ₹{(room.price * nights).toLocaleString("en-IN")}
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: COLORS.warmGray }}>
                  ₹{room.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}
                </div>
              </div>
              <div style={{ fontSize: "2.5rem" }}>🏡</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: COLORS.warmGray, marginBottom: "0.3rem", fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" }}>Check-In</label>
                <input type="date" value={formData.checkin} min={today()}
                  onChange={e => setFormData({ ...formData, checkin: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: COLORS.warmGray, marginBottom: "0.3rem", fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" }}>Check-Out</label>
                <input type="date" value={formData.checkout} min={formData.checkin}
                  onChange={e => setFormData({ ...formData, checkout: e.target.value })}
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <input placeholder="Your Full Name *" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle} aria-label="Full name" />
              <input placeholder="Email Address *" type="email" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle} aria-label="Email" />
              <input placeholder="Phone Number *" type="tel" value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={inputStyle} aria-label="Phone" />
              <textarea placeholder="Special Requests (optional)" value={formData.specialReq}
                onChange={e => setFormData({ ...formData, specialReq: e.target.value })}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }} aria-label="Special requests" />
            </div>

            <button
              aria-label="Confirm booking"
              onClick={handleConfirm}
              disabled={!formData.name || !formData.email || !formData.phone}
              style={{
                width: "100%",
                background: (!formData.name || !formData.email || !formData.phone) ? COLORS.warmGray : COLORS.terracotta,
                color: "#fff", border: "none", borderRadius: "25px",
                padding: "0.85rem",
                fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem",
                cursor: (!formData.name || !formData.email || !formData.phone) ? "not-allowed" : "pointer",
                boxShadow: "0 6px 20px #E2725B44",
              }}>Confirm Booking 🎉</button>
          </>
        )}
      </div>
    </div>
  );
}

// About Section
function AboutSection() {
  const { darkMode } = useContext(ThemeContext);
  const bg = darkMode ? "#1e1008" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;

  const attractions = [
    { icon: "🌊", name: "Rankala Lake", dist: "5 km" },
    { icon: "🛕", name: "Mahalaxmi Temple", dist: "4 km" },
    { icon: "🏛️", name: "Kolhapur Museum", dist: "3.5 km" },
    { icon: "🚂", name: "Railway Station", dist: "3 km" },
    { icon: "🛍️", name: "City Market", dist: "2.5 km" },
    { icon: "🍴", name: "Local Restaurants", dist: "0.5 km" },
  ];

  return (
    <section aria-label="About us" style={{ background: darkMode ? "#160d05" : COLORS.cream, padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
          {/* Text */}
          <div>
            <span style={{ color: COLORS.terracotta, fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Our Story</span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: text, margin: "0.5rem 0 1rem" }}>A Home,<br />Not Just a Room</h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.warmGray, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "1.2rem" }}>
              Vrinda Vas is an intimate homestay offering clean, comfortable rooms with a family-like atmosphere. Run by the Kulkarni family for over a decade, we've welcomed travelers from across India and the world.
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.warmGray, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Enjoy peaceful garden views, authentic local hospitality, and easy access to Kolhapur's finest sights — all with the warmth of home-cooked food and genuine care.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[["10+", "Years of Hospitality"], ["500+", "Happy Guests"], ["4.8★", "Average Rating"]].map(([num, lbl]) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.8rem", color: COLORS.terracotta, fontWeight: 700 }}>{num}</div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: COLORS.warmGray, textTransform: "uppercase", letterSpacing: "0.08em" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder + Attractions */}
          <div>
            {/* Map visual */}
            <div style={{
              background: darkMode ? "#2a1a0d" : "#e8f4ee",
              borderRadius: "18px",
              overflow: "hidden",
              height: "220px",
              marginBottom: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${COLORS.green}44`,
              position: "relative",
            }}>
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=70"
                alt="Map area Kolhapur"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
              />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(30,10,0,0.4)",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.4rem" }}>📍</div>
                <div style={{ fontFamily: "'Cinzel', serif", color: COLORS.cream, fontSize: "1rem", fontWeight: 700 }}>Vrinda Vas Homestay</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", color: "#e8ddd0", fontSize: "0.78rem" }}>Shastri Nagar, Kolhapur – 416 003</div>
                <a href="https://maps.google.com/?q=Shastri+Nagar+Kolhapur" target="_blank" rel="noopener noreferrer"
                  style={{
                    marginTop: "0.8rem",
                    background: COLORS.terracotta, color: "#fff",
                    borderRadius: "20px", padding: "0.35rem 0.9rem",
                    fontSize: "0.75rem", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                    textDecoration: "none",
                  }}>Open in Maps →</a>
              </div>
            </div>

            {/* Nearby attractions */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "0.6rem",
            }}>
              {attractions.map(a => (
                <div key={a.name} style={{
                  background: bg,
                  borderRadius: "10px",
                  padding: "0.6rem 0.8rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}`,
                }}>
                  <span style={{ fontSize: "1.2rem" }}>{a.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: text, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.68rem", color: COLORS.terracotta }}>{a.dist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Amenities Section
function AmenitiesSection() {
  const { darkMode } = useContext(ThemeContext);
  const bg = darkMode ? "#1e1008" : COLORS.lightCream;
  const cardBg = darkMode ? "#2a1a0d" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;

  return (
    <section aria-label="Amenities" style={{ background: bg, padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: COLORS.terracotta, fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Comfort & Care</span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: text, margin: "0.5rem 0" }}>What We Offer</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          {AMENITIES.map((a, i) => (
            <div key={i} style={{
              background: cardBg,
              borderRadius: "14px",
              padding: "1.2rem 1rem",
              textAlign: "center",
              border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(226,114,91,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{a.icon}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", fontWeight: 500, color: text }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery
function GallerySection() {
  const { darkMode } = useContext(ThemeContext);
  const [lightbox, setLightbox] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const bg = darkMode ? "#160d05" : COLORS.cream;
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;

  const openLightbox = (i) => { setLightbox(i); setActiveIndex(i); };
  const prev = () => setActiveIndex(i => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const next = () => setActiveIndex(i => (i + 1) % GALLERY_IMAGES.length);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <section aria-label="Photo gallery" style={{ background: bg, padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: COLORS.terracotta, fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Moments & Memories</span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: text, margin: "0.5rem 0" }}>Glimpses of Vrinda Vas</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i}
              onClick={() => openLightbox(i)}
              style={{
                borderRadius: "14px", overflow: "hidden",
                cursor: "pointer", position: "relative",
                height: i === 0 ? "320px" : "220px",
                transition: "transform 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              role="button" aria-label={`View ${img.caption}`} tabIndex={0}
              onKeyDown={e => e.key === "Enter" && openLightbox(i)}
            >
              <img src={img.url} alt={img.caption}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(30,10,0,0.7) 0%, transparent 60%)",
                display: "flex", alignItems: "flex-end", padding: "0.8rem",
              }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.cream, fontSize: "0.82rem", fontWeight: 500 }}>{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(10,5,0,0.95)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
            style={{
              position: "absolute", left: "1rem",
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
              width: "48px", height: "48px", color: "#fff", fontSize: "1.3rem", cursor: "pointer",
            }}>‹</button>
          <div onClick={e => e.stopPropagation()} style={{ textAlign: "center", maxWidth: "90vw" }}>
            <img src={GALLERY_IMAGES[activeIndex].url} alt={GALLERY_IMAGES[activeIndex].caption}
              style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: "12px", objectFit: "contain" }} />
            <p style={{ color: COLORS.cream, fontFamily: "'Poppins', sans-serif", marginTop: "0.75rem" }}>
              {GALLERY_IMAGES[activeIndex].caption}
            </p>
          </div>
          <button onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Next image"
            style={{
              position: "absolute", right: "1rem",
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
              width: "48px", height: "48px", color: "#fff", fontSize: "1.3rem", cursor: "pointer",
            }}>›</button>
          <button onClick={() => setLightbox(null)}
            aria-label="Close gallery"
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
              width: "40px", height: "40px", color: "#fff", fontSize: "1.1rem", cursor: "pointer",
            }}>✕</button>
        </div>
      )}
    </section>
  );
}

// Reviews Section
function ReviewsSection() {
  const { darkMode } = useContext(ThemeContext);
  const bg = darkMode ? "#1e1008" : COLORS.lightCream;
  const cardBg = darkMode ? "#2a1a0d" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(i => (i + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section aria-label="Guest reviews" style={{ background: bg, padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: COLORS.terracotta, fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Guest Love</span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: text, margin: "0.5rem 0" }}>What Our Guests Say</h2>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#FFD700" }}>{s}</span>)}</div>
            <span style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.warmGray }}>4.8/5 from 200+ reviews</span>
          </div>
        </div>

        {/* Featured review */}
        <div style={{
          background: cardBg, borderRadius: "20px",
          padding: "2.5rem",
          border: `1px solid ${COLORS.terracotta}44`,
          boxShadow: "0 8px 40px rgba(226,114,91,0.1)",
          textAlign: "center",
          marginBottom: "1.5rem",
          transition: "all 0.5s",
        }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: COLORS.terracotta, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "1.1rem",
            margin: "0 auto 1rem",
          }}>{REVIEWS[activeReview].avatar}</div>
          <p style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "1.05rem",
            color: text, lineHeight: 1.8,
            fontStyle: "italic", maxWidth: "600px", margin: "0 auto 1.2rem",
          }}>"{REVIEWS[activeReview].text}"</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "0.5rem" }}>
            {"★".repeat(REVIEWS[activeReview].rating).split("").map((s, i) => (
              <span key={i} style={{ color: "#FFD700", fontSize: "1.1rem" }}>{s}</span>
            ))}
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: text }}>{REVIEWS[activeReview].name}</div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: COLORS.warmGray }}>{REVIEWS[activeReview].city} · {REVIEWS[activeReview].date}</div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          {REVIEWS.map((_, i) => (
            <button key={i}
              aria-label={`Review ${i + 1}`}
              onClick={() => setActiveReview(i)}
              style={{
                width: i === activeReview ? "24px" : "8px", height: "8px",
                borderRadius: "4px",
                background: i === activeReview ? COLORS.terracotta : `${COLORS.warmGray}44`,
                border: "none", cursor: "pointer", transition: "all 0.3s",
              }} />
          ))}
        </div>

        {/* Grid of all reviews */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginTop: "2.5rem" }}>
          {REVIEWS.map((r, i) => (
            <div key={r.id} onClick={() => setActiveReview(i)}
              style={{
                background: cardBg, borderRadius: "14px",
                padding: "1.2rem",
                border: `1px solid ${i === activeReview ? COLORS.terracotta : darkMode ? "#5a4030" : "#e8ddd0"}`,
                cursor: "pointer", transition: "all 0.2s",
                opacity: i === activeReview ? 1 : 0.75,
              }}>
              <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", marginBottom: "0.6rem" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: COLORS.terracotta, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
                }}>{r.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: text }}>{r.name}</div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.7rem", color: COLORS.warmGray }}>{r.city}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: "1px" }}>
                  {"★".repeat(r.rating).split("").map((s, j) => <span key={j} style={{ color: "#FFD700", fontSize: "0.8rem" }}>{s}</span>)}
                </div>
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: COLORS.warmGray, lineHeight: 1.6, fontStyle: "italic" }}>
                "{r.text.slice(0, 80)}…"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { darkMode } = useContext(ThemeContext);
  const bg = darkMode ? "#160d05" : COLORS.cream;
  const cardBg = darkMode ? "#2a1a0d" : "#fff";
  const text = darkMode ? COLORS.cream : COLORS.darkBrown;
  const [msgSent, setMsgSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const inputStyle = {
    width: "100%", padding: "0.7rem 0.9rem",
    background: darkMode ? "#1e1008" : COLORS.lightCream,
    border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}`,
    borderRadius: "10px", color: text,
    fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem",
    outline: "none", boxSizing: "border-box",
  };

  const sendMsg = () => {
    setMsgSent(true);
    setTimeout(() => { setMsgSent(false); setContactForm({ name: "", email: "", message: "" }); }, 3000);
  };

  return (
    <section aria-label="Contact us" style={{ background: bg, padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ color: COLORS.terracotta, fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Get in Touch</span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: text, margin: "0.5rem 0" }}>We'd Love to Hear From You</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
          {/* Info */}
          <div>
            <div style={{ background: cardBg, borderRadius: "18px", padding: "2rem", border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}` }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: text, marginBottom: "1.5rem" }}>Contact Details</h3>
              {[
                { icon: "📍", label: "Address", val: "House No. 12, Shastri Nagar, Kolhapur – 416 003, Maharashtra" },
                { icon: "📞", label: "Phone", val: "+91 98765 43210 / +91 87654 32109" },
                { icon: "✉️", label: "Email", val: "vrindavashomestay@gmail.com" },
                { icon: "🕐", label: "Check-in", val: "12:00 PM · Check-out: 11:00 AM" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: COLORS.warmGray, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", color: text }}>{c.val}</div>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                {[["📘", "Facebook"], ["📸", "Instagram"], ["🐦", "Twitter"], ["▶️", "YouTube"]].map(([icon, name]) => (
                  <button key={name}
                    aria-label={`Follow on ${name}`}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: darkMode ? "#3a2a1a" : `${COLORS.terracotta}15`,
                      border: `1px solid ${COLORS.terracotta}44`,
                      cursor: "pointer", fontSize: "1.1rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.terracotta; }}
                    onMouseLeave={e => { e.currentTarget.style.background = darkMode ? "#3a2a1a" : `${COLORS.terracotta}15`; }}
                  >{icon}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div style={{ background: cardBg, borderRadius: "18px", padding: "2rem", border: `1px solid ${darkMode ? "#5a4030" : "#e8ddd0"}` }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: text, marginBottom: "1.5rem" }}>Send a Message</h3>
            {msgSent ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
                <p style={{ fontFamily: "'Poppins', sans-serif", color: text, fontWeight: 600 }}>Message sent! We'll reply within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <input placeholder="Your Name" value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  style={inputStyle} aria-label="Name" />
                <input placeholder="Email Address" type="email" value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  style={inputStyle} aria-label="Email" />
                <textarea placeholder="Your message or query…" rows={4} value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }} aria-label="Message" />
                <button
                  aria-label="Send message"
                  onClick={sendMsg}
                  disabled={!contactForm.name || !contactForm.email || !contactForm.message}
                  style={{
                    background: COLORS.terracotta, color: "#fff",
                    border: "none", borderRadius: "25px",
                    padding: "0.85rem",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                    fontSize: "1rem", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.background = "#c85a45"}
                  onMouseLeave={e => e.target.style.background = COLORS.terracotta}
                >Send Message 📨</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer({ setActiveSection }) {
  const { darkMode } = useContext(ThemeContext);
  const bg = darkMode ? "#0d0600" : "#2a1a0d";

  return (
    <footer aria-label="Footer" style={{ background: bg, color: COLORS.cream, padding: "3.5rem 1.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.8rem" }}>🏡</span>
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "1.1rem" }}>Vrinda Vas</div>
                <div style={{ fontSize: "0.65rem", color: COLORS.terracotta, letterSpacing: "0.12em", fontFamily: "'Poppins', sans-serif" }}>HOMESTAY · KOLHAPUR</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#c8b8a8", lineHeight: 1.8 }}>
              A cozy, family-run homestay offering warm hospitality and comfortable stays in the heart of Kolhapur.
            </p>
            {/* Pet-friendly badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              background: `${COLORS.green}22`, border: `1px solid ${COLORS.green}44`,
              borderRadius: "20px", padding: "0.35rem 0.8rem",
              marginTop: "1rem",
            }}>
              <span>🐾</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem", color: COLORS.green, fontWeight: 600 }}>Pet-Friendly Stay</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", marginBottom: "1rem" }}>Quick Links</h4>
            {["Home", "Rooms", "Gallery", "About", "Contact"].map(link => (
              <button key={link} onClick={() => setActiveSection(link)}
                style={{
                  display: "block", background: "none", border: "none",
                  color: "#c8b8a8", fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.85rem", padding: "0.3rem 0", cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.target.style.color = COLORS.terracotta}
                onMouseLeave={e => e.target.style.color = "#c8b8a8"}
              >→ {link}</button>
            ))}
          </div>

          {/* Contact mini */}
          <div>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", marginBottom: "1rem" }}>Find Us</h4>
            {[
              ["📍", "Shastri Nagar, Kolhapur – 416 003"],
              ["📞", "+91 98765 43210"],
              ["✉️", "vrindavashomestay@gmail.com"],
            ].map(([icon, val]) => (
              <div key={val} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.6rem", alignItems: "flex-start" }}>
                <span>{icon}</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#c8b8a8" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Mini booking */}
          <div>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", marginBottom: "1rem" }}>Quick Booking</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { id: "footer-checkin", type: "date", label: "Check-In", defaultValue: today() },
                { id: "footer-checkout", type: "date", label: "Check-Out", defaultValue: tomorrow() },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ fontSize: "0.68rem", color: "#a89888", display: "block", marginBottom: "0.2rem", fontFamily: "'Poppins', sans-serif", textTransform: "uppercase" }}>{f.label}</label>
                  <input id={f.id} type={f.type} defaultValue={f.defaultValue}
                    style={{
                      width: "100%", padding: "0.5rem 0.7rem",
                      background: "#1e1008", border: "1px solid #5a4030",
                      borderRadius: "8px", color: COLORS.cream,
                      fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem",
                      outline: "none", boxSizing: "border-box",
                    }} />
                </div>
              ))}
              <button
                onClick={() => setActiveSection("Rooms")}
                style={{
                  background: COLORS.terracotta, color: "#fff",
                  border: "none", borderRadius: "20px",
                  padding: "0.6rem", fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                  marginTop: "0.25rem",
                }}>Book Now 🏠</button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #3a2a1a",
          paddingTop: "1.5rem",
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center", gap: "0.75rem",
        }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#7a6050" }}>
            © 2025 Vrinda Vas Homestay, Kolhapur. All rights reserved. · Made with ❤️ in Maharashtra
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem", color: "#7a6050" }}>
            Privacy Policy · Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const toggleDark = () => setDarkMode(d => !d);

  // Scroll to section on nav
  const sectionRefs = {
    Home: useRef(null),
    Rooms: useRef(null),
    Gallery: useRef(null),
    About: useRef(null),
    Contact: useRef(null),
  };

  useEffect(() => {
    const ref = sectionRefs[activeSection];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      <div style={{
        minHeight: "100vh",
        background: darkMode ? "#160d05" : COLORS.lightCream,
        transition: "background 0.3s",
      }}>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

        <NavBar activeSection={activeSection} setActiveSection={setActiveSection} />

        <div ref={sectionRefs.Home}>
          <HeroSection setActiveSection={setActiveSection} />
          <BookingForm />
        </div>

        <div ref={sectionRefs.About}>
          <AboutSection />
        </div>

        <div ref={sectionRefs.Rooms}>
          <RoomsSection />
        </div>

        <AmenitiesSection />

        <div ref={sectionRefs.Gallery}>
          <GallerySection />
        </div>

        <ReviewsSection />

        <div ref={sectionRefs.Contact}>
          <ContactSection />
        </div>

        <Footer setActiveSection={setActiveSection} />
      </div>
    </ThemeContext.Provider>
  );
}
