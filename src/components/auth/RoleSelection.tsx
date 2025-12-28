// src/components/auth/RoleSelection.tsx
/**
 * Role Selection Component
 * 
 * Allows users to select their role (Student or Professional)
 * during signup or profile setup.
 */

'use client';

import React, { useState } from 'react';
import { GraduationCap, Briefcase, Check } from 'lucide-react';
import { Button } from '@/components/molecules/Button';
import { getAvailableRoles, type UserRole } from '@/lib/roles';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  selectedRole?: UserRole;
  isLoading?: boolean;
}

export function RoleSelection({ onRoleSelect, selectedRole, isLoading }: RoleSelectionProps) {
  const roles = getAvailableRoles();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h3>
        <p className="text-gray-600">Select the option that best describes you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.id === 'student' ? GraduationCap : Briefcase;

          return (
            <button
              key={role.id}
              onClick={() => !isLoading && onRoleSelect(role.id)}
              disabled={isLoading}
              className={`
                relative p-6 rounded-2xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-neutral-900 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isSelected ? 'bg-neutral-900' : 'bg-gray-100'}
                `}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{role.name}</h4>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

