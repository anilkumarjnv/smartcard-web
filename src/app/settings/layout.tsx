// src/app/settings/layout.tsx
/**
 * Settings Layout
 * Wraps settings pages with AuthGuard and Sidebar
 */

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { AppHeader } from '@/components/navigation/AppHeader';

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <div className="md:pr-20 lg:pr-0 lg:pl-20">
                <AppHeader />
                {children}
            </div>
        </div>
    );
}
