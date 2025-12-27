'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import { AppTopbar } from '@/components/navigation/AppTopbar';
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
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                // Use the secure backend API instead of direct DB access
                const response = await apiClient.get<Lead[]>('/api/v1/leads');

                if (Array.isArray(response)) {
                    setLeads(response);
                } else if ((response as any).data && Array.isArray((response as any).data)) {
                    setLeads((response as any).data);
                } else {
                    console.error('Unexpected leads response format:', response);
                    setLeads([]);
                }
            } catch (error) {
                console.error('Failed to fetch leads:', error);
                setLeads([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const handleExportCSV = () => {
        if (leads.length === 0) return;

        const headers = ['Name', 'Email', 'Phone', 'Message', 'Date', 'Source'];
        const csvContent = [
            headers.join(','),
            ...leads.map(l => [
                l.name || '',
                l.email || '',
                l.phone || '',
                `"${(l.message || '').replace(/"/g, '""')}"`, // Escape quotes
                new Date(l.created_at).toLocaleDateString(),
                l.source || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (isLoading) {
        return (
            <div>
                <AppTopbar title="Leads" subtitle="Manage contacts captured from your cards" />
                <Container>
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <AppTopbar title="Leads" subtitle="Manage contacts captured from your cards" />
            <Container>
                <div className="flex justify-between items-center mb-8 mt-8">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">All Leads</h2>
                        <p className="text-muted-foreground mt-1 text-sm">View and export your captured leads</p>
                    </div>
                    <Button variant="secondary" onClick={handleExportCSV} disabled={leads.length === 0}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                                <thead className="bg-gray-50 dark:bg-neutral-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Source
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-neutral-950 divide-y divide-gray-200 dark:divide-neutral-800">
                                    {leads.length > 0 ? (
                                        leads.map((lead) => (
                                            <tr key={lead.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name || 'Anonymous'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">{lead.email}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">{lead.message}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(lead.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                        {lead.source || 'Card'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No leads yet</p>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Share your card to start collecting leads.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
}
