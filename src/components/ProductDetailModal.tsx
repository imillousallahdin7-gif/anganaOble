import { useState } from "react";
import { Product, Language } from "../types";
import { translations } from "../translations";
import ProductImage from "./ProductImage";
import { X, ShoppingCart, MessageSquare, Plus, Minus } from "lucide-react";

interface ProductDetailModalProps {
  product: Product;
  currentLang: Language;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}

export default function ProductDetailModal({
  product,
  currentLang,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";
  const [quantity, setQuantity] = useState(1);

  // Dynamic titles and descriptions
  const title = 
    currentLang === "ar" ? product.titleAr : 
    currentLang === "fr" ? product.titleFr : 
    product.titleEn;

  const desc = 
    currentLang === "ar" ? product.descriptionAr : 
    currentLang === "fr" ? product.descriptionFr : 
    product.descriptionEn;

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "honey": return t.categoryHoney;
      case "amlou": return t.categoryAmlou;
      case "argan": return t.categoryArgan;
      default: return cat;
    }
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // WhatsApp order flow for specific product with quantity and price
  const handleOrderWhatsApp = () => {
    const totalPrice = product.price * quantity + product.shippingCost;
    
    let messageText = "";
    if (currentLang === "ar") {
      messageText = `مرحباً ArganOble، أود طلب المنتج التالي:\n\n` +
                    `📦 المنتج: *${title}*\n` +
                    `🔢 الكمية: *${quantity}*\n` +
                    `💵 السعر للمنتج الواحد: *${product.price}* درهم\n` +
                    `🚚 تكلفة الشحن: *${product.shippingCost === 0 ? "مجاني" : `${product.shippingCost} درهم`}*\n\n` +
                    `💰 المجموع الكلي: *${totalPrice}* درهم.\n\n` +
                    `شكراً لكم!`;
    } else if (currentLang === "fr") {
      messageText = `Bonjour ArganOble, je souhaite commander l'article suivant :\n\n` +
                    `📦 Produit : *${title}*\n` +
                    `🔢 Quantité : *${quantity}*\n` +
                    `💵 Prix unitaire : *${product.price}* DH\n` +
                    `🚚 Frais d'expédition : *${product.shippingCost === 0 ? "Gratuit" : `${product.shippingCost} DH`}*\n\n` +
                    `💰 Montant Total : *${totalPrice}* DH.\n\n` +
                    `Merci !`;
    } else {
      messageText = `Hello ArganOble, I would like to order the following item:\n\n` +
                    `📦 Product: *${title}*\n` +
                    `🔢 Quantity: *${quantity}*\n` +
                    `💵 Unit Price: *${product.price}* MAD\n` +
                    `🚚 Shipping: *${product.shippingCost === 0 ? "Free" : `${product.shippingCost} MAD`}*\n\n` +
                    `💰 Total Amount: *${totalPrice}* MAD.\n\n` +
                    `Thank you!`;
    }

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/212641933598?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <div 
      id="product-details-modal-overlay" 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="product-details-modal-content"
        className="bg-stone-900/60 backdrop-blur-xl border border-stone-800/40 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-slideUp flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button top-right */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} p-2.5 bg-stone-950/90 backdrop-blur-xs rounded-full border border-stone-800 text-stone-200 hover:text-brand-orange hover:border-brand-orange/30 shadow-md z-20 cursor-pointer transition-all`}
          title={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image Illustration */}
        <div className="w-full md:w-1/2 bg-stone-950/40 aspect-square md:aspect-auto md:h-auto min-h-[250px] relative border-b md:border-b-0 md:border-r border-stone-800/40">
          <ProductImage
            imageUrl={product.imageUrl}
            category={product.category}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className={`w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto ${isRtl ? "text-right" : "text-left"}`}>
          <div>
            {/* Category badge */}
            <span className="inline-block text-xs font-black text-brand-orange bg-orange-500/10 px-3 py-1 rounded-full mb-3 border border-orange-500/25">
              {getCategoryLabel(product.category)}
            </span>

            {/* Title */}
            <h2 id="modal-product-title" className="text-2xl sm:text-3xl font-bold text-white title-serif mb-4 leading-snug">
              {title}
            </h2>

            {/* Description list / paragraphs */}
            <div className="text-sm text-stone-300 leading-relaxed font-semibold mb-6 max-h-[180px] overflow-y-auto pr-1">
              <p className="whitespace-pre-line">{desc}</p>
            </div>
          </div>

          <div>
            {/* Pricing Section */}
            <div className="bg-stone-950/40 border border-stone-800/80 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-stone-400 font-bold uppercase">{t.price}</span>
                <span className="text-2xl font-black text-brand-orange">
                  {product.price} <span className="text-sm font-bold">{t.mad}</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-300 font-semibold">
                <span>{t.shipping}</span>
                <span className="font-bold">{product.shippingCost === 0 ? t.free : `${product.shippingCost} ${t.mad}`}</span>
              </div>
            </div>

            {/* Quantity Controls & Dynamic Subtotal */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-black text-stone-200">{t.cartQuantity}</span>
              
              <div className="flex items-center bg-stone-950/50 border border-stone-800 rounded-xl p-1.5 gap-3">
                <button
                  id="modal-qty-decrease-btn"
                  onClick={handleDecrement}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-900 border border-stone-800/60 text-stone-300 hover:text-brand-orange hover:border-brand-orange/40 cursor-pointer active:scale-95 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span id="modal-qty-value" className="text-sm font-black text-white w-6 text-center select-none">
                  {quantity}
                </span>
                <button
                  id="modal-qty-increase-btn"
                  onClick={handleIncrement}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-900 border border-stone-800/60 text-stone-300 hover:text-brand-orange hover:border-brand-orange/40 cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtotal preview */}
            <div className="flex items-center justify-between text-xs font-bold text-stone-450 mb-6 uppercase">
              <span>{t.cartTotal}</span>
              <span className="text-base font-black text-white">
                {totalPrice} {t.mad}
              </span>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Order via WhatsApp */}
              <button
                id="modal-order-whatsapp-btn"
                onClick={handleOrderWhatsApp}
                className="py-3 px-4 glow-button-orange text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.orderNow}</span>
              </button>

              {/* Add to Cart */}
              <button
                id="modal-add-cart-btn"
                onClick={handleAddToCartClick}
                className="py-3 px-4 bg-stone-800/80 hover:bg-stone-800 hover:text-brand-orange text-stone-200 text-xs font-black border border-stone-700/50 hover:border-brand-orange/30 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
