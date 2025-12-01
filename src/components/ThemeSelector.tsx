'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StyleSelector } from './StyleSelector';
import { ColorPaletteSelector } from './ColorPaletteSelector';
import { FontSelector } from './FontSelector';
import { buildTheme, convertLegacyTheme, getDefaultTheme, type CardTheme, type CardStyle } from '@/lib/themes';

interface ThemeSelectorProps {
    currentTheme?: Record<string, unknown>;
    onThemeChange: (theme: CardTheme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
    // Parse current theme
    const [theme, setTheme] = useState<CardTheme>(() => {
        if (currentTheme) {
            return convertLegacyTheme(currentTheme);
        }
        return getDefaultTheme();
    });

    const [activeTab, setActiveTab] = useState<'style' | 'colors' | 'fonts'>('style');

    // Update theme when currentTheme prop changes
    useEffect(() => {
        if (currentTheme) {
            const parsed = convertLegacyTheme(currentTheme);
            setTheme(parsed);
        }
    }, [currentTheme]);

    const handleStyleChange = (style: CardStyle) => {
        const newTheme = buildTheme(style, theme.colorPalette, theme.font.id);
        setTheme(newTheme);
        onThemeChange(newTheme);
    };

    const handlePaletteChange = (paletteId: string) => {
        const newTheme = buildTheme(theme.style, paletteId, theme.font.id);
        setTheme(newTheme);
        onThemeChange(newTheme);
    };

    const handleFontChange = (fontId: string) => {
        const newTheme = buildTheme(theme.style, theme.colorPalette, fontId);
        setTheme(newTheme);
        onThemeChange(newTheme);
    };

    return (
        <Card>
            <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Card Design</h2>
                <p className="text-sm text-gray-600 mt-1">Customize your card's style, colors, and typography</p>
            </CardHeader>
            <CardBody>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'style'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Style
                    </button>
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'colors'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Colors
                    </button>
                    <button
                        onClick={() => setActiveTab('fonts')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'fonts'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Fonts
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'style' && (
                        <StyleSelector selectedStyle={theme.style} onStyleChange={handleStyleChange} />
                    )}
                    {activeTab === 'colors' && (
                        <ColorPaletteSelector
                            cardStyle={theme.style}
                            selectedPaletteId={theme.colorPalette}
                            onPaletteChange={handlePaletteChange}
                        />
                    )}
                    {activeTab === 'fonts' && (
                        <FontSelector selectedFontId={theme.font.id} onFontChange={handleFontChange} />
                    )}
                </div>

                {/* Current Selection Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Current Selection</h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Style: </span>
                            <span className="font-medium text-gray-900">{theme.style}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Palette: </span>
                            <span className="font-medium text-gray-900">{theme.colors.name}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Font: </span>
                            <span className="font-medium text-gray-900" style={{ fontFamily: theme.fontFamily }}>
                                {theme.font.name}
                            </span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
