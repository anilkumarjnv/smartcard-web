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
    primary: isStudent 
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: isStudent
      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    border: isStudent
      ? 'border-blue-200'
      : 'border-indigo-200',
    text: isStudent
      ? 'text-blue-600'
      : 'text-indigo-600',
    gradient: isStudent
      ? 'from-blue-600 to-blue-800'
      : 'from-indigo-600 to-purple-600',
    cardHeader: isStudent
      ? 'bg-gradient-to-br from-blue-600 to-blue-800'
      : 'bg-gradient-to-br from-indigo-600 to-purple-600',
  };
}

export function getRoleBadgeClasses(role?: UserRole | string) {
  const isStudent = role === 'student';
  
  return isStudent
    ? 'bg-blue-100 text-blue-700 border-blue-200'
    : 'bg-indigo-100 text-indigo-700 border-indigo-200';
}

