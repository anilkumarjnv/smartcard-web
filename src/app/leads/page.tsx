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
import { Download, Lock, User, Mail, Calendar } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { motion } from 'framer-motion';

// SWR fetcher
const fetcher = (url: string) => apiClient.get(url);

import { LeadsList } from '@/components/leads/LeadsList';

// ... (keep existing imports up to Line 15 if needed, but remove Alert/Card if unused later, though Card is used)
// Actually I'll rewrite the imports clean up in a cleaner way

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isPro, isLoading: isPlanLoading } = useSubscription();

    useEffect(() => {
        const fetchLeads = async () => {
            // Always fetch leads to show blurred preview for free users
            // if (!isPro && !isPlanLoading) return; // Removed

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

        if (!isPlanLoading) {
            fetchLeads();
        }
    }, [isPro, isPlanLoading]);

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

    if (!isPro && !isPlanLoading) {
        // Use real leads if available, otherwise mock data for empty state preview
        const hasRealLeads = leads.length > 0;

        const displayLeads = hasRealLeads ? leads : Array(5).fill(null).map((_, i) => ({
            id: `mock-${i}`,
            name: 'John Doe',
            email: 'john.doe@example.com',
            message: 'Hi, I would like to connect with you regarding your services.',
            created_at: new Date().toISOString(),
            source: 'Card'
        })) as any[]; // Cast as any to mix real/mock types safely if needed, though Lead type works if mock matches

        return (
            <Container>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8 mt-6 sm:mt-8">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">All Leads</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">View and manage your captured contacts</p>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                    {/* Locked Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-[2px] p-6 text-center">
                        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl p-8 rounded-2xl border border-white/20 dark:border-white/10 max-w-sm w-full mx-4 flex flex-col items-center">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Upgrade to Unlock Leads</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                See exactly who is visiting your profile and capturing your details.
                            </p>
                            <Link href="/subscription" className="w-full">
                                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white shadow-lg shadow-orange-500/20">
                                    Unlock Pro Features
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Blurred Content Background */}
                    <div className="p-0 opacity-70 pointer-events-none filter blur-[1.5px]">
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {displayLeads.map((lead, i) => (
                                <div key={i} className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <div className="md:col-span-4">
                                            {hasRealLeads ? (
                                                <>
                                                    <p className="font-medium text-neutral-900 dark:text-white truncate">{lead.name || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate">{lead.email || 'No email'}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3 text-neutral-300" />
                                                        <div className="h-3 w-40 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="md:col-span-3 hidden md:block">
                                            <div className="flex items-center gap-1 text-sm text-neutral-500">
                                                <Calendar className="w-3 h-3" />
                                                {hasRealLeads ? (
                                                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                                                ) : (
                                                    <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-5 hidden md:block">
                                            {hasRealLeads ? (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{lead.message}</p>
                                            ) : (
                                                <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
