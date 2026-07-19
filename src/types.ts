export type Language = "ar" | "en" | "fr";

export type Category = "honey" | "amlou" | "argan";

export interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  titleFr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionFr: string;
  category: Category;
  price: number;
  shippingCost: number;
  imageUrl: string;
  createdAt: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
