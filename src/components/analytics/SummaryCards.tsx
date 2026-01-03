// src/components/analytics/SummaryCards.tsx
/**
 * Analytics Summary Cards
 * 
 * Displays key metrics: Total Views, Unique Views, etc.
 */

import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatters';
import { Eye, Users, Activity } from 'lucide-react';

interface SummaryCardsProps {
    totalViews: number;
    uniqueViews: number;
    ctr?: number; // Click-through rate (future)
}

export function SummaryCards({ totalViews, uniqueViews }: SummaryCardsProps) {
    const engagementRate = totalViews > 0 ? ((uniqueViews / totalViews) * 100).toFixed(1) : '0';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Eye className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                        <Eye className="w-4 h-4" />
                        Total Views
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                        {formatNumber(totalViews)}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        All page loads
                    </p>
                </div>
            </Card>

            <Card className="border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                        <Users className="w-4 h-4" />
                        Unique Visitors
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                        {formatNumber(uniqueViews)}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Distinct devices
                    </p>
                </div>
            </Card>

            <Card className="border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        <Activity className="w-4 h-4" />
                        Engagement Rate
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                        {engagementRate}%
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        View to unique ratio
                    </p>
                </div>
            </Card>
        </div>
    );
}
