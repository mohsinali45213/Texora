export const INDIAN_CITIES = ['Surat', 'Tirupur', 'Ahmedabad', 'Varanasi', 'Ludhiana', 'Bhilwara', 'Mumbai', 'Coimbatore', 'Panipat', 'Kolkata'];

export const CATEGORIES = [
  'Shirting', 'Home Furnishing', 'Sarees', 'Ethnic Wear', 'Denim', 
  'Workwear', 'Sportswear', 'Lining', 'Winterwear', 'Handloom',
  'Upholstery', 'Curtains', 'Towels', 'Suiting', 'Knitwear',
  'Medical Textiles', 'Activewear', 'Loungewear', 'Bridal', 'Kids Wear'
];

export const FABRIC_TYPES = [
  'Cotton', 'Linen', 'Silk', 'Blended Silk', 'Denim', 'Twill', 
  'Polyester', 'Blends', 'Khadi', 'Wool', 'Rayon', 'Viscose',
  'Chiffon', 'Georgette', 'Velvet', 'Spandex', 'Nylon', 'Jute'
];

export const WEAVE_TYPES = ['Plain', 'Twill', 'Satin', 'Jacquard', 'Dobby', 'Knitted', 'Non-woven', 'Herringbone', 'Oxford'];
export const PATTERNS = ['Solid', 'Striped', 'Checked', 'Floral', 'Geometric', 'Printed', 'Embroidered', 'Textured', 'Abstract'];
export const FINISHES = ['Mercerized', 'Pre-shrunk', 'Water Repellent', 'Wrinkle Free', 'Bio-Washed', 'Peached', 'Antimicrobial', 'Flame Retardant'];

export const CERTIFICATIONS = ['GOTS', 'OEKO-TEX Standard 100', 'Fair Trade', 'ISO 9001', 'BCI Cotton', 'GRS (Global Recycled Standard)', 'FSC', 'Sedex'];

export const COLORS = ['Navy Blue', 'Crimson Red', 'Emerald Green', 'Charcoal Grey', 'Off-White', 'Mustard Yellow', 'Teal', 'Magenta', 'Beige', 'Black', 'White', 'Olive', 'Maroon', 'Peach', 'Pastel Pink', 'Lavender', 'Rust'];

export const CARE_INSTRUCTIONS = [
  'Machine wash cold with like colors. Tumble dry low.',
  'Dry clean only. Do not bleach.',
  'Hand wash gently in cold water. Dry flat in shade.',
  'Machine wash warm. Iron on medium heat.',
  'Wash separately. Do not wring or twist.'
];

export const APPLICATIONS_LIST = [
  'Mens Formal Wear', 'Womens Ethnic', 'Home Decor', 'Industrial Uniforms', 
  'Summer Dresses', 'Winter Jackets', 'Bridal Wear', 'Medical Scrubs', 
  'Upholstery and Furniture', 'Sportswear and Activewear', 'Curtains and Drapes'
];

export const MANUFACTURING_NOTES = [
  'Woven on high-speed air-jet looms for superior consistency.',
  'Handcrafted by traditional artisans using sustainable methods.',
  'Treated with eco-friendly dyes and minimal water wastage.',
  'Engineered for high durability and tensile strength.',
  'Blended with elastane for 4-way stretch functionality.'
];

// 15 Fictional Suppliers
export const SUPPLIER_PRESETS = [
  { businessName: 'Texora Mills Pvt Ltd', fabricFocus: ['Cotton', 'Linen'], categories: ['Shirting', 'Suiting'] },
  { businessName: 'Bharat Textile Works', fabricFocus: ['Denim', 'Twill'], categories: ['Denim', 'Workwear'] },
  { businessName: 'Sapphire Looms', fabricFocus: ['Silk', 'Blended Silk'], categories: ['Sarees', 'Bridal'] },
  { businessName: 'Nova Fabrics', fabricFocus: ['Polyester', 'Nylon'], categories: ['Activewear', 'Sportswear'] },
  { businessName: 'Prime Weaves', fabricFocus: ['Khadi', 'Cotton'], categories: ['Handloom', 'Ethnic Wear'] },
  { businessName: 'CottonCraft India', fabricFocus: ['Cotton', 'Rayon'], categories: ['Loungewear', 'Kids Wear'] },
  { businessName: 'Heritage Textiles', fabricFocus: ['Silk', 'Georgette'], categories: ['Womens Ethnic', 'Sarees'] },
  { businessName: 'Urban Weave Co.', fabricFocus: ['Linen', 'Blends'], categories: ['Shirting', 'Summer Dresses'] },
  { businessName: 'Apex Industrial Fabrics', fabricFocus: ['Polyester', 'Jute'], categories: ['Industrial Textiles', 'Workwear'] },
  { businessName: 'Loom & Thread Pvt Ltd', fabricFocus: ['Cotton', 'Spandex'], categories: ['Activewear', 'Knitwear'] },
  { businessName: 'Royal Velvet Works', fabricFocus: ['Velvet', 'Silk'], categories: ['Home Furnishing', 'Bridal'] },
  { businessName: 'EcoBlend Textiles', fabricFocus: ['Recycled Polyester', 'Organic Cotton'], categories: ['Sustainable Fashion'] },
  { businessName: 'Zenith Synthetics', fabricFocus: ['Viscose', 'Rayon'], categories: ['Womens Wear', 'Lining'] },
  { businessName: 'WinterWarm Looms', fabricFocus: ['Wool', 'Blends'], categories: ['Winterwear', 'Suiting'] },
  { businessName: 'Panipat Home Decor', fabricFocus: ['Cotton', 'Jute'], categories: ['Towels', 'Curtains', 'Upholstery'] },
];

// 20 Fictional Buyers
export const BUYER_PRESETS = Array.from({ length: 20 }, (_, i) => ({
  name: `Buyer Company ${i + 1}`,
  businessType: i % 3 === 0 ? 'Manufacturer' : i % 2 === 0 ? 'Fashion Designer' : 'Retailer',
}));

export const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  'Cotton': { min: 120, max: 350 },
  'Premium Cotton': { min: 350, max: 700 },
  'Linen': { min: 450, max: 900 },
  'Silk': { min: 900, max: 3500 },
  'Denim': { min: 300, max: 850 },
  'Polyester': { min: 120, max: 400 },
  'Khadi': { min: 250, max: 700 },
  'Wool': { min: 700, max: 2200 },
  'Industrial Fabric': { min: 500, max: 2500 },
  'Imported Premium Fabric': { min: 1500, max: 6000 },
  // Defaults for others
  'Rayon': { min: 150, max: 350 },
  'Viscose': { min: 180, max: 400 },
  'Velvet': { min: 600, max: 1500 },
  'Chiffon': { min: 200, max: 500 },
  'Georgette': { min: 250, max: 600 },
  'Spandex': { min: 300, max: 800 },
  'Nylon': { min: 150, max: 450 },
  'Jute': { min: 80, max: 200 },
};

export const AI_TAGS_POOL = [
  'Sustainable', 'Eco-friendly', 'Breathable', 'Lightweight', 'Heavyweight',
  'Stretchable', 'Waterproof', 'Quick-dry', 'Hypoallergenic', 'UV Resistant',
  'Luxury', 'Premium', 'Export Quality', 'Handcrafted', 'Machine Washable',
  'Vibrant Colors', 'Fade Resistant', 'Durable', 'Soft Touch', 'Wrinkle Free'
];
