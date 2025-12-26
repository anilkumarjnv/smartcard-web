'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { PROFILE_THEMES, type ProfileCardTheme } from '../CardPreview';

interface ThemeSelectorProps {
    selectedTheme?: 'light' | 'dark' | 'accent';
    onThemeChange: (theme: 'light' | 'dark' | 'accent') => void;
}

/**
 * Clean theme selector UI for profile cards
 * Displays theme options in a visually appealing grid
 */
export function ThemeSelector({ selectedTheme = 'light', onThemeChange }: ThemeSelectorProps) {
    const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

    const themeColors = {
        light: {
            primary: '#4F46E5',
            background: '#FFFFFF',
            border: '#E5E7EB',
        },
        dark: {
            primary: '#FFFFFF',
            background: '#171717',
            border: '#404040',
        },
        accent: {
            primary: '#8B5CF6',
            background: '#FFFFFF',
            border: '#DDD6FE',
        },
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    Choose Your Theme
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Select a theme that represents your professional brand
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROFILE_THEMES.map((theme) => {
                    const colors = themeColors[theme.name];
                    const isSelected = selectedTheme === theme.name;
                    const isHovered = hoveredTheme === theme.name;

                    return (
                        <button
                            key={theme.name}
                            onClick={() => onThemeChange(theme.name)}
                            onMouseEnter={() => setHoveredTheme(theme.name)}
                            onMouseLeave={() => setHoveredTheme(null)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                ? 'border-indigo-600 dark:border-indigo-400 shadow-lg'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                }`}
                        >
                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                </div>
                            )}

                            {/* Theme Preview */}
                            <div className="mb-3">
                                <div
                                    className="h-24 rounded-lg mb-3 relative overflow-hidden"
                                    style={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.border}`,
                                    }}
                                >
                                    {/* Mini preview of card style */}
                                    <div className="absolute inset-0 flex flex-col">
                                        {/* Header area with gradient */}
                                        <div
                                            className="h-1/2"
                                            style={{
                                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}DD)`,
                                            }}
                                        />
                                        {/* Wave divider */}
                                        <svg
                                            viewBox="0 0 100 20"
                                            className="w-full h-4 -mt-4"
                                            preserveAspectRatio="none"
                                        >
                                            <path
                                                d="M0,10 Q25,15 50,10 T100,10 L100,20 L0,20 Z"
                                                fill={colors.primary}
                                            />
                                        </svg>
                                        {/* Content area */}
                                        <div className="flex-1" style={{ backgroundColor: colors.background }} />
                                    </div>
                                </div>

                                <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                                    {theme.displayName}
                                </h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {theme.description}
                                </p>
                            </div>

                            {/* Hover effect */}
                            {isHovered && !isSelected && (
                                <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-800/20 rounded-xl pointer-events-none" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
