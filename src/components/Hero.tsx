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
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden flex items-center min-h-[75vh] bg-transparent relative z-10"
    >
      {/* Background organic shape elements for ambient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none z-1" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none z-1" />
      
      {/* Subtle Moroccan geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full text-center z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Souss Origin Badge */}
          <span 
            id="hero-origin-badge" 
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-300 uppercase tracking-wider mb-6 animate-fadeIn shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            {currentLang === "ar" ? "جهة سوس الأطلس - منتجات حرة طبيعية" : currentLang === "fr" ? "Origine Souss Atlas - 100% Naturel" : "Souss Atlas Origin - 100% Natural"}
          </span>

          {/* Amiri Serif Heading */}
          <h1 
            id="hero-heading" 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight title-serif leading-tight sm:leading-none mb-6 animate-slideUp drop-shadow-md"
          >
            {t.heroTitle}
          </h1>

          {/* Description text */}
          <p 
            id="hero-description" 
            className="text-base sm:text-lg md:text-xl text-stone-200 font-medium leading-relaxed mb-10 max-w-2xl animate-slideUp drop-shadow-sm"
          >
            {t.heroSubtitle}
          </p>

          {/* Call To Action Buttons */}
          <div className={`flex flex-wrap items-center justify-center gap-4 animate-slideUp`}>
            <button
              id="hero-shop-now-btn"
              onClick={handleShopNow}
              className="px-8 py-4 glow-button-orange text-white text-base font-black rounded-xl flex items-center gap-2 group cursor-pointer"
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
              className="px-8 py-4 bg-stone-900/60 backdrop-blur-md text-stone-200 hover:text-brand-orange text-base font-extrabold border border-stone-800 hover:border-brand-orange/50 hover:bg-stone-900 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-xl rounded-xl"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.contactWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
