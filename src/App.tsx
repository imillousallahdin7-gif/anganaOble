/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { db } from "./lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy } from "firebase/firestore";
import { Product, CartItem, Language, Category } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import CartModal from "./components/CartModal";
import AdminPanel from "./components/AdminPanel";
import { translations } from "./translations";

import arganOilImg from "./assets/images/arganoble_argan_oil_1784433696744.jpg";
import amlouImg from "./assets/images/arganoble_amlou_1784433710862.jpg";
import citrusHoneyImg from "./assets/images/arganoble_citrus_honey_1784433727079.jpg";
import thymeHoneyImg from "./assets/images/arganoble_thyme_honey_1784433742467.jpg";
import heroBg from "./assets/images/arganoble_hero_bg_1784433679917.jpg";

const SEED_PRODUCTS = [
  {
    titleAr: "زيت أركان التجميل النقي 100%",
    titleEn: "100% Pure Cosmetic Argan Oil",
    titleFr: "Huile d'Argan Cosmétique 100% Pure",
    descriptionAr: "زيت أركان نقي وعضوي 100% معصور على البارد من ثمار شجرة الأركان بمنطقة سوس. غني بفيتامين E ومضادات الأكسدة لتغذية البشرة والشعر وترطيبهما بعمق.",
    descriptionEn: "100% pure and organic cold-pressed Argan oil from the Souss region. Rich in vitamin E and antioxidants, it deeply nourishes and hydrates skin and hair.",
    descriptionFr: "Huile d'argan 100% pure et biologique pressée à froid de la région de Souss. Riche en vitamine E et en antioxydants, elle nourrit et hydrate en profondeur la peau et les cheveux.",
    category: "argan" as Category,
    price: 120,
    shippingCost: 20,
    imageUrl: arganOilImg,
    createdAt: Date.now() - 4000
  },
  {
    titleAr: "أملو أمازيغي باللوز البلدي وزيت الأركان",
    titleEn: "Premium Amazigh Amlou with Almonds & Argan",
    titleFr: "Amlou Amazigh Premium aux Amandes et Argan",
    descriptionAr: "أملو تقليدي فاخر مصنوع من اللوز البلدي المحمص، زيت الأركان البكر النقي، وعسل السدر الطبيعي. طاقة نشاط وصحة مذهلة لوجبة فطورك وعائلتك.",
    descriptionEn: "Premium traditional Amlou made of roasted Moroccan almonds, pure virgin Argan oil, and natural Sidr honey. A boost of energy and health for your breakfast.",
    descriptionFr: "Amlou traditionnel de qualité supérieure composé d'amandes marocaines grillées, d'huile d'Argan vierge pure et de miel de Sidr naturel. Un regain d'énergie et de santé pour votre petit-déjeuner.",
    category: "amlou" as Category,
    price: 150,
    shippingCost: 20,
    imageUrl: amlouImg,
    createdAt: Date.now() - 3000
  },
  {
    titleAr: "عسل ليمون حر طبيعي 100%",
    titleEn: "100% Natural Pure Citrus Honey",
    titleFr: "Miel d'Oranger 100% Pur et Naturel",
    descriptionAr: "عسل ليمون طبيعي ممتاز مقطوف من مزارع جهة سوس ماسة. يتميز برائحته الزكية ومذاقه الخفيف واللطيف، ومفيد لتهدئة الأعصاب وتحسين الهضم.",
    descriptionEn: "Premium natural orange blossom honey harvested from Souss-Massa groves. Known for its aromatic scent, light sweet taste, and soothing properties.",
    descriptionFr: "Miel d'oranger naturel de qualité supérieure récolté dans les vergers de Souss-Massa. Connu pour son parfum aromatique, son goût doux et ses propriétés apaisantes.",
    category: "honey" as Category,
    price: 180,
    shippingCost: 20,
    imageUrl: citrusHoneyImg,
    createdAt: Date.now() - 2000
  },
  {
    titleAr: "عسل الزعتر الحر الأصيل",
    titleEn: "Authentic Pure Thyme Honey",
    titleFr: "Miel de Thym Pur et Authentique",
    descriptionAr: "عسل الزعتر الحر النادر من جبال الأطلس الكبير. ذو نكهة قوية وقيمة علاجية عالية جداً، فعال في تقوية المناعة وعلاج التهابات الجهاز التنفسي والبرد.",
    descriptionEn: "Rare pure thyme honey from the High Atlas mountains. Strong flavor with exceptional therapeutic benefits, ideal for boosting immunity and treating colds.",
    descriptionFr: "Miel de thym pur et rare des montagnes du Haut Atlas. Saveur prononcée aux vertus thérapeutiques exceptionnelles, idéal pour renforcer l'immunité.",
    category: "honey" as Category,
    price: 250,
    shippingCost: 20,
    imageUrl: thymeHoneyImg,
    createdAt: Date.now() - 1000
  }
];

