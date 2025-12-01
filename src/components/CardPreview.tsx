'use client';

import { PublicAvatar } from '@/components/PublicAvatar';
import { Button } from '@/components/ui/Button';
import type { Card } from '@/lib/api/types';
import { buildTheme, convertLegacyTheme, type CardTheme, type CardStyle } from '@/lib/themes';

interface CardPreviewProps {
    card: Partial<Card>;
    theme?: Record<string, unknown>;
}

export function CardPreview({ card, theme }: CardPreviewProps) {
    // Use photo_url with fallback to avatar_url
    const photoUrl = card.photo_url || card.avatar_url;
    const logoUrl = card.logo_url || card.cover_url;

    // Parse theme - support both new and legacy formats
    let cardTheme: CardTheme;
    if (theme && (theme.style || theme.colorPalette || theme.fontFamily)) {
        // New format
        cardTheme = buildTheme(
            (theme.style as CardStyle) || 'classic',
            (theme.colorPalette as string) || 'classicBlue',
            (theme.fontId as string) || 'inter'
        );
    } else {
        // Legacy format or default
        cardTheme = theme ? convertLegacyTheme(theme) : buildTheme('classic', 'classicBlue', 'inter');
    }

    const colors = cardTheme.colors;
    const fontFamily = cardTheme.fontFamily;
    const style = cardTheme.style;

    // Render different styles
    switch (style) {
        case 'classic':
            return <ClassicCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
        case 'modern':
            return <ModernCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
        case 'minimal':
            return <MinimalCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
        case 'bold':
            return <BoldCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
        case 'elegant':
            return <ElegantCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
        case 'creative':
            return <CreativeCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
        default:
            return <ClassicCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} />;
    }
}

