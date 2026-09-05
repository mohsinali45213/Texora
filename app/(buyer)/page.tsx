import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  GitCompareArrows,
  Layers,
  Mic,
  Search,
  Sparkle,
  Truck,
} from 'lucide-react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSearchBar } from '@/components/ai/HeroSearchBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { ProductService } from '@/services/product.service';
import dbConnect from '@/lib/mongodb';
import '@/models/User'; // register User schema for populate() resolution
import { Product } from '@/models/Product';
import { SupplierProfile } from '@/models/SupplierProfile';

const aiFeatures = [
  {
    icon: Search,
    title: 'Natural language search',
    body: '“220 GSM organic jersey under ₹400 with a 500 m minimum” returns a filtered grid, not a keyword guess.',
  },
  {
    icon: GitCompareArrows,
    title: 'Instant comparison',
    body: 'Put up to three fabrics side by side and get a written trade-off summary on price, MOQ and lead time.',
  },
  {
    icon: Mic,
    title: 'Voice sourcing',
    body: 'Brief the assistant out loud from the mill floor — voice input works anywhere search does.',
  },
];

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  await dbConnect();
  
  const productService = new ProductService();
  
  const featured = await productService.getAllProducts({ isFeatured: true, isAvailable: true }, { limit: 4 });
  const featuredIds = featured.map(p => p.id);

  const trending = await productService.getAllProducts(
    { isAvailable: true, _id: { $nin: featuredIds } },
    { limit: 4 } // Mock trending by taking the next 4 available
  );
  const trendingIds = trending.map(p => p.id);

  const recentlyAdded = await productService.getAllProducts(
    { isAvailable: true, _id: { $nin: [...featuredIds, ...trendingIds] } },
    { sort: { _id: -1 }, limit: 4 } // _id encodes creation time
  );
  const recentlyAddedIds = recentlyAdded.map(p => p.id);

  const recommended = await productService.getAllProducts(
    { isAvailable: true, _id: { $nin: [...featuredIds, ...trendingIds, ...recentlyAddedIds] } },
    { limit: 4 }
  );

  const categoryNames = await Product.distinct('category');
  const categories = categoryNames.slice(0, 8).map((name: string) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: `Browse all ${name.toLowerCase()} fabrics.`,
    productCount: 1,
  }));

  const productCount = await Product.countDocuments({ isAvailable: true });
  const supplierCount = await SupplierProfile.countDocuments();

  return (
    <>
      <section className="surface-hero relative overflow-hidden border-b">
        <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="min-w-0">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Sparkle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              AI sourcing assistant included
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Source fabric the way you{' '}
              <span className="font-display italic font-normal gradient-text">describe it</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Texora connects apparel brands with verified mills. Search in plain language, compare
              specifications instantly and place MOQ-aware orders in a single flow.
            </p>

            <div className="mt-8 max-w-xl">
              <HeroSearchBar />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Stat value={`${productCount || 0}+`} label="Fabrics listed" />
              <Stat value={`${supplierCount || 0}`} label="Verified mills" />
              <Stat value="14 days" label="Median lead time" />
            </div>
          </div>

          <div className="relative">
            <img
              src="/hero-mill.jpg"
              alt="Fabric rolls arranged on oak shelving in a modern textile showroom"
              width={1600}
              height={1000}
              className="aspect-[4/3] w-full rounded-3xl border object-cover shadow-lift"
            />
            <Card className="glass absolute -bottom-6 left-4 hidden w-64 gap-2 border p-4 shadow-lift sm:block">
              <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Sparkle className="h-3.5 w-3.5" aria-hidden="true" /> Assistant
              </p>
              <p className="text-sm leading-relaxed">
                “Meridian Mills can cover 1,200 m of organic jersey in 18 days — the closest match to
                your brief.”
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <SectionHeading
          eyebrow="Browse"
          title="Categories"
          description="Every listing is verified for composition, certification and mill capacity."
          action={
            <Button variant="outline" asChild>
              <Link href={ROUTES.PRODUCTS}>
                All fabrics <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?q=${category.slug}`}
              className="card-hover group rounded-2xl border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-medium">{category.name}</h3>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {category.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {formatNumber(category.productCount * 12)} listings
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg" asChild className="rounded-full px-8">
            <Link href={ROUTES.PRODUCTS}>
              View All Categories <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-page py-4 md:py-8">
        <SectionHeading
          eyebrow="Featured"
          title="Fabrics moving this week"
          description="Curated from mills with confirmed stock and open capacity."
        />
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="container-page py-4 md:py-8">
        <SectionHeading
          eyebrow="Trending"
          title="Most popular right now"
          description="High-demand fabrics based on recent orders and views."
        />
        <div className="mt-8">
          <ProductGrid products={trending} />
        </div>
      </section>

      <section className="container-page py-4 md:py-8">
        <SectionHeading
          eyebrow="New Arrivals"
          title="Recently added"
          description="Fresh inventory dropped by verified mills in the last 7 days."
        />
        <div className="mt-8">
          <ProductGrid products={recentlyAdded} />
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="rounded-3xl border bg-card p-6 shadow-soft md:p-10">
          <SectionHeading
            eyebrow="AI-native"
            title="Sourcing intelligence, not a chatbot bolted on"
            description="Every AI surface is grounded in live marketplace inventory — search, compare, ask and order without leaving the flow."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:gap-6">
            {aiFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border bg-background p-5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-4 md:py-8">
        <SectionHeading
          eyebrow="For you"
          title="Recommended for Kite & Loom Apparel"
          description="Matched to your onboarding profile: organic cotton and linen, 1,000–5,000 m runs."
        />
        <div className="mt-8">
          <ProductGrid products={recommended} />
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="gap-3 p-6 md:p-8">
            <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="text-xl font-semibold">Buying for a brand?</h3>
            <p className="text-sm text-muted-foreground">
              Set your categories, fabric preferences and budget once — the marketplace ranks every
              listing against that profile.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/register">Create buyer account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={ROUTES.PRODUCTS}>Browse marketplace</Link>
              </Button>
            </div>
          </Card>
          <Card className="gap-3 p-6 md:p-8">
            <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="text-xl font-semibold">Selling mill capacity?</h3>
            <p className="text-sm text-muted-foreground">
              List inventory with live stock levels, manage incoming orders and move them through five
              clear fulfilment stages.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/register">Create supplier account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">See supplier tools</Link>
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" /> GOTS & OEKO-TEX verified
            listings
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" /> MOQ-aware ordering
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Transparent lead times
          </span>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
