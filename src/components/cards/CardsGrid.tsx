"use client"

import { useState } from "react"
import { Plus, MoreVertical, Edit, Trash2, Copy, QrCode, BarChart3 } from "lucide-react"
import { SmartCard } from "./SmartCard"
import Link from "next/link"

interface Card {
    id: string
    name: string
    title?: string
    company?: string
    email?: string
    phone?: string
    website?: string
    location?: string
    category: "personal" | "work" | "student"
    socials?: {
        linkedin?: string
        twitter?: string
        github?: string
    }
}

interface CardsGridProps {
    cards: Card[]
}

export function CardsGrid({ cards }: CardsGridProps) {
    const [menuOpen, setMenuOpen] = useState<string | null>(null)

    return (
        <div className="space-y-6">
            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Upgrade to Pro</h2>
                        <p className="text-primary-foreground/80 mt-1">
                            Unlock unlimited cards, custom domains, and advanced analytics.
                        </p>
                    </div>
                    <button className="shrink-0 px-6 py-2.5 bg-card text-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.id} className="relative group">
                        <SmartCard {...card} />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setMenuOpen(menuOpen === card.id ? null : card.id)}
                                className="w-10 h-10 rounded-xl bg-card shadow-md flex items-center justify-center hover:bg-accent transition-colors"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                            {menuOpen === card.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-10">
                                    <Link
                                        href={`/mycards?tab=card&cardId=${card.id}`}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Card
                                    </Link>
                                    <Link
                                        href={`/mycards/analytics/${card.id}`}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        Analytics
                                    </Link>
                                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                                        <Copy className="w-4 h-4" />
                                        Duplicate
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                                        <QrCode className="w-4 h-4" />
                                        View QR Code
                                    </button>
                                    <div className="border-t border-border" />
                                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* New Card Button */}
                <Link href="/mycards?tab=card&mode=create">
                    <button className="min-h-[400px] w-full rounded-3xl border-2 border-dashed border-border hover:border-primary bg-card/50 hover:bg-card transition-all duration-300 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="font-medium">Create New Card</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}
