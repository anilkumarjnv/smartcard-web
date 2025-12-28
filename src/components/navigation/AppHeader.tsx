"use client"

import { CreditCard } from "lucide-react"

export function AppHeader() {
    return (
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground tracking-tight">SmartCard</span>
                </div>
            </div>
        </header>
    )
}
