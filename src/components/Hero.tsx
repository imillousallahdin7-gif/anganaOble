import { ArrowRight, ArrowLeft } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";
import heroBg from "../assets/images/arganoble_hero_bg_1784433679917.jpg";

interface HeroProps {
  currentLang: Language;
}

export default function Hero({ currentLang }: HeroProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  const handleShopNow = () => {
    const productsSec = document.getElementById("products");
    if (productsSec) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = productsSec.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden flex items-center min-h-[85vh] bg-transparent relative z-10"
    >
      {/* Subtle Moroccan geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Souss Origin Badge */}
          <span 
            id="hero-origin-badge" 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] md:text-xs font-black text-amber-300 uppercase tracking-widest mb-8 animate-fadeIn shadow-lg backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            {currentLang === "ar" ? "جهة سوس الأطلس - منتجات حرة طبيعية" : currentLang === "fr" ? "Origine Souss Atlas - 100% Naturel" : "Souss Atlas Origin - 100% Natural"}
          </span>

          {/* Amiri Serif Heading */}
          <h1 
            id="hero-heading" 
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight title-serif leading-[1.25] sm:leading-tight mb-8 animate-slideUp drop-shadow-2xl max-w-3xl"
          >
            {t.heroTitle}
          </h1>

          {/* Description text */}
          <p 
            id="hero-description" 
            className="text-base sm:text-lg md:text-xl text-stone-200/90 font-medium leading-relaxed mb-12 max-w-2xl animate-slideUp drop-shadow-md"
          >
            {t.heroSubtitle}
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-slideUp">
            <button
              id="hero-shop-now-btn"
              onClick={handleShopNow}
              className="w-full sm:w-auto px-10 py-4.5 glow-button-orange text-white text-base font-black rounded-2xl flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 transition-all"
            >
              <span>{t.shopNow}</span>
              {isRtl ? (
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1.5" />
              ) : (
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              )}
            </button>
            
            <a
              id="hero-whatsapp-direct-btn"
              href="https://wa.me/212641933598"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-10 py-4.5 bg-stone-900/80 backdrop-blur-md text-stone-200 hover:text-brand-orange text-base font-extrabold border border-stone-800 hover:border-brand-orange/40 hover:bg-stone-900/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl rounded-2xl"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.contactWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
