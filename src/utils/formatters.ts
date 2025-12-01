// src/utils/formatters.ts
/**
 * Utility functions for formatting data
 */

import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
    return format(new Date(date), formatStr);
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeDate(date: string | Date): string {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

/**
 * Format date relative with day info
 */
export function formatRelativeWithDate(date: string | Date): string {
    return formatRelative(new Date(date), new Date());
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Format URL for display (remove protocol)
 */
export function formatUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname + urlObj.pathname;
    } catch {
        return url;
    }
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}
