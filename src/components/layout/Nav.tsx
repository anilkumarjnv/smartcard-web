// src/components/Nav.tsx
/**
 * Navigation Component
 * 
 * Main navigation bar with authentication state.
 * Shows different links for authenticated vs unauthenticated users.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { getCurrentUser, signOut } from '@/lib/auth';
import type { AuthUser } from '@/lib/api/types';

export function Nav() {
    const pathname = usePathname();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);
        }

        loadUser();
    }, []);

    async function handleSignOut() {
        await signOut();
        setUser(null);
        window.location.href = '/';
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                        <span className="text-xl font-bold text-gray-900">SmartCard</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm font-medium transition-colors ${pathname.startsWith('/dashboard')
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/cards"
                                    className={`text-sm font-medium transition-colors ${pathname.startsWith('/dashboard/cards')
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    My Cards
                                </Link>
                                <Link
                                    href="/dashboard/leads"
                                    className={`text-sm font-medium transition-colors ${pathname.startsWith('/dashboard/leads')
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    Leads
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="#features"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="#pricing"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Pricing
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {isLoading ? (
                            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
                        ) : user ? (
                            <div className="flex items-center space-x-3">
                                <Link href="/dashboard">
                                    <Avatar src={user.avatar_url as string} name={user.email} size="sm" />
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="primary" size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
