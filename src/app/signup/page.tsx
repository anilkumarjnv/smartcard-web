'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { OAuthButton } from '@/components/auth/OAuthButton';
import { apiClient } from '@/lib/apiClient';

function SignupContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams?.get('error');
    const [betaStatus, setBetaStatus] = useState<{
        isBetaMode: boolean;
        limitReached: boolean;
        spotsRemaining: number;
        maxUsers: number | null;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkBetaStatus();
    }, []);

    async function checkBetaStatus() {
        try {
            const status = await apiClient.get<{
                isBetaMode: boolean;
                maxUsers: number | null;
                currentUsers: number;
                spotsRemaining: number;
                limitReached: boolean;
            }>('/api/v1/beta/status');
            setBetaStatus(status);
        } catch (error) {
            console.error('Failed to check beta status:', error);
            setBetaStatus({ isBetaMode: false, limitReached: false, spotsRemaining: 0, maxUsers: null });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <span className="text-primary-foreground text-xl font-bold">S</span>
                        </div>
                        <span className="text-2xl font-semibold">SmartCard</span>
                    </div>

                    {/* Header */}
                    <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                    <p className="text-muted-foreground mb-8">
                        Get started with your digital business card
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                            <p className="text-sm text-destructive">
                                {error === 'auth_failed'
                                    ? 'Authentication failed. Please try again.'
                                    : 'An error occurred. Please try again.'}
                            </p>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-sm text-muted-foreground">Checking availability...</p>
                        </div>
                    )}

                    {/* Beta Limit Reached */}
                    {!loading && betaStatus?.isBetaMode && betaStatus.limitReached && (
                        <div className="space-y-4">
                            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                                            Beta Testing Full
                                        </h3>
                                        <p className="text-sm text-yellow-800">
                                            All  beta spots are currently filled. We're working on opening more spots soon!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/beta-limit')}
                                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                            >
                                Join Waitlist
                            </button>
                        </div>
                    )}

                    {/* Spots Remaining Badge */}
                    {!loading && betaStatus?.isBetaMode && !betaStatus.limitReached && betaStatus.spotsRemaining <= 5 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm text-blue-800 text-center">
                                ⚡ Only {betaStatus.spotsRemaining} beta spots remaining!
                            </p>
                        </div>
                    )}

                    {/* OAuth Button - Only show if beta limit NOT reached */}
                    {!loading && (!betaStatus?.isBetaMode || !betaStatus.limitReached) && (
                        <OAuthButton provider="google" />
                    )}

                    {/* Terms */}
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
                            Privacy Policy
                        </Link>
                    </p>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-muted-foreground">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign in link */}
                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Sign in →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <SignupContent />
        </Suspense>
    );
}
