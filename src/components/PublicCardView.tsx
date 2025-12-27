'use client';

import React, { useState } from 'react';
import { CardPreview } from './CardPreview';
import { LeadCaptureModal } from '@/components/organisms/LeadCaptureModal';
import type { Card } from '@/lib/api/types';

interface PublicCardViewProps {
    card: Card;
}

/**
 * Client component wrapper for public card view
 * Uses the card's saved theme to render the custom design
 */
export function PublicCardView({ card }: PublicCardViewProps) {
    const [showLeadModal, setShowLeadModal] = useState(false);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
            style={{ backgroundColor: 'transparent' }}
        >
            <div className="w-full max-w-md">
                <CardPreview
                    card={card}
                    theme={card.theme}
                    isPublicView={true}
                    onSave={() => setShowLeadModal(true)}
                    disableFlip={true}
                />
            </div>

            <LeadCaptureModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                card={card}
            />
        </div>
    );
}
