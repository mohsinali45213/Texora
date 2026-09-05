import { ProductRepository } from '@/repositories/product.repository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(query: any = {}, options: { sort?: any; limit?: number } = {}) {
    return this.productRepository.findAll(query, options);
  }

  async getProductById(id: string) {
    return this.productRepository.findById(id);
  }

  async searchProducts(query: string, aiMode: boolean = false): Promise<any[]> {
    if (!aiMode) {
      return this.productRepository.search(query);
    }

    try {
      const { callOpenRouter } = await import('@/lib/openrouter');
      
      const prompt = `You are an AI assistant for a textile marketplace. 
Convert the following natural language query into a MongoDB filter JSON object.
Return ONLY valid JSON. No explanation, no markdown, no code blocks.

Supported fields:
- category (string, e.g. "Cotton", "Silk", "Denim", "Polyester", "Linen")
- fabricType (string)
- name (object with $regex and $options, e.g. {"$regex":"pattern","$options":"i"})
- price (object with $lte for max price, $gte for min price)
- isAvailable (boolean, default true)

Query: "${query}"
JSON:`;

      const responseText = await Promise.race([
        callOpenRouter('You convert text to MongoDB JSON filters. Output ONLY JSON.', prompt, 150),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('OpenRouter timeout')), 7000)
        ),
      ]);

      let jsonStr = responseText.trim();

      // Strip markdown code fences if present
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) jsonStr = fenceMatch[1].trim();

      const parsedFilters = JSON.parse(jsonStr);

      // Whitelist only known safe MongoDB fields to prevent injection
      const safeFilters: Record<string, any> = { isAvailable: true };
      const ALLOWED = ['category', 'fabricType', 'name', 'price', 'colors', 'gsm', 'width'];
      for (const key of ALLOWED) {
        if (parsedFilters[key] !== undefined) {
          safeFilters[key] = parsedFilters[key];
        }
      }

      console.log('[AI Search] Parsed filters:', safeFilters);
      const results = await this.productRepository.findAll(safeFilters);

      // If AI returns no results, fall back to text search so user always gets something
      if (results.length === 0) {
        return this.productRepository.search(query);
      }

      return results;
    } catch (error) {
      console.warn('[AI Search] Falling back to text search:', error);
      return this.productRepository.search(query);
    }
  }

  async getFeaturedProducts() {
    return this.productRepository.findAll({ isFeatured: true, isAvailable: true });
  }

  async getProductsByCategory(category: string) {
    return this.productRepository.findAll({ category, isAvailable: true });
  }
}
