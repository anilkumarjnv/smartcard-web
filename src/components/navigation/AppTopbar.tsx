"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/apiClient"
import { useTheme } from "next-themes"

interface AppTopbarProps {
    title: string
    subtitle?: string
}

export function AppTopbar({ title, subtitle }: AppTopbarProps) {
    const [user, setUser] = useState<any>(null)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        setImgError(false)
    }, [user])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.get<any>('/api/v1/auth/me');
                setUser(userData);
            } catch (err) {
                console.error("Failed to load user profile", err);
            }
        };
        loadUser();
    }, [])

    // Backend returns flattened metadata: { id, email, full_name, avatar_url, ... }
    // Fallback to defaults if missing
    const userName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'User'
    const userEmail = user?.email || ''
    const userInitials = userName.substring(0, 2).toUpperCase()
    const userAvatar = user?.avatar_url || user?.picture

    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                {/* <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        placeholder="Search..."
                        className="pl-10 w-64 h-10 bg-secondary border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        suppressHydrationWarning
                    />
                </div> */}

                {/* Dark Mode Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-neutral-900 dark:text-neutral-100" strokeWidth={2} />
                        ) : (
                            <Moon className="w-4 h-4 text-neutral-900 dark:text-neutral-100" strokeWidth={2} />
                        )}
                    </button>
                )}

                {/* Notifications */}
                {/* <button className="relative w-10 h-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-center transition-colors" suppressHydrationWarning>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button> */}

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold overflow-hidden">
                        {userAvatar && !imgError ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            userInitials
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
