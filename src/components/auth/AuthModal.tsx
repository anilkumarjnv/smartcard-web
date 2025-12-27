'use client';

import React from 'react';
import { X } from 'lucide-react';
import { OAuthButton } from './OAuthButton';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = React.useState<'login' | 'signup'>(defaultMode);

    React.useEffect(() => {
        if (isOpen) {
            setMode(defaultMode);
        }
    }, [isOpen, defaultMode]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden pointer-events-auto border border-neutral-200 dark:border-neutral-800"
                        >
                            {/* Close Button */}
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">
                                        {mode === 'login' ? 'Welcome back' : 'Create an account'}
                                    </h2>
                                    <p className="text-neutral-500 dark:text-neutral-400">
                                        {mode === 'login'
                                            ? 'Sign in to manage your professional profile'
                                            : 'Get started with your digital business card'}
                                    </p>
                                </div>

                                {/* OAuth Button */}
                                <OAuthButton provider="google" />

                                {/* Terms */}
                                <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                                    By continuing, you agree to our{' '}
                                    <a href="/terms" className="underline hover:text-neutral-900 dark:hover:text-neutral-200">
                                        Terms
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="underline hover:text-neutral-900 dark:hover:text-neutral-200">
                                        Privacy Policy
                                    </a>
                                </p>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase tracking-wider">
                                        <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                                            Or
                                        </span>
                                    </div>
                                </div>

                                {/* Mode Toggle */}
                                <div className="text-center">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                        <button
                                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                            className="font-semibold text-neutral-900 dark:text-white hover:underline"
                                        >
                                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
