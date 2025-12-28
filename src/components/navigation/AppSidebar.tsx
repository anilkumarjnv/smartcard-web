"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { CreditCard, Users, Settings, HelpCircle, Menu, X, Sun, Moon, LogOut } from "lucide-react"
import { apiClient } from "@/lib/apiClient"
import { signOut } from "@/lib/auth"

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const handleSignOut = async () => {
        try {
            await signOut() // Clear local session
            await apiClient.post('/api/v1/auth/logout', {}) // Notify backend
        } catch (err) {
            console.error('Logout error', err)
        }
        window.location.href = '/'
    }

    // Fetch user data
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.get<any>('/api/v1/auth/me')
                setUser(userData)
            } catch (err) {
                console.error('Failed to load user in AppSidebar', err)
            }
        }
        loadUser()
    }, [])

    return (
        <>
            {/* Mobile Menu Button - Top-right on mobile, hidden on large screens */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed right-4 top-4 z-50 w-10 h-10 rounded-lg bg-sidebar border border-sidebar-border flex items-center justify-center hover:bg-sidebar-accent transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-sidebar-foreground" />
                ) : (
                    <Menu className="w-5 h-5 text-sidebar-foreground" />
                )}
            </button>

            {/* Mobile Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar - Right on mobile/tablet, Left on large screens */}
            <aside
                className={`
                    fixed top-0 z-40 h-screen w-20 flex flex-col bg-sidebar border-sidebar-border
                    transition-transform duration-300 ease-in-out
                    right-0 border-l lg:right-auto lg:left-0 lg:border-r lg:border-l-0
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
                    <Link
                        href="/mycards"
                        className="flex items-center justify-center"
                        onClick={closeMobileMenu}
                    >
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
                                onClick={closeMobileMenu}
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                                    ${isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                                        : "text-white lg:text-black lg:dark:text-white hover:bg-sidebar-accent"
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
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 text-white lg:text-black lg:dark:text-white hover:bg-sidebar-accent"
                        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                                    ${isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-white lg:text-black lg:dark:text-white hover:bg-sidebar-accent"
                                    }
                                `}
                                title={item.label}
                            >
                                <item.icon className="w-5 h-5" />
                            </Link>
                        )
                    })}

                    {/* User Avatar */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="mt-2 p-1 rounded-full ring-2 ring-sidebar-border hover:ring-sidebar-primary transition-all"
                            title={user ? user.full_name || user.name || user.email?.split('@')[0] || "Profile" : "Profile"}
                            suppressHydrationWarning
                        >
                            <div className="w-10 h-10 rounded-full bg-sidebar-accent text-sidebar-foreground flex items-center justify-center text-sm font-semibold overflow-hidden">
                                {user?.avatar_url || user?.picture ? (
                                    <img
                                        src={user.avatar_url || user.picture}
                                        alt={user.full_name || user.name || user.email?.split('@')[0] || 'User'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-medium">
                                        {user ? (user.full_name || user.name || user.email?.split('@')[0] || 'U').substring(0, 2).toUpperCase() : 'U'}
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* User Menu Dropdown */}
                        {showUserMenu && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-50"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                {/* Menu */}
                                <div className="absolute bottom-full right-0 lg:left-0 lg:right-auto mb-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-destructive"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}
