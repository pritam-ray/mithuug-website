export interface ProductData {
  sku: string;
  title: string;
  short_desc: string;
  long_desc: string;
  bullets: string[];
  ingredients: string;
  nutrition_highlights: {
    [key: string]: string;
  };
  alt_text: string;
  meta_title: string;
  meta_description: string;
  price: number;
  image_url: string;
  category: string;
  weight: string;
  is_new?: boolean;
  is_bestseller?: boolean;
}

export const mitthuugProducts: ProductData[] = [
  {
    sku: 'MG-TIL-CL-100',
    title: 'Classic Til-Gud Bites',
    short_desc: 'Crispy sesame & jaggery bites made for everyday snacking.',
    long_desc: 'Our signature Til-Gud Bites combine earthy sesame seeds with pure jaggery, delivering warmth, crunch, and nostalgia in every bite. Handcrafted in small batches using traditional recipes passed down through generations, these golden nuggets are your perfect companion for chai-time or gifting during festivals. No refined sugar, no preservatives – just pure, honest ingredients that taste like home.',
    bullets: [
      'Handcrafted in small batches',
      'No refined sugar – only natural jaggery',
      'Perfect winter energy snack',
      'Rich in calcium and iron',
      'Ideal for gifting and snacking',
    ],
    ingredients: 'Sesame seeds (49%), Jaggery (49%), Cardamom, Ghee',
    nutrition_highlights: {
      Energy: '420 kcal/100g',
      Protein: '10g',
      Fats: '15g',
      Carbohydrates: '55g',
      Iron: '12mg',
      Calcium: '250mg',
    },
    alt_text: 'Classic Til-Gud Bites – Indian sesame jaggery snack by MitthuuG',
    meta_title: 'Classic Til Gud Bites | Healthy Sesame Snack',
    meta_description: 'Crunchy Til Gud Bites from MitthuuG — handcrafted sesame & jaggery snacks made for gifting and snacking.',
    price: 349,
    image_url: 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
    category: 'gud-bites',
    weight: '250g',
    is_bestseller: true,
    is_new: false,
  },
  {
    sku: 'MG-TIL-CR-100',
    title: 'Cardamom Til-Gud Bites',
    short_desc: 'Aromatic cardamom meets sesame & jaggery bliss.',
    long_desc: 'Elevate your snacking with our Cardamom Til-Gud Bites – where the royal spice of cardamom infuses every bite with warmth and aroma. These premium bites blend roasted sesame, natural jaggery, and freshly ground cardamom for a sophisticated twist on the classic. Perfect for those who appreciate the finer nuances of traditional Indian flavors with a modern, artisanal touch.',
    bullets: [
      'Premium green cardamom from Kerala',
      'Aromatic and flavorful',
      'No artificial flavoring',
      'Great for festive gifting',
      'Perfect post-meal digestive treat',
    ],
    ingredients: 'Sesame seeds (47%), Jaggery (47%), Green Cardamom (4%), Ghee, Himalayan Pink Salt',
    nutrition_highlights: {
      Energy: '425 kcal/100g',
      Protein: '11g',
      Fats: '16g',
      Carbohydrates: '54g',
      Iron: '11mg',
      Calcium: '240mg',
    },
    alt_text: 'Cardamom Til-Gud Bites – Premium sesame jaggery cardamom snack by MitthuuG',
    meta_title: 'Cardamom Til Gud Bites | Premium Indian Snack',
    meta_description: 'Aromatic Cardamom Til Gud Bites – handcrafted with green cardamom, sesame & jaggery. Perfect for gifting.',
    price: 399,
    image_url: 'https://images.pexels.com/photos/3776942/pexels-photo-3776942.jpeg',
    category: 'gud-bites',
    weight: '250g',
    is_bestseller: false,
    is_new: true,
  },
  {
    sku: 'MG-TIL-AL-100',
    title: 'Almond Til-Gud Bites',
    short_desc: 'Nutty almond richness in every crunchy bite.',
    long_desc: 'Indulge in luxury with our Almond Til-Gud Bites – a premium blend of roasted California almonds, sesame seeds, and golden jaggery. Each bite delivers a satisfying crunch and rich, nutty flavor that makes this our most premium offering. Packed with protein and healthy fats, these bites are as nutritious as they are delicious. Perfect for corporate gifting or treating yourself to something special.',
    bullets: [
      'Premium California almonds',
      'High protein and healthy fats',
      'Luxury gifting option',
      'Energy-packed superfood snack',
      'No refined sugar or preservatives',
    ],
    ingredients: 'Sesame seeds (40%), Jaggery (35%), California Almonds (23%), Ghee, Rock Salt',
    nutrition_highlights: {
      Energy: '485 kcal/100g',
      Protein: '14g',
      Fats: '22g',
      Carbohydrates: '48g',
      Iron: '10mg',
      Calcium: '220mg',
    },
    alt_text: 'Almond Til-Gud Bites – Premium almond sesame jaggery snack by MitthuuG',
    meta_title: 'Almond Til Gud Bites | Premium Healthy Snack',
    meta_description: 'Luxury Almond Til Gud Bites with California almonds, sesame & jaggery. Perfect corporate gift.',
    price: 499,
    image_url: 'https://images.pexels.com/photos/4686822/pexels-photo-4686822.jpeg',
    category: 'gud-bites',
    weight: '250g',
    is_bestseller: false,
    is_new: true,
  },
  {
    sku: 'MG-TRIAL-50',
    title: 'GUD Bites Trial Pack',
    short_desc: 'First time trying MitthuuG? Start your journey here!',
    long_desc: 'Not sure which flavor to pick? Our Trial Pack is your perfect introduction to the world of MitthuuG! This 50g sampler includes a mix of our Classic and Cardamom Til-Gud Bites, giving you a taste of tradition and innovation in one convenient pack. Perfect for first-timers, travel snacking, or tucking into your desk drawer for those 4pm cravings. Welcome aboard the Mitthu Express!',
    bullets: [
      'Perfect for first-time buyers',
      'Mix of 2 popular flavors',
      'Travel-friendly portion',
      'Great for desk snacking',
      'Money-back satisfaction guarantee',
    ],
    ingredients: 'Mix of Classic and Cardamom Til-Gud Bites (see individual products for full ingredients)',
    nutrition_highlights: {
      Energy: '422 kcal/100g (average)',
      Protein: '10.5g',
      Fats: '15.5g',
      Carbohydrates: '54.5g',
    },
    alt_text: 'MitthuuG GUD Bites Trial Pack – Sampler of sesame jaggery snacks',
    meta_title: 'Trial Pack | Try MitthuuG GUD Bites | 50g Sampler',
    meta_description: 'Try MitthuuG GUD Bites with our 50g trial pack. Perfect introduction to handcrafted til-gud snacks.',
    price: 99,
    image_url: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
    category: 'trial-pack',
    weight: '50g',
    is_bestseller: true,
    is_new: false,
  },
  {
    sku: 'MG-GIFT-500',
    title: 'Premium Gift Box (500g)',
    short_desc: 'Share GUD vibes with our luxurious festive hamper.',
    long_desc: 'Make every occasion special with our Premium Gift Box – a beautifully curated 500g hamper featuring all three of our signature flavors: Classic, Cardamom, and Almond Til-Gud Bites. Packaged in an elegant ochre and gold box with traditional motifs, this is gifting done right. Perfect for Diwali, weddings, corporate events, or showing someone you care. Each box includes a handwritten note option and premium jute packaging. Because some traditions deserve to be shared in style.',
    bullets: [
      'All 3 premium flavors included',
      'Elegant gift packaging',
      'Handwritten note option available',
      'Perfect for festivals and corporate gifting',
      'Eco-friendly jute packaging',
    ],
    ingredients: 'Contains all three variants – Classic, Cardamom, and Almond Til-Gud Bites',
    nutrition_highlights: {
      Energy: '443 kcal/100g (average)',
      Protein: '11.8g',
      Fats: '17.7g',
      Carbohydrates: '52.3g',
    },
    alt_text: 'MitthuuG Premium Gift Box – Luxury Indian sweets gift hamper',
    meta_title: 'Premium Gift Box 500g | MitthuuG Festive Hamper',
    meta_description: 'Luxury MitthuuG Gift Box with 3 flavors. Perfect for Diwali, weddings & corporate gifting. Premium packaging.',
    price: 799,
    image_url: 'https://images.pexels.com/photos/4686820/pexels-photo-4686820.jpeg',
    category: 'gift-sets',
    weight: '500g',
    is_bestseller: true,
    is_new: false,
  },
];
