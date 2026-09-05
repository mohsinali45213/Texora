'use client';

import { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function SupplierProductsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (active) {
          setList(Array.isArray(data) ? data : data.items || []);
        }
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    return () => { active = false; };
  }, []);

  return (
    <div className="container-page py-8 md:py-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">{list.length} active listings</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit listing' : 'New listing'}</DialogTitle>
              <DialogDescription>
                Specs are shown to buyers and used by the sourcing assistant.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4 mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                toast.success(editing ? 'Listing updated' : 'Listing published');
                setOpen(false);
                setEditing(null);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Product name</Label>
                <Input id="name" defaultValue={editing?.name ?? ''} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price / m (₹)</Label>
                  <Input id="price" type="number" step="1" defaultValue={editing?.price ?? 500} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moq">MOQ (m)</Label>
                  <Input id="moq" type="number" defaultValue={editing?.moq ?? 500} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock (m)</Label>
                  <Input id="stock" type="number" defaultValue={editing?.stock ?? 2000} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} defaultValue={editing?.description ?? ''} />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">{editing ? 'Save changes' : 'Publish listing'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-8 gap-0 p-0 overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">Loading products…</p>
        ) : list.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No products yet. Click Add product to get started.</p>
        ) : (
          <ul className="divide-y">
            {list.map((product) => (
              <li key={product._id || product.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <img
                  src={product.images?.[0] || product.image || '/fabric-cotton.jpg'}
                  alt=""
                  loading="lazy"
                  width={112}
                  height={112}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(product.price)}/m · MOQ {formatNumber(product.moq || 0)} m ·{' '}
                    {formatNumber(product.stock)} m in stock
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={product.isAvailable ? 'border-0 bg-success/15 text-success' : ''}
                >
                  {product.isAvailable ? 'Live' : 'Paused'}
                </Badge>
                <div className="flex shrink-0 gap-1 ml-4 sm:ml-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => {
                      setEditing(product);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => {
                      setList((prev) => prev.filter((p) => (p._id || p.id) !== (product._id || product.id)));
                      toast('Listing removed', { description: product.name });
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
