// src/components/analytics/ReferrersTable.tsx
/**
 * Referrers Table
 * 
 * List of top traffic sources.
 */

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { formatUrl } from '@/utils/formatters';
import type { Referrer } from '@/lib/api/types';

interface ReferrersTableProps {
    data: Referrer[];
}

export function ReferrersTable({ data }: ReferrersTableProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Top Sources</h3>
            </CardHeader>
            <CardBody className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Views
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.referrer ? formatUrl(item.referrer) : 'Direct / Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                            {item.count}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
