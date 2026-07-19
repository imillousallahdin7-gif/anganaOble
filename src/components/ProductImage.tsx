import React from "react";
import { Category } from "../types";

interface ProductImageProps {
  imageUrl?: string;
  category: Category;
  alt: string;
  className?: string;
}

export default function ProductImage({ imageUrl, category, alt, className = "" }: ProductImageProps) {
  const hasImage = !!imageUrl;

  const fallbackContent = (style?: React.CSSProperties) => (
    <div 
      className={`w-full h-full flex items-center justify-center bg-stone-900/45 relative overflow-hidden group ${className}`}
      style={style}
    >
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent opacity-40" />
      
      {category === "honey" && (
        <svg className="w-24 h-24 text-amber-500 drop-shadow-md transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="jarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Honeycomb grid in background */}
          <path d="M50 15 L58 20 L58 30 L50 35 L42 30 L42 20 Z" fill="#FEF3C7" opacity="0.4" />
          <path d="M70 25 L78 30 L78 40 L70 45 L62 40 L62 30 Z" fill="#FEF3C7" opacity="0.4" />
          <path d="M30 25 L38 30 L38 40 L30 45 L22 40 L22 30 Z" fill="#FEF3C7" opacity="0.4" />
          
          {/* Jar Body */}
          <path d="M35 35 H65 C68 35 70 38 70 42 V70 C70 78 63 85 55 85 H45 C37 85 30 78 30 70 V42 C30 38 32 35 35 35 Z" fill="url(#honeyGrad)" />
          {/* Jar glass reflection overlay */}
          <path d="M35 35 H65 C68 35 70 38 70 42 V70 C70 78 63 85 55 85 H45 C37 85 30 78 30 70 V42 C30 38 32 35 35 35 Z" fill="url(#jarGrad)" stroke="#D97706" strokeWidth="2" />
          {/* Jar lid */}
          <rect x="32" y="27" width="36" height="8" rx="4" fill="#1F2937" />
          <rect x="36" y="23" width="28" height="4" rx="2" fill="#4B5563" />
          {/* Label */}
          <rect x="36" y="50" width="28" height="18" rx="2" fill="#FFF" stroke="#D97706" strokeWidth="1" />
          <circle cx="50" cy="59" r="5" fill="#D97706" />
          <path d="M48 59 H52" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Honey Dripper stick */}
          <path d="M68 20 L76 12" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
          <circle cx="68" cy="20" r="4" fill="#D97706" />
        </svg>
      )}

      {category === "amlou" && (
        <svg className="w-24 h-24 text-amber-800 drop-shadow-md transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="amlouGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="jarGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Background circles */}
          <circle cx="50" cy="50" r="35" fill="#FEF3C7" opacity="0.3" />
          {/* Jar */}
          <path d="M32 40 H68 C72 40 74 43 74 47 V72 C74 79 68 85 60 85 H40 C32 85 26 79 26 72 V47 C26 43 28 40 32 40 Z" fill="url(#amlouGrad)" />
          <path d="M32 40 H68 C72 40 74 43 74 47 V72 C74 79 68 85 60 85 H40 C32 85 26 79 26 72 V47 C26 43 28 40 32 40 Z" fill="url(#jarGlass)" stroke="#78350F" strokeWidth="2" />
          {/* Wood lid */}
          <rect x="28" y="32" width="44" height="8" rx="2" fill="#D97706" />
          <line x1="32" y1="36" x2="68" y2="36" stroke="#B45309" strokeWidth="1.5" />
          {/* Label with Almond sketch */}
          <rect x="34" y="52" width="32" height="20" rx="2" fill="#FFF" stroke="#78350F" strokeWidth="1" />
          {/* Almond shape in label */}
          <path d="M50 57 C45 61 46 67 50 67 C54 67 55 61 50 57 Z" fill="#92400E" />
          {/* Little drops */}
          <circle cx="43" cy="62" r="1.5" fill="#78350F" />
          <circle cx="57" cy="62" r="1.5" fill="#78350F" />
        </svg>
      )}

      {category === "argan" && (
        <svg className="w-24 h-24 text-yellow-600 drop-shadow-md transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="arganGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.7" />
              <stop offset="30%" stopColor="#FFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Argan leaves in background */}
          <path d="M25 35 C15 35 15 50 25 50 C35 50 35 35 25 35 Z" fill="#34D399" opacity="0.3" />
          <path d="M75 35 C85 35 85 50 75 50 C65 50 65 35 75 35 Z" fill="#34D399" opacity="0.3" />
          
          {/* Premium Dropper Bottle */}
          {/* Bottle neck */}
          <rect x="44" y="25" width="12" height="12" fill="url(#arganGrad)" />
          <rect x="42" y="21" width="16" height="4" rx="1" fill="#1F2937" />
          {/* Bottle body */}
          <path d="M34 37 H66 C70 37 72 40 72 44 V76 C72 81 68 85 63 85 H37 C32 85 28 81 28 76 V44 C28 40 30 37 34 37 Z" fill="url(#arganGrad)" />
          {/* Bottle glow reflection */}
          <path d="M34 37 H66 C70 37 72 40 72 44 V76 C72 81 68 85 63 85 H37 C32 85 28 81 28 76 V44 C28 40 30 37 34 37 Z" fill="url(#bottleGrad)" stroke="#B45309" strokeWidth="2" />
          {/* Rubber top */}
          <path d="M44 21 C44 14 56 14 56 21 Z" fill="#1F2937" />
          {/* Golden Ring */}
          <rect x="42" y="23" width="16" height="3" fill="#FBBF24" />
          {/* Label */}
          <rect x="36" y="52" width="28" height="22" rx="1" fill="#FFF" stroke="#D97706" strokeWidth="0.5" />
          {/* Brand logo ArganOble icon on label */}
          <circle cx="50" cy="63" r="5" fill="#D97706" />
          <path d="M50 59 L53 62 L50 65 L47 62 Z" fill="#FFF" />
          {/* Oil drop */}
          <path d="M50 12 C48 15 46 17 46 19 C46 21 47.8 22 50 22 C52.2 22 54 21 54 19 C54 17 52 15 50 12 Z" fill="#F59E0B" />
        </svg>
      )}

      {/* Product label bottom */}
      <span className="absolute bottom-2 text-[10px] font-mono tracking-widest text-amber-500/80 bg-stone-950/85 px-2.5 py-1 rounded-full uppercase opacity-90 border border-stone-800/40">
        {category}
      </span>
    </div>
  );

  if (hasImage) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <img
          id={`img-${alt.replace(/\s+/g, '-').toLowerCase()}`}
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Hide the image
            (e.target as HTMLImageElement).style.display = "none";
            // Show the fallback sibling
            const sibling = (e.target as HTMLImageElement).nextElementSibling;
            if (sibling) {
              (sibling as HTMLElement).style.display = "flex";
            }
          }}
        />
        {fallbackContent({ display: "none" })}
      </div>
    );
  }

  return fallbackContent();
}
