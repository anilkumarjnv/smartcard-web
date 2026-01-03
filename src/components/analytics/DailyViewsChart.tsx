'use client';

import {
    BarChart,
    Bar,
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
    data?: DailyView[];
}

export function DailyViewsChart({ data }: DailyViewsChartProps) {
    // Format data for chart
    const chartData = data?.map((item) => ({
        date: formatDate(item.date, 'MMM d'),
        views: item.count,
    })) || [];

    // Show message if no data
    const hasData = chartData.length > 0;

    return (
        <Card className="h-full border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <CardHeader className="border-b-0 pb-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Views Over Time</h3>
            </CardHeader>
            <CardBody>
                <div className="h-[300px] w-full">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#E5E7EB"
                                    className="dark:stroke-neutral-800"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#737373' }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#737373' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: 'var(--tooltip-bg, #fff)',
                                        border: '1px solid var(--tooltip-border, #E5E7EB)',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <Bar
                                    dataKey="views"
                                    fill="#6366F1" // Indigo-500
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">
                            <div className="text-center">
                                <p className="text-lg font-medium">No data available</p>
                                <p className="text-sm mt-1">Views will appear here once your card is accessed</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
