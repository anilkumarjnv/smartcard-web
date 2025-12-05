// src/app/leads/layout.tsx
import { ReactNode } from 'react';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export default function LeadsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <div className="pl-20">
                {children}
            </div>
        </div>
    );
}
