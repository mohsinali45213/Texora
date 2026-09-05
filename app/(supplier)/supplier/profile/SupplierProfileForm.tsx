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
import { updateSupplierProfile } from '@/actions/profile';
import { FABRIC_TYPES, DEFAULT_CATEGORIES } from '@/constants';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business Name is required'),
  businessType: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Invalid email').or(z.literal('')),
  address: z.string().optional(),
  operatingHours: z.string().optional(),
  productCategories: z.array(z.string()).default([]),
  fabricTypesOffered: z.array(z.string()).default([]),
  moq: z.coerce.number().min(0, 'MOQ must be 0 or greater'),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SupplierProfileForm({ user, profile }: { user: any; profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || '',
      businessName: profile?.businessName || '',
      businessType: profile?.businessType || '',
      contactPhone: profile?.contactPhone || '',
      contactEmail: profile?.contactEmail || '',
      address: profile?.address || '',
      operatingHours: profile?.operatingHours || '',
      productCategories: profile?.productCategories || [],
      fabricTypesOffered: profile?.fabricTypesOffered || [],
      moq: profile?.moq || 0,
      additionalInfo: profile?.additionalInfo || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('businessName', values.businessName);
    if (values.businessType) formData.append('businessType', values.businessType);
    if (values.contactPhone) formData.append('contactPhone', values.contactPhone);
    if (values.contactEmail) formData.append('contactEmail', values.contactEmail);
    if (values.address) formData.append('address', values.address);
    if (values.operatingHours) formData.append('operatingHours', values.operatingHours);
    if (values.productCategories.length > 0) formData.append('productCategories', values.productCategories.join(', '));
    if (values.fabricTypesOffered.length > 0) formData.append('fabricTypesOffered', values.fabricTypesOffered.join(', '));
    formData.append('moq', values.moq.toString());
    if (values.additionalInfo) formData.append('additionalInfo', values.additionalInfo);

    const result = await updateSupplierProfile(formData);
    
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  const handleCategoryToggle = (slug: string) => {
    const current = form.getValues('productCategories');
    if (current.includes(slug)) {
      form.setValue('productCategories', current.filter((c) => c !== slug));
    } else {
      form.setValue('productCategories', [...current, slug]);
    }
  };

  const handleFabricToggle = (fabric: string) => {
    const current = form.getValues('fabricTypesOffered');
    if (current.includes(fabric)) {
      form.setValue('fabricTypesOffered', current.filter((f) => f !== fabric));
    } else {
      form.setValue('fabricTypesOffered', [...current, fabric]);
    }
  };

  const categories = form.watch('productCategories');
  const fabrics = form.watch('fabricTypesOffered');

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
            <Label htmlFor="email">Login Email</Label>
            <Input id="email" value={user.email} disabled />
            <p className="text-xs text-muted-foreground">Login email cannot be changed.</p>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="glass space-y-4 rounded-xl p-6">
        <h3 className="text-lg font-medium">Business Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" {...form.register('businessName')} />
            {form.formState.errors.businessName && (
              <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Input id="businessType" placeholder="e.g. Manufacturer, Wholesaler" {...form.register('businessType')} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Business Address</Label>
            <Input id="address" {...form.register('address')} />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="glass space-y-4 rounded-xl p-6">
        <h3 className="text-lg font-medium">Public Contact Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" {...form.register('contactEmail')} />
            {form.formState.errors.contactEmail && (
              <p className="text-sm text-red-500">{form.formState.errors.contactEmail.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" type="tel" {...form.register('contactPhone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="operatingHours">Operating Hours</Label>
            <Input id="operatingHours" placeholder="e.g. Mon-Fri 9AM-5PM" {...form.register('operatingHours')} />
          </div>
        </div>
      </div>

      {/* Supply Details */}
      <div className="glass space-y-6 rounded-xl p-6">
        <h3 className="text-lg font-medium">Supply Capabilities</h3>
        
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
          <div className="flex items-center gap-2">
            <Input id="moq" type="number" {...form.register('moq')} />
            <span className="text-sm text-muted-foreground">meters</span>
          </div>
          {form.formState.errors.moq && (
            <p className="text-sm text-red-500">{form.formState.errors.moq.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Product Categories</Label>
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
          <Label>Fabric Types Offered</Label>
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
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea 
            id="additionalInfo" 
            placeholder="Tell buyers about your certifications, capabilities, or specialties..."
            {...form.register('additionalInfo')} 
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
            'Save Profile'
          )}
        </Button>
      </div>
    </form>
  );
}
