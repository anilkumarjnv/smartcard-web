"use client"

import { useState, useEffect } from "react"
import { CreditCard, Crown, Bell, MapPin } from "lucide-react"
import Link from "next/link"
import { useSubscription } from "@/hooks/useSubscription"

export function AppHeader() {
    const { isFounder, user } = useSubscription();
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 18) return "Good Afternoon"
        return "Good Evening"
    }

    // Safely extract first name with type assertions
    const fullName = (user as any)?.full_name as string | undefined;
    const name = (user as any)?.name as string | undefined;
    const firstName = fullName?.split(' ')?.[0] || name?.split(' ')?.[0] || 'User';

    return (
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left: Title */}
                <Link
                    href="/mycards"
                    className="flex items-center justify-center"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight">Cardfil</span>
                    </div>
                </Link>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Founder Badge (Desktop) */}
                    {isFounder && (
                        <div
                            className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 border border-amber-300 dark:border-amber-700/50 rounded-full shadow-sm cursor-help transition-all hover:scale-105"
                            title="Founding Member · Early supporter of Cardfil"
                        >
                            <Crown className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 fill-amber-600/20" />
                            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                                Founder
                            </span>
                        </div>
                    )}

                    {/* User Profile Section */}
                    <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-border">
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center justify-end gap-2">
                                <p className="text-sm font-bold text-foreground">
                                    {mounted ? `${getGreeting()}, ${firstName}` : 'Loading...'}
                                </p>
                            </div>

                            {/* Subtitle / Founder Status */}
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                {isFounder ? (
                                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <Crown className="w-2.5 h-2.5 fill-amber-600/20" />
                                        Founding Member
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
                            {mounted && ((user as any)?.avatar_url || (user as any)?.picture) ? (
                                <img
                                    src={(user as any)?.avatar_url || (user as any)?.picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                                    {mounted && (fullName || name || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
