'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreditCard, Users, LogOut, Settings } from 'lucide-react';
import { Button } from '../molecules/Button';
import { getCurrentUser, signOut } from '@/lib/auth';
import type { AuthUser } from '@/lib/api/types';

export function Sidebar() {
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

    const navItems = [
        {
            label: 'My Cards',
            href: '/mycards',
            icon: CreditCard,
        },
        {
            label: 'Leads',
            href: '/leads',
            icon: Users,
        },
        {
            label: 'Settings',
            href: '/settings',
            icon: Settings,
        },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/mycards" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl font-bold">S</span>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">Cardfil</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-neutral-100 text-neutral-900'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-neutral-900'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Sign Out */}
            <div className="p-4 border-t border-gray-200">
                {isLoading ? (
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                        </div>
                    </div>
                ) : user ? (
                    <>
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user.email?.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </Button>
                    </>
                ) : null}
            </div>
        </aside>
    );
}

