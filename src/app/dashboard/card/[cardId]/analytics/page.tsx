// src/app/dashboard/card/[cardId]/analytics/page.tsx
/**
 * Analytics Dashboard Page
 * 
 * Main analytics view for a specific card.
 * Fetches data from /api/analytics/:cardId and renders charts.
 */

'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { DailyViewsChart } from '@/components/analytics/DailyViewsChart';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { ReferrersTable } from '@/components/analytics/ReferrersTable';
import type { AnalyticsResponse } from '@/lib/api/types';

interface PageProps {
    params: Promise<{
        cardId: string;
    }>;
}

const fetcher = (url: string) => apiClient.get<any>(url);

export default function AnalyticsPage({ params }: PageProps) {
    const [cardId, setCardId] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setCardId(p.cardId));
    }, [params]);

    const { data, error, isLoading } = useSWR<AnalyticsResponse>(
        cardId ? `/api/analytics/${cardId}` : null,
        fetcher,
        {
            refreshInterval: 60000, // Refresh every minute
        }
    );

    if (isLoading || !cardId) {
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
                <Alert variant="error" title="Error loading analytics">
                    Failed to load analytics data. Please try again later.
                </Alert>
            </Container>
        );
    }

    if (!data) return null;

    return (
        <Container>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600 mt-1">Track views and engagement for your card.</p>
                </div>
                <div className="flex space-x-3">
                    <Link href={`/dashboard/card/${cardId}/edit`}>
                        <Button variant="secondary">
                            Edit Card
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <SummaryCards
                totalViews={data.total_views}
                uniqueViews={data.unique_views}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <DailyViewsChart data={data.daily_views} />
                </div>
                <div>
                    <DeviceBreakdown data={data.device_breakdown} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReferrersTable data={data.referrers} />
                {/* Future: Add Recent Events table here */}
            </div>
        </Container>
    );
}
