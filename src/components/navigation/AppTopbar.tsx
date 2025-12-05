"use client"

import { Bell, Search } from "lucide-react"

interface AppTopbarProps {
    title: string
    subtitle?: string
}

export function AppTopbar({ title, subtitle }: AppTopbarProps) {
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
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-xl hover:bg-accent flex items-center justify-center transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">john@example.com</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        JD
                    </div>
                </div>
            </div>
        </header>
    )
}
