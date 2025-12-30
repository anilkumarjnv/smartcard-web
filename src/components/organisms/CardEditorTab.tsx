'use client';

import React, { useState, useEffect } from 'react';
import { User, Briefcase, Building, Phone, Mail, Globe, Upload, X, Plus, Trash, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Textarea } from '@/components/molecules/Textarea';
import { Button } from '@/components/molecules/Button';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';
import { z } from 'zod';


import { countryCodes } from '@/lib/constants/countryCodes';
import { CountrySelect } from '@/components/molecules/CountrySelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

// Validation Schema
const sanitizedString = z.string()
  .transform((str) => str.replace(/[<>]/g, "")) // Remove potentially malacious HTML tags
  .pipe(z.string().trim());

const urlSchema = z.string().url().safeParse(''); // Helper

const slugSchema = z.string()
  .transform((str) => str.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  .pipe(z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'));

const formSchema = z.object({
  name: sanitizedString.pipe(z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less')),
  slug: slugSchema.optional().or(z.literal('')),
  role: sanitizedString.pipe(z.string().min(1, 'Role/Title is required').max(50, 'Role must be 50 characters or less')),
  photo_url: z.string().optional(),
  organization: z.string().optional()
    .transform(str => str?.replace(/[<>]/g, "").trim())
    .pipe(z.string().max(50, 'Organization must be 50 characters or less').optional()),
  domain: z.string().optional()
    .transform(str => str?.replace(/[<>]/g, "").trim())
    .pipe(z.string().max(50, 'Domain must be 50 characters or less').optional()),
  summary: z.string().optional()
    .transform(str => str?.replace(/[<>]/g, "").trim())
    .pipe(z.string().max(200, 'Summary must be 200 characters or less').optional()),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  country_code: z.string().min(1, 'Country code is required'),
  phone: z.string().optional()
    .transform(str => str?.replace(/\D/g, ""))
    .refine(val => !val || val.length === 10, 'Phone number must be exactly 10 digits'),
  primary_link: z.string().min(1, 'Primary link is required').url('Invalid URL (include https://)'),
  additional_links: z.array(z.object({
    label: z.string().optional().transform(str => str?.replace(/[<>]/g, "").trim() || ""),
    url: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, "Invalid URL"),
  })),
  cta_button: z.object({
    text: z.string().optional().transform(str => str?.replace(/[<>]/g, "").trim() || ""),
    link: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, "Invalid URL"),
  }).optional(),
  custom_highlights: z.array(z.object({
    label: z.string().optional().transform(str => str?.replace(/[<>]/g, "").trim() || ""),
    value: z.string().optional().transform(str => str?.replace(/[<>]/g, "").trim() || ""),
  })),
});

interface FormData {
  //Section 1: Identity (Required)
  name: string;
  slug?: string;
  role: string;

  // Section 2: Visual Identity (Optional)
  photo_url?: string;

  // Section 3: Context & Credibility (Optional)
  organization?: string;
  domain?: string;

  // Section 4: Professional Summary (Optional, max 200 chars)
  summary?: string;

  // Section 5: Contact & Reach (Required)
  email: string;
  country_code: string;
  phone?: string;
  primary_link: string;

  // Section 6: Additional Links (Optional, max 3)
  additional_links: Array<{
    label: string;
    url: string;
  }>;

  // Section 7: Primary CTA (Optional)
  cta_button?: {
    text: string;
    link: string;
  };

  // Section 8: Custom Highlights (Optional, max 3)
  custom_highlights: Array<{
    label: string;
    value: string;
  }>;
}

interface CardEditorTabProps {
  cardId?: string;
  mode?: 'create';
  initialFormData?: any;
  onCardUpdate?: (card: Card) => void;
  onCardCreation?: (card: Card) => void;
  onFormChange?: (formData: FormData) => void;
}

const fetcher = (url: string) => apiClient.get<Card[]>(url);

export function CardEditorTab({ cardId, mode, initialFormData, onCardUpdate, onCardCreation, onFormChange }: CardEditorTabProps) {
  const { data: cards, error } = useSWR<Card[]>('/api/v1/cards/user', fetcher);

  const currentCard = mode === 'create'
    ? null
    : cardId
      ? cards?.find(card => card.id === cardId) || null
      : cards && cards.length > 0 ? cards[0] : null;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    role: '',
    photo_url: '',
    organization: '',
    domain: '',
    summary: '',
    email: '',
    country_code: '+91',
    phone: '',
    primary_link: '',
    additional_links: [],
    cta_button: undefined,
    custom_highlights: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Slug states
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugCheckMessage, setSlugCheckMessage] = useState('');
  const [touchedSlug, setTouchedSlug] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (initialFormData && initialFormData._cardId === cardId) {
      const { _cardId, ...formDataWithoutId } = initialFormData;
      setFormData({
        ...formDataWithoutId,
        additional_links: formDataWithoutId.additional_links || [],
        custom_highlights: formDataWithoutId.custom_highlights || []
      });
      setImagePreview(formDataWithoutId.photo_url || '');
      onFormChange?.(formDataWithoutId);
      return;
    }

    if (mode === 'create') {
      const emptyData: FormData = {
        name: '',
        slug: '',
        role: '',
        photo_url: '',
        organization: '',
        domain: '',
        summary: '',
        email: '',
        country_code: '+91',
        phone: '',
        primary_link: '',
        additional_links: [],
        cta_button: undefined,
        custom_highlights: []
      };
      setFormData(emptyData);
      setImagePreview('');
      onFormChange?.(emptyData);
    } else if (currentCard) {
      const cardData = currentCard as any;
      const customData = cardData.custom_data || {};

      // Parse phone if needed, but rely on custom_data.country_code if present
      const rawPhone = currentCard.phone || '';
      let initialPhone = rawPhone.replace(/\D/g, ''); // just digits
      if (initialPhone.length > 10) {
        // simple heuristic if no custom code: assume last 10 are phone
        initialPhone = initialPhone.slice(-10);
      }

      const initialData: FormData = {
        name: currentCard.name || '',
        slug: currentCard.slug || '',
        role: currentCard.title || '',
        photo_url: currentCard.avatar_url || currentCard.photo_url || '',
        organization: currentCard.company || '',
        domain: customData.domain || '',
        summary: cardData.bio || currentCard.about || '',
        email: currentCard.email || '',
        country_code: customData.country_code || '+91',
        phone: initialPhone,
        primary_link: currentCard.website || (currentCard.social_links as Record<string, string>)?.linkedin || '',
        additional_links: customData.additional_links || [],
        cta_button: customData.cta_button,
        custom_highlights: customData.custom_highlights || []
      };
      setFormData(initialData);
      setImagePreview(initialData.photo_url || '');
      onFormChange?.(initialData);
    }
  }, [cardId, mode, cards]);

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.slug || formData.slug.length < 3) {
        setSlugAvailable(null);
        setSlugCheckMessage('');
        return;
      }

      // Don't check if it's the current card's slug
      if (mode !== 'create' && currentCard && formData.slug === currentCard.slug) {
        setSlugAvailable(true);
        setSlugCheckMessage('');
        return;
      }

      setIsCheckingSlug(true);
      try {
        const result = await apiClient.get<{ available: boolean; slug: string }>(`/api/v1/cards/check-slug/${formData.slug}`);
        setSlugAvailable(result.available);
        setSlugCheckMessage(result.available ? 'Username available' : 'Username taken');
      } catch (error) {
        console.error('Failed to check slug:', error);
        setSlugAvailable(false);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, mode, currentCard]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;

    // Auto-update slug if not manually touched
    const updates: Partial<FormData> = { name: newName };
    if (!touchedSlug && mode === 'create') {
      updates.slug = newName.toLowerCase().replace(/[^a-z0-9-]/g, '');
    }

    handleFormChange(updates);
  };


  const validateForm = (): z.infer<typeof formSchema> | null => {
    try {
      // Full schema validation including sanitization
      const parsedData = formSchema.parse(formData);
      setErrors({});
      return parsedData;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          // Flatten nested errors for UI
          // additional_links.0.url -> link_0
          // cta_button.link -> cta_link
          if (error.path[0] === 'additional_links' && typeof error.path[1] === 'number' && error.path[2] === 'url') {
            newErrors[`link_${error.path[1]}`] = error.message;
          } else if (error.path[0] === 'cta_button' && error.path[1] === 'link') {
            newErrors['cta_link'] = error.message;
          } else if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        setSaveMessage('✗ Please fix the errors in the form');
      }
      return null;
    }
  };

  const handleFormChange = (updates: Partial<FormData>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    onFormChange?.(newFormData);

    // Clear errors for fields being edited
    if (Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      Object.keys(updates).forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        handleFormChange({ photo_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    handleFormChange({ photo_url: '' });
  };

  const addAdditionalLink = () => {
    if (formData.additional_links.length < 3) {
      handleFormChange({
        additional_links: [...formData.additional_links, { label: '', url: '' }]
      });
    }
  };

  const updateAdditionalLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...formData.additional_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleFormChange({ additional_links: newLinks });
  };

  const removeAdditionalLink = (index: number) => {
    const newLinks = formData.additional_links.filter((_, i) => i !== index);
    handleFormChange({ additional_links: newLinks });
  };

  const addCustomHighlight = () => {
    if (formData.custom_highlights.length < 3) {
      handleFormChange({
        custom_highlights: [...formData.custom_highlights, { label: '', value: '' }]
      });
    }
  };

  const updateCustomHighlight = (index: number, field: 'label' | 'value', value: string) => {
    const newHighlights = [...formData.custom_highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    handleFormChange({ custom_highlights: newHighlights });
  };

  const removeCustomHighlight = (index: number) => {
    const newHighlights = formData.custom_highlights.filter((_, i) => i !== index);
    handleFormChange({ custom_highlights: newHighlights });
  };

  const handleSave = async () => {
    const validatedData = validateForm();
    if (!validatedData) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const payload: any = {
        name: validatedData.name,
        title: validatedData.role,
        company: validatedData.organization || undefined,
        bio: validatedData.summary || undefined,
        phone: validatedData.phone ? validatedData.country_code + validatedData.phone : undefined,
        email: validatedData.email || undefined,
        website: validatedData.primary_link || undefined,
        avatar_url: validatedData.photo_url || undefined,
        custom_data: {
          domain: validatedData.domain || undefined,
          country_code: validatedData.country_code || undefined,
          additional_links: validatedData.additional_links?.filter(l => l.label && l.url) || undefined,
          cta_button: validatedData.cta_button && validatedData.cta_button.text && validatedData.cta_button.link
            ? validatedData.cta_button
            : undefined,
          custom_highlights: validatedData.custom_highlights?.filter(h => h.label && h.value) || undefined
        }
      };

      let savedCard: Card;

      if (mode === 'create' || !currentCard) {
        let slug = validatedData.slug;

        if (!slug) {
          slug = validatedData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }

        savedCard = await apiClient.post<Card>('/api/v1/cards', { ...payload, slug });
        setSaveMessage('✓ Card created successfully');

        // Trigger feedback modal for new card creation
        onCardCreation?.(savedCard);

        setTimeout(() => {
          window.location.href = `/mycards?tab=card&cardId=${savedCard.id}`;
        }, 1500);
      } else {
        savedCard = await apiClient.patch<Card>(`/api/v1/cards/${currentCard.id}`, payload);
        setSaveMessage('✓ Changes saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      }

      mutate('/api/v1/cards/user');
      onCardUpdate?.(savedCard);
    } catch (err: any) {
      if (err.status === 409 || err.message?.includes('Slug') || err.error_code === 'SLUG_EXISTS') {
        setSaveMessage('✗ Username is already taken');
        setSlugAvailable(false); // Mark as unavailable in UI
        setErrors(prev => ({ ...prev, slug: 'Username is already taken' }));
      } else {
        setSaveMessage('✗ Failed to save changes');
      }
      console.error('Error saving card:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCard) return;

    // Safety check with browser confirm
    if (!confirm(`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/cards/${currentCard.id}`);
      window.location.href = '/mycards';
    } catch (err) {
      console.error('Error deleting card:', err);
      setSaveMessage('✗ Failed to delete card');
    }
  };

  if (error) {
    return (
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
        <p className="text-destructive">Failed to load card data. Please refresh the page.</p>
      </div>
    );
  }

  if (!mode && !currentCard && !cards) {
    return (
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
        <p className="text-muted-foreground">Loading your card...</p>
      </div>
    );
  }

  const isCreating = mode === 'create' || !currentCard;

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          {isCreating ? 'Create New Card' : 'Edit Your Card'}
        </h3>
        <Button onClick={handleSave} size="sm" isLoading={isSaving} className="hidden md:flex">
          {isCreating ? 'Create Card' : 'Save Changes'}
        </Button>
      </div>

      {saveMessage && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-base ${saveMessage.includes('✓')
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {/* SECTION 1: Identity */}
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-foreground">Identity</h4>
          <Input
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleNameChange}
            icon={<User className="w-5 h-5 text-muted-foreground" />}
            error={errors.name}
          />

          <div className="relative">
            <Input
              placeholder="Username (e.g. john-doe) *"
              value={formData.slug || ''}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                handleFormChange({ slug: val });
                setTouchedSlug(true);
              }}
              icon={<Globe className="w-5 h-5 text-muted-foreground" />}
              className={
                !isCreating
                  ? "bg-muted text-muted-foreground border-transparent opacity-70 cursor-not-allowed"
                  : slugAvailable === false ? "!border-destructive" : slugAvailable === true ? "!border-green-500" : ""
              }
              error={errors.slug || (slugAvailable === false ? 'Username is already taken' : undefined)}
              disabled={!isCreating}
            />
            {/* Status indicator inside input area */}
            {isCreating && (
              <div className="absolute right-4 top-[18px] pointer-events-none">
                {isCheckingSlug ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : slugAvailable === true ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : null}
              </div>
            )}
            {isCreating && slugAvailable === true && (
              <p className="text-xs text-green-600 mt-1 px-4">✓ Username available</p>
            )}
            {!isCreating && (
              <p className="text-xs text-muted-foreground mt-1 px-4">Username cannot be changed after creation</p>
            )}
          </div>
          <Input
            placeholder="Role / Title * (e.g., Mobile App Developer, Final Year CSE Student, Product Manager)"
            value={formData.role}
            onChange={(e) => handleFormChange({ role: e.target.value.replace(/[<>]/g, '') })}
            icon={<Briefcase className="w-5 h-5 text-muted-foreground" />}
            error={errors.role}
          />
        </div>

        {/* SECTION 2: Visual Identity */}
        <div className="border-t border-border pt-4 sm:pt-6">
          <label className="block text-sm font-medium text-foreground mb-3">Profile Photo</label>
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className={`w-24 h-24 rounded-lg border-4 ${errors.photo_url ? 'border-destructive' : 'border-border'} overflow-hidden bg-muted flex items-center justify-center`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              {imagePreview && (
                <button
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {errors.photo_url && <p className="mt-2 text-xs sm:text-sm text-destructive">{errors.photo_url}</p>}
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Used as card background. Recommended: 800x800px or larger</p>
        </div>

        {/* SECTION 3: Context & Credibility */}
        <div className="border-t border-border pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-foreground">Context & Credibility</h4>
          <p className="text-xs sm:text-sm text-muted-foreground -mt-1 sm:-mt-2">Optional but recommended</p>
          <Input
            placeholder="Organization / Institution (e.g., Company name, University name, Independent / Freelancer)"
            value={formData.organization || ''}
            onChange={(e) => handleFormChange({ organization: e.target.value.replace(/[<>]/g, '') })}
            icon={<Building className="w-5 h-5" />}
            error={errors.organization}
          />
          <Input
            placeholder="Domain / Expertise (e.g., Software Development, Marketing & Growth, Finance)"
            value={formData.domain || ''}
            onChange={(e) => handleFormChange({ domain: e.target.value.replace(/[<>]/g, '') })}
            error={errors.domain}
          />
        </div>

        {/* SECTION 4: Professional Summary */}
        <div className="border-t border-border pt-6">
          <div className="flex items-baseline justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Professional Summary</label>
            <span className="text-xs text-muted-foreground">{(formData.summary || '').length}/200</span>
          </div>
          <Textarea
            placeholder="Final year computer science student focused on mobile app development and fintech products."
            value={formData.summary || ''}
            onChange={(e) => handleFormChange({ summary: e.target.value.replace(/[<>]/g, '').slice(0, 200) })}
            rows={3}
            className={errors.summary ? 'border-destructive' : ''}
          />
          {errors.summary && <p className="mt-2 text-xs sm:text-sm text-destructive">{errors.summary}</p>}
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Single paragraph, max 200 characters. No emojis.</p>
        </div>

        {/* SECTION 5: Contact & Reach */}
        <div className="border-t border-border pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-foreground">Contact & Reach</h4>
          <Input
            type="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={(e) => handleFormChange({ email: e.target.value.replace(/[<> ]/g, '') })}
            icon={<Mail className="w-5 h-5" />}
            error={errors.email}
          />

          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row gap-2">
              <CountrySelect
                value={formData.country_code}
                onChange={(value) => handleFormChange({ country_code: value })}
              />
              <Input
                type="tel"
                placeholder="Phone Number (10 digits)"
                value={formData.phone || ''}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                  handleFormChange({ phone: numericValue });
                }}
                icon={<Phone className="w-5 h-5" />}
                error={errors.phone}
                className="flex-1"
              />
            </div>
            {errors.phone && <p className="text-xs sm:text-sm text-destructive px-1">{errors.phone}</p>}
          </div>

          <Input
            type="url"
            placeholder="Primary Professional Link * (LinkedIn / Portfolio / Website)"
            value={formData.primary_link}
            onChange={(e) => handleFormChange({ primary_link: e.target.value })}
            icon={<Globe className="w-5 h-5" />}
            error={errors.primary_link}
          />
        </div>

        {/* SECTION 6: Additional Links */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground">Additional Links</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Max 3 (e.g., GitHub, Portfolio, LinkedIn)</p>
            </div>
            {formData.additional_links.length < 3 && (
              <Button onClick={addAdditionalLink} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Link
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {formData.additional_links.map((link, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={link.label}
                    onValueChange={(value) => updateAdditionalLink(idx, 'label', value)}
                  >
                    <SelectTrigger className="w-full sm:w-1/3 min-w-[140px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-white dark:bg-neutral-900">
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Portfolio">Portfolio</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="GitHub">GitHub</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Twitch">Twitch</SelectItem>
                      <SelectItem value="Discord">Discord</SelectItem>
                      <SelectItem value="GitLab">GitLab</SelectItem>
                      <SelectItem value="Stack Overflow">Stack Overflow</SelectItem>
                      <SelectItem value="Dribbble">Dribbble</SelectItem>
                      <SelectItem value="Behance">Behance</SelectItem>
                      <SelectItem value="Figma">Figma</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Dev.to">Dev.to</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 flex-1">
                    <Input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateAdditionalLink(idx, 'url', e.target.value)}
                      className="flex-1"
                      error={errors[`link_${idx}`]}
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeAdditionalLink(idx)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: Primary CTA Button */}
        <div className="border-t border-border pt-6 space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Primary Action Button</h4>
            <p className="text-sm text-muted-foreground">Optional call-to-action button</p>
          </div>
          <Input
            placeholder="Button Text (e.g., Contact Me, View Portfolio, Connect on LinkedIn)"
            value={formData.cta_button?.text || ''}
            onChange={(e) => handleFormChange({
              cta_button: { ...formData.cta_button, text: e.target.value.replace(/[<>]/g, ''), link: formData.cta_button?.link || '' } as any
            })}
          />
          <Input
            type="url"
            placeholder="Action Link (URL or mailto:your@email.com)"
            value={formData.cta_button?.link || ''}
            onChange={(e) => handleFormChange({
              cta_button: { text: formData.cta_button?.text || '', link: e.target.value } as any
            })}
            error={errors.cta_link}
          />
        </div>

        {/* SECTION 8: Custom Highlights */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground">Custom Highlights</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Max 3 key-value pairs (e.g., Projects → 5+ shipped apps, Experience → 3 years)</p>
            </div>
            {formData.custom_highlights.length < 3 && (
              <Button onClick={addCustomHighlight} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Highlight
              </Button>
            )}
          </div>
          <div className="space-y-2 sm:space-y-3">
            {formData.custom_highlights.map((highlight, idx) => (
              <div key={idx} className="flex flex-col xs:flex-row gap-2">
                <Input
                  placeholder="Label (max 20)"
                  value={highlight.label}
                  onChange={(e) => updateCustomHighlight(idx, 'label', e.target.value.replace(/[<>]/g, '').slice(0, 20))}
                // className="w-1/2"
                />
                <Input
                  placeholder="Value (max 60)"
                  value={highlight.value}
                  onChange={(e) => updateCustomHighlight(idx, 'value', e.target.value.replace(/[<>]/g, '').slice(0, 60))}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" onClick={() => removeCustomHighlight(idx)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Save Button */}
        <div className="md:hidden pt-2">
          <Button onClick={handleSave} fullWidth size="lg" disabled={isSaving}>
            {isSaving ? 'Saving...' : isCreating ? 'Create Card' : 'Save Changes'}
          </Button>
        </div>

        {/* SECTION 9: Danger Zone (Only for existing cards) */}
        {!isCreating && (
          <div className="border-t border-border pt-8 mt-4">
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <Trash className="w-5 h-5" /> Danger Zone
            </h4>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h5 className="font-medium text-red-900 dark:text-red-200">Delete this card</h5>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Once you delete a card, there is no going back. Please be certain.
                  </p>
                </div>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 dark:bg-transparent dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"
                >
                  Delete Card
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
