'use client';

import { ProfileCard } from '@/components/profile/ProfileCard';
import { Navbar } from '@/components/organisms/Navbar';

export default function ProfileCardDemo() {
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
            <Navbar variant="dashboard" />

            <div className="max-w-7xl mx-auto px-6 py-12">
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
                        <ProfileCard user={exampleUser} theme="light" />
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
                        <ProfileCard user={exampleUser} theme="dark" />
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
                        <ProfileCard user={exampleUser} theme="accent" />
                    </div>
                </div>

                {/* Design Features */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
                        Design Features
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                ✓ Background Image as Hero
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Full-width professional photo creates immediate visual impact, not a circular avatar.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                ✓ Shape-Based Theming
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Smooth wave dividers add visual personality while maintaining hierarchy.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                ✓ Professional Structure
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Three clear sections: Identity header, professional details, and action links.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                                ✓ Mobile Optimized
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Large tap targets and responsive design for perfect QR scan landing pages.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
