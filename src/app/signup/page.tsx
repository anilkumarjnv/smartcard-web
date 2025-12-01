// src/app/signup/page.tsx
/**
 * Sign Up Page
 * 
 * Email and password registration form.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail, isAuthenticated } from '@/lib/auth';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function SignUpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/dashboard';
    const prefillEmail = searchParams.get('email') || '';
    const fromLogin = searchParams.get('from') === 'login';

    const [email, setEmail] = useState(prefillEmail);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const { error: signUpError, user } = await signUpWithEmail(email, password);

            if (signUpError) {
                throw signUpError;
            }

            if (user) {
                setSuccess(true);
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push(returnTo);
                }, 2000);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to create account. Please try again.');
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
                    Create your account
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Start building your digital business cards
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardBody className="py-8 px-6 sm:px-10">
                        {fromLogin && (
                            <Alert variant="error" className="mb-6">
                                <p className="text-sm">
                                    Account not found. Create a new account to get started.
                                </p>
                            </Alert>
                        )}
                        {success ? (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Account created!</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Redirecting you to your dashboard...
                                </p>
                            </div>
                        ) : (
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

                                <Input
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    helperText="Must be at least 6 characters"
                                />

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={isLoading}
                                    size="lg"
                                >
                                    Create Account
                                </Button>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link
                                            href="/login"
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        )}
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

