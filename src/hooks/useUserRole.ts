// src/hooks/useUserRole.ts
/**
 * Hook to get current user's role
 */

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getRoleConfig, type UserRole } from '@/lib/roles';
import type { RoleConfig } from '@/lib/roles';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | undefined>();
  const [roleConfig, setRoleConfig] = useState<RoleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserRole() {
      try {
        const user = await getCurrentUser();
        const userRole = (user?.role as UserRole) || 'professional';
        setRole(userRole);
        setRoleConfig(getRoleConfig(userRole));
      } catch (error) {
        console.error('Error loading user role:', error);
        setRole('professional'); // Default
        setRoleConfig(getRoleConfig('professional'));
      } finally {
        setIsLoading(false);
      }
    }

    loadUserRole();
  }, []);

  return { role, roleConfig, isLoading };
}

