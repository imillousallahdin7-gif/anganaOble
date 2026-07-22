import { Award, ShieldCheck, Heart } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface AboutUsProps {
  currentLang: Language;
}

export default function AboutUs({ currentLang }: AboutUsProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  const founderPrefix = currentLang === "ar" ? "المؤسس: " : currentLang === "fr" ? "Fondateur: " : "Founder: ";
  const FOUNDER_NAME = "Ayoub Kellal";

  const badges = [
    {
      id: "quality",
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: currentLang === "ar" ? "جودة مضمونة" : currentLang === "fr" ? "Qualité Garantie" : "Guaranteed Quality",
      desc: currentLang === "ar" ? "فحص دوري ونقاء بنسبة 100%" : currentLang === "fr" ? "Pureté testée à 100%" : "Tested 100% purity",
    },
    {
      id: "cooperative",
      icon: <Heart className="w-6 h-6 text-rose-400" />,
      title: currentLang === "ar" ? "دعم التعاونيات" : currentLang === "fr" ? "Soutien Local" : "Cooperative Support",
      desc: currentLang === "ar" ? "ندعم تمكين المرأة في منطقة سوس" : currentLang === "fr" ? "Nous soutenons les femmes locales" : "Supporting Souss women's co-ops",
    },
    {
      id: "heritage",
      icon: <Award className="w-6 h-6 text-brand-orange" />,
      title: currentLang === "ar" ? "إرث أمازيغي" : currentLang === "fr" ? "Héritage Amazigh" : "Amazigh Heritage",
      desc: currentLang === "ar" ? "وصفات أصيلة متوارثة عبر الأجيال" : currentLang === "fr" ? "Savoir-faire ancestral transmis" : "Authentic recipes across generations",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-transparent relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-20 ${isRtl ? "lg:flex-row-reverse" : ""}`}>
          
          {/* Left Column: Story text and details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            {/* Small decorative label */}
            <span className={`text-xs font-black uppercase tracking-widest text-brand-orange mb-4 ${isRtl ? "text-right" : "text-left"}`}>
              {currentLang === "ar" ? "تعرف علينا" : currentLang === "fr" ? "QUI SOMMES-NOUS ?" : "ABOUT US"}
            </span>

            {/* Title */}
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-white title-serif mb-8 leading-tight ${isRtl ? "text-right" : "text-left"}`}>
              {t.aboutTitle}
            </h2>

            {/* Narrative text */}
            <p className={`text-base md:text-lg text-stone-300 font-medium leading-relaxed mb-10 ${isRtl ? "text-right" : "text-left"}`}>
              {t.aboutStory}
            </p>

            {/* Core facts tags */}
            <div className={`flex flex-wrap gap-4 mb-10 ${isRtl ? "justify-start flex-row-reverse" : "justify-start"}`}>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-2.5 text-xs font-black text-amber-300 shadow-md">
                {founderPrefix}{FOUNDER_NAME}
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-2.5 text-xs font-black text-orange-300 shadow-md">
                {t.aboutRegion}
              </div>
            </div>

            {/* Custom vector map decoration instead of stock photo */}
            <div className="premium-glass border border-white/[0.06] rounded-[24px] p-6.5 shadow-2xl flex items-center gap-5 transition-all hover:border-brand-orange/25">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange shrink-0 shadow-inner">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className={`text-base font-bold text-white mb-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  {currentLang === "ar" ? "أصالة منطقة سوس ماسة" : currentLang === "fr" ? "L'authenticité de Souss Massa" : "Authenticity of Souss Massa"}
                </h4>
                <p className={`text-xs md:text-sm text-stone-300 font-bold leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                  {currentLang === "ar" ? "نقطف العسل ونعصر زيت الأركان من أشجار وغابات أيت باها وتارودانت الطبيعية." : currentLang === "fr" ? "Nous récoltons le miel et pressons l'huile d'argan des forêts naturelles d'Aït Baha et Taroudant." : "We harvest honey and press argan oil from the natural forests of Ait Baha and Taroudant."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Values badges bento-grid style */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {badges.map((badge) => (
              <div
                id={`about-badge-${badge.id}`}
                key={badge.id}
                className={`premium-card p-8 rounded-2xl md:rounded-[24px] flex items-start gap-6 hover:border-brand-orange/30 transition-all duration-350 ${
                  isRtl ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <div className="p-4 bg-stone-950/60 border border-stone-800/80 rounded-2xl shrink-0 shadow-lg text-amber-500">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-xs md:text-sm text-stone-300/90 font-medium leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
