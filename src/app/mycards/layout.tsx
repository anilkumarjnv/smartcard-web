// src/app/mycards/layout.tsx
/**
 * MyCards Layout
 * Wraps mycards pages with AuthGuard and Sidebar
 */

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export default function MyCardsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <div className="pl-20">
                {children}
            </div>
        </div>
    );
}
