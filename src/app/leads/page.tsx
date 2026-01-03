'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import { Container } from '@/components/ui/Container';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { formatDate } from '@/utils/formatters';
import { downloadLeadVCard } from '@/utils/vcard';
import type { Lead } from '@/lib/api/types';
import { Download } from 'lucide-react';

// SWR fetcher
const fetcher = (url: string) => apiClient.get(url);

import { LeadsList } from '@/components/leads/LeadsList';

// ... (keep existing imports up to Line 15 if needed, but remove Alert/Card if unused later, though Card is used)
// Actually I'll rewrite the imports clean up in a cleaner way

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

    const handleSaveContact = (lead: Lead) => {
        downloadLeadVCard(lead);
    };

    if (isLoading) {
        return (
            <Container>
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8 mt-6 sm:mt-8">
                <div>
                    <h2 className="text-2xl font-bold text-neural-900 dark:text-white">All Leads</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">View and manage your captured contacts</p>
                </div>
                <Button variant="secondary" onClick={handleExportCSV} disabled={leads.length === 0} className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            <LeadsList leads={leads} onSaveContact={handleSaveContact} />
        </Container>
    );
}
