'use client';

import React, { useState } from 'react';
import { Copy, Download, Share2, Check, Eye } from 'lucide-react';
import { Button } from '@/components/molecules/Button';
import { QRCodeDisplay } from '@/components/molecules/QRCodeDisplay';
import useSWR from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';

const fetcher = (url: string) => apiClient.get<any>(url);

interface ShareTabProps {
  cardId?: string;
}

export function ShareTab({ cardId }: ShareTabProps) {
  const { data: cards } = useSWR<Card[]>('/api/v1/cards/user', fetcher);
  const { data: specificCard } = useSWR<Card>(
    cardId ? `/api/v1/cards/${cardId}` : null,
    fetcher
  );

  // Use specific card if cardId is provided, otherwise fall back to first card
  const currentCard = cardId ? specificCard : (cards && cards.length > 0 ? cards[0] : null);

  const [copied, setCopied] = useState(false);
  const [showBranding, setShowBranding] = useState(true);

  // Generate the profile URL based on the card slug
  const profileUrl = currentCard
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${currentCard.slug}`
    : 'https://smartcard.app/your-card';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `smartcard-${currentCard?.slug || 'qr'}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${currentCard?.name || 'My'} - Digital Business Card`,
          text: `Check out my digital business card!`,
          url: profileUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
      <h3 className="text-2xl font-bold mb-8 text-foreground">Share Your Card</h3>

      {!currentCard ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Share2 className="w-8 h-8 text-accent" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Create Your Card First</h4>
          <p className="text-muted-foreground mb-6">
            Complete your card information in the "My Card" tab to get your shareable link.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block mb-3 px-1 text-sm font-medium text-foreground-secondary">Your Unique Link</label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-muted rounded-2xl border-2 border-border text-muted-foreground overflow-hidden">
                <p className="truncate">{profileUrl}</p>
              </div>
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2 px-1">✓ Link copied to clipboard!</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={handleShare} variant="primary" size="lg" fullWidth>
              <Share2 className="w-5 h-5 mr-2" />
              Share Card
            </Button>
            <Button
              onClick={() => window.open(profileUrl, '_blank')}
              variant="outline"
              size="lg"
              fullWidth
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview Card
            </Button>
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="text-lg font-semibold mb-4 text-foreground">QR Code</h4>
            <div className="max-w-xs mx-auto">
              <QRCodeDisplay url={profileUrl} />
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                size="lg"
                fullWidth
                className="mt-4"
              >
                <Download className="w-5 h-5 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
              <div>
                <p className="text-sm font-medium text-foreground">Show SmartCard Branding</p>
                <p className="text-xs text-muted-foreground mt-1">Remove with Pro plan</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBranding}
                  onChange={(e) => setShowBranding(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20">
            <h4 className="text-lg font-semibold mb-2 text-foreground">Track Your Card Performance</h4>
            <p className="text-muted-foreground mb-4">
              See who views your card, track link clicks, and get detailed analytics with Pro.
            </p>
            <button className="px-6 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium">
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

