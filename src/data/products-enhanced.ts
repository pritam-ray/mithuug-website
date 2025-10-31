// MitthuuG Product Data - Enhanced from Content System
// Import this into your data management system

export interface NutritionHighlights {
  Energy: string;
  Protein?: string;
  'Total Fat'?: string;
  Carbohydrates?: string;
  Fiber?: string;
  Iron?: string;
  Calcium?: string;
  'Vitamin E'?: string;
  Antioxidants?: string;
}

export interface Product {
  id: number;
  sku: string;
  slug: string;
  title: string;
  short_desc: string;
  long_desc: string;
  bullets: string[];
  ingredients: string;
  nutrition_highlights: NutritionHighlights;
  alt_text: string;
  meta_title: string;
  meta_description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  weight: string;
  serves: string;
  images: string[];
  category: string;
  tags: string[];
  is_new: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  rating: number;
  review_count: number;
  customization?: string;
  related_products?: number[];
}

export const mitthuugProducts: Product[] = [
  {
    id: 1,
    sku: 'MG-TIL-CL-100',
    slug: 'classic-til-gud-bites',
    title: 'Classic Til-Gud Bites',
    short_desc: 'Crispy sesame & jaggery bites made for everyday snacking.',
    long_desc: 'Our signature Til-Gud Bites combine earthy sesame seeds with pure jaggery, delivering warmth, crunch, and nostalgia in every bite. Roasted to perfection at our Mitthu Express Station 3 kitchen, these golden beauties are your go-to winter energy snack. Perfect with chai, perfect as a midday pick-me-up, perfect for sharing (but we won\'t judge if you don\'t). No refined sugar, no preservatives — just the GUD stuff your Nani would approve of.',
    bullets: [
      'Handcrafted in small batches daily',
      '100% natural jaggery — no refined sugar',
      'Rich in iron, calcium & natural energy',
      'Perfect winter warming snack',
      'Stays fresh for 6 months in airtight pack',
    ],
    ingredients: 'Sesame seeds (49%), Jaggery (49%), Cardamom, Pure Ghee',
    nutrition_highlights: {
      Energy: '420 kcal/100g',
      Protein: '10g',
      'Total Fat': '15g',
      Carbohydrates: '65g',
      Fiber: '8g',
      Iron: '15% DV',
      Calcium: '12% DV',
    },
    alt_text: 'Classic Til-Gud Bites – Golden sesame jaggery snack by MitthuuG in artisan packaging',
    meta_title: 'Classic Til Gud Bites | Pure Jaggery Sesame Snack - MitthuuG',
    meta_description: 'Handcrafted Til Gud Bites with sesame & pure jaggery. No refined sugar. Traditional taste, modern freshness. Order India\'s favorite winter snack.',
    price: 249,
    weight: '100g',
    serves: '4-5 servings',
    images: [
      '/images/products/classic-til-gud-1.webp',
      '/images/products/classic-til-gud-2.webp',
      '/images/products/classic-til-gud-3.webp',
      '/images/products/classic-til-gud-lifestyle.webp',
    ],
    category: 'Til-Gud Bites',
    tags: ['classic', 'bestseller', 'winter', 'traditional', 'no refined sugar'],
    is_new: false,
    is_bestseller: true,
    is_featured: true,
    stock_quantity: 150,
    low_stock_threshold: 20,
    rating: 4.9,
    review_count: 287,
    related_products: [2, 3, 4],
  },
  {
    id: 2,
    sku: 'MG-TIL-CD-100',
    slug: 'cardamom-til-gud-bites',
    title: 'Cardamom Til-Gud Bites',
    short_desc: 'Aromatic cardamom meets sesame gold — a premium twist on tradition.',
    long_desc: 'For those who like their nostalgia with a hint of royal. Our Cardamom Til-Gud Bites layer premium green cardamom into the classic sesame-jaggery base, creating a fragrant, warming snack that\'s perfect for gifting or indulging. Each bite releases a burst of elaichi aroma that pairs beautifully with masala chai or evening coffee. Made at Mitthu Express Station 3 with hand-selected spices and small-batch care. This isn\'t just a snack — it\'s an experience.',
    bullets: [
      'Premium green cardamom infused',
      'Aromatic & warming flavor profile',
      'Handcrafted with hand-selected spices',
      'Perfect pairing with chai or coffee',
      'Elegant gift option for festivals',
    ],
    ingredients: 'Sesame seeds (47%), Jaggery (47%), Green Cardamom (4%), Pure Ghee, Rose Water',
    nutrition_highlights: {
      Energy: '425 kcal/100g',
      Protein: '10g',
      'Total Fat': '15g',
      Carbohydrates: '66g',
      Fiber: '8g',
      Antioxidants: 'High (from cardamom)',
    },
    alt_text: 'Cardamom Til-Gud Bites – Premium aromatic sesame jaggery snack with green cardamom',
    meta_title: 'Cardamom Til Gud | Aromatic Sesame Snack - MitthuuG',
    meta_description: 'Premium Cardamom Til Gud Bites — handcrafted with green elaichi & pure jaggery. Perfect gift for festivals. Order artisan Indian sweets online.',
    price: 299,
    weight: '100g',
    serves: '4-5 servings',
    images: [
      '/images/products/cardamom-til-gud-1.webp',
      '/images/products/cardamom-til-gud-2.webp',
      '/images/products/cardamom-til-gud-3.webp',
      '/images/products/cardamom-til-gud-gift.webp',
    ],
    category: 'Til-Gud Bites',
    tags: ['premium', 'cardamom', 'gifting', 'aromatic', 'festival'],
    is_new: true,
    is_bestseller: false,
    is_featured: true,
    stock_quantity: 80,
    low_stock_threshold: 15,
    rating: 4.9,
    review_count: 156,
    related_products: [1, 3, 5],
  },
  {
    id: 3,
    sku: 'MG-TIL-AL-100',
    slug: 'almond-til-gud-bites',
    title: 'Almond Til-Gud Bites',
    short_desc: 'Crunchy almonds meet sesame crunch — protein-packed indulgence.',
    long_desc: 'Upgrade your snack game with our Almond Til-Gud Bites — a protein-rich fusion of toasted sesame, pure jaggery, and premium California almonds. Every bite delivers double crunch, double nutrition, and double the reason to feel good about snacking. Ideal for fitness enthusiasts, busy professionals, or anyone who wants their nostalgia with a nutty twist. Handcrafted at Mitthu Express with the same love as Nani\'s kitchen, but with a modern nutritional edge.',
    bullets: [
      'Premium California almonds added',
      'High protein & healthy fats',
      'Perfect post-workout energy snack',
      'Satisfying double-crunch texture',
      'No refined sugar or preservatives',
    ],
    ingredients: 'Sesame seeds (40%), Jaggery (40%), Almonds (18%), Cardamom, Pure Ghee',
    nutrition_highlights: {
      Energy: '480 kcal/100g',
      Protein: '14g',
      'Total Fat': '22g',
      Carbohydrates: '58g',
      Fiber: '10g',
      'Vitamin E': '20% DV',
    },
    alt_text: 'Almond Til-Gud Bites – Protein-rich sesame jaggery snack with premium almonds',
    meta_title: 'Almond Til Gud | Protein Sesame Snack - MitthuuG',
    meta_description: 'Almond Til Gud Bites with premium nuts & pure jaggery. High protein, zero refined sugar. Healthy Indian snack for fitness & energy.',
    price: 349,
    weight: '100g',
    serves: '4-5 servings',
    images: [
      '/images/products/almond-til-gud-1.webp',
      '/images/products/almond-til-gud-2.webp',
      '/images/products/almond-til-gud-nutrition.webp',
      '/images/products/almond-til-gud-lifestyle.webp',
    ],
    category: 'Til-Gud Bites',
    tags: ['protein', 'almonds', 'fitness', 'premium', 'healthy'],
    is_new: true,
    is_bestseller: false,
    is_featured: true,
    stock_quantity: 60,
    low_stock_threshold: 10,
    rating: 4.8,
    review_count: 92,
    related_products: [1, 2, 4],
  },
  {
    id: 4,
    sku: 'MG-TRIAL-50',
    slug: 'trial-pack-50g',
    title: 'MitthuuG Trial Pack',
    short_desc: 'New to GUD Bites? Start here — 50g of pure nostalgia.',
    long_desc: 'Not sure which flavor to commit to? We get it. Our Trial Pack gives you 50g of our Classic Til-Gud Bites at a special introductory price — just enough to fall in love without the commitment. Think of it as your first stop on the Mitthu Express journey. One taste and you\'ll understand why thousands of snack lovers have already hopped aboard. Perfect for first-timers, gifting sampler sets, or stashing in your bag for emergencies (we won\'t tell).',
    bullets: [
      'Perfect introduction size',
      'Classic Til-Gud flavor',
      'Special introductory pricing',
      'Portable pouch packaging',
      'Ideal for travel or desk snacking',
    ],
    ingredients: 'Sesame seeds (49%), Jaggery (49%), Cardamom, Pure Ghee',
    nutrition_highlights: {
      Energy: '420 kcal/100g',
      Protein: '10g',
      'Total Fat': '15g',
      Carbohydrates: '65g',
    },
    alt_text: 'MitthuuG Trial Pack – 50g introductory pack of Classic Til-Gud Bites',
    meta_title: 'Try MitthuuG | 50g Trial Pack - Til Gud Bites',
    meta_description: 'Try MitthuuG Til Gud Bites with our 50g Trial Pack. Pure jaggery, sesame crunch, no refined sugar. Your first taste of nostalgia.',
    price: 99,
    weight: '50g',
    serves: '2 servings',
    images: [
      '/images/products/trial-pack-1.webp',
      '/images/products/trial-pack-pouch.webp',
    ],
    category: 'Trial Packs',
    tags: ['trial', 'starter', 'first-time', 'portable', 'value'],
    is_new: false,
    is_bestseller: true,
    is_featured: false,
    stock_quantity: 200,
    low_stock_threshold: 30,
    rating: 4.7,
    review_count: 421,
    related_products: [1, 2, 3],
  },
  {
    id: 5,
    sku: 'MG-GIFT-500',
    slug: 'premium-gift-box-500g',
    title: 'MitthuuG Premium Gift Box',
    short_desc: 'Share GUD vibes — 500g of artisan bites in premium packaging.',
    long_desc: 'The perfect gift speaks without words. Our Premium Gift Box delivers 500g of handcrafted Til-Gud goodness in elegant, festival-ready packaging that honors tradition while looking utterly Instagram-worthy. Choose from Classic, Cardamom, or Almond varieties, or mix all three. Ideal for Diwali, Makar Sankranti, corporate gifting, or showing someone you care (the delicious way). Each box comes with a handwritten note option and our signature Mitthu Express journey card. Because some gifts are worth savoring.',
    bullets: [
      'Premium festival-ready packaging',
      '500g of handcrafted GUD Bites',
      'Choice of single or mixed flavors',
      'Includes handwritten note option',
      'Perfect for Diwali, Sankranti & corporate gifts',
    ],
    ingredients: 'Varies by flavor selection (Classic/Cardamom/Almond)',
    nutrition_highlights: {
      Energy: '420-480 kcal/100g',
    },
    alt_text: 'MitthuuG Premium Gift Box – 500g artisan Til-Gud Bites in festival packaging',
    meta_title: 'Premium Gift Box 500g | MitthuuG Til Gud - Festival Gifting',
    meta_description: 'Premium Til Gud Gift Box — 500g handcrafted bites in elegant packaging. Perfect for Diwali, Sankranti & corporate gifting. Order now.',
    price: 999,
    weight: '500g',
    serves: '20-25 servings',
    images: [
      '/images/products/gift-box-1.webp',
      '/images/products/gift-box-open.webp',
      '/images/products/gift-box-packaging.webp',
      '/images/products/gift-box-lifestyle.webp',
    ],
    category: 'Gift Boxes',
    tags: ['gift', 'premium', 'festival', 'diwali', 'corporate'],
    is_new: false,
    is_bestseller: true,
    is_featured: true,
    stock_quantity: 50,
    low_stock_threshold: 10,
    rating: 5.0,
    review_count: 128,
    customization: 'Mix flavors available',
    related_products: [1, 2, 3],
  },
];

// Helper functions for product management
export const getProductBySlug = (slug: string): Product | undefined => {
  return mitthuugProducts.find((p) => p.slug === slug);
};

export const getProductBySku = (sku: string): Product | undefined => {
  return mitthuugProducts.find((p) => p.sku === sku);
};

export const getRelatedProducts = (productId: number): Product[] => {
  const product = mitthuugProducts.find((p) => p.id === productId);
  if (!product || !product.related_products) return [];
  return mitthuugProducts.filter((p) => product.related_products?.includes(p.id));
};

export const getFeaturedProducts = (): Product[] => {
  return mitthuugProducts.filter((p) => p.is_featured);
};

export const getBestsellers = (): Product[] => {
  return mitthuugProducts.filter((p) => p.is_bestseller);
};

export const getNewProducts = (): Product[] => {
  return mitthuugProducts.filter((p) => p.is_new);
};

export const isLowStock = (product: Product): boolean => {
  return product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0;
};

export const isOutOfStock = (product: Product): boolean => {
  return product.stock_quantity === 0;
};

export const getDiscountedPrice = (product: Product): number => {
  if (product.discount_percentage) {
    return product.price * (1 - product.discount_percentage / 100);
  }
  return product.price;
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
