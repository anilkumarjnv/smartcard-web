// src/components/AuthGuard.tsx
/**
 * Auth Guard Component
 * 
 * Protects routes by checking authentication status.
 * Redirects to login if user is not authenticated.
 * 
 * Usage:
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Spinner } from '../ui/Spinner';
import type { AuthUser } from '@/lib/api/types';

export interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const currentUser = await getCurrentUser();

            if (!currentUser) {
                // Redirect to login with return URL
                const returnUrl = encodeURIComponent(window.location.pathname);
                router.push(`/login?returnTo=${returnUrl}`);
                return;
            }

            setUser(currentUser);
            setIsLoading(false);
        }

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <Spinner size="lg" />
                </div>
            )
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
