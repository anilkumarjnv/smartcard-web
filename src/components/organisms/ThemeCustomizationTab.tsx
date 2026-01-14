'use client';

import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/apiClient';
import type { Card } from '@/lib/api/types';
import { ThemeSelector } from '@/components/profile/ThemeSelector';
import { ShapeSelector, type ProfileCardShape } from '@/components/profile/ShapeSelector';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/organisms/UpgradeModal';

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
  const [showBranding, setShowBranding] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Subscription check
  const { isPro } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState('');

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

      // Initialize branding preference
      // Default to TRUE (branding shown)
      if (theme.showBranding !== undefined) {
        setShowBranding(theme.showBranding as boolean);
      } else {
        setShowBranding(true);
      }
    }
  }, [currentCard]);

  // Send initial theme and shape to parent in create mode
  useEffect(() => {
    if (!currentCard && onThemeUpdate) {
      onThemeUpdate({
        profileTheme: selectedTheme,
        shape: selectedShape,
        showBranding: showBranding,
      });
    }
  }, []); // Only run once on mount

  // Handle changes for Preview (without saving)
  const handleThemeChange = (theme: 'light' | 'dark' | 'accent' | 'neutral') => {
    setSelectedTheme(theme);
    // Update live preview immediately
    if (onThemeUpdate) {
      onThemeUpdate({
        profileTheme: theme,
        shape: selectedShape,
        showBranding: showBranding,
      });
    }
  };

  const handleShapeChange = (shape: ProfileCardShape) => {
    setSelectedShape(shape);
    // Update live preview immediately
    if (onThemeUpdate) {
      onThemeUpdate({
        profileTheme: selectedTheme,
        shape: shape,
        showBranding: showBranding,
      });
    }
  };

  const handleBrandingChange = (enabled: boolean) => {
    // If user is trying to turn OFF branding (enabled=false) and is NOT PRO
    if (!enabled && !isPro) {
      setBlockedFeature('Remove Branding');
      setShowUpgradeModal(true);
      return;
    }

    setShowBranding(enabled);

    // Update live preview immediately
    if (onThemeUpdate) {
      onThemeUpdate({
        profileTheme: selectedTheme,
        shape: selectedShape,
        showBranding: enabled,
      });
    }
  };

  const handleSave = async () => {
    // Check Pro status for restricted features (Shapes)
    if (!isPro && selectedShape !== 'wave') {
      setBlockedFeature('Custom Shapes');
      setShowUpgradeModal(true);
      return;
    }

    // Prepare theme object
    const updatedTheme = {
      profileTheme: selectedTheme,
      shape: selectedShape,
      showBranding: showBranding,
    };

    // If there's no card (create mode), usually we don't need to save here 
    // as the main form save handles it, but if this tab is standalone editing:
    if (!currentCard) {
      return;
    }

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
    } catch (err) {
      console.error('Error saving theme:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Customize Theme</h3>
          <p className="text-muted-foreground text-sm sm:text-base">Choose a professional theme for your digital profile card</p>
        </div>

        {/* Save Button */}
        {currentCard && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`hidden md:flex px-6 py-2.5 rounded-xl font-medium transition-all ${isSaving
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg active:scale-95'
              }`}
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </button>
        )}
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* New Theme Selector */}
        <div>
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        </div>

        {/* Shape Selector */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <ShapeSelector
            selectedShape={selectedShape}
            onShapeChange={handleShapeChange}
          />
        </div>

        {/* Branding Toggle */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Branding</h4>
          <div className="flex items-center justify-between p-4 bg-muted dark:bg-neutral-800 rounded-2xl">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Show Cardfil Branding</p>
                {!isPro && <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">FREE</div>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Remove with Pro plan</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBranding}
                onChange={(e) => handleBrandingChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 dark:peer-focus:ring-neutral-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-100 dark:peer-checked:after:bg-neutral-900 dark:peer-checked:after:border-neutral-900"></div>
            </label>
          </div>
        </div>

        {/* Mobile Save Button (visible only on small screens) */}
        {currentCard && (
          <div className="md:hidden pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-3 rounded-xl font-bold transition-all ${isSaving
                ? 'bg-neutral-100 text-neutral-400'
                : 'bg-primary text-primary-foreground shadow-lg'
                }`}
            >
              {isSaving ? 'Saving...' : 'Save Theme Changes'}
            </button>
          </div>
        )}

        {/* Theme Features */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Theme Features</h4>
          <div className="grid gap-3 sm:gap-4">
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

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName={blockedFeature}
      />
    </div>
  );
}
