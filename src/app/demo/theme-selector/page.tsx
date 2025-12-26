'use client';

import { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { ThemeSelector } from '@/components/profile/ThemeSelector';
import { ProfileCard } from '@/components/profile/ProfileCard';

export default function ThemeSelectorDemo() {
    const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'accent'>('light');

    // Example user data
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
            <Navbar variant="dashboard" />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                        Choose Your Profile Theme
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Select the theme that best represents your professional brand.
                        See your card update in real-time.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Theme Selector */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
                        <ThemeSelector
                            selectedTheme={selectedTheme}
                            onThemeChange={setSelectedTheme}
                        />
                    </div>

                    {/* Live Preview */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                Live Preview
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                This is how your card will look to others
                            </p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg p-6 flex items-center justify-center min-h-[600px]">
                            <div className="w-full max-w-md">
                                <ProfileCard user={exampleUser} theme={selectedTheme} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                            Background Image
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Your photo as a full-width hero, not a circular avatar. Creates immediate visual impact.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                            Shape Theming
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Smooth wave dividers add visual personality while maintaining professional hierarchy.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                            Mobile Optimized
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Perfect for QR scan landing pages with large tap targets and responsive design.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
