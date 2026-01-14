import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { AuthUser } from '@/lib/api/types';

interface UserWithPlan extends AuthUser {
    plan_type: 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
}

export function useSubscription() {
    const fetcher = (url: string) => apiClient.get<UserWithPlan>(url);
    const { data: user, error, isLoading } = useSWR<UserWithPlan>('/api/v1/auth/me', fetcher);

    const planType = user?.plan_type || 'FREE';
    const isFounder = user?.is_founder || false;
    // Normalized check
    const isPro = planType === 'MONTHLY' || planType === 'YEARLY' || planType === 'LIFETIME' || isFounder;

    return {
        user,
        plan: planType,
        isPro,
        isFounder,
        isLoading,
        error
    };
}
