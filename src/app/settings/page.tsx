'use client';

import { useRouter } from 'next/navigation';
import { AppTopbar } from '@/components/navigation/AppTopbar';
import { SettingsTab } from '@/components/organisms/SettingsTab';
import { createClient } from '@/lib/supabaseClient';

export default function SettingsPage() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div>
            <AppTopbar title="Settings" subtitle="Manage your account and preferences" />
            <main className="max-w-4xl mx-auto p-6">
                <SettingsTab onLogout={handleLogout} />
            </main>
        </div>
    );
}
