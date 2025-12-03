// src/app/leads/page.tsx
/**
 * Leads Management Page
 * 
 * Lists all leads captured from cards.
 * Allows filtering and CSV export.
 */

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import { Container } from '@/components/ui/Container';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { formatDate } from '@/utils/formatters';
import type { Lead } from '@/lib/api/types';

// SWR fetcher
const fetcher = (url: string) => apiClient.get(url);

export default function LeadsPage() {
    // In a real app, we'd fetch leads for all cards or allow selecting a card
    // For now, we'll assume an endpoint that returns all leads for the user
    // Since the backend currently only supports getting leads by card ID, 
    // we might need to update the backend or fetch cards first then leads.
    // For this MVP, we'll show a placeholder or fetch for the first card if available.

    // TODO: Implement "All Leads" endpoint in backend or iterate through cards
    // For now, let's just show the structure

    const [isLoading, setIsLoading] = useState(false);

    const handleExportCSV = () => {
        // Client-side CSV generation
        const headers = ['Name', 'Email', 'Phone', 'Message', 'Date', 'Source'];
        const csvContent = [
            headers.join(','),
            // ... leads.map(l => [l.name, l.email, ...].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <Container>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    <p className="text-gray-600 mt-1">Manage contacts captured from your cards.</p>
                </div>
                <Button variant="secondary" onClick={handleExportCSV}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardBody className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Source
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Placeholder empty state */}
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-900">No leads yet</p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Share your card to start collecting leads.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
}

