// src/app/dashboard/layout.tsx
/**
 * Dashboard Layout
 * 
 * Wraps all dashboard pages with:
 * 1. AuthGuard - ensures user is logged in
 * 2. Nav - main navigation bar
 * 3. Container - consistent spacing
 */

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Nav } from '@/components/layout/Nav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Nav />
                <main className="py-10">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
