// src/lib/themes.ts
/**
 * Enhanced theme system with card styles, color palettes, and fonts
 */

export type CardStyle = 'classic' | 'modern' | 'minimal' | 'bold' | 'elegant' | 'creative';

export interface ColorPalette {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headerGradient: string[];
    backgroundColor: string;
    textColor: string;
    cardBackground: string;
}

export interface CardStyleConfig {
    id: CardStyle;
    name: string;
    description: string;
    preview: string; // Preview description
    colorPalettes: ColorPalette[];
}

export interface FontOption {
    id: string;
    name: string;
    family: string;
    category: 'sans-serif' | 'serif' | 'monospace' | 'display';
    description: string;
}

export interface CardTheme {
    style: CardStyle;
    colorPalette: string; // Palette ID
    fontFamily: string;
    // Computed values
    colors: ColorPalette;
    font: FontOption;
}

// Color Palettes
export const colorPalettes: Record<string, ColorPalette> = {
    // Classic Style Palettes
    classicBlue: {
        id: 'classicBlue',
        name: 'Classic Blue',
        primaryColor: '#2563eb',
        secondaryColor: '#4f46e5',
        accentColor: '#7c3aed',
        headerGradient: ['#2563eb', '#4f46e5', '#7c3aed'],
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    classicNavy: {
        id: 'classicNavy',
        name: 'Classic Navy',
        primaryColor: '#1e3a8a',
        secondaryColor: '#1e40af',
        accentColor: '#3b82f6',
        headerGradient: ['#1e3a8a', '#1e40af', '#3b82f6'],
        backgroundColor: '#f1f5f9',
        textColor: '#0f172a',
        cardBackground: '#ffffff',
    },
    classicGray: {
        id: 'classicGray',
        name: 'Classic Gray',
        primaryColor: '#4b5563',
        secondaryColor: '#6b7280',
        accentColor: '#9ca3af',
        headerGradient: ['#374151', '#4b5563', '#6b7280'],
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        cardBackground: '#ffffff',
    },

    // Modern Style Palettes
    modernDark: {
        id: 'modernDark',
        name: 'Modern Dark',
        primaryColor: '#0f172a',
        secondaryColor: '#1e293b',
        accentColor: '#3b82f6',
        headerGradient: ['#0f172a', '#1e293b', '#334155'],
        backgroundColor: '#0a0a0a',
        textColor: '#f1f5f9',
        cardBackground: '#1e293b',
    },
    modernPurple: {
        id: 'modernPurple',
        name: 'Modern Purple',
        primaryColor: '#7c3aed',
        secondaryColor: '#a855f7',
        accentColor: '#c084fc',
        headerGradient: ['#6d28d9', '#7c3aed', '#a855f7'],
        backgroundColor: '#faf5ff',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    modernTeal: {
        id: 'modernTeal',
        name: 'Modern Teal',
        primaryColor: '#0d9488',
        secondaryColor: '#14b8a6',
        accentColor: '#2dd4bf',
        headerGradient: ['#0f766e', '#0d9488', '#14b8a6'],
        backgroundColor: '#f0fdfa',
        textColor: '#0f172a',
        cardBackground: '#ffffff',
    },

    // Minimal Style Palettes
    minimalWhite: {
        id: 'minimalWhite',
        name: 'Minimal White',
        primaryColor: '#3b82f6',
        secondaryColor: '#60a5fa',
        accentColor: '#93c5fd',
        headerGradient: ['#eff6ff', '#dbeafe', '#bfdbfe'],
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    minimalBeige: {
        id: 'minimalBeige',
        name: 'Minimal Beige',
        primaryColor: '#d97706',
        secondaryColor: '#f59e0b',
        accentColor: '#fbbf24',
        headerGradient: ['#fef3c7', '#fde68a', '#fcd34d'],
        backgroundColor: '#fefce8',
        textColor: '#78350f',
        cardBackground: '#ffffff',
    },
    minimalGray: {
        id: 'minimalGray',
        name: 'Minimal Gray',
        primaryColor: '#64748b',
        secondaryColor: '#94a3b8',
        accentColor: '#cbd5e1',
        headerGradient: ['#f1f5f9', '#e2e8f0', '#cbd5e1'],
        backgroundColor: '#f8fafc',
        textColor: '#334155',
        cardBackground: '#ffffff',
    },

    // Bold Style Palettes
    boldRed: {
        id: 'boldRed',
        name: 'Bold Red',
        primaryColor: '#dc2626',
        secondaryColor: '#ef4444',
        accentColor: '#f87171',
        headerGradient: ['#991b1b', '#dc2626', '#ef4444'],
        backgroundColor: '#fef2f2',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    boldOrange: {
        id: 'boldOrange',
        name: 'Bold Orange',
        primaryColor: '#ea580c',
        secondaryColor: '#f97316',
        accentColor: '#fb923c',
        headerGradient: ['#c2410c', '#ea580c', '#f97316'],
        backgroundColor: '#fff7ed',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    boldPink: {
        id: 'boldPink',
        name: 'Bold Pink',
        primaryColor: '#db2777',
        secondaryColor: '#ec4899',
        accentColor: '#f472b6',
        headerGradient: ['#be185d', '#db2777', '#ec4899'],
        backgroundColor: '#fdf2f8',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },

    // Elegant Style Palettes
    elegantGold: {
        id: 'elegantGold',
        name: 'Elegant Gold',
        primaryColor: '#d97706',
        secondaryColor: '#f59e0b',
        accentColor: '#fbbf24',
        headerGradient: ['#78350f', '#d97706', '#f59e0b'],
        backgroundColor: '#fffbeb',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    elegantEmerald: {
        id: 'elegantEmerald',
        name: 'Elegant Emerald',
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        accentColor: '#34d399',
        headerGradient: ['#047857', '#059669', '#10b981'],
        backgroundColor: '#ecfdf5',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    elegantSlate: {
        id: 'elegantSlate',
        name: 'Elegant Slate',
        primaryColor: '#475569',
        secondaryColor: '#64748b',
        accentColor: '#94a3b8',
        headerGradient: ['#334155', '#475569', '#64748b'],
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },

    // Creative Style Palettes
    creativeViolet: {
        id: 'creativeViolet',
        name: 'Creative Violet',
        primaryColor: '#7c3aed',
        secondaryColor: '#a855f7',
        accentColor: '#c084fc',
        headerGradient: ['#6d28d9', '#7c3aed', '#a855f7', '#c084fc'],
        backgroundColor: '#faf5ff',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    creativeCyan: {
        id: 'creativeCyan',
        name: 'Creative Cyan',
        primaryColor: '#0891b2',
        secondaryColor: '#06b6d4',
        accentColor: '#22d3ee',
        headerGradient: ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee'],
        backgroundColor: '#ecfeff',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
    creativeRainbow: {
        id: 'creativeRainbow',
        name: 'Creative Rainbow',
        primaryColor: '#ec4899',
        secondaryColor: '#f97316',
        accentColor: '#f59e0b',
        headerGradient: ['#ec4899', '#f97316', '#f59e0b', '#10b981', '#3b82f6'],
        backgroundColor: '#fef3c7',
        textColor: '#1e293b',
        cardBackground: '#ffffff',
    },
};

// Card Style Configurations
export const cardStyles: Record<CardStyle, CardStyleConfig> = {
    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional layout with centered content',
        preview: 'Centered profile with header gradient',
        colorPalettes: [
            colorPalettes.classicBlue,
            colorPalettes.classicNavy,
            colorPalettes.classicGray,
        ],
    },
    modern: {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with bold sections and clean lines',
        preview: 'Asymmetric layout with modern aesthetics',
        colorPalettes: [
            colorPalettes.modernDark,
            colorPalettes.modernPurple,
            colorPalettes.modernTeal,
        ],
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple with lots of white space',
        preview: 'Ultra-clean design with minimal elements',
        colorPalettes: [
            colorPalettes.minimalWhite,
            colorPalettes.minimalBeige,
            colorPalettes.minimalGray,
        ],
    },
    bold: {
        id: 'bold',
        name: 'Bold',
        description: 'Vibrant colors and strong visual impact',
        preview: 'High-contrast design with bold colors',
        colorPalettes: [
            colorPalettes.boldRed,
            colorPalettes.boldOrange,
            colorPalettes.boldPink,
        ],
    },
    elegant: {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated and refined with premium feel',
        preview: 'Luxurious design with elegant typography',
        colorPalettes: [
            colorPalettes.elegantGold,
            colorPalettes.elegantEmerald,
            colorPalettes.elegantSlate,
        ],
    },
    creative: {
        id: 'creative',
        name: 'Creative',
        description: 'Artistic and expressive with unique layouts',
        preview: 'Dynamic design with creative flair',
        colorPalettes: [
            colorPalettes.creativeViolet,
            colorPalettes.creativeCyan,
            colorPalettes.creativeRainbow,
        ],
    },
};

// Font Options
export const fonts: FontOption[] = [
    {
        id: 'inter',
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        category: 'sans-serif',
        description: 'Modern and versatile',
    },
    {
        id: 'roboto',
        name: 'Roboto',
        family: 'Roboto, sans-serif',
        category: 'sans-serif',
        description: 'Clean and readable',
    },
    {
        id: 'poppins',
        name: 'Poppins',
        family: 'Poppins, sans-serif',
        category: 'sans-serif',
        description: 'Geometric and friendly',
    },
    {
        id: 'montserrat',
        name: 'Montserrat',
        family: 'Montserrat, sans-serif',
        category: 'sans-serif',
        description: 'Elegant and modern',
    },
    {
        id: 'lato',
        name: 'Lato',
        family: 'Lato, sans-serif',
        category: 'sans-serif',
        description: 'Warm and professional',
    },
    {
        id: 'raleway',
        name: 'Raleway',
        family: 'Raleway, sans-serif',
        category: 'sans-serif',
        description: 'Elegant and refined',
    },
    {
        id: 'playfair',
        name: 'Playfair Display',
        family: 'Playfair Display, serif',
        category: 'serif',
        description: 'Classic and sophisticated',
    },
    {
        id: 'merriweather',
        name: 'Merriweather',
        family: 'Merriweather, serif',
        category: 'serif',
        description: 'Traditional and readable',
    },
    {
        id: 'outfit',
        name: 'Outfit',
        family: 'Outfit, sans-serif',
        category: 'display',
        description: 'Bold and contemporary',
    },
    {
        id: 'space-grotesk',
        name: 'Space Grotesk',
        family: 'Space Grotesk, sans-serif',
        category: 'sans-serif',
        description: 'Modern and geometric',
    },
];

// Helper functions
export function getColorPalette(paletteId: string): ColorPalette {
    return colorPalettes[paletteId] || colorPalettes.classicBlue;
}

export function getCardStyle(styleId: CardStyle): CardStyleConfig {
    return cardStyles[styleId] || cardStyles.classic;
}

export function getFont(fontId: string): FontOption {
    return fonts.find(f => f.id === fontId) || fonts[0];
}

export function getDefaultTheme(): CardTheme {
    const style = cardStyles.classic;
    const palette = style.colorPalettes[0];
    const font = fonts[0];

    return {
        style: 'classic',
        colorPalette: palette.id,
        fontFamily: font.family,
        colors: palette,
        font: font,
    };
}

export function buildTheme(
    style: CardStyle,
    paletteId: string,
    fontId: string
): CardTheme {
    const palette = getColorPalette(paletteId);
    const font = getFont(fontId);

    return {
        style,
        colorPalette: paletteId,
        fontFamily: font.family,
        colors: palette,
        font: font,
    };
}

// Legacy support - convert old theme format to new format
export function convertLegacyTheme(legacyTheme: Record<string, unknown>): CardTheme {
    const style = (legacyTheme.style as CardStyle) || 'classic';
    const paletteId = (legacyTheme.colorPalette as string) || 'classicBlue';
    const fontId = (legacyTheme.fontId as string) || 'inter';

    return buildTheme(style, paletteId, fontId);
}
