'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { PricingSection } from '@/components/landing/PricingSection';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';

export default function SubscriptionPage() {
    const { user, isLoading } = useSubscription();

    if (isLoading) {
        return (
            <Container>
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="py-6 sm:py-8">
                <PricingSection user={user} onLoginClick={() => { }} />
            </div>
        </Container>
    );
}
