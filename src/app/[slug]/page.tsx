// src/app/[slug]/page.tsx
/**
 * Public Card Page (Server Component)
 * 
 * Professional digital business card with all contact details.
 * Server-renders for SEO optimization.
 */

import { notFound } from 'next/navigation';
import { apiClient, APIClient } from '@/lib/apiClient';
import { CardViewClient } from '@/components/CardViewClient';
import { PublicCardView } from '@/components/PublicCardView';
import type { Card } from '@/lib/api/types';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Server-side fetch for card data
async function getCard(slug: string): Promise<Card | null> {
  try {
    const client = new APIClient();
    const card = await client.get<Card>(`/api/v1/cards/slug/${slug}`);
    return card;
  } catch (error) {
    console.error('Failed to fetch card:', error);
    return null;
  }
}

export default async function PublicCardPage({ params }: PageProps) {
  const { slug } = await params;
  const card = await getCard(slug);

  if (!card || !card.is_published) {
    notFound();
  }

  return (
    <>
      {/* Track view - client component */}
      <CardViewClient slug={slug} />

      {/* Render card with custom theme */}
      <PublicCardView card={card} />
    </>
  );
}

// Generate static metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const card = await getCard(slug);

  if (!card) {
    return {
      title: 'Card Not Found',
    };
  }

  return {
    title: `${card.name}${card.title ? ` - ${card.title}` : ''} | SmartCard`,
    description: card.about || card.title || `Digital business card for ${card.name}`,
    openGraph: {
      title: `${card.name}${card.company ? ` @ ${card.company}` : ''}`,
      description: card.about || `Connect with ${card.name}`,
      images: card.photo_url || card.avatar_url ? [card.photo_url || card.avatar_url!] : [],
    },
  };
}
