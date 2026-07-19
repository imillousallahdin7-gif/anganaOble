import { Phone, MapPin, MessageCircle, Instagram, Mail } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface ContactUsProps {
  currentLang: Language;
}

export default function ContactUs({ currentLang }: ContactUsProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  return (
    <section id="contact" className="py-16 bg-transparent relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange mb-2 block">
            {currentLang === "ar" ? "تواصل معنا" : currentLang === "fr" ? "CONTACTEZ-NOUS" : "GET IN TOUCH"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white title-serif mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-sm text-stone-300 font-bold leading-relaxed">
            {t.contactDesc}
          </p>
        </div>

        {/* Info Grid & Card */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Coordinates Card */}
            <div className={`bg-stone-900/30 backdrop-blur-md border border-stone-800/40 p-8 rounded-3xl flex flex-col justify-between ${isRtl ? "text-right" : "text-left"} shadow-lg`}>
              <div className="space-y-6">
                
                {/* Location */}
                <div className={`flex items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-brand-orange shrink-0 shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{currentLang === "ar" ? "المقر" : currentLang === "fr" ? "Adresse" : "Headquarters"}</h4>
                    <p className="text-xs font-bold text-stone-300 mt-1">{t.contactAddress}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className={`flex items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-emerald-400 shrink-0 shadow-md">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{currentLang === "ar" ? "الهاتف مباشر" : currentLang === "fr" ? "Téléphone" : "Direct Phone"}</h4>
                    <a href="tel:+212641933598" className="text-xs font-black text-brand-orange hover:text-orange-400 hover:underline block mt-1">
                      0641933598 (212+)
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className={`flex items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-blue-400 shrink-0 shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{currentLang === "ar" ? "البريد الإلكتروني" : currentLang === "fr" ? "E-mail" : "Email"}</h4>
                    <a href="mailto:Ayoubkellal600@gmail.com" className="text-xs font-black text-brand-orange hover:text-orange-400 hover:underline block mt-1">
                      Ayoubkellal600@gmail.com
                    </a>
                  </div>
                </div>

                {/* Work hours */}
                <div className={`flex items-start gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-sky-400 shrink-0 shadow-md">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{currentLang === "ar" ? "أوقات العمل" : currentLang === "fr" ? "Heures de travail" : "Working Hours"}</h4>
                    <p className="text-xs font-bold text-stone-300 mt-1">
                      {currentLang === "ar" ? "طيلة أيام الأسبوع من الساعة 9:00 صباحاً حتى 9:00 مساءً" : currentLang === "fr" ? "7j/7 de 9h00 à 21h00" : "7 days/week from 9:00 AM to 9:00 PM"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Instant WhatsApp Action Link */}
              <div className="mt-8 pt-6 border-t border-stone-800/80">
                <a
                  id="contact-whatsapp-btn"
                  href="https://wa.me/212641933598"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 animate-pulse" />
                  <span>{t.contactWhatsapp}</span>
                </a>
              </div>
            </div>

            {/* Aesthetic Visual card displaying our brand dedication */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-lg border border-orange-500/10">
              {/* Subtle background circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative">
                {/* Simple ArganOble crown vector illustration */}
                <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                  ArganOble Co-op
                </span>
                <h3 className="text-2xl font-black title-serif mb-4 leading-snug">
                  {currentLang === "ar" 
                    ? "نحن نضمن نقاوة العسل والزيت بنسبة 100%!" 
                    : currentLang === "fr" 
                      ? "Nous garantissons la pureté de nos produits à 100% !" 
                      : "We guarantee 100% purity of all our products!"}
                </h3>
                <p className="text-xs text-orange-50 font-medium leading-relaxed">
                  {currentLang === "ar"
                    ? "جميع طلبياتكم يتم تحضيرها بعناية فائقة وتغليفها بطريقة تضمن جودة وأمان المنتج أثناء الشحن لباب منزلكم في أي مدينة مغربية."
                    : currentLang === "fr"
                      ? "Toutes vos commandes sont préparées avec le plus grand soin et emballées de manière à garantir la qualité et la sécurité du produit."
                      : "All your orders are prepared with great care and packed in a way that guarantees safety and premium quality during shipping."}
                </p>
              </div>

              {/* Souss agadir signature */}
              <div className="mt-8 border-t border-white/20 pt-6 flex items-center justify-between text-xs font-bold text-orange-100">
                <span>{currentLang === "ar" ? "أكادير، جهة سوس ماسة" : "Agadir, Souss-Massa"}</span>
                <span>🇲🇦</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Area with requested Social Icons */}
        <div className="mt-20 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white title-serif">ArganOble</span>
            <span className="text-xs font-semibold text-stone-400">© 2026</span>
          </div>

          {/* Social Profiles required: Instagram, TikTok */}
          <div className="flex items-center gap-4">
            {/* Instagram: https://www.instagram.com/coop_argan_oble */}
            <a
              id="social-instagram"
              href="https://www.instagram.com/coop_argan_oble"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-stone-900 text-stone-300 hover:text-brand-orange hover:bg-stone-900/80 rounded-xl transition-all border border-stone-800/80 hover:border-brand-orange/40 cursor-pointer"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>

            {/* TikTok: @arganoble */}
            <a
              id="social-tiktok"
              href="https://www.tiktok.com/@arganoble"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-900/80 rounded-xl transition-all border border-stone-800/80 hover:border-brand-orange/40 flex items-center justify-center font-black text-sm cursor-pointer"
              title="TikTok"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.13 1.2 2.7 1.94 4.41 2.05v3.62c-1.68-.02-3.32-.48-4.75-1.37a8.473 8.473 0 01-1.29-1.02v8.52c.04 2.11-.64 4.2-1.97 5.82a9.14 9.14 0 01-6.17 3.5c-2.37.4-4.83-.17-6.84-1.48A9.13 9.13 0 01.315 17.1c-.55-2.29-.16-4.74.99-6.79a9.17 9.17 0 015.65-4.57c.31-.08.62-.13.93-.19v3.7c-.3.08-.6.19-.88.35a5.414 5.414 0 00-2.88 3.54 5.47 5.47 0 00.12 3.25 5.39 5.39 0 002.59 2.92c1.02.54 2.22.68 3.34.42 1.25-.3 2.34-1.15 2.92-2.31a5.352 5.352 0 00.54-2.36V0h.01" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
