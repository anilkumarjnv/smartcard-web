'use client';

import { useState, useEffect } from 'react';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Navbar } from '@/components/organisms/Navbar';
import { AuthModal } from '@/components/auth/AuthModal';
import { apiClient } from '@/lib/apiClient';

export default function ProfileCardDemo() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
    const [betaStatus, setBetaStatus] = useState<{
        isBetaMode: boolean;
        limitReached: boolean;
        spotsRemaining: number;
        maxUsers: number | null;
    } | null>(null);

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
        }
    }

    const openLogin = () => {
        setAuthMode('login');
        setIsAuthModalOpen(true);
    };

    const openSignup = () => {
        if (betaStatus?.isBetaMode && betaStatus.limitReached) {
            window.location.href = '/beta-limit';
            return;
        }
        setAuthMode('signup');
        setIsAuthModalOpen(true);
    };

    // Example user data for demo
    const exampleUser = {
        name: 'Alex Morgan',
        role: 'Product Designer',
        company: 'Design Studio',
        location: 'San Francisco, CA',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop',
        about: 'Creating delightful digital experiences with a focus on user-centered design and accessibility.',
        contact: {
            email: 'alex@designstudio.com',
            phone: '+1 (555) 123-4567',
            linkedin: 'https://linkedin.com/in/alexmorgan',
            website: 'https://alexmorgan.design',
        },
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <Navbar
                isLandingPage={true}
                onLoginClick={openLogin}
                onSignupClick={openSignup}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultMode={authMode}
            />

            <div className="max-w-7xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                        Profile Card Theme Showcase
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Professional digital identity cards with background image design and shape-based theming.
                        Choose your preferred style.
                    </p>
                </div>

                {/* Theme Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Light Theme */}
                    <div>
                        <div className="mb-4 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                Light Theme
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Professional & trustworthy. Perfect for LinkedIn and recruiters.
                            </p>
                        </div>
                        <ProfileCard user={exampleUser} theme="light" disableFlip={true} disableInteractions={true} />
                    </div>

                    {/* Dark Theme */}
                    <div>
                        <div className="mb-4 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                Dark Theme
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Premium & sophisticated. Modern and eye-catching.
                            </p>
                        </div>
                        <ProfileCard user={exampleUser} theme="dark" disableFlip={true} disableInteractions={true} />
                    </div>

                    {/* Accent Theme */}
                    <div>
                        <div className="mb-4 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                Brand Accent
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Distinctive & creative. Shows personality while staying professional.
                            </p>
                        </div>
                        <ProfileCard user={exampleUser} theme="accent" disableFlip={true} disableInteractions={true} />
                    </div>
                </div>


            </div>
        </div>
    );
}