export default function App() {
  // Locale State
  const [lang, setLang] = useState<Language>("ar");
  const t = translations[lang];

  // Firestore Sync Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and Section states
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [activeSection, setActiveSection] = useState("home");

  // Shopping Cart & Modals States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 1. Listen to Products Collection on Snapshot
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    let isSeeding = false;
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        setProducts([]);
        if (!isSeeding) {
          isSeeding = true;
          try {
            console.log("Firestore products collection is empty. Seeding default products...");
            const productsCol = collection(db, "products");
            for (const prod of SEED_PRODUCTS) {
              await addDoc(productsCol, {
                ...prod,
                createdAt: Date.now()
              });
            }
          } catch (e) {
            console.error("Error seeding default products to Firestore:", e);
          } finally {
            isSeeding = false;
          }
        }
      } else {
        const prodList: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          let imageUrl = data.imageUrl || "";
          
          // Fallback to high-quality generated images if imageUrl is empty
          if (!imageUrl) {
            const titleEn = data.titleEn || "";
            if (titleEn.includes("Argan")) {
              imageUrl = arganOilImg;
            } else if (titleEn.includes("Amlou")) {
              imageUrl = amlouImg;
            } else if (titleEn.includes("Citrus") || titleEn.includes("Orange")) {
              imageUrl = citrusHoneyImg;
            } else if (titleEn.includes("Thyme")) {
              imageUrl = thymeHoneyImg;
            }
          }
          
          prodList.push({ id: doc.id, ...data, imageUrl } as Product);
        });
        setProducts(prodList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Local Storage sync for shopping cart
  useEffect(() => {
    const savedCart = localStorage.getItem("arganoble_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart retrieval error:", e);
      }
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("arganoble_cart", JSON.stringify(newCart));
  };

  // 3. Cart Interaction Operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cart.findIndex((i) => i.product.id === product.id);
    let updatedCart = [...cart];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }
    
    saveCartToStorage(updatedCart);
  };

  const handleUpdateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQty } : item
    );
    saveCartToStorage(updatedCart);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    saveCartToStorage(updatedCart);
  };

  // 4. Single WhatsApp Direct Order Flow
  const handleSingleOrderWhatsApp = (product: Product) => {
    const title = lang === "ar" ? product.titleAr : lang === "fr" ? product.titleFr : product.titleEn;
    const totalPrice = product.price + product.shippingCost;
    
    let messageText = "";
    if (lang === "ar") {
      messageText = `مرحباً ArganOble، أود طلب المنتج التالي:\n\n` +
                    `📦 المنتج: *${title}*\n` +
                    `💵 السعر: *${product.price}* درهم\n` +
                    `🚚 تكلفة الشحن: *${product.shippingCost === 0 ? "مجاني" : `${product.shippingCost} درهم`}*\n\n` +
                    `💰 المجموع: *${totalPrice}* درهم.\n\n` +
                    `شكراً لكم!`;
    } else if (lang === "fr") {
      messageText = `Bonjour ArganOble, je souhaite commander l'article suivant :\n\n` +
                    `📦 Produit : *${title}*\n` +
                    `💵 Prix : *${product.price}* DH\n` +
                    `🚚 Expédition : *${product.shippingCost === 0 ? "Gratuit" : `${product.shippingCost} DH`}*\n\n` +
                    `💰 Total : *${totalPrice}* DH.\n\n` +
                    `Merci !`;
    } else {
      messageText = `Hello ArganOble, I would like to order this item:\n\n` +
                    `📦 Product: *${title}*\n` +
                    `💵 Price: *${product.price}* MAD\n` +
                    `🚚 Shipping: *${product.shippingCost === 0 ? "Free" : `${product.shippingCost} MAD`}*\n\n` +
                    `💰 Total: *${totalPrice}* MAD.\n\n` +
                    `Thank you!`;
    }

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/212641933598?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  // Dynamic products filtering
  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isRtl = lang === "ar";

  return (
    <div id="arganoble-app-root" className="min-h-screen flex flex-col bg-[#070605] relative overflow-x-hidden text-stone-100" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Unified Luxury Moroccan Souss Heritage Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src={heroBg} 
          alt="" 
          loading="eager"
          className="w-full h-full object-cover opacity-70 filter scale-105 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Elegant darkening gradient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070605]/80 via-[#0c0a09]/50 to-[#070605]/80 pointer-events-none" />
        
        {/* Ambient background glows */}
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-amber-500/8 blur-[150px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* 1. Header Navigation Bar */}
      <Navbar
        currentLang={lang}
        setLang={setLang}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* 2. Hero Section */}
      <Hero currentLang={lang} />

      {/* 3. Features Highlight Block */}
      <Features currentLang={lang} />

      {/* 4. Products Collection Grid Section */}
      <section id="products" className="py-16 md:py-24 bg-transparent relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header titles */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange mb-2 block">
              {lang === "ar" ? "منتجاتنا الطبيعية" : lang === "fr" ? "NOS PRODUITS NATURELS" : "OUR NATURAL SELECTION"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white title-serif drop-shadow-sm">
              {lang === "ar" ? "اكتشف منتجاتنا الفاخرة" : lang === "fr" ? "Découvrez nos trésors" : "Discover Our Premium Treasures"}
            </h2>
          </div>

          {/* Filtering category tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 select-none">
            {[
              { id: "all", label: t.categoriesAll },
              { id: "honey", label: t.categoryHoney },
              { id: "amlou", label: t.categoryAmlou },
              { id: "argan", label: t.categoryArgan }
            ].map((tab) => (
              <button
                id={`filter-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as Category | "all")}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? "glow-button-orange"
                    : "bg-stone-900/30 backdrop-blur-md border border-stone-800/40 hover:border-brand-orange/40 hover:text-brand-orange text-stone-300 hover:bg-stone-900/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Catalog grid */}
          {loading ? (
            <div id="products-loading" className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-10 h-10 border-4 border-stone-800 border-t-brand-orange rounded-full animate-spin" />
              <p className="text-xs font-semibold text-amber-200/70">Loading authentic Moroccan treasures...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div id="products-empty" className="text-center py-20 bg-stone-900/25 backdrop-blur-md rounded-3xl border border-stone-800/40 select-none">
              <p className="text-sm font-bold text-stone-300 mb-1">
                {lang === "ar" ? "لا توجد منتجات متوفرة في هذا القسم حالياً." : "No products found in this category."}
              </p>
              <p className="text-xs text-stone-400 font-semibold">
                {lang === "ar" ? "سنقوم بإضافتها قريباً!" : "We will add them back soon!"}
              </p>
            </div>
          ) : (
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentLang={lang}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onViewDetails={(p) => setSelectedProduct(p)}
                  onOrderNow={handleSingleOrderWhatsApp}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. About Us Page Section */}
      <AboutUs currentLang={lang} />

      {/* 6. Contact Us / Footer Page Section */}
      <ContactUs currentLang={lang} />

      {/* 7. Slide-over Shopping Cart Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        currentLang={lang}
      />

      {/* 8. Admin Control Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        currentLang={lang}
      />

      {/* 9. Product Details Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currentLang={lang}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

    </div>
  );
}
