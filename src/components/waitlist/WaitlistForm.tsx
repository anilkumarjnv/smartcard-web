'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';

export default function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            await apiClient.postPublic('/api/v1/waitlist', {
                email,
                source: 'beta_limit_page'
            });
            setStatus('success');
            // Don't clear email immediately in case they want to see it
        } catch (error: any) {
            console.error('Waitlist error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg text-sm text-center animate-in fade-in zoom-in duration-300">
                <p className="font-semibold text-base mb-1">You're on the list!</p>
                <p>We'll notify you at <span className="font-medium">{email}</span> primarily.</p>
                <button
                    onClick={() => {
                        setStatus('idle');
                        setEmail('');
                    }}
                    className="text-xs underline mt-3 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                >
                    Add another email
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
            <div className="flex flex-col gap-3">
                <label className="sr-only" htmlFor="waitlist-email">Email address</label>
                <input
                    id="waitlist-email"
                    type="email"
                    required
                    placeholder="Enter your email to join waitlist"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-all placeholder:text-muted-foreground"
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                    {status === 'loading' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Joining...</span>
                        </>
                    ) : (
                        <span>Join Waitlist</span>
                    )}
                </button>
            </div>
            {status === 'error' && (
                <p className="text-red-500 text-sm mt-3 text-center animate-in slide-in-from-top-1">{errorMessage}</p>
            )}
        </form>
    );
}
