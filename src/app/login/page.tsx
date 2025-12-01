// src/app/login/page.tsx
/**
 * Login Page
 * 
 * Email and password login form.
 * Redirects to signup if user not found.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail, isAuthenticated } from '@/lib/auth';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        async function checkAuth() {
            const isAuth = await isAuthenticated();
            if (isAuth) {
                router.replace(returnTo);
            }
        }
        checkAuth();
    }, [router, returnTo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: signInError, user } = await signInWithEmail(email, password);

            if (signInError) {
                // Check if user doesn't exist - redirect to signup
                // Supabase returns "Invalid login credentials" for both wrong password and user not found
                // We'll redirect to signup to let them create an account if needed
                if (signInError.message.includes('Invalid login credentials') || 
                    signInError.message.includes('User not found') ||
                    signInError.message.toLowerCase().includes('email') && signInError.message.toLowerCase().includes('not')) {
                    // Redirect to signup with email pre-filled
                    router.push(`/signup?email=${encodeURIComponent(email)}&from=login`);
                    return;
                }
                throw signInError;
            }

            if (user) {
                // Successfully logged in - redirect to dashboard
                router.push(returnTo);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to sign in. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">SC</span>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                    Welcome back
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Sign in to your SmartCard account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardBody className="py-8 px-6 sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <Alert variant="error">
                                    {error}
                                </Alert>
                            )}

                            <Input
                                label="Email address"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />

                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                                <div className="mt-2 text-right">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                size="lg"
                            >
                                Sign In
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/signup"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardBody>
                </Card>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
