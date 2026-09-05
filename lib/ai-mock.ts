import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

export const chatSuggestions = [
  "Find breathable summer fabrics under ₹800/m",
  "Which cotton has the lowest MOQ?",
  "Compare selvedge denim with stretch denim",
  "Recommend fabrics for a linen shirting capsule",
];

function score(product: Product, query: string) {
  const q = query.toLowerCase();
  const haystack = [
    product.name,
    product.category,
    product.fabricType,
    product.description,
    (product.colors || []).join(" "),
    product.supplierName,
  ]
    .join(" ")
    .toLowerCase();
  let s = 0;
  q.split(/\s+/)
    .filter((t) => t.length > 2)
    .forEach((token) => {
      if (haystack.includes(token)) s += 2;
    });
  const priceMatch = q.match(/\$?(\d+(?:\.\d+)?)/);
  if (priceMatch && /under|below|less than|max/.test(q)) {
    if (product.price <= Number(priceMatch[1])) s += 3;
    else s -= 4;
  }
  if (/in stock|available/.test(q) && product.isAvailable && product.stock > 0) s += 1;
  if (/low moq|small (order|quantity)/.test(q) && product.moq <= 200) s += 3;
  if (/sustain|organic|recycled|eco/.test(q) && /organic|recycled|GOTS|GRS/i.test(product.description + product.fabricType)) s += 3;
  return s;
}

export function aiSearch(query: string, products: Product[]): Product[] {
  if (!query.trim()) return products;
  const ranked = products
    .map((p) => ({ p, s: score(p, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.p);
  return ranked.length ? ranked : products.slice(0, 4);
}

export function aiRecommendations(limit = 4, products: Product[]): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export function aiSimilar(product: Product, allProducts: Product[], limit = 3): Product[] {
  return allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      s:
        (p.categorySlug === product.categorySlug ? 3 : 0) +
        (p.fabricType === product.fabricType ? 2 : 0) +
        (Math.abs(p.price - product.price) < 5 ? 1 : 0),
    }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.p);
}

export function aiAnswer(product: Product, question: string) {
  const q = question.toLowerCase();
  if (/moq|minimum/.test(q))
    return `The minimum order quantity for ${product.name} is ${product.moq} m. ${product.supplierName} can split this across up to three colourways at no extra cost.`;
  if (/lead|delivery|ship|time/.test(q))
    return `Standard production lead time is ${product.leadTimeDays || 14} days from order confirmation, plus transit from ${product.supplierName}.`;
  if (/price|cost|discount/.test(q))
    return `List price is ${formatCurrency(product.price)} per metre. Volumes above 5,000 m are typically quoted at a lower tier by the supplier.`;
  if (/colour|color/.test(q))
    return `Stock colours are ${(product.colors || []).join(", ")}. Custom lab dips are possible on orders above ${product.moq * 4} m.`;
  if (/stock|available/.test(q))
    return product.stock > 0
      ? `There are ${product.stock.toLocaleString()} m currently on the shelf, so your order can start immediately.`
      : `This fabric is currently out of stock. The supplier's next production window opens in ${product.leadTimeDays || 14} days.`;
  const spec = (product.specifications || []).find((s) => q.includes(s.label.toLowerCase()));
  if (spec) return `${spec.label}: ${spec.value}. Full technical data is listed in the specifications table.`;
  return `${product.name} is a ${product.fabricType?.toLowerCase() || ''} from ${product.supplierName}. ${product.description || ''} If you need a specific technical figure, ask about weight, width, composition or certification.`;
}

export function aiCompare(items: any[]) {
  if (items.length < 2) return "Add at least two fabrics to generate a comparison.";
  const cheapest = [...items].sort((a, b) => a.price - b.price)[0]!;
  const lowestMoq = [...items].sort((a, b) => a.moq - b.moq)[0]!;
  const fastest = [...items].sort((a, b) => (a.leadTimeDays || 14) - (b.leadTimeDays || 14))[0]!;
  return `${cheapest.name} is the most cost-efficient at ${formatCurrency(cheapest.price)}/m. ${lowestMoq.name} has the most flexible entry point with a ${lowestMoq.moq} m minimum, and ${fastest.name} delivers fastest at ${fastest.leadTimeDays || 14} days. For a first sampling run, start with ${lowestMoq.name}; for a volume programme, ${cheapest.name} gives the better landed cost.`;
}

export function aiReply(message: string): { content: string; products: any[] } {
  const q = message.toLowerCase();

  if (/hello|hi\b|hey/.test(q))
    return {
      content:
        "Hi — I'm the Texora assistant. Tell me the fabric weight, use case or budget you're working with and I'll pull matching suppliers from the marketplace.",
      products: [],
    };

  return {
    content: "I couldn't process this request dynamically. Please try again or rephrase.",
    products: [],
  };
}
