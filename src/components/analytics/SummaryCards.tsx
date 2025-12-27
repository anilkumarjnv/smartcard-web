// src/components/analytics/SummaryCards.tsx
/**
 * Analytics Summary Cards
 * 
 * Displays key metrics: Total Views, Unique Views, etc.
 */

import { Card, CardBody } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatters';

interface SummaryCardsProps {
    totalViews: number;
    uniqueViews: number;
    ctr?: number; // Click-through rate (future)
}

export function SummaryCards({ totalViews, uniqueViews }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardBody>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Total Views
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                        {formatNumber(totalViews)}
                    </p>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Unique Visitors
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                        {formatNumber(uniqueViews)}
                    </p>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Engagement Rate
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                        {/* Placeholder calculation */}
                        {totalViews > 0
                            ? `${((uniqueViews / totalViews) * 100).toFixed(1)}%`
                            : '0%'}
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
