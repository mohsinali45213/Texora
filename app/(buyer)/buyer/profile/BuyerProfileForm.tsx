'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateBuyerProfile } from '@/actions/profile';
import { FABRIC_TYPES, DEFAULT_CATEGORIES } from '@/constants';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessType: z.string().optional(),
  industry: z.string().optional(),
  categoriesOfInterest: z.array(z.string()).default([]),
  preferredFabricTypes: z.array(z.string()).default([]),
  typicalOrderQuantity: z.string().optional(),
  budgetRange: z.string().optional(),
  additionalPreferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BuyerProfileForm({ user, profile }: { user: any; profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || '',
      businessType: profile?.businessType || '',
      industry: profile?.industry || '',
      categoriesOfInterest: profile?.categoriesOfInterest || [],
      preferredFabricTypes: profile?.preferredFabricTypes || [],
      typicalOrderQuantity: profile?.typicalOrderQuantity || '',
      budgetRange: profile?.budgetRange || '',
      additionalPreferences: profile?.additionalPreferences || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', values.name);
    if (values.businessType) formData.append('businessType', values.businessType);
    if (values.industry) formData.append('industry', values.industry);
    if (values.categoriesOfInterest.length > 0) formData.append('categoriesOfInterest', values.categoriesOfInterest.join(', '));
    if (values.preferredFabricTypes.length > 0) formData.append('preferredFabricTypes', values.preferredFabricTypes.join(', '));
    if (values.typicalOrderQuantity) formData.append('typicalOrderQuantity', values.typicalOrderQuantity);
    if (values.budgetRange) formData.append('budgetRange', values.budgetRange);
    if (values.additionalPreferences) formData.append('additionalPreferences', values.additionalPreferences);

    const result = await updateBuyerProfile(formData);
    
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  const handleCategoryToggle = (slug: string) => {
    const current = form.getValues('categoriesOfInterest');
    if (current.includes(slug)) {
      form.setValue('categoriesOfInterest', current.filter((c) => c !== slug));
    } else {
      form.setValue('categoriesOfInterest', [...current, slug]);
    }
  };

  const handleFabricToggle = (fabric: string) => {
    const current = form.getValues('preferredFabricTypes');
    if (current.includes(fabric)) {
      form.setValue('preferredFabricTypes', current.filter((f) => f !== fabric));
    } else {
      form.setValue('preferredFabricTypes', [...current, fabric]);
    }
  };

  const categories = form.watch('categoriesOfInterest');
  const fabrics = form.watch('preferredFabricTypes');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Info */}
      <div className="glass space-y-4 rounded-xl p-6">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="glass space-y-4 rounded-xl p-6">
        <h3 className="text-lg font-medium">Business Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessType">Company Name / Business Type</Label>
            <Input id="businessType" {...form.register('businessType')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" {...form.register('industry')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="typicalOrderQuantity">Typical Order Quantity</Label>
            <Input id="typicalOrderQuantity" placeholder="e.g. 500 meters" {...form.register('typicalOrderQuantity')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budgetRange">Budget Range</Label>
            <Input id="budgetRange" placeholder="e.g. $10 - $50 per meter" {...form.register('budgetRange')} />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="glass space-y-6 rounded-xl p-6">
        <h3 className="text-lg font-medium">Interests & Preferences</h3>
        
        <div className="space-y-3">
          <Label>Categories of Interest</Label>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_CATEGORIES.map((cat) => (
              <Button
                key={cat.slug}
                type="button"
                variant={categories.includes(cat.slug) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryToggle(cat.slug)}
                className="rounded-full"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferred Fabric Types</Label>
          <div className="flex flex-wrap gap-2">
            {FABRIC_TYPES.map((fabric) => (
              <Button
                key={fabric}
                type="button"
                variant={fabrics.includes(fabric) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFabricToggle(fabric)}
                className="rounded-full"
              >
                {fabric}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalPreferences">Additional Preferences</Label>
          <Textarea 
            id="additionalPreferences" 
            placeholder="Any other specific requirements or preferences?"
            {...form.register('additionalPreferences')} 
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
