'use client';

import React, { useState, useEffect } from 'react';
import { User, Briefcase, Building, Phone, Mail, MessageCircle, Globe, Linkedin, Instagram, Twitter, Github, Upload, X } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Textarea } from '@/components/molecules/Textarea';
import { Button } from '@/components/molecules/Button';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';

interface FormData {
  name: string;
  title: string;
  company: string;
  about: string;
  phone: string;
  email: string;
  website: string;
  photo_url: string;
  social_links: {
    linkedin: string;
    instagram: string;
    twitter: string;
    github: string;
    whatsapp: string;
  };
}

interface CardEditorTabProps {
  cardId?: string;
  mode?: 'create';
  onCardUpdate?: (card: Card) => void;
  onFormChange?: (formData: FormData) => void;
}

const fetcher = (url: string) => apiClient.get<Card[]>(url);

export function CardEditorTab({ cardId, mode, onCardUpdate, onFormChange }: CardEditorTabProps) {
  const { data: cards, error } = useSWR<Card[]>('/api/v1/cards/user', fetcher);

  // Determine which card to use based on props
  const currentCard = mode === 'create'
    ? null
    : cardId
      ? cards?.find(card => card.id === cardId) || null
      : cards && cards.length > 0 ? cards[0] : null;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    about: '',
    phone: '',
    email: '',
    website: '',
    photo_url: '',
    social_links: {
      linkedin: '',
      instagram: '',
      twitter: '',
      github: '',
      whatsapp: ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form data when card loads
  useEffect(() => {
    if (currentCard) {
      const initialData = {
        name: currentCard.name || '',
        title: currentCard.title || '',
        company: currentCard.company || '',
        about: (currentCard as Card & { bio?: string }).bio || currentCard.about || '',  // Map 'bio' to 'about'
        phone: currentCard.phone || '',
        email: currentCard.email || '',
        website: currentCard.website || '',
        photo_url: currentCard.avatar_url || currentCard.photo_url || '',  // Map 'avatar_url' to 'photo_url'
        social_links: {
          linkedin: (currentCard.social_links as Record<string, string>)?.linkedin || '',
          instagram: (currentCard.social_links as Record<string, string>)?.instagram || '',
          twitter: (currentCard.social_links as Record<string, string>)?.twitter || '',
          github: (currentCard.social_links as Record<string, string>)?.github || '',
          whatsapp: (currentCard.social_links as Record<string, string>)?.whatsapp || ''
        }
      };
      setFormData(initialData);
      setImagePreview(currentCard.avatar_url || currentCard.photo_url || '');

      // Notify parent of initial data
      if (onFormChange) {
        onFormChange(initialData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard]);

  // Helper function to update form data and notify parent
  const handleFormChange = (updates: Partial<typeof formData>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    onFormChange?.(newFormData);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, photo_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, photo_url: '' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Filter out empty social links
      const filteredSocialLinks = Object.entries(formData.social_links)
        .filter(([, value]) => value && value.trim() !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      // Transform data to match backend schema
      const payload = {
        name: formData.name,
        title: formData.title || undefined,
        company: formData.company || undefined,
        bio: formData.about || undefined,  // Map 'about' to 'bio'
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        website: formData.website || undefined,
        avatar_url: formData.photo_url || undefined,  // Map 'photo_url' to 'avatar_url'
        social_links: Object.keys(filteredSocialLinks).length > 0 ? filteredSocialLinks : undefined
      };

      let savedCard: Card;

      if (mode === 'create' || !currentCard) {
        // Create new card - slug is required
        const slug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        savedCard = await apiClient.post<Card>(
          '/api/v1/cards',
          { ...payload, slug }
        );
        setSaveMessage('✓ Card created successfully');

        // Redirect to the new card's edit page after a brief delay
        setTimeout(() => {
          window.location.href = `/mycards?tab=card&cardId=${savedCard.id}`;
        }, 1500);
      } else {
        // Update existing card
        savedCard = await apiClient.patch<Card>(
          `/api/v1/cards/${currentCard.id}`,
          payload
        );
        setSaveMessage('✓ Changes saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      }

      // Refresh the cards list
      mutate('/api/v1/cards/user');

      // Notify parent component
      if (onCardUpdate) {
        onCardUpdate(savedCard);
      }
    } catch (err) {
      setSaveMessage('✗ Failed to save changes');
      console.error('Error saving card:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-red-600">Failed to load card data. Please refresh the page.</p>
      </div>
    );
  }

  // Show loading only if we're trying to fetch a specific card and it hasn't loaded yet
  if (!mode && !currentCard && !cards) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-gray-600">Loading your card...</p>
      </div>
    );
  }

  const isCreating = mode === 'create' || !currentCard;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold">{isCreating ? 'Create New Card' : 'Edit Your Card'}</h3>
        <Button onClick={handleSave} size="sm" disabled={isSaving} className="hidden md:flex">
          {isSaving ? 'Saving...' : isCreating ? 'Create Card' : 'Save Changes'}
        </Button>
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded-2xl ${saveMessage.includes('✓')
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
          }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
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
              <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center gap-2">
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
          <p className="mt-2 text-sm text-gray-500">Recommended: Square image, at least 400x400px</p>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleFormChange({ name: e.target.value })}
            icon={<User className="w-5 h-5" />}
          />

          <Input
            placeholder="Job Title"
            value={formData.title}
            onChange={(e) => handleFormChange({ title: e.target.value })}
            icon={<Briefcase className="w-5 h-5" />}
          />
        </div>

        <Input
          placeholder="Company Name"
          value={formData.company}
          onChange={(e) => handleFormChange({ company: e.target.value })}
          icon={<Building className="w-5 h-5" />}
        />

        <Textarea
          placeholder="About / Bio"
          label="About You"
          value={formData.about}
          onChange={(e) => handleFormChange({ about: e.target.value })}
          rows={4}
        />

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleFormChange({ phone: e.target.value })}
              icon={<Phone className="w-5 h-5" />}
            />

            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleFormChange({ email: e.target.value })}
              icon={<Mail className="w-5 h-5" />}
            />

            <Input
              type="tel"
              placeholder="WhatsApp Number"
              value={formData.social_links.whatsapp}
              onChange={(e) => handleFormChange({
                social_links: { ...formData.social_links, whatsapp: e.target.value }
              })}
              icon={<MessageCircle className="w-5 h-5" />}
            />

            <Input
              type="url"
              placeholder="Website URL"
              value={formData.website}
              onChange={(e) => handleFormChange({ website: e.target.value })}
              icon={<Globe className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold mb-4">Social Links</h4>
          <div className="space-y-4">
            <Input
              type="url"
              placeholder="LinkedIn Profile URL"
              value={formData.social_links.linkedin}
              onChange={(e) => handleFormChange({
                social_links: { ...formData.social_links, linkedin: e.target.value }
              })}
              icon={<Linkedin className="w-5 h-5" />}
            />

            <Input
              type="url"
              placeholder="Instagram Profile URL"
              value={formData.social_links.instagram}
              onChange={(e) => handleFormChange({
                social_links: { ...formData.social_links, instagram: e.target.value }
              })}
              icon={<Instagram className="w-5 h-5" />}
            />

            <Input
              type="url"
              placeholder="Twitter/X Profile URL"
              value={formData.social_links.twitter}
              onChange={(e) => handleFormChange({
                social_links: { ...formData.social_links, twitter: e.target.value }
              })}
              icon={<Twitter className="w-5 h-5" />}
            />

            <Input
              type="url"
              placeholder="GitHub Profile URL"
              value={formData.social_links.github}
              onChange={(e) => handleFormChange({
                social_links: { ...formData.social_links, github: e.target.value }
              })}
              icon={<Github className="w-5 h-5" />}
            />
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
