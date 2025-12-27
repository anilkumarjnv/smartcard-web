'use client';

import React, { useState, useEffect } from 'react';
import { User, Briefcase, Building, Phone, Mail, Globe, Upload, X, Plus, Trash } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Textarea } from '@/components/molecules/Textarea';
import { Button } from '@/components/molecules/Button';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';

interface FormData {
  //Section 1: Identity (Required)
  name: string;
  role: string;

  // Section 2: Visual Identity (Required)
  photo_url: string;

  // Section 3: Context & Credibility (Optional)
  organization?: string;
  domain?: string;

  // Section 4: Professional Summary (Optional, max 200 chars)
  summary?: string;

  // Section 5: Contact & Reach (Required)
  email: string;
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
  onFormChange?: (formData: FormData) => void;
}

const fetcher = (url: string) => apiClient.get<Card[]>(url);

export function CardEditorTab({ cardId, mode, initialFormData, onCardUpdate, onFormChange }: CardEditorTabProps) {
  const { data: cards, error } = useSWR<Card[]>('/api/v1/cards/user', fetcher);

  const currentCard = mode === 'create'
    ? null
    : cardId
      ? cards?.find(card => card.id === cardId) || null
      : cards && cards.length > 0 ? cards[0] : null;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    photo_url: '',
    organization: '',
    domain: '',
    summary: '',
    email: '',
    phone: '',
    primary_link: '',
    additional_links: [],
    cta_button: undefined,
    custom_highlights: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form data
  useEffect(() => {
    if (initialFormData && initialFormData._cardId === cardId) {
      const { _cardId, ...formDataWithoutId } = initialFormData;
      setFormData(formDataWithoutId);
      setImagePreview(formDataWithoutId.photo_url || '');
      onFormChange?.(formDataWithoutId);
      return;
    }

    if (mode === 'create') {
      const emptyData: FormData = {
        name: '',
        role: '',
        photo_url: '',
        organization: '',
        domain: '',
        summary: '',
        email: '',
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

      const initialData: FormData = {
        name: currentCard.name || '',
        role: currentCard.title || '',
        photo_url: currentCard.avatar_url || currentCard.photo_url || '',
        organization: currentCard.company || '',
        domain: customData.domain || '',
        summary: cardData.bio || currentCard.about || '',
        email: currentCard.email || '',
        phone: currentCard.phone || '',
        primary_link: currentCard.website || (currentCard.social_links as Record<string, string>)?.linkedin || '',
        additional_links: customData.additional_links || [],
        cta_button: customData.cta_button,
        custom_highlights: customData.custom_highlights || []
      };
      setFormData(initialData);
      setImagePreview(initialData.photo_url);
      onFormChange?.(initialData);
    }
  }, [cardId, mode]);

  const handleFormChange = (updates: Partial<FormData>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    onFormChange?.(newFormData);
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
    setIsSaving(true);
    setSaveMessage('');

    try {
      const payload: any = {
        name: formData.name,
        title: formData.role,
        company: formData.organization || undefined,
        bio: formData.summary || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        website: formData.primary_link || undefined,
        avatar_url: formData.photo_url || undefined,
        custom_data: {
          domain: formData.domain || undefined,
          additional_links: formData.additional_links.filter(l => l.label && l.url) || undefined,
          cta_button: formData.cta_button && formData.cta_button.text && formData.cta_button.link
            ? formData.cta_button
            : undefined,
          custom_highlights: formData.custom_highlights.filter(h => h.label && h.value) || undefined
        }
      };

      let savedCard: Card;

      if (mode === 'create' || !currentCard) {
        const slug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        savedCard = await apiClient.post<Card>('/api/v1/cards', { ...payload, slug });
        setSaveMessage('✓ Card created successfully');

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
    } catch (err) {
      setSaveMessage('✗ Failed to save changes');
      console.error('Error saving card:', err);
    } finally {
      setIsSaving(false);
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
    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-foreground">
          {isCreating ? 'Create New Card' : 'Edit Your Card'}
        </h3>
        <Button onClick={handleSave} size="sm" disabled={isSaving} className="hidden md:flex">
          {isSaving ? 'Saving...' : isCreating ? 'Create Card' : 'Save Changes'}
        </Button>
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded-2xl ${saveMessage.includes('✓')
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-8">
        {/* SECTION 1: Identity */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Identity</h4>
          <Input
            placeholder="Full Name *"
            value={formData.name}
            onChange={(e) => handleFormChange({ name: e.target.value })}
            icon={<User className="w-5 h-5 text-muted-foreground" />}
          />
          <Input
            placeholder="Role / Title * (e.g., Mobile App Developer, Final Year CSE Student, Product Manager)"
            value={formData.role}
            onChange={(e) => handleFormChange({ role: e.target.value })}
            icon={<Briefcase className="w-5 h-5 text-muted-foreground" />}
          />
        </div>

        {/* SECTION 2: Visual Identity */}
        <div className="border-t border-border pt-6">
          <label className="block text-sm font-medium text-foreground mb-3">Profile Photo *</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border-4 border-border overflow-hidden bg-muted flex items-center justify-center">
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
          <p className="mt-2 text-sm text-muted-foreground">Used as card background. Recommended: 800x800px or larger</p>
        </div>

        {/* SECTION 3: Context & Credibility */}
        <div className="border-t border-border pt-6 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Context & Credibility</h4>
          <p className="text-sm text-muted-foreground -mt-2">Optional but recommended</p>
          <Input
            placeholder="Organization / Institution (e.g., Company name, University name, Independent / Freelancer)"
            value={formData.organization || ''}
            onChange={(e) => handleFormChange({ organization: e.target.value })}
            icon={<Building className="w-5 h-5" />}
          />
          <Input
            placeholder="Domain / Expertise (e.g., Software Development, Marketing & Growth, Finance)"
            value={formData.domain || ''}
            onChange={(e) => handleFormChange({ domain: e.target.value })}
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
            onChange={(e) => handleFormChange({ summary: e.target.value.slice(0, 200) })}
            rows={3}
          />
          <p className="mt-2 text-sm text-muted-foreground">Single paragraph, max 200 characters. No emojis.</p>
        </div>

        {/* SECTION 5: Contact & Reach */}
        <div className="border-t border-border pt-6 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Contact & Reach</h4>
          <Input
            type="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={(e) => handleFormChange({ email: e.target.value })}
            icon={<Mail className="w-5 h-5" />}
          />
          <Input
            type="tel"
            placeholder="Phone Number (with country code)"
            value={formData.phone || ''}
            onChange={(e) => handleFormChange({ phone: e.target.value })}
            icon={<Phone className="w-5 h-5" />}
          />
          <Input
            type="url"
            placeholder="Primary Professional Link * (LinkedIn / Portfolio / Website)"
            value={formData.primary_link}
            onChange={(e) => handleFormChange({ primary_link: e.target.value })}
            icon={<Globe className="w-5 h-5" />}
          />
        </div>

        {/* SECTION 6: Additional Links */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground">Additional Links</h4>
              <p className="text-sm text-muted-foreground">Max 3 (e.g., GitHub, Portfolio, LinkedIn)</p>
            </div>
            {formData.additional_links.length < 3 && (
              <Button onClick={addAdditionalLink} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Link
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {formData.additional_links.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <select
                  value={link.label}
                  onChange={(e) => updateAdditionalLink(idx, 'label', e.target.value)}
                  className="w-1/3 flex h-10 rounded-md border border-input bg-background dark:bg-neutral-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                >
                  <option value="" disabled className="text-muted-foreground">Select Platform</option>
                  <option value="Website">Website</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="GitHub">GitHub</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitch">Twitch</option>
                  <option value="Discord">Discord</option>
                  <option value="GitLab">GitLab</option>
                  <option value="Stack Overflow">Stack Overflow</option>
                  <option value="Dribbble">Dribbble</option>
                  <option value="Behance">Behance</option>
                  <option value="Figma">Figma</option>
                  <option value="Medium">Medium</option>
                  <option value="Dev.to">Dev.to</option>
                </select>
                <Input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateAdditionalLink(idx, 'url', e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" onClick={() => removeAdditionalLink(idx)}>
                  <Trash className="w-4 h-4" />
                </Button>
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
              cta_button: { ...formData.cta_button, text: e.target.value, link: formData.cta_button?.link || '' } as any
            })}
          />
          <Input
            type="url"
            placeholder="Action Link (URL or mailto:your@email.com)"
            value={formData.cta_button?.link || ''}
            onChange={(e) => handleFormChange({
              cta_button: { text: formData.cta_button?.text || '', link: e.target.value } as any
            })}
          />
        </div>

        {/* SECTION 8: Custom Highlights */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-foreground">Custom Highlights</h4>
              <p className="text-sm text-muted-foreground">Max 3 key-value pairs (e.g., Projects → 5+ shipped apps, Experience → 3 years)</p>
            </div>
            {formData.custom_highlights.length < 3 && (
              <Button onClick={addCustomHighlight} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Highlight
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {formData.custom_highlights.map((highlight, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder="Label (max 20)"
                  value={highlight.label}
                  onChange={(e) => updateCustomHighlight(idx, 'label', e.target.value.slice(0, 20))}
                  className="w-1/3"
                />
                <Input
                  placeholder="Value (max 60)"
                  value={highlight.value}
                  onChange={(e) => updateCustomHighlight(idx, 'value', e.target.value.slice(0, 60))}
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
        <div className="md:hidden">
          <Button onClick={handleSave} fullWidth size="lg" disabled={isSaving}>
            {isSaving ? 'Saving...' : isCreating ? 'Create Card' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
