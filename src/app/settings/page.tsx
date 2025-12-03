'use client';

import { useRouter } from 'next/navigation';
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
        <main className="max-w-4xl mx-auto">
            <SettingsTab onLogout={handleLogout} />
        </main>
    );
}
