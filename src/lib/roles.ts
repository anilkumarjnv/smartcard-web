// src/lib/roles.ts
/**
 * Role-based system for SmartCard
 * 
 * Defines user roles and their configurations.
 * Scalable structure for future role-based features.
 */

export type UserRole = 'student' | 'professional';

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  icon: string;
  color: string;
  cardFields: CardFieldConfig;
  dashboardConfig: DashboardConfig;
}

export interface CardFieldConfig {
  // Fields to show/hide
  showTitle: boolean;
  showCompany: boolean;
  showSchool?: boolean;
  showMajor?: boolean;
  showGraduationYear?: boolean;
  showExperience?: boolean;
  showSkills?: boolean;
  showProjects?: boolean;
  showCertifications?: boolean;
  // Field labels
  titleLabel: string;
  companyLabel: string;
  // Custom fields
  customFields?: string[];
}

export interface DashboardConfig {
  // Dashboard sections to show
  showAnalytics: boolean;
  showLeads: boolean;
  showProjects?: boolean;
  showAssignments?: boolean;
  // Custom sections
  customSections?: string[];
}

export const roleConfigs: Record<UserRole, RoleConfig> = {
  student: {
    id: 'student',
    name: 'Student',
    description: 'Perfect for students building their academic profile',
    icon: '🎓',
    color: 'blue',
    cardFields: {
      showTitle: true,
      showCompany: false,
      showSchool: true,
      showMajor: true,
      showGraduationYear: true,
      showExperience: false,
      showSkills: true,
      showProjects: true,
      showCertifications: true,
      titleLabel: 'Title/Role',
      companyLabel: 'School/University',
      customFields: ['major', 'graduation_year', 'gpa', 'projects', 'certifications'],
    },
    dashboardConfig: {
      showAnalytics: true,
      showLeads: false,
      showProjects: true,
      showAssignments: true,
      customSections: ['assignments', 'grades', 'achievements'],
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for professionals showcasing their career',
    icon: '💼',
    color: 'indigo',
    cardFields: {
      showTitle: true,
      showCompany: true,
      showSchool: false,
      showMajor: false,
      showGraduationYear: false,
      showExperience: true,
      showSkills: true,
      showProjects: false,
      showCertifications: true,
      titleLabel: 'Job Title',
      companyLabel: 'Company',
      customFields: ['experience', 'industry', 'linkedin', 'portfolio'],
    },
    dashboardConfig: {
      showAnalytics: true,
      showLeads: true,
      showProjects: false,
      showAssignments: false,
      customSections: ['clients', 'testimonials', 'case_studies'],
    },
  },
};

/**
 * Get role configuration
 */
export function getRoleConfig(role?: UserRole | string): RoleConfig {
  if (!role || !(role in roleConfigs)) {
    return roleConfigs.professional; // Default to professional
  }
  return roleConfigs[role as UserRole];
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRole?: UserRole | string, requiredRole: UserRole = 'professional'): boolean {
  return userRole === requiredRole;
}

/**
 * Get available roles for selection
 */
export function getAvailableRoles(): RoleConfig[] {
  return Object.values(roleConfigs);
}

