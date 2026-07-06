import { connectDB, isJsonDb } from '../config/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';

const BLANK_IMGS = [
  "/src/assets/tshirt 1/05-05-2025 christian00428.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00425.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00428 - Copy.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00430.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00432.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00434.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00438.jpg",
  "/src/assets/tshirt 1/05-05-2025 christian00440.jpg"
];

const LOGO_IMGS = [
  "/src/assets/tshirt 2/05-05-2025 christian00445.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00444.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00445 - Copy.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00449.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00450.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00452.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00456.jpg",
  "/src/assets/tshirt 2/05-05-2025 christian00462.jpg"
];

const SHADOW_IMGS = [
  "/src/assets/tshirt 3/05-05-2025 christian00466.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00463.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00466 - Copy.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00468.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00470.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00474.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00475.jpg",
  "/src/assets/tshirt 3/05-05-2025 christian00479.jpg"
];

const VINTAGE_IMGS = [
  "/src/assets/tshirt 4/05-05-2025 christian00483.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00480.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00483 - Copy.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00485.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00487.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00489.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00492.jpg",
  "/src/assets/tshirt 4/05-05-2025 christian00496.jpg"
];

const EARTH_IMGS = [
  "/src/assets/tshirt 5/05-05-2025 christian00499.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00497 1.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00499 - Copy.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00502.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00505.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00510.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00511.jpg",
  "/src/assets/tshirt 5/05-05-2025 christian00513.jpg"
];

