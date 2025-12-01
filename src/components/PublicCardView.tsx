'use client';

import { CardPreview } from './CardPreview';
import type { Card } from '@/lib/api/types';

interface PublicCardViewProps {
    card: Card;
}

/**
 * Client component wrapper for public card view
 * Uses the card's saved theme to render the custom design
 */
export function PublicCardView({ card }: PublicCardViewProps) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
            <CardPreview card={card} theme={card.theme} />
        </div>
    );
}

