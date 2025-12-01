// src/components/analytics/DailyViewsChart.tsx
/**
 * Daily Views Chart
 * 
 * Line chart showing views over time using Recharts.
 * Responsive container included.
 */

'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { formatDate } from '@/utils/formatters';
import type { DailyView } from '@/lib/api/types';

interface DailyViewsChartProps {
    data: DailyView[];
}

export function DailyViewsChart({ data }: DailyViewsChartProps) {
    // Format data for chart
    const chartData = data.map((item) => ({
        date: formatDate(item.date, 'MMM d'),
        views: item.count,
    }));

    return (
        <Card className="h-full">
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Views Over Time</h3>
            </CardHeader>
            <CardBody>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
}
