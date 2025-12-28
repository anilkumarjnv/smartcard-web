import type { Card } from '@/lib/api/types';

export function generateVCardString(card: Card): string {
    const n = card.name || '';
    const names = n.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const fields = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${n}`,
        card.company ? `ORG:${card.company}` : '',
        card.title ? `TITLE:${card.title}` : '',
        card.email ? `EMAIL;type=INTERNET;type=WORK:${card.email}` : '',
        card.phone ? `TEL;type=CELL:${card.phone}` : '',
        card.website ? `URL:${card.website}` : '',
        card.about ? `NOTE:${card.about}` : '',
    ];

    // Add social links if available
    if (card.social_links) {
        if (card.social_links.linkedin) fields.push(`URL;type=LINKEDIN:${card.social_links.linkedin}`);
        if (card.social_links.twitter) fields.push(`URL;type=TWITTER:${card.social_links.twitter}`);
        if (card.social_links.github) fields.push(`URL;type=GITHUB:${card.social_links.github}`);
        if (card.social_links.instagram) fields.push(`URL;type=INSTAGRAM:${card.social_links.instagram}`);
    }

    fields.push('END:VCARD');

    return fields.filter(Boolean).join('\n');
}

export function downloadVCard(card: Card) {
    const vcard = generateVCardString(card);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(card.name || 'contact').replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
