import { CartItem, Language } from "../types";
import { translations } from "../translations";
import ProductImage from "./ProductImage";
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (prodId: string, newQty: number) => void;
  onRemoveItem: (prodId: string) => void;
  currentLang: Language;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  currentLang,
}: CartModalProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  if (!isOpen) return null;

  // Compute pricing totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Total shipping cost: maximum shipping cost of items in cart (common policy) or sum,
  // let's take maximum shipping cost as standard, or 20 MAD flat. Let's do maximum shipping cost.
  const shipping = cartItems.length > 0 ? Math.max(...cartItems.map(i => i.product.shippingCost)) : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let itemsText = "";
    cartItems.forEach((item) => {
      const title = 
        currentLang === "ar" ? item.product.titleAr : 
        currentLang === "fr" ? item.product.titleFr : 
        item.product.titleEn;

      itemsText += `• *${title}* (x${item.quantity}) - ${item.product.price * item.quantity} ${t.mad}\n`;
    });

    let messageText = "";
    if (currentLang === "ar") {
      messageText = `مرحباً ArganOble، أود طلب المنتجات التالية:\n\n` +
                    `${itemsText}\n` +
                    `💵 المجموع الفرعي: *${subtotal}* درهم\n` +
                    `🚚 تكلفة الشحن: *${shipping === 0 ? "مجاني" : `${shipping} درهم`}*\n` +
                    `💰 *المجموع الكلي: ${total} درهم* (شامل الشحن).\n\n` +
                    `يرجى تأكيد الطلب لتزويدكم بمعلومات التوصيل. شكراً لكم!`;
    } else if (currentLang === "fr") {
      messageText = `Bonjour ArganOble, je souhaite commander les articles suivants :\n\n` +
                    `${itemsText}\n` +
                    `💵 Sous-total : *${subtotal}* DH\n` +
                    `🚚 Frais de livraison : *${shipping === 0 ? "Gratuit" : `${shipping} DH`}*\n` +
                    `💰 *Montant Total : ${total} DH* (livraison incluse).\n\n` +
                    `Merci de confirmer ma commande pour lancer la livraison. Merci !`;
    } else {
      messageText = `Hello ArganOble, I would like to order the following items:\n\n` +
                    `${itemsText}\n` +
                    `💵 Subtotal: *${subtotal}* MAD\n` +
                    `🚚 Shipping: *${shipping === 0 ? "Free" : `${shipping} MAD`}*\n` +
                    `💰 *Total Amount: ${total} MAD* (shipping included).\n\n` +
                    `Please confirm my order to proceed with delivery. Thank you!`;
    }

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/212641933598?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div 
      id="cart-overlay"
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-end z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="cart-container"
        className="bg-stone-950/70 backdrop-blur-xl w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative animate-slideLeft overflow-hidden border-l border-stone-800/30"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Drawer */}
        <div className={`p-6 border-b border-stone-800/40 flex items-center justify-between ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <div className={`flex items-center gap-2.5 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className="p-2 bg-orange-500/10 rounded-xl text-brand-orange border border-orange-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white title-serif">{t.cartTitle}</h2>
            <span className="text-xs font-bold text-stone-300 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-stone-900 border border-transparent hover:border-stone-800 rounded-lg text-stone-400 hover:text-brand-orange transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none">
              <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800/40 flex items-center justify-center text-stone-400 mb-4 shadow-inner">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-extrabold text-white mb-1">{t.cartEmpty}</p>
              <p className="text-xs text-stone-400 font-semibold">{t.heroSubtitle}</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const title = 
                currentLang === "ar" ? item.product.titleAr : 
                currentLang === "fr" ? item.product.titleFr : 
                item.product.titleEn;

              return (
                <div 
                  id={`cart-item-${item.product.id}`}
                  key={item.product.id}
                  className={`flex gap-4 p-4 bg-stone-900/40 border border-stone-800/40 rounded-2xl relative group ${
                    isRtl ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Remove Button absolute corner */}
                  <button
                    id={`remove-cart-item-btn-${item.product.id}`}
                    onClick={() => onRemoveItem(item.product.id)}
                    className={`absolute top-2.5 ${isRtl ? "left-2.5" : "right-2.5"} p-1.5 text-stone-400 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity cursor-pointer`}
                    title={t.adminDeleteProduct}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 bg-stone-950/40 border border-stone-800 rounded-xl overflow-hidden shrink-0">
                    <ProductImage
                      imageUrl={item.product.imageUrl}
                      category={item.product.category}
                      alt={title}
                    />
                  </div>

                  {/* Details Body */}
                  <div className={`flex-1 min-w-0 flex flex-col justify-between ${isRtl ? "text-right" : "text-left"}`}>
                    <div>
                      <h4 className="text-sm font-bold text-white title-serif line-clamp-1 pr-4">
                        {title}
                      </h4>
                      <p className="text-xs font-black text-brand-orange mt-1">
                        {item.product.price} {t.mad}
                      </p>
                    </div>

                    {/* Quantity controls in list */}
                    <div className={`flex items-center justify-between mt-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                      <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-0.5 gap-2">
                        <button
                          id={`cart-qty-decrease-btn-${item.product.id}`}
                          onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-stone-400 hover:text-brand-orange hover:bg-stone-900 cursor-pointer active:scale-90 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span id={`cart-qty-val-${item.product.id}`} className="text-xs font-black text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          id={`cart-qty-increase-btn-${item.product.id}`}
                          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-stone-400 hover:text-brand-orange hover:bg-stone-900 cursor-pointer active:scale-90 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Subtotal line */}
                      <span className="text-xs font-black text-stone-300">
                        {item.product.price * item.quantity} {t.mad}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Pricing Subtotal details & WhatsApp actions */}
        <div className="p-6 border-t border-stone-800/30 space-y-4 bg-transparent shrink-0">
          
          <div className="space-y-2 text-xs font-semibold text-stone-400">
            {/* Subtotal */}
            <div className={`flex justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
              <span>{t.cartTotal} (السلع)</span>
              <span className="text-stone-200 font-extrabold">{subtotal} {t.mad}</span>
            </div>
            
            {/* Shipping */}
            <div className={`flex justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
              <span>{t.shipping}</span>
              <span className="text-stone-200 font-extrabold">
                {shipping === 0 ? t.free : `${shipping} ${t.mad}`}
              </span>
            </div>
          </div>

          <div className="border-t border-stone-800/40 my-2" />

          {/* Grand Total */}
          <div className={`flex items-baseline justify-between ${isRtl ? "flex-row-reverse" : ""}`}>
            <span className="text-sm font-black text-white title-serif">{t.cartTotal}</span>
            <span id="cart-grand-total" className="text-xl font-black text-brand-orange">
              {total} <span className="text-xs font-bold">{t.mad}</span>
            </span>
          </div>

          {/* Checkout CTA */}
          <button
            id="cart-checkout-whatsapp-btn"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
            className="w-full py-3.5 glow-button-orange disabled:bg-stone-800 disabled:text-stone-500 disabled:cursor-not-allowed disabled:shadow-none text-white text-sm font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.cartCheckout}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
