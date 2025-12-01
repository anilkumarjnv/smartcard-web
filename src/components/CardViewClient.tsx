'use client';

import { useEffect } from 'react';
import { recordView } from '@/lib/api/views';

interface CardViewClientProps {
    slug: string;
}

export function CardViewClient({ slug }: CardViewClientProps) {
    useEffect(() => {
        // Track view using the recordView function
        recordView({ 
            slug, 
            referrer: typeof document !== 'undefined' ? document.referrer : undefined 
        }).catch((err) => {
            console.error('Failed to track view', err);
        });
    }, [slug]);

    return null;
}
