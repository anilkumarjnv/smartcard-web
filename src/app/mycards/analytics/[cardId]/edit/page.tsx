// src/app/dashboard/card/[cardId]/edit/page.tsx
/**
 * Card Editor Page with Live Preview
 * 
 * Split-screen layout: Form on left, live preview on right
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import { CardPreview } from '@/components/CardPreview';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { updateCardSchema, type UpdateCardFormData } from '@/lib/validators';
import type { Card as CardType } from '@/lib/api/types';
import { ThemeSelector } from '@/components/profile/ThemeSelector';

interface PageProps {
    params: Promise<{
        cardId: string;
    }>;
}

const fetcher = (url: string) => apiClient.get<any>(url);

export default function EditCardPage({ params }: PageProps) {
    const [cardId, setCardId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(true);

    useEffect(() => {
        params.then((p) => setCardId(p.cardId));
    }, [params]);

    const router = useRouter();
    const { data: card, error, isLoading } = useSWR<CardType>(
        cardId ? `/api/v1/cards/${cardId}` : null,
        fetcher
    );

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [formData, setFormData] = useState<Partial<UpdateCardFormData>>({});

    // Initialize form data when card loads
    useEffect(() => {
        if (card) {
            setFormData({
                name: card.name,
                slug: card.slug,
                title: card.title || '',
                company: card.company || '',
                about: card.about || '',
                email: card.email || '',
                phone: card.phone || '',
                website: card.website || '',
                photo_url: card.photo_url || card.avatar_url || '',
                logo_url: card.logo_url || card.cover_url || '',
                social_links: card.social_links || {},
                theme: card.theme || {},
            });
        }
    }, [card]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardId) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            await apiClient.patch(`/api/v1/cards/${cardId}`, formData);
            mutate(`/api/v1/cards/${cardId}`);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            if (err instanceof Error) {
                setSaveError(err.message);
            } else {
                setSaveError('Failed to update card');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishToggle = async () => {
        if (!card || !cardId) return;

        try {
            await apiClient.post(`/api/v1/cards/${cardId}/publish`);
            mutate(`/api/v1/cards/${cardId}`);
        } catch (err) {
            console.error('Failed to toggle publish status', err);
        }
    };

    const handleThemeChange = (theme: 'light' | 'dark' | 'accent' | 'neutral') => {
        setFormData(prev => ({
            ...prev,
            theme: {
                profileTheme: theme,
            } as Record<string, unknown>
        }));
    };

    if (isLoading || !cardId) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Alert variant="error" title="Error loading card">
                    {error.message || 'Failed to load card details'}
                </Alert>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Edit Card</h1>
                        <p className="text-sm text-gray-600 mt-0.5">/{card?.slug}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Mobile preview toggle */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="lg:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {showPreview ? 'Hide' : 'Show'} Preview
                        </button>

                        <a
                            href={`/${card?.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="secondary" size="sm">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Live
                            </Button>
                        </a>
                        <Button
                            variant={card?.is_published ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={handlePublishToggle}
                        >
                            {card?.is_published ? '✓ Published' : 'Publish'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Split screen content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Form Section */}
                <div className={`flex-1 overflow-y-auto ${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
                    <div className="max-w-3xl mx-auto p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {saveError && (
                                <Alert variant="error" title="Error saving">
                                    {saveError}
                                </Alert>
                            )}

                            {saveSuccess && (
                                <Alert variant="success" title="Saved">
                                    Card updated successfully.
                                </Alert>
                            )}

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-gray-900">Basic Info</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input
                                        label="Name"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Slug (URL)"
                                        value={formData.slug || ''}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                        helperText={`Your card will be at: /${formData.slug || 'your-slug'}`}
                                    />
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-gray-900">Profile Details</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input
                                        label="Job Title"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Software Engineer"
                                    />

                                    <Input
                                        label="Company"
                                        value={formData.company || ''}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g., Acme Inc."
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            rows={4}
                                            value={formData.about || ''}
                                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                            placeholder="Tell people about yourself..."
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                        />
                                        <Input
                                            label="Phone"
                                            type="tel"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    <Input
                                        label="Website"
                                        type="url"
                                        value={formData.website || ''}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-gray-900">Card Theme</h2>
                                </CardHeader>
                                <CardBody>
                                    <ThemeSelector
                                        selectedTheme={(formData.theme as any)?.profileTheme || 'light'}
                                        onThemeChange={handleThemeChange}
                                    />
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-lg font-medium text-gray-900">Images</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input
                                        label="Photo URL"
                                        value={formData.photo_url || ''}
                                        onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                                        helperText="Link to your profile picture"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                    <Input
                                        label="Logo/Cover Image URL"
                                        value={formData.logo_url || ''}
                                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                        helperText="Link to your background or company logo"
                                        placeholder="https://example.com/logo.jpg"
                                    />
                                </CardBody>
                            </Card>

                            <div className="flex justify-end space-x-3 pb-10">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={isSaving}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Preview Section */}
                {showPreview && (
                    <div className="hidden lg:block lg:w-1/2 border-l border-gray-200 bg-white overflow-hidden">
                        <div className="h-full">
                            <CardPreview
                                card={{
                                    ...card,
                                    ...formData,
                                }}
                                theme={formData.theme}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Preview Overlay */}
                {showPreview && (
                    <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Preview</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <CardPreview
                            card={{
                                ...card,
                                ...formData,
                            }}
                            theme={formData.theme}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
