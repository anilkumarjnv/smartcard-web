// src/components/analytics/DeviceBreakdown.tsx
/**
 * Device Breakdown Chart
 * 
 * Bar chart showing device usage (Mobile, Desktop, Tablet).
 */

'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import type { DeviceBreakdown as DeviceData } from '@/lib/api/types';

interface DeviceBreakdownProps {
    data?: DeviceData;
}

const COLORS = {
    mobile: '#3B82F6', // Blue
    desktop: '#10B981', // Green
    tablet: '#F59E0B',  // Amber
    unknown: '#9CA3AF', // Gray
};

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
    if (!data) return null;

    const chartData = [
        { name: 'Mobile', value: data.mobile, color: COLORS.mobile },
        { name: 'Desktop', value: data.desktop, color: COLORS.desktop },
        { name: 'Tablet', value: data.tablet, color: COLORS.tablet },
        { name: 'Other', value: data.unknown, color: COLORS.unknown },
    ].filter(item => item.value > 0);

    return (
        <Card className="h-full">
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Device Types</h3>
            </CardHeader>
            <CardBody>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                width={60}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
}
