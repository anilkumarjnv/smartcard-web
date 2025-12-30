'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBetaStatus } from '@/components/beta/BetaBanner';
import WaitlistForm from '@/components/waitlist/WaitlistForm';
import { Suspense } from 'react';

function BetaLimitContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { betaStatus, loading } = useBetaStatus();
    const isFromSignup = searchParams.get('reason') === 'signup';

    useEffect(() => {
        // If beta mode is off or limit not reached, redirect to login
        if (!loading && betaStatus && (!betaStatus.isBetaMode || !betaStatus.limitReached)) {
            router.push('/login');
        }
    }, [betaStatus, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-neutral-900 dark:text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-4">
                    {isFromSignup ? 'Signup Unavailable' : 'Beta Testing in Progress'}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                    {isFromSignup
                        ? "We successfully authenticated your Google account, but we've reached our beta testing limit. All beta spots are currently filled."
                        : "We're currently running a closed beta test with a limited number of users to ensure the best possible experience."
                    }
                </p>

                {/* Status */}
                <div className="bg-neutral-100 dark:bg-neutral-800 border border-border rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-foreground">
                        All  beta spots are currently filled
                    </p>
                </div>

                {/* Waitlist Form */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-foreground mb-3">Join the waitlist</h3>
                    <WaitlistForm />
                </div>

                {/* What's Next */}
                <div className="text-left mb-6">
                    <h2 className="font-semibold text-foreground mb-3">What's next?</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>We'll be opening up more spots soon</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Priority access when spots open</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Get notified when we publicly launch</span>
                        </li>
                    </ul>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Back to Home
                </button>

                {/* Footer Note */}
                <p className="text-xs text-muted-foreground mt-6">
                    Questions? Contact us at <a href="mailto:support@yourapp.com" className="text-foreground hover:underline">support@yourapp.com</a>
                </p>
            </div>
        </div>
    );
}

export default function BetaLimitPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <BetaLimitContent />
        </Suspense>
    );
}
