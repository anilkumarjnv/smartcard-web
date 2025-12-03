// src/app/mycards/layout.tsx
/**
 * MyCards Layout
 * Wraps mycards pages with AuthGuard and Sidebar
 */

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';

export default function MyCardsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
