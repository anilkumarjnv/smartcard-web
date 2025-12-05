// src/components/organisms/RoleBasedCardFields.tsx
/**
 * Role-based Card Fields Component
 * 
 * Renders different card fields based on user role
 */

'use client';

import React from 'react';
import { Building, GraduationCap, Briefcase, Award, BookOpen, Calendar } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Textarea } from '@/components/molecules/Textarea';
import type { RoleConfig } from '@/lib/roles';

interface RoleBasedCardFieldsProps {
  roleConfig: RoleConfig;
  formData: {
    title?: string;
    company?: string;
    school?: string;
    major?: string;
    graduation_year?: string;
    experience?: string;
    skills?: string;
    projects?: string;
    certifications?: string;
    [key: string]: any;
  };
  onChange: (field: string, value: string) => void;
}

export function RoleBasedCardFields({ roleConfig, formData, onChange }: RoleBasedCardFieldsProps) {
  const { cardFields } = roleConfig;
  const isStudent = roleConfig.id === 'student';

  return (
    <>
      {/* Title/Role Field */}
      {cardFields.showTitle && (
        <Input
          name="title"
          placeholder={cardFields.titleLabel}
          value={formData.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          icon={isStudent ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
        />
      )}

      {/* Company/School Field */}
      {cardFields.showCompany && (
        <Input
          name="company"
          placeholder={cardFields.companyLabel}
          value={formData.company || ''}
          onChange={(e) => onChange('company', e.target.value)}
          icon={<Building className="w-5 h-5" />}
        />
      )}

      {/* Student-specific fields */}
      {isStudent && (
        <>
          {cardFields.showSchool && (
            <Input
              name="school"
              placeholder="School/University"
              value={formData.school || ''}
              onChange={(e) => onChange('school', e.target.value)}
              icon={<GraduationCap className="w-5 h-5" />}
            />
          )}
          {cardFields.showMajor && (
            <Input
              name="major"
              placeholder="Major/Field of Study"
              value={formData.major || ''}
              onChange={(e) => onChange('major', e.target.value)}
              icon={<BookOpen className="w-5 h-5" />}
            />
          )}
          {cardFields.showGraduationYear && (
            <Input
              name="graduation_year"
              placeholder="Graduation Year"
              value={formData.graduation_year || ''}
              onChange={(e) => onChange('graduation_year', e.target.value)}
              icon={<Calendar className="w-5 h-5" />}
              type="number"
            />
          )}
          {cardFields.showProjects && (
            <Textarea
              name="projects"
              placeholder="Projects & Achievements (one per line)"
              value={formData.projects || ''}
              onChange={(e) => onChange('projects', e.target.value)}
              rows={4}
            />
          )}
        </>
      )}

      {/* Professional-specific fields */}
      {!isStudent && (
        <>
          {cardFields.showExperience && (
            <Textarea
              name="experience"
              placeholder="Professional Experience"
              value={formData.experience || ''}
              onChange={(e) => onChange('experience', e.target.value)}
              rows={4}
            />
          )}
        </>
      )}

      {/* Common fields */}
      {cardFields.showSkills && (
        <Textarea
          name="skills"
          placeholder="Skills & Expertise (comma-separated)"
          value={formData.skills || ''}
          onChange={(e) => onChange('skills', e.target.value)}
          rows={3}
        />
      )}
      {cardFields.showCertifications && (
        <Textarea
          name="certifications"
          placeholder="Certifications & Awards"
          value={formData.certifications || ''}
          onChange={(e) => onChange('certifications', e.target.value)}
          rows={3}
        />
      )}
    </>
  );
}

