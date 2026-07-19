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
      className="bg-stone-900/30 backdrop-blur-md rounded-2xl border border-stone-800/40 overflow-hidden shadow-xl hover:shadow-2xl hover:border-brand-orange/40 hover:bg-stone-900/50 transition-all duration-300 flex flex-col group"
    >
      {/* Image Container with Actions overlay on hover */}
      <div className="relative aspect-square w-full bg-stone-950/40 overflow-hidden shrink-0">
        <ProductImage
          imageUrl={product.imageUrl}
          category={product.category}
          alt={title}
        />
        
        {/* Category Badge overlay */}
        <span className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-stone-950/90 backdrop-blur-xs text-brand-orange text-xs font-black px-2.5 py-1 rounded-lg shadow-md z-10 border border-stone-800`}>
          {getCategoryLabel(product.category)}
        </span>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="p-3 bg-stone-950 hover:bg-brand-orange text-stone-200 hover:text-white rounded-full shadow-lg transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 cursor-pointer border border-stone-800"
            title={t.viewDetails}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className={`p-5 flex-1 flex flex-col ${isRtl ? "text-right" : "text-left"}`}>
        {/* Title */}
        <h3 
          id={`product-title-${product.id}`}
          onClick={() => onViewDetails(product)}
          className="text-lg font-bold text-white mb-2 title-serif hover:text-brand-orange cursor-pointer line-clamp-1 transition-colors"
        >
          {title}
        </h3>

        {/* Truncated Description */}
        <p className="text-xs text-stone-300 font-medium leading-relaxed mb-4 line-clamp-2 flex-1">
          {desc}
        </p>

        {/* Divider */}
        <div className="border-t border-stone-800/70 my-3" />

        {/* Price & Shipping Metadata */}
        <div className={`flex items-baseline justify-between mb-4 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <div>
            <span className="text-xs text-stone-400 font-bold uppercase block">{t.price}</span>
            <span id={`product-price-${product.id}`} className="text-xl font-black text-brand-orange">
              {product.price} <span className="text-sm font-bold">{t.mad}</span>
            </span>
          </div>
          <div className={`${isRtl ? "text-left" : "text-right"}`}>
            <span className="text-xs text-stone-400 font-bold block">{t.shipping}</span>
            <span className="text-xs font-bold text-stone-200">
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
            className="w-full py-3 glow-button-orange text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.orderNow}</span>
          </button>

          {/* Add to shopping cart button */}
          <button
            id={`product-add-cart-btn-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 hover:text-brand-orange text-stone-200 text-xs font-black border border-stone-800/80 hover:border-brand-orange/40 rounded-xl hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
