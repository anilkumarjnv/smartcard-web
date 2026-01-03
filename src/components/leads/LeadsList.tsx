'use client';

import { motion } from 'framer-motion';
import { Download, Mail, Phone, Calendar, Search } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import type { Lead } from '@/lib/api/types';

interface LeadsListProps {
    leads: Lead[];
    onSaveContact: (lead: Lead) => void;
}

export function LeadsList({ leads, onSaveContact }: LeadsListProps) {
    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No leads found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mt-2">
                    Your card hasn't captured any contacts yet. Share your card to start generating leads.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                <span className="font-semibold text-neutral-900 dark:text-white">Recent Leads</span>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    {leads.length} Total
                </span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {leads.map((lead, i) => (
                    <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            {/* Avatar / Initials */}
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center shrink-0">
                                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm md:text-base">
                                    {(lead.name || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                                {/* Name & Email */}
                                <div className="md:col-span-4">
                                    <p className="text-sm md:text-base font-medium text-neutral-900 dark:text-white truncate">
                                        {lead.name || 'Anonymous'}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        <Mail className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        <span className="truncate">{lead.email}</span>
                                    </div>
                                </div>

                                {/* Date & Source */}
                                <div className="md:col-span-3 hidden md:block">
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDate(lead.created_at)}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                            {lead.source || 'Card'}
                                        </span>
                                    </div>
                                </div>

                                {/* Message Preview */}
                                <div className="md:col-span-3 hidden md:block">
                                    {lead.message ? (
                                        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 truncate max-w-[200px]">
                                            "{lead.message}"
                                        </p>
                                    ) : (
                                        <span className="text-xs text-neutral-400 italic">No message</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="md:col-span-2 flex justify-end">
                                    <button
                                        onClick={() => onSaveContact(lead)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span className="md:hidden">Save</span>
                                    </button>
                                </div>

                            </div>
                        </div>

                        {/* Mobile-only extra details */}
                        <div className="mt-3 md:hidden flex flex-col gap-2 pl-[56px]">
                            {lead.phone && (
                                <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{lead.phone}</span>
                                </div>
                            )}
                            {lead.message && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-md">
                                    "{lead.message}"
                                </p>
                            )}
                            <div className="flex justify-between items-center text-xs text-neutral-400 pt-1">
                                <span>{formatDate(lead.created_at)}</span>
                                <span>via {lead.source || 'Card'}</span>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
        </div>
    );
}
