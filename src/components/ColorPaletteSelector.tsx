'use client';

import { getCardStyle, getColorPalette, type CardStyle } from '@/lib/themes';

interface ColorPaletteSelectorProps {
    cardStyle: CardStyle;
    selectedPaletteId: string;
    onPaletteChange: (paletteId: string) => void;
}

export function ColorPaletteSelector({
    cardStyle,
    selectedPaletteId,
    onPaletteChange,
}: ColorPaletteSelectorProps) {
    const styleConfig = getCardStyle(cardStyle);
    const palettes = styleConfig.colorPalettes;

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Color Palette</h3>
                <p className="text-xs text-gray-600 mb-4">Choose a color scheme for your {styleConfig.name} style</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {palettes.map((palette) => {
                    const isSelected = selectedPaletteId === palette.id;
                    return (
                        <button
                            key={palette.id}
                            onClick={() => onPaletteChange(palette.id)}
                            className={`relative group text-left transition-all duration-200 rounded-lg border-2 p-3 ${
                                isSelected
                                    ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-200'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-neutral-900 rounded-full p-1">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-gray-900">{palette.name}</h4>
                                {/* Color swatches */}
                                <div className="flex gap-1.5">
                                    <div
                                        className="w-8 h-8 rounded border border-gray-200 shadow-sm"
                                        style={{ backgroundColor: palette.primaryColor }}
                                        title="Primary"
                                    />
                                    <div
                                        className="w-8 h-8 rounded border border-gray-200 shadow-sm"
                                        style={{ backgroundColor: palette.secondaryColor }}
                                        title="Secondary"
                                    />
                                    <div
                                        className="w-8 h-8 rounded border border-gray-200 shadow-sm"
                                        style={{ backgroundColor: palette.accentColor }}
                                        title="Accent"
                                    />
                                </div>
                                {/* Gradient preview */}
                                <div
                                    className="h-12 rounded border border-gray-200"
                                    style={{
                                        background: `linear-gradient(to right, ${palette.headerGradient.join(', ')})`,
                                    }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

