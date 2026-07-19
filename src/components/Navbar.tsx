import { ShoppingCart, Lock, Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Language } from "../types";
import { translations } from "../translations";

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Navbar({
  currentLang,
  setLang,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  activeSection,
  setActiveSection,
}: NavbarProps) {
  const t = translations[currentLang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener to toggle premium glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { id: "home", label: t.navHome },
    { id: "products", label: t.navProducts },
    { id: "about", label: t.navAbout },
    { id: "contact", label: t.navContact },
  ];

  const isRtl = currentLang === "ar";

  // Class styles depending on scroll state
  const navBgClass = scrolled
    ? "bg-stone-950/40 backdrop-blur-lg shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] border-b border-stone-800/40 text-white h-20"
    : "bg-transparent text-white h-24";

  const iconBtnClass = scrolled
    ? "p-2.5 bg-stone-900/40 hover:bg-brand-orange/20 hover:text-brand-orange border border-stone-800/60 text-stone-200 hover:border-brand-orange/40"
    : "p-2.5 bg-white/10 hover:bg-white/20 hover:text-brand-orange border border-white/15 text-white hover:border-brand-orange";

  const logoTextClass = "text-white font-black tracking-wide drop-shadow-sm";

  return (
    <>
      <nav 
        id="main-navbar" 
        className={`fixed top-0 left-0 right-0 z-50 select-none transition-all duration-300 ${navBgClass}`}
      >
        <div className={`max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          
          {/* 1. Brand Logo & Name */}
          <div 
            id="navbar-logo-container"
            onClick={() => scrollToSection("home")} 
            className={`flex items-center gap-3 cursor-pointer group ${isRtl ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Custom vector Bee logo */}
            <div className={`w-11 h-11 rounded-full shadow-md flex items-center justify-center p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
              scrolled ? "bg-amber-500/10 border border-amber-500/20" : "bg-white/95 border border-white"
            }`}>
              <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Antennae */}
                <path d="M42 22 C38 15 30 20 32 26" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M58 22 C62 15 70 20 68 26" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Wings */}
                <ellipse cx="30" cy="38" rx="16" ry="10" transform="rotate(-30 30 38)" fill="#BAE6FD" opacity="0.8" stroke="#38BDF8" strokeWidth="1" />
                <ellipse cx="70" cy="38" rx="16" ry="10" transform="rotate(30 70 38)" fill="#BAE6FD" opacity="0.8" stroke="#38BDF8" strokeWidth="1" />
                <ellipse cx="34" cy="46" rx="12" ry="8" transform="rotate(-15 34 46)" fill="#E0F2FE" opacity="0.7" stroke="#38BDF8" strokeWidth="0.5" />
                <ellipse cx="66" cy="46" rx="12" ry="8" transform="rotate(15 66 46)" fill="#E0F2FE" opacity="0.7" stroke="#38BDF8" strokeWidth="0.5" />
                {/* Body */}
                <ellipse cx="50" cy="54" rx="20" ry="24" fill="#F97316" />
                {/* Stripes */}
                <path d="M32 44 Q50 48 68 44" stroke="#1F2937" strokeWidth="7" fill="none" />
                <path d="M30 54 Q50 58 70 54" stroke="#1F2937" strokeWidth="7" fill="none" />
                <path d="M32 64 Q50 68 68 64" stroke="#1F2937" strokeWidth="7" fill="none" />
                {/* Stinger */}
                <path d="M50 78 L50 86 L47 78 Z" fill="#1F2937" />
                {/* Eyes */}
                <circle cx="43" cy="34" r="3.5" fill="#1F2937" />
                <circle cx="57" cy="34" r="3.5" fill="#1F2937" />
                <circle cx="44" cy="33" r="1" fill="#FFF" />
                <circle cx="58" cy="33" r="1" fill="#FFF" />
                {/* Rosy Cheeks */}
                <circle cx="38" cy="38" r="2.5" fill="#F87171" opacity="0.6" />
                <circle cx="62" cy="38" r="2.5" fill="#F87171" opacity="0.6" />
              </svg>
            </div>
            <div className="flex flex-col text-start">
              <span className={`text-xl font-bold tracking-wider title-serif transition-colors duration-300 ${logoTextClass}`}>
                ArganOble
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${scrolled ? "text-amber-400" : "text-amber-400"}`}>
                {currentLang === "ar" ? "أركان وعسل حر" : currentLang === "fr" ? "Trésors du Souss" : "Souss Treasures"}
              </span>
            </div>
          </div>

          {/* 2. Menu Trigger, Shopping Cart & Admin Lock with custom order matching Arabic request */}
          <div className={`flex items-center gap-3.5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
            
            {/* Unified Menu Button (☰) */}
            <button
              id="navbar-menu-btn"
              onClick={() => setMenuOpen(true)}
              className={`rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 font-black px-4 py-2.5 ${iconBtnClass}`}
              title={currentLang === "ar" ? "القائمة" : currentLang === "fr" ? "Menu" : "Menu"}
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
                {currentLang === "ar" ? "القائمة" : currentLang === "fr" ? "Menu" : "Menu"}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className={`rounded-xl transition-all duration-300 relative cursor-pointer group ${iconBtnClass}`}
              title={t.cartTitle}
            >
              <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span id="cart-badge-count" className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Lock Button */}
            <button
              id="navbar-admin-btn"
              onClick={onOpenAdmin}
              className={`rounded-xl transition-all duration-300 cursor-pointer ${iconBtnClass}`}
              title={t.navAdmin}
            >
              <Lock className="w-5 h-5 transition-transform hover:scale-110" />
            </button>

          </div>

        </div>
      </nav>

      {/* Unified Menu Drawer (Overlay + Drawer Sidebar) */}
      {menuOpen && (
        <div id="drawer-overlay" className="fixed inset-0 z-50">
          {/* Backdrop Blur overlay */}
          <div 
            id="drawer-backdrop"
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sliding Panel */}
          <div 
            id="drawer-panel"
            className={`absolute top-0 bottom-0 w-85 max-w-[85vw] bg-stone-950/70 backdrop-blur-xl shadow-2xl flex flex-col justify-between p-6 ${
              isRtl 
                ? "right-0 rounded-l-3xl border-l border-stone-800/30 animate-slideInRight" 
                : "left-0 rounded-r-3xl border-r border-stone-800/30 animate-slideInLeft"
            }`}
          >
            <div>
              {/* Drawer Header */}
              <div className={`flex items-center justify-between mb-8 pb-4 border-b border-stone-800/40 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                  <Globe className="w-5 h-5 text-amber-400" />
                  <span className="text-lg font-black text-white title-serif">
                    {currentLang === "ar" ? "قائمة التصفح" : currentLang === "fr" ? "Navigation" : "Navigation"}
                  </span>
                </div>
                <button 
                  id="drawer-close-btn"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-brand-orange hover:bg-stone-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Section Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    id={`nav-link-drawer-${link.id}`}
                    key={link.id}
                    onClick={() => {
                      scrollToSection(link.id);
                      setMenuOpen(false);
                    }}
                    className={`text-start text-base font-black py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                      activeSection === link.id 
                        ? "text-brand-orange bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
                        : "text-stone-200 hover:bg-stone-900 hover:text-brand-orange"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className={`text-[10px] font-bold ${activeSection === link.id ? "text-brand-orange/60" : "text-stone-600"}`}>
                      {isRtl ? "←" : "→"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection inside Drawer */}
            <div className="border-t border-stone-800/40 pt-6">
              <div className={`flex items-center gap-1.5 mb-3 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-stone-450 uppercase tracking-widest block">
                  {currentLang === "ar" ? "اختر لغة المتجر" : currentLang === "fr" ? "Langue de la boutique" : "Shop Language"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: "ar", label: "العربية" },
                  { code: "en", label: "English" },
                  { code: "fr", label: "Français" }
                ].map((l) => (
                  <button
                    id={`lang-drawer-btn-${l.code}`}
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as Language);
                      setMenuOpen(false);
                    }}
                    className={`py-3 px-1.5 rounded-xl text-xs font-black transition-all border text-center cursor-pointer ${
                      currentLang === l.code
                        ? "bg-brand-orange border-brand-orange text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]"
                        : "bg-stone-900 border border-stone-800 hover:border-brand-orange/40 text-stone-300 hover:text-brand-orange"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
