'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface BetaStatus {
    isBetaMode: boolean;
    maxUsers: number | null;
    currentUsers: number;
    spotsRemaining: number;
    limitReached: boolean;
}

export function BetaBanner() {
    const [betaStatus, setBetaStatus] = useState<BetaStatus | null>(null);

    useEffect(() => {
        loadBetaStatus();
    }, []);

    async function loadBetaStatus() {
        try {
            const status = await apiClient.get<BetaStatus>('/api/v1/beta/status');
            setBetaStatus(status);
        } catch (error) {
            console.error('Failed to load beta status:', error);
        }
    }

    if (!betaStatus?.isBetaMode) return null;

    return (
        <div className={`
            px-4 py-2 text-center text-sm font-medium
            ${betaStatus.limitReached
                ? 'bg-red-50 text-red-800 border-b border-red-200'
                : 'bg-blue-50 text-blue-800 border-b border-blue-200'
            }
        `}>
            {betaStatus.limitReached ? (
                <span>
                    Beta testing in progress - User limit reached. Join our waitlist for early access!
                </span>
            ) : (
                <span>
                    🚀 Beta Testing - {betaStatus.spotsRemaining} of {betaStatus.maxUsers} spots remaining
                </span>
            )}
        </div>
    );
}

export function useBetaStatus() {
    const [betaStatus, setBetaStatus] = useState<BetaStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBetaStatus();
    }, []);

    async function loadBetaStatus() {
        try {
            setLoading(true);
            const status = await apiClient.get<BetaStatus>('/api/v1/beta/status');
            setBetaStatus(status);
        } catch (error) {
            console.error('Failed to load beta status:', error);
        } finally {
            setLoading(false);
        }
    }

    return { betaStatus, loading, refresh: loadBetaStatus };
}