const productsData = [
  {
    title: 'COSOSTYLE BLACK ROUND NECK T-SHIRT',
    price: 499.00,
    category: 'classic',
    gender: 'unisex',
    tag: 'NEW',
    image: SHADOW_IMGS[0],
    images: SHADOW_IMGS,
    color: 'Black',
    colors: [
      { name: 'Onyx Black', value: '#0A0A0A', class: 'bg-black border-neutral-900' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Bespoke crew t-shirt constructed from 100% fine cotton jersey. Features drop shoulder drape lines, flat coverstitched details, and reactive dye coloring designed to stay deep black.',
    specs: [
      'Material: 100% Cotton combed jersey',
      'Fit: Regular boxy streetwear fit',
      'Sleeve Type: Classic Half sleeve',
      'Collar Style: Lay-flat crew neck collar',
      'Occasion: Casual, minimal styling',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Heavyweight 240 GSM structure drape',
      'Lay-flat ribbed collar band detailing',
      'Reinforced shoulder-to-shoulder tape seams'
    ],
    careInstructions: 'Machine wash cold with like colors. Tumble dry low or hang dry to preserve box shape.',
    rating: 4.8,
    reviewsCount: 12,
    availability: 'in-stock'
  },
  {
    title: 'COSOSTYLE WHITE ROUND NECK T-SHIRT',
    price: 299.00,
    category: 'classic',
    gender: 'unisex',
    tag: 'NEW',
    image: BLANK_IMGS[0],
    images: BLANK_IMGS,
    color: 'White',
    colors: [
      { name: 'Pure White', value: '#FFFFFF', class: 'bg-white border-neutral-300' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Perfect white canvas tee. Tailored from combed ringspun organic cotton providing a lay-flat neckline, breathable heavyweight jersey, and double needle stitch detailing.',
    specs: [
      'Material: 100% organic cotton',
      'Fit: Regular boxy streetwear fit',
      'Sleeve Type: Half sleeve',
      'Collar Style: Lay-flat round collar',
      'Occasion: Studio everyday essentials',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Combed ringspun structure thread',
      'High lay-flat crew collar band',
      'Zero translucent visibility weave'
    ],
    careInstructions: 'Wash cold inside out. Hang dry or tumble dry low.',
    rating: 4.9,
    reviewsCount: 15,
    availability: 'in-stock'
  },
  {
    title: 'COSOSTYLE MEN SKY GREEN POLO NECK T-SHIRT',
    price: 399.00,
    category: 'oversized',
    gender: 'unisex',
    tag: 'LIMITED',
    image: EARTH_IMGS[0],
    images: EARTH_IMGS,
    color: 'Sky Green',
    colors: [
      { name: 'Sky Green', value: '#555D50', class: 'bg-[#555D50] border-neutral-600' }
    ],
    sizes: ['S', 'M', 'L', '2XL'],
    description: 'Classic polo neckline meets streetwear geometry. Features utility chest patch pocket, dual button placket, and ribbed classic collar in our botanical sky green pigment wash.',
    specs: [
      'Material: 100% premium cotton knit',
      'Fit: Regular relaxed polo fit',
      'Sleeve: Half sleeve with ribbed cuffs',
      'Collar: Structured classic polo collar',
      'Occasion: Smart casual, editorial styling',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Heavyweight cotton knit pattern',
      'Sky green low-impact organic dye',
      'Classic utility chest pocket detailing'
    ],
    careInstructions: 'Wash cold with similar colors. Shape while damp and dry flat.',
    rating: 4.7,
    reviewsCount: 8,
    availability: 'low-stock'
  },
  {
    title: 'COSOSTYLE NAVY ROUND NECK T-SHIRT',
    price: 299.00,
    category: 'classic',
    gender: 'unisex',
    tag: 'NEW',
    image: SHADOW_IMGS[4], // Represent Navy with alternative shadow
    images: SHADOW_IMGS,
    color: 'Navy',
    colors: [
      { name: 'Navy Blue', value: '#1A2E40', class: 'bg-[#1A2E40] border-neutral-900' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Premium navy cotton tee built for structured drapes. Pre-shrunk ringspun cotton thread offers lay-flat coverstitch shoulders and deep dyed indigo color longevity.',
    specs: [
      'Material: 100% ringspun cotton',
      'Fit: Regular boxy streetwear fit',
      'Sleeve: Classic half sleeve',
      'Collar: Lay-flat round collar',
      'Occasion: Casual essentials',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Heavyweight 240 GSM double-stitch',
      'Deep indigo reactive dye coloring',
      'Lay-flat ribbed collar lines'
    ],
    careInstructions: 'Wash cold inside out. Tumble dry low.',
    rating: 4.6,
    reviewsCount: 6,
    availability: 'in-stock'
  },
  {
    title: 'COSOSTYLE MEN BLACK POLO NECK T-SHIRT',
    price: 399.00,
    category: 'oversized',
    gender: 'unisex',
    tag: 'BESTSELLER',
    image: SHADOW_IMGS[1],
    images: SHADOW_IMGS,
    color: 'Black',
    colors: [
      { name: 'Onyx Black', value: '#0A0A0A', class: 'bg-black border-neutral-900' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: 'Sleek black polo shirt constructed from premium heavyweight cotton. Clean placket design, classic collar lines, and subtle ribbed cuffs for an absolute minimal streetwear profile.',
    specs: [
      'Material: 100% combed cotton',
      'Fit: Regular relaxed polo fit',
      'Sleeve: Ribbed half sleeve',
      'Collar: Classic lay-flat polo collar',
      'Occasion: Everyday studio smart-casual',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Clean dual-button placket shape',
      'Deep onyx black fade resistance',
      'Double-stitch reinforced hems'
    ],
    careInstructions: 'Wash cold inside out. Tumble dry low.',
    rating: 4.9,
    reviewsCount: 19,
    availability: 'in-stock'
  },
  {
    title: 'COSOSTYLE GREEN ROUND NECK T-SHIRT',
    price: 299.00,
    category: 'classic',
    gender: 'unisex',
    tag: 'NEW',
    image: EARTH_IMGS[1],
    images: EARTH_IMGS,
    color: 'Green',
    colors: [
      { name: 'Sage Green', value: '#555D50', class: 'bg-[#555D50] border-neutral-600' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Earthy green crewneck tee featuring custom enzyme wash softening treatments. Structured shoulder taped lines provide long-term shape retention.',
    specs: [
      'Material: 100% combed organic cotton',
      'Fit: Regular boxy streetwear fit',
      'Sleeve: Half sleeve',
      'Collar: Lay-flat round collar',
      'Occasion: Casual, earth tone styling',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Subtle enzyme washed surface handle',
      'Reinforced shoulder-to-shoulder taped seams',
      'Structured 240 GSM jersey drape'
    ],
    careInstructions: 'Machine wash cold. Tumble dry low.',
    rating: 4.8,
    reviewsCount: 4,
    availability: 'in-stock'
  },
  {
    title: 'COSOSTYLE MEN PINK POLO NECK T-SHIRT',
    price: 399.00,
    category: 'graphic',
    gender: 'unisex',
    tag: 'LIMITED',
    image: VINTAGE_IMGS[0],
    images: VINTAGE_IMGS,
    color: 'Pink',
    colors: [
      { name: 'Sun Washed Pink', value: '#D9A0A0', class: 'bg-[#D9A0A0] border-neutral-400' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: 'Enzyme sun-washed faded pink polo tee. Unique vintage wash look with chest pocket detailing and dual-button collar placket.',
    specs: [
      'Material: 100% enzyme-washed cotton',
      'Fit: Regular relaxed polo fit',
      'Sleeve: Half sleeve cuffs',
      'Collar: Classic polo collar',
      'Occasion: Summer casual, vintage aesthetic',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Vintage sun-faded pigment wash process',
      'Tactile double-stitched chest pocket',
      'Heavy flat ribbed collar detailing'
    ],
    careInstructions: 'Wash cold inside out. Hang dry to maintain color details.',
    rating: 4.5,
    reviewsCount: 11,
    availability: 'low-stock'
  },
  {
    title: 'COSOSTYLE MEN SKY BLUE POLO NECK T-SHIRT',
    price: 399.00,
    category: 'graphic',
    gender: 'unisex',
    tag: 'BESTSELLER',
    image: LOGO_IMGS[0],
    images: LOGO_IMGS,
    color: 'Sky Blue',
    colors: [
      { name: 'Sky Blue', value: '#A0C4DF', class: 'bg-[#A0C4DF] border-neutral-400' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: 'Serene aqua blue polo tee designed for lightweight breathing and clean box shapes. Ribbed classic collar and soft chest placket design.',
    specs: [
      'Material: 100% premium pique cotton',
      'Fit: Regular relaxed polo fit',
      'Sleeve: Ribbed half sleeve cuffs',
      'Collar: Lay-flat polo collar',
      'Occasion: Everyday studio smart-casual',
      'Manufacturer: GS Clothing, Hussainpura',
      'Packer: Cosostyle OPC Pvt. Ltd., Gurgaon'
    ],
    highlights: [
      'Pique knit layout breathability',
      'Soft sky blue reactive color tone',
      'Lay-flat ribbed collar lines'
    ],
    careInstructions: 'Wash cold with similar colors. Tumble dry low.',
    rating: 4.8,
    reviewsCount: 14,
    availability: 'in-stock'
  }
];

const couponsData = [
  { code: 'COSO10', discountPercent: 0.10, active: true },
  { code: 'HEAVY20', discountPercent: 0.20, active: true },
  { code: 'FREESHIP', discountPercent: 0.00, active: true }
];

const categoriesData = [
  { name: 'Classic Cuts', slug: 'classic' },
  { name: 'Graphic Tees', slug: 'graphic' },
  { name: 'Oversized Drops', slug: 'oversized' }
];

async function seed() {
  console.log('Seeding CosoStyle store database collections...');
  await connectDB();

  // Clear existing
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Coupon.deleteMany({});
  await Review.deleteMany({});

  // Seed Categories
  console.log('Inserting categories...');
  for (const cat of categoriesData) {
    await Category.create(cat);
  }

  // Seed Coupons
  console.log('Inserting coupons...');
  for (const coup of couponsData) {
    await Coupon.create(coup);
  }

  // Seed Products
  console.log('Inserting products catalog...');
  let currentId = 1;
  for (const prod of productsData) {
    const productDoc = await Product.create({
      id: currentId++,
      ...prod
    });

    // Seed mock reviews for each product
    const reviewData1 = {
      productId: productDoc.id,
      user: 'Marcus G.',
      rating: 5,
      comment: 'Superb fabric weight. Drapes very clean and collar stays stiff.',
      likes: 5,
      helpful: true,
      date: '2026-06-15'
    };
    const reviewData2 = {
      productId: productDoc.id,
      user: 'Sasha R.',
      rating: 4,
      comment: 'Extremely heavy cotton, premium texture. Fit runs a little bit loose.',
      likes: 2,
      helpful: false,
      date: '2026-06-20'
    };
    await Review.create(reviewData1);
    await Review.create(reviewData2);
  }

  console.log('Database seeding successfully finished!');
  if (!isJsonDb()) {
    process.exit(0);
  }
}

seed().catch((err) => {
  console.error('Seeding process crashed:', err);
  process.exit(1);
});
