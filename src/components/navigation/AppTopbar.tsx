"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"
import { useTheme } from "next-themes"

interface AppTopbarProps {
    title: string
    subtitle?: string
}

export function AppTopbar({ title, subtitle }: AppTopbarProps) {
    const [user, setUser] = useState<User | null>(null)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const supabase = createClient()

        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const userEmail = user?.email || ''
    const userInitials = userName.substring(0, 2).toUpperCase()
    const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        placeholder="Search..."
                        className="pl-10 w-64 h-10 bg-secondary border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        suppressHydrationWarning
                    />
                </div>

                {/* Dark Mode Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-10 h-10 rounded-xl hover:bg-accent flex items-center justify-center transition-colors"
                        aria-label="Toggle theme"
                        suppressHydrationWarning
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                )}

                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-xl hover:bg-accent flex items-center justify-center transition-colors" suppressHydrationWarning>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold overflow-hidden">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-full h-full object-cover"
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
