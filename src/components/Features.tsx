import { Leaf, Award, Truck } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface FeaturesProps {
  currentLang: Language;
}

export default function Features({ currentLang }: FeaturesProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  const features = [
    {
      id: "natural",
      icon: <Leaf className="w-8 h-8 text-emerald-400" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      title: t.feature1Title,
      desc: t.feature1Desc,
    },
    {
      id: "cold-pressed",
      icon: <Award className="w-8 h-8 text-amber-400" />,
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      title: t.feature2Title,
      desc: t.feature2Desc,
    },
    {
      id: "shipping",
      icon: <Truck className="w-8 h-8 text-sky-400" />,
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
      title: t.feature3Title,
      desc: t.feature3Desc,
    },
  ];

  return (
    <section id="features" className="py-16 bg-transparent border-y border-stone-800/40 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              id={`feature-${feature.id}`}
              key={feature.id}
              className={`premium-card p-8 rounded-2xl md:rounded-[24px] flex items-start gap-5 hover:border-brand-orange/30 transition-all duration-300 ${
                isRtl ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              {/* Icon container */}
              <div className={`p-4 rounded-xl ${feature.bg} border ${feature.border} shrink-0 shadow-lg`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-stone-300/90 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
