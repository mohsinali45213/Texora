'use client';

import { CATEGORIES, FABRIC_TYPES } from '@/scripts/seed/data/indian-textiles';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export interface FilterState {
  categories: string[];
  fabrics: string[];
  maxPrice: number;
  inStockOnly: boolean;
}

export const defaultFilters: FilterState = {
  categories: [],
  fabrics: [],
  maxPrice: 6000,
  inStockOnly: false,
};

// Derive slugs from category names
const categoryItems = CATEGORIES.map((name) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
}));

export function ProductFilters({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  const toggle = (key: 'categories' | 'fabrics', item: string) => {
    const list = value[key];
    onChange({
      ...value,
      [key]: list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {categoryItems.map((c) => (
            <div key={c.slug} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${c.slug}`}
                checked={value.categories.includes(c.slug)}
                onCheckedChange={() => toggle('categories', c.slug)}
              />
              <Label htmlFor={`cat-${c.slug}`} className="text-sm font-normal">
                {c.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fabric type</Label>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {FABRIC_TYPES.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <Checkbox
                id={`fab-${f}`}
                checked={value.fabrics.includes(f)}
                onCheckedChange={() => toggle('fabrics', f)}
              />
              <Label htmlFor={`fab-${f}`} className="text-sm font-normal">
                {f}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Max price / m</Label>
          <span className="text-sm font-medium">{formatCurrency(value.maxPrice)}</span>
        </div>
        <Slider
          value={[value.maxPrice]}
          min={100}
          max={6000}
          step={50}
          onValueChange={([v]) => onChange({ ...value, maxPrice: v ?? 6000 })}
          aria-label="Maximum price per metre"
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="in-stock" className="text-sm font-normal">
          In stock only
        </Label>
        <Switch
          id="in-stock"
          checked={value.inStockOnly}
          onCheckedChange={(checked) => onChange({ ...value, inStockOnly: checked })}
        />
      </div>
    </div>
  );
}
