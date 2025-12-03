'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { Container } from '@/components/ui/Container';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import type { Card as CardType } from '@/lib/api/types';

const fetcher = (url: string) => apiClient.get<any>(url);

export default function MyCardsPage() {
    const { data: cards, error, isLoading } = useSWR<CardType[]>('/api/v1/cards/user', fetcher);
    const [togglingId, setTogglingId] = useState<string | null>(null);

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

    if (isLoading) {
        return (
            <Container>
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="text-center py-20">
                    <h2 className="text-xl font-semibold text-red-600">Failed to load cards</h2>
                    <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
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
                <Link href="/dashboard/cards/new">
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
                            <Link href="/dashboard/cards/new">
                                <Button>Create Your First Card</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <div className="space-y-6">
                    {cards.map((card) => (
                        <Card key={card.id}>
                            <CardHeader className="border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar src={card.photo_url || card.avatar_url} name={card.name} size="lg" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                                            <p className="text-sm text-gray-500">/{card.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge variant={card.is_published ? 'success' : 'default'}>
                                            {card.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleTogglePublish(card.id, card.is_published)}
                                            disabled={togglingId === card.id}
                                        >
                                            {togglingId === card.id ? 'Updating...' : card.is_published ? 'Unpublish' : 'Publish'}
                                        </Button>
                                        <Link href={`/dashboard/card/${card.id}/edit`}>
                                            <Button variant="primary" size="sm">Edit</Button>
                                        </Link>
                                        <Link href={`/dashboard/card/${card.id}/analytics`}>
                                            <Button variant="secondary" size="sm">
                                                <BarChart3 className="w-4 h-4 mr-1" />
                                                Analytics
                                            </Button>
                                        </Link>
                                        {card.is_published && (
                                            <a href={`/${card.slug}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                                        <dl className="space-y-2">
                                            {card.title && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">Title</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{card.title}</dd>
                                                </div>
                                            )}
                                            {card.company && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">Company</dt>
                                                    <dd className="text-sm font-medium text-gray-900">{card.company}</dd>
                                                </div>
                                            )}
                                            {card.about && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">About</dt>
                                                    <dd className="text-sm text-gray-900">{card.about}</dd>
                                                </div>
                                            )}
                                            <div>
                                                <dt className="text-sm text-gray-500">Created</dt>
                                                <dd className="text-sm text-gray-900">{formatDate(card.created_at)}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Details</h4>
                                        <dl className="space-y-2">
                                            {card.email && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">Email</dt>
                                                    <dd className="text-sm text-gray-900">{card.email}</dd>
                                                </div>
                                            )}
                                            {card.phone && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">Phone</dt>
                                                    <dd className="text-sm text-gray-900">{card.phone}</dd>
                                                </div>
                                            )}
                                            {card.website && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">Website</dt>
                                                    <dd className="text-sm text-gray-900 truncate">
                                                        <a href={card.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                            {card.website}
                                                        </a>
                                                    </dd>
                                                </div>
                                            )}
                                            {card.social_links && Object.keys(card.social_links).length > 0 && (
                                                <div>
                                                    <dt className="text-sm text-gray-500">Social Links</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {Object.keys(card.social_links).length} connected
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
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
