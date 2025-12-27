import { AppTopbar } from '@/components/navigation/AppTopbar';
import { SettingsTab } from '@/components/organisms/SettingsTab';

export default function SettingsPage() {
    return (
        <div>
            <AppTopbar title="Settings" subtitle="Manage your account and preferences" />
            <main className="max-w-4xl mx-auto p-6">
                <SettingsTab />
            </main>
        </div>
    );
}


