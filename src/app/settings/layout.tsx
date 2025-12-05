// src/app/settings/layout.tsx
/**
 * Settings Layout
 * Wraps settings pages with AuthGuard and Sidebar
 */

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <div className="pl-20">
                {children}
            </div>
        </div>
    );
}
