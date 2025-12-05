'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OAuthButton } from '@/components/auth/OAuthButton';

export default function SignupPage() {
    const searchParams = useSearchParams();
    const error = searchParams?.get('error');

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

                    {/* OAuth Button */}
                    <OAuthButton provider="google" />

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
