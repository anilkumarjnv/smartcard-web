// src/app/dashboard/page.tsx
/**
 * Dashboard Overview Page
 * 
 * Shows high-level stats and quick actions.
 * Fetches user's cards and displays a summary.
 */

'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { Container } from '@/components/ui/Container';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import type { Card as CardType } from '@/lib/api/types';

// SWR fetcher
const fetcher = (url: string) => apiClient.get<any>(url);

export default function DashboardPage() {
    // Fetch user's cards
    const { data: cards, error, isLoading } = useSWR<CardType[]>('/api/v1/cards/user', fetcher);

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
                    <h2 className="text-xl font-semibold text-red-600">Failed to load dashboard</h2>
                    <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
                </div>
            </Container>
        );
    }

    const hasCards = cards && cards.length > 0;

    return (
        <Container>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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
                            Create your first digital visiting card to start sharing your profile and tracking views.
                        </p>
                        <div className="mt-6">
                            <Link href="/dashboard/cards/new">
                                <Button>Create Your First Card</Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Link key={card.id} href={`/dashboard/card/${card.id}`}>
                            <Card hoverable className="h-full">
                                <CardHeader className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <Avatar src={card.avatar_url} name={card.name} size="md" />
                                        <div>
                                            <h3 className="font-medium text-gray-900 truncate max-w-[150px]">
                                                {card.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate max-w-[150px]">
                                                /{card.slug}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={card.is_published ? 'success' : 'default'}>
                                        {card.is_published ? 'Published' : 'Draft'}
                                    </Badge>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Created</span>
                                            <span className="font-medium text-gray-900">
                                                {formatDate(card.created_at)}
                                            </span>
                                        </div>
                                        {/* Placeholder for stats - would come from analytics endpoint */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Views</span>
                                            <span className="font-medium text-gray-900">-</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </Container>
    );
}
