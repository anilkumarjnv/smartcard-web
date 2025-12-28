// src/lib/roleStyles.ts
/**
 * Role-based styling utilities
 * 
 * Provides CSS classes and styling based on user role
 */

import type { UserRole } from './roles';

export function getRoleColorClasses(role?: UserRole | string) {
  const isStudent = role === 'student';

  return {
    primary: 'bg-neutral-900 hover:bg-neutral-800 text-white',
    secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
    border: 'border-neutral-200',
    text: 'text-neutral-900',
    gradient: 'from-neutral-900 to-neutral-800',
    cardHeader: 'bg-gradient-to-br from-neutral-900 to-neutral-800',
  };
}

export function getRoleBadgeClasses(role?: UserRole | string) {
  return 'bg-neutral-100 text-neutral-700 border-neutral-200';
}