// Classic Style - Centered, traditional layout
function ClassicCardPreview({ card, photoUrl, logoUrl, colors, fontFamily }: any) {
    return (
        <div className="w-full h-full overflow-auto p-6" style={{ backgroundColor: colors.backgroundColor }}>
            <div className="max-w-2xl mx-auto">
                <div
                    className="rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300"
                    style={{ fontFamily, backgroundColor: colors.cardBackground }}
                >
                    <div
                        className="relative h-40"
                        style={{
                            background: logoUrl
                                ? `url(${logoUrl}) center/cover`
                                : `linear-gradient(to right, ${colors.headerGradient.join(', ')})`
                        }}
                    >
                        {logoUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>}
                    </div>
                    <div className="relative px-6 pb-6">
                        <div className="flex justify-center -mt-16 mb-4">
                            <PublicAvatar src={photoUrl} name={card.name || 'Preview'} size="xl" className="ring-4 ring-white shadow-xl" />
                        </div>
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textColor }}>
                                {card.name || 'Your Name'}
                            </h1>
                            {card.title && <p className="text-lg font-medium mb-1" style={{ color: colors.textColor }}>{card.title}</p>}
                            {card.company && <p className="text-md" style={{ color: colors.textColor }}>{card.company}</p>}
                        </div>
                        {card.about && (
                            <div className="mb-6 px-4">
                                <p className="text-center leading-relaxed" style={{ color: colors.textColor }}>{card.about}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {card.email && (
                                <a href={`mailto:${card.email}`} className="block">
                                    <Button variant="primary" className="w-full" style={{ backgroundColor: colors.primaryColor }}>
                                        Email Me
                                    </Button>
                                </a>
                            )}
                            {card.phone && (
                                <a href={`tel:${card.phone}`} className="block">
                                    <Button variant="secondary" className="w-full" style={{ backgroundColor: colors.secondaryColor, color: 'white' }}>
                                        Call Now
                                    </Button>
                                </a>
                            )}
                        </div>
                        <ContactGrid card={card} colors={colors} />
                        {card.social_links && Object.keys(card.social_links).length > 0 && (
                            <SocialLinks card={card} colors={colors} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modern Style - Asymmetric, contemporary
function ModernCardPreview({ card, photoUrl, logoUrl, colors, fontFamily }: any) {
    return (
        <div className="w-full h-full overflow-auto p-6" style={{ backgroundColor: colors.backgroundColor }}>
            <div className="max-w-2xl mx-auto">
                <div
                    className="rounded-2xl shadow-2xl overflow-hidden"
                    style={{ fontFamily, backgroundColor: colors.cardBackground }}
                >
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3" style={{ background: `linear-gradient(135deg, ${colors.headerGradient.join(', ')})` }}>
                            <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                                <PublicAvatar src={photoUrl} name={card.name || 'Preview'} size="xl" className="ring-4 ring-white/50 shadow-xl mb-4" />
                                <h2 className="text-xl font-bold text-white text-center">{card.name || 'Your Name'}</h2>
                                {card.title && <p className="text-white/90 text-sm mt-1">{card.title}</p>}
                            </div>
                        </div>
                        <div className="md:w-2/3 p-6" style={{ color: colors.textColor }}>
                            {card.company && <p className="text-sm font-semibold mb-2" style={{ color: colors.primaryColor }}>{card.company}</p>}
                            {card.about && <p className="mb-6 leading-relaxed">{card.about}</p>}
                            <ContactGrid card={card} colors={colors} />
                            {card.social_links && Object.keys(card.social_links).length > 0 && (
                                <SocialLinks card={card} colors={colors} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Minimal Style - Clean, lots of white space
function MinimalCardPreview({ card, photoUrl, logoUrl, colors, fontFamily }: any) {
    return (
        <div className="w-full h-full overflow-auto p-6" style={{ backgroundColor: colors.backgroundColor }}>
            <div className="max-w-xl mx-auto">
                <div
                    className="rounded-lg shadow-lg overflow-hidden p-8"
                    style={{ fontFamily, backgroundColor: colors.cardBackground }}
                >
                    <div className="text-center mb-8">
                        <PublicAvatar src={photoUrl} name={card.name || 'Preview'} size="lg" className="mx-auto mb-4" />
                        <h1 className="text-2xl font-light mb-2" style={{ color: colors.textColor }}>
                            {card.name || 'Your Name'}
                        </h1>
                        {card.title && <p className="text-sm font-light" style={{ color: colors.textColor }}>{card.title}</p>}
                    </div>
                    {card.about && (
                        <div className="mb-8 text-center">
                            <p className="text-sm leading-relaxed" style={{ color: colors.textColor }}>{card.about}</p>
                        </div>
                    )}
                    <div className="space-y-3 mb-8">
                        {card.email && <MinimalContactItem label="Email" value={card.email} colors={colors} />}
                        {card.phone && <MinimalContactItem label="Phone" value={card.phone} colors={colors} />}
                        {card.website && <MinimalContactItem label="Website" value={card.website} colors={colors} />}
                    </div>
                    {card.social_links && Object.keys(card.social_links).length > 0 && (
                        <SocialLinks card={card} colors={colors} />
                    )}
                </div>
            </div>
        </div>
    );
}

// Bold Style - High contrast, vibrant
function BoldCardPreview({ card, photoUrl, logoUrl, colors, fontFamily }: any) {
    return (
        <div className="w-full h-full overflow-auto p-6" style={{ backgroundColor: colors.backgroundColor }}>
            <div className="max-w-2xl mx-auto">
                <div
                    className="rounded-2xl shadow-2xl overflow-hidden"
                    style={{ fontFamily, backgroundColor: colors.cardBackground }}
                >
                    <div
                        className="p-8 text-center"
                        style={{ background: `linear-gradient(135deg, ${colors.headerGradient.join(', ')})` }}
                    >
                        <PublicAvatar src={photoUrl} name={card.name || 'Preview'} size="xl" className="ring-4 ring-white shadow-xl mb-4" />
                        <h1 className="text-4xl font-bold text-white mb-2">{card.name || 'Your Name'}</h1>
                        {card.title && <p className="text-xl text-white/90">{card.title}</p>}
                    </div>
                    <div className="p-6" style={{ color: colors.textColor }}>
                        {card.about && <p className="mb-6 text-center font-medium">{card.about}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {card.email && (
                                <a href={`mailto:${card.email}`} className="block">
                                    <Button variant="primary" className="w-full" style={{ backgroundColor: colors.primaryColor }}>
                                        Email
                                    </Button>
                                </a>
                            )}
                            {card.phone && (
                                <a href={`tel:${card.phone}`} className="block">
                                    <Button variant="primary" className="w-full" style={{ backgroundColor: colors.secondaryColor }}>
                                        Call
                                    </Button>
                                </a>
                            )}
                        </div>
                        <ContactGrid card={card} colors={colors} />
                        {card.social_links && Object.keys(card.social_links).length > 0 && (
                            <SocialLinks card={card} colors={colors} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Elegant Style - Sophisticated, refined
function ElegantCardPreview({ card, photoUrl, logoUrl, colors, fontFamily }: any) {
    return (
        <div className="w-full h-full overflow-auto p-6" style={{ backgroundColor: colors.backgroundColor }}>
            <div className="max-w-2xl mx-auto">
                <div
                    className="rounded-lg shadow-xl overflow-hidden border"
                    style={{ fontFamily, backgroundColor: colors.cardBackground, borderColor: colors.accentColor }}
                >
                    <div className="p-8">
                        <div className="flex items-start gap-6 mb-6">
                            <PublicAvatar src={photoUrl} name={card.name || 'Preview'} size="lg" className="ring-2" style={{ ringColor: colors.primaryColor }} />
                            <div className="flex-1">
                                <h1 className="text-3xl font-serif mb-1" style={{ color: colors.textColor }}>
                                    {card.name || 'Your Name'}
                                </h1>
                                {card.title && <p className="text-lg font-light mb-1" style={{ color: colors.primaryColor }}>{card.title}</p>}
                                {card.company && <p className="text-sm" style={{ color: colors.textColor }}>{card.company}</p>}
                            </div>
                        </div>
                        {card.about && (
                            <div className="mb-6 pl-20">
                                <p className="text-sm leading-relaxed italic" style={{ color: colors.textColor }}>{card.about}</p>
                            </div>
                        )}
                        <div className="border-t pt-6" style={{ borderColor: colors.accentColor }}>
                            <ContactGrid card={card} colors={colors} />
                        </div>
                        {card.social_links && Object.keys(card.social_links).length > 0 && (
                            <div className="mt-6">
                                <SocialLinks card={card} colors={colors} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Creative Style - Artistic, unique
function CreativeCardPreview({ card, photoUrl, logoUrl, colors, fontFamily }: any) {
    return (
        <div className="w-full h-full overflow-auto p-6" style={{ backgroundColor: colors.backgroundColor }}>
            <div className="max-w-2xl mx-auto">
                <div
                    className="rounded-3xl shadow-2xl overflow-hidden relative"
                    style={{ fontFamily, backgroundColor: colors.cardBackground }}
                >
                    <div
                        className="h-48 relative"
                        style={{
                            background: logoUrl
                                ? `url(${logoUrl}) center/cover`
                                : `linear-gradient(45deg, ${colors.headerGradient.join(', ')})`
                        }}
                    >
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                    <div className="relative px-6 pb-6">
                        <div className="flex justify-center -mt-20 mb-4">
                            <div className="relative">
                                <PublicAvatar src={photoUrl} name={card.name || 'Preview'} size="xl" className="ring-4 ring-white shadow-xl" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full" style={{ backgroundColor: colors.accentColor }}></div>
                            </div>
                        </div>
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textColor }}>
                                {card.name || 'Your Name'}
                            </h1>
                            {card.title && <p className="text-lg" style={{ color: colors.primaryColor }}>{card.title}</p>}
                        </div>
                        {card.about && (
                            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: colors.backgroundColor }}>
                                <p className="text-center text-sm" style={{ color: colors.textColor }}>{card.about}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {card.email && (
                                <a href={`mailto:${card.email}`} className="block">
                                    <Button variant="primary" className="w-full text-xs" style={{ backgroundColor: colors.primaryColor }}>
                                        Email
                                    </Button>
                                </a>
                            )}
                            {card.phone && (
                                <a href={`tel:${card.phone}`} className="block">
                                    <Button variant="primary" className="w-full text-xs" style={{ backgroundColor: colors.secondaryColor }}>
                                        Call
                                    </Button>
                                </a>
                            )}
                            {card.website && (
                                <a href={card.website} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button variant="primary" className="w-full text-xs" style={{ backgroundColor: colors.accentColor }}>
                                        Web
                                    </Button>
                                </a>
                            )}
                        </div>
                        {card.social_links && Object.keys(card.social_links).length > 0 && (
                            <SocialLinks card={card} colors={colors} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Shared Components
function ContactGrid({ card, colors }: any) {
    return (
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: colors.backgroundColor }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: colors.textColor }}>
                Contact Information
            </h3>
            <div className="space-y-3">
                {card.email && (
                    <a href={`mailto:${card.email}`} className="flex items-center hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: colors.primaryColor + '20' }}>
                            <svg className="w-5 h-5" style={{ color: colors.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: colors.textColor + '80' }}>Email</p>
                            <p className="text-sm font-medium" style={{ color: colors.textColor }}>{card.email}</p>
                        </div>
                    </a>
                )}
                {card.phone && (
                    <a href={`tel:${card.phone}`} className="flex items-center hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: colors.secondaryColor + '20' }}>
                            <svg className="w-5 h-5" style={{ color: colors.secondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: colors.textColor + '80' }}>Phone</p>
                            <p className="text-sm font-medium" style={{ color: colors.textColor }}>{card.phone}</p>
                        </div>
                    </a>
                )}
                {card.website && (
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: colors.accentColor + '20' }}>
                            <svg className="w-5 h-5" style={{ color: colors.accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: colors.textColor + '80' }}>Website</p>
                            <a
                                href={card.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium hover:underline"
                                style={{ color: colors.primaryColor }}
                            >
                                {card.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SocialLinks({ card, colors }: any) {
    return (
        <div className="border-t pt-6" style={{ borderColor: colors.backgroundColor }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-center" style={{ color: colors.textColor }}>
                Connect With Me
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(card.social_links || {}).map(([platform, url]) => (
                    <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        title={platform}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-200 hover:scale-110 hover:shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`
                            }}
                        >
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="8" />
                            </svg>
                        </div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ color: colors.textColor }}>
                            {platform}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}

function MinimalContactItem({ label, value, colors }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: colors.backgroundColor }}>
            <span className="text-xs font-medium" style={{ color: colors.textColor + '60' }}>{label}</span>
            <span className="text-sm" style={{ color: colors.textColor }}>{value}</span>
        </div>
    );
}
