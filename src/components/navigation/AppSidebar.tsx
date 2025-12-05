"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Users, Settings, HelpCircle } from "lucide-react"

const navItems = [
    { href: "/mycards", icon: CreditCard, label: "Cards" },
    { href: "/leads", icon: Users, label: "Leads" },
]

const bottomNavItems = [
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/help", icon: HelpCircle, label: "Help" },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-20 flex flex-col bg-sidebar border-r border-sidebar-border">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
                <Link href="/mycards" className="flex items-center justify-center">
                    <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-sidebar-primary-foreground" />
                    </div>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 flex flex-col items-center gap-2 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                ${isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                }
              `}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5" />
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="flex flex-col items-center gap-2 py-4 border-t border-sidebar-border">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                ${isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                }
              `}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5" />
                        </Link>
                    )
                })}

                {/* User Avatar Placeholder */}
                <button
                    className="mt-2 p-1 rounded-full ring-2 ring-sidebar-border hover:ring-sidebar-primary transition-all"
                    title="Profile"
                >
                    <div className="w-10 h-10 rounded-full bg-sidebar-accent text-sidebar-foreground flex items-center justify-center text-sm font-semibold">
                        JD
                    </div>
                </button>
            </div>
        </aside>
    )
}
