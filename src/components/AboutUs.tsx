import { Award, ShieldCheck, Heart } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface AboutUsProps {
  currentLang: Language;
}

export default function AboutUs({ currentLang }: AboutUsProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

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
    <section id="about" className="py-16 md:py-24 bg-transparent relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isRtl ? "lg:flex-row-reverse" : ""}`}>
          
          {/* Left Column: Story text and details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            {/* Small decorative label */}
            <span className={`text-xs font-bold uppercase tracking-widest text-brand-orange mb-3 ${isRtl ? "text-right" : "text-left"}`}>
              {currentLang === "ar" ? "تعرف علينا" : currentLang === "fr" ? "QUI SOMMES-NOUS ?" : "ABOUT US"}
            </span>

            {/* Title */}
            <h2 className={`text-3xl sm:text-4xl font-black text-white title-serif mb-6 leading-tight ${isRtl ? "text-right" : "text-left"}`}>
              {t.aboutTitle}
            </h2>

            {/* Narrative text */}
            <p className={`text-base text-stone-300 font-medium leading-relaxed mb-8 ${isRtl ? "text-right" : "text-left"}`}>
              {t.aboutStory}
            </p>

            {/* Core facts tags */}
            <div className={`flex flex-wrap gap-4 mb-8 ${isRtl ? "justify-start flex-row-reverse" : "justify-start"}`}>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 text-xs font-black text-amber-300">
                {t.aboutFounder}
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2 text-xs font-black text-orange-300">
                {t.aboutRegion}
              </div>
            </div>

            {/* Custom vector map decoration instead of stock photo */}
            <div className="bg-stone-900/30 backdrop-blur-md border border-stone-800/40 rounded-2xl p-6 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-brand-orange shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className={`text-sm font-bold text-white ${isRtl ? "text-right" : "text-left"}`}>
                  {currentLang === "ar" ? "أصالة منطقة سوس ماسة" : currentLang === "fr" ? "L'authenticité de Souss Massa" : "Authenticity of Souss Massa"}
                </h4>
                <p className={`text-xs text-stone-300 font-bold ${isRtl ? "text-right" : "text-left"}`}>
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
                className={`bg-stone-900/30 backdrop-blur-md border border-stone-800/40 p-6 rounded-2xl shadow-lg flex items-start gap-5 hover:shadow-xl hover:border-brand-orange/30 hover:bg-stone-900/50 transition-all duration-300 ${
                  isRtl ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <div className="p-3.5 bg-stone-950/40 border border-stone-800 rounded-xl shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-bold leading-relaxed">
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
