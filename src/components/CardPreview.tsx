'use client';

import { PublicAvatar } from '@/components/PublicAvatar';
import type { Card } from '@/lib/api/types';
import { buildTheme, convertLegacyTheme, type CardTheme, type CardStyle } from '@/lib/themes';

interface CardPreviewProps {
    card: Partial<Card>;
    theme?: Record<string, unknown>;
    isPublicView?: boolean; // If true, show download button; if false/undefined, hide it (for live preview)
}

export function CardPreview({ card, theme, isPublicView = false }: CardPreviewProps) {
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
            return <ClassicCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
        case 'modern':
            return <ModernCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
        case 'minimal':
            return <MinimalCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
        case 'bold':
            return <BoldCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
        case 'elegant':
            return <ElegantCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
        case 'creative':
            return <CreativeCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
        default:
            return <ClassicCardPreview card={card} photoUrl={photoUrl} logoUrl={logoUrl} colors={colors} fontFamily={fontFamily} isPublicView={isPublicView} />;
    }
}

// Classic Style - Centered, traditional layout
function ClassicCardPreview({ card, photoUrl, logoUrl, colors, fontFamily, isPublicView }: any) {
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
                        <ContactGrid card={card} colors={colors} isPublicView={isPublicView} />
                        <AdditionalInfo card={card} colors={colors} />
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
function ModernCardPreview({ card, photoUrl, logoUrl, colors, fontFamily, isPublicView }: any) {
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
                            <ContactGrid card={card} colors={colors} isPublicView={isPublicView} />
                            <AdditionalInfo card={card} colors={colors} />
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
function MinimalCardPreview({ card, photoUrl, logoUrl, colors, fontFamily, isPublicView }: any) {
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
                        {card.website && <MinimalContactItem label="Website" value={card.website} colors={colors} />}
                    </div>
                    <AdditionalInfo card={card} colors={colors} />
                    {card.social_links && Object.keys(card.social_links).length > 0 && (
                        <SocialLinks card={card} colors={colors} />
                    )}
                </div>
            </div>
        </div>
    );
}

// Bold Style - High contrast, vibrant
function BoldCardPreview({ card, photoUrl, logoUrl, colors, fontFamily, isPublicView }: any) {
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
                        <ContactGrid card={card} colors={colors} isPublicView={isPublicView} />
                        <AdditionalInfo card={card} colors={colors} />
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
function ElegantCardPreview({ card, photoUrl, logoUrl, colors, fontFamily, isPublicView }: any) {
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
                            <ContactGrid card={card} colors={colors} isPublicView={isPublicView} />
                            <AdditionalInfo card={card} colors={colors} />
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
function CreativeCardPreview({ card, photoUrl, logoUrl, colors, fontFamily, isPublicView }: any) {
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
                        <AdditionalInfo card={card} colors={colors} />
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
function ContactGrid({ card, colors, isPublicView }: any) {
    const hasContactInfo = card.website || card.email || card.phone;
    
    if (!hasContactInfo) {
        return null;
    }

    // Show phone in public view only if phone_public is true, otherwise always show in preview
    const showPhone = !isPublicView || card.phone_public;

    return (
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: colors.backgroundColor }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: colors.textColor }}>
                Contact Information
            </h3>
            <div className="space-y-3">
                {card.website && (
                    <a
                        href={card.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: colors.accentColor + '20' }}>
                            <svg className="w-5 h-5" style={{ color: colors.accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs" style={{ color: colors.textColor + '80' }}>Website</p>
                            <p className="text-sm font-medium hover:underline" style={{ color: colors.primaryColor }}>
                                {card.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </p>
                        </div>
                    </a>
                )}
                {card.email && (
                    <a
                        href={`mailto:${card.email}`}
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: colors.accentColor + '20' }}>
                            <svg className="w-5 h-5" style={{ color: colors.accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs" style={{ color: colors.textColor + '80' }}>Email</p>
                            <p className="text-sm font-medium hover:underline" style={{ color: colors.primaryColor }}>
                                {card.email}
                            </p>
                        </div>
                    </a>
                )}
                {showPhone && card.phone && (
                    <a
                        href={`tel:${card.phone}`}
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: colors.accentColor + '20' }}>
                            <svg className="w-5 h-5" style={{ color: colors.accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs" style={{ color: colors.textColor + '80' }}>Phone</p>
                            <p className="text-sm font-medium hover:underline" style={{ color: colors.primaryColor }}>
                                {card.phone}
                            </p>
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
}

function SocialLinks({ card, colors }: any) {
    const socialIcons: Record<string, JSX.Element> = {
        linkedin: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        ),
        instagram: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
        ),
        twitter: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
        ),
        github: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
            </svg>
        ),
        whatsapp: (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
        ),
    };

    const socialPlatforms = Object.entries(card.social_links || {}).filter(([_, url]) => url && url.trim() !== '');

    if (socialPlatforms.length === 0) return null;

    return (
        <div className="border-t pt-6" style={{ borderColor: colors.backgroundColor }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-center" style={{ color: colors.textColor }}>
                Connect With Me
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
                {socialPlatforms.map(([platform, url]) => (
                    <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-200 hover:scale-110 hover:shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`
                            }}
                        >
                            {socialIcons[platform] || (
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="8" />
                                </svg>
                            )}
                        </div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap capitalize" style={{ color: colors.textColor }}>
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

// Additional Info Component - Shows skills, projects, certifications, etc.
function AdditionalInfo({ card, colors }: any) {
    const additionalFields: Array<{ key: string; label: string; value: any }> = [];
    
    // Check for role-based fields in card data
    if (card.school) additionalFields.push({ key: 'school', label: 'School/University', value: card.school });
    if (card.major) additionalFields.push({ key: 'major', label: 'Major', value: card.major });
    if (card.graduation_year) additionalFields.push({ key: 'graduation_year', label: 'Graduation Year', value: card.graduation_year });
    if (card.skills) additionalFields.push({ key: 'skills', label: 'Skills', value: card.skills });
    if (card.projects) additionalFields.push({ key: 'projects', label: 'Projects', value: card.projects });
    if (card.experience) additionalFields.push({ key: 'experience', label: 'Experience', value: card.experience });
    if (card.certifications) additionalFields.push({ key: 'certifications', label: 'Certifications', value: card.certifications });
    
    // Also check in student_fields or professional_fields if they exist
    if (card.student_fields) {
        const studentFields = card.student_fields as Record<string, any>;
        if (studentFields.school) additionalFields.push({ key: 'school', label: 'School/University', value: studentFields.school });
        if (studentFields.major) additionalFields.push({ key: 'major', label: 'Major', value: studentFields.major });
        if (studentFields.graduation_year) additionalFields.push({ key: 'graduation_year', label: 'Graduation Year', value: studentFields.graduation_year });
        if (studentFields.projects) additionalFields.push({ key: 'projects', label: 'Projects', value: studentFields.projects });
    }
    
    if (card.professional_fields) {
        const professionalFields = card.professional_fields as Record<string, any>;
        if (professionalFields.experience) additionalFields.push({ key: 'experience', label: 'Experience', value: professionalFields.experience });
    }
    
    if (additionalFields.length === 0) return null;
    
    return (
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: colors.backgroundColor }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: colors.textColor }}>
                Additional Information
            </h3>
            <div className="space-y-4">
                {additionalFields.map((field) => (
                    <div key={field.key}>
                        <p className="text-xs font-medium mb-2" style={{ color: colors.textColor + '80' }}>
                            {field.label}
                        </p>
                        {field.key === 'skills' ? (
                            <div className="flex flex-wrap gap-2">
                                {String(field.value).split(',').map((skill: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ 
                                            backgroundColor: colors.primaryColor + '20',
                                            color: colors.primaryColor
                                        }}
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        ) : field.key === 'projects' || field.key === 'experience' ? (
                            <div className="space-y-2">
                                {String(field.value).split('\n').filter((line: string) => line.trim()).map((line: string, idx: number) => (
                                    <p key={idx} className="text-sm" style={{ color: colors.textColor }}>
                                        • {line.trim()}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm font-medium" style={{ color: colors.textColor }}>
                                {field.value}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
