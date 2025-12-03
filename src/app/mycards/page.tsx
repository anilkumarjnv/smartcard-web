'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { CardEditorTab } from '@/components/organisms/CardEditorTab';
import { ThemeCustomizationTab } from '@/components/organisms/ThemeCustomizationTab';
import { ShareTab } from '@/components/organisms/ShareTab';
import { CardPreview } from '@/components/CardPreview';
import { Container } from '@/components/ui/Container';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import useSWR, { mutate } from 'swr';
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
    const [liveTheme, setLiveTheme] = useState<Record<string, unknown> | undefined>(undefined);
    const [togglingId, setTogglingId] = useState<string | null>(null);

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
        } else if (modeParam === 'create') {
            // For create mode, clear all card data and form data
            setCardData(null);
            setLiveFormData(null);
            setLiveTheme(undefined);
        }
    }, [currentCard, modeParam]);

    // Update active tab based on URL parameter
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam as 'card' | 'theme' | 'share');
        }
    }, [tabParam]);

    // Clear all state when entering create mode
    useEffect(() => {
        if (modeParam === 'create' && !cardIdParam) {
            setCardData(null);
            setLiveFormData(null);
            setLiveTheme(undefined);
        }
    }, [modeParam, cardIdParam]);

    // Check if we're in edit/create mode
    const isEditingCard = cardIdParam || modeParam === 'create';

    const handleTogglePublish = async (cardId: string, currentStatus: boolean) => {
        setTogglingId(cardId);
        try {
            await apiClient.post(`/api/v1/cards/${cardId}/publish`, {
                is_published: !currentStatus,
            });
            // Refresh the cards list
            mutate('/api/v1/cards/user');
        } catch (error) {
            console.error('Failed to toggle publish status', error);
            alert('Failed to update publish status');
        } finally {
            setTogglingId(null);
        }
    };

    // Show card listing if not in edit/create mode
    if (!isEditingCard) {
        if (isLoading) {
            return (
                <Container>
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                </Container>
            );
        }

        const hasCards = cards && cards.length > 0;

        return (
            <Container>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
                        <p className="text-gray-600 mt-1">Manage all your digital visiting cards</p>
                    </div>
                    <Link href="/mycards?tab=card&mode=create">
                        <Button>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Card
                        </Button>
                    </Link>
                </div>

                {!hasCards ? (
                    <Card className="text-center py-12">
                        <CardBody>
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No cards yet</h3>
                            <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                                Create your first digital visiting card to start sharing your profile.
                            </p>
                            <div className="mt-6">
                                <Link href="/mycards?tab=card&mode=create">
                                    <Button>Create Your First Card</Button>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card) => (
                            <Card key={card.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                                {/* Card Preview Header */}
                                <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-t-2xl">
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg overflow-hidden">
                                            {card.photo_url || card.avatar_url ? (
                                                <img 
                                                    src={card.photo_url || card.avatar_url} 
                                                    alt={card.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <span className="text-3xl text-indigo-600 font-semibold">
                                                    {card.name?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={card.is_published ? 'success' : 'default'}>
                                            {card.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <CardBody className="pt-16 pb-4 flex-1 flex flex-col">
                                    <div className="text-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
                                        {card.title && (
                                            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                                        )}
                                        {card.company && (
                                            <p className="text-xs text-gray-500">{card.company}</p>
                                        )}
                                        <p className="text-xs text-indigo-600 mt-2">/{card.slug}</p>
                                    </div>

                                    {/* Card Info */}
                                    <div className="space-y-2 mb-4 flex-1">
                                        {card.about && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{card.about}</p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                            <span>Created</span>
                                            <span>{formatDate(card.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 mt-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href={`/mycards?tab=card&cardId=${card.id}`} className="flex-1">
                                                <Button variant="primary" size="sm" className="w-full">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/card/${card.id}/analytics`} className="flex-1">
                                                <Button variant="secondary" size="sm" className="w-full">
                                                    <BarChart3 className="w-4 h-4 mr-1" />
                                                    Analytics
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleTogglePublish(card.id, card.is_published)}
                                                disabled={togglingId === card.id}
                                                className="w-full"
                                            >
                                                {togglingId === card.id ? 'Updating...' : card.is_published ? 'Unpublish' : 'Publish'}
                                            </Button>
                                            {card.is_published && (
                                                <a href={`/${card.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                                                    <Button variant="ghost" size="sm" className="w-full">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        );
    }

    return (
        <main className="max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto">
                {/* Back Button - Show when editing/creating card */}
                {isEditingCard && (
                    <div className="mb-6">
                        <Link href="/mycards">
                            <Button variant="ghost" size="sm" className="mb-4">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to My Cards
                            </Button>
                        </Link>
                    </div>
                )}
                {/* Tab Navigation - Show when editing/creating card */}
                {isEditingCard && (
                    <div className="mb-6">
                        <div className="bg-white rounded-2xl p-2 shadow-sm inline-flex gap-2">
                            <button
                                onClick={() => router.push(`/mycards?tab=card${cardIdParam ? `&cardId=${cardIdParam}` : modeParam ? `&mode=${modeParam}` : ''}`)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'card'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                My Card
                            </button>
                            <button
                                onClick={() => router.push(`/mycards?tab=theme${cardIdParam ? `&cardId=${cardIdParam}` : modeParam ? `&mode=${modeParam}` : ''}`)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'theme'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Themes
                            </button>
                            <button
                                onClick={() => router.push(`/mycards?tab=share${cardIdParam ? `&cardId=${cardIdParam}` : modeParam ? `&mode=${modeParam}` : ''}`)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'share'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Share
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Editor Section */}
                    <div>
                        {activeTab === 'card' && (
                            <CardEditorTab
                                cardId={cardIdParam || undefined}
                                mode={modeParam as 'create' | undefined}
                                onCardUpdate={(card) => setCardData(card)}
                                onFormChange={(formData) => setLiveFormData(formData)}
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

                    {/* Live Preview Section - Desktop Only */}
                    <div className="hidden lg:block sticky top-24 h-fit">
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-semibold">Live Preview</h4>
                                {cardData && (
                                    <Link
                                        href={`/${cardData.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                    >
                                        View Full Page
                                    </Link>
                                )}
                            </div>
                            <div className="bg-gray-50 rounded-2xl overflow-hidden" style={{ minHeight: '600px' }}>
                                {(liveFormData || cardData) ? (
                                    <CardPreview
                                        card={liveFormData || cardData}
                                        theme={liveTheme || cardData?.theme}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-center py-12 text-gray-400">
                                        {modeParam === 'create' ? (
                                            <div>
                                                <p className="text-lg font-medium text-gray-500 mb-2">Start Creating Your Card</p>
                                                <p className="text-sm text-gray-400">Fill in the form to see your card preview</p>
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
        </main>
    );
}
