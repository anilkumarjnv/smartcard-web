'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileCardsGrid } from '@/components/cards/ProfileCardsGrid';
import { CardEditorTab } from '@/components/organisms/CardEditorTab';
import { ThemeCustomizationTab } from '@/components/organisms/ThemeCustomizationTab';
import { ShareTab } from '@/components/organisms/ShareTab';
import { CardPreview } from '@/components/CardPreview';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card as CardType } from '@/lib/api/types';

const fetcher = (url: string) => apiClient.get<any>(url);

export default function MyCardsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');
    const cardIdParam = searchParams?.get('cardId');
    const modeParam = searchParams?.get('mode');
    const [activeTab, setActiveTab] = useState<'card' | 'theme' | 'share'>(tabParam as 'card' | 'theme' | 'share' || 'card');
    const [cardData, setCardData] = useState<CardType | null>(null);
    const [liveFormData, setLiveFormData] = useState<any>(null);
    const [persistedFormData, setPersistedFormData] = useState<any>(null);
    const [liveTheme, setLiveTheme] = useState<Record<string, unknown> | undefined>(undefined);

    // Fetch user's card data
    const { data: cards, isLoading } = useSWR<CardType[]>('/api/v1/cards/user', fetcher);

    // Determine which card to use based on URL parameters
    const currentCard = cardIdParam
        ? cards?.find(card => card.id === cardIdParam) || null
        : null;

    // Update local card data when fetched
    useEffect(() => {
        if (currentCard) {
            setCardData(currentCard);
            if (!persistedFormData || persistedFormData._cardId !== cardIdParam) {
                const cardData = currentCard as any;
                const initialFormData = {
                    _cardId: currentCard.id,
                    name: currentCard.name || '',
                    title: currentCard.title || '',
                    company: currentCard.company || '',
                    about: cardData.bio || currentCard.about || '',
                    phone: currentCard.phone || '',
                    phone_public: currentCard.phone_public ?? false,
                    email: currentCard.email || '',
                    website: currentCard.website || '',
                    photo_url: currentCard.avatar_url || currentCard.photo_url || '',
                    social_links: {
                        linkedin: (currentCard.social_links as Record<string, string>)?.linkedin || '',
                        instagram: (currentCard.social_links as Record<string, string>)?.instagram || '',
                        twitter: (currentCard.social_links as Record<string, string>)?.twitter || '',
                        github: (currentCard.social_links as Record<string, string>)?.github || '',
                        whatsapp: (currentCard.social_links as Record<string, string>)?.whatsapp || ''
                    }
                };
                setPersistedFormData(initialFormData);
                setLiveFormData(initialFormData);
            }
        } else if (modeParam === 'create') {
            setCardData(null);
            setLiveFormData(null);
            setPersistedFormData(null);
            setLiveTheme(undefined);
        }
    }, [cardIdParam, modeParam, currentCard]);

    // Update active tab based on URL parameter
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam as 'card' | 'theme' | 'share');
        }
    }, [tabParam]);

    // Check if we're in edit/create mode
    const isEditingCard = cardIdParam || modeParam === 'create';

    // Show editor if in edit/create mode
    if (isEditingCard) {
        if (isLoading && !modeParam) {
            return (
                <div className="p-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h1 className="text-xl font-semibold">Loading...</h1>
                    </div>
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="border-b border-border bg-card/50">
                    <div className="px-6 py-4">
                        <Link href="/mycards">
                            <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to My Cards
                            </Button>
                        </Link>
                    </div>
                    {/* Tab Navigation */}
                    <div className="px-6 pb-4">
                        <div className="bg-muted/50 rounded-2xl p-2 inline-flex gap-2">
                            <button
                                onClick={() => router.push(`/mycards?tab=card${cardIdParam ? `&cardId=${cardIdParam}` : modeParam ? `&mode=${modeParam}` : ''}`)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'card'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                My Card
                            </button>
                            <button
                                onClick={() => router.push(`/mycards?tab=theme${cardIdParam ? `&cardId=${cardIdParam}` : modeParam ? `&mode=${modeParam}` : ''}`)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'theme'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Themes
                            </button>
                            <button
                                onClick={() => router.push(`/mycards?tab=share${cardIdParam ? `&cardId=${cardIdParam}` : modeParam ? `&mode=${modeParam}` : ''}`)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'share'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 p-6">
                    {/* Editor Section */}
                    <div>
                        {activeTab === 'card' && (
                            <CardEditorTab
                                cardId={cardIdParam || undefined}
                                mode={modeParam as 'create' | undefined}
                                initialFormData={persistedFormData}
                                onCardUpdate={(card) => {
                                    setCardData(card);
                                    if (persistedFormData) {
                                        setPersistedFormData({ ...persistedFormData, _cardId: card.id });
                                    }
                                }}
                                onFormChange={(formData) => {
                                    setLiveFormData(formData);
                                    if (formData) {
                                        setPersistedFormData({ ...formData, _cardId: cardIdParam || (formData as any)._cardId });
                                    }
                                }}
                            />
                        )}
                        {activeTab === 'theme' && (
                            <ThemeCustomizationTab
                                cardId={cardIdParam || undefined}
                                onThemeUpdate={(theme) => {
                                    setLiveTheme(theme);
                                    if (cardData) {
                                        setCardData({ ...cardData, theme });
                                    }
                                }}
                            />
                        )}
                        {activeTab === 'share' && (
                            <ShareTab cardId={cardIdParam || undefined} />
                        )}
                    </div>

                    {/* Live Preview Section */}
                    <div className="hidden lg:block sticky top-24 h-fit">
                        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-semibold">Live Preview</h4>
                                {cardData && (
                                    <Link
                                        href={`/${cardData.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                        View Full Page
                                    </Link>
                                )}
                            </div>
                            <div className="bg-muted/30 rounded-2xl overflow-hidden" style={{ minHeight: '600px' }}>
                                {(liveFormData || cardData) ? (
                                    <CardPreview
                                        card={liveFormData ? {
                                            ...liveFormData,
                                            title: liveFormData.role,
                                            company: liveFormData.organization,
                                            about: liveFormData.summary,
                                            website: liveFormData.primary_link,
                                            photo_url: liveFormData.photo_url || liveFormData.avatar_url,
                                            social_links: liveFormData.social_links || {}
                                        } as any : cardData}
                                        theme={liveTheme || cardData?.theme}
                                        isPublicView={true}
                                        disableFlip={true}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-center py-12 text-muted-foreground">
                                        {modeParam === 'create' ? (
                                            <div>
                                                <p className="text-lg font-medium text-foreground mb-2">Start Creating Your Card</p>
                                                <p className="text-sm">Fill in the form to see your card preview</p>
                                            </div>
                                        ) : isLoading ? (
                                            'Loading preview...'
                                        ) : (
                                            'No card data available'
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show card listing with ProfileCard themes
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <ProfileCardsGrid cards={cards || []} />
        </div>
    );
}
