// src/components/dashboard/RoleBasedDashboard.tsx
/**
 * Role-based Dashboard Component
 * 
 * Renders different dashboard sections based on user role
 */

'use client';

import React from 'react';
import { GraduationCap, Briefcase, Award, BookOpen, Users, BarChart3 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { RoleConfig } from '@/lib/roles';

interface RoleBasedDashboardProps {
  roleConfig: RoleConfig;
}

export function RoleBasedDashboard({ roleConfig }: RoleBasedDashboardProps) {
  const { dashboardConfig, id: roleId } = roleConfig;
  const isStudent = roleId === 'student';

  return (
    <div className="space-y-6">
      {/* Role-specific welcome section */}
      <Card className={`border-2 ${isStudent ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-200 bg-neutral-50'}`}>
        <CardBody>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${isStudent ? 'bg-neutral-900' : 'bg-neutral-900'}`}>
              {isStudent ? <GraduationCap className="w-8 h-8 text-white" /> : <Briefcase className="w-8 h-8 text-white" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Welcome, {roleConfig.name}!</h3>
              <p className="text-gray-600">{roleConfig.description}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Role-specific sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardConfig.showAnalytics && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-neutral-900" />
                </div>
                <h4 className="font-semibold">Analytics</h4>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">
                Track your card views and engagement
              </p>
            </CardBody>
          </Card>
        )}

        {dashboardConfig.showLeads && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold">Leads</h4>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">
                Manage contacts from your card
              </p>
            </CardBody>
          </Card>
        )}

        {isStudent && dashboardConfig.showProjects && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold">Projects</h4>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">
                Showcase your academic projects
              </p>
            </CardBody>
          </Card>
        )}

        {isStudent && dashboardConfig.showAssignments && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <h4 className="font-semibold">Assignments</h4>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">
                Track your assignments and grades
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

