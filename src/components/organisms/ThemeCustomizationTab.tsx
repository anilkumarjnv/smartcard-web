'use client';

import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';
import { ThemeSelector } from '@/components/profile/ThemeSelector';
import { ShapeSelector, type ProfileCardShape } from '@/components/profile/ShapeSelector';

interface ThemeCustomizationTabProps {
  cardId?: string;
  onThemeUpdate?: (theme: Record<string, unknown>) => void;
}

const fetcher = (url: string) => apiClient.get<any>(url);

export function ThemeCustomizationTab({ cardId, onThemeUpdate }: ThemeCustomizationTabProps) {
  const { data: cards } = useSWR<Card[]>('/api/v1/cards/user', fetcher);
  const { data: specificCard } = useSWR<Card>(
    cardId ? `/api/v1/cards/${cardId}` : null,
    fetcher
  );

  // Use specific card if cardId is provided, otherwise fall back to first card
  const currentCard = cardId ? specificCard : (cards && cards.length > 0 ? cards[0] : null);

  // Theme state using new simple format
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'accent' | 'neutral'>('light');
  const [selectedShape, setSelectedShape] = useState<ProfileCardShape>('wave');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize theme and shape from card data
  useEffect(() => {
    if (currentCard && currentCard.theme) {
      const theme = currentCard.theme as Record<string, unknown>;

      // Check if it's the new format with profileTheme
      if (theme.profileTheme) {
        setSelectedTheme(theme.profileTheme as 'light' | 'dark' | 'accent' | 'neutral');
      }
      // Default to light theme for legacy cards
      else {
        setSelectedTheme('light');
      }

      // Initialize shape
      if (theme.shape) {
        setSelectedShape(theme.shape as ProfileCardShape);
      } else {
        setSelectedShape('wave');
      }
    }
  }, [currentCard]);

  // Send initial theme and shape to parent in create mode
  useEffect(() => {
    if (!currentCard && onThemeUpdate) {
      onThemeUpdate({
        profileTheme: selectedTheme,
        shape: selectedShape,
      });
    }
  }, []); // Only run once on mount

  const handleThemeChange = async (theme: 'light' | 'dark' | 'accent' | 'neutral') => {
    setSelectedTheme(theme);
    await saveThemeAndShape(theme, selectedShape);
  };

  const handleShapeChange = async (shape: ProfileCardShape) => {
    setSelectedShape(shape);
    await saveThemeAndShape(selectedTheme, shape);
  };

  const saveThemeAndShape = async (theme: 'light' | 'dark' | 'accent' | 'neutral', shape: ProfileCardShape) => {
    const updatedTheme = {
      profileTheme: theme,
      shape: shape,
    };

    // If there's no card (create mode), just notify parent for preview
    if (!currentCard) {
      if (onThemeUpdate) {
        onThemeUpdate(updatedTheme);
      }
      return;
    }

    // If there's a card, save it to the backend
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await apiClient.patch(
        `/api/v1/cards/${currentCard.id}`,
        { theme: updatedTheme }
      );

      // Refresh the cards list
      mutate('/api/v1/cards/user');

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Notify parent component for live preview update
      if (onThemeUpdate) {
        onThemeUpdate(updatedTheme);
      }
    } catch (err) {
      console.error('Error saving theme:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
      <h3 className="text-2xl font-bold mb-2 text-foreground">Customize Theme</h3>
      <p className="text-muted-foreground mb-8">Choose a professional theme for your digital profile card</p>

      <div className="space-y-8">
        {/* New Theme Selector */}
        <div>
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        </div>

        {/* Shape Selector */}
        <div className="border-t border-border pt-8">
          <ShapeSelector
            selectedShape={selectedShape}
            onShapeChange={handleShapeChange}
          />
        </div>

        {/* Theme Features */}
        <div className="border-t border-border pt-8">
          <h4 className="text-lg font-semibold mb-4 text-foreground">Theme Features</h4>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-neutral-800/50 rounded-xl">
              <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h5 className="font-medium text-foreground">Background Image Hero</h5>
                <p className="text-sm text-muted-foreground">Your profile photo serves as an editorial-style header</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-neutral-800/50 rounded-xl">
              <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <div>
                <h5 className="font-medium text-foreground">Wave Shape Dividers</h5>
                <p className="text-sm text-muted-foreground">Smooth, professional transitions between sections</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 dark:bg-neutral-800/50 rounded-xl">
              <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <h5 className="font-medium text-foreground">Mobile Optimized</h5>
                <p className="text-sm text-muted-foreground">Perfect for sharing via NFC, QR codes, and messaging apps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saving/Success indicators */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
            Saving theme...
          </div>
        )}

        {saveSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Theme saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}
