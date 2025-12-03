'use client';

import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';
import { StyleSelector } from '@/components/StyleSelector';
import { ColorPaletteSelector } from '@/components/ColorPaletteSelector';
import { FontSelector } from '@/components/FontSelector';
import { type CardStyle, getCardStyle, buildTheme } from '@/lib/themes';

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

  // Theme state using proper structure
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('classic');
  const [selectedPaletteId, setSelectedPaletteId] = useState('classicBlue');
  const [selectedFontId, setSelectedFontId] = useState('inter');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize theme from card data
  useEffect(() => {
    if (currentCard && currentCard.theme) {
      const theme = currentCard.theme as Record<string, unknown>;

      // Check if it's the new format
      if (theme.style) {
        setSelectedStyle(theme.style as CardStyle);
        setSelectedPaletteId((theme.colorPalette as string) || 'classicBlue');
        setSelectedFontId((theme.fontId as string) || 'inter');
      }
      // Legacy format conversion
      else if (theme.colorScheme || theme.layout) {
        // Map old colorScheme to style
        const legacySchemeToStyle: Record<string, CardStyle> = {
          'indigo': 'classic',
          'purple': 'modern',
          'blue': 'classic',
          'green': 'elegant',
          'rose': 'bold',
          'slate': 'minimal'
        };

        const style = legacySchemeToStyle[theme.colorScheme as string] || 'classic';
        setSelectedStyle(style);

        // Set default palette for the style
        const styleConfig = getCardStyle(style);
        setSelectedPaletteId(styleConfig.colorPalettes[0].id);
        setSelectedFontId('inter');
      }
    }
  }, [currentCard]);

  // Send initial theme to parent in create mode
  useEffect(() => {
    if (!currentCard && onThemeUpdate) {
      onThemeUpdate({
        style: selectedStyle,
        colorPalette: selectedPaletteId,
        fontId: selectedFontId
      });
    }
  }, []); // Only run once on mount

  const handleStyleChange = async (style: CardStyle) => {
    setSelectedStyle(style);

    // When style changes, set default palette for that style
    const styleConfig = getCardStyle(style);
    const defaultPalette = styleConfig.colorPalettes[0];
    setSelectedPaletteId(defaultPalette.id);

    await saveTheme(style, defaultPalette.id, selectedFontId);
  };

  const handlePaletteChange = async (paletteId: string) => {
    setSelectedPaletteId(paletteId);
    await saveTheme(selectedStyle, paletteId, selectedFontId);
  };

  const handleFontChange = async (fontId: string) => {
    setSelectedFontId(fontId);
    await saveTheme(selectedStyle, selectedPaletteId, fontId);
  };

  const saveTheme = async (style: CardStyle, paletteId: string, fontId: string) => {
    const updatedTheme = {
      style,
      colorPalette: paletteId,
      fontId
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

    try {
      await apiClient.patch(
        `/api/v1/cards/${currentCard.id}`,
        { theme: updatedTheme }
      );

      // Refresh the cards list
      mutate('/api/v1/cards/user');

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
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h3 className="text-2xl font-bold mb-2">Customize Theme</h3>
      <p className="text-gray-600 mb-8">Choose a style, color palette, and font for your card</p>

      <div className="space-y-8">
        {/* Card Style Selector */}
        <div>
          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleChange}
          />
        </div>

        {/* Color Palette Selector */}
        <div className="border-t border-gray-200 pt-8">
          <ColorPaletteSelector
            cardStyle={selectedStyle}
            selectedPaletteId={selectedPaletteId}
            onPaletteChange={handlePaletteChange}
          />
        </div>

        {/* Font Selector */}
        <div className="border-t border-gray-200 pt-8">
          <FontSelector
            selectedFontId={selectedFontId}
            onFontChange={handleFontChange}
          />
        </div>

        {/* Pro Themes Teaser */}
        <div className="border-t border-gray-200 pt-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-2">Pro Themes Coming Soon</h4>
            <p className="text-gray-600 mb-4">
              Unlock advanced customization options, custom fonts, and premium layouts with SmartShare Pro.
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Saving indicator */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
            Saving theme...
          </div>
        )}
      </div>
    </div>
  );
}
