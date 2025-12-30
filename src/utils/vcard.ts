// src/utils/vcard.ts
/**
 * vCard (vcf) generation utility
 * 
 * Generates vCard format for downloading contact information
 */

import type { Card } from '@/lib/api/types';

export function generateVCard(card: Card): string {
  const lines: string[] = [];

  // vCard header
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');

  // Name
  lines.push(`FN:${escapeVCardValue(card.name)}`);

  // Organization
  if (card.company) {
    lines.push(`ORG:${escapeVCardValue(card.company)}`);
  }

  // Title
  if (card.title) {
    lines.push(`TITLE:${escapeVCardValue(card.title)}`);
  }

  // Phone numbers
  if (card.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(card.phone)}`);
  }

  // WhatsApp (if available in social_links)
  if (card.social_links?.whatsapp) {
    const whatsapp = card.social_links.whatsapp.replace(/[^0-9+]/g, ''); // Extract phone number
    if (whatsapp) {
      lines.push(`TEL;TYPE=CELL;TYPE=VOICE;TYPE=WHATSAPP:${escapeVCardValue(whatsapp)}`);
    }
  }

  // Email
  if (card.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(card.email)}`);
  }

  // Website
  if (card.website) {
    lines.push(`URL:${escapeVCardValue(card.website)}`);
  }

  // Photo
  if (card.photo_url || card.avatar_url) {
    const photoUrl = card.photo_url || card.avatar_url;
    lines.push(`PHOTO;VALUE=URI:${escapeVCardValue(photoUrl!)}`);
  }

  // Note/About
  if (card.about) {
    lines.push(`NOTE:${escapeVCardValue(card.about)}`);
  }

  // Social links as custom fields
  if (card.social_links) {
    if (card.social_links.linkedin) {
      lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escapeVCardValue(card.social_links.linkedin)}`);
    }
    if (card.social_links.twitter) {
      lines.push(`X-SOCIALPROFILE;TYPE=twitter:${escapeVCardValue(card.social_links.twitter)}`);
    }
    if (card.social_links.instagram) {
      lines.push(`X-SOCIALPROFILE;TYPE=instagram:${escapeVCardValue(card.social_links.instagram)}`);
    }
    if (card.social_links.github) {
      lines.push(`X-SOCIALPROFILE;TYPE=github:${escapeVCardValue(card.social_links.github)}`);
    }
  }

  // vCard footer
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Escape special characters in vCard values
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Download vCard file
 */
export function downloadVCard(card: Card, filename?: string): void {
  const vcardContent = generateVCard(card);
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${card.slug || card.name.replace(/\s+/g, '-').toLowerCase()}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate vCard from Lead data
 */
export function generateLeadVCard(lead: { name?: string; email?: string; phone?: string; message?: string }): string {
  const lines: string[] = [];

  // vCard header
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');

  // Name
  if (lead.name) {
    lines.push(`FN:${escapeVCardValue(lead.name)}`);
    // N: Structured name (Family;Given;Middle;Prefix;Suffix)
    // Treat whole name as given name for simplicity
    lines.push(`N:;${escapeVCardValue(lead.name)};;;`);
  } else {
    lines.push('FN:Lead Contact');
    lines.push('N:;Lead Contact;;;');
  }

  // Email
  if (lead.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(lead.email)}`);
  }

  // Phone
  if (lead.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(lead.phone)}`);
  }

  // Note/Message
  if (lead.message) {
    lines.push(`NOTE:${escapeVCardValue(lead.message)}`);
  }

  // vCard footer
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Download lead contact as vCard file
 */
export function downloadLeadVCard(lead: { name?: string; email?: string; phone?: string; message?: string }, filename?: string): void {
  const vcardContent = generateLeadVCard(lead);
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${lead.name?.replace(/\s+/g, '_') || 'lead'}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
