import React from "react";
import { Product, Language } from "../types";
import { translations } from "../translations";
import ProductImage from "./ProductImage";
import { ShoppingCart, Eye, PhoneCall } from "lucide-react";

interface ProductCardProps {
  key?: string;
  product: Product;
  currentLang: Language;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  onOrderNow: (p: Product) => void;
}

export default function ProductCard({
  product,
  currentLang,
  onAddToCart,
  onViewDetails,
  onOrderNow,
}: ProductCardProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  // Resolve language content dynamically
  const title = 
    currentLang === "ar" ? product.titleAr : 
    currentLang === "fr" ? product.titleFr : 
    product.titleEn;

  const desc = 
    currentLang === "ar" ? product.descriptionAr : 
    currentLang === "fr" ? product.descriptionFr : 
    product.descriptionEn;

  // Resolve category translation name
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "honey": return t.categoryHoney;
      case "amlou": return t.categoryAmlou;
      case "argan": return t.categoryArgan;
      default: return cat;
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="premium-card rounded-2xl md:rounded-[24px] overflow-hidden flex flex-col group"
    >
      {/* Image Container with Actions overlay on hover */}
      <div className="relative aspect-square w-full bg-stone-950/60 overflow-hidden shrink-0">
        <ProductImage
          imageUrl={product.imageUrl}
          category={product.category}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Badge overlay */}
        <span className={`absolute top-4.5 ${isRtl ? "right-4.5" : "left-4.5"} bg-stone-950/90 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md z-10 border border-stone-800/80`}>
          {getCategoryLabel(product.category)}
        </span>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="p-3.5 bg-stone-900 hover:bg-brand-orange text-stone-100 hover:text-white rounded-full shadow-2xl transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 cursor-pointer border border-stone-700/50 hover:border-brand-orange/40"
            title={t.viewDetails}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className={`p-6 flex-1 flex flex-col ${isRtl ? "text-right" : "text-left"}`}>
        {/* Title */}
        <h3 
          id={`product-title-${product.id}`}
          onClick={() => onViewDetails(product)}
          className="text-lg md:text-xl font-bold text-white mb-2.5 title-serif hover:text-brand-orange cursor-pointer line-clamp-1 transition-colors leading-tight"
        >
          {title}
        </h3>

        {/* Truncated Description */}
        <p className="text-xs text-stone-300 font-medium leading-relaxed mb-4 line-clamp-2 flex-1">
          {desc}
        </p>

        {/* Divider */}
        <div className="border-t border-stone-800/60 my-3.5" />

        {/* Price & Shipping Metadata */}
        <div className={`flex items-baseline justify-between mb-4.5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <div>
            <span className="text-[10px] text-stone-450 font-black uppercase tracking-wider block mb-1">{t.price}</span>
            <span id={`product-price-${product.id}`} className="text-xl md:text-2xl font-black text-amber-500 tracking-tight">
              {product.price} <span className="text-sm font-bold">{t.mad}</span>
            </span>
          </div>
          <div className={`${isRtl ? "text-left" : "text-right"}`}>
            <span className="text-[10px] text-stone-450 font-black uppercase tracking-wider block mb-1">{t.shipping}</span>
            <span className="text-xs font-black text-emerald-400">
              {product.shippingCost === 0 ? t.free : `${product.shippingCost} ${t.mad}`}
            </span>
          </div>
        </div>

        {/* Purchase CTA Buttons */}
        <div className="flex flex-col gap-2">
          {/* Quick WhatsApp order button (primary) */}
          <button
            id={`product-order-btn-${product.id}`}
            onClick={() => onOrderNow(product)}
            className="w-full py-3.5 glow-button-orange text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>{t.orderNow}</span>
          </button>

          {/* Add to shopping cart button */}
          <button
            id={`product-add-cart-btn-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="w-full py-3 bg-stone-900/65 hover:bg-stone-850 hover:text-brand-orange text-stone-200 text-xs font-black border border-stone-800 hover:border-brand-orange/30 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
