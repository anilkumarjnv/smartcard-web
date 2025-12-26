'use client';

import { ProfileCard } from '@/components/profile/ProfileCard';
import type { ProfileCardShape } from '@/components/profile/ShapeSelector';
import type { Card } from '@/lib/api/types';

interface CardPreviewProps {
    card: Partial<Card>;
    theme?: Record<string, unknown>;
    isPublicView?: boolean;
}

export interface ProfileCardTheme {
    name: 'light' | 'dark' | 'accent' | 'neutral';
    displayName: string;
    description: string;
}

export const PROFILE_THEMES: ProfileCardTheme[] = [
    {
        name: 'light',
        displayName: 'Professional Light',
        description: 'Clean and trustworthy. Perfect for LinkedIn and recruiters.',
    },
    {
        name: 'dark',
        displayName: 'Premium Dark',
        description: 'Sophisticated and modern. Eye-catching premium aesthetic.',
    },
    {
        name: 'accent',
        displayName: 'Brand Accent',
        description: 'Distinctive and creative. Shows personality while staying professional.',
    },
    {
        name: 'neutral',
        displayName: 'Minimalist Neutral',
        description: 'Ultra-clean monochrome. Timeless and distraction-free elegance.',
    },
];

/**
 * New CardPreview using the professional ProfileCard design
 * with background image and shape theming
 */
export function CardPreview({ card, theme, isPublicView = false }: CardPreviewProps) {
    // Determine theme from card data
    const selectedTheme = (theme?.profileTheme as 'light' | 'dark' | 'accent' | 'neutral') || 'light';

    // Determine shape from card data  
    const selectedShape = (theme?.shape as ProfileCardShape) || 'wave';

    // Use photo_url with fallback to avatar_url
    const photoUrl = card.photo_url || card.avatar_url || '';

    // Transform card data to ProfileCard format
    const userProfile = {
        name: card.name || 'Your Name',
        role: card.title || 'Your Title',
        company: card.company || 'Your Company',
        location: '', // Location field to be added in future
        photo: photoUrl,
        about: card.about,
        contact: {
            email: card.email || '',
            phone: card.phone,
            linkedin: card.social_links?.linkedin,
            website: card.website,
        },
    };

    return (
        <div className="w-full h-full overflow-auto flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
            <ProfileCard
                user={userProfile}
                theme={selectedTheme}
                shape={selectedShape}
                cardId={card.id}
            />
        </div>
    );
}
